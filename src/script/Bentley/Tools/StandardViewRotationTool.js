define("StandardViewRotationTool", ["./ViewTool", "./ToolId", "../Math/Cartesian3", "../Math/Matrix3", "../Util/extend", "../Bim/Frustum", "../Math/Matrix4", "../Bim/StandardView"], function (e, t, n, r, i, o, a, s) {
    function u(n, r) {
        e.call(this, n, t.StandardViewRotation), this.stdView = r
    }
    i(e, u), u.prototype.onDataButtonDown = function (e) {
        return this.updateViewRotation(), !0
    }, u.prototype.onPostInstall = function () {
        return this.updateViewRotation(), !0
    };
    var c = new n,
        l = new n,
        f = new n;
    u.prototype.getStandardViewRotation = function (e) {
        Cesium.defined(e) || (e = new r), e.copyFrom(this.stdView);
        var t = c,
            n = l,
            i = f;
        t.init(0, 0, -1), n.init(0, 1, 0), i.init(1, 0, 0), r.multiplyByVector(e, t, t), r.multiplyByVector(e, n, n), r.multiplyByVector(e, i, i);
        var o = this.viewport.geometry.rootTransform;
        return a.multiplyByPointAsVector(o, t, t), a.multiplyByPointAsVector(o, n, n), a.multiplyByPointAsVector(o, i, i), t.normalize(), t.negate(), n.normalize(), i.normalize(), e.setRow(0, i), e.setRow(1, n), e.setRow(2, t), e
    };
    var h = new r,
        p = new o,
        m = new a,
        d = new a;
    return u.prototype.updateViewRotation = function () {
        if (this.viewport.allow3dManipulations || this.stdView == s.Top) {
            var t = this.viewport.getWorldFrustum(),
                n = this.viewport.getWorldFrustum(p),
                r = this.viewport.determineDefaultRotatePoint(),
                i = a.fromMatrixAndFixedPoint(this.viewport.rotMatrix, r, m);
            n.multiply(i);
            var o = this.getStandardViewRotation(h),
                u = a.fromMatrixAndFixedPoint(o, r, d);
            u.inverseOf(u), n.multiply(u);
            var c = this.viewport.setupFromFrustum(n);
            this.viewport.synchWithView(!1), this.viewport.fitView(!0, c), e.animateFrustumChange(this.viewport, t, this.viewport.getWorldFrustum()), this.exitTool()
        }
    }, u
})