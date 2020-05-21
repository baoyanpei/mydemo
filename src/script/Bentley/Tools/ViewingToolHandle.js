define("ViewingToolHandle", ["./Cursor"], function (e) {
  function t(e) {
    this.viewTool = e
  }
  return t.prototype.onReinitialize = function () {}, t.prototype.focusOut = function () {}, t.prototype.noMotion = function (e) {
    return !1
  }, t.prototype.motion = function (e) {
    return !1
  }, t.prototype.checkOneShot = function () {
    return !0
  }, t.prototype.getHandleCursor = function () {
    return e.Default
  }, t.prototype.doManipulation = function (e, t) {
    throw new Cesium.DeveloperError("Missing function implementation")
  }, t.prototype.firstPoint = function (e) {
    throw new Cesium.DeveloperError("Missing function implementation")
  }, t.prototype.testHandleForHit = function (e) {
    throw new Cesium.DeveloperError("Missing function implementation")
  }, t.prototype.focusIn = function () {
    this.viewTool.toolAdmin.setViewCursor(this.getHandleCursor())
  }, Cesium.defineProperties(t.prototype, {
    viewport: {
      get: function () {
        return this.viewTool.viewport
      }
    }
  }), t
})
