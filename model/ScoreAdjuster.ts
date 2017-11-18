/**
 * Created by Habanero on 2017. 10. 06..
 */

import {Device} from "./Device";
import {IBatteryListener} from "./Battery";
import {PIDController} from "./PIDController";
declare function require(name:string) : any;

export class ScoreAdjuster implements IBatteryListener{
    private _device : Device;
    private _targetBatteryLevelDropTime: number;
    private _adjustment: number;
    private _maxAdjustment: number;
    private _batteryLevelDropTimeOffset: number;
    public _ctr: PIDController;

    constructor(device: Device){
        this._adjustment = 0;
        this._device = device;
        this._maxAdjustment = 200;
        this._targetBatteryLevelDropTime = 240; // 1 level drop in 4 minutes
        
        this._ctr = new PIDController({
          k_p: 0.25,
          k_i: 0.01,
          k_d: 0.2,
          i_max: this._maxAdjustment
        });
    
        this._ctr.setTarget(this._targetBatteryLevelDropTime);
        
        if(this._device.battery) {
            this._device.battery.on(this);
        }
    }

    onLevelDropTimeChanged(measuredLevelDropTime: number): void {
        let output = this._ctr.update(measuredLevelDropTime);
        let sign = output < 0 ? -1 : 1;

        if (Math.abs(output) > this._maxAdjustment){
            output = sign * this._maxAdjustment;
        }

        //  normalize [-1, 1], and negate
        this._adjustment = -output / this._maxAdjustment;

        console.log("Measured battery level drop time: " + 
            measuredLevelDropTime + "(sec) | Adjustment: " + this._adjustment);
    }

    get adjustment(): number{
        return this._adjustment;
    }
}

new ScoreAdjuster(new Device());