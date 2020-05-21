define("NavigateMotion", ["../Math/Matrix4", "../Math/Cartesian3", "../Math/Matrix3"], function (e, t, n) {
    function r(t) {
        this.viewport = t, this.deltaTime = 0, this.transform = e.fromIdentity()
    }
    r.prototype.init = function (e) {
        this.deltaTime = .001 * e, this.transform.initIdentity()
    }, r.prototype.getViewUp = function (e) {
        var n = Cesium.defined(e) ? e : new t;
        return this.viewport.rotMatrix.getRow(1, n), n
    }, r.prototype.getViewDirection = function (e) {
        var n = Cesium.defined(e) ? e : new t;
        return this.viewport.rotMatrix.getRow(2, n), n.scale(-1), n
    };
    var i = new t(0, 0, 0);
    r.prototype.takeElevator = function (e) {
        var t = i;
        t.z = e * this.deltaTime, this.transform.initFromTranslation(t)
    };
    var o = new t,
        a = new t;
    r.prototype.modifyPitchAngleToPreventInversion = function (e) {
        var n = Math.PI / 180 * 85,
            r = Math.PI / 180 * .01;
        if (0 == e) return 0;
        var i = this.getViewUp(o),
            s = this.getViewDirection(a),
            u = t.UNIT_Z,
            c = u.angleTo(i);
        s.z < 0 && (c *= -1);
        var l = e + c;
        if (Math.abs(l) < n) return e;
        if (e > 0 != c > 0 && Math.abs(e) < Math.PI / 2) return e;
        if (Math.abs(c) >= n - r) return 0;
        var f = Math.abs(l) - n;
        return l = e > 0 ? e - f : e + f
    }, r.prototype.getWorldUp = function (e) {
        var n = Cesium.defined(e) ? e : new t;
        return this.viewport.geometry.rootTransform.multiplyByPointAsVector(t.UNIT_Z, n), n
    };
    var s = new t,
        u = new n,
        c = new n,
        l = new n,
        f = new n;
    r.prototype.generateRotationTransform = function (t, r, i) {
        var o = Cesium.defined(i) ? i : new e,
            a = t * this.deltaTime,
            h = this.modifyPitchAngleToPreventInversion(r * this.deltaTime),
            p = n.fromInverseOf(this.viewport.rotMatrix, u),
            m = this.getWorldUp(s),
            d = n.fromVectorAndRotationAngle(m, a, c),
            v = n.fromPrincipleAxisRotations(this.viewport.rotMatrix, h, 0, 0, l);
        v.initProduct(p, v);
        var g = n.fromProduct(d, v, f);
        return o.initFromMatrixAndFixedPoint(g, this.viewport.view.dest), o
    };
    var h = [new t, new t, new t],
        p = [new t, new t, new t],
        m = [new t, new t, new t],
        d = new t,
        v = new t,
        g = new t,
        y = new t,
        w = new t,
        x = new t,
        b = new t;
    r.prototype.generateTranslationTransform = function (n, r, i) {
        var o = Cesium.defined(i) ? i : new e,
            a = h;
        if (a[0].zero(), a[1].init(1, 0, 0), a[2].init(0, 1, 0), this.viewport.isCameraOn) {
            var s = p;
            this.viewport.viewToNpcArray(a, s), s[0].z = s[1].z = s[2].z = this.viewport.getFocusPlaneNpc(), this.viewport.npcToViewArray(s, a)
        }
        var u = m;
        this.viewport.viewToWorldArray(a, u);
        var c = t.fromDifferenceOf(u[1], u[0], y);
        c.normalize(), c.scale(n.x * this.deltaTime);
        var l = t.fromDifferenceOf(u[2], u[0], w);
        l.normalize(), l.scale(n.y * this.deltaTime);
        var f;
        if (r) {
            var C = this.getViewDirection(d),
                M = this.getWorldUp(v),
                T = t.fromCrossProduct(M, C, b);
            f = t.fromCrossProduct(T, M, x), f.normalize()
        } else f = this.getViewDirection(x);
        f.scale(n.z * this.deltaTime);
        var N = g;
        return N.sumOf(c, l), N.sumOf(N, f), o.initFromTranslation(N), o
    };
    var C = new e,
        M = new e;
    r.prototype.moveAndLook = function (e, t, n, r) {
        var i = this.generateRotationTransform(t, n, C),
            o = this.generateTranslationTransform(e, r, M);
        this.transform.initProduct(i, o)
    };
    var T = new t;
    r.prototype.pan = function (e, t) {
        var n = T;
        n.init(e, t, 0), this.moveAndLook(n, 0, 0, !1)
    };
    var N = new t;
    r.prototype.travel = function (e, t, n, r) {
        var i = N;
        i.init(0, 0, n), this.moveAndLook(i, e, t, r)
    }, r.prototype.look = function (e, t) {
        this.generateRotationTransform(e, t, this.transform)
    };
    var E = new t,
        A = new t;
    return r.prototype.resetToLevel = function () {
        var e = this.getViewDirection(d);
        if (Math.abs(e.z) < .001) return void this.transform.initIdentity();
        var n = e.clone(E);
        n.z = 0;
        var r = e.angleTo(n),
            i = this.viewport.eyePoint,
            o = t.fromCrossProduct(e, n, A);
        this.transform.initFromAxisAndRotationAngle(i, o, r)
    }, r
})