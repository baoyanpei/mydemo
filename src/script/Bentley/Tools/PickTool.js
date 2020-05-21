define("PickTool", ["./PrimitiveTool", "../Util/extend", "../Bim/InputEventModifiers", "../Bim/Element", "./InputSource"], function (e, t, n, r, i) {
    function o(t, n) {
        e.call(this, t, n);
        this.flashDelay = 250, this.tooltipDelay = 500, this.lastMotion = Date.now();
        var r = document.createElement("div");
        r.className = "bim-hidden", t.canvas.parentElement.appendChild(r), this.tooltip = r
    }
    return t(e, o), o.prototype.getPickModifiers = function () {
        return n.None
    }, o.prototype.onPick = function (e, t) {
        throw new Cesium.DeveloperError("onPick must be implemented")
    }, o.prototype.onDataButtonDown = function (e) {
        if (n.None != e.keyModifiers && n.None == (e.keyModifiers & this.getPickModifiers())) return !1;
        var t = this.viewport.pickElement(e.viewPoint);
        return this.onPick(t, e)
    }, o.prototype.onModelMotion = function (e) {
        return this.clearMouseovered(), !0
    }, o.prototype.onModelNoMotion = function (e) {
        return this.onModelMotionStopped(e)
    }, o.prototype.onModelMotionStopped = function (e) {
        if (i.Mouse == e.inputSource) {
            var t = Date.now() - this.lastMotion,
                n = !this.haveFlashed && t > this.flashDelay,
                o = !this.haveTooltip && t > this.tooltipDelay;
            if (!n && !o) return !0;
            var a = this.viewport.pickEntity(e.viewPoint),
                s = this.viewport.pickedEntityToElement(a),
                u = !1;
            if (!r.isValidElement(s) && !n) {
                var c = this.viewport.pickedEntityToModelId(a);
                Cesium.defined(c) && (u = !0, s = {
                    modelId: c
                })
            }
            return n ? (this.haveFlashed = !0, this.viewport.selectionSet.setFlashed(s), !0) : (this.haveTooltip = !0, this.clearTooltip(), Cesium.defined(s) && this.updateTooltip(e.viewPoint, s, u), !0)
        }
    }, o.prototype.updateTooltip = function (e, t, n) {
        n ? this.populateDefaultTooltip(this.tooltip, e, t) : this.populateTooltip(this.tooltip, e, t), this.tooltip.firstChild && (this.tooltip.style.left = e.x + 10 + "px", this.tooltip.style.top = e.y + 20 + "px", this.tooltip.className = "bim-viewer-tooltip")
    }, o.prototype.populateDefaultTooltip = function (e, t, n) {
        var r = this.viewport.bim,
            i = Cesium.defined(n.categoryId) ? r.categories[n.categoryId] : void 0,
            o = Cesium.defined(n.modelId) ? r.models[n.modelId].name : void 0;
        if (Cesium.defined(i)) {
            var a = document.createElement("div");
            a.textContent = "Category: " + i, e.appendChild(a)
        }
        if (Cesium.defined(o)) {
            var s = document.createElement("div");
            s.textContent = "Model: " + o, e.appendChild(s)
        }
    }, o.prototype.populateTooltip = function (e, t, n) {
        this.populateDefaultTooltip(e, t, n)
    }, o.prototype.onCleanup = function () {
        this.clearMouseovered()
    }, o.prototype.clearMouseovered = function () {
        this.lastMotion = Date.now(), this.haveFlashed = this.haveTooltip = !1, this.clearTooltip(), this.viewport.selectionSet.setFlashed(void 0)
    }, o.prototype.clearTooltip = function () {
        if (Cesium.defined(this.tooltip)) {
            for (; this.tooltip.firstChild;) this.tooltip.removeChild(this.tooltip.firstChild);
            this.tooltip.className = "bim-hidden"
        }
    }, o.prototype.onSuspended = function () {
        this.clearMouseovered()
    }, o.prototype.onResumed = function () {
        this.clearMouseovered()
    }, o
})