define("ToolAction", ["./Action", "../Util/extend", "../Tools/ToolFactory"], function (e, t, n) {
  function r(t, n, r, i, o) {
    e.call(this, t, n), this.toolId = i, this.viewport = r, this._createTool = o;
    var a = this,
      s = r.toolAdmin;
    s.activeToolChanged.addEventListener(function () {
      a.active = Cesium.defined(s.activeTool) && s.activeTool.id == a.toolId
    })
  }
  return t(e, r), r.prototype.activate = function () {
    var e = this.createTool();
    return !(!Cesium.defined(e) || !e.installTool() || e != this.viewport.toolAdmin.activeTool) && (this.tool = e, !0)
  }, r.prototype.deactivate = function () {
    Cesium.defined(this.tool) && (this.tool.exitTool(), this.tool = void 0)
  }, r.prototype.createTool = function () {
    return Cesium.defined(this._createTool) ? this._createTool() : n.createTool(this.viewport, this.toolId)
  }, r
})
