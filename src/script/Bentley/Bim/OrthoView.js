define("OrthoView", ["./View", "../Math/Cartesian3", "../Util/extend", "./SpatialView"], function (e, t, n, r) {
    function i(e, t) {
        r.call(this, e, t), this.fov = .01
    }
    return n(r, i), i.prototype.clone = function () {
        var e = new i(void 0, this.bim);
        return e.copyFrom(this), e
    }, i.prototype.equals = function (e) {
        return this.isEqual(e)
    }, i.prototype.toOrthographicView = function () {
        return this
    }, i
})