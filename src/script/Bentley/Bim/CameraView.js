define("CameraView", ["./View", "./SpatialView", "../Math/Cartesian3", "../Util/extend", "./CameraInfo", "../Math/Matrix3", "./NpcCorners", "../Math/Constants", "../Math/Cartesian2"], function (e, t, n, r, i, o, a, s, u) {
    function c(e, r) {
        t.call(this, e, r), Cesium.defined(e) && (this.cameraInfo = new i(e.lensAngle, e.focusDistance, n.fromObject(e.eyePoint)), this._cameraOn = Cesium.defaultValue(e.isCameraOn, !0))
    }
    var l = new n,
        f = new n,
        h = new n,
        p = new n,
        m = new n;
    c.prototype.toUrl = function () {
        var t = this.cameraInfo.eyePoint,
            n = e.prototype.toUrl.call(this);
        return this.isCameraOn && (n += "&eyePoint=" + t.x + "," + t.y + "," + t.z + "&focusDistance=" + this.cameraInfo.focusDistance + "&lensAngle=" + this.cameraInfo.lensAngle), n
    }, c.prototype.updateFromJson = function (t) {
        e.prototype.updateFromJson.call(this, t), Cesium.defined(t.eyePoint) && Cesium.defined(t.focusDistance) && Cesium.defined(t.lensAngle) ? (Cesium.defined(t.eyePoint) && (this.cameraInfo.eyePoint = n.fromObject(t.eyePoint)), Cesium.defined(t.focusDistance) && (this.cameraInfo.focusDistance = t.focusDistance), Cesium.defined(t.lensAngle) && (this.cameraInfo.lensAngle = t.lensAngle), this.enableCamera()) : this.turnCameraOff()
    }, c.prototype.init = function (t) {
        if (!this.isCameraOn) return e.prototype.init.call(this, t);
        if (Cesium.defined(t) && this.cameraInfo.copyFrom(t), Cesium.defined(this._origin)) {
            if (this._origin.equals(this.origin) && this._extents.equals(this.extents) && this._rotation.equals(this.rotation) && this._cameraInfo.equals(this.cameraInfo)) return !1;
            this._origin.copyFrom(this.origin), this._extents.copyFrom(this.extents), this._rotation.copyFrom(this.rotation), this._cameraInfo.copyFrom(this.cameraInfo)
        } else this._origin = this.origin.clone(), this._extents = this.extents.clone(), this._rotation = this.rotation.clone(), this._cameraInfo = this.cameraInfo.clone();
        var n = this.extents;
        this.fov = 2 * Math.atan2(n.x / 2, this.cameraInfo.focusDistance), i.isValidLensAngle(this.fov) || (this.fov = Math.PI / 2);
        var r = this.rotation,
            a = this.origin.clone(l),
            s = this.cameraInfo.eyePoint.clone(f);
        o.multiplyByVector(r, a, a), o.multiplyByVector(r, s, s);
        var u = h;
        u.x = a.x + n.x / 2, u.y = a.y + n.y / 2, u.z = s.z - this.cameraInfo.focusDistance;
        var c = p;
        r.multiplyTranspose(c, u);
        var d = r.getRow(0),
            v = r.getRow(1),
            g = m;
        return g.normalizedDifference(this.cameraInfo.eyePoint, c), d.normalizedCrossProduct(v, g), v.normalizedCrossProduct(g, d), g.negate(), this.dest.copyFrom(this.cameraInfo.eyePoint), this.dir.copyFrom(g), this.up.copyFrom(v), !0
    }, c.prototype.clone = function () {
        var e = new c(void 0, this.bim);
        return e.copyFrom(this), e.cameraInfo = this.cameraInfo.clone(), e._cameraOn = this._cameraOn, e
    }, c.prototype.equals = function (e) {
        return !!this.isEqual(e) && (this.isCameraOn == e.isCameraOn && (!this.isCameraOn || this.cameraInfo.equals(e.cameraInfo)))
    }, r(t, c);
    var d = new n;
    Cesium.defineProperties(c.prototype, {
        frontDistance: {
            get: function () {
                return this.backDistance - this.extents.z
            }
        },
        backDistance: {
            get: function () {
                var e = n.subtract(this.cameraInfo.eyePoint, this.origin, d);
                return this.rotation.multiply(e), e.z
            }
        },
        targetPoint: {
            get: function () {
                return this.getCameraTarget()
            }
        },
        eyePoint: {
            get: function () {
                return this.cameraInfo.eyePoint
            }
        },
        lensAngle: {
            get: function () {
                return this.cameraInfo.lensAngle
            },
            set: function (e) {
                this.cameraInfo.lensAngle = e
            }
        },
        focusDistance: {
            get: function () {
                return this.cameraInfo.focusDistance
            },
            set: function (e) {
                this.cameraInfo.focusDistance = e
            }
        },
        supportsCamera: {
            get: function () {
                return !0
            }
        },
        isCameraOn: {
            get: function () {
                return this._cameraOn
            }
        }
    }), c.prototype.enableCamera = function () {
        this._cameraOn = !0
    }, c.prototype.turnCameraOff = function () {
        this._cameraOn = !1
    }, c.prototype._setupFromFrustum = function (e) {
        if (!this._baseSetupFromFrustum(e)) return !1;
        if (!this.isCameraOn) return !0;
        var t = e.pts,
            r = t[a.NPC_000].distance(t[a.NPC_100]),
            i = t[a.NPC_001].distance(t[a.NPC_101]),
            o = 1e-6;
        if (i > r * (1 + o)) return !1;
        var s = i / r,
            u = t[a.NPC_000].clone(),
            c = this.extents.clone(),
            l = this.zVector,
            f = n.fromStartEnd(u, t[a.NPC_001]),
            h = n.fromScale(f, 1 / (1 - s)),
            p = n.fromSumOf(u, h),
            m = h.dot(l);
        if (0 == m) return !1;
        var d = m - c.z / 2,
            v = d / m;
        return u.sumOf(p, h, -v), u.sumOf(u, l, d - m), c.x *= v, c.y *= v, this.cameraInfo.eyePoint.copyFrom(p), this.cameraInfo.focusDistance = d, this.origin.copyFrom(u), this.extents.copyFrom(c), this.cameraInfo.lensAngle = this.calcLensAngle(), !0
    };
    var v = new n;
    c.prototype.getCameraTarget = function (t) {
        if (!this.isCameraOn) return e.prototype.getCameraTarget.call(this, t);
        Cesium.defined(t) || (t = new n);
        var r = this.rotation.getRow(2, v);
        return t.sumOf(this.cameraInfo.eyePoint, r, -1 * this.cameraInfo.focusDistance), t
    };
    var g = new n,
        y = new n;
    c.prototype.centerEyePoint = function (e) {
        var t = Cesium.defaultValue(e, this.backDistance),
            r = this.extents.clone(g),
            i = y;
        i.scaleByVector(r, .5), i.z = t, this.rotation.multiplyTransposeInPlace(i), i.add(this.origin), n.clone(i, this.cameraInfo.eyePoint)
    }, c.prototype.centerFocusDistance = function () {
        var e = this.backDistance,
            t = this.frontDistance,
            r = this.cameraInfo.eyePoint.clone(),
            i = n.fromSumOf(r, this.zVector, t - e);
        return this.lookAtUsingLensAngle(r, i, this.yVector, this.cameraInfo.lensAngle, t, e)
    };
    var w = new n;
    c.prototype.lookAtUsingLensAngle = function (e, t, n, r, i, o) {
        var a = w;
        a.differenceOf(e, t);
        var c = a.normalize();
        if (c < s.oneMillimeter) return !1;
        if (r < 1e-4 || r > Math.pi) return !1;
        var l = 2 * Math.tan(r / 2) * c,
            f = new u(this.extents.x, this.extents.y),
            h = Math.max(f.x, f.y);
        return f.scale(l / h), this.lookAt(e, t, n, f, i, o)
    };
    var x = new n,
        b = new n;
    return c.prototype.lookAt = function (t, r, i, a, u, c) {
        var l = i.clone();
        if (l.normalize() <= s.mgds_fc_epsilon) return !1;
        var f = n.fromDifferenceOf(t, r),
            h = f.normalize();
        if (h <= s.oneMillimeter) return !1;
        var p = new n;
        if (!(p.normalizedCrossProduct(l, f) <= s.mgds_fc_epsilon)) {
            if (l.normalizedCrossProduct(f, p) <= s.mgds_fc_epsilon) return !1;
            var m = o.fromRowVectors(p, l, f),
                d = Cesium.defaultValue(c, this.backDistance),
                v = Cesium.defaultValue(u, this.frontDistance),
                g = x;
            Cesium.defined(a) ? (g.x = Math.abs(a.x), g.y = Math.abs(a.y)) : (g.x = this.extents.x, g.y = this.extents.y), v = Math.max(v, s.oneMillimeter), d = Math.max(d, h + s.oneMillimeter), d < h && (d = h + s.oneMillimeter), g.z = d - v;
            var y = b;
            return y.scaleByVector(g, v / h), !!e.validateViewDelta(y) && (!(g.z > this.calculateMaxDepth(g, f)) && (this.origin.sumOf3ScaledVectors(t, f, -d, p, -.5 * g.x, l, -.5 * g.y), n.clone(t, this.cameraInfo.eyePoint), o.clone(m, this.rotation), this.cameraInfo.focusDistance = h, n.clone(g, this.extents), this.cameraInfo.lensAngle = this.calcLensAngle(), this.enableCamera(), !0))
        }
    }, c.prototype.verifyFocusPlane = function () {
        if (this.isCameraOn) {
            var e = this.cameraInfo,
                t = n.fromStartEnd(this.origin, e.eyePoint);
            this.rotation.multiply(t);
            var r = t.z,
                i = r - this.extents.z;
            if (r <= 0 || i <= 0) {
                var o = Math.tan(e.lensAngle / 2);
                return r = this.extents.z / o, e.focusDistance = r / 2, void this.centerEyePoint(r)
            }
            var a = e.focusDistance;
            if (!(a > i && a < r)) {
                e.focusDistance = this.extents.z / 2 + i;
                var s = e.focusDistance / a;
                this.extents.x *= s, this.extents.y *= s;
                var u = this.rotation.getRow(0),
                    c = this.rotation.getRow(1),
                    l = this.rotation.getRow(2);
                this.origin.sumOf3ScaledVectors(e.eyePoint, l, -r, u, -.5 * this.extents.x, c, -.5 * this.extents.y)
            }
        }
    }, c.prototype.calcLensAngle = function () {
        var e = Math.max(this.extents.x, this.extents.y);
        return 2 * Math.atan2(.5 * e, this.cameraInfo.focusDistance)
    }, c.prototype.calculateMaxDepth = function (e, t) {
        var n = 1e8,
            r = 1e5,
            i = Math.min(Math.abs(t.x), Math.abs(t.y)),
            o = 0 == i ? n : Math.min(r / i, n);
        return Math.max(e.x, e.y) * o
    }, c.prototype.toCameraView = function () {
        return this
    }, c
})