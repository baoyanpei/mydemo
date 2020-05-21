define("ToolbarButton", [], function () {
  function e(e, t, n) {
    this.dropDownVisible = !1, this.toolbar = e, this.content = t, e.addToolbarButton(this, n), Cesium.knockout.track(this, ["dropDownVisible"]);
    var r = this;
    this._toggleDropDown = Cesium.createCommand(function () {
      r.toolbar.toggleActiveContent(r)
    })
  }

  function t(t, n, r, i, o) {
    var a = document.createElement("div");
    a.className = "bim-panel bim-toolzone-content-wrapper-inactive", a.id = "bim-panel-id-" + n.toLowerCase();
    var s = document.createElement("div");
    s.className = "bim-panel-content";
    var u = document.createElement("div");
    u.className = "bim-panel-chrome", a.appendChild(u), a.appendChild(s);
    var c = document.createElement("div");
    c.textContent = n, c.className = "bim-panel-title", s.appendChild(c), s.appendChild(i), t.contentContainer.appendChild(a);
    var l = new e(t, a, o);
    this._viewModel = l, this._container = t.container;
    var f = document.createElement("div"),
      h = document.createElement("i");
    h.className = r
    f.appendChild(h)
    f.className = "bim-toolbar-group"
    f.setAttribute("data-bind", 'click: toggleDropDown, css: { "bim-active" : dropDownVisible }')
    f.setAttribute("title", n)
    t.topContainer.appendChild(f)
    this._element = f
    Cesium.knockout.applyBindings(l, this._element)
  }
  return Cesium.defineProperties(e.prototype, {
    toggleDropDown: {
      get: function () {
        return this._toggleDropDown
      }
    }
  }), e.prototype.destroy = function () {
    return Cesium.destroyObject(this)
  }, e.prototype.isDestroyed = function () {
    return !1
  }, Cesium.defineProperties(t.prototype, {
    container: {
      get: function () {
        return this._container
      }
    },
    viewModel: {
      get: function () {
        return this._viewModel
      }
    }
  }), t.prototype.isDestroyed = function () {
    return !1
  }, t.prototype.destroy = function () {
    return Cesium.knockout.cleanNode(this._element), this._container.removeChild(this._element), this.viewModel.destroy(), Cesium.destroyObject(this)
  }, t
})
