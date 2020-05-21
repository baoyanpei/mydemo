define("Map4", ["./Cartesian3", "./Matrix4"], function (e, t) {
    function n() {
        this.m0 = new t, this.m1 = new t, this.initIdentity()
    }
    return n.frustumFractionLimit = 1e-8, n.flatViewTolerance = 1e-8, n.prototype.initIdentity = function () {
        t.clone(t.IDENTITY, this.m0), t.clone(t.IDENTITY, this.m1)
    }, n.clone = function (e, n) {
        t.clone(e.m0, n.m0), t.clone(e.m1, n.m1)
    }, n.prototype.initFromTransform = function (e, n) {
        var r = new t,
            i = !0;
        try {
            r = t.inverse(e, r)
        } catch (e) {
            i = !1, t.clone(t.IDENTITY, r)
        }
        return n ? (t.clone(e, this.m1), t.clone(r, this.m0)) : (t.clone(e, this.m0), t.clone(r, this.m1)), i
    }, n.prototype.initProduct = function (e, n) {
        t.multiply(e.m0, n.m0, this.m0), t.multiply(n.m1, e.m1, this.m1)
    }, n.prototype.initFromVectorFrustum = function (e, r, i, o, a) {
        var s = new n,
            u = new n;
        a < n.frustumFractionLimit && (a = n.frustumFractionLimit);
        var c = new t(r.x, i.x, o.x, e.x, r.y, i.y, o.y, e.y, r.z, i.z, o.z, e.z, 0, 0, 0, 1);
        return s.initFromTransform(c, !0) ? (Math.abs(a - 1) > n.flatViewTolerance ? (u.m0.setRowValues(2, 0, 0, a, 0), u.m0.setRowValues(3, 0, 0, a - 1, 1), u.m1.setRowValues(2, 0, 0, 1 / a, 0), u.m1.setRowValues(3, 0, 0, (1 - a) / a, 1), this.initProduct(u, s)) : n.clone(s, this), !0) : (this.initIdentity(), !1)
    }, n.mapBetweenBoxes = function (e, t, n, r, i, o) {
        var a = r.x - n.x,
            s = r.y - n.y,
            u = r.z - n.z;
        return 0 != a && 0 != s && 0 != u && (t.x = (o.x - i.x) / a, t.y = (o.y - i.y) / s, t.z = (o.z - i.z) / u, e.x = i.x - t.x * n.x, e.y = i.y - t.y * n.y, e.z = i.z - t.z * n.z, !0)
    }, n.fromRanges = function (e, t, r, i) {
        var o = new n;
        return o.initFromRanges(e, t, r, i) ? o : void 0
    }, n.prototype.initFromRanges = function (t, r, i, o) {
        var a = new e,
            s = new e,
            u = new e,
            c = new e;
        return n.mapBetweenBoxes(u, a, t, r, i, o) && n.mapBetweenBoxes(c, s, i, o, t, r) ? (this.m0.initScaleAndTranslate(a, u), this.m1.initScaleAndTranslate(s, c), !0) : (this.initIdentity(), !1)
    }, n
})