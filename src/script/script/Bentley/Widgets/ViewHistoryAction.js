define("ViewHistoryAction", ["../Util/extend", "./Action"], function (e, t) {
    function n(e, n) {
        var r = n ? "Undo" : "Redo",
            i = n ? "bim-icon-viewprevious" : "bim-icon-viewnext";
        t.call(this, r, i), this.viewport = e, this.isUndo = n, this.evaluateMembers();
        var o = this;
        e.historyApplied.addEventListener(function () {
            o.evaluateMembers()
        }), e.historyChanged.addEventListener(function () {
            o.evaluateMembers()
        })
    }
    return e(t, n), n.prototype.evaluateMembers = function () {
        var e = this.viewport;
        this.enabled = this.isUndo ? e.isUndoPossible : e.isRedoPossible, this.tooltipText = this.enabled ? this.name : "Nothing to " + this.name
    }, n.prototype.activate = function () {
        return this.isUndo ? this.viewport.applyPrevious() : this.viewport.applyNext(), !1
    }, n
})