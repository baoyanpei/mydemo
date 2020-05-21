define("ViewGestureTool", ["./ViewManip", "../Util/extend", "../Math/Cartesian2", "../Math/Cartesian3", "./ToolId", "./GestureInfo", "../Bim/Frustum", "../Bim/CoordSystem"], function (e, t, n, r, i, o, a, s) {
  function u(t) {
    e.call(this, t.viewport, 0, !0, !1, !1, i.Gesture), this.centerNpc = new r, this.startInfo = new o, this.numberTouches = 0, this.touches = [new n, new n, new n]
  }
  t(e, u), u.prototype.onDataButtonDown = function (e) {
    return !1
  };
  var c = new a;
  return u.prototype.doGesture = function (e) {
    var t = this.viewport,
      n = t.getFrustum(s.Npc, !1, c);
    if (n.multiply(e), t.npcToWorldArray(n.pts), !t.setupFromFrustum(n)) return !1;
    var r = t.isCameraOn ? t.view : void 0;
    return Cesium.defined(r) && (r.centerEyePoint(), t.setupFromView()), this.doUpdate(!0), !0
  }, u.prototype.endGesture = function () {
    return this.clearTouchStopData(), this.doUpdate(!0), this.exitTool(), !0
  }, u.prototype.saveTouchStopData = function (e) {
    this.numberTouches = e.numberTouches;
    for (var t = 0; t < this.numberTouches; t++) this.touches[t].copyFrom(e.touches[t])
  }, u.prototype.clearTouchStopData = function () {
    this.numberTouches = 0
  }, u.prototype.onStart = function (e) {
    this.clearTouchStopData(), this.startInfo.copyFrom(e.gestureInfo)
  }, u
})
