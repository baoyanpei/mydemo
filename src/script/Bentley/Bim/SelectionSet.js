define("SelectionSet", ["./Element", "../Util/isCollectionEmpty"], function (e, t) {
    function n(e) {
        this.elements = {}, this.bim = e, this.changed = new Cesium.Event, this.flashed = void 0, this.flashChanged = new Cesium.Event
    }
    return n.prototype.raiseChanged = function () {
        this.changed.raiseEvent(this)
    }, n.prototype.raiseFlashChanged = function () {
        this.flashChanged.raiseEvent(this)
    }, n.prototype.isElementSelected = function (t) {
        return !!e.isValidElement(t) && this.isElementIdSelected(t.elementId)
    }, n.prototype.isElementIdSelected = function (e) {
        for (var t in this.elements)
            if (t == e) return !0;
        return !1
    }, n.prototype.getSingleSelectedElement = function () {
        var e = void 0;
        for (var t in this.elements) {
            if (Cesium.defined(e)) return;
            e = this.elements[t]
        }
        return e
    }, n.prototype._setElementSelected = function (t, n) {
        return !!e.isValidElement(t) && (n = Cesium.defaultValue(n, !0), this.isElementSelected(t) != n && (n ? this.elements[t.elementId] = t : delete this.elements[t.elementId], !0))
    }, n.prototype.setElementSelected = function (e, t) {
        this._setElementSelected(e, t) && this.raiseChanged()
    }, n.prototype.addElement = function (e) {
        this.setElementSelected(e, !0)
    }, n.prototype.removeElement = function (e) {
        this.setElementSelected(e, !1)
    }, n.prototype.toggleElement = function (e) {
        this.setElementSelected(e, !this.isElementSelected(e))
    }, n.prototype.isEmpty = function () {
        return t(this.elements)
    }, n.prototype.setFlashed = function (e) {
        this.flashed != e && (this.flashed = e, this.raiseFlashChanged())
    }, n.prototype._clear = function () {
        return !this.isEmpty() && (this.elements = {}, !0)
    }, n.prototype.clear = function () {
        this._clear() && this.raiseChanged()
    }, n.prototype.setSelectedElement = function (t) {
        Cesium.defined(t) ? e.isValidElement(t) && (this._clear(), this.setElementSelected(t)) : this.clear()
    }, n.prototype.setSelectedElements = function (e) {
        var t = this._clear();
        foreach(e, function (e) {
            t |= this._setElementSelected(e)
        }), t && this.raiseChanged()
    }, n.prototype.setElementsSelected = function (e, t) {
        var n = !1;
        foreach(e, function (e) {
            n |= this._setElementSelected(e, t)
        }), n && this.raiseChanged()
    }, n.prototype.addElements = function (e) {
        this.setElementsSelected(e, !0)
    }, n.prototype.removeElements = function (e) {
        this.setElementsSelected(e, !1)
    }, n
})