define("ViewNavigate", ["./ViewingToolHandle", "../Util/extend", "../Math/Cartesian3", "./ViewToolSettings", "./ViewManipHitPriority", "../Math/Matrix4", "../Math/Matrix3", "./ViewHandleType", "./ToolId", "./OrientationResult", "./NavigateMode", "./NavigateMotion", "./Cursor", "../Bim/Frustum", "./ViewTool"], function (e, t, n, r, i, o, a, s, u, c, l, f, h, p, m) {
    function d(e, t, n) {
        this.parentElement = e;
        var r = "1px solid " + Cesium.defaultValue(n, "white"),
            i = 7,
            o = 2 * i + 1,
            a = document.createElement("div");
        a.className = "bim-overlay-box-rule-horizontal", this.hor = a;
        var s = a.style;
        s.height = "0px", s.width = o + "px", s.top = t.y + "px", s.left = t.x - i + "px", s.borderBottom = r, e.appendChild(a);
        var u = document.createElement("div");
        u.className = "bim-overlay-box-rule-vertical", this.ver = u, s = u.style, s.width = "0px", s.height = o + "px", s.left = t.x + "px", s.top = t.y - i + "px", s.borderLeft = r, e.appendChild(u)
    }

    function v(t) {
        e.call(this, t), this.anchorPtView = new n, this.lastPtView = new n, this.initialized = !1, this.lastMotionTime = 0, this.orientationValid = !1, this.orientationTime = 0, this.orientationZ = new n
    }
    d.prototype.destroy = function () {
        this.destroyed || (this.destroyed = !0, this.parentElement.removeChild(this.hor), this.parentElement.removeChild(this.ver))
    }, t(e, v), v.prototype.haveStaticOrientation = function (e, t) {
        var n = .075;
        if (!this.orientationValid || e.angleTo(this.orientationZ) > n || this.orientationZ.isZero()) return this.orientationValid = !0, this.orientationTime = t, this.orientationZ = e, !1;
        var r = 500;
        return t - this.orientationTime > r
    }, v.prototype.tryOrientationEvent = function (e, t) {
        return {
            eventsEnabled: !1,
            result: c.NoEvent
        }
    }, v.prototype.getElapsedTime = function (e) {
        var t = e - this.lastMotionTime;
        return (0 == this.lastMotionTime || t < 0 || t > 1e3) && (t = 100), t
    }, v.prototype.getMaxLinearVelocity = function () {
        return r.walkVelocity
    }, v.prototype.getMaxAngularVelocity = function () {
        return Math.PI / 4
    }, v.prototype.testHandleForHit = function (e) {
        return {
            distance: 0,
            priority: i.Low
        }
    }, v.prototype.getInputVector = function (e) {
        var t = Cesium.defined(e) ? e : new n,
            r = 5;
        t.differenceOf(this.lastPtView, this.anchorPtView);
        var i = this.viewport.getViewRect();
        return Math.abs(t.x) < r ? t.x = 0 : t.x = 2 * t.x / i.width, Math.abs(t.y) < r ? t.y = 0 : t.y = 2 * t.y / i.height, t.x = Math.min(t.x, 1), t.y = Math.min(t.y, 1), t
    }, v.prototype.getCenterPoint = function (e) {
        var t = Cesium.defined(e) ? e : new n;
        t.zero();
        var r = this.viewport.getViewRect(),
            i = r.width,
            o = r.height;
        return i > 0 && (t.x = i / 2), o > 0 && (t.y = o / 2), t
    }, v.prototype.getNavigateMode = function () {
        var e = this.viewport.toolAdmin.currentInputState;
        return e.isShiftDown || !this.viewport.isCameraOn ? l.Pan : e.isControlDown ? l.Look : l.Travel
    };
    var g = new n,
        y = new p;
    return v.prototype.doNavigate = function (e) {
        var t = Date.now(),
            n = g,
            r = this.tryOrientationEvent(n, e),
            i = r.result,
            o = (r.eventsEnabled, this.getElapsedTime(t));
        this.lastMotionTime = t;
        var a = this.viewport,
            s = this.getNavigateMotion(o),
            u = Cesium.defined(s);
        if (u) {
            var l = a.getWorldFrustum(y);
            if (l.multiply(s.transform), a.setupFromFrustum(l), u = !1, c.NoEvent == i) return !1
        }
        return !!u || c.Success == i && !this.haveStaticOrientation(n, t)
    }, v.prototype.doManipulation = function (e, t) {
        return !t || (this.lastPtView.copyFrom(e.viewPoint), this.doNavigate(e))
    }, v.prototype.noMotion = function (e) {
        return this.doNavigate(e), !1
    }, v.prototype.onReinitialize = function () {
        if (!this.initialized) {
            this.initialized = !0;
            var e = this.viewport,
                t = e.view.toSpatialView();
            if (Cesium.defined(t) && e.allow3dManipulations) {
                var n = e.getWorldFrustum(),
                    i = r.walkCameraAngle * (Math.PI / 180);
                this.viewTool.lensAngleMatches(i, 10 * (Math.PI / 180)) && this.viewTool.isZUp() || this.viewTool.setCameraLensAngle(i, this.viewTool.lensAngleMatches(i, 45 * (Math.PI / 180))), r.walkEnforceZUp && this.viewTool.enforceZUp(t.getCameraTarget());
                var o = e.getWorldFrustum();
                n.equals(o) || m.animateFrustumChange(e, n, o), this.getCenterPoint(this.anchorPtView)
            }
        }
    }, v.prototype.firstPoint = function (e) {
        return this.lastPtView.copyFrom(e.viewPoint), this.anchorPtView.copyFrom(this.lastPtView), this.decoration = new d(this.viewport.canvas.parentElement, this.anchorPtView, this.viewport.getContrastToBackgroundColor()), !0
    }, v.prototype.getHandleCursor = function () {
        return h.CrossHair
    }, v.prototype.focusOut = function () {
        this.decoration = this.decoration && this.decoration.destroy()
    }, v
})