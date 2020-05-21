define("ButtonEvent", ["../Math/Cartesian3", "./InputSource", "../Bim/InputEventModifiers", "./Button"], function (e, t, n, r) {
    function i() {
        this.point = new e, this.viewPoint = new e, this.keyModifiers = n.None, this.isDoubleClick = !1, this.isDown = !1, this.button = r.Data, this.inputSource = t.Unknown, this.actualInputSource = t.Unknown
    }
    return i.prototype.initEvent = function (e, i, o, a, s, u, c, l) {
        this.setPoint(e), this.setViewPoint(i), this.viewport = o, this.keyModifiers = Cesium.defaultValue(a, n.None), this.button = Cesium.defaultValue(s, r.Data), this.isDown = Cesium.defaultValue(u, !0), this.isDoubleClick = Cesium.defaultValue(c, !1), this.inputSource = Cesium.defaultValue(l, t.Unknown), this.actualInputSource = this.inputSource
    }, i.prototype.clone = function (e) {
        var t = Cesium.defined(e) ? e : new i;
        return t.copyFrom(this), t
    }, i.prototype.copyFrom = function (e) {
        this.setPoint(e.point), this.setViewPoint(e.viewPoint), this.keyModifiers = e.keyModifiers, this.isDoubleClick = e.isDoubleClick, this.isDown = e.isDown, this.button = e.button, this.inputSource = e.inputSource, this.actualInputSource = e.actualInputSource, this.viewport = e.viewport
    }, i.prototype.setPoint = function (e) {
        this.point.copyFrom(e)
    }, i.prototype.setViewPoint = function (e) {
        this.viewPoint.copyFrom(e)
    }, i.prototype.reset = function () {
        this.viewport = void 0
    }, Cesium.defineProperties(i.prototype, {
        isControlKey: {
            get: function () {
                return 0 != (this.keyModifiers & n.Control)
            }
        },
        isShiftKey: {
            get: function () {
                return 0 != (this.keyModifiers & n.Shift)
            }
        }
    }), i
})