define("ToolAdmin", ["../Math/Cartesian3", "../Bim/InputEventModifiers", "./Button", "./InputSource", "./MouseWheelEvent", "./ViewIdleTool", "./ButtonEvent", "../Math/Constants", "../Math/Matrix4", "./Tool", "../Util/extend", "./Cursor", "./ViewManip", "./ViewHandleType", "./ToolId", "./ViewTool", "./PrimitiveTool", "../Math/Cartesian2", "./GestureEvent", "../Scene/CameraController", "../Util/getFunction", "../Bim/SelectionSet", "./ViewToolSettings"], function (e, t, n, r, i, o, a, s, u, c, l, f, h, p, m, d, v, g, y, w, x, b, C) {
    function M() {
        this.downPoint = new e, this.init()
    }

    function T(i) {
        this.viewport = i, this.rawPoint = new e, this.viewPoint = new e, this.inputOffset = new Cesium.Cartesian2, this.qualifiers = t.None, this.motionTime = 0, this.inputSource = r.Unknown, this.lastButton = n.Data, this.buttonDownTool = void 0, this.button = [new M, new M, new M], this.lastMotion = new Cesium.Cartesian2, this.wantIgnoreTest = !1, this.numberTouches = 0, this.touches = [new g, new g, new g], this.touchMotionTime = 0
    }

    function N(e) {
        this.viewport = e, this.selectionSet = new b(e.bim), this.currentInputState = new T(e), this.activeToolChanged = new Cesium.Event, this._viewTool = void 0, this._primitiveTool = void 0, this.idleTool = new o(e), this.gesturePending = !1, this.touchBridgeMode = !1;
        var t = this;
        e.resized.addEventListener(function () {
            t.onViewportResized()
        })
    }

    function E(e) {
        this.init(e)
    }
    M.prototype.init = function (e, t, n, i, o, a) {
        Cesium.defined(e) ? this.downPoint.copyFrom(e) : this.downPoint.init(0, 0, 0), this.downTime = Cesium.defaultValue(t, 0), this.isDown = Cesium.defaultValue(n, !1), this.isDoubleClick = Cesium.defaultValue(i, !1), this.isDragging = Cesium.defaultValue(o, !1), this.inputSource = Cesium.defaultValue(a, r.Unknown)
    }, T.prototype.clearTouch = function () {
        this.numberTouches = 0, this.touchMotionTime = 0, this.wantIgnoreTest = !1
    }, T.prototype.onMotion = function (e) {
        this.motionTime = Date.now(), this.lastMotion.x = e.x, this.lastMotion.y = e.y
    }, T.prototype.isDragging = function (e) {
        return this.button[e].isDragging
    }, T.prototype.onStartDrag = function (e) {
        this.button[e].isDragging = !0
    }, T.prototype.setKeyQualifier = function (e, t) {
        this.qualifiers = t ? this.qualifiers | e : this.qualifiers & ~e
    }, T.prototype.clearKeyQualifiers = function () {
        this.qualifiers = t.None
    }, T.prototype.disableIgnoreTouchMotionTest = function () {
        this.wantIgnoreTest = !1
    }, Cesium.defineProperties(T.prototype, {
        wasMotion: {
            get: function () {
                return 0 != this.motionTime
            }
        },
        hasMotionStopped: {
            get: function () {
                return this._hasMotionStopped()
            }
        },
        wasTouchMotion: {
            get: function () {
                return 0 != this.touchMotionTime
            }
        },
        hasTouchMotionPaused: {
            get: function () {
                return this._hasTouchMotionPaused()
            }
        },
        isShiftDown: {
            get: function () {
                return 0 != (this.qualifiers & t.Shift)
            }
        },
        isControlDown: {
            get: function () {
                return 0 != (this.qualifiers & t.Control)
            }
        }
    });
    var A = {
        changeButtonToDownPoint: {
            viewPoint: new e
        },
        onButtonDown: {
            viewPt: new e,
            npcCenter: new e(.5, .5, .5),
            viewCenter: new e
        },
        toEventFromLastDataPoint: {
            viewPt: new e
        },
        fromPoint: {
            npcCenter: new e(.5, .5, .5),
            viewCenter: new e
        },
        isStartDrag: {
            viewPt: new e
        },
        onMouseWheel: {
            wheelEvent: new i(0)
        },
        onTimerEvent: {
            buttonEvent: new a
        }
    };
    T.prototype.changeButtonToDownPoint = function (e) {
        e.setPoint(this.button[e.button].downPoint);
        var t = this.viewport.worldToView(e.point, A.changeButtonToDownPoint.viewPoint);
        e.setViewPoint(t)
    }, T.prototype.updateDownPoint = function (e) {
        this.button[e.button].downPoint.copyFrom(e.point)
    };
    var S = 500,
        P = 4;
    T.prototype.onButtonDown = function (e) {
        var t = this.viewport.worldToView(this.button[e].downPoint, A.onButtonDown.viewPt),
            n = this.viewport.npcToView(A.onButtonDown.npcCenter, A.onButtonDown.viewCenter);
        t.z = n.z;
        var r = Date.now() - this.button[e].downTime < S && t.distance(this.viewPoint) < P;
        this.button[e].init(this.rawPoint, Date.now(), !0, r, !1, this.inputSource), this.lastButton = e
    }, T.prototype.onButtonUp = function (e) {
        this.button[e].isDown = !1, this.button[e].isDragging = !1, this.lastButton = e
    }, T.prototype.hasEventInputStopped = function (e, t) {
        var n = !1;
        return 0 != e && Date.now() - e >= t && (n = !0, e = 0), {
            eventTimer: e,
            stopped: n
        }
    }, T.prototype._hasMotionStopped = function () {
        var e = this.hasEventInputStopped(this.motionTime, 48);
        return e.stopped && (this.motionTime = e.eventTimer), e.stopped
    }, T.prototype._hasTouchMotionPaused = function () {
        var e = this.hasEventInputStopped(this.touchMotionTime, 48);
        return e.stopped && (this.touchMotionTime = e.eventTimer), e.stopped
    }, T.prototype.toEvent = function (e) {
        var t = this.button[this.lastButton];
        e.initEvent(this.rawPoint, this.viewPoint, this.viewport, this.qualifiers, this.lastButton, t.isDown, t.isDoubleClick, this.inputSource)
    }, T.prototype.adjustLastDataPoint = function (e) {
        var t = this.button[n.Data];
        t.downPoint.copyFrom(e.point)
    }, T.prototype.toEventFromLastDataPoint = function (e) {
        var t = this.button[n.Data],
            r = t.downPoint,
            i = this.viewport.worldToView(r, A.toEventFromLastDataPoint.viewPt);
        e.initEvent(r, i, this.viewport, this.qualifiers, n.Data, t.isDown, t.isDoubleClick, t.inputSource)
    }, T.prototype.fromPoint = function (e, t) {
        this.viewPoint.x = e.x + this.inputOffset.x, this.viewPoint.y = e.y + this.inputOffset.y;
        var n = this.viewport.npcToView(A.fromPoint.npcCenter, A.fromPoint.viewCenter);
        this.viewPoint.z = n.z, this.rawPoint = this.viewport.viewToWorld(this.viewPoint, this.rawPoint), this.inputSource = t
    }, T.prototype.fromButton = function (e, t) {
        this.fromPoint(e, t)
    }, T.prototype.fromGesture = function (e) {
        this.disableIgnoreTouchMotionTest(), this.fromButton(e.ptsLocation, r.Touch)
    }, T.prototype.isAnyDragging = function () {
        for (var e = 0; e < this.button.length; e++)
            if (this.button[e].isDragging) return !0;
        return !1
    }, T.prototype.isStartDrag = function (e) {
        if (this.isAnyDragging()) return !1;
        var t = this.button[e];
        if (!t.isDown) return !1;
        if (Date.now() - t.downTime <= 112) return !1;
        var n = this.viewport.worldToView(t.downPoint, A.isStartDrag.viewPt),
            r = Math.abs(this.viewPoint.x - n.x),
            i = Math.abs(this.viewPoint.y - n.y);
        return r + i > 15
    }, T.prototype.ignoreTouchMotion = function (e, t) {
        if (!this.wantIgnoreTest) return !1;
        if (e = Math.min(e, this.touches.length), e != this.numberTouches) return !1;
        for (var n = this.viewport.pixelsFromInches(.05), r = 0; r < e; r++) {
            var i = Math.abs(t[r].x - this.touches[r].x),
                o = Math.abs(t[r].y - this.touches[r].y);
            if (i > n || o > n) return !1
        }
        return !0
    }, T.prototype.onTouchMotionChange = function (e, t) {
        if (0 == e) return void this.clearTouch();
        this.wantIgnoreTest = !0, this.touchMotionTime = Date.now(), this.numberTouches = e;
        for (var n = 0; n < this.touches.length; n++) this.touches[n].x = t[n].x, this.touches[n].y = t[n].y
    }, Cesium.defineProperties(N.prototype, {
        activeTool: {
            get: function () {
                return Cesium.defined(this._viewTool) ? this._viewTool : this._primitiveTool
            }
        }
    }), N.prototype.setInputOffset = function (e) {
        var t = this.currentInputState.inputOffset;
        Cesium.defined(e) ? (t.x = e.x, t.y = e.y) : (t.x = 0, t.y = 0)
    }, N.prototype.onMouseWheel = function (e, t) {
        this.viewport.removeAnimator(), this.currentInputState.fromButton(t, r.Mouse);
        var n = A.onMouseWheel.wheelEvent;
        n.wheelDelta = e, this.currentInputState.toEvent(n), this._onMouseWheel(n)
    }, N.prototype._onMouseWheel = function (e) {
        var t = this.activeTool;
        Cesium.defined(t) && t.onMouseWheel(e) || this.idleTool.onMouseWheel(e)
    }, N.prototype.onTimerEvent = function () {
        var e = this.activeTool,
            t = this.currentInputState;
        if (0 != t.numberTouches && !this.touchBridgeMode) {
            var n = t.hasTouchMotionPaused;
            return !n || (Cesium.defined(e) && e.onTouchMotionPaused(), !0)
        }
        var r = A.onTimerEvent.buttonEvent;
        t.toEvent(r);
        var i = t.wasMotion;
        return !i && Cesium.defined(e) && e.onModelNoMotion(r), t.hasMotionStopped && Cesium.defined(e) && e.onModelMotionStopped(r), Cesium.defined(e) && e.updateDynamics(r), r.reset(), !i
    };
    var O = new a;
    N.prototype.onMouseMotion = function (e, t) {
        var n = this.currentInputState;
        n.onMotion(e);
        var r = this.activeTool;
        if (Cesium.defined(r)) {
            var i = O;
            n.fromPoint(e, t), n.toEvent(i), n.isStartDrag(i.button) ? (n.onStartDrag(i.button), n.changeButtonToDownPoint(i), r.onModelStartDrag(i)) : r.onModelMotion(i), i.reset()
        }
    }, N.prototype.sendDataPoint = function (e) {
        var t = this.activeTool,
            n = this.currentInputState;
        if (!e.isDown) {
            if (t != n.buttonDownTool) return;
            return void(Cesium.defined(t) && t.onDataButtonUp(e))
        }
        n.buttonDownTool = t, Cesium.defined(t) && t.onDataButtonDown(e)
    }, N.prototype.onDataButtonDown = function (e, t) {
        this.viewport.removeAnimator();
        var r = O,
            i = this.currentInputState;
        i.fromButton(e, t), i.onButtonDown(n.Data), i.toEvent(r), i.updateDownPoint(r), this.sendDataPoint(r), r.reset()
    }, N.prototype.onDataButtonUp = function (e, t) {
        var r = this.currentInputState,
            i = r.isDragging(n.Data),
            o = O;
        r.fromButton(e, t), r.onButtonUp(n.Data), r.toEvent(o);
        var a = this.activeTool;
        if (a == r.buttonDownTool) {
            if (i) return Cesium.defined(a) && a.onModelEndDrag(o), void o.reset();
            r.changeButtonToDownPoint(o), this.sendDataPoint(o), o.reset()
        }
    }, N.prototype.onMiddleButtonDown = function (e) {
        this.viewport.removeAnimator();
        var t = O,
            i = this.currentInputState;
        i.fromButton(e, r.Mouse), i.onButtonDown(n.Middle), i.toEvent(t), i.updateDownPoint(t);
        var o = this.activeTool;
        if (i.buttonDownTool = o, (!Cesium.defined(o) || !o.onMiddleButtonDown(t)) && this.idleTool.onMiddleButtonDown(t)) {
            var a = this.activeTool;
            a != o && (i.buttonDownTool = a)
        }
        t.reset()
    }, N.prototype.onMiddleButtonUp = function (e) {
        var t = this.currentInputState,
            i = t.isDragging(n.Middle),
            o = O;
        t.fromButton(e, r.Mouse), t.onButtonUp(n.Middle), t.toEvent(o);
        var a = this.activeTool;
        return a != t.buttonDownTool ? void o.reset() : i ? (Cesium.defined(a) && a.onModelEndDrag(o), void o.reset()) : (t.changeButtonToDownPoint(o), Cesium.defined(a) && a.onMiddleButtonUp(o) || this.idleTool.onMiddleButtonUp(o), void o.reset())
    }, N.prototype.onResetButtonDown = function (e) {
        this.viewport.removeAnimator();
        var t = O,
            i = this.currentInputState;
        i.fromButton(e, r.Mouse), i.onButtonDown(n.Reset), i.toEvent(t), i.updateDownPoint(t);
        var o = this.activeTool;
        i.buttonDownTool = o, Cesium.defined(o) && o.onResetButtonDown(t), t.reset()
    }, N.prototype.onResetButtonUp = function (e) {
        var t = this.currentInputState,
            i = t.isDragging(n.Reset),
            o = O;
        t.fromButton(e, r.Mouse), t.onButtonUp(n.Reset), t.toEvent(o);
        var a = this.activeTool;
        return a != t.buttonDownTool ? void o.reset() : i ? (Cesium.defined(a) && a.onModelEndDrag(o), void o.reset()) : (t.changeButtonToDownPoint(o), Cesium.defined(a) && a.onResetButtonUp(o), void o.reset())
    };
    var _ = new y;
    N.prototype.onEndGesture = function (e) {
        this.viewport.removeAnimator(), this.gesturePending = !1;
        var t = _;
        t.initGestureEvent(this.viewport, e);
        var n = this.activeTool;
        Cesium.defined(n) && n.onEndGesture(t) || this.idleTool.onEndGesture(t), this.currentInputState.clearTouch(), t.reset()
    }, N.prototype.onSingleFingerMove = function (e) {
        this.gesturePending = !1;
        var t = this.currentInputState;
        if (!t.ignoreTouchMotion(e.numberTouches, e.touches)) {
            this.viewport.removeAnimator();
            var n = _.initGestureEvent(this.viewport, e),
                r = this.activeTool;
            Cesium.defined(r) && r.onSingleFingerMove(n) || this.idleTool.onSingleFingerMove(n), t.onTouchMotionChange(e.numberTouches, e.touches), n.reset()
        }
    }, N.prototype.onMultiFingerMove = function (e) {
        this.gesturePending = !1;
        var t = this.currentInputState;
        if (!t.ignoreTouchMotion(e.numberTouches, e.touches)) {
            this.viewport.removeAnimator();
            var n = _.initGestureEvent(this.viewport, e),
                r = this.activeTool;
            Cesium.defined(r) && r.onMultiFingerMove(n) || this.idleTool.onMultiFingerMove(n), t.onTouchMotionChange(e.numberTouches, e.touches), n.reset()
        }
    }, N.prototype.processGestureInfo = function (e, t) {
        this.viewport.removeAnimator(), this.gesturePending = !1;
        var n = _.initGestureEvent(this.viewport, e),
            r = this.activeTool,
            i = x(r, t);
        Cesium.defined(i) && i.call(r, n) || x(this.idleTool, t).call(this.idleTool, n), n.reset()
    }, N.prototype.onTwoFingerTap = function (e) {
        this.processGestureInfo(e, "onTwoFingerTap")
    }, N.prototype.onPressAndTap = function (e) {
        this.processGestureInfo(e, "onPressAndTap")
    }, N.prototype.onSingleTap = function (e) {
        this.processGestureInfo(e, "onSingleTap")
    }, N.prototype.onDoubleTap = function (e) {
        this.processGestureInfo(e, "onDoubleTap")
    }, N.prototype.onLongPress = function (e) {
        this.processGestureInfo(e, "onLongPress")
    }, N.prototype.setPrimitiveTool = function (e) {
        var t = this.activeTool;
        Cesium.defined(this._primitiveTool) && this._primitiveTool.onCleanup(), this.invalidateLastWheelEvent(), this._primitiveTool = e;
        var n = this.activeTool;
        n != t && this.activeToolChanged.raiseEvent()
    }, N.prototype.setViewTool = function (e) {
        Cesium.defined(this._viewTool) && this._viewTool.onCleanup(), this.invalidateLastWheelEvent(), this._viewTool = e;
        var t = this._primitiveTool;
        Cesium.defined(t) ? Cesium.defined(e) ? t.onSuspended() : t.onResumed() : Cesium.defined(e) || this.setViewCursor(f.Default), this.activeToolChanged.raiseEvent()
    }, N.prototype.exitViewTool = function () {
        this.setViewCursor(this.suspendedCursor), this.suspendedCursor = void 0, this.setViewTool(void 0)
    }, N.prototype.startViewTool = function (e) {
        Cesium.defined(this.viewTool) ? this.setViewTool(void 0) : this.suspendedCursor = this.viewCursor, this.setViewCursor(f.CrossHair)
    }, N.prototype.startPrimitiveTool = function (e) {
        this.exitViewTool(), this.setPrimitiveTool(void 0), this.setViewCursor(f.Arrow)
    }, N.prototype.startDefaultTool = function () {
        Cesium.defined(this.defaultTool) && this.activeTool != this.defaultTool ? this.defaultTool.installTool() : (this.setPrimitiveTool(void 0), this.setViewCursor(f.Default))
    }, N.prototype.fillEventFromCursorLocation = function (e) {
        this.currentInputState.toEvent(e)
    }, N.prototype.fillEventFromDataButton = function (e) {
        this.currentInputState.toEventFromLastDataPoint(e)
    }, N.prototype.fillEventFromLastDataButton = function (e) {
        this.currentInputState.toEventFromLastDataPoint(e)
    }, N.prototype.setAdjustedDataPoint = function (e) {
        this.currentInputState.adjustLastDataPoint(e)
    };
    var I = new g;
    N.prototype.convertGestureSingleTapToButtonDownAndUp = function (e) {
        this.touchBridgeMode = !0;
        var t = e.getDisplayPoint(I);
        this.onDataButtonDown(t, r.Touch), this.onDataButtonUp(t, r.Touch), this.touchBridgeMode = !1
    }, N.prototype.convertGestureToResetButtonDownAndUp = function (e) {
        this.touchBridgeMode = !0;
        var t = e.getDisplayPoint(I);
        this.onResetButtonDown(t), this.onResetButtonUp(t), this.touchBridgeMode = !1
    }, N.prototype.convertGestureMoveToButtonDownAndMotion = function (e) {
        this.touchBridgeMode = !0, 0 == e.gestureInfo.previousNumberTouches ? this.onDataButtonDown(e.getDisplayPoint(), r.Touch) : this.onMouseMotion(e.getDisplayPoint(), r.Touch)
    }, N.prototype.convertGestureEndToButtonUp = function (e) {
        this.onDataButtonUp(e.getDisplayPoint(), r.Touch), this.touchBridgeMode = !1
    };
    var B = {
        zoomRatio: 1.75,
        navigateDistPct: 3,
        navigateMouseDistPct: 10
    };
    E.prototype.init = function (e) {
        this.ev = e
    }, E.prototype.cleanup = function () {
        this.ev = void 0
    }, E.prototype.process = function (e) {
        return this.doZoom(!1), !0
    }, E.prototype.doZoom = function (t) {
        var n = this.ev,
            r = B.zoomRatio;
        r = Math.max(1, r);
        var i = n.wheelDelta;
        i > 0 && (r = 1 / r);
        var o = n.point.clone(),
            a = o.clone(),
            c = n.viewport,
            l = c.view,
            f = c.getFrustum(),
            h = this._lastWheelEvent,
            p = Cesium.defined(h) && h.viewPoint.distanceSquaredXY(n.viewPoint) < s.mgds_fc_epsilon;
        if (c.isCameraOn) {
            a = c.worldToNpc(a, a);
            var m;
            p ? (m = c.worldToNpc(h.worldPoint), a.z = m.z) : (m = c.pickDepthBuffer(n.viewPoint), Cesium.defined(m) ? c.worldToNpc(m, a) : (m = c.determineDefaultRotatePoint(), c.worldToNpc(m, m), a.z = m.z)), c.npcToWorld(a, a);
            var v = u.fromFixedPointAndScaleFactors(a, r, r, r),
                g = l.cameraInfo.eyePoint.clone(),
                y = v.multiplyByPoint(g),
                w = e.fromDifferenceOf(y, g);
            w.magnitude() < s.oneCentimeter && (w.scaleToLength(s.oneMeter / 3), a.add(w));
            var o = l.targetPoint;
            o.add(w), y.sumOf(g, w, 1), c.pointIsBelowSurface(y) && (c.pushPtToSurface(y), w = e.fromDifferenceOf(y, g), o.copyFrom(l.targetPoint), o.add(w));
            var x = l.lookAt(y, o, l.yVector);
            return c.synchWithView(!0), C.animateZoom && d.animateFrustumChange(c, f, c.getFrustum(), 100), x
        }
        p && (a = h.worldPoint.clone());
        var b = c.worldToNpc(a),
            M = u.fromFixedPointAndScaleFactors(b, r, r, 1),
            T = new e(.5, .5, .5);
        if (t) {
            var N = e.fromDifferenceOf(b, T);
            N.z = 0;
            var w = u.fromMatrixAndTranslation(void 0, N);
            M.initProduct(M, w)
        }
        return M.multiplyByPoint(T, T), T = c.npcToWorld(T, T), c.zoom(T, r, !0)
    }, E.prototype.invalidateLastEvent = function () {
        this._lastWheelEvent = void 0
    }, E.prototype.doWheelPan = function (e) {}, E.prototype.doWheelSlide = function (e) {}, E.prototype.doWheelNavigate = function (e) {};
    var k = new E;
    return N.prototype.processMouseWheelEvent = function (e, t) {
        k.init(e);
        var n = k.process(t);
        return k.cleanup(), n
    }, N.prototype.invalidateLastWheelEvent = function () {
        k.invalidateLastEvent()
    }, N.prototype._createCameraController = function () {
        return new w(this)
    }, N.prototype.onPostInstallTool = function (e) {
        e.onPostInstall()
    }, N.prototype.onInstallTool = function (e) {
        return this.currentInputState.clearKeyQualifiers(), e.onInstall()
    }, N.prototype.setViewCursor = function (e) {
        e = Cesium.defaultValue(e, f.Default), this.viewCursor = e;
        var t = this.viewport.canvas;
        t.style.cursor = e
    }, N.prototype.resetViewCursor = function () {
        this.setViewCursor(f.Default)
    }, N.prototype.onViewportResized = function () {
        var e = this.activeTool;
        Cesium.defined(e) && e.onViewportResized()
    }, N
})