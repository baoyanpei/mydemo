define("PropertyVisibilityStyler", [], function () {
    function e(e, t, n) {
        this.viewport = e, this.propertyName = t, this.enabled = {}, this.numValues = 0;
        for (var r in n) ++this.numValues, this.enabled[r] = !0;
        this.numDisabled = 0, e.styler.register(this), this.enabledChanged = new Cesium.Event
    }
    return e.prototype.raiseEnabledChanged = function () {
        this.enabledChanged.raiseEvent(this)
    }, e.prototype.getColorRule = function () {}, e.prototype.update = function () {
        this.viewport.styler.update()
    }, e.prototype.setEnabled = function (e, t, n) {
        var r = this.enabled[e];
        return !(!Cesium.defined(r) || r === t) && (this.enabled[e] = t, this.numDisabled += t ? -1 : 1, this.update(), n || this.raiseEnabledChanged(), !0)
    }, e.prototype.toggle = function (e) {
        var t = this.enabled[e];
        Cesium.defined(t) && this.setEnabled(e, !t)
    }, e.prototype.getShowRule = function () {
        if (0 != this.numDisabled) {
            if (this.numValues == this.numDisabled) return "false";
            var e = this.numDisabled > this.numValues / 2,
                t = "";
            for (var n in this.enabled) {
                var r = this.enabled[n];
                r == e && (t.length > 0 && (t += e ? "||" : "&&"), t += "${" + this.propertyName + "}" + (e ? "===" : "!==") + '"' + n + '"')
            }
            return t
        }
    }, e.prototype.setAll = function (e, t) {
        var n = !1;
        for (var r in this.enabled) this.setEnabled(r, e, !0) && (n = !0);
        return n && !t && this.raiseEnabledChanged(), n
    }, e.prototype.setForValues = function (e, t) {
        for (var n = this.setAll(!t, !0), r = 0; r < e.length; r++) this.setEnabled(e[r], t, !0) && (n = !0);
        return n && this.raiseEnabledChanged(), n
    }, e
})