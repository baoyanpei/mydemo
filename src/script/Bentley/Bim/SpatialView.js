define("SpatialView", ["./View", "../Math/Cartesian3", "../Util/extend", "../Math/Range3"], function (e, t, n, r) {
    function i(t, n) {
        e.call(this, t, n)
    }
    return n(e, i), i.prototype.adjustAspectRatio = function (t, n) {
        var r = this.origin,
            i = this.extents,
            o = this.rotation;
        i.x = Math.abs(i.x), i.y = Math.abs(i.y), i.z = Math.abs(i.z);
        var a = Math.max(i.x, i.y);
        0 == a && (i.x = i.y = 100), 0 == i.x && (i.x = a), 0 == i.y && (i.y = a);
        var s = i.x / i.y;
        if (!(Math.abs(1 - s / t) < 1e-9)) {
            var u = i.clone();
            if (n || (s > 1 ? i.y = i.x : i.x = i.y), n ? s > t : t > 1) {
                var c = i.x / t;
                c < e.maxViewDelta ? i.y = c : (i.y = e.maxViewDelta, i.x = e.maxViewDelta * t)
            } else {
                var c = i.y * t;
                c < e.maxViewDelta ? i.x = c : (i.x = e.maxViewDelta, i.y = e.maxViewDelta / t)
            }
            var l = r.clone();
            o.multiply(l), l.x += (u.x - i.x) / 2, l.y += (u.y - i.y) / 2, o.multiplyTranspose(r, l)
        }
    }, i.prototype.toSpatialView = function () {
        return this
    }, i.prototype.setOrigin = function (e) {
        this.origin.copyFrom(e)
    }, i.prototype.setRotation = function (e) {
        this.rotation.copyFrom(e)
    }, i.prototype.setExtents = function (e) {
        this.extents.copyFrom(e)
    }, i.prototype.getViewedExtents = function (e) {
        var t = Cesium.defined(e) ? e : new r;
        return t.copyFrom(this.bim.projectExtents), t
    }, i.prototype.enableCamera = function () {}, i.prototype.turnCameraOff = function () {}, Cesium.defineProperties(i.prototype, {
        supportsCamera: {
            get: function () {
                return !1
            }
        }
    }), i
})
