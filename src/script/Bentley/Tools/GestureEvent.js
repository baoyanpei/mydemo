define("GestureEvent", ["./ButtonEvent", "./GestureInfo", "../Util/extend", "../Math/Cartesian3"], function (e, t, n, r) {
    function i() {
        e.call(this), this.gestureInfo = new t
    }
    return i.prototype.initGestureEvent = function (e, t) {
        return this.gestureInfo.copyFrom(t), e.toolAdmin.currentInputState.fromGesture(t, !0), e.toolAdmin.currentInputState.toEvent(this, !1), this.gestureInfo.isFromMouse && (this.actualInputSource = InputSource.Mouse), this
    }, i.prototype.getDisplayPoint = function (e) {
        var t = Cesium.defined(e) ? e : new Cesium.Cartesian2;
        return t.x = Math.floor(this.viewPoint.x), t.y = Math.floor(this.viewPoint.y), t
    }, n(e, i), i
})