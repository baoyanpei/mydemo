define("Tool", ["./ButtonEvent"], function (e) {
    function t(e, t) {
        this.viewport = e, this.id = t
    }
    return Cesium.defineProperties(t.prototype, {
        toolAdmin: {
            get: function () {
                return this.viewport.toolAdmin
            }
        }
    }), t.prototype.installTool = function () {
        return this.installToolImplementation()
    }, t.prototype.onPostInstall = function () {}, t.prototype.onInstall = function () {
        return !0
    }, t.prototype.onDataButtonDown = function (e) {
        throw new Cesium.DeveloperError("onDataButtonDown must be implemented")
    }, t.prototype.onDataButtonUp = function (e) {
        return !1
    }, t.prototype.onResetButtonDown = function (e) {
        return !1
    }, t.prototype.onResetButtonUp = function (e) {
        return !1
    }, t.prototype.onMiddleButtonDown = function (e) {
        return !1
    }, t.prototype.onMiddleButtonUp = function (e) {
        return !1
    }, t.prototype.onModelMotion = function (e) {}, t.prototype.onModelNoMotion = function (e) {}, t.prototype.onModelMotionStopped = function (e) {}, t.prototype.onModelStartDrag = function (e) {
        return !1
    }, t.prototype.onModelEndDrag = function (e) {
        return this.onDataButtonDown(e)
    }, t.prototype.onMouseWheel = function (e) {
        return !1
    }, t.prototype.exitTool = function () {
        throw new Cesium.DeveloperError("exitTool must be implemented")
    }, t.prototype.onCleanup = function () {}, t.prototype.onViewportResized = function () {}, t.prototype.updateDynamics = function (e) {}, t.prototype.onTouchMotionPaused = function () {
        return !1
    }, t.prototype.onEndGesture = function (e) {
        return !1
    }, t.prototype.onSingleFingerMove = function (e) {
        return !1
    }, t.prototype.onMultiFingerMove = function (e) {
        return !1
    }, t.prototype.onTwoFingerTap = function (e) {
        return !1
    }, t.prototype.onPressAndTap = function (e) {
        return !1
    }, t.prototype.onSingleTap = function (e) {
        return !1
    }, t.prototype.onDoubleTap = function (e) {
        return !1
    }, t.prototype.onLongPress = function (e) {
        return !1
    }, t.prototype.getCurrentButtonEvent = function (t) {
        var n = Cesium.defined(t) ? t : new e(this.viewport);
        return this.toolAdmin.fillEventFromCursorLocation(n), n
    }, t
})

