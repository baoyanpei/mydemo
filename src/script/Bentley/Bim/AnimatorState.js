define("AnimatorState", ["./Frustum", "../Math/Cartesian3", "../Math/Constants", "../Math/Range3", "./NpcCorners"], function (e, t, n, r, i) {
    function o(e, r, o) {
        this.init(r), this.animationTime = e, this.destViewBox = o, this.startLoc = t.fromInterpolate(this.initialViewBox.getCorner(i.NPC_000), .5, this.initialViewBox.getCorner(i.NPC_111)), this.endLoc = t.fromInterpolate(this.destViewBox.getCorner(i.NPC_000), .5, this.destViewBox.getCorner(i.NPC_111)), this.hasTranslation = t.distanceSquared(this.startLoc, this.endLoc) > n.mgds_fc_epsilon, this.hasTranslation && this.xVec.differenceOf(this.endLoc, this.startLoc)
    }
    return o.prototype.init = function (n) {
        this.initialViewBox = n, this.intermediateBox = new e, this.destViewBox = new e, this.frameBox = new e, this.segment1scale = 1, this.segment2scale = 1, this.hasTranslation = !1, this.firstSegmentTime = 0, this.fraction = 0, this.startLoc = new t, this.endLoc = new t, this.xVec = new t, this.rotationPoint = new t
    }, o.prototype.computeScaleTranslationTimeFactor = function (e, t) {
        var n = r.fromArray(e.pts),
            i = r.fromArray(t.pts),
            o = r.fromUnionOf(n, i);
        return o.volume() / n.volume() - 1
    }, o.prototype.hasNoTransformation = function () {
        return !(Math.abs(1 - this.segment2scale * this.segment1scale) > n.mgds_fc_epsilon) && !this.hasTranslation
    }, o.prototype.setUpLinearInterpolatedFrustum = function (e, t, n, r) {
        for (var a = 0; a < i.CornerCount; a++) this.frameBox.getCorner(a).interpolate(e.getCorner(a), this.fraction, t.getCorner(a));
        o.setUpFromFrustum(this.frameBox, r)
    }, o.setUpFromFrustum = function (e, t) {
        t.setupFromFrustum(e)
    }, o
})