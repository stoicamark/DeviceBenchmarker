"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = require("./Device");
var ScoreAdjuster_1 = require("./ScoreAdjuster");
var Network_1 = require("./Network");
var Event_1 = require("./Event");
require('console.table');
var weights;
(function (weights) {
    weights[weights["batteryLevel"] = 0.2] = "batteryLevel";
    weights[weights["batteryChargingTime"] = 0.2] = "batteryChargingTime";
    weights[weights["batteryDischargingTime"] = 0.2] = "batteryDischargingTime";
    weights[weights["downloadSpeed"] = 0.15] = "downloadSpeed";
    weights[weights["uploadSpeed"] = 0.15] = "uploadSpeed";
    weights[weights["adjustment"] = 0.3] = "adjustment";
})(weights = exports.weights || (exports.weights = {}));
var ScoreComputer = (function () {
    function ScoreComputer(device) {
        this.ScoreComputed = new Event_1.Event();
        this._device = device === undefined ? new Device_1.Device() : device;
        this._device.battery.ChargingChanged.on(this);
        this._scoreAdjuster = new ScoreAdjuster_1.ScoreAdjuster(this._device);
        this._actualScore = 1;
        this._downlinkLimit = 2.5;
        this._uplinkLimit = 1;
        this._dischargingTimeLimit = 7200;
    }
    ScoreComputer.prototype.start = function () {
        var _this = this;
        setInterval(function () {
            _this.compute();
        }, 60000);
    };
    ScoreComputer.prototype.dataAvailable = function (batteryChargingInfo) {
        this.compute();
    };
    ScoreComputer.prototype.subscribe = function (subscriber) {
        this.ScoreComputed.on(subscriber);
    };
    ScoreComputer.prototype.compute = function () {
        var battery = this._device.battery;
        var network = this._device.network;
        if (network.type === Network_1.ConnectionType.cellular ||
            (battery.level < 0.15 && !battery.isCharging)) {
            this._actualScore = 0;
            this.ScoreComputed.trigger(this._actualScore);
            console.log("Network type: Cellular.");
            console.log("OR");
            console.log("Battery level is under 15% AND device is not charging.");
            console.log("------(SCORE = 0)------");
            return;
        }
        if ((network.type === Network_1.ConnectionType.wifi ||
            network.type === Network_1.ConnectionType.ethernet) &&
            battery.isCharging) {
            this._actualScore = 1;
            this.ScoreComputed.trigger(this._actualScore);
            console.log("Network type: WIFI OR ETHERNET.");
            console.log("AND");
            console.log("Device is charging.");
            console.log("------(SCORE = 1)------");
            return;
        }
        var score = 0;
        var infoTable = [];
        score += battery.level * weights.batteryLevel;
        var levelInfo = {
            property: "battery level",
            value: battery.level,
            weigth: weights.batteryLevel,
            scoreTag: battery.level * weights.batteryLevel
        };
        infoTable.push(levelInfo);
        var dischargingTimeScore = battery.dischargingTimeInSeconds / this._dischargingTimeLimit;
        dischargingTimeScore = dischargingTimeScore < 1 ? dischargingTimeScore : 1;
        score += dischargingTimeScore * weights.batteryDischargingTime;
        var dischargeInfo = {
            property: "discharging time score",
            value: dischargingTimeScore,
            weigth: weights.batteryDischargingTime,
            scoreTag: dischargingTimeScore * weights.batteryDischargingTime
        };
        infoTable.push(dischargeInfo);
        var dSpeedScore = (network.downlink / this._downlinkLimit);
        var uSpeedScore = (network.uplink / this._uplinkLimit);
        dSpeedScore = dSpeedScore < 1 ? dSpeedScore : 1;
        uSpeedScore = uSpeedScore < 1 ? uSpeedScore : 1;
        score += dSpeedScore * weights.downloadSpeed;
        score += uSpeedScore * weights.uploadSpeed;
        score += this._scoreAdjuster.adjustment * weights.adjustment;
        score = score < 0 ? 0 : score;
        this._actualScore = score;
        this.ScoreComputed.trigger(score);
        var downlinkInfo = {
            property: "downlink",
            value: dSpeedScore,
            weigth: weights.downloadSpeed,
            scoreTag: dSpeedScore * weights.downloadSpeed
        };
        var uplinkInfo = {
            property: "uplink",
            value: uSpeedScore,
            weigth: weights.uploadSpeed,
            scoreTag: uSpeedScore * weights.uploadSpeed
        };
        var adjusterInfo = {
            property: "adjustment",
            value: this._scoreAdjuster.adjustment,
            weigth: weights.adjustment,
            scoreTag: this._scoreAdjuster.adjustment * weights.adjustment
        };
        var scoreInfo = {
            property: "TOTAL SCORE",
            value: "----",
            weigth: "----",
            scoreTag: score
        };
        infoTable.push(downlinkInfo, uplinkInfo, adjusterInfo, scoreInfo);
        console.table(infoTable);
    };
    Object.defineProperty(ScoreComputer.prototype, "ActualScore", {
        get: function () {
            return this._actualScore;
        },
        enumerable: true,
        configurable: true
    });
    return ScoreComputer;
}());
exports.ScoreComputer = ScoreComputer;
new ScoreComputer().start();
