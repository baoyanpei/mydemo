define("ZoneWidget", [], function () {
    function e(e, t, n) {
        var r = document.createElement(e);
        return "string" == typeof t ? r.className = t : n = t, "object" == typeof n ? r.appendChild(n) : "string" == typeof n ? r.appendChild(document.createTextNode(n)) : "array" == typeof n && n.forEach(function (e) {
            r.appendChild(e)
        }), r
    }

    function t(e, t, n) {
        return this.isMinimized = !0, this.name = e, this.minimizedChanged = new Cesium.Event, this._toggleState = Cesium.createCommand(function () {
            this.isMinimized = !this.isMinimized, this.raiseMinimizedChanged()
        }.bind(this)), Cesium.knockout.track(this, ["isMinimized"]), this
    }

    function n(n, r, i, o, a) {
        var s = e("div", "bim-zonewidget-content", o),
            u = e("div", "bim-zonewidget-tab");
        u.appendChild(e("i", i)), u.setAttribute("data-bind", "click: toggleState");
        var c = e("div", "bim-zonewidget");
        c.id = "bim-zonewidget-id-" + r.toLowerCase(), c.appendChild(u), c.appendChild(s), c.setAttribute("data-bind", "css: cssClassForState");
        var l = new t(r, o, a);
        return this.viewModel = l, this._element = c, n.element.appendChild(this._element), Cesium.knockout.applyBindings(this.viewModel, this._element), this
    }
    return Cesium.defineProperties(t.prototype, {
        toggleState: {
            get: function () {
                return this._toggleState
            }
        },
        cssClassForState: {
            get: function () {
                return "bim-zonewidget " + (this.isMinimized ? "bim-minimized" : "bim-open")
            }
        }
    }), t.prototype.raiseMinimizedChanged = function () {
        this.minimizedChanged.raiseEvent(this)
    }, t.prototype.destroy = function () {
        return Cesium.destroyObject(this)
    }, t.prototype.isDestroyed = function () {
        return !1
    }, n
})