define("ViewTool", ["./Tool", "../Util/extend", "../Bim/ViewportAnimator", "./ViewToolSettings"], function (e, t, n, r) {
  function i(t, n) {
    e.call(this, t, n)
  }
  return t(e, i), i.prototype.installToolImplementation = function () {
    return !!this.toolAdmin.onInstallTool(this) && (this.toolAdmin.startViewTool(this), this.toolAdmin.setViewTool(this), this.toolAdmin.onPostInstallTool(this), !0)
  }, i.animateFrustumChange = function (e, t, i, o) {
    if (o = Cesium.defaultValue(o, r.animationTime), 0 >= o) return void e.setupFromFrustum(i);
    var a = new n(t, i, {
      viewport: e,
      totalTime: o,
      velocityFactor: 1,
      allowZoom: !1
    });
    e.setAnimator(a)
  }, i.prototype.onResetButtonUp = function (e) {
    return this.exitTool(), !0
  }, i.prototype.exitTool = function () {
    this.toolAdmin.exitViewTool()
  }, i
})
