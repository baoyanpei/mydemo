define("ViewLinkWidget", ["../Bim/ViewFactory"], function (e) {
  function t(e) {
    var t, n = /([^&=]+)=?([^&]*)/g;
    for (urlParams = {}; t = n.exec(e);) urlParams[t[1]] = t[2];
    return urlParams
  }

  function n(e) {
    this.url = "";
    var n = this;
    this._activate = Cesium.createCommand(function (e, r) {
      var i = t(window.location.search.substring(1)),
        o = t("viewId=" + e + "&" + r.toUrl());
      for (var a in o) i[a] = o[a];
      var s = "";
      for (var a in i) "" !== s && (s += "&"), s += a + "=" + i[a];
      return n.url = window.location.origin + window.location.pathname + "?" + s, !0
    }), this._copyUrl = Cesium.createCommand(function (e, t) {
      return r(n.url)
    }), Cesium.knockout.track(this, ["url"])
  }

  function r(e) {
    if (window.clipboardData && window.clipboardData.setData) return clipboardData.setData("Text", e);
    if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var t = document.createElement("textarea");
      t.textContent = e, t.style.position = "fixed", document.body.appendChild(t), t.select();
      try {
        return document.execCommand("copy")
      } catch (e) {
        return console.warn("Copy to clipboard failed.", e), !1
      } finally {
        document.body.removeChild(t)
      }
    }
  }

  function i(e) {
    var t = new n(e);
    this.viewModel = t;
    var r = document.createElement("div");
    r.className = "bim-view-link", this._element = r;
    var i = document.createElement("div");
    i.className = "bim-view-link-wrapper clearfix";
    var o = document.createElement("div");
    o.className = "bim-groupbox";
    var a = document.createElement("input");
    a.setAttribute("data-bind", "attr: {value: url}"), a.className = "bim-view-link-copy-input", o.appendChild(a);
    var s = document.createElement("div");
    s.className = "bim-toolbar bim-view-link-copy-btn";
    var u = document.createElement("div"),
      c = document.createElement("i");
    c.className = "bim-icon-paste", u.appendChild(c), s.appendChild(u), u.setAttribute("data-bind", "click: copyUrl"), u.setAttribute("title", "copy url to clipboard"), i.appendChild(o), i.appendChild(s), r.appendChild(i), Cesium.knockout.applyBindings(t, this._element)
  }
  return Cesium.defineProperties(n.prototype, {
    activate: {
      get: function () {
        return this._activate
      }
    },
    copyUrl: {
      get: function () {
        return this._copyUrl
      }
    }
  }), i.prototype.isDestroyed = function () {
    return !1
  }, i.prototype.destroy = function () {
    return Cesium.knockout.cleanNode(this._element), this.viewModel.destroy(), Cesium.destroyObject(this)
  }, i
})
