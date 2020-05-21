define("WindowAreaTool", ["../Math/Cartesian3", "./ViewTool", "../Util/extend", "./ToolId", "../Math/Range3", "../Math/Cartesian2"], function (e, t, n, r, i, o) {
    function a(e, t, n, r) {
        this._left = Cesium.defined(n) ? n.x : 0, this._top = Cesium.defined(n) ? n.y : 0, this._width = Cesium.defined(r) ? r.x : 0, this._height = Cesium.defined(r) ? r.y : 0, this.ruleColor = "1px solid " + Cesium.defaultValue(t, "white");
        var i = document.createElement("div");
        this.element = i, this.parentElement = e;
        var a = document.createElement("div");
        a.style.height = "0px", a.style.left = "0px", this.horizontalRule = a, e.appendChild(a);
        var s = document.createElement("div");
        s.style.top = "0px", s.style.width = "0px", this.verticalRule = s, e.appendChild(s), this.crossHalfLength = 7, this.firstPt = new o;
        var u = document.createElement("div");
        u.style.height = u.left = "0px", this.horizontalCross = u, e.appendChild(u);
        var c = document.createElement("div");
        c.style.top = c.style.width = "0px", this.verticalCross = c, e.appendChild(c), this._setVisible(!1, !0), this.update(), e.appendChild(i)
    }

    function s(n) {
        t.call(this, n, r.WindowArea), this.haveFirstPoint = !1, this.firstPtWorld = new e, this.secondPtWorld = new e, this.corners = [new e, new e], this.overlay = new a(n.canvas.parentElement, n.getContrastToBackgroundColor()), this.overlay.visible = !1
    }
    return a.prototype._setVisible = function (e, t) {
        (t || e != this.visible) && (this.element.className = e ? "bim-overlay-box" : "bim-hidden", this.horizontalRule.className = e ? "bim-hidden" : "bim-overlay-box-rule-horizontal", this.verticalRule.className = e ? "bim-hidden" : "bim-overlay-box-rule-vertical", this.horizontalCross.className = e ? "bim-overlay-box-rule-horizontal" : "bim-hidden", this.verticalCross.className = e ? "bim-overlay-box-rule-vertical" : "bim-hidden", this.horizontalRule.style.borderBottom = this.ruleColor, this.verticalRule.style.borderLeft = this.ruleColor, this.horizontalCross.style.borderBottom = this.ruleColor, this.verticalCross.style.borderLeft = this.ruleColor, this.element.style.border = this.ruleColor)
    }, Cesium.defineProperties(a.prototype, {
        visible: {
            get: function () {
                return "bim-overlay-box" == this.element.className
            },
            set: function (e) {
                this._setVisible(e)
            }
        },
        origin: {
            get: function () {
                return new o(this.left, this.top)
            },
            set: function (e) {
                this._left = e.x, this._top = e.y, this.update()
            }
        },
        extents: {
            get: function () {
                return new o(this.width, this.height)
            },
            set: function (e) {
                this.width = e.x, this.height = e.y, this.update()
            }
        },
        bottomRight: {
            get: function () {
                return new o(this.left + this.width, this.top + this.height)
            },
            set: function (e) {
                this._width = e.x - this.left, this._height = e.y - this.top, this.update()
            }
        },
        center: {
            get: function () {
                return new o(this.left + this.width / 2, this.top + this.height / 2)
            }
        },
        left: {
            get: function () {
                return this._left
            },
            set: function (e) {
                this._left = e, this.update()
            }
        },
        top: {
            get: function () {
                return this._top
            },
            set: function (e) {
                this._top = e, this.update()
            }
        },
        width: {
            get: function () {
                return this._width
            },
            set: function (e) {
                this._width = e, this.update()
            }
        },
        height: {
            get: function () {
                return this._height
            },
            set: function (e) {
                this._height = e, this.update()
            }
        },
        right: {
            get: function () {
                return this._left + this._width
            },
            set: function (e) {
                this._width = e - this._left, this.update()
            }
        },
        bottom: {
            get: function () {
                return this._top + this._height
            },
            set: function (e) {
                this._height = e - this._top, this.update()
            }
        }
    }), a.prototype.destroy = function () {
        this._destroyed || (this.parentElement.removeChild(this.element), this.parentElement.removeChild(this.horizontalRule), this.parentElement.removeChild(this.verticalRule), this.parentElement.removeChild(this.horizontalCross), this.parentElement.removeChild(this.verticalCross), this._destroyed = !0)
    }, a.prototype.update = function () {
        var e = this.element.style;
        e.left = this._left + "px", e.top = this._top + "px", e.width = this._width + "px", e.height = this._height + "px", this.horizontalRule.style.width = this.parentElement.clientWidth + "px", this.horizontalRule.style.top = this._top + "px", this.verticalRule.style.height = this.parentElement.clientHeight + "px", this.verticalRule.style.left = this._left + "px", this.horizontalCross.style.width = 2 * this.crossHalfLength + 1 + "px", this.horizontalCross.style.top = this.firstPt.y + "px", this.horizontalCross.style.left = this.firstPt.x - this.crossHalfLength + "px", this.verticalCross.style.height = 2 * this.crossHalfLength + 1 + "px", this.verticalCross.style.left = this.firstPt.x + "px", this.verticalCross.style.top = this.firstPt.y - this.crossHalfLength + "px"
    }, n(t, s), s.prototype.onCleanup = function () {
        Cesium.defined(this.overlay) && (this.overlay.destroy(), this.overlay = void 0)
    }, s.prototype.onModelEndDrag = function (e) {
        return this.onDataButtonDown(e)
    }, s.prototype.onReinitialize = function () {
        this.haveFirstPoint = !1, this.firstPtWorld.zero(), this.secondPtWorld.zero()
    }, s.prototype.onModelMotion = function (e) {
        this.doManipulation(e, !0)
    }, s.prototype.updateDynamics = function (e) {
        this.doManipulation(e, !0)
    }, s.prototype.onDataButtonDown = function (e) {
        return this.haveFirstPoint ? (this.secondPtWorld.copyFrom(e.point), this.doManipulation(e, !1), this.onReinitialize()) : (this.firstPtWorld.copyFrom(e.point), this.secondPtWorld.copyFrom(this.firstPtWorld), this.haveFirstPoint = !0, this.overlay.firstPt.x = e.viewPoint.x, this.overlay.firstPt.y = e.viewPoint.y), !0
    }, s.prototype.onResetButtonUp = function (e) {
        return this.haveFirstPoint ? (this.haveFirstPoint = !1, !0) : t.prototype.onResetButtonUp.call(this, e)
    }, s.prototype.computeWindowCorners = function () {
        var t = this.viewport,
            n = this.corners;
        n[0].copyFrom(this.firstPtWorld), n[1].copyFrom(this.secondPtWorld), t.worldToViewArray(n);
        var r = e.fromDifferenceOf(n[1], n[0]);
        if (!(r.magnitudeXY() < 2)) {
            var i = this.viewport.viewDelta;
            if (0 != i.x && 0 != r.x) {
                var o, a, s = i.y / i.x,
                    u = Math.abs(r.y / r.x);
                u < s ? (o = Math.abs(r.x) / 2, a = o * s) : (a = Math.abs(r.y) / 2, o = a / s);
                var c = e.fromSumOf(n[0], r, .5);
                return n[0].x = c.x - o, n[0].y = c.y - a, n[1].x = c.x + o, n[1].y = c.y + a, n
            }
        }
    }, s.prototype.doManipulation = function (n, r) {
        if (this.secondPtWorld.copyFrom(n.point), r) return void this.updateOverlay();
        var i = this.computeWindowCorners();
        if (Cesium.defined(i)) {
            var a = this.viewport,
                s = a.getFrustum();
            if (a.isCameraOn) {
                var u = a.pickRange(this.overlay.origin, this.overlay.extents);
                if (!Cesium.defined(u)) return;
                var c = u.minDepth,
                    l = a.windowToDrawingBufferFlipY(this.overlay.center),
                    f = a.drawingBufferToWorld(l, c);
                if (this.overlay.width < this.overlay.height) var h = new o(this.overlay.left, this.overlay.top + this.overlay.height / 2);
                else var h = new o(this.overlay.left + this.overlay.width / 2, this.overlay.top);
                var p = a.windowToDrawingBufferFlipY(h),
                    m = a.drawingBufferToWorld(p, c),
                    d = e.distance(f, m),
                    v = new Cesium.BoundingSphere(f, d);
                a.fitBoundingSphere(v)
            } else a.viewToWorldArray(i), a.changeArea(i);
            t.animateFrustumChange(a, s, a.getFrustum())
        }
    }, s.prototype.updateOverlay = function () {
        this.haveFirstPoint ? this.updateRectangle() : this.updateRules()
    }, s.prototype.updateRectangle = function () {
        var e = this.viewport.worldToView(this.firstPtWorld);
        this.overlay.firstPt.x = e.x, this.overlay.firstPt.y = e.y;
        var t = this.computeWindowCorners();
        if (this.overlay.visible = Cesium.defined(t), this.overlay.visible) {
            var n = i.from2Points(t[0], t[1]);
            this.overlay.left = n.low.x, this.overlay.top = n.low.y, this.overlay.right = n.high.x, this.overlay.bottom = n.high.y
        }
    }, s.prototype.updateRules = function () {
        var e = this.getCurrentButtonEvent();
        this.overlay.left = e.viewPoint.x, this.overlay.top = e.viewPoint.y, this.overlay.visible = !1
    }, s.prototype.onSingleFingerMove = function (e) {
        return this.toolAdmin.convertGestureMoveToButtonDownAndMotion(e), !0
    }, s.prototype.onEndGesture = function (e) {
        return this.toolAdmin.convertGestureEndToButtonUp(e), !0
    }, s
})