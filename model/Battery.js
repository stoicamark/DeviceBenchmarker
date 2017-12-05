"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = require("../model/Event");
var Battery = (function () {
    function Battery() {
        var _this = this;
        this.OLDTChanged = new Event_1.Event();
        this.ChargingChanged = new Event_1.Event();
        this._level = 1;
        this._avgLevelDropTimeInSeconds = 180;
        this._initialTimeStamp = Date.now();
        navigator.getBattery().then(function (battery) {
            _this.initWithAllInfos(battery);
            battery.onchargingchange = function () { _this.updateChargeInfo(battery); };
            battery.onlevelchange = function () { _this.updateLevelInfo(battery); };
            battery.ondischargingtimechange = function () { _this.updateDischargingInfo(battery); };
        });
    }
    Battery.prototype.initWithAllInfos = function (battery) {
        this.updateChargeInfo(battery);
        this.updateLevelInfo(battery);
        this.updateDischargingInfo(battery);
    };
    Battery.prototype.updateDischargingInfo = function (battery) {
        this._dischargingTimeInSeconds = battery.dischargingTime;
        console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
    };
    Battery.prototype.updateLevelInfo = function (battery) {
        this._level = battery.level;
        var actualTimeStamp = Date.now();
        var dTime = actualTimeStamp - this._initialTimeStamp;
        this._initialTimeStamp = actualTimeStamp;
        if (this._levelDropTimeInSeconds === undefined) {
            this._levelDropTimeInSeconds = this._avgLevelDropTimeInSeconds;
        }
        else {
            this._levelDropTimeInSeconds = dTime / 1000;
            this._levelDropTimeInSeconds = this._isCharging ? Infinity : this._levelDropTimeInSeconds;
            this.OLDTChanged.trigger(this._levelDropTimeInSeconds);
        }
        console.log("Battery level: " + battery.level * 100 + " %");
    };
    Battery.prototype.updateChargeInfo = function (battery) {
        this._isCharging = battery.charging;
        this.ChargingChanged.trigger(this._isCharging);
        console.log("Battery charging? " + (battery.charging ? "Yes" : "No"));
    };
    Object.defineProperty(Battery.prototype, "levelDropTimeInSeconds", {
        get: function () {
            return this._levelDropTimeInSeconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battery.prototype, "isCharging", {
        get: function () {
            return this._isCharging;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battery.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battery.prototype, "chargingTimeInSeconds", {
        get: function () {
            return this._chargingTimeInSeconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battery.prototype, "dischargingTimeInSeconds", {
        get: function () {
            return this._dischargingTimeInSeconds;
        },
        enumerable: true,
        configurable: true
    });
    return Battery;
}());
exports.Battery = Battery;
