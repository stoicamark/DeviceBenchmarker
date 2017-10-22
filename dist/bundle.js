/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Battery_1 = __webpack_require__(4);
var Network_1 = __webpack_require__(2);
var Device = (function () {
    function Device() {
        this._battery = new Battery_1.Battery();
        this._network = new Network_1.Network();
        this._actualScore = 1;
        this._startToServTimeStamp = Date.now();
    }
    Device.prototype.getServingTimeInSeconds = function () {
        return Math.floor((Date.now() - this._startToServTimeStamp) / 1000);
    };
    Object.defineProperty(Device.prototype, "actualScore", {
        get: function () {
            return this._actualScore;
        },
        set: function (value) {
            this._actualScore = value;
        },
        enumerable: true,
        configurable: true
    });
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
    Device.prototype.isMobile = function () {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
            return true;
        return false;
    };
    return Device;
}());
exports.Device = Device;


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["wifi"] = "wifi";
    ConnectionType["cellular"] = "cellular";
    ConnectionType["ethernet"] = "ethernet";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
var Network = (function () {
    function Network() {
        var networkInfo = navigator.connection;
        this._type = ConnectionType.wifi;
        this._downlinkLimit = 2.5;
        this._uplinkLimit = 1;
        if (networkInfo === undefined) {
            this.measureDownloadSpeed();
        }
        else {
            this.updateNetworkInfos(networkInfo);
            networkInfo.onchange += this.updateNetworkInfos(networkInfo);
        }
        this.measureUploadSpeed();
    }
    Network.prototype.updateNetworkInfos = function (networkInfo) {
        if (networkInfo.type !== undefined) {
            this._type = networkInfo.type;
        }
        this._downlink = networkInfo.downlink;
        this._downlinkMax = networkInfo.downlinkMax;
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
            return this._downlink;
        },
        set: function (value) {
            this._downlink = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "uplink", {
        get: function () {
            return this._uplink;
        },
        set: function (value) {
            this._uplink = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "ulinkLimit", {
        get: function () {
            return this._uplinkLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "downlinkLimit", {
        get: function () {
            return this._downlinkLimit;
        },
        set: function (value) {
            this._downlinkLimit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Network.prototype, "uplinkLimit", {
        set: function (value) {
            this._uplinkLimit = value;
        },
        enumerable: true,
        configurable: true
    });
    return Network;
}());
exports.Network = Network;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = __webpack_require__(0);
var ScoreAdjuster_1 = __webpack_require__(11);
var Network_1 = __webpack_require__(2);
var weights;
(function (weights) {
    weights[weights["batteryLevel"] = 0.1] = "batteryLevel";
    weights[weights["batetryChargingTime"] = 0.2] = "batetryChargingTime";
    weights[weights["batteryDischargingTime"] = 0.3] = "batteryDischargingTime";
    weights[weights["connectionType"] = 0.3] = "connectionType";
    weights[weights["downloadSpeed"] = 0.15] = "downloadSpeed";
    weights[weights["uploadSpeed"] = 0.15] = "uploadSpeed";
    weights[weights["adjustment"] = 0.1] = "adjustment";
})(weights = exports.weights || (exports.weights = {}));
var DeviceBenchmarker = (function () {
    function DeviceBenchmarker() {
        this._device = new Device_1.Device();
        this._scoreAdjuster = new ScoreAdjuster_1.ScoreAdjuster(this._device);
    }
    DeviceBenchmarker.prototype.start = function () {
        var _this = this;
        var battery = this._device.battery;
        var network = this._device.network;
        setInterval(function () {
            if (network.type === Network_1.ConnectionType.cellular ||
                (battery.level < 0.15 && battery.isCharging === false)) {
                _this._device.actualScore = 0;
                return;
            }
            var score = 0;
            score += battery.level * weights.batteryLevel;
            switch (network.type) {
                case Network_1.ConnectionType.ethernet:
                    score += weights.connectionType;
                    break;
                case Network_1.ConnectionType.wifi:
                    score += weights.connectionType;
                    break;
                default: break;
            }
            var dSpeedScore = (network.downlink / network.downlinkLimit);
            var uSpeedScore = (network.uplink / network.uplinkLimit);
            dSpeedScore = dSpeedScore < 1 ? dSpeedScore : 1;
            uSpeedScore = uSpeedScore < 1 ? uSpeedScore : 1;
            score += dSpeedScore * weights.downloadSpeed;
            score += uSpeedScore * weights.uploadSpeed;
            score += _this._scoreAdjuster.adjustment * weights.adjustment;
            console.log("Device score: " + score);
        }, 10000);
    };
    DeviceBenchmarker.prototype.getascore = function () {
        return this._device.actualScore;
    };
    return DeviceBenchmarker;
}());
exports.DeviceBenchmarker = DeviceBenchmarker;
new DeviceBenchmarker().start();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Battery = (function () {
    function Battery() {
        var _this = this;
        this._batteryListeners = [];
        this._levelDropTimeInSeconds = Infinity;
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
        if (this._levelDropTimeInSeconds === Infinity) {
            this._levelDropTimeInSeconds = this._avgLevelDropTimeInSeconds;
        }
        else {
            this._levelDropTimeInSeconds = dTime / 1000;
            this.emitBatteryLevelDropTimeChange(this._levelDropTimeInSeconds);
        }
        console.log("One level drain duration: " +
            this._levelDropTimeInSeconds.toFixed(5) + " seconds");
        console.log("Battery level: " + battery.level * 100 + " %");
    };
    Battery.prototype.updateChargeInfo = function (battery) {
        this._isCharging = battery.charging;
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
    Battery.prototype.emitBatteryLevelDropTimeChange = function (measurement) {
        if (this._batteryListeners) {
            this._batteryListeners.slice(0).forEach(function (l) { return l.onLevelDropTimeChanged(measurement); });
        }
    };
    Battery.prototype.on = function (listener) {
        this._batteryListeners.push(listener);
    };
    Battery.prototype.off = function (listener) {
        this._batteryListeners = this._batteryListeners.filter(function (l) { return l !== listener; });
    };
    Battery.prototype.allOff = function () {
        this._batteryListeners = [];
    };
    Battery.prototype.hasListener = function () {
        return this._batteryListeners.length !== 0;
    };
    return Battery;
}());
exports.Battery = Battery;


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = __webpack_require__(0);
var ScoreAdjuster = (function () {
    function ScoreAdjuster(device) {
        this._adjustment = 0;
        this._device = device;
        this._maxAdjustment = 50;
        this._targetBatteryLevelDropTime = 240;
        this._batteryLevelDropTimeOffset = 20;
        var Controller = __webpack_require__(12);
        this._ctr = new Controller({
            k_p: 0.25,
            k_i: 0.01,
            k_d: 0.0,
            i_max: this._batteryLevelDropTimeOffset
        });
        this._ctr.setTarget(this._targetBatteryLevelDropTime);
        this._device.battery.on(this);
    }
    ScoreAdjuster.prototype.onLevelDropTimeChanged = function (measuredLevelDropTime) {
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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *  PID Controller.
 */
class Controller {
  constructor(k_p, k_i, k_d, dt) {
    let i_max;
    if (typeof k_p === 'object') {
      let options = k_p;
      k_p = options.k_p;
      k_i = options.k_i;
      k_d = options.k_d;
      dt = options.dt;
      i_max = options.i_max;
    }

    // PID constants
    this.k_p = (typeof k_p === 'number') ? k_p : 1;
    this.k_i = k_i || 0;
    this.k_d = k_d || 0;

    // Interval of time between two updates
    // If not set, it will be automatically calculated
    this.dt = dt || 0;

    // Maximum absolute value of sumError
    this.i_max = i_max || 0;

    this.sumError  = 0;
    this.lastError = 0;
    this.lastTime  = 0;

    this.target    = 0; // default value, can be modified with .setTarget
  }

  setTarget(target) {
    this.target = target;
  }

  update(currentValue) {
    this.currentValue = currentValue;

    // Calculate dt
    let dt = this.dt;
    if (!dt) {
      let currentTime = Date.now();
      if (this.lastTime === 0) { // First time update() is called
        dt = 0;
      } else {
        dt = (currentTime - this.lastTime) / 1000; // in seconds
      }
      this.lastTime = currentTime;
    }
    if (typeof dt !== 'number' || dt === 0) {
      dt = 1;
    }

    let error = (this.target - this.currentValue);
    this.sumError = this.sumError + error*dt;
    if (this.i_max > 0 && Math.abs(this.sumError) > this.i_max) {
      let sumSign = (this.sumError > 0) ? 1 : -1;
      this.sumError = sumSign * this.i_max;
    }

    let dError = (error - this.lastError)/dt;
    this.lastError = error;

    return (this.k_p*error) + (this.k_i * this.sumError) + (this.k_d * dError);
  }

  reset() {
    this.sumError  = 0;
    this.lastError = 0;
    this.lastTime  = 0;
  }
}

module.exports = Controller;


/***/ })
/******/ ]);