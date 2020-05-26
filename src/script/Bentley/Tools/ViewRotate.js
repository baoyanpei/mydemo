define("ViewRotate", ["./ViewingToolHandle", "../Util/extend", "../Math/Cartesian3", "./ViewHandleType", "./ViewManipHitPriority", "../Bim/Frustum", "./ViewToolSettings", "../Math/Matrix3", "../Math/Matrix4", "./Cursor"], function (e, t, n, r, i, o, a, s, u, c) {
    function l(t) {
        e.call(this, t), this.handleType = r.ViewRotate, this.ballVector0 = new n, this.lastPtNpc = new n, this.firstPtNpc = new n, this.frustum = new o, this.activeFrustum = new o
    }
    t(e, l);
    var f = {
        firstPoint: {
            pickPt: new n,
            pickPtOrig: new n,
            viewPt: new n
        },
        doManipulation: {
            ptNpc: new n,
            currentFrustum: new o,
            currPt: new n
        }
    };
    return l.prototype.getHandleCursor = function () {
        return c.Rotate
    }, l.prototype.testHandleForHit = function (e) {
        var t = this.viewport.worldToView(this.viewTool.targetCenterWorld),
            n = t.distanceXY(e);
        if (!(this.viewTool.useSphere && this.viewport.allow3dManipulations && n > this.viewTool.ballRadius + 3)) return {
            distance: n,
            priority: i.Normal
        }
    }, l.prototype.firstPoint = function (e) {
        if (this.viewport.toolAdmin.isGesturePending) return !1;
        var t;
        this.viewport.allow3dManipulations && (t = this.viewport.pickDepthBuffer(e.viewPoint, f.firstPoint.pickPt)), Cesium.defined(t) ? this.viewTool.setTargetCenterWorld(t) : t = e.point.clone(f.firstPoint.pickPt);
        var n = t.clone(f.firstPoint.pickPtOrig),
            r = this.viewport.worldToView(t, f.firstPoint.viewPt);
        return this.viewTool.viewPtToSpherePt(r, !0, this.ballVector0), this.viewport.worldToNpc(n, this.firstPtNpc), this.lastPtNpc.copyFrom(this.firstPtNpc), this.viewport.getWorldFrustum(this.activeFrustum), this.frustum.copyFrom(this.activeFrustum), !0
    }, l.prototype.doManipulation = function (e, t) {
        var r = this.viewport,
            i = r.worldToNpc(e.point, f.doManipulation.ptNpc);
        if (this.lastPtNpc.isEqual(i, 1e-10)) return !0;
        this.firstPtNpc.isEqual(i, .01) && i.copyFrom(this.firstPtNpc), this.lastPtNpc.copyFrom(i);
        var o = r.getWorldFrustum(f.doManipulation.currentFrustum),
            u = !o.equals(this.activeFrustum);
        if (u) this.frustum.copyFrom(o);
        else if (!r.setupFromFrustum(this.frustum)) return !1;
        var c = r.npcToView(i, f.doManipulation.currPt);
        u && (this.firstPtNpc.copyFrom(i), this.viewTool.viewPtToSpherePt(c, !0, this.ballVector0));
        var l = 0,
            h = new n,
            p = this.viewTool.targetCenterWorld;
        if (this.viewTool.useSphere || !r.allow3dManipulations) {
            var m = this.viewTool.viewPtToSpherePt(c, !0),
                d = new n;
            l = this.viewTool.ballPointsToMatrix(void 0, d, this.ballVector0, m);
            var v = r.rotMatrix,
                g = v.getRow(0),
                y = v.getRow(1),
                w = v.getRow(2);
            h.sumOf3ScaledVectors(n.ZERO, g, d.x, y, d.y, w, d.z)
        } else {
            var x = r.getViewRect(),
                b = x.width,
                C = x.height,
                c = r.npcToView(i),
                M = r.npcToView(this.firstPtNpc),
                T = c.x - M.x,
                N = c.y - M.y,
                E = a.preserveWorldUp ? this.viewTool.worldUpVector.clone() : r.rotMatrix.getRow(1),
                A = r.rotMatrix.getRow(0),
                S = new s;
            T ? S.initFromVectorAndRotationAngle(E, Math.PI / (b / T)) : S.initIdentity();
            var P = new s;
            N ? P.initFromVectorAndRotationAngle(A, Math.PI / (C / N)) : P.initIdentity();
            var O = s.fromProduct(P, S);
            l = -O.getRotationAngleAndVector(h)
        }
        return this.rotateViewWorld(p, h, l), r.getWorldFrustum(this.activeFrustum), !0
    }, l.prototype.rotateViewWorld = function (e, t, n) {
        var r = s.fromVectorAndRotationAngle(t, n),
            i = u.fromMatrixAndFixedPoint(r, e),
            o = this.frustum.clone();
        o.multiply(i), this.viewport.setupFromFrustum(o), this.viewport.moveViewToSurfaceIfRequired()
    }, l
})