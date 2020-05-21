define("ViewManip", ["./ViewHandleArray", "./ViewHandleType", "./ViewingToolHandle", "./ViewTool", "../Util/extend", "../Math/Cartesian3", "../Bim/Frustum", "../Util/dynamicCast", "../Bim/CameraView", "../Math/Matrix3", "../Math/Matrix4", "../Math/Constants", "../Bim/CoordSystem", "../Bim/NpcCorners", "./ViewToolSettings", "./ButtonEvent", "./ViewPan", "./ViewRotate", "./ToolId", "./ViewWalk"], function (e, t, n, r, i, o, a, s, u, c, l, f, h, p, m, d, v, g, y, w) {
    function x(n, i, s, u, c, l) {
        r.call(this, n, Cesium.defaultValue(l, y.ViewManip)), this.handleMask = i, this.isOneShot = s, this.scrollOnNoMotion = u, this.isDragOperationRequired = Cesium.defaultValue(c, !1), this.useSphere = m.dynamicRotationSphere && !s, this.wantMotionStop = !0, this.isDragOperation = !1, this.targetCenterValid = !1, this.lastPtScreen = new o, this.targetCenterWorld = new o, this.ballRadius = 0, this.worldUpVector = new o, this.forcedHandle = t.None, this.lastFrustum = new a, this.viewHandles = new e(this), i & t.ViewPan && this.viewHandles.add(new v(this)), i & t.Rotate && (this.synchViewBallInfo(!0), this.viewHandles.add(new g(this))), i & t.ViewWalk && this.viewHandles.add(new w(this)), this.onReinitialize()
    }
    var b = {
        viewPtToSpherePt: {
            targetCenterView: new o,
            ballMouse: new o
        },
        ballPointsToMatrix: {
            normal: new o
        },
        screenRangeAndFrustum: {
            screenRange: new o,
            frustum: new a,
            testPtView: new o
        },
        updateTargetCenter: {
            center: new o
        },
        zup: {
            viewX: new o,
            viewY: new o,
            viewZ: new o,
            rotMatrix: new c,
            transform: new l,
            frust: new a
        },
        fitView: {
            before: new a
        },
        setTargetCenterWorld: {
            viewPt: new o
        },
        setCameraLensAngle: {
            xVec: new o,
            yVec: new o,
            zVec: new o,
            targetNpc: new o,
            corners: [new o, new o, new o],
            eye: new o
        }
    };
    x.prototype.onReinitialize = function () {
        this.viewport.toolAdmin.gesturePending = !1, this.viewport.synchWithView(!0), this.nPts = 0, this.isDragging = !1, this.frustumValid = !1, this.viewHandles.onReinitialize()
    }, x.prototype.onDataButtonDown = function (e) {
        if (0 == this.nPts && this.isDragOperationRequired && !this.isDragOperation) return !1;
        switch (this.nPts) {
            case 0:
                this.processFirstPoint(e) && (this.nPts = 1);
                break;
            case 1:
                this.nPts = 2
        }
        return this.nPts > 1 && (this.processPoint(e, !1) && this.isOneShot ? this.exitTool() : this.onReinitialize()), !0
    }, x.prototype.onDataButtonUp = function (e) {
        return this.nPts <= 1 && this.isDragOperationRequired && !this.isDragOperation && this.isOneShot && this.exitTool(), !1
    }, x.prototype.onMiddleButtonDown = function (e) {
        return !1
    }, x.prototype.onMiddleButtonUp = function (e) {
        return this.nPts <= 1 && !this.isDragOperation && this.isOneShot && this.exitTool(), !1
    }, x.prototype.onMouseWheel = function (e) {
        var n = e.clone();
        return this.handleMask & t.Rotate && n.setPoint(this.targetCenterWorld), this.viewport.toolAdmin.processMouseWheelEvent(n, !1), this.doUpdate(!0), !0
    }, x.prototype.onModelStartDrag = function (e) {
        return this.isDragOperation = !0, this.viewport.toolAdmin.gesturePending = !1, 0 == this.nPts && this.onDataButtonDown(e), !0
    }, x.prototype.onModelEndDrag = function (e) {
        return this.isDragOperation = !1, 0 == this.nPts || this.onDataButtonDown(e)
    }, x.prototype.onModelMotion = function (e) {
        0 == this.nPts && this.viewHandles.testHit(e.viewPoint) && this.viewHandles.focusHitHandle(), 0 != this.nPts && this.processPoint(e, !0), this.viewHandles.motion(e)
    }, x.prototype.onModelMotionStopped = function (e) {
        0 == this.nPts && this.viewHandles.testHit(e.viewPoint) && this.viewHandles.focusHitHandle()
    }, x.prototype.onModelNoMotion = function (e) {
        if (0 != this.nPts) {
            var t = this.viewHandles.hitHandle;
            Cesium.defined(t) && t.noMotion(e) && this.doUpdate(!1)
        }
    }, x.prototype.onCleanup = function () {
        this.viewport.synchWithView(!0), this.viewHandles.setFocus(-1), this.viewHandles.empty()
    };
    var C = new a;
    x.prototype.isSameFrustum = function () {
        var e = this.viewport.getWorldFrustum(C);
        return !(!this.frustumValid || !e.equals(this.lastFrustum)) || (e.clone(this.lastFrustum), this.frustumValid = !0, !1)
    }, x.prototype.viewPtToSpherePt = function (e, t, n) {
        var r = this.viewport,
            i = this.ballRadius,
            a = r.worldToView(this.targetCenterWorld, b.viewPtToSpherePt.targetCenterView),
            s = b.viewPtToSpherePt.ballMouse;
        s.x = (e.x - a.x) / i, s.y = (e.y - a.y) / i;
        var u = s.x * s.x + s.y * s.y;
        if (u > 1 || !r.allow3dManipulations) {
            if (u <= 0) return;
            var c = 1 / Math.sqrt(u);
            s.x *= c, s.y *= c, s.z = 0
        } else s.z = r.allow3dRotations ? Math.sqrt(1 - u) : 0;
        t && (s.y = -s.y);
        var l = Cesium.defined(n) ? n : new o;
        return l.copyFrom(s), l
    }, x.prototype.ballPointsToMatrix = function (e, t, n, r) {
        var i = b.ballPointsToMatrix.normal;
        i.crossProduct(r, n);
        var o = r.angleTo(n);
        return Cesium.defined(e) && e.initFromVectorAndRotationAngle(i, o), Cesium.defined(t) && t.copyFrom(i), o
    }, x.prototype.synchViewBallInfo = function (e) {
        var t = this.viewport.getFrustum(h.Screen, !1, b.screenRangeAndFrustum.frustum),
            n = b.screenRangeAndFrustum.screenRange;
        n.x = t.getCorner(p.NPC_000).distance(t.getCorner(p.NPC_100)), n.y = t.getCorner(p.NPC_000).distance(t.getCorner(p.NPC_010)), n.z = t.getCorner(p.NPC_000).distance(t.getCorner(p.NPC_001)), this.ballRadius = (n.x < n.y ? n.x : n.y) * m.viewBallRadius, this.updateTargetCenter(), this.updateWorldUpVector(e)
    }, x.prototype.updateTargetCenter = function () {
        if (!this.targetCenterValid) {
            var e = b.updateTargetCenter.center;
            if (Cesium.defined(this.viewCmdTargetCenter) && this.isPointVisible(this.viewCmdTargetCenter)) return void this.setTargetCenterWorld(this.viewCmdTargetCenter, !0);
            this.viewport.allow3dManipulations ? this.viewport.determineDefaultRotatePoint(e) : (e = this.viewport.npcToWorld(new o(.5, .5, .5), e), e.z = 0), this.setTargetCenterWorld(e, !1)
        }
    }, x.prototype.setViewCmdTargetCenter = function (e) {
        this.viewCmdTargetCenter = Cesium.defined(e) ? e.clone(this.viewCmdTargetCenter) : void 0
    }, x.prototype.updateWorldUpVector = function (e) {
        e && (this.worldUpVector.x = 0, this.worldUpVector.y = 0, this.worldUpVector.z = 1, l.multiplyByPointAsVector(this.viewport.geometry.rootTransform, this.worldUpVector, this.worldUpVector))
    }, x.prototype.processFirstPoint = function (e) {
        var n = this.forcedHandle;
        if (this.forcedHandle = t.None, this.frustumValid = !1, this.viewHandles.testHit(e.viewPoint, n)) {
            this.isDragging = !0, this.viewHandles.focusHitHandle();
            var r = this.viewHandles.hitHandle;
            if (Cesium.defined(r) && !r.firstPoint(e)) return !1
        }
        return !0
    }, x.prototype.processPoint = function (e, t) {
        var n = this.viewHandles.hitHandle;
        if (!Cesium.defined(n)) return !0;
        var r = n.doManipulation(e, t);
        return r && this.doUpdate(!0), t || r && n.checkOneShot()
    }, x.distXY = function (e, t) {
        return t.distanceXY(e)
    }, x.prototype.lensAngleMatches = function (e, t) {
        var n = s(this.viewport.view, u);
        return Cesium.defined(n) && Math.abs(n.calcLensAngle() - e) < t
    }, x.prototype.isZUp = function () {
        var e = this.viewport.view,
            t = e.rotation.getRow(0, b.zup.viewX),
            n = e.rotation.getRow(1, b.zup.viewY),
            r = (e.rotation.getRow(2, b.zup.viewZ), o.UNIT_Z);
        return Math.abs(r.dot(n)) > .99 && Math.abs(r.dot(t)) < .01
    }, x.prototype.doUpdate = function (e) {};
    var M = new d;
    return x.prototype.setTargetCenterWorld = function (e, t) {
        this.targetCenterWorld.copyFrom(e), this.viewport.allow3dManipulations || (this.targetCenterWorld.z = 0), this.targetCenterValid = !0, this.setViewCmdTargetCenter(t ? e : void 0);
        var n = this.viewport.worldToView(this.targetCenterWorld, b.setTargetCenterWorld.viewPt),
            r = M;
        r.initEvent(this.targetCenterWorld, n, this.viewport), this.viewport.toolAdmin.setAdjustedDataPoint(r), r.reset()
    }, x.prototype.invalidateTargetCenter = function () {
        this.targetCenterValid = !1
    }, x.prototype.isPointVisible = function (e) {
        var t = this.viewport.worldToView(e, b.screenRangeAndFrustum.testPtView),
            n = this.viewport.getFrustum(h.Screen, !1, b.screenRangeAndFrustum.frustum),
            r = b.screenRangeAndFrustum.screenRange;
        return r.x = n.getCorner(p.NPC_000).distance(n.getCorner(p.NPC_100)), r.y = n.getCorner(p.NPC_000).distance(n.getCorners(p.NPC_010)), r.z = n.getCorner(p.NPC_000).distance(n.getCorner(p.NPC_001)), !(t.x < 0 || t.x > r.x || t.y < 0 || t.y > r.y)
    }, x.fitView = function (e, t, n) {
        var i = e.computeViewRange(),
            o = e.getViewRect().aspect,
            a = e.getWorldFrustum(b.fitView.before);
        e.view.lookAtViewAlignedVolume(i, o, m.fitExpandsClipping), e.synchWithView(!1), t && r.animateFrustumChange(e, a, e.getFrustum()), e.synchWithView(!0)
    }, x.prototype.setCameraLensAngle = function (e, t) {
        var n = s(this.viewport.view, u);
        if (!Cesium.defined(n)) return !1;
        var r = b.setCameraLensAngle;
        this.viewport.rotMatrix.getRows(r.xVec, r.yVec, r.zVec);
        var i = n.eyePoint.clone(r.eye),
            o = n.targetPoint,
            a = n.backDistance,
            c = 120 * f.oneMillimeter;
        if (!t) {
            o = this.viewport.determineDefaultRotatePoint();
            var l = this.viewport.worldToNpc(o, r.targetNpc),
                h = r.corners;
            h[0].init(0, 0, l.z), h[1].init(0, 1, l.z), h[2].init(1, 0, l.z), this.viewport.npcToWorldArray(h);
            var p = new Cesium.Cartesian2(h[0].distance(h[1]), h[0].distance(h[2])),
                m = 2 * Math.tan(e / 2),
                d = Math.max(p.x, p.y) / m;
            i.sumOf(o, r.zVec, d), a = 2 * d
        }
        return !!n.lookAtUsingLensAngle(i, o, r.yVec, e, c, a) && (this.targetCenterValid = !1, this.viewport.synchWithView(!1), !0)
    }, x.prototype.enforceZUp = function (e) {
        if (this.isZUp()) return !1;
        var t = this.viewport.view,
            n = (t.rotation.getRow(0, b.zup.viewX), t.rotation.getRow(1, b.zup.viewY)),
            r = (t.rotation.getRow(2, b.zup.viewZ), o.UNIT_Z),
            i = b.zup.rotMatrix;
        if (!i.initRotationFromVectorToVector(n, r)) return !1;
        var a = l.fromMatrixAndFixedPoint(i, e, b.zup.transform),
            s = this.viewport.getWorldFrustum(b.zup.frust);
        return s.multiply(a), this.viewport.setupFromFrustum(s), !0
    }, i(r, x), x
})