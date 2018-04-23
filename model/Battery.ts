/**
 * Created by Habanero on 2017. 10. 06..
 */

import {Event} from "./Event";
import { BenchmarkerClient } from "./ScoreComputer";
declare let navigator : {getBattery: any};

declare function require(name:string) : any;
require('console.table');

interface BatteryManager{
    level: number,
    dischargingTime: number,
    charging: boolean,
    chargingTime?: number,
    onchargingchange(): void,
    onlevelchange(): void,
    ondischargingtimechange(): void
}

export class Battery{
    
    public OLDTChanged: Event<number> = new Event();
    public ChargingChanged: Event<boolean> = new Event();
    private _levelDropTimeInSeconds : number;
    private _avgLevelDropTimeInSeconds: number;
    private _isCharging : boolean;
    private _level : number;
    private _dischargingTimeInSeconds : number;
    private _initialTimeStamp : number;
    private _initialBatteryLevel : number;

    private _client?: BenchmarkerClient;
    private _capacity?: number;
    private _actualCapacity?: number;

    // kiloByte per ses to Joules per s
    private bitrateToJoulesPerSec: {[keyBitrate : number]: number } = {
        [0]:0,
        [25]:0.6,
        [50]:0.65,
        [75]:0.75,
        [100]:0.8,
        [125]:0.95,
        [150]:1.05,
        [175]:1.15,
        [200]:1.2,
        [225]:1.24,
        [250]:1.25,
    };

    private static joulesToMiliamps(joules: number){
        let volts = 5;
        return joules / (volts * 3.6); //mAh * volts * 3.6 = J
    }

    private getMiliampsFromBitrate(bitrate: number) : number{
        //nearest multiple of 25kBps
        let nearestMultiple = Math.floor(bitrate / 25) * 25;
        let joules = 0;
        if(bitrate <= 250){
            joules = this.bitrateToJoulesPerSec[nearestMultiple];
        }else{
            //from a given bitrate the consumed energy per MB is constant = 5 <J/MB>
            joules = (bitrate * 5) / 1000;
        }
        return Battery.joulesToMiliamps(joules);
    }

    constructor(client?: BenchmarkerClient){
        this._avgLevelDropTimeInSeconds = 180; // one level drop in 3 minutes
        this._initialTimeStamp = Date.now();

        if(client === undefined){
            this.subscribeForWebAPI();
        }else{
            this.Client = client;
        }
    }

    private subscribeForWebAPI(){
        if(!Battery.isFunction(navigator.getBattery)){
            console.log("The browser doesn't supports the battery interface (navigator.getBattery())");
            return;
        }
        navigator.getBattery().then((battery: BatteryManager) => {
            this.initWithAllInfos(battery);
            battery.onchargingchange = () => {this.updateChargeInfo(battery)};
            battery.onlevelchange = () => {this.updateLevelInfo(battery)};
            battery.ondischargingtimechange = () => {this.updateDischargingInfo(battery)};
        })
    }
/*
    private unSubscribeFromWebAPI(){
        this.OLDTChanged.allOff()
        this.ChargingChanged.allOff()

        if(!this.isFunction(navigator.getBattery)){
            return
        }
        navigator.getBattery().then((battery: BatteryManager) => {
            battery.onchargingchange = null
            battery.onlevelchange = null
            battery.ondischargingtimechange = null
            console.log("unsubscribed from Web API")
        })
    }*/

    private initWithAllInfos(battery: BatteryManager){
        this.updateChargeInfo(battery);
        this.updateLevelInfo(battery);
        this.updateDischargingInfo(battery);
    }

    private updateDischargingInfo(battery: BatteryManager){
        this._dischargingTimeInSeconds = battery.dischargingTime;
        console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
    }

