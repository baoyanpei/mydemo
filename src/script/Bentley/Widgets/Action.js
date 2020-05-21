define("Action", [], function () {
  function e(e, t, n, r) {
    this.name = e, this.icon = t, this.tooltipText = e, this.enabled = !0, this.active = !1, this._activate = n, this._deactivate = r, Cesium.knockout.track(this, this.getBindings())
  }
  return e.prototype.getBindings = function () {
    return ["tooltipText", "enabled", "active"]
  }, e.prototype.activate = function () {
    if (!Cesium.defined(this._activate)) throw new Cesium.DeveloperError("Must implement Action.activate()");
    return this._activate()
  }, e.prototype.deactivate = function () {
    if (!Cesium.defined(this._deactivate)) throw new Cesium.DeveloperError("Must implement Action.deactivate()");
    this._deactivate()
  }, e
})
