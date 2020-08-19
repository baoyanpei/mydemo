define("ViewIdleTool", ["./Tool", "../Util/extend", "../Util/dynamicCast", "./Button", "./ViewManip", "./ViewHandleType", "./FitViewTool", "./ToolId", "./RotatePanZoomGestureTool"], function (e, t, n, r, i, o, a, s, u) {
    function c(t) {
        e.call(this, t, s.Idle)
    }
    return t(e, c), c.prototype.onMiddleButtonDown = function (e) {
        var t = this.viewport.toolAdmin,
            s = t.currentInputState;
        if (s.isDragging(r.Data) || s.isDragging(r.Reset)) return !1;
        var u;
        if (e.isDoubleClick) u = new a(this.viewport, !0);
        else if (e.isShiftKey) u = new i(this.viewport, o.Rotate, !0, !1, !0);
        else {
            var c = n(t.activeTool, i);
            if (Cesium.defined(c)) return !c.isDragging && c.viewHandles.hasHandle(o.ViewPan) && (c.forcedHandle = o.ViewPan), !0;
            u = new i(this.viewport, o.ViewPan, !0, !1, !0)
        }
        return u.installTool()
    }, c.prototype.onMiddleButtonUp = function (e) {
        if (this.viewport.toolAdmin.resetViewCursor(), e.isDoubleClick || e.isControlKey || e.isShiftkey) return !1;
        var t = n(this.viewport.toolAdmin.activeTool, i);
        return Cesium.defined(t) && (t.viewHandles.hasHandle(o.ViewPan) && (t.forcedHandle = o.ViewNone), t.viewHandles.hasHandle(o.TargetCenter) && t.invalidateTargetCenter()), !0
    }, c.prototype.onMouseWheel = function (e) {
        return this.viewport.toolAdmin.processMouseWheelEvent(e, !0)
    }, c.prototype.installToolImplementation = function () {
        return !0
    }, c.prototype.exitTool = function () {}, c.prototype.onDataButtonDown = function (e) {
        return !1
    }, c.prototype.onMultiFingerMove = function (e) {
        var t = new u(e, !0);
        return t.installTool(), !0
    }, c.prototype.onSingleFingerMove = function (e) {
        return this.onMultiFingerMove(e)
    }, c.prototype.onSingleTap = function (e) {
        return this.toolAdmin.convertGestureSingleTapToButtonDownAndUp(e), !0
    }, c.prototype.onDoubleTap = function (e) {
        var t = new a(this.viewport, !0);
        return t.installTool(), !0
    }, c.prototype.onTwoFingerTap = function (e) {
        this.toolAdmin.convertGestureToResetButtonDownAndUp(e)
    }, c
})