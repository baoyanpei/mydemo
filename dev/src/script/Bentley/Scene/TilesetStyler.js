define("TilesetStyler", ["../Util/functionDefined"], function (e) {
    function t(e) {
        this.geometry = e, this.stylers = [], this.dirty = !1
    }
    return t.prototype.register = function (e) {
        this.stylers.indexOf(e) == -1 && this.stylers.push(e)
    }, t.prototype.unregister = function (e) {
        var t = this.stylers.indexOf(e); - 1 != t && this.stylers.splice(t, 1)
    }, t.prototype.update = function () {
        this.dirty = !0
    }, t.prototype._update = function () {
        if (this.dirty) {
            this.dirty = !1;
            for (var t = void 0, n = [], r = [], i = 0; i < this.stylers.length; i++) {
                var o = this.stylers[i],
                    a = e(o, "getColorRule") ? o.getColorRule() : void 0,
                    s = e(o, "getShowRule") ? o.getShowRule() : void 0;
                Cesium.defined(a) && (t = a), Cesium.defined(s) && (o.showRuleAlwaysApplies ? r.push(s) : n.push(s))
            }
            var u = void 0;
            if (Cesium.defined(t) || 0 != n.length || 0 != r.length) {
                var c = 0 != n.length ? "((" + n.join(")&&(") + "))" : void 0,
                    l = 0 != r.length ? "(" + r.join(")||(") + ")" : void 0,
                    f = void 0;
                Cesium.defined(c) && (f = Cesium.defined(l) ? l + "||" + c : c), u = new Cesium.Cesium3DTileStyle({
                    color: t,
                    show: f
                })
            }
            this.geometry.style = u
        }
    }, t
})