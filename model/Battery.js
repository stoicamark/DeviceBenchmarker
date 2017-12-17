"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = require("../model/Event");
require('console.table');
var Battery = (function () {
    function Battery(client) {
        this.OLDTChanged = new Event_1.Event();
        this.ChargingChanged = new Event_1.Event();
        this.capacities = [4150, 4000, 3930, 3750, 3520,
            3505, 3300, 3230, 3090, 3000, 2900, 2730, 2716, 2700, 2675, 1960, 1821];
        this.bitrateToJoulesPerSec = (_a = {},
            _a[0] = 0,
            _a[25] = 0.6,
            _a[50] = 0.65,
            _a[75] = 0.75,
            _a[100] = 0.8,
            _a[125] = 0.95,
            _a[150] = 1.05,
            _a[175] = 1.15,
            _a[200] = 1.2,
            _a[225] = 1.24,
            _a[250] = 1.25,
            _a);
        this._avgLevelDropTimeInSeconds = 180;
        this._initialTimeStamp = Date.now();
        if (client === undefined) {
            this.subscribeForWebAPI();
        }
        else {
            this.Client = client;
        }
        var _a;
    }
    Battery.prototype.joulesToMiliamps = function (joules) {
        var volts = 5;
        return joules / (volts * 3.6);
    };
    Battery.prototype.getMiliampsFromBitrate = function (bitrate) {
        var nearestMultiple = Math.floor(bitrate / 25) * 25;
        var joules = 0;
        if (bitrate <= 250) {
            joules = this.bitrateToJoulesPerSec[nearestMultiple];
        }
        else {
            joules = (bitrate * 5) / 1000;
        }
        return this.joulesToMiliamps(joules);
    };
    Battery.prototype.subscribeForWebAPI = function () {
        var _this = this;
        if (!this.isFunction(navigator.getBattery)) {
            console.log("The browser doesn't supports the battery interface (navigator.getBattery())");
            return;
        }
        navigator.getBattery().then(function (battery) {
            _this.initWithAllInfos(battery);
            battery.onchargingchange = function () { _this.updateChargeInfo(battery); };
            battery.onlevelchange = function () { _this.updateLevelInfo(battery); };
            battery.ondischargingtimechange = function () { _this.updateDischargingInfo(battery); };
        });
    };
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
        if (this.level !== undefined) {
            this.ChargingChanged.trigger(this._isCharging);
        }
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
    Object.defineProperty(Battery.prototype, "dischargingTimeInSeconds", {
        get: function () {
            return this._dischargingTimeInSeconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battery.prototype, "Client", {
        get: function () {
            return this._client;
        },
        set: function (value) {
            this._client = value;
            this.ChargingChanged.allOff();
            this._capacity = this.capacities[Math.floor(Math.random() * this.capacities.length)];
            this.reset();
        },
        enumerable: true,
        configurable: true
    });
    Battery.prototype.maintainBatteryInfos = function (dt) {
        if (!this.Client) {
            return;
        }
        this.numOfMaintenance++;
        var bitrate = Math.floor(this.Client.getDownloadSpeed() + this.Client.getUploadSpeed());
        var energyConsumedInOneSec = this.getMiliampsFromBitrate(bitrate);
        var energyConsumed = energyConsumedInOneSec * dt;
        this._actualCapacity -= Math.floor(energyConsumed);
        this._level = Math.floor((this._actualCapacity / this._capacity) * 100) / 100;
        var drainedPercentage = energyConsumed / this._capacity;
        var oldt = undefined;
        if (drainedPercentage > 0) {
            oldt = Math.floor(dt / (drainedPercentage * 100));
            this.sumOLDT += oldt;
            this.OLDTChanged.trigger(oldt);
            var avgOLDT = this.sumOLDT / this.numOfMaintenance;
            this._dischargingTimeInSeconds = Math.floor(avgOLDT * this._level * 100);
        }
        var peerInfo = {
            property: "peerId",
            value: this.Client.getPeerId()
        };
        var capacityInfo = {
            property: "capacity",
            value: this._actualCapacity + "/" + this._capacity + "(MAh)"
        };
        var downloadInfo = {
            property: "download",
            value: this.Client.getDownloadSpeed() + "(KBps)"
        };
        var uploadInfo = {
            property: "upload",
            value: this.Client.getUploadSpeed() + "(KBps)"
        };
        var levelInfo = {
            property: "level",
            value: Math.floor(this._level * 100) + "(%)"
        };
        var dischargingTimeInfo = {
            property: "discharging time",
            value: this._dischargingTimeInSeconds + "(s)"
        };
        var OLDTInfo = {
            property: "OLDT",
            value: oldt + "(s/%)"
        };
        var tableInfo = [peerInfo, capacityInfo, downloadInfo, uploadInfo, levelInfo, dischargingTimeInfo, OLDTInfo];
        console.table(tableInfo);
    };
    Battery.prototype.reset = function () {
        this._actualCapacity = this._capacity;
        this._level = 1;
        this._isCharging = false;
        this.sumOLDT = 0;
        this.numOfMaintenance = 0;
        this._dischargingTimeInSeconds = 70000;
    };
    Object.defineProperty(Battery.prototype, "Capacity", {
        get: function () {
            return this._capacity;
        },
        enumerable: true,
        configurable: true
    });
    Battery.prototype.isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };
    return Battery;
}());
exports.Battery = Battery;
