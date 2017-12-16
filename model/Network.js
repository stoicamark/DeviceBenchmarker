"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["wifi"] = "wifi";
    ConnectionType["cellular"] = "cellular";
    ConnectionType["ethernet"] = "ethernet";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
var Network = (function () {
    function Network(client) {
        this._type = ConnectionType.wifi;
        this.Client = client;
        this.maintainNetworkInfos();
    }
    Network.prototype.maintainNetworkInfos = function () {
        var _this = this;
        if (!this.Client) {
            var networkInfo_1 = navigator.connection;
            setInterval(function () {
                if (networkInfo_1 === undefined) {
                    _this.measureDownloadSpeed();
                    _this.measureUploadSpeed();
                }
                else {
                    _this.updateNetworkInfos(networkInfo_1);
                }
            }, 10000);
        }
    };
    Network.prototype.updateNetworkInfos = function (networkInfo) {
        if (networkInfo.type !== undefined) {
            this._type = networkInfo.type;
        }
        this._downlink = networkInfo.downlink;
        this._effectiveType = networkInfo.effectiveType;
        this._roundTripTime = networkInfo.rtt;
    };
    Network.prototype.measureUploadSpeed = function () {
        this._uplink = 1;
    };
    Network.prototype.measureDownloadSpeed = function () {
        var _this = this;
        var imageAddr = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg";
        var downloadSize = 5245329;
        var download = new Image();
        var startTime, endTime, duration;
        var bitsLoaded = downloadSize * 8;
        startTime = (new Date()).getTime();
        var cacheBuster = "?nnn=" + startTime;
        download.src = imageAddr + cacheBuster;
        download.onload = function () {
            endTime = (new Date()).getTime();
            duration = (endTime - startTime) / 1000;
            var speedbps = Number((bitsLoaded / duration).toFixed(2));
            var speedkbps = Number((speedbps / 1024).toFixed(2));
            _this._downlink = Number((speedkbps / 1024).toFixed(2));
        };
    };
    Object.defineProperty(Network.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "downlink", {
        get: function () {
            if (!this.Client) {
                return this._downlink;
            }
            else {
                return this.Client.getBandwidth();
            }
        },
        set: function (value) {
            this._downlink = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "uplink", {
        get: function () {
            if (!this.Client) {
                return this._uplink;
            }
            else {
                return this.Client.getBandwidth();
            }
        },
        set: function (value) {
            this._uplink = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "Client", {
        get: function () {
            return this._client;
        },
        set: function (value) {
            this._client = value;
        },
        enumerable: true,
        configurable: true
    });
    return Network;
}());
exports.Network = Network;
