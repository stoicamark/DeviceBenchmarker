"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIDController_1 = require("./PIDController");
var ScoreAdjuster = (function () {
    function ScoreAdjuster(battery) {
        this._adjustment = 1;
        this._battery = battery;
        this._maxAdjustment = 500;
        this._targetBatteryLevelDropTime = 180;
        this._ctr = new PIDController_1.PIDController({
            k_p: 0.8,
            k_i: 0.5,
            k_d: 0.3,
            i_max: this._maxAdjustment
        });
        this._ctr.setTarget(this._targetBatteryLevelDropTime);
        this._battery.OLDTChanged.on(this);
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
        var dOutput = output / this._maxAdjustment;
        var sign = output < 0 ? -1 : 1;
        var nAdjustment = Math.abs(dOutput) < 1 ? dOutput : sign;
        this._adjustment = this.normalize(-nAdjustment, -1, 1);
        console.log("Measured battery level drop time: " +
            measuredLevelDropTime + "(sec) | Adjustment: " + this._adjustment);
    };
    ScoreAdjuster.prototype.normalize = function (data, dataMin, dataMax) {
        return (data - dataMin) / (dataMax - dataMin);
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
