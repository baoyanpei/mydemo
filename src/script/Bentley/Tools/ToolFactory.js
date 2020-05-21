define("ToolFactory", ["./ToolId", "./SelectionTool", "./WindowAreaTool", "./FitViewTool", "./ViewWalkTool"], function (e, t, n, r, i) {
    var o = {};
    return o[e.Selection] = function (e) {
        return new t(e)
    }, o[e.WindowArea] = function (e) {
        return new n(e)
    }, o[e.FitView] = function (e) {
        return new r(e)
    }, o[e.Walk] = function (e) {
        return new i(e, !1)
    }, o.createTool = function (e, t) {
        var n = this[t];
        return Cesium.defined(n) ? n(e) : void 0
    }, o
})