"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIDController = (function () {
    function PIDController(options) {
        this.k_d = options.k_d;
        this.k_i = options.k_i;
        this.k_p = options.k_p;
        if (options.dt) {
            this.dt = options.dt;
        }
        if (options.i_max) {
            this.i_max = options.i_max;
        }
        this.dt = this.dt || 0;
        this.i_max = this.i_max || 0;
        this.sumError = 0;
        this.lastError = 0;
        this.lastTime = 0;
        this.target = 0;
    }
    PIDController.prototype.setTarget = function (target) {
        this.target = target;
    };
    PIDController.prototype.update = function (currentValue) {
        this.currentValue = currentValue;
        if (!this.dt) {
            var currentTime = Date.now();
            if (this.lastTime === 0) {
                this.dt = 0;
            }
            else {
                this.dt = (currentTime - this.lastTime) / 1000;
            }
            this.lastTime = currentTime;
        }
        var error = (this.target - this.currentValue);
        this.sumError = this.sumError + error * this.dt;
        if (this.i_max > 0 && Math.abs(this.sumError) > this.i_max) {
            var sumSign = (this.sumError > 0) ? 1 : -1;
            this.sumError = sumSign * this.i_max;
        }
        var dError = (error - this.lastError) / this.dt;
        this.lastError = error;
        return (this.k_p * error) + (this.k_i * this.sumError) + (this.k_d * dError);
    };
    PIDController.prototype.setSampling = function (sampling) {
        this.dt = sampling;
    };
    PIDController.prototype.reset = function () {
        this.sumError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    };
    return PIDController;
}());
exports.PIDController = PIDController;