    private updateLevelInfo(battery: BatteryManager){
        this._level = battery.level;

        let actualTimeStamp = Date.now();
        let dTime = actualTimeStamp - this._initialTimeStamp;
        this._initialTimeStamp = actualTimeStamp;

        if(this._levelDropTimeInSeconds === undefined){
            this._levelDropTimeInSeconds = this._avgLevelDropTimeInSeconds;
        }else{
            this._levelDropTimeInSeconds = dTime / 1000 ;
            this._levelDropTimeInSeconds = this._isCharging ? Infinity : this._levelDropTimeInSeconds;
            this.OLDTChanged.trigger(this._levelDropTimeInSeconds);
        } 
        console.log("Battery level: " + battery.level * 100 + " %");
    }

    private updateChargeInfo(battery: BatteryManager){
        this._isCharging = battery.charging;
        if(this.level !== undefined){
            this.ChargingChanged.trigger(this._isCharging);
        }
        console.log("Battery charging? " + (battery.charging ? "Yes" : "No"));
    } 

    get levelDropTimeInSeconds(): number {
        return this._levelDropTimeInSeconds;
    }

    get isCharging(): boolean {
        return this._isCharging;
    }

    get level(): number {
        return this._level;
    }

    get dischargingTimeInSeconds(): number {
        return this._dischargingTimeInSeconds;
    }

    get Client(): BenchmarkerClient{
        return this._client;
    }

    set Client(value: BenchmarkerClient){
        this._client = value;
        this.ChargingChanged.allOff();
        this._capacity = this._client.getPeerFullCapacity();
        this.reset();
    }

    private numOfMaintenance: number;
    private sumOLDT: number;

    public maintainBatteryInfos(dt: number){
        if(!this.Client){
            return
        }
        this.numOfMaintenance++;

        let bitrate = Math.floor(this.Client.getDownloadSpeed() + this.Client.getUploadSpeed());
        
        let energyConsumedInOneSec = this.getMiliampsFromBitrate(bitrate);
        let energyConsumed = energyConsumedInOneSec * dt;
        
        this._actualCapacity -= Math.floor(energyConsumed);
        this._level = Math.floor((this._actualCapacity / this._capacity) * 100) / 100;
        
        let drainedPercentage = energyConsumed / this._capacity;
        
        let oldt = undefined;
        
        if(drainedPercentage > 0){
            oldt = Math.floor(dt / (drainedPercentage * 100));
            this.sumOLDT += oldt;
            this.OLDTChanged.trigger(oldt);
            let avgOLDT = this.sumOLDT / this.numOfMaintenance;
            this._dischargingTimeInSeconds = Math.floor(avgOLDT * this._level * 100);
        }

        let peerInfo = {
            property: "peerId",
            value: this.Client.getPeerId()
        };

        let capacityInfo = {
            property: "capacity",
            value: this._actualCapacity + "/" + this._capacity + "(MAh)"
        };

        let downloadInfo = {
            property: "download",
            value: this.Client.getDownloadSpeed() + "(KBps)"
        };

        let uploadInfo = {
            property: "upload",
            value: this.Client.getUploadSpeed() + "(KBps)"
        };

        let levelInfo = {
            property: "level",
            value: Math.floor(this._level * 100) + "(%)"
        };

        let dischargingTimeInfo = {
            property: "discharging time",
            value: this._dischargingTimeInSeconds + "(s)"
        };

        let OLDTInfo = {
            property: "OLDT",
            value: oldt + "(s/%)"
        };

        let tableInfo = [peerInfo, capacityInfo, downloadInfo, uploadInfo, levelInfo, dischargingTimeInfo, OLDTInfo];
        console.table(tableInfo);
    }

    reset(){
        this._actualCapacity = this._capacity;
        this._level = 1;
        this._isCharging = false;
        this.sumOLDT = 0;
        this.numOfMaintenance = 0;
        this._dischargingTimeInSeconds = 70000;
    }

    get Capacity(): number{
        return this._capacity;
    }

    private static isFunction(functionToCheck: any) {
        const getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
}