/**
 * Created by Habanero on 2017. 10. 06..
 */

import { PIDController } from "./PIDController"
import { Subscriber } from "./Event";
import { Battery } from "./Battery";
declare function require(name:string) : any

export class ScoreAdjuster implements Subscriber<number>{
    private _battery: Battery
    private _targetBatteryLevelDropTime: number
    private _adjustment: number
    private _maxAdjustment: number
    private _batteryLevelDropTimeOffset: number
    public _ctr: PIDController

    constructor(battery: Battery){
        this._adjustment = 1
        this._battery = battery
        this._maxAdjustment = 500
        this._targetBatteryLevelDropTime = 180 // 1 level drop in 5 minutes
        
        this._ctr = new PIDController({
          k_p: 0.8,
          k_i: 0.5,
          k_d: 0.3,
          i_max: this._maxAdjustment
        })
    
        this._ctr.setTarget(this._targetBatteryLevelDropTime)
        
        this._battery.OLDTChanged.on(this)
    }

    dataAvailable(measuredLevelDropTime: number): void {

        if(measuredLevelDropTime === Infinity){
            this._adjustment = 1
            this._ctr.reset()

            console.log("Measured battery level drop time: " + 
            measuredLevelDropTime + "(sec) | Adjustment: " + this._adjustment)

            return
        }

        let output = this._ctr.update(measuredLevelDropTime)
        
        let dOutput = output / this._maxAdjustment
        let sign = output < 0 ? -1 : 1
        let nAdjustment = Math.abs(dOutput) < 1 ? dOutput : sign
        this._adjustment = this.normalize(-nAdjustment, -1, 1)

        console.log("Measured battery level drop time: " + 
            measuredLevelDropTime + "(sec) | Adjustment: " + this._adjustment)
    }

    private normalize(data: number, dataMin: number, dataMax: number) : number{
        return (data - dataMin) / (dataMax - dataMin)
    }

    get adjustment(): number{
        return this._adjustment
    }
}