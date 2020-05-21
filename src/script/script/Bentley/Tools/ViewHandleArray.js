define("scripts/Bentley/Tools/ViewHandleArray", ["../Util/foreach", "./ViewManipHitPriority", "./ViewHandleType"], function (e, t, n) {
    function r(e) {
        this.viewTool = e, this.handles = [], this.empty()
    }
    return r.prototype.empty = function () {
        this.focus = -1, this.focusDrag = !1, this.hitHandleIndex = -1, this.handles.length = 0
    }, r.prototype.add = function (e) {
        this.handles.push(e)
    }, r.prototype.get = function (e) {
        return e >= 0 && e < this.count ? this.handles[e] : void 0
    }, r.prototype.testHit = function (e, r) {
        r = Cesium.defaultValue(r, n.None), this.hitHandleIndex = -1;
        for (var i, o = 0, a = !1, s = t.Low, u = 0; u < this.count; u++) {
            var c = this.handles[u];
            if (Cesium.defined(c))
                if (r != n.None) {
                    if (c.handleType == r) return this.hitHandleIndex = u, !0
                } else {
                    var l = c.testHandleForHit(e);
                    if (!Cesium.defined(l)) continue;
                    l.priority >= s && (l.priority > s && (a = !1), s = l.priority, (!a || l.distance < o) && (a = !0, o = l.distance, i = c, this.hitHandleIndex = u))
                }
        }
        return Cesium.defined(i)
    }, r.prototype.focusHitHandle = function () {
        this.setFocus(this.hitHandleIndex)
    }, r.prototype.setFocus = function (e) {
        if (this.focus != e || this.focusDrag != this.viewTool.isDragging) {
            var t;
            this.focus >= 0 && (t = this.get(this.focus), Cesium.defined(t) && t.focusOut()), e >= 0 && (t = this.get(e), Cesium.defined(t) && t.focusIn()), this.focus = e, this.focusDrag = this.viewTool.isDragging
        }
    }, Cesium.defineProperties(r.prototype, {
        count: {
            get: function () {
                return this.handles.length
            }
        },
        viewport: {
            get: function () {
                return this.viewTool.viewport
            }
        },
        hitHandle: {
            get: function () {
                return this.get(this.hitHandleIndex)
            }
        },
        focusHandle: {
            get: function () {
                return this.get(this.focusHandle)
            }
        }
    }), r.prototype.onReinitialize = function () {
        e(this.handles, function (e) {
            Cesium.defined(e) && e.onReinitialize()
        })
    }, r.prototype.hasHandle = function (e) {
        for (var t = 0; t < this.count; t++) {
            var n = this.get(t);
            if (Cesium.defined(n) && n.handleType == e) return !0
        }
        return !1
    }, r.prototype.getHandleByType = function (e) {
        for (var t = 0; t < this.count; t++) {
            var n = this.get(t);
            if (n.handleType == e) return n
        }
    }, r.prototype.motion = function (t) {
        return e(this.handles, function (e) {
            Cesium.defined(e) && e.motion(t)
        }), !0
    }, r
})