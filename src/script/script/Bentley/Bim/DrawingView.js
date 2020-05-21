define("DrawingView", ["./View", "./View2d", "../Math/Cartesian3", "../Util/extend"], function (e, t, n, r) {
    function i(e, n) {
        t.call(this, e, n, !0)
    }
    return r(t, i), i.prototype.clone = function () {
        var e = new i(void 0, this.bim);
        return e.copyFrom(this), e
    }, i.prototype.equals = function (e) {
        return this.isEqual(e)
    }, i.prototype.toDrawingView = function () {
        return this
    }, i
})