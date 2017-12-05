/**
 * Created by Habanero on 2017. 10. 05..
 */

import {Device} from "./Device"
import {ScoreAdjuster} from "./ScoreAdjuster"
import {ConnectionType} from "./Network"
import {Event, Subscriber} from "./Event"

declare function require(name:string) : any
require('console.table')

export enum weights{
    batteryLevel = 0.2,
    batteryChargingTime = 0.2,
    batteryDischargingTime = 0.2,
    downloadSpeed = 0.15,
    uploadSpeed = 0.15,
    adjustment = 0.3
}

export class ScoreComputer implements Subscriber<boolean>{
    
    private _device : Device
    private _actualScore : number
    public _scoreAdjuster : ScoreAdjuster

    public readonly _uplinkLimit : number
    public readonly _downlinkLimit : number
    public readonly _dischargingTimeLimit: number

    public ScoreComputed: Event<number> = new Event()

    constructor(device?: Device){

        this._device = device === undefined ? new Device() : device
        
        this._device.battery.ChargingChanged.on(this)

        this._scoreAdjuster = new ScoreAdjuster(this._device)

        this._actualScore = 1

        this._downlinkLimit = 2.5 // maximum score coefficient if the downlink reaches >= 25 Mbps
        this._uplinkLimit = 1 // maximum score coefficient if the uplink reaches >= 10 Mbps

        this._dischargingTimeLimit = 7200 // maximum score coefficient if the discharging time >= two hour
    }

    

    public start(){
        setInterval(()=>{
            this.compute()
        }, 60000)
    }

    dataAvailable(batteryChargingInfo: boolean): void {
        this.compute()
    }

    public subscribe( subscriber: Subscriber<number>) : void{
        this.ScoreComputed.on(subscriber)
    }

    public compute(): void{
        
        let battery = this._device.battery
        let network = this._device.network
                    
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
}

new ScoreComputer().start()
