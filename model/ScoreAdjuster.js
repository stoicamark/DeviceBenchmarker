"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = require("./Device");
var PIDController_1 = require("./PIDController");
var ScoreAdjuster = (function () {
    function ScoreAdjuster(device) {
        this._adjustment = 0;
        this._device = device;
        this._maxAdjustment = 200;
        this._targetBatteryLevelDropTime = 240;
        this._ctr = new PIDController_1.PIDController({
            k_p: 0.25,
            k_i: 0.01,
            k_d: 0.2,
            i_max: this._maxAdjustment
        });
        this._ctr.setTarget(this._targetBatteryLevelDropTime);
        this._device.battery.OLDTChanged.on(this);
    }
    ScoreAdjuster.prototype.dataAvailable = function (measuredLevelDropTime) {
        if (measuredLevelDropTime === Infinity) {
            this._adjustment = 1;
            this._ctr.reset();
            console.log("Measured battery level drop time: " +
                measuredLevelDropTime + "(sec) | Adjustment: " + this._adjustment);
            return;
        }
        var output = this._ctr.update(measuredLevelDropTime);
        var sign = output < 0 ? -1 : 1;
        if (Math.abs(output) > this._maxAdjustment) {
            output = sign * this._maxAdjustment;
        }
        this._adjustment = -output / this._maxAdjustment;
        console.log("Measured battery level drop time: " +
            measuredLevelDropTime + "(sec) | Adjustment: " + this._adjustment);
    };
    Object.defineProperty(ScoreAdjuster.prototype, "adjustment", {
        get: function () {
            return this._adjustment;
        },
        enumerable: true,
        configurable: true
    });
    return ScoreAdjuster;
}());
exports.ScoreAdjuster = ScoreAdjuster;
new ScoreAdjuster(new Device_1.Device());
