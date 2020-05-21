define("MouseWheelEvent", ["../Util/extend", "./ButtonEvent"], function (e, t) {
    function n(e) {
        t.call(this), this.wheelDelta = Cesium.defaultValue(e, 0)
    }
    return e(t, n), n.prototype.clone = function (e) {
        var t = Cesium.defined(e) ? e : new n(this.wheelDelta);
        return t.copyFrom(this), t
    }, n
})