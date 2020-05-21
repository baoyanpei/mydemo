define("Viewport", ["./View", "../Tools/ViewTool", "./ViewRect", "./Frustum", "../Math/Cartesian3", "../Math/Matrix3", "../Math/Matrix4", "../Math/Map4", "../Math/Range3", "./NpcCorners", "./CoordSystem", "../Math/Constants", "../Tools/ToolAdmin", "./Element", "../Util/functionDefined", "../Math/Cartesian2", "../Scene/SelectionSetStyler", "../Scene/TilesetStyler", "../Scene/PropertyVisibilityStyler", "../Tools/ViewToolSettings"], function (e, t, n, r, i, o, a, s, u, c, l, f, h, p, m, d, v, g, y, w) {
    function x(e, t, n) {
        this.scene = e, this.geometry = t, this.viewOrg = new i, this.viewDelta = new i, this.viewOrgUnexpanded = new i, this.viewDeltaUnexpanded = new i, this.rotMatrix = new o, this.rootToView = new s, this.rootToNpc = new s, this.frustFraction = 0, this.zClipAdjusted = !1, this.screenOrigin = new d(0, 0), this.resized = new Cesium.Event;
        var r = t.bim;
        if (this.viewActivated = new Cesium.Event, this.activeView = r.defaultView, this.toolAdmin = new h(this), this.styler = new g(t), this.categoryStyler = new y(this, "category", r.categories), this.selectionSetStyler = new v(this), this.forwardStack = [], this.backStack = [], this.maxUndoSteps = 20, this.currentBaseline = void 0, this.historyApplied = new Cesium.Event, this.historyChanged = new Cesium.Event, this.isGlobeVisibleChanged = new Cesium.Event, this.activateView(Cesium.defaultValue(n, r.defaultView)), Cesium.defined(r.groundPoint)) {
            e.globe.depthTestAgainstTerrain = !1, this.needHeightAdjustment = 1;
            var a = this;
            e.terrainProviderChanged.addEventListener(function () {
                a.adjustHeight()
            })
        }
        e.pickTranslucentDepth = !0
    }

    function b(e) {
        if (e.camera.frustum instanceof Cesium.OrthographicFrustum) {
            var t = e.getFrustum(l.World, !1, A),
                n = t.pts[c.LeftBottomRear],
                r = t.pts[c.RightBottomRear];
            e.camera.frustum.width = r.distance(n)
        }
    }

    function C(e) {
        var t = e.view,
            n = e.camera.frustum instanceof Cesium.OrthographicFrustum;
        if (n == t.isCameraOn) {
            var r = e.camera = t.isCameraOn ? new Cesium.PerspectiveFrustum : new Cesium.OrthographicFrustum,
                i = e.getViewRect();
            r.aspectRatio = i.aspect, e.camera.frustum = r, t.isCameraOn || (r.width = e.camera.positionCartographic.height)
        }
    }

    function M(e, t, n, r) {
        e.position.copyFrom(t), e.direction.copyFrom(n), e.up.copyFrom(r), i.cross(e.direction, e.up, e.right), i.cross(e.right, e.direction, e.up), e.up.normalize(), e.right.normalize()
    }

    function T(e, t, n, r) {
        r = Cesium.defaultValue(r, t);
        for (var i = 0; i < t.length; i++) n.call(e, t[i], r[i])
    }

    function N(e, t, n, r) {
        var o = e.geometry,
            a = o.modelMatrix;
        if (Cesium.defined(a)) {
            var s = n - t,
                u = s / i.magnitude(r),
                c = new i;
            i.multiplyByScalar(r, u, c);
            var l = new i(c.x - a[12], c.y - a[13], c.z - a[14]);
            o.adjustTranslation(c), e.camera.worldToCameraCoordinatesVector(l, l);
            var f = e.view,
                h = f.cameraInfo.eyePoint.clone();
            h.add(l);
            var p = i.fromSumOf(h, f.dir, f.cameraInfo.focusDistance);
            f.lookAt(h, p, f.up) && e.synchWithView(!0)
        }
    }
    Cesium.defineProperties(x.prototype, {
        bim: {
            get: function () {
                return this.geometry.bim
            }
        },
        camera: {
            get: function () {
                return this.scene.camera
            }
        },
        canvas: {
            get: function () {
                return this.scene.canvas
            }
        },
        clientWidth: {
            get: function () {
                return this.canvas.clientWidth
            }
        },
        clientHeight: {
            get: function () {
                return this.canvas.clientHeight
            }
        },
        isUndoPossible: {
            get: function () {
                return 0 < this.backStack.length
            }
        },
        isRedoPossible: {
            get: function () {
                return 0 < this.forwardStack.length
            }
        },
        selectionSet: {
            get: function () {
                return this.toolAdmin.selectionSet
            }
        },
        terrainProvider: {
            get: function () {
                return this.scene.terrainProvider
            },
            set: function (e) {
                this.scene.terrainProvider = e
            }
        },
        shadows: {
            get: function () {
                return this.scene.shadowMap.enabled
            },
            set: function (e) {
                this.scene.shadowMap.enabled = e
            }
        },
        pixelsPerInch: {
            get: function () {
                return 96
            }
        },
        allow3dManipulations: {
            get: function () {
                return this.view.is3d
            }
        },
        isGlobeDefined: {
            get: function () {
                return this.view.isSpatialView && this.bim.displayInPlace
            }
        },
        isGlobeVisible: {
            get: function () {
                return this.isGlobeDefined && this.scene.globe.show
            },
            set: function (e) {
                var t = this.scene;
                if (Cesium.defined(t.globe) && t.globe.show !== e) {
                    t.globe.show = e;
                    var n = e ? this : t,
                        r = e ? t : this;
                    r.skyBox = n.skyBox, r.skyAtmosphere = n.skyAtmosphere, r.sun = n.sun, r.moon = n.moon, n.skyBox = n.skyAtmosphere = n.sun = n.moon = void 0, this.isGlobeVisibleChanged.raiseEvent(this), this._cameraDirty = !0
                }
            }
        },
        isCameraOn: {
            get: function () {
                return this.view.isCameraOn
            }
        }
    });
    var E = 3e-4,
        A = new r;
    x.prototype.activateView = function (e) {
        var t = this.activeView;
        this.activeView = e, this.view = e.clone(), this.geometry.models = this.activeView.models, this.categoryStyler.setForValues(e.categories, !0), this.isGlobeVisible = this.isGlobeDefined, this.isGlobeVisibleChanged.raiseEvent(this), this.setupFromView(), this._changeFov = !0, e.init(), C(this), this.viewActivated.raiseEvent(this, this.activeView != t), this.toolAdmin.startDefaultTool(), this.clearUndo(), this.saveViewUndo(), this.historyChanged.raiseEvent(), this._cameraDirty = !0
    }, x.prototype.getActiveViewId = function (e) {
        var t = this.geometry.bim.views,
            n = this;
        return Object.keys(t).filter(function (e) {
            return t[e].name === n.activeView.name
        })[0]
    }, x.prototype.animate = function () {
        Cesium.defined(this.animator) && this.animator.animate(this) && (this.animator.destroy(), this.animator = void 0)
    }, x.prototype.removeAnimator = function () {
        Cesium.defined(this.animator) && (this.animator.interrupt(this), this.animator = void 0)
    }, x.prototype.setAnimator = function (e) {
        this.removeAnimator(), this.animator = e
    }, x.prototype.synchWithView = function (e) {
        this.setupFromView(), e && this.saveViewUndo()
    }, x.prototype.saveViewUndo = function () {
        var e = this.view.clone();
        return Cesium.defined(this.currentBaseline) ? void(e.equals(this.currentBaseline) || (this.backStack.length >= this.maxUndoSteps && this.backStack.shift(), this.backStack.push(this.currentBaseline), this.forwardStack.length = 0, this.currentBaseline = e, this.historyChanged.raiseEvent())) : void(this.currentBaseline = e)
    }, x.prototype.clearUndo = function () {
        this.currentBaseline = void 0, this.forwardStack.length = 0, this.backStack.length = 0
    }, x.prototype.applyPrevious = function (e) {
        var t = this.backStack.length;
        0 != t && (this.forwardStack.push(this.currentBaseline), this.currentBaseline = this.backStack[t - 1], this.backStack.pop(), this.applyViewState(this.currentBaseline, e), this.historyApplied.raiseEvent(!0))
    }, x.prototype.applyNext = function (e) {
        var t = this.forwardStack.length;
        0 != t && (this.backStack.push(this.currentBaseline), this.currentBaseline = this.forwardStack[t - 1], this.forwardStack.pop(), this.applyViewState(this.currentBaseline, e), this.historyApplied.raiseEvent(!1))
    }, x.prototype.applyViewState = function (e, n) {
        var r = this.getFrustum();
        this.view = e.clone(), this.synchWithView(!1), this._changeFov = !0;
        var i = this.getFrustum();
        t.animateFrustumChange(this, r, i, n)
    }, x.prototype.adjustFrustumPlanes = function () {
        var e, t, n = this.view;
        if (this.isGlobeVisible) t = 5e8, e = 1;
        else {
            var r = i.subtract(n.dest, n.is3d ? this.viewOrg : n.origin, S);
            if (this.rotMatrix.multiply(r), n.is3d) t = r.z, e = t - this.viewDelta.z;
            else {
                var o = n.getViewedExtents(O),
                    a = o.high.z - o.low.z,
                    s = r.z;
                e = s - a, t = s + a
            }
        }
        e = Math.max(e, 1e-6), e >= t && (t = e + 1), this.camera.frustum.far = t, this.camera.frustum.near = e
    };
    var S = new i,
        P = new i,
        O = new u;
    x.prototype.apply = function () {
        this.styler._update(), Cesium.defined(this.needHeightAdjustment) && (this.needHeightAdjustment += 1, this.needHeightAdjustment > 5 && (this.needHeightAdjustment = void 0, this.adjustHeight()));
        var e = this.view;
        if (this.animate(), e.init(this.cameraInfo) || this._cameraDirty) {
            this._cameraDirty = !1;
            var t = (this.geometry, e.dest.clone(P));
            this.camera.constrainedAxis = void 0, M(this.camera, t, e.dir, e.up);
            var n = this._changeFov;
            if (this._changeFov = !1, n && (this.camera.frustum.fov = e.isCameraOn ? e.fov : void 0), Cesium.defined(e.backgroundColor)) {
                var r = this.scene;
                r.backgroundColor.red = e.backgroundColor.red, r.backgroundColor.green = e.backgroundColor.green, r.backgroundColor.blue = e.backgroundColor.blue
            }
            b(this), this.adjustFrustumPlanes()
        }
    }, x.prototype.determineVisibleDepthNpc = function (e) {
        Cesium.defined(e) || (e = new u(new i(0, 1, 0), new i(1, 0, 1)));
        var t = this.npcToView(e.low),
            n = this.npcToView(e.high);
        return n.subtract(t), this.pickRange(t, n)
    };
    var _ = new i,
        I = new i;
    x.prototype.determineDefaultRotatePoint = function (e) {
        Cesium.defined(e) || (e = new i);
        var t = void 0,
            n = 0,
            r = 1;
        if (Cesium.defined(t)) n = this.npcToWorld(new i(.5, .5, t.minDepth)), r = this.npcToWorld(new i(.5, .5, t.maxDepth));
        else if (this.view.isCameraOn) return this.getCameraTarget(e), e;
        var o = _,
            a = I;
        return o.init(.5, .5, n), a.init(.5, .5, r), this.npcToWorld(o, o), this.npcToWorld(a, a), e.interpolate(o, .5, a), e
    }, x.prototype.getCameraTarget = function (e) {
        Cesium.defined(e) || (e = new i);
        var t = this.rotMatrix.getRow(2);
        return e.sumOf(this.cameraInfo.eyePoint, t, -1 * this.cameraInfo.focusDistance), e
    }, x.prototype.setupFromView = function () {
        var e = this.view;
        if (!Cesium.defined(e)) return !1;
        this.adjustAspectRatio(!1), this.zClipAdjusted = !1;
        var t = e.origin.clone(),
            n = e.extents.clone();
        if (o.clone(e.rotation, this.rotMatrix), i.clone(t, this.viewOrg), i.clone(t, this.viewOrgUnexpanded), i.clone(n, this.viewDelta), i.clone(n, this.viewDeltaUnexpanded), e.is3d) {
            if (this.view.isCameraOn ? (this.cameraInfo = e.cameraInfo.clone(), this.validateCamera()) : this.cameraInfo = void 0, this.adjustZPlanes(t, n), (!t.equals(this.viewOrgUnexpanded) || !n.equals(this.viewDeltaUnexpanded)) && (this.zClipAdjusted = !0, this.view.isCameraOn)) {
                var r = new i;
                r.differenceOf(this.cameraInfo.eyePoint, t), this.rotMatrix.multiply(r);
                var a = r.z - 15.2 * f.oneCentimeter;
                n.z > a && (n.z = a)
            }
        } else this.alignWithRootZ(), n.z = 200 * f.oneMillimeter, t.z = -100 * f.oneMillimeter;
        i.clone(t, this.viewOrg), i.clone(n, this.viewDelta);
        var s = this.rootToNpcFromViewDef(this.cameraInfo, this.viewOrg, this.viewDelta, this.rotMatrix, this.rootToNpc);
        if (!Cesium.defined(s)) return !1;
        this.frustFraction = s;
        var u = this.calcNpcToView();
        return this.rootToView.initProduct(u, this.rootToNpc), !0
    }, x.prototype.validateCamera = function () {
        var e = this.cameraInfo;
        if (e.validateLens(), !e.isFocusValid) {
            var t = this.view,
                n = t.extents,
                r = n.x > n.y ? n.x : n.y,
                o = r / (2 * Math.tan(e.lensAngle / 2));
            o < n.z / 2 && (o = n.z / 2);
            var a = new i(n.x / 2, n.y / 2, n.z / 2 + o);
            t.rotation.multiplyTransposeInPlace(a), a.add(t.origin), i.clone(a, e.eyePoint), e.focusDistance = o
        }
    }, x.prototype.adjustZPlanes = function (e, t) {
        var n = e.clone(),
            o = t.clone();
        this.rotMatrix.multiply(e);
        var s = a.fromRotationTranslation(this.rotMatrix),
            u = this.cameraInfo,
            c = this.view,
            l = c.getViewedExtents(),
            h = r.fromRange(l);
        h.multiply(s), l = h.toRange(), e.z = l.low.z, t.z = l.high.z - e.z;
        var p = 1;
        if (this.view.isCameraOn) {
            var m = e.clone();
            this.rotMatrix.multiplyTransposeInPlace(m);
            var d = new i;
            if (d.differenceOf(u.eyePoint, m), this.rotMatrix.multiply(d), p = d.z / u.focusDistance, p <= 0) return i.clone(n, e), void i.clone(o, t)
        }
        t.z = Math.max(t.z, f.oneMeter);
        var v = Math.max(t.x, t.y) * p;
        if (v > t.z) {
            var g = v - t.z;
            e.z -= g / 2, t.z += g
        }
        this.rotMatrix.multiplyTransposeInPlace(e)
    }, x.prototype.adjustAspectRatio = function (e) {
        var t = this.getViewRect();
        this.view.adjustAspectRatio(t.aspect, e)
    }, x.prototype.rootToNpcFromViewDef = function (e, t, n, r, o) {
        var a, u = r.getRow(0),
            c = r.getRow(1),
            l = r.getRow(2),
            h = new i,
            p = new i,
            m = new i,
            d = new i;
        if (Cesium.defined(e)) {
            var v = i.fromStartEnd(e.eyePoint, t);
            r.multiply(v);
            var g = e.focusDistance,
                y = n.z,
                w = v.z,
                x = w + y,
                b = E;
            if (x / w < b) {
                var C = 1e4 * f.oneKilometer; - w > C && (w = -C, v.z = w), x = w * b, y = x - v.z
            }
            var M = -w / g,
                T = -x / g;
            a = T / M, h.scaleByVector(u, n.x * M), p.scaleByVector(c, n.y * M), m.x = v.x * (T - M), m.y = v.y * (T - M), m.z = y, r.multiplyTransposeInPlace(m), d.x = v.x * M, d.y = v.y * M, d.z = v.z, r.multiplyTransposeInPlace(d), d.add(e.eyePoint)
        } else a = 1, d = t.clone(), h.scaleByVector(u, n.x), p.scaleByVector(c, n.y), m.scaleByVector(l, n.z);
        var N = new s;
        return !!N.initFromVectorFrustum(d, h, p, m, a) && (s.clone(N, o), !0)
    }, x.prototype.getViewCorners = function (e) {
        var t = this.getViewRect();
        return Cesium.defined(e) || (e = new u), e.low.x = t.origin.x, e.high.x = t.corner.x, e.low.y = t.corner.y, e.high.y = t.origin.y, e.low.z = -32767, e.high.z = 32767, e
    }, x.prototype.getViewRect = function () {
        return n.from4Points(0, 0, this.clientWidth, this.clientHeight)
    }, x.prototype.calcNpcToView = function () {
        var e = this.getViewCorners();
        return s.fromRanges(c.Corners[c.LeftBottomRear], c.Corners[c.RightTopFront], e.low, e.high)
    }, x.prototype.getContrastToBackgroundColor = function () {
        var e = "white",
            t = this.view.backgroundColor;
        if (Cesium.defined(t)) {
            var n = t.red + t.green + t.blue;
            n > 1.5 && (e = "black")
        }
        return e
    }, x.prototype.fitView = function (e, t) {
        var n = this.computeViewRange(),
            r = this.getViewRect().aspect;
        this.view.lookAtViewAlignedVolume(n, r, e), this.synchWithView(t)
    }, x.prototype.fitBoundingSphere = function (e) {
        var t = this.camera,
            n = t.frustum,
            r = Math.tan(.5 * n.fovy),
            o = n.aspectRatio * r,
            s = Math.max(e.radius / o, e.radius / r),
            u = new i;
        i.multiplyByScalar(t.direction, -s, u);
        var c = new i;
        i.add(e.center, u, c), u.differenceOf(c, t.position);
        var l = a.fromTranslation(u),
            n = this.getWorldFrustum();
        n.multiply(l), this.setupFromFrustum(n) && this.saveViewUndo()
    }, x.prototype.computeViewRange = function () {
        this.setupFromView();
        var e = this.geometry.range,
            t = this.geometry.modelMatrix;
        t.multiply(e.low), t.multiply(e.high);
        var n = e.getCenter(),
            r = e.high,
            s = i.fromDifferenceOf(r, n),
            c = o.fromScaleFactors(s.x, s.y, s.z),
            l = a.fromRotationTranslation(c, n),
            f = 1,
            h = new u(new i(-f, -f, -f), new i(f, f, f));
        l.multiplyByPoint(h.low, h.low),
            l.multiplyByPoint(h.high, h.high);
        var p = h.get8Corners();
        this.rotMatrix.multiplyArray(p);
        var m = u.fromArray(p);
        return m
    }, x.prototype.viewToScreen = function (e, t) {
        var n = Cesium.defined(t) ? t : new i,
            r = this.screenOrigin;
        return n.init(r.x + e.x, r.y + e.y, 0), n
    }, x.prototype.viewToScreenArray = function (e, t) {
        T(this, e, this.viewToScreen, t)
    };
    var B = new u,
        k = new a;
    x.prototype.npcToView = function (e, t) {
        Cesium.defined(t) || (t = new i);
        var n = this.getViewCorners(B),
            r = k;
        return a.initFromRange(r, void 0, n.low, n.high), r.multiplyByPoint(e, t)
    }, x.prototype.npcToViewArray = function (e, t) {
        T(this, e, this.npcToView, t)
    }, x.prototype.viewToNpc = function (e, t) {
        Cesium.defined(t) || (t = new i);
        var n = this.getViewCorners(B),
            r = k;
        return a.initFromRange(void 0, r, n.low, n.high), r.multiplyByPoint(e, t)
    }, x.prototype.viewToNpcArray = function (e, t) {
        T(this, e, this.viewToNpc, t)
    }, x.prototype.worldToView = function (e, t) {
        return this.rootToView.m0.multiplyAndRenormalize(e, t)
    }, x.prototype.worldToViewArray = function (e, t) {
        T(this, e, this.worldToView, t)
    }, x.prototype.viewToWorld = function (e, t) {
        return this.rootToView.m1.multiplyAndRenormalize(e, t)
    }, x.prototype.viewToWorldArray = function (e, t) {
        T(this, e, this.viewToWorld, t)
    }, x.prototype.worldToNpc = function (e, t) {
        return this.rootToNpc.m0.multiplyAndRenormalize(e, t)
    }, x.prototype.worldToNpcArray = function (e, t) {
        T(this, e, this.worldToNpc, t)
    }, x.prototype.npcToWorld = function (e, t) {
        return this.rootToNpc.m1.multiplyAndRenormalize(e, t)
    }, x.prototype.npcToWorldArray = function (e, t) {
        T(this, e, this.npcToWorld, t)
    }, x.prototype.getFocusPlaneNpc = function () {
        var e = this.getCameraTarget(),
            t = this.worldToNpc(e, e).z;
        if (t < 0 || t > 1) {
            var n = this.npcToWorld(new i(.5, .5, 1)),
                r = this.npcToWorld(new i(.5, .5, 0)),
                o = i.fromInterpolate(n, .5, r);
            o = this.worldToNpc(o, o), t = o.z
        }
        return t
    }, x.prototype.getCameraTarget = function (e) {
        Cesium.defined(e) || (e = new i);
        var t = this.rotMatrix.getRow(2),
            n = this.cameraInfo;
        return e.sumOf(n.eyePoint, t, -1 * n.focusDistance), e
    }, x.prototype.getWorldFrustum = function (e) {
        return this.getFrustum(void 0, void 0, e)
    }, x.prototype.getFrustum = function (e, t, n) {
        if (e = Cesium.defaultValue(e, l.World), t = Cesium.defaultValue(t, !0), Cesium.defined(n) || (n = new r), !t && this.zClipAdjusted) {
            var o = new s,
                a = this.rootToNpcFromViewDef(this.view.isCameraOn ? this.cameraInfo : void 0, this.viewOrgUnexpanded, this.viewDeltaUnexpanded, this.rotMatrix, o);
            if (!Cesium.defined(a)) return;
            for (var u = [], f = 0; f < c.CornerCount; f++) u.push(new i);
            o.m1.multiplyAndRenormalizeArray(c.Corners, u), this.worldToNpcArray(u, n.pts)
        } else
            for (var f = 0; f < c.CornerCount; f++) n.pts[f].copyFrom(c.Corners[f]);
        switch (e) {
            case l.View:
                this.npcToViewArray(n.pts);
                break;
            case l.World:
                this.npcToWorldArray(n.pts);
                break;
            case l.Screen:
                this.npcToViewArray(n.pts), this.viewToScreenArray(n.pts)
        }
        return n
    }, x.prototype.setupFromFrustum = function (e) {
        var t = this.view.setupFromFrustum(e);
        return !!this.setupFromView() && (this.view.setRotation(this.rotMatrix), t)
    }, x.prototype.zoom = function (n, r, s) {
        var u = this.view,
            c = !1;
        if (!Cesium.defined(u)) return !1;
        if (this.view.isCameraOn) {
            var f = new i(.5, .5, .5),
                h = Cesium.defined(n) ? this.worldToNpc(n) : f.clone(),
                p = a.fromMatrixAndFixedPoint(o.fromScaleFactors(r, r, 1), f),
                m = i.fromDifferenceOf(h, f);
            m.z = 0;
            var d = a.fromTranslation(m),
                v = a.fromProduct(d, p),
                g = this.getFrustum(l.Npc, !1);
            return v.multiplyArray(g.pts), this.npcToWorldArray(g.pts), u.setupFromFrustum(g), u.centerEyePoint(), c = this.synchWithView(s), w.animateZoom && t.animateFrustumChange(this, g, this.getFrustum(), 100), c
        }
        var y = this.getFrustum(),
            x = u.extents.clone();
        if (x.x *= r, x.y *= r, !e.validateViewDelta(x)) return !1;
        var b = Cesium.defined(n) ? n.clone() : u.center;
        this.allow3dManipulations || (b.z = 0);
        var C = u.origin.clone(),
            M = C.clone(),
            T = u.rotation.clone();
        T.multiply(M), T.multiply(b), u.setExtents(x), M.x = b.x - x.x / 2, M.y = b.y - x.y / 2, T.multiplyTransposeInPlace(M), u.setOrigin(M);
        var N = M.distance(C);
        return this._zoomDelta = N, c = this.synchWithView(s), w.animateZoom && t.animateFrustumChange(this, y, this.getFrustum(), 100), c
    }, x.prototype.scroll = function (e, t) {
        e = Math.round(e), t = Math.round(t);
        var n = new i(e, t, 0);
        if (this.view.isCameraOn) return !1;
        var r = i.clone(i.ZERO);
        this.viewToWorld(r, r), this.viewToWorld(n, n);
        var o = i.fromDifferenceOf(n, r),
            a = this.view,
            s = a.origin.clone(),
            u = i.fromSumOf(s, o);
        return a.setOrigin(u), this.setupFromView()
    };
    var V = new i,
        z = new i;
    new i;
    x.prototype.pickDepthBuffer = function (e, t) {
        var n;
        if (this.scene.pickPositionSupported && (n = this.scene.pickPosition(e, V)), Cesium.defined(n)) {
            var r = this.worldToNpc(n, z),
                i = this.npcToView(r);
            return i.x = e.x, i.y = e.y, this.viewToWorld(i, n), n
        }
    }, x.prototype.pickEntity = function (e) {
        return this.scene.pick(e)
    }, x.prototype.getPropertyOfEntity = function (e, t, n) {
        var r = m(e, "getProperty") ? e.getProperty(t) : void 0;
        return !n && Cesium.defined(r) && 0 == r && (r = void 0), r
    }, x.prototype.pickedEntityToModel = function (e) {
        var t = Cesium.defined(e) ? this.geometry.findModelGeometryForTileset(e.primitive) : void 0;
        return Cesium.defined(t) ? t.model : void 0
    }, x.prototype.pickedEntityToModelId = function (e) {
        var t = this.pickedEntityToModel(e);
        return Cesium.defined(t) ? t.id : void 0
    }, x.prototype.pickedEntityToElement = function (e) {
        var t = Cesium.defined(e) ? this.getPropertyOfEntity(e, "element") : void 0;
        return Cesium.defined(t) ? new p(t, this.pickedEntityToModelId(e), this.getPropertyOfEntity(e, "category")) : void 0
    }, x.prototype.pickElement = function (e) {
        var t = this.pickEntity(e);
        return this.pickedEntityToElement(t)
    }, x.prototype.getPickDepth = function (e) {
        var t = this.scene,
            n = t._pickDepths[e];
        return Cesium.defined(n) || (n = new Cesium.PickDepth, t._pickDepths[e] = n), n
    };
    var F = new Cesium.Cartesian4,
        D = new Cesium.Cartesian4(1, 1 / 255, 1 / 65025, 1 / 160581375),
        R = {
            perspective: new Cesium.PerspectiveFrustum,
            perspectiveOC: new Cesium.PerspectiveOffCenterFrustum,
            ortho: new Cesium.OrthographicFrustum,
            orthoOC: new Cesium.OrthographicOffCenterFrustum
        };
    return x.prototype.pickRange = function (e, t) {
        var n = this.scene;
        if (n.useDepthPicking) {
            if (!Cesium.defined(e)) throw new Cesium.DeveloperError("origin is undefined.");
            if (!Cesium.defined(t)) throw new Cesium.DeveloperError("extents is undefined.");
            if (!Cesium.defined(n._globeDepth)) throw new DeveloperError("Picking from the depth buffer is not supported. Check pickPositionSupported.");
            t.x = Math.round(t.x), t.y = Math.round(t.y);
            var r = n._context,
                i = r.uniformState,
                o = this.windowToDrawingBufferFlipY(e);
            o.y -= t.y;
            var a, s = this.camera;
            a = Cesium.defined(s.frustum.fov) ? s.frustum.clone(R.perspective) : Cesium.defined(s.frustum.infiniteProjectionMatrix) ? s.frustum.clone(R.perspectiveOC) : Cesium.defined(s.frustum.width) ? s.frustum.clone(R.ortho) : s.frustum.clone(R.orthoOC);
            for (var u = 1, c = 0, l = n.numberOfFrustums, f = 0; f < l; ++f) {
                for (var h = this.getPickDepth(f), p = r.readPixels({
                        x: o.x,
                        y: o.y,
                        width: t.x,
                        height: t.y,
                        framebuffer: h.framebuffer
                    }), m = 0; m < t.x; m++)
                    for (var d = 0; d < t.y; d++) {
                        var v = Cesium.Cartesian4.unpack(p, 4 * (m * t.y + d), F);
                        Cesium.Cartesian4.divideByScalar(v, 255, v);
                        var g = Cesium.Cartesian4.dot(v, D);
                        g > 0 && g < 1 && (g < u && (u = g), g > c && (c = g))
                    }
                if (u <= c) {
                    var y = n._frustumCommandsList[f];
                    a.near = y.near * (0 !== f ? .99 : 1), a.far = y.far, i.updateFrustum(a);
                    var w = {
                        minDepth: u,
                        maxDepth: c
                    };
                    return w
                }
            }
        }
    }, x.prototype.windowToDrawingBuffer = function (e, t) {
        return Cesium.SceneTransforms.transformWindowToDrawingBuffer(this.scene, e, t)
    }, x.prototype.flipDrawingBufferY = function (e, t) {
        return Cesium.defined(t) || (t = new d), t.x = e.x, t.y = this.scene.drawingBufferHeight - e.y, t
    }, x.prototype.windowToDrawingBufferFlipY = function (e, t) {
        var n = this.windowToDrawingBuffer(e, t);
        return this.flipDrawingBufferY(n, n)
    }, x.prototype.drawingBufferToWorld = function (e, t, n) {
        return Cesium.SceneTransforms.drawingBufferToWgs84Coordinates(this.scene, e, t, n)
    }, x.prototype.worldToDrawingBuffer = function (e, t) {
        return Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(this.scene, e, t)
    }, x.prototype.worldToWindow = function (e, t) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.scene, e, t)
    }, x.prototype.windowToWorld = function (e, t, n) {
        var r = Cesium.defined(n) ? n : new i,
            o = this.windowToDrawingBufferFlipY(e);
        return this.drawingBufferToWorld(o, t, r)
    }, x.prototype.changeArea = function (t) {
        this.setupFromView();
        var n = [t[0].clone(), t[1].clone(), this.view.origin.clone()],
            r = [new i, new i, new i];
        this.rotMatrix.multiplyArray(n, r);
        var o = u.from2Points(r[0], r[1]),
            a = i.fromDifferenceOf(o.high, o.low);
        if (this.view.isCameraOn) {
            var s = [new i, new i];
            this.worldToNpc(n[0], s[0]), this.worldToNpc(n[1], s[1]);
            var c = u.fromArray(s),
                l = this.determineVisibleDepthNpc(c),
                f = Cesium.defined(l) ? l.minDepth : .5;
            f = Math.max(0, f), f = Math.min(1, f), s[0].z = s[1].z = f, this.npcToWorld(s[0], n[0]), this.npcToWorld(s[1], n[1]);
            var h = this.view.cameraInfo,
                p = h.lensAngle,
                m = Math.max(a.x, a.y) / (2 * Math.tan(p / 2)),
                d = i.fromInterpolate(n[0], .5, n[1]),
                v = i.fromSumOf(d, this.view.zVector, m);
            if (!this.view.lookAtUsingLensAngle(v, d, this.view.yVector, p)) return !1
        } else {
            if (a.z = this.view.extents.z, !e.validateViewDelta(a)) return !1;
            this.view.setExtents(a), o.low.z = r[2].z;
            var g = this.view.origin.clone();
            this.rotMatrix.multiplyTranspose(g, o.low), this.view.setOrigin(g)
        }
        return this.synchWithView(!0), !0
    }, x.prototype.onResized = function () {
        this.setupFromView(), this.resized.raiseEvent()
    }, x.prototype.pixelsFromInches = function (e) {
        return e * this.pixelsPerInch
    }, x.prototype.alignWithRootZ = function () {
        var e = this.rotMatrix.getRow(2),
            t = i.UNIT_Z;
        if (!e.equals(t)) {
            var n = o.fromTranspose(this.rotMatrix);
            n.setColumn(2, t), n.squareAndNormalizeColumns(n, 2, 0), this.rotMatrix.transposeOf(n)
        }
    }, x.prototype.turnCameraOn = function (e) {
        var t = this.view;
        if (!t.supportsCamera) return !1;
        if (t.isCameraOn) return t.lookAtUsingLensAngle(t.cameraInfo.eyePoint, t.cameraInfo.targetPoint, t.yVector, e);
        var n = void 0,
            r = 0,
            o = 1;
        Cesium.defined(n) && (r = this.npcToWorld(new i(.5, .5, n.minDepth)), o = this.npcToWorld(new i(.5, .5, n.maxDepth)));
        var a = r + (o - r) / 2,
            s = [new i(0, 0, a), new i(1, 1, a), new i(0, 0, o), new i(1, 1, o)];
        this.npcToWorldArray(s);
        var u = i.fromInterpolate(s[2], .5, s[3]),
            c = i.fromInterpolate(s[0], .5, s[1]),
            l = 2 * u.distance(c),
            h = 300 * f.oneMillimeter,
            p = t.lookAtUsingLensAngle(u, c, t.yVector, e, h, l);
        return this.setupFromView(), t.init(), C(this), this._changeFov = !0, this._cameraDirty = !0, p
    }, x.prototype.turnCameraOff = function () {
        var e = this.view;
        return e.supportsCamera && e.isCameraOn ? (e.turnCameraOff(), this.setupFromView(), e.init(), C(this), this._changeFov = !0, this._cameraDirty = !0, !0) : !e.isCameraOn
    }, x.prototype.synchWithCesiumCamera = function () {
        if (this.view.isCameraOn) {
            var e = this.view,
                t = this.scene.camera,
                n = t.position,
                r = i.fromSumOf(n, t.direction, e.cameraInfo.focusDistance);
            e.lookAt(n, r, t.up) && this.synchWithView(!0)
        }
    }, x.prototype.adjustHeight = function () {
        var e = this.geometry,
            t = this.terrainProvider,
            n = e.bim.groundPoint;
        if (Cesium.defined(t) && Cesium.defined(n)) {
            var r = Cesium.Cartographic.fromCartesian(n),
                i = [r],
                o = r.height,
                a = this;
            Cesium.sampleTerrain(t, 15, i).then(function () {
                N(a, o, i[0].height, n)
            })
        }
    }, x.prototype.pointIsBelowSurface = function (e) {
        return !!this.isGlobeVisible && Cesium.Cartographic.fromCartesian(e).height < w.minDistanceToSurface
    }, x.prototype.pushPtToSurface = function (e) {
        if (this.isGlobeVisible) {
            var t = Cesium.Cartographic.fromCartesian(e);
            t.height = w.minDistanceToSurface, i.fromRadians(t.longitude, t.latitude, t.height, this.scene.globe.ellipsoid, e)
        }
        return e
    }, x.prototype.moveViewToSurface = function (e, t) {
        var n = this.view;
        this.isGlobeVisible && n.isCameraView && (e = Cesium.defaultValue(e, n.targetPoint), t = Cesium.defaultValue(t, n.yVector), n.lookAt(this.pushPtToSurface(n.eyePoint), e, t), this.synchWithView(!1))
    }, x.prototype.moveViewToSurfaceIfRequired = function (e, t) {
        var n = this.view;
        this.pointIsBelowSurface(n.eyePoint) && this.moveViewToSurface()
    }, x
})