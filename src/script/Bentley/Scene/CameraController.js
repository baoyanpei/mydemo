define("CameraController", ["../Bim/InputEventModifiers", "../Math/Cartesian2", "../Tools/InputSource", "../Tools/GestureId", "../Tools/GestureInfo"], function (e, t, n, r, i) {
    function o(e, t, n) {
        var r = n.pixelsFromInches(t);
        return e >= r
    }

    function a(e, t) {
        if (p.DEBUG_TRACE) {
            var n = "UNRECOGNIZED";
            for (var r in m)
                if (m[r] === e) {
                    n = r;
                    break
                } console.log("TouchHandler new state: " + n)
        }
    }

    function s(e, t, n, r) {
        this.x = Cesium.defaultValue(e, 0), this.y = Cesium.defaultValue(t, 0), this.initialX = this.x, this.initialY = this.y, this.pointID = n, this.downTime = Cesium.defaultValue(r, 0), this.previousTime = this.downTime, this.velocityX = 0, this.velocityY = 0, this.updated = !1
    }

    function u(e) {
        this.queue = []
    }

    function c(e) {
        this.cameraController = e, this.touchPoints = [], this.previousNumberTouches = 0, this.firstDown = new s, this.lastUp = new s, this.firstTap1 = new s, this.firstTap2 = new s, this.secondTap1 = new s, this.secondTap2 = new s, this.queue = new u, this.lastTouchEventTime = 0, this.timerTime = Date.now(), this.initializeHandler()
    }

    function l(e, t, n, r) {
        return g.init(e, t), y.init(n, r), g.distance(y)
    }

    function f(e) {
        this.toolAdmin = e, this.element = e.viewport.canvas, this.touchHandler = new c(this), this.removalFunctions = [], this.registerListeners()
    }
    var h = {
            LEFT: 0,
            MIDDLE: 1,
            RIGHT: 2
        },
        p = {
            TAP_LIMIT: 800,
            TAP_CONFIRM_SINGLE_LIMIT: 200,
            TAP_INVALID_UP_TIME: 4294967295,
            LONG_PRESS_LIMIT: 500,
            INITIAL_MOVE_THRESHOLD: .09,
            DOUBLE_TAP_DIST_THRESHOLD: .25,
            TICK: .016,
            DEBUG_TRACE: !1
        },
        m = {
            Invalid: 0,
            Initial: 1,
            FirstDown: 2,
            SecondDown: 3,
            TapPending: 4,
            SecondTapDown: 5,
            SecondDownOneUp: 6,
            MovePending: 7,
            Moving: 8,
            InLongPress: 9,
            InLongPressAwaitingTap: 10
        },
        d = {
            OneFingerSingleTap: 0,
            OneFingerDoubleTap: 1,
            TwoFingerSingleTap: 2
        };
    s.prototype.copyFrom = function (e) {
        this.x = e.x, this.y = e.y, this.initialX = e.initialX, this.initialY = e.initialY, this.pointID = e.pointID, this.downTime = e.downTime, this.previousTime = e.previousTime, this.velocityX = e.velocityX, this.velocityY = e.velocityY, this.updated = e.updated
    }, s.prototype.clone = function (e) {
        var t = Cesium.defined(e) ? e : new s;
        return t.copyFrom(this), t
    }, Cesium.defineProperties(s.prototype, {
        changed: {
            get: function () {
                return this.updated
            }
        }
    }), s.prototype.update = function (e, t, n) {
        var r = p.INITIAL_MOVE_THRESHOLD;
        if (!this.updated && !o(Math.abs(e - this.initialX), r, n) && !o(Math.abs(t - this.initialY), r, n)) return !1;
        var i = Date.now(),
            a = i - this.previousTime;
        if (a > 2) {
            this.previousTime = i;
            var s = (e - this.x) / a,
                u = (t - this.y) / a;
            if (0 != this.velocityX) {
                var c = .2,
                    l = .8;
                this.velocityX = c * this.velocityX + l * s, this.velocityY = c * this.velocityY + l * u
            } else this.velocityX = s, this.velocityY = u
        }
        return this.updated = !0, this.x = e, this.y = t, !0
    }, u.prototype.push = function (e) {
        0 != this.queue.length && this.tryReplace(this.queue[this.queue.length - 1], e) || this.queue.push(e.clone())
    }, u.prototype.tryReplace = function (e, t) {
        if (e.isEndGesture) return !1;
        var n = e.gestureId;
        if (t.gestureId != n) return !1;
        switch (n) {
            case r.SingleFingerMove:
            case r.MultiFingerMove:
                if (e.numberTouches == t.numberTouches && e.previousNumberTouches == t.previousNumberTouches) return t.copyFrom(e), !0
        }
        return !1
    }, u.prototype.process = function (e) {
        var t = this.queue.length;
        if (t > 0) {
            for (var n = 0; n < t; n++) this.dispatch(this.queue[n], e);
            this.queue.length = 0
        }
    }, u.prototype.dispatch = function (e, t) {
        if (e.isEndGesture) return void t.onEndGesture(e);
        switch (e.gestureId) {
            case r.MultiFingerMove:
                return t.onMultiFingerMove(e);
            case r.SingleFingerMove:
                return t.onSingleFingerMove(e);
            case r.TwoFingerTap:
                return t.onTwoFingerTap(e);
            case r.PressAndTap:
                return t.onPressAndTap(e);
            case r.SingleTap:
                return t.onSingleTap(e);
            case r.DoubleTap:
                return t.onDoubleTap(e);
            case r.LongPress:
                return t.onLongPress(e)
        }
    }, Cesium.defineProperties(c.prototype, {
        viewport: {
            get: function () {
                return this.toolAdmin.viewport
            }
        },
        toolAdmin: {
            get: function () {
                return this.cameraController.toolAdmin
            }
        }
    }), c.prototype.initializeHandler = function () {
        this.tapDownTime = 0, this.tapUpTime = 0, this.touchPoints.length = 0, this.state = m.Initial, this.interpretingDataButtonAsTouch = !1, this.endGestureId = r.None
    }, c.prototype.isDestroyed = function () {
        return !1
    }, c.prototype.destroy = function () {
        return Cesium.destroyObject(this)
    }, c.prototype.update = function () {
        var e = Date.now();
        e - this.timerTime >= p.TICK && (this.timerTime = e, this.timerExpired())
    }, c.prototype.getPreviousNumberTouches = function (e) {
        var t = this.previousNumberTouches;
        return e && (this.previousNumberTouches = this.touchPoints.length), t
    }, c.prototype.setState = function (e) {
        a(e, this.state), m.Invalid == e && (!Cesium.defined(this.gestureId) || 0 == this.touchPoints.length && 0 == this.previousNumberTouches || this.sendEndGestureEvent(this.endGestureId, this.touchPoints[0].x, this.touchPoints[0].y, this.touchPoints, this.interpretingDataButtonAsTouch), this.previousNumberTouches = 0), m.Initial != e && m.Invalid != e || this.initializeHandler(), this.state = e
    };
    var v = new i;
    c.prototype.initGestureInfo = function (e, t, n, r, i, o, a) {
        var s = v;
        return s.init(e, t, n, r, i, o, a, this.getPreviousNumberTouches(!0)), s
    }, c.prototype.sendEvent = function (e) {
        this.queue.push(e)
    }, c.prototype.sendEndGestureEvent = function (e, t, n, r, i) {
        var o = this.initGestureInfo(e, t, n, 0, r, !0, i);
        this.sendEvent(o)
    }, c.prototype.touchCanceled = function () {
        this.setState(m.Invalid)
    }, c.prototype.onTouchEvent = function () {
        this.lastTouchEventTime = Date.now()
    }, c.prototype.getPoint = function (e) {
        for (var t = 0; t < this.touchPoints.length; t++) {
            var n = this.touchPoints[t];
            if (n.pointID == e) return n
        }
    }, c.prototype.removePoint = function (e) {
        for (var t = 0; t < this.touchPoints.length; t++) {
            var n = this.touchPoints[t];
            if (n.pointID == e) return this.touchPoints.splice(t, 1), !0
        }
        return !1
    }, c.prototype.touchDown = function (e, t, n, r, i) {
        this.onTouchEvent(), r <= this.touchPoints.length && this.setState(m.Invalid), this.state == m.Invalid && this.setState(m.Initial), this.interpretingDataButtonAsTouch |= i;
        var o = Date.now();
        switch (this.touchPoints.push(new s(e, t, n, o)), 1 == this.touchPoints.length && this.firstDown.copyFrom(this.touchPoints[0]), this.lastDown = n, this.state) {
            case m.Initial:
                this.previousNumberTouches = 0, this.tapDownTime = o, this.tapUpTime = p.TAP_INVALID_UP_TIME, this.setState(m.FirstDown);
                break;
            case m.FirstDown:
                this.setState(m.SecondDown);
                break;
            case m.SecondDown:
                this.setState(m.MovePending);
                break;
            case m.TapPending:
                this.setState(m.SecondTapDown);
                break;
            case m.SecondTapDown:
                this.setState(m.Invalid);
                break;
            case m.SecondDownOneUp:
                this.setState(m.Moving);
                break;
            case m.Moving:
                break;
            case m.InLongPress:
                this.firstTap1.copyFrom(this.touchPoints[0]), this.setState(m.InLongPressAwaitingTap);
                break;
            case m.InLongPressAwaitingTap:
                this.setState(m.Invalid)
        }
    }, c.prototype.touchUp = function (e, t) {
        this.onTouchEvent();
        var n = this.interpretingDataButtonAsTouch,
            i = this.getPoint(e);
        Cesium.defined(i) || this.setState(m.Invalid);
        var o = this.state;
        if (m.Invalid != o) {
            var a = Date.now();
            switch (o) {
                case m.Initial:
                case m.TapPending:
                    break;
                case m.FirstDown:
                    var s = a - this.tapDownTime;
                    s < p.TAP_LIMIT ? (this.setState(m.TapPending), this.tapUpTime = a, this.firstTap1.copyFrom(i)) : this.setState(m.Initial);
                    break;
                case m.SecondTapDown:
                    var s = a - this.tapDownTime;
                    s < p.TAP_LIMIT && (this.tapUpTime = a, this.secondTap1.copyFrom(i), this.handleTaps(!0)), this.setState(m.Initial);
                    break;
                case m.SecondDown:
                    var s = a - this.tapDownTime;
                    if (s > p.TAP_LIMIT) {
                        this.setState(m.Invalid);
                        break
                    }
                    this.firstTap1.copyFrom(i), this.setState(m.SecondDownOneUp);
                    break;
                case m.SecondDownOneUp:
                    var s = a - this.tapDownTime;
                    if (s > p.TAP_LIMIT) {
                        this.setState(m.Invalid);
                        break
                    }
                    this.firstTap2.copyFrom(i), this.handle2FingerTap(), this.setState(m.Initial);
                    break;
                case m.MovePending:
                    1 == this.touchPoints.length && this.setState(m.Initial);
                    break;
                case m.Moving:
                    if (1 == this.touchPoints.length) {
                        var u = this.endGestureId,
                            c = this.touchPoints[0];
                        this.setState(m.Initial), this.sendEndGestureEvent(u, c.x, c.y, this.touchPoints, n)
                    }
                    break;
                case m.InLongPress:
                    var u = r.PressAndTap != this.endGestureId ? r.LongPress : this.endGestureId,
                        c = this.touchPoints[0];
                    this.setState(m.Initial), this.sendEndGestureEvent(u, c.x, c.y, this.touchPoints, n);
                    break;
                case m.InLongPressAwaitingTap:
                    if (i.pointID == this.firstTap1.pointID) {
                        this.setState(m.Invalid);
                        break
                    }
                    this.handlePressAndTap(), this.setState(m.InLongPress), this.endGestureid = r.PressAndTap
            }
            this.removePoint(e)
        }
    };
    var g = new t,
        y = new t;
    c.prototype.touchMove = function (e, t, n, r) {
        this.onTouchEvent();
        var i = this.getPoint(n);
        if (Cesium.defined(i) || this.setState(m.Invalid), m.Invalid != this.state && i.update(e, t, this.viewport)) {
            switch (this.state) {
                case m.Initial:
                case m.TapPending:
                    break;
                case m.SecondDownOneUp:
                case m.MovePending:
                case m.FirstDown:
                case m.SecondDown:
                    this.setState(m.Moving);
                    break;
                case m.SecondTapDown:
                    this.setState(m.Moving);
                    break;
                case m.Moving:
                case m.InLongPress:
                    break;
                case m.InLongPressAwaitingTap:
                    this.setState(m.Invalid)
            }
            var o = this.state;
            m.InLongPress != o && m.Moving != o || this.handleMove(this.touchPoints)
        }
    }, c.prototype.tryLongPress = function () {
        return (m.FirstDown == this.state || 1 == this.touchPoints.length) && (!(Date.now() - this.touchPoints[0].previousTime < p.LONG_PRESS_LIMIT) && (this.sendLongPressEvent(this.touchPoints, this.interpretingDataButtonAsTouch), !0))
    }, c.prototype.sendLongPressEvent = function (e, t) {
        var n = this.initGestureInfo(r.LongPress, e[0].initialX, e[0].initialY, 0, e, !1, t);
        this.sendEvent(n)
    }, c.prototype.timerExpired = function () {
        switch (this.queue.process(this.toolAdmin), this.state) {
            case m.FirstDown:
                this.tryLongPress() && this.setState(m.InLongPress);
                break;
            case m.TapPending:
                this.handleTaps(!1) && this.setState(m.Initial)
        }
    }, c.prototype.handle2FingerTap = function () {
        var e = (this.firstTap1.x + this.firstTap2.x) / 2,
            t = (this.firstTap1.y + this.firstTap2.y) / 2;
        this.sendTapEvent(e, t, d.TwoFingerSingleTap, this.touchPoints, this.interpretingDataButtonAsTouch)
    }, c.prototype.sendTapEvent = function (e, t, n, i, o) {
        var a = r.SingleTap;
        switch (n) {
            case d.OneFingerDoubleTap:
                a = r.DoubleTap;
                break;
            case d.TwoFingerSingleTap:
                a = r.TwoFingerTap
        }
        var s = this.initGestureInfo(a, e, t, 0, i, !1, o);
        this.sendEvent(s)
    }, c.prototype.handlePressAndTap = function () {
        this.sendPressAndTapEvent(this.touchPoints, this.interpretingDataButtonAsTouch)
    }, c.prototype.sendPressAndTapEvent = function (e, t) {
        var n = e[0],
            i = e[1],
            o = l(i.x, i.y, n.x, n.y),
            a = this.initGesture(r.PressAndTap, n.x, n.y, o, e, !1, t);
        this.sendEvent(a)
    }, c.prototype.handleTap = function (e, t, n) {
        this.sendTapEvent(e, t, n ? d.OneFingerDoubleTap : d.OneFingerSingleTap, this.touchPoints, this.interpretingDataButtonAsTouch)
    }, c.prototype.handleTaps = function (e) {
        if (!e) {
            var t = Date.now() - this.tapUpTime;
            return !(t < p.TAP_CONFIRM_SINGLE_LIMIT) && (this.handleTap(this.firstTap1.x, this.firstTap1.y, !1), !0)
        }
        var n = l(this.firstTap1.x, this.firstTap1.y, this.secondTap1.x, this.secondTap1.y);
        return o(n, p.DOUBLE_TAP_DIST_THRESHOLD, this.viewport) ? (this.handleTap(this.firstTap1.x, this.firstTap1.y, !1), this.handleTap(this.secondTap1.x, this.secondTap1.y, !1)) : this.handleTap(this.firstTap1.x, this.firstTap1.y, !0), !0
    }, c.prototype.handleMultiFingerMove = function (e) {
        if (e.length < 2) return !1;
        r.SingleFingerMove == this.endGestureId && this.sendEndGestureEvent(this.endGestureId, this.touchPoints[0].x, this.touchPoints[0].y, this.touchPoints, this.interpretingDataButtonAsTouch);
        var t = e[0],
            n = e[1],
            i = l(t.x, t.y, n.x, n.y),
            o = (t.x + n.x) / 2,
            a = (t.y + n.y) / 2;
        return this.sendMultiFingerMoveEvent(o, a, i, e, this.interpretingDataButtonAsTouch), this.endGestureId = r.MultiFingerMove, !0
    }, c.prototype.sendMultiFingerMoveEvent = function (e, t, n, i, o) {
        var a = this.initGestureInfo(r.MultiFingerMove, e, t, n, i, !1, o);
        this.sendEvent(a)
    }, c.prototype.handleSingleFingerMove = function (e) {
        if (1 != e.length) return !1;
        if (r.MultiFingerMove == this.endGestureId && this.sendEndGestureEvent(this.endGestureId, this.touchPoints[0].x, this.touchPoints[0].y, this.touchPoints, this.interpretingDataButtonAsTouch), 0 == this.previousNumberTouches) {
            var t = [this.firstDown];
            this.sendSingleFingerMoveEvent(!1, t, this.interpretingDataButtonAsTouch)
        }
        return this.sendSingleFingerMoveEvent(!1, e, this.interpretingDataButtonAsTouch), this.endGestureId = r.SingleFingerMove, !0
    }, c.prototype.sendSingleFingerMoveEvent = function (e, t, n) {
        var i = this.initGestureInfo(r.SingleFingerMove, t[0].x, t[0].y, 1, t, !1, n);
        this.sendEvent(i)
    }, c.prototype.handleMove = function (e) {
        return this.handleSingleFingerMove(e) || this.handleMultiFingerMove(e)
    }, f.prototype.isDestroyed = function () {
        return !1
    }, f.prototype.destroy = function () {
        return this.unregisterListeners(), this.touchHandler = this.touchHandler && this.touchHandler.destroy(), Cesium.destroyObject(this)
    }, f.prototype.unregisterListeners = function () {
        for (var e = this.removalFunctions, t = 0; t < e.length; t++) e[t]();
        e.length = 0
    }, f.prototype.registerListener = function (e, t, n) {
        function r(e) {
            n.call(i, e)
        }
        var i = this;
        t.addEventListener(e, r, !1), this.removalFunctions.push(function () {
            t.removeEventListener(e, r, !1)
        })
    }, f.prototype.registerListeners = function () {
        var e = this.element;
        this.registerListener("mousedown", e, this.handleMouseDown), this.registerListener("mouseup", e, this.handleMouseUp), this.registerListener("mousemove", e, this.handleMouseMove);
        var t;
        t = "onwheel" in e ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll", this.registerListener(t, e, this.handleMouseWheel), this.registerListener("touchstart", e, this.handleTouchStart), this.registerListener("touchend", e, this.handleTouchEnd), this.registerListener("touchmove", e, this.handleTouchMove), this.registerListener("touchcancel", e, this.handleTouchCancel)
    }, f.prototype.recordShiftKey = function () {
        this.toolAdmin.currentInputState.setKeyQualifier(e.Shift, !0)
    }, f.prototype.recordControlKey = function () {
        this.toolAdmin.currentInputState.setKeyQualifier(e.Control, !0)
    }, f.prototype.clearKeyboardModifiers = function () {
        this.toolAdmin.currentInputState.clearKeyQualifiers()
    }, f.prototype.handleMiddleDown = function (e) {
        this.toolAdmin.onMiddleButtonDown(e)
    }, f.prototype.handleMiddleUp = function (e) {
        this.toolAdmin.onMiddleButtonUp(e)
    }, f.prototype.handleMouseWheel = function (e) {
        this.toolAdmin.onMouseWheel(e, this.toolAdmin.currentInputState.lastMotion)
    }, f.prototype.handleLeftDown = function (e) {
        this.toolAdmin.onDataButtonDown(e, n.Mouse)
    }, f.prototype.handleLeftUp = function (e) {
        this.toolAdmin.onDataButtonUp(e, n.Mouse)
    }, f.prototype.handleRightDown = function (e) {
        this.toolAdmin.onResetButtonDown(e)
    }, f.prototype.handleRightUp = function (e) {
        this.toolAdmin.onResetButtonUp(e)
    }, f.prototype.getMouseButtonHandler = function (e, t) {
        switch (e) {
            case h.LEFT:
                return t ? this.handleLeftDown : this.handleLeftUp;
            case h.MIDDLE:
                return t ? this.handleMiddleDown : this.handleMiddleUp;
            case h.RIGHT:
                return t ? this.handleRightDown : this.handleRightUp;
            default:
                return
        }
    }, f.prototype.recordKeyboardModifiers = function (e) {
        this.clearKeyboardModifiers(), e.shiftKey && this.recordShiftKey(), e.ctrlKey && this.recordControlKey()
    }, f.prototype.getPosition = function (e, t) {
        var n = this.element;
        if (n === document) return t.x = e.clientX, t.y = e.clientY, t;
        var r = n.getBoundingClientRect();
        return t.x = e.clientX - r.left, t.y = e.clientY - r.top, t
    };
    var w = new t;
    return f.prototype.handleMouseUpDown = function (e, t) {
        var n = this.getMouseButtonHandler(e.button, t);
        if (Cesium.defined(n)) {
            this.recordKeyboardModifiers(e);
            var r = this.getPosition(e, w);
            n.call(this, r), e.preventDefault()
        }
    }, f.prototype.handleMouseDown = function (e) {
        this.handleMouseUpDown(e, !0)
    }, f.prototype.handleMouseUp = function (e) {
        this.handleMouseUpDown(e, !1)
    }, f.prototype.handleMouseMove = function (e) {
        this.recordKeyboardModifiers(e);
        var t = this.getPosition(e, w);
        this.toolAdmin.onMouseMotion(t, n.Mouse), e.preventDefault()
    }, f.prototype.handleMouseWheel = function (e) {
        this.recordKeyboardModifiers(e);
        var t;
        if (Cesium.defined(e.deltaY)) {
            var n = e.deltaMode;
            t = n === e.DOM_DELTA_PIXEL ? -e.deltaY : n === e.DOM_DELTA_LINE ? 40 * -e.deltaY : 120 * -e.deltaY
        } else t = e.delta > 0 ? e.detail * -120 : e.wheelDelta;
        Cesium.defined(t) && (this.toolAdmin.onMouseWheel(t, this.toolAdmin.currentInputState.lastMotion), e.preventDefault())
    }, f.prototype.processTouches = function (e, t) {
        for (var n = e.changedTouches, r = e.touches.length, i = 0; i < n.length; i++) {
            var o = n[i],
                a = o.identifier,
                s = this.getPosition(o, w);
            t(this.touchHandler, a, r, s.x, s.y)
        }
        e.preventDefault()
    }, f.prototype.handleTouchStart = function (e) {
        this.processTouches(e, function (e, t, n, r, i) {
            e.touchDown(r, i, t, n, !1)
        })
    }, f.prototype.handleTouchEnd = function (e) {
        this.processTouches(e, function (e, t, n) {
            e.touchUp(t, n)
        })
    }, f.prototype.handleTouchMove = function (e) {
        this.processTouches(e, function (e, t, n, r, i) {
            e.touchMove(r, i, t, n)
        })
    }, f.prototype.handleTouchCancel = function (e) {
        this.touchHandler.touchCanceled()
    }, f.prototype.update = function () {
        this.touchHandler.update(), this.toolAdmin.onTimerEvent(), this.toolAdmin.viewport.apply()
    }, f
})