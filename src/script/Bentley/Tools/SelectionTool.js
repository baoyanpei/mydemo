define("SelectionTool", ["./PickTool", "../Util/extend", "./ToolId", "../Bim/InputEventModifiers"], function (e, t, n, r) {
  function i(t) {
    e.call(this, t, n.Selection)
  }
  return t(e, i), i.prototype.getPickModifiers = function () {
    return r.Control
  }, i.prototype.onCleanup = function () {
    this.viewport.selectionSet.clear(), e.prototype.onCleanup.call(this)
  }, i.prototype.onPick = function (e, t) {
    var n = this.viewport.selectionSet;
    return t.isControlKey ? n.toggleElement(e) : n.setSelectedElement(e), !0
  }, i
})
