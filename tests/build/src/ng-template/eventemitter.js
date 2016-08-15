"use strict";
var EventEmitter = (function () {
    function EventEmitter() {
        this.eventQueue = [];
    }
    /**
     * Trigger callbacks for the given event
     * @example
     * this.trigger( "myevent", 1, 2, 3 );
     */
    EventEmitter.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.eventQueue.forEach(function (dto) {
            if (dto.event !== event) {
                return;
            }
            dto.callback.apply(dto.context, args);
        }, this);
    };
    /**
     * Just like on, but causes the bound callback to fire only once before being removed.
     */
    EventEmitter.prototype.once = function (ev, cb, context) {
        this.off(ev, cb);
        this.on(ev, cb, context);
        return this;
    };
    /**
     * Subscribe a cb hundler for a given event in the object scope
     */
    EventEmitter.prototype.on = function (ev, cb, context) {
        this.eventQueue.push({
            event: ev,
            callback: cb,
            context: context || { event: ev }
        });
        return this;
    };
    /**
     * Unsubscribe a cb hundler
     *
     */
    EventEmitter.prototype.off = function (ev, target) {
        this.eventQueue = this.eventQueue.filter(function (task) {
            return task.event !== ev || task.callback.toString() !== target.toString();
        });
        return this;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
