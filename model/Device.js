"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Battery_1 = require("./Battery");
var Network_1 = require("./Network");
var Device = (function () {
    function Device() {
        this._battery = new Battery_1.Battery();
        this._network = new Network_1.Network();
    }
    Object.defineProperty(Device.prototype, "network", {
        get: function () {
            return this._network;
        },
        set: function (value) {
            this._network = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Device.prototype, "battery", {
        get: function () {
            return this._battery;
        },
        set: function (value) {
            this._battery = value;
        },
        enumerable: true,
        configurable: true
    });
    return Device;
}());
exports.Device = Device;
