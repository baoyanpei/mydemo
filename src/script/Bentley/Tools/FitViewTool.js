define("FitViewTool", ["../Util/extend", "./ViewTool", "./ViewManip", "./ToolId"], function (e, t, n, r) {
    function i(e, n) {
        t.call(this, e, r.FitView), this.oneShot = Cesium.defaultValue(n, !1)
    }
    return e(t, i), i.prototype.onDataButtonDown = function (e) {
        return this.doFit()
    }, i.prototype.onPostInstall = function () {
        t.prototype.onPostInstall.call(this), this.doFit()
    }, i.prototype.doFit = function () {
        return n.fitView(this.viewport, !0), this.oneShot && this.exitTool(), this.oneShot
    }, i
})   