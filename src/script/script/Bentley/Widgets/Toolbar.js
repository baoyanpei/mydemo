define("Toolbar", [], function () {
    function e(e) {
        this.viewer = e, this.toolbarButtons = [], this.actions = [];
        var t = document.createElement("div");
        t.className = "bim-toolzone", this.container = t;
        var n = document.createElement("div");
        n.className = "bim-app-button", t.appendChild(n), this.cornerContainer = n;
        var r = document.createElement("i");
        r.className = "bim-icon-appicon", n.appendChild(r);
        var i = document.createElement("div");
        i.className = "bim-toolbar bim-toolbar-horizontal", t.appendChild(i), this.topContainer = i;
        var o = document.createElement("div");
        o.className = "bim-toolbar bim-toolbar-vertical", t.appendChild(o), this.leftContainer = o;
        var a = document.createElement("div");
        a.className = "bim-toolzone-content-container", t.appendChild(a), this.contentContainer = a, e.element.appendChild(t), this.container = t, this.activeContentChanged = new Cesium.Event
    }
    return e.prototype.addToolbarButton = function (e, t) {
        this.toolbarButtons.push(e)
    }, e.prototype.setPanelPosition = function (e) {
        var t = this.topContainer.offsetLeft,
            n = this.toolbarButtons.indexOf(e),
            r = t + 38 * n + 1,
            i = e.content.parentElement.offsetLeft,
            o = r - i;
        e.content.style.left = o + "px";
        var a = o + 19 - e.content.clientWidth / 2;
        a <= 0 && (a = o), e.content.style.marginLeft = "-" + a + "px"
    }, e.prototype.closeActiveContent = function () {
        for (var e = 0; e < this.toolbarButtons.length; e++) {
            var t = this.toolbarButtons[e];
            t.dropDownVisible = !1, t.content.className = "bim-panel bim-toolzone-content-wrapper-inactive"
        }
    }, e.prototype.toggleActiveContent = function (e) {
        e.dropDownVisible ? e.content.className = "bim-panel bim-toolzone-content-wrapper-inactive" : (this.closeActiveContent(), e.content.className = "bim-panel bim-toolzone-content-wrapper", this.setPanelPosition(e)), e.dropDownVisible = !e.dropDownVisible, this.activeContentChanged.raiseEvent(this, e.dropDownVisible ? e : void 0)
    }, e.prototype.createActionButton = function (e) {
        var t = document.createElement("i");
        t.className = e.icon;
        var n = document.createElement("div");
        n.appendChild(t), n.className = "bim-toolbar-tool", n.setAttribute("data-bind", 'attr: {title: tooltipText}, css: { "bim-toolbar-disabled": !enabled, "bim-active": active }');
        var r = this;
        return n.onclick = function () {
            r.onActionClick(e)
        }, Cesium.knockout.applyBindings(e, n), n
    }, e.prototype.addActionButton = function (e) {
        var t = this.createActionButton(e);
        return this.leftContainer.appendChild(t), this.actions.push(e), t
    }, e.prototype.onActionClick = function (e) {
        if (e.enabled) return e.active ? (e.deactivate(), void(e.active = !1)) : void(e.active = e.activate())
    }, e
})