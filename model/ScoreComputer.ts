/**
 * Created by Habanero on 2017. 10. 05..
 */

import {Device} from "./Device";
import {ScoreAdjuster} from "./ScoreAdjuster";
import {ConnectionType} from "./Network";

declare function require(name:string) : any;

export enum weights{
    batteryLevel = 0.1,
    batetryChargingTime = 0.2,
    batteryDischargingTime = 0.3,
    connectionType = 0.3,
    downloadSpeed = 0.15,
    uploadSpeed = 0.15,
    adjustment = 0.1
}

export class ScoreComputer {
    private _device : Device;
    private _scoreAdjuster : ScoreAdjuster;

    constructor(){
        this._device = new Device();
        this._scoreAdjuster = new ScoreAdjuster(this._device);
    }

    public start(){
        let battery = this._device.battery;
        let network = this._device.network;

        setInterval(()=>{
            
            if(network.type === ConnectionType.cellular ||
                (battery.level < 0.15 && battery.isCharging === false)){
                    this._device.actualScore = 0;
                    return;
                }
            
            let score = 0;
            score += battery.level * weights.batteryLevel;

            switch(network.type){
                case ConnectionType.ethernet: score += weights.connectionType; break;
                case ConnectionType.wifi: score += weights.connectionType; break;
                default: break;
            }   

            let dSpeedScore = (network.downlink / network.downlinkLimit);
            let uSpeedScore = (network.uplink / network.uplinkLimit);

            dSpeedScore = dSpeedScore < 1 ? dSpeedScore : 1;
            uSpeedScore = uSpeedScore < 1 ? uSpeedScore : 1;

            score += dSpeedScore * weights.downloadSpeed;
            score += uSpeedScore * weights.uploadSpeed;

            score += this._scoreAdjuster.adjustment * weights.adjustment;

            console.log("Device score: " + score);

        }, 10000);
    }

    public getascore() : number{
        return this._device.actualScore;
    }
}

new ScoreComputer().start();
