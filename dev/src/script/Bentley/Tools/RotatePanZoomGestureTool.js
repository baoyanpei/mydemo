define("RotatePanZoomGestureTool", ["../Math/Cartesian3", "../Math/Cartesian2", "../Math/Matrix4", "../Math/Matrix3", "../Bim/Frustum", "./ViewGestureTool", "../Util/extend", "./ViewToolSettings"], function (e, t, n, r, i, o, a, s) {
    function u(t, n, r) {
        o.call(this, t), this.allowRotate = n, this.allow2dRotate = Cesium.defaultValue(r, !1), this.allowZoom = !0, this.rotatePrevented = this.doing2dRotation = this.rotateInitialized = !1, this.ballVector0 = new e, this.lastPtView = new e, this.startPtWorld = new e, this.startPtView = new e, this.startTime = 0, this.frustum = new i, this.onStart(t), this.handleEvent(t)
    }
    a(o, u);
    var c = 350;
    return u.prototype.is2dRotateGesture = function (e) {
        if (!this.allow2dRotate || !this.allowRotate || this.rotatePrevented) return !1;
        if (this.doing2dRotation) return !0;
        var t = this.viewport,
            n = e.gestureInfo;
        if (t.allow3dManipulations || 2 != n.numberTouches) return this.rotatePrevented = !1, !1;
        var r = this.startInfo,
            i = Math.abs(this.getRotationFromStart(n)),
            o = Math.abs(n.distance / 2 * Math.sin(i)),
            a = Math.abs(n.distance - r.distance),
            s = r.getViewPoint(t).distance(n.getViewPoint(t));
        if (i > Math.PI / 10 || o > a && o > .75 * s) return this.doing2dRotation = !0, !0;
        var u = Date.now() - this.startTime;
        return this.rotatePrevented = u > c, !1
    }, u.prototype.is3dRotateGesture = function (e) {
        return this.allowRotate && 1 == e.gestureInfo.numberTouches && this.viewport.allow3dManipulations
    }, u.prototype.compute2dRotationAxis = function (t) {
        var n = this.viewport,
            r = n.worldToNpc(t),
            i = new e(r.x, r.y, .4),
            o = n.npcToWorld(i);
        i.z = .6;
        var a = n.npcToWorld(i);
        return {
            start: o,
            end: a
        }
    }, u.prototype.computeZoomRatio = function (e) {
        if (!this.allowZoom) return 1;
        var t = e.distance;
        t < 1 && (t = 1);
        var n = this.startInfo.distance;
        n < 1 && (n = 1);
        var r = n / t;
        return r < .1 ? r = .1 : r > 10 && (r = 10), (e.numberTouches > 2 || Math.abs(n - t) < this.viewport.pixelsFromInches(.125)) && (r = 1), r
    }, u.prototype.getRotationFromStart = function (e) {
        var n = e.touches,
            r = this.startInfo.touches,
            i = new t(r[1].x - r[0].x, r[1].y - r[0].y),
            o = new t(n[1].x - n[0].x, n[1].y - n[0].y);
        return i.angleTo(o)
    }, u.prototype.handle2dRotate = function (t) {
        var r = this.viewport;
        if (!r.setupFromFrustum(this.frustum)) return !0;
        var i = t.gestureInfo,
            o = i.touches,
            a = this.startInfo.touches,
            s = r.viewToWorld(new e(a[0].x, a[0].y, 0)),
            u = r.viewToWorld(new e(o[0].x, o[0].y, 0)),
            c = s.clone();
        c.subtract(u);
        var l = n.fromTranslation(c),
            f = this.compute2dRotationAxis(u),
            h = this.getRotationFromStart(i),
            p = n.fromLineAndRotationAngle(f.start, f.end, h),
            m = n.fromProduct(l, p),
            d = this.computeZoomRatio(i),
            v = n.fromFixedPointAndScaleFactors(s, d, d, 0);
        m = n.fromProduct(v, m);
        var g = this.frustum.transformBy(m);
        return r.setupFromFrustum(g), this.saveTouchStopData(i), this.doUpdate(!0), this.lastPtView.copyFrom(u), !0
    }, u.prototype.handle3dRotate = function (t) {
        if (this.lastPtView.isEqual(t.viewPoint, 2)) return !0;
        var i = this.viewport,
            o = t.viewPoint.clone();
        if (this.startPtView.isEqual(o, 2) && o.copyFrom(this.startPtView), this.lastPtView.copyFrom(o), !i.setupFromFrustum(this.frustum)) return !0;
        var a = this.startPtWorld,
            u = new e,
            c = 0;
        if (this.useSphere || !i.allow3dManipulations);
        else {
            var l = i.getViewRect(),
                f = l.width,
                h = l.height,
                p = o.x - this.startPtView.x,
                m = o.y - this.startPtView.y,
                d = s.preserveWorldUp ? this.worldUpVector : i.rotMatrix.getRow(1),
                v = i.rotMatrix.getRow(0),
                g = 0 != p ? r.fromVectorAndRotationAngle(d, Math.PI / (f / p)) : r.IDENTITY,
                y = 0 != m ? r.fromVectorAndRotationAngle(v, Math.PI / (h / m)) : r.IDENTITY,
                w = r.fromProduct(y, g);
            c = -w.getRotationAngleAndVector(u)
        }
        var x = r.fromVectorAndRotationAngle(u, c),
            b = n.fromMatrixAndFixedPoint(x, a),
            C = this.frustum.transformBy(b);
        return !i.setupFromFrustum(C) || (this.saveTouchStopData(t.gestureInfo), this.doUpdate(!0), !0)
    }, u.prototype.onStart = function (e) {
        o.prototype.onStart.call(this, e);
        var t = this.viewport;
        if (t.getWorldFrustum(this.frustum), this.doing2dRotation = this.rotatePrevented = !1, this.startPtWorld.copyFrom(e.point), this.startPtView.copyFrom(e.viewPoint), this.synchViewBallInfo(!this.rotateInitialized), this.rotateInitialized = !0, this.viewPtToSpherePt(this.startPtView, !0, this.ballVector0), t.isCameraOn) {
            var n = t.worldToView(this.targetCenterWorld);
            this.startPtView.z = n.z, t.viewToWorld(this.startPtView, this.startPtWorld)
        }
        this.lastPtView.copyFrom(this.startPtView), this.startTime = Date.now();
        var r = t.pickDepthBuffer(e.viewPoint);
        Cesium.defined(r) && (this.startPtWorld.copyFrom(r), t.worldToView(this.startPtWorld, this.startPtView), this.lastPtView.copyFrom(this.startPtView))
    }, u.prototype.handleEvent = function (t) {
        if (this.is3dRotateGesture(t)) return this.handle3dRotate(t);
        if (this.is2dRotateGesture(t)) return this.handle2dRotate(t);
        var r = this.viewport,
            i = t.gestureInfo,
            o = this.computeZoomRatio(i);
        if (!r.setupFromFrustum(this.frustum)) return !0;
        var a = r.isCameraOn ? r.view : void 0;
        if (Cesium.defined(a)) {
            var s = t.viewPoint.clone();
            s.z = this.startPtView.z;
            var u = r.viewToWorld(s);
            u.negate();
            var c = n.fromTranslation(u),
                l = n.fromTranslation(this.startPtWorld),
                f = new n;
            f.scaleCompleteRows(c, o, o, o), f.initProduct(l, f);
            var h = a.eyePoint.clone(),
                p = new e;
            f.multiply(h, p);
            var m = e.fromDifferenceOf(p, h),
                d = n.fromTranslation(m),
                v = this.frustum.transformBy(d);
            r.setupFromFrustum(v)
        } else {
            var g = r.viewToNpc(t.viewPoint);
            g.z = .5;
            var y = n.fromFixedPointAndScaleFactors(g, o, o, 1),
                w = new e(.5, .5, .5),
                x = r.viewToNpc(this.startPtView),
                b = e.fromDifferenceOf(x, g);
            b.z = 0;
            var m = n.fromTranslation(b);
            y.initProduct(m, y), y.multiply(w), r.npcToWorld(w, w), r.zoom(w, o, !1)
        }
        return this.saveTouchStopData(i), this.doUpdate(!0), !0
    }, u.prototype.onMultiFingerMove = function (e) {
        var t = e.gestureInfo;
        return t.numberTouches != this.startInfo.numberTouches ? (this.onStart(e), !0) : this.handleEvent(e)
    }, u.prototype.onSingleFingerMove = function (e) {
        return this.onMultiFingerMove(e)
    }, u.prototype.onEndGesture = function (e) {
        return this.clearTouchStopData(), this.endGesture()
    }, u
})