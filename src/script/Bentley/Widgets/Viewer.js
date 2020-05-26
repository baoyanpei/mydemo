define("Viewer", ["../Bim/Element", "./PropertyVisibilityList", "./ViewList", "../Bim/StandardView", "../Math/Cartesian3", "../Math/Matrix4", "../Math/Matrix3", "./ToolbarButton", "./Toolbar", "../Tools/FitViewTool", "./ZoneWidget", "./PropertyGrid", "../Bim/Viewport", "./SettingsWidget", "../Util/functionDefined", "../Tools/ToolId", "./Action", "./ToolAction", "./ViewHistoryAction", "../Tools/StandardViewRotationTool", "./ModelVisibilityList", "./Spinner", "./BaseLayerPickerWidget", "./ModelMarker", "../Bim/ViewFactory", "./ViewLinkWidget"], function (e, t, n, r, i, o, a, s, u, c, l, f, h, p, m, d, v, g, y, w, x, b, C, M, T, N) {
    function E(e, t, n) {
        var r = this;
        this.fixupSandboxAttributes(), n = Cesium.defaultValue(n, {}), this._debugElementRanges = Cesium.defaultValue(n.debugElementRanges, !1), this._debugCameraTarget = Cesium.defaultValue(n.debugCameraTarget, !1), this._debugWindowArea = Cesium.defaultValue(n.debugWindowArea, !1), e = Cesium.getElement(e), this._container = e, this.element = document.createElement("div"), this.element.className = "cesium-viewer", e.appendChild(this.element);
        var o = document.createElement("div");
        o.className = "cesium-viewer-cesiumWidgetContainer", this.element.appendChild(o);
        var a = Cesium.defaultValue(n.cesiumWidgetOptions, {});
        this.cesiumWidget = new Cesium.CesiumWidget(o, a);
        var s;
        if (n.timeline !== !1) {
            var u = document.createElement("div");
            u.className = "cesium-viewer-timelineContainer", this.element.appendChild(u), this.timelineContainer = u;
            var c = this.cesiumWidget.clock;
            s = new Cesium.Timeline(u, c), s.addEventListener("settime", function (e) {
                r.onTimelineScrubFunction(e)
            }, !1), s.zoomTo(c.startTime, c.stopTime), this.timeline = s, n.timelineVisible !== !0 && window.setTimeout(function () {
                r.setTimelineVisible(!1)
            }, 100)
        }
        var l, f;
        if (n.fullscreenButton !== !1) {
            var p = document.createElement("div");
            p.className = "cesium-viewer-fullscreenContainer", this.element.appendChild(p), l = new Cesium.FullscreenButton(p, n.fullscreenElement), f = Cesium.subscribeAndEvaluate(l.viewModel, "isFullscreenEnabled", function (e) {
                Cesium.defined(s) && (s.container.style.right = p.clientWidth + "px", s.resize())
            }), this.fullscreenButton = l
        }
        var m = this.cesiumWidget.scene;
        t.addToScene(m), this.viewport = new h(m, t, this.getInitialViewFromUrl(t.bim));
        var d = !1,
            v = document.createElement("div");
        v.className = "cesium-viewer-toolbar", v.style.visibility = d || this.viewport.isGlobeVisible ? "visible" : "hidden", this.element.appendChild(v);
        var g = this.viewport;
        if (d || (g.isGlobeVisibleChanged.addEventListener(function (e) {
                v.style.visibility = g.isGlobeVisible && g.view.isCameraView ? "visible" : "hidden"
            }), g.viewActivated.addEventListener(function (e) {
                v.style.visibility = g.isGlobeVisible && g.view.isCameraView ? "visible" : "hidden"
            })), n.modelMarker && (this.modelMarker = new M(this.viewport)), n.geocoder !== !1) {
            var y = document.createElement("div");
            y.className = "cesium-viewer-geocoderContainer", v.appendChild(y);
            var w = new Cesium.Geocoder({
                container: y,
                scene: m
            });
            w.viewModel.complete.addEventListener(function () {
                g.synchWithCesiumCamera()
            })
        }
        if (n.baseLayerPicker !== !1) {
            var x = {
                globe: this.viewport.scene.globe,
                imageryProvider: n.selectedImageryProvider,
                terrainProvider: n.selectedTerrainProvider
            };
            this.baseLayerPicker = new C(v, x)
        }
        d && (this._projectionPicker = this.projectionPicker = new Cesium.ProjectionPicker(v, m)), this._lastWidth = 0, this._lastHeight = 0, m.preRender.addEventListener(function () {
            r.resize()
        });
        var b = t.boundingSphere,
            T = new i(b.center.x - b.radius, b.center.y - b.radius, b.center.z - b.radius),
            N = new i(b.center.x + b.radius, b.center.y + b.radius, b.center.z + b.radius);
        if (Cesium.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle.fromCartesianArray([T, N], Cesium.Ellipsoid.WGS84), Cesium.Camera.DEFAULT_VIEW_FACTOR = 0, m._screenSpaceCameraController = m._screenSpaceCameraController.destroy(), m._screenSpaceCameraController = this.viewport.toolAdmin._createCameraController(), n.tileLoadIndicator !== !1) {
            var E = Cesium.defaultValue(n.tileLoadIndicatorClass, "cesium-viewer-spinner");
            this.element.appendChild(this.createTileLoadIndicator(E))
        }
        this.viewport.toolAdmin.startDefaultTool()
    }

    function A(e, t) {
        var n = e.allow3dManipulations;
        t._is3dView = n;
        for (var r = n ? "bim-view-rotation-entry" : "bim-hidden", i = t.children, o = 1; o < i.length; o++) i[o].className = r;
        t.style.width = n ? "290px" : "auto"
    }
    return Cesium.defineProperties(E.prototype, {
        geometry: {
            get: function () {
                return this.viewport.geometry
            }
        },
        scene: {
            get: function () {
                return this.viewport.scene
            }
        },
        camera: {
            get: function () {
                return this.viewport.camera
            }
        },
        canvas: {
            get: function () {
                return this.viewport.canvas
            }
        },
        clientWidth: {
            get: function () {
                return this.viewport.clientWidth
            }
        },
        clientHeight: {
            get: function () {
                return this.viewport.clientHeight
            }
        },
        isCameraTargetLocked: {
            get: function () {
                return Cesium.defined(this._lockedCameraTarget)
            }
        },
        lockedCameraTarget: {
            get: function () {
                return this._lockedCameraTarget
            },
            set: function (e) {
                this._lockedCameraTarget = e, Cesium.defined(e) && this._setCameraTarget(e)
            }
        },
        terrainProvider: {
            get: function () {
                return this.viewport.terrainProvider
            },
            set: function (e) {
                this.viewport.terrainProvider = e
            }
        },
        shadows: {
            get: function () {
                return this.viewport.shadows
            },
            set: function (e) {
                this.viewport.shadows = e
            }
        }
    }), E.prototype.getInitialViewFromUrl = function (e) {
        var t = window.location.search.replace("?", "");
        if (t.length > 0) return T.cloneViewFromUrl(t, e)
    }, E.prototype.setTimelineVisible = function (e) {
        var t = this.timeline;
        Cesium.defined(t) && (t._topDiv.style.display = e ? "block" : "none", this.timelineContainer.style.pointerEvents = e ? "auto" : "none", this.adjustTileLoadIndicatorPosition(!e, "bottom", this.timeline.container.clientHeight))
    }, E.prototype.resize = function () {
        var e = this.element.clientWidth,
            t = this.element.clientHeight;
        if (e !== this._lastWidth || t !== this._lastHeight) {
            if (this.cesiumWidget.resize(), Cesium.defined(this.timeline) && "hidden" !== window.getComputedStyle(this.timeline.container).visibility) {
                var n = this.timeline.container.style;
                n.left = "0px";
                var r = Cesium.defined(this.fullscreenButton) ? this.fullscreenButton.container.clientWidth : 0;
                n.right = r + "px", this.timeline.resize()
            }
            this._lastWidth = e, this._lastHeight = t, this.viewport.onResized()
        }
    }, E.prototype.onTimelineScrubFunction = function (e) {
        var t = e.clock;
        t.currentTime = e.timeJulian, t.shouldAnimate = !1
    }, E.prototype.fixupSandboxAttributes = function () {
        for (var e = document.getElementsByClassName("cesium-infoBox-iframe"), t = 0; t < e.length; t++) e[t].removeAttribute("sandbox")
    }, E.prototype._setCameraTarget = function (e) {
        if (this.camera._setTransform(o.IDENTITY), Cesium.defined(e) && this.camera._setTransform(Cesium.Transforms.eastNorthUpToFixedFrame(e, Cesium.Ellipsoid.WGS84, new o)), this._debugCameraTarget) {
            if (Cesium.defined(this._debugCameraTargetGeom) && this.scene.primitives.remove(this._debugCameraTargetGeom), Cesium.defined(e)) {
                var t = Cesium.Material.fromType("Color");
                t.uniforms.color = new Cesium.Color(0, 0, 1, .15);
                var n = new Cesium.EllipsoidPrimitive({
                    center: e,
                    radii: new i(1, 1, 1),
                    material: t
                });
                this.scene.primitives.add(n)
            }
            this._debugCameraTargetGeom = n
        }
    }, E.prototype._getCameraEventInfo = function (e) {
        if (!Cesium.defined(e)) return {
            buttonDown: !1
        };
        Cesium.isArray(e) || (this._eventTypeArray[0] = e, e = this._eventTypeArray);
        for (var t = this.scene.screenSpaceCameraController._aggregator, n = 0; n < e.length; n++) {
            var r = e[n],
                i = Cesium.defined(r.eventType) ? r.eventType : r,
                o = r.modifier;
            if (t.isButtonDown(i, o)) return {
                buttonDown: !0,
                startPos: t.getStartMousePosition(i, o)
            }
        }
        return {
            buttonDown: !1
        }
    }, E.prototype.createTileLoadIndicator = function (e) {
        var t = new b(e);
        this._allTilesLoaded = this.geometry.allTilesLoaded;
        var n = this;
        return this.scene.postRender.addEventListener(function () {
            var e = n.geometry.allTilesLoaded;
            e != n._allTilesLoaded && (n._allTilesLoaded = e, t.toggle(e))
        }), this.tileLoadIndicator = t, t.element
    }, E.prototype.adjustTileLoadIndicatorPosition = function (e, t, n) {
        var r = this.tileLoadIndicator;
        Cesium.defined(r) && (e ? r.resetPosition() : r.updatePosition(t, n))
    }, E.prototype.createModelToggleWidget = function () {
        var e = this.geometry,
            t = e.bim,
            n = new x(this.viewport.geometry, t.models);
        return this.viewport.viewActivated.addEventListener(function (e, t) {
            t && n.updateHiddenStates(e.activeView.models)
        }), n.updateHiddenStates(this.viewport.activeView.models), n.element
    }, E.prototype.createCategoryToggleWidget = function () {
        var e = this.geometry,
            n = e.bim,
            r = new t(this.viewport.categoryStyler, n.categories);
        return this.viewport.viewActivated.addEventListener(function (e, t) {
            t && r.updateHiddenStates(e.activeView.categories)
        }), r.updateHiddenStates(this.viewport.activeView.categories), r.element
    }, E.prototype.createViewSelectionWidget = function () {
        var e = document.createElement("div");
        e.className = "bim-toggle-list";
        var t = this.geometry.bim;
        for (var r in t.views) new n(this, t.views[r], e);
        return e
    }, E.prototype.createViewRotationWidget = function () {
        var e = document.createElement("div");
        e.className = "bim-view-rotation-list";
        for (var t = [
                [r.Top, "bim-icon-viewtop", "上面"],
                [r.Bottom, "bim-icon-viewbottom", "下面"],
                [r.Front, "bim-icon-viewfront", "前面"],
                [r.Back, "bim-icon-viewback", "后面"],
                [r.Left, "bim-icon-viewleft", "左面"],
                [r.Right, "bim-icon-viewright", "右面"],
                [r.Iso, "bim-icon-viewisoleft", "正45°"],
                [r.RightIso, "bim-icon-viewisoright", "右45°"]
            ], n = 0; n < t.length; n++) {
            var i = this.createViewRotationEntry(t[n][0], t[n][1], t[n][2]);
            e.appendChild(i)
        }
        return this.viewport.viewActivated.addEventListener(function (t, n) {
            n && A(t, e)
        }), A(this.viewport, e), e
    }, E.prototype.createViewRotationEntry = function (e, t, n) {
        var r = document.createElement("div");
        r.className = "bim-view-rotation-entry";
        var i = document.createElement("div");
        i.className = "bim-view-rotation-button", r.appendChild(i);
        var o = document.createElement("i");
        o.className = t + " bim-view-rotation-image", i.appendChild(o);
        var a = document.createElement("div");
        a.className = "bim-view-rotation-label", a.textContent = n, r.appendChild(a);
        var s = this;
        return r.onclick = function () {
            var t = new w(s.viewport, e);
            t.installTool(), s.onCloseActiveTools.raiseEvent()
        }, r
    }, E.prototype.fitView = function (e) {
        var t = this.geometry.boundingSphere;
        return this.fitBoundingSphere(t, e)
    }, E.prototype.distanceToBoundingSphere = function (e) {
        var t = this.camera.frustum,
            n = Math.tan(.5 * t.fovy),
            r = t.aspectRatio * n;
        return Math.max(e / r, e / n)
    }, E.prototype.fitBoundingSphere = function (e, t, n) {
        if (Cesium.defined(e)) {
            var r = this.camera,
                s = !n && this.isCameraTargetLocked ? o.clone(r._transform, new o) : void 0;
            r._setTransform(o.IDENTITY);
            var u = this.distanceToBoundingSphere(e.radius),
                c = new i;
            if (u = Math.max(u, 2 * this.scene.screenSpaceCameraController.minimumZoomDistance), Cesium.defined(t)) {
                var l = new i(0, 0, -1),
                    f = new i(0, 1, 0);
                a.multiplyByVector(t, l, l), a.multiplyByVector(t, f, f);
                var h = this.geometry.rootTransform;
                o.multiplyByPointAsVector(h, l, r.direction), o.multiplyByPointAsVector(h, f, r.up), i.normalize(r.direction, r.direction), i.normalize(r.up, r.up)
            }
            i.multiplyByScalar(r.direction, -u, c), i.add(e.center, c, r.position), n ? this.lockedCameraTarget = e.center : this.isCameraTargetLocked && r._setTransform(s)
        }
    }, E.prototype.fitSelectionSet = function () {
        var e = this.viewport.selectionSet;
        if (e.isEmpty()) return void(this.lockedCameraTarget = void 0);
        var t = !0,
            n = "";
        for (var r in e.elements) t ? t = !1 : n += ",", n += r;
        var i = this;
        requestJson("/" + this.geometry.bim.name + "/range/" + n, function (e, t) {
            Cesium.defined(e) || i.fitRange(t.union, !0)
        })
    }, E.prototype.fitRange = function (e, t) {
        var n = i.fromObject(e.low),
            r = i.fromObject(e.high),
            a = this.geometry.bim.bimToTile;
        Cesium.defined(a) && (o.multiplyByPoint(a, n, n), o.multiplyByPoint(a, r, r));
        var s = this.geometry.modelMatrix,
            u = this.geometry.rootTransform;
        o.multiplyByPoint(u, n, n), o.multiplyByPoint(u, r, r), o.multiplyByPoint(s, n, n), o.multiplyByPoint(s, r, r);
        var c = Cesium.BoundingSphere.fromCornerPoints(n, r);
        if (this.fitBoundingSphere(c, void 0, t), this._debugElementRanges) {
            Cesium.defined(this._debugElementRange) && this.scene.primitives.remove(this._debugElementRange);
            var l = Cesium.Material.fromType("Color");
            l.uniforms.color = new Cesium.Color(1, 0, 0, .1);
            var f = new Cesium.EllipsoidPrimitive({
                center: c.center,
                radii: new i(c.radius, c.radius, c.radius),
                material: l
            });
            this._debugElementRange = f, this.scene.primitives.add(f)
        }
    }, E.prototype.windowToDrawingBuffer = function (e, t) {
        return Cesium.SceneTransforms.transformWindowToDrawingBuffer(this.scene, e, t)
    }, E.prototype.flipDrawingBufferY = function (e, t) {
        return Cesium.defined(t) || (t = new Cesium.Cartesian2), t.x = e.x, t.y = this.scene.drawingBufferHeight - e.y, t
    }, E.prototype.windowToDrawingBufferFlipY = function (e, t) {
        var n = this.windowToDrawingBuffer(e, t);
        return this.flipDrawingBufferY(n, n)
    }, E.prototype.drawingBufferToWorld = function (e, t, n) {
        return Cesium.SceneTransforms.drawingBufferToWgs84Coordinates(this.scene, e, t, n)
    }, E.prototype.worldToDrawingBuffer = function (e, t) {
        return Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(this.scene, e, t)
    }, E.prototype.worldToWindow = function (e, t) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.scene, e, t)
    }, E.prototype.windowToWorld = function (e, t, n) {
        var r = Cesium.defined(n) ? n : new i,
            o = this.windowToDrawingBufferFlipY(e);
        return this.drawingBufferToWorld(o, t, r)
    }, E.prototype.drawingBufferToNDC = function (e, t, n) {
        var r = (this.scene.context.uniformState, this.scene._passState.viewport),
            o = Cesium.defined(n) ? n : new i;
        return o.x = (e.x - r.x) / r.width * 2 - 1, o.y = (e.y - r.y) / r.height * 2 - 1, o.z = 2 * t - 1, o
    }, E.prototype.worldToNDC = function (e, t) {
        var n = new Cesium.Cartesian4(e.x, e.y, e.z, 1),
            r = new Cesium.Cartesian4,
            a = this.scene.context.uniformState.viewProjection;
        o.multiplyByVector(a, n, r);
        var s = 1 / r.w,
            u = Cesium.defined(t) ? t : new i;
        return i.multiplyByScalar(r, s, u), u
    }, E.prototype.ndcToWorld = function (e, t) {
        var n = new Cesium.Cartesian4(e.x, e.y, e.z, 1),
            r = new Cesium.Cartesian4,
            a = this.scene.context.uniformState.inverseViewProjection;
        o.multiplyByVector(a, n, r);
        var s = 1 / r.w,
            u = Cesium.defined(t) ? t : new i;
        return i.multiplyByScalar(r, s, u), u
    }, E.prototype.viewToNDC = function (e, t) {
        var n = this.viewToWorld(e, t);
        return this.worldToNDC(n, t)
    }, E.prototype.ndcToView = function (e, t) {
        var n = this.ndcToWorld(e, t);
        return this.worldToView(n, t)
    }, E.prototype.worldToView = function (e, t) {
        var n = Cesium.defined(t) ? t : new i,
            r = this.scene.context.uniformState.view3D;
        return o.multiplyByPoint(r, e, n)
    }, E.prototype.viewToWorld = function (e, t) {
        var n = Cesium.defined(t) ? t : new i,
            r = this.scene.context.uniformState.inverseView3D;
        return o.multiplyByPoint(r, e, n)
    }, E.prototype.createSettingsWidget = function () {
        return new p(this)._element
    }, E.prototype.createViewLinkWidget = function () {
        var e = new N(this),
            t = this;
        return this.onToolbarContentActivated.addEventListener(function (n) {
            n.match("link") && e.viewModel.activate(t.viewport.getActiveViewId(), t.viewport.view)
        }), e._element
    }, E.prototype.createElementPropertiesWidget = function (t) {
        var n = new f("Select an element to view its properties"),
            r = new l(t, "Properties", "bim-icon-properties", n.element, n.contentChanged);
        this.viewport.selectionSet.changed.addEventListener(function (t) {
            if (!r.viewModel.isMinimized) {
                var i = t.getSingleSelectedElement();
                return e.isValidElement(i) ? void requestJson("/" + t.bim.name + "/elements/" + i.elementId, function (e, t) {
                    var r = Cesium.defined(e) ? "Error retrieving properties." : t;
                    n.update(r)
                }) : void n.update(void 0)
            }
        });
        var i = this.viewport.selectionSet;
        r.viewModel.minimizedChanged.addEventListener(function (t) {
            if (!t.isMinimized) {
                var r = i.getSingleSelectedElement();
                if (n.update(e.isValidElement(r) ? "Retrieving properties..." : void 0), !e.isValidElement(r)) return;
                requestJson("/" + i.bim.name + "/elements/" + r.elementId, function (e, t) {
                    var r = Cesium.defined(e) ? "Error retrieving properties." : t;
                    n.update(r)
                })
            }
        })
    }, E.prototype.createToolbar = function () {
        var e = new u(this);
        this.onCloseActiveTools = new Cesium.Event, this.onCloseActiveTools.addEventListener(e.closeActiveContent, e), this.onToolbarContentActivated = new Cesium.Event;
        var t = this;
        return e.activeContentChanged.addEventListener(function (e, n) {
            Cesium.defined(n) && t.onToolbarContentActivated.raiseEvent(n.content.id)
        }), e
    }, E.prototype.createIsolateAction = function () {
        var e = this.viewport;
        return new v("Isolate Selection", "bim-icon-isolate", function () {
            return e.selectionSetStyler.setIsolate(!0), this.tooltipText = "Clear Isolate", !0
        }, function () {
            e.selectionSetStyler.setIsolate(!1), this.tooltipText = "Isolate Selection"
        })
    }, E
})