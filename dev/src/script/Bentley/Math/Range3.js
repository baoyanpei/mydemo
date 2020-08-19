define("Range3", ["./Cartesian3"], function (e) {
    function t(t, n) {
        this.low = Cesium.defined(t) ? t.clone() : new e, this.high = Cesium.defined(n) ? n.clone() : new e
    }
    return t.from2Points = function (e, n, r) {
        var i = Cesium.defined(r) ? r : new t;
        return i.initFrom2Points(e, n), i
    }, t.prototype.volume = function () {
        return Cesium.defined(this.low) && Cesium.defined(this.high) ? (this.high.x - this.low.x) * (this.high.y - this.low.y) * (this.high.z - this.low.z) : 0
    }, t.prototype.initFrom2Points = function (e, t) {
        this.low = e.clone(this.low), this.high = e.clone(this.high), this.extend(t)
    }, t.fromArray = function (e) {
        for (var n = e.length, r = n > 0 ? e[0] : void 0, i = n > 1 ? e[1] : r, o = new t(r, i), a = 2; a < e.length; a++) o.extend(e[a]);
        return o
    }, t.prototype.extend = function (e) {
        var t = this.low,
            n = this.high;
        t.x = Math.min(t.x, e.x), t.y = Math.min(t.y, e.y), t.z = Math.min(t.z, e.z), n.x = Math.max(n.x, e.x), n.y = Math.max(n.y, e.y), n.z = Math.max(n.z, e.z)
    }, t.prototype.union = function (e) {
        this.extend(e.low), this.extend(e.high)
    }, t.fromUnionOf = function (e, t) {
        var n = e.clone();
        return n.union(t.clone()), n
    }, t.prototype.getCenter = function (t) {
        var n = Cesium.defined(t) ? t : new e;
        return n.x = this.low.x + (this.high.x - this.low.x) / 2, n.y = this.low.y + (this.high.y - this.low.y) / 2, n.z = this.low.z + (this.high.z - this.low.z) / 2, n
    }, t.prototype.get8Corners = function () {
        for (var t = [this.low.clone(), this.high.clone()], n = [new e, new e, new e, new e, new e, new e, new e, new e], r = 0, i = 0; i < 2; i++)
            for (var o = 0; o < 2; o++)
                for (var a = 0; a < 2; a++) n[r].x = t[a].x, n[r].y = t[o].y, n[r].z = t[i].z, r++;
        return n
    }, t.prototype.copyFrom = function (e) {
        this.low.copyFrom(e.low), this.high.copyFrom(e.high)
    }, t.prototype.clone = function () {
        var e = new t;
        return e.copyFrom(this), e
    }, Cesium.defineProperties(t.prototype, {
        diagonalDistance: {
            get: function () {
                return this.low.distance(this.high)
            }
        }
    }), t
})