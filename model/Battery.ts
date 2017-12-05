/**
 * Created by Habanero on 2017. 10. 06..
 */

import {Event} from "../model/Event"
declare let navigator : {getBattery: any}

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
    
    public OLDTChanged: Event<number> = new Event()
    public ChargingChanged: Event<boolean> = new Event()
    private _levelDropTimeInSeconds : number
    private _avgLevelDropTimeInSeconds: number
    private _isCharging : boolean
    private _level : number
    private _chargingTimeInSeconds : number
    private _dischargingTimeInSeconds : number
    private _initialTimeStamp : number
    private _initialBatteryLevel : number

    constructor(){
        this._level = 1
        this._avgLevelDropTimeInSeconds = 180 // one level drop in 3 minutes
        this._initialTimeStamp = Date.now()

        navigator.getBattery().then((battery: BatteryManager) => {
            this.initWithAllInfos(battery)
            battery.onchargingchange = () => {this.updateChargeInfo(battery)}
            battery.onlevelchange = () => {this.updateLevelInfo(battery)}
            battery.ondischargingtimechange = () => {this.updateDischargingInfo(battery)}
        })
    }

    private initWithAllInfos(battery: BatteryManager){
        this.updateChargeInfo(battery)
        this.updateLevelInfo(battery)
        this.updateDischargingInfo(battery)
    }

    private updateDischargingInfo(battery: BatteryManager){
        this._dischargingTimeInSeconds = battery.dischargingTime
        console.log("Battery discharging time: " + battery.dischargingTime + " seconds")
    }

    private updateLevelInfo(battery: BatteryManager){
        this._level = battery.level

        let actualTimeStamp = Date.now()
        let dTime = actualTimeStamp - this._initialTimeStamp
        this._initialTimeStamp = actualTimeStamp

        if(this._levelDropTimeInSeconds === undefined){
            this._levelDropTimeInSeconds = this._avgLevelDropTimeInSeconds
        }else{
            this._levelDropTimeInSeconds = dTime / 1000 
            this._levelDropTimeInSeconds = this._isCharging ? Infinity : this._levelDropTimeInSeconds
            this.OLDTChanged.trigger(this._levelDropTimeInSeconds)
        } 
        console.log("Battery level: " + battery.level * 100 + " %")
    }

    private updateChargeInfo(battery: BatteryManager){
        this._isCharging = battery.charging
        this.ChargingChanged.trigger(this._isCharging)
        console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
    } 

    get levelDropTimeInSeconds(): number {
        return this._levelDropTimeInSeconds
    }

    get isCharging(): boolean {
        return this._isCharging
    }

    get level(): number {
        return this._level
    }

    get chargingTimeInSeconds(): number {
        return this._chargingTimeInSeconds
    }

    get dischargingTimeInSeconds(): number {
        return this._dischargingTimeInSeconds
    }
}