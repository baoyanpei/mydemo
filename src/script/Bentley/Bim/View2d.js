
define("View2d", ["./View", "../Math/Cartesian3", "../Util/extend", "../Math/Range3"], function (e, t, n, r) {
    function i(t, n) {
        e.call(this, t, n)
    }
    return n(e, i), i.prototype.toView2d = function () {
        return this
    }, i.prototype.setOrigin = function (e) {
        this.origin.x = e.x, this.origin.y = e.y
    }, i.prototype.setExtents = function (e) {
        this.extents.x = e.x, this.extents.y = e.y
    }, i.prototype.setRotation = function (e) {
        var t = e.getColumn(0),
            n = Math.atan2(t.y, t.x);
        this.rotation.initFromAxisAndRotationAngle(2, n)
    }, i.prototype.adjustAspectRatio = function (n, r) {
        var i = this.extents;
        i.x = Math.abs(i.x), i.y = Math.abs(i.y);
        var o = Math.max(i.x, i.y);
        0 == o && (i.x = i.y = 100), 0 == i.x && (i.x = o), 0 == i.y && (i.y = o);
        var a = i.x / i.y;
        if (!(Math.abs(1 - a / n) < 1e-9)) {
            var s = i.clone();
            if (r || (a > 1 ? i.y = i.x : i.x = i.y), r ? a > n : n > 1) {
                var u = i.x / n;
                u < e.maxViewDelta ? i.y = u : (i.y = e.maxViewDelta, i.x = e.maxViewDelta * n)
            } else {
                var u = i.y * n;
                u < e.maxViewDelta ? i.x = u : (i.x = e.maxViewDelta, i.y = e.maxViewDelta / n)
            }
            var c = new t,
                l = this.rotation.clone();
            l.multiply(this.origin, c), c.x += (s.x - i.x) / 2, c.y += (s.y - i.y) / 2, l.transposeOf(l), l.multiply(c, this.origin)
        }
    }, i.prototype.init = function () {
        if (!Cesium.defined(this.fov)) {
            this.fov = .01;
            var t = this.getViewedExtents(),
                n = t.diagonalDistance,
                r = n / Math.tan(this.fov),
                i = 5e4;
            r > i && (this.fov = 2 * Math.atan2(n / 2, i))
        }
        return e.prototype.init.call(this)
    }, i.prototype.getViewedExtents = function (e) {
        var t = this.models[0],
            n = this.bim.models[t],
            i = Cesium.defined(e) ? e : new r;
        return i.copyFrom(n.extents), i
    }, i
})