define("ViewList", [], function () {
  function e(e, t) {
    var n = e.viewport;
    this.viewport = n, this.view = t, this.isActive = n.activeView == t, this.closeEvent = e.onCloseActiveTools;
    var r = this;
    this._activate = Cesium.createCommand(function () {
      n.activeView, Cesium.Camera.clone(e.camera);
      return n.activateView(r.view), !0
    }), Cesium.knockout.track(this, ["isActive"]), n.viewActivated.addEventListener(function (e, t) {
      t && (r.isActive = r.viewport.activeView == r.view, r.closeEvent.raiseEvent())
    })
  }

  function t(t, n, r) {
    this.viewModel = new e(t, n), this.container = r;
    var i = document.createElement("div"),
      o = document.createElement("div");
    o.className = "bim-toggle-entry", o.textContent = n.name, o.setAttribute("data-bind", 'click: activate, css: { "bim-toggle-entry-enabled" : isActive, "bim-toggle-entry-disabled" : !isActive }'), o.setAttribute("title", "Click to activate view"), i.appendChild(o), r.appendChild(i), Cesium.knockout.applyBindings(this.viewModel, o)
  }
  return Cesium.defineProperties(e.prototype, {
    activate: {
      get: function () {
        return this._activate
      }
    }
  }), t
})
