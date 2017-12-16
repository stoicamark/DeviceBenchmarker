/**
 * Created by Habanero on 2017. 10. 05..
 */
import {ScoreAdjuster} from "./ScoreAdjuster"
import {ConnectionType, Network} from "./Network"
import {Event, Subscriber} from "./Event"
import { Battery } from "./Battery";

declare function require(name:string) : any
require('console.table')

export enum weights{
    batteryLevel = 0.3,
    batteryDischargingTime = 0.3,
    downloadSpeed = 0.15,
    uploadSpeed = 0.15,
    adjustment = 0.10
}

export interface BenchmarkerClient extends Subscriber<number>{
    getDownloadSpeed():number
    getUploadSpeed():number
    getBandwidth():number
    getPeerId():String
}

export class ScoreComputer implements Subscriber<boolean>{
    
    private _network : Network
    private _battery : Battery
    private _actualScore : number
    public _scoreAdjuster : ScoreAdjuster

    _uplinkLimit : number
    _downlinkLimit : number
    _dischargingTimeLimit: number

    public ScoreComputed: Event<number> = new Event()

    constructor(battery?: Battery, network?: Network){

        this._battery = battery === undefined ? new Battery() : battery
        this._network = network === undefined ? new Network() : network
        
        this._battery.ChargingChanged.on(this)

        this._scoreAdjuster = new ScoreAdjuster(this._battery)

        this._actualScore = 1

        this._downlinkLimit = 2.5 // maximum score coefficient if the downlink reaches >= 25 Mbps
        this._uplinkLimit = 1 // maximum score coefficient if the uplink reaches >= 10 Mbps
        this._dischargingTimeLimit = 7200 // maximum score coefficient if the discharging time >= two hour
    }

    public start(){
        setInterval(()=>{
            this.compute()
        }, 10000)
    }

    dataAvailable(batteryChargingInfo: boolean): void {
        this.compute()
    }

    public subscribe( client: BenchmarkerClient) : void{
        if(this._network.Client === undefined){
            this._network.Client = client
        }
        if(this._battery.Client === undefined){
            this._battery.Client = client
        }
        this.ScoreComputed.on(client)
    }

    public unsubscribe(client: BenchmarkerClient): void{
        this._network.Client = undefined
        this.ScoreComputed.off(client)
    }

    public compute(): void{

        let battery = this.Battery
        let network = this.Network
                    
        if(network.type === ConnectionType.cellular || 
          (battery.level < 0.15 && !battery.isCharging)){
            this._actualScore = 0
            this.ScoreComputed.trigger(this._actualScore)
            console.log("Network type: Cellular.")
            console.log("OR")
            console.log("Battery level is under 15% AND device is not charging.")
            console.log("------(SCORE = 0)------")
            return
        }
        
        if((network.type === ConnectionType.wifi || 
            network.type === ConnectionType.ethernet) &&
            battery.isCharging){

            this._actualScore = 1
            this.ScoreComputed.trigger(this._actualScore)

            console.log("Network type: WIFI OR ETHERNET.")
            console.log("AND")
            console.log("Device is charging.")
            console.log("------(SCORE = 1)------")
            return
        }
                    
        let score = 0
        let infoTable = []
        
        score += battery.level * weights.batteryLevel
        
        let levelInfo = { 
            property: "battery level",
            value: battery.level,
            weigth: weights.batteryLevel,
            scoreTag: battery.level * weights.batteryLevel
        }

        infoTable.push(levelInfo)
        
        let dischargingTimeScore = battery.dischargingTimeInSeconds / this._dischargingTimeLimit
        dischargingTimeScore = dischargingTimeScore < 1 ? dischargingTimeScore : 1
        score += dischargingTimeScore * weights.batteryDischargingTime
            
        let dischargeInfo = { 
            property: "discharging time score",
            value: dischargingTimeScore,
            weigth: weights.batteryDischargingTime,
            scoreTag: dischargingTimeScore * weights.batteryDischargingTime
        }
        infoTable.push(dischargeInfo)

        let dSpeedScore = (network.downlink / this._downlinkLimit)
        let uSpeedScore = (network.uplink / this._uplinkLimit)
        
        dSpeedScore = dSpeedScore < 1 ? dSpeedScore : 1
        uSpeedScore = uSpeedScore < 1 ? uSpeedScore : 1
        
        score += dSpeedScore * weights.downloadSpeed
        score += uSpeedScore * weights.uploadSpeed
        score += this._scoreAdjuster.adjustment * weights.adjustment

        score = score < 0 ? 0 : score
        
        this._actualScore = score
        this.ScoreComputed.trigger(score)

        let downlinkInfo = { 
            property: "downlink",
            value: dSpeedScore,
            weigth: weights.downloadSpeed,
            scoreTag: dSpeedScore * weights.downloadSpeed
        }

        let uplinkInfo = { 
            property: "uplink",
            value: uSpeedScore,
            weigth: weights.uploadSpeed,
            scoreTag: uSpeedScore * weights.uploadSpeed
        }
            
        let adjusterInfo = { 
            property: "adjustment",
            value: this._scoreAdjuster.adjustment,
            weigth: weights.adjustment,
            scoreTag: this._scoreAdjuster.adjustment * weights.adjustment
        }

        let scoreInfo = {
            property: "TOTAL SCORE",
            value: "----",
            weigth: "----",
            scoreTag: score
        }

        infoTable.push(downlinkInfo, uplinkInfo, adjusterInfo, scoreInfo)
        console.table(infoTable)
    }

    public get ActualScore() : number{
        return this._actualScore
    }

    public get Battery() : Battery{
        if(this.ScoreComputed.hasListener){
            this._battery.maintainBatteryInfos(10)
        }
        return this._battery
    }

    public get Network(): Network{
        return this._network
    }
}