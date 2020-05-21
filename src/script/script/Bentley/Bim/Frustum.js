define("Frustum", ["../Math/Cartesian3", "../Math/Range3", "./NpcCorners"], function (e, t, n) {
    function r() {
        this.pts = [new e, new e, new e, new e, new e, new e, new e, new e]
    }
    return r.clone = function (t, n) {
        Cesium.defined(n) || (n = new r);
        for (var i = 0; i < t.pts.length; i++) e.clone(t.pts[i], n.pts[i]);
        return n
    }, r.prototype.clone = function (e) {
        return r.clone(this, e)
    }, r.prototype.copyFrom = function (e) {
        e.clone(this)
    }, r.prototype.getCorner = function (e) {
        if (e < 0 || e > 7) throw new Cesium.DeveloperError("Invalid Index");
        return this.pts[e]
    }, r.prototype.multiply = function (e) {
        e.multiplyArray(this.pts)
    }, r.prototype.translate = function (e) {
        for (var t = 0; t < this.pts.length; t++) this.pts[t].add(e)
    }, r.prototype.transformBy = function (e, t) {
        return Cesium.defined(t) || (t = new r), e.multiplyArray(this.pts, t.pts), t
    }, r.prototype.toRange = function () {
        return t.fromArray(this.pts)
    }, r.prototype.invalidate = function () {
        for (var e = 0; e < this.pts.length; e++) {
            var t = this.pts[e];
            t.x = t.y = t.z = 0
        }
    }, r.prototype.equals = function (e) {
        for (var t = 0; t < this.pts.length; t++)
            if (!this.pts[t].equals(e.pts[t])) return !1;
        return !0
    }, r.fromRange = function (e) {
        var t = new r;
        return t.initFromRange(e), t
    }, r.prototype.initFromRange = function (e) {
        this.pts[0].x = this.pts[3].x = this.pts[4].x = this.pts[7].x = e.low.x, this.pts[1].x = this.pts[2].x = this.pts[5].x = this.pts[6].x = e.high.x, this.pts[0].y = this.pts[1].y = this.pts[4].y = this.pts[5].y = e.low.y, this.pts[2].y = this.pts[3].y = this.pts[6].y = this.pts[7].y = e.high.y, this.pts[0].z = this.pts[1].z = this.pts[2].z = this.pts[3].z = e.low.z, this.pts[4].z = this.pts[5].z = this.pts[6].z = this.pts[7].z = e.high.z
    }, r.prototype.getCenter = function (t) {
        return Cesium.defined(t) || (t = new e), t.interpolate(this.pts[n.Last], .5, this.pts[n.First]), t
    }, r
})