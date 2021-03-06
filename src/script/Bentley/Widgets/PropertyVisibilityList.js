define("PropertyVisibilityList", [], function () {
    function e(e, t, n) {
        this.value = t, this.name = n, this.enabled = !0, this.hidden = !1, this.styler = e, Cesium.knockout.track(this, ["enabled", "hidden"]);
        var r = this;
        this._toggle = Cesium.createCommand(function () {
            r.enabled = !r.enabled, r._apply()
        }), this._apply = Cesium.createCommand(function () {
            r.styler.setEnabled(r.value, r.enabled)
        })
    }

    function t(t, n, r, i) {
        this.viewModel = new e(t, n, r), this.container = i;
        var o = document.createElement("div");
        this.element = o;
        var a = document.createElement("div");
        a.textContent = r, a.className = "bim-toggle-entry", a.setAttribute("data-bind", 'click: toggle, css: { "bim-toggle-entry-enabled" : enabled, "bim-toggle-entry-disabled" : !enabled, "bim-hidden" : hidden }'), a.setAttribute("title", "Click to toggle visibility"), o.appendChild(a), i.appendChild(o), Cesium.knockout.applyBindings(this.viewModel, o)
    }

    function n(e, n) {
        this.entries = {};
        var r = document.createElement("div");
        r.className = "bim-toggle-list", this.element = r, this.styler = e;
        var i = this,
            o = document.createElement("div");
        o.textContent = "全部", o.setAttribute("title", "Enable all"), o.className = "bim-toggle-entry", o.onclick = function () {
            i.setAll(!0)
        }, r.appendChild(o);
        var a = document.createElement("div");
        a.textContent = "清除", a.setAttribute("title", "Disable all"), a.className = "bim-toggle-entry", a.onclick = function () {
            i.setAll(!1)
        }, r.appendChild(a);
        var s = document.createElement("div");
        s.textContent = "颠倒", s.setAttribute("title", "Invert the sets of enabled and disabled items"), s.className = "bim-toggle-entry-ruled", s.onclick = function () {
            i.invert()
        }, r.appendChild(s);
        for (var u in n) this.entries[u] = new t(e, u, n[u], r);
        var i = this;
        e.enabledChanged.addEventListener(function () {
            i.onEnabledChanged()
        })
    }
    return Cesium.defineProperties(e.prototype, {
        toggle: {
            get: function () {
                return this._toggle
            }
        },
        apply: {
            get: function () {
                return this._apply
            }
        }
    }), n.prototype.onEnabledChanged = function () {
        for (var e in this.styler.enabled) {
            var t = this.entries[e];
            Cesium.defined(t) && !t.viewModel.hidden && (t.viewModel.enabled = this.styler.enabled[e])
        }
    }, n.prototype.updateHiddenStates = function (e) {
        for (var t in this.entries) this.entries[t].viewModel.hidden = !0, this.entries[t].viewModel.enabled = !0;
        for (var n = 0; n < e.length; n++) {
            var t = this.entries[e[n]];
            Cesium.defined(t) && (t.viewModel.hidden = !1)
        }
    }, n.prototype.setAll = function (e) {
        for (var t in this.entries) this.entries[t].viewModel.enabled = e, this.entries[t].viewModel.apply()
    }, n.prototype.invert = function () {
        for (var e in this.entries) {
            var t = this.entries[e].viewModel;
            t.hidden || t.toggle()
        }
    }, n
})