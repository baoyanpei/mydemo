define("PropertyGrid", [], function () {
    function e(e, t) {
        this.noPropertiesMessage = e, this.element = document.createElement("div"), this.hideNull = Cesium.defaultValue(t, !0), this.collapsedCategories = {}, this.contentChanged = new Cesium.Event, this.update(void 0)
    }
    return e.prototype.raiseContentChanged = function () {
        this.contentChanged.raiseEvent(this)
    }, e.prototype.update = function (e) {
        if ("string" == typeof e) return this.element.innerHTML = e, void this.raiseContentChanged();
        if (!Cesium.defined(e) || !Array.isArray(e) || e.length <= 0 || !Cesium.defined(e[0].category) || !Cesium.defined(e[0].properties)) return this.element.innerHTML = this.noPropertiesMessage, void this.raiseContentChanged();
        for (; this.element.firstChild;) this.element.removeChild(this.element.firstChild);
        var t = document.createElement("table");
        t.className = "bim-propgrid";
        for (var n = [], r = 0; r < e.length; r++) {
            var i = e[r],
                o = i.category,
                a = this.createGroupRow(t, o);
            t.appendChild(a), Cesium.defined(this.collapsedCategories[o]) && n.push(a);
            for (var s = i.properties, u = 0; u < s.length; u++) {
                var c = s[u],
                    l = c.value;
                if ("object" == typeof l && "Code" === c.label) {
                    var f = c.value;
                    l = null != f && void 0 != f ? f.Value : null
                }
                if (!this.hideNull || null !== l && void 0 !== l) {
                    var h = document.createElement("tr");
                    h.className = "bim-propgrid-row", t.appendChild(h);
                    var p = document.createElement("td");
                    p.className = "bim-propgrid-cell-label", p.textContent = c.label, h.appendChild(p);
                    var m = document.createElement("td");
                    m.className = "bim-propgrid-cell-value", m.textContent = l, h.appendChild(m)
                }
            }
        }
        for (var r = 0; r < n.length; r++) this.expandOrCollapseCategory(t, n[r]);
        this.element.appendChild(t), this.raiseContentChanged()
    }, e.prototype.createGroupRow = function (e, t) {
        var n = document.createElement("tr");
        n.className = "bim-propgrid-row-group", e.appendChild(n);
        var r = document.createElement("td");
        r.className = "bim-propgrid-cell-group", r.setAttribute("colspan", 2);
        var i = document.createElement("span");
        i.className = "bim-expand-collapse-icon", r.appendChild(i), r.appendChild(document.createTextNode(t)), n.appendChild(r);
        var o = this;
        return n.onclick = function () {
            o.expandOrCollapseCategory(e, n)
        }, n.setAttribute("title", "Click to collapse"), n
    }, e.prototype.expandOrCollapseCategory = function (e, t) {
        var n = "bim-propgrid-row-group" == t.className;
        t.className = n ? "bim-propgrid-row-group-collapsed" : "bim-propgrid-row-group", t.setAttribute("title", n ? "Click to expand" : "Click to collapse");
        for (var r = n ? "bim-propgrid-row" : "bim-hidden", i = t.nextSibling, o = !0; i;) {
            if (i.className != r) {
                o = !1;
                break
            }
            i.className = n ? "bim-hidden" : "bim-propgrid-row", i = i.nextSibling
        }
        var a = t.firstChild.textContent;
        n ? this.collapsedCategories[a] = a : delete this.collapsedCategories[a], this.raiseContentChanged()
    }, e
})