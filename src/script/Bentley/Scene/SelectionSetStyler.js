define("SelectionSetStyler", ["../Util/foreach"], function (e) {
    function t(e) {
        this.viewport = e, this.showRuleAlwaysApplies = !0, this._isolate = !1;
        var t = this,
            n = e.selectionSet;
        n.changed.addEventListener(function () {
            t.update()
        }), n.flashChanged.addEventListener(function () {
            t.update()
        }), e.styler.register(this)
    }
    return Cesium.defineProperties(t.prototype, {
        selectionSet: {
            get: function () {
                return this.viewport.selectionSet
            }
        }
    }), t.prototype.update = function () {
        this.viewport.styler.update()
    }, t.prototype.setIsolate = function (e) {
        this._isolate != e && (this._isolate = e, this.update())
    }, t.prototype.getShowRule = function () {
        if (!this.selectionSet.isEmpty() || Cesium.defined(this.selectionSet.flashed)) {
            var t = "(",
                n = !0;
            return e(this.selectionSet.elements, function (e) {
                n ? n = !1 : t += "||", t += '${element}==="' + e.elementId + '"'
            }), Cesium.defined(this.selectionSet.flashed) && (n || (t += "||"), t += '${element}==="' + this.selectionSet.flashed.elementId + '"'), t += ")"
        }
    }, t.prototype.getColorRule = function () {
        var e = this.getShowRule();
        if (!Cesium.defined(e)) return this._isolate ? 'color("#ffffff", 0.025)' : void 0;
        var t;
        return t = this._isolate ? ' ? color("#ffffff") : color("#ffffff", 0.025)' : ' ?color("#808080") : color("#ffffff")', e + t
    }, t
})