define("ToolFactory", ["../Bentley/Tools/ToolFactory", "./ToolId", "../Bentley/Tools/ViewManip", "../Bentley/Tools/ViewHandleType"], function (e, t, n, r) {
    return e[t.Rotate] = function (t) {
        return e.createRotateTool(t, !1, !1)
    }, e[t.Pan] = function (t) {
        return e.createPanTool(t, !1, !1)
    }, e.createPanTool = function (e, i, o) {
        return new n(e, r.ViewPan, i, !1, o, t.Pan)
    }, e.createRotateTool = function (e, i, o) {
        return new n(e, r.ViewPan | r.Rotate, i, !1, o, t.Rotate)
    }, e
})