"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
var Event = (function () {
    function Event() {
        this.handlers = [];
    }
    Event.prototype.on = function (handler) {
        if (!isFunction(handler.dataAvailable)) {
            throw new Error("Handler is not a function");
        }
        this.handlers.push(handler);
    };
    Event.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    Event.prototype.allOff = function () {
        this.handlers = [];
    };
    Event.prototype.trigger = function (data) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(function (h) { return h.dataAvailable(data); });
        }
    };
    Event.prototype.hasListener = function () {
        return this.handlers.length !== 0;
    };
    return Event;
}());
exports.Event = Event;
