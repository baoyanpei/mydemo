define("SettingsWidget", ["../Tools/ViewToolSettings"], function (e) {
    function t(t, n) {
        t.scene;
        this.shadows = t.shadows, this.camera = t.viewport.isCameraOn, this.boundingVolumes = !1, this.globe = t.viewport.isGlobeVisible, this.renderingQualityVisible = !0, this.renderingQualitySwitchText = "+", this.renderingQualityTitle = "Click to expand", this.advancedVisible = !1, this.advancedSwitchText = "+", this.advancedTitle = "Click to expand", this.generalVisible = !0, this.generalSwitchText = "-", this.generalTitle = "Click to collapse", this.freezeFrame = !1, this.viewer = t, this.performance = !1, this._performanceContainer = n, this._lastFpsSampleTime = void 0, this._frameCount = 0, this._time = void 0, this._fps = 0, this._frameTime = 0, this.inspectorVisible = !1, this.animationVisible = !0, this.animationTitle = "Click to expand", this.animationSwitchText = "+", this.animationTime = e.animationTime / 1e3, Cesium.knockout.track(this, ["shadows", "camera", "boundingVolumes", "advancedVisible", "advancedSwitchText", "inspectorVisible", "renderingQualityVisible", "renderingQualitySwitchText", "renderingQualityTitle", "generalVisible", "generalSwitchText", "freezeFrame", "globe", "mapTiles", "generalTitle", "advancedTitle", "maximumSSE", "modelMarkerVisible", "animationVisible", "animationTime", "animationTitle", "animationSwitchText"]);
        var r = this;
        this._toggleAnimation = Cesium.createCommand(function () {
            r.animationVisible = !r.animationVisible, r.animationSwitchText = r.animationVisible ? "-" : "+", r.animationTitle = r.animationTitle ? "Click to collapse" : "Click to expand"
        }), this._updateMaxSSE = Cesium.knockout.getObservable(this, "animationTime").subscribe(function (t) {
            e.animationTime = parseFloat(1e3 * t)
        }), this._showBoundingVolumes = Cesium.createCommand(function () {
            return r.viewer.geometry.debugShowBoundingVolume = r.boundingVolumes, !0
        }), this._showShadows = Cesium.createCommand(function () {
            return r.viewer.shadows = r.shadows, r.viewer.setTimelineVisible(r.shadows), !0
        }), this._toggleCamera = Cesium.createCommand(function () {
            return r.camera ? r.turnCameraOn() : r.viewer.viewport.turnCameraOff()
        }), this._toggleAdvanced = Cesium.createCommand(function () {
            r.advancedVisible = !r.advancedVisible, r.advancedSwitchText = r.advancedVisible ? "-" : "+", r.advancedTitle = r.advancedVisible ? "Click to collapse" : "Click to expand"
        }), this._toggleRenderingQuality = Cesium.createCommand(function () {
            r.renderingQualityVisible = !r.renderingQualityVisible, r.renderingQualitySwitchText = r.renderingQualityVisible ? "-" : "+", r.renderingQualityTitle = r.renderingQualityVisible ? "Click to collapse" : "Click to expand"
        }), this._toggleGeneral = Cesium.createCommand(function () {
            r.generalVisible = !r.generalVisible, r.generalSwitchText = r.generalVisible ? "-" : "+", r.generalTitle = r.generalVisible ? "Click to collapse" : "Click to expand"
        }), this._freezeFrame = Cesium.createCommand(function () {
            return r.viewer.geometry.debugFreezeFrame = r.freezeFrame, !0
        }), this._toggleInspector = Cesium.createCommand(function () {
            return r.inspectorVisible ? r._enableInspector() : r._disableInspector(), !0
        }), this._showPerformance = Cesium.createCommand(function () {
            return r.performance ? r._createPerformanceDisplay() : (r._performanceContainer.innerHTML = "", r._unregisterPerformanceUpdate(), r._unregisterPerformanceUpdate = void 0), !0
        }), t.viewport.bim.displayInPlace && (this._showGlobe = Cesium.createCommand(function () {
            if (r.viewer.viewport.isGlobeVisible = r.globe, Cesium.defined(r.modelMarkerVisible)) {
                var e = r.modelMarkerVisible;
                r.modelMarkerVisible = !!r.globe && r.prevModelMarkerVisiblity, r.prevModelMarkerVisiblity = e, r._showModelMarker()
            }
            return !0
        }), t.viewport.bim.modelMarker && (this.modelMarkerVisible = this.prevModelMarkerVisiblity = t.modelMarker.isModelMarkerVisible, this._showModelMarker = Cesium.createCommand(function () {
            return r.viewer.modelMarker.isModelMarkerVisible = r.modelMarkerVisible, !0
        }))), this._updateMaxSSE = Cesium.knockout.getObservable(this, "maximumSSE").subscribe(function (e) {
            r.viewer.geometry.maximumScreenSpaceError = parseInt(e)
        })
    }

    function n(e, t, n, r, i, o) {
        var a = document.createElement("span");
        a.innerText = n, a.style.fontSize = "10px", a.style.float = "left";
        var s = document.createElement("span");
        s.innerText = i, s.style.fontSize = "10px", s.style.float = "right";
        var u = document.createElement("div");
        u.appendChild(a), u.appendChild(s), u.style.width = "130px", u.className = "clearfix";
        var c = document.createElement("input");
        c.type = "range", c.min = t, c.max = r, c.step = o, c.style.margin = "0", c.setAttribute("data-bind", 'valueUpdate: "input", value: ' + e);
        var l = document.createElement("div");
        return l.className = "cesium-cesiumInspector-slider", l.style.marginTop = "3px", l.appendChild(u), l.appendChild(c), l
    }

    function r(e) {
        var r = document.createElement("div"),
            i = new t(e, r);
        this.viewModel = i;
        var o = document.createElement("div");
        o.className = "bim-settings", this._element = o;
        var a = document.createElement("div");
        a.className = "bim-groupbox", a.setAttribute("data-bind", 'css: {"bim-settings-show" : generalVisible, "bim-settings-hide" : !generalVisible}'), o.appendChild(a);
        var s = document.createElement("div");
        s.className = "bim-groupbox-header", s.setAttribute("data-bind", "click: toggleGeneral, attr: {title: generalTitle}");
        var u = document.createElement("span");
        u.className = "bim-expand-collapse-icon", s.appendChild(u), s.appendChild(document.createTextNode("View")), a.appendChild(s);
        var c = document.createElement("div");
        c.className = "bim-groupbox-content",
            a.appendChild(c);
        var l = document.createElement("div");
        c.appendChild(l);
        var f = document.createElement("input");
        if (f.type = "checkbox", f.setAttribute("data-bind", "checked: shadows, click: showShadows"), l.appendChild(f), l.appendChild(document.createTextNode("Shadows")), e.viewport.bim.displayInPlace) {
            var h = document.createElement("div");
            c.appendChild(h);
            var p = document.createElement("input");
            if (p.type = "checkbox", p.setAttribute("data-bind", "checked: globe, click: showGlobe"), h.appendChild(p), h.appendChild(document.createTextNode("Globe")), e.viewport.isGlobeDefined || (h.className = "bim-hidden"), e.viewport.isGlobeVisibleChanged.addEventListener(function (e) {
                    i.globe = e.isGlobeVisible;
                    var t = e.isGlobeDefined ? void 0 : "bim-hidden";
                    h.className = t
                }), e.viewport.bim.modelMarker) {
                var m = document.createElement("div");
                m.setAttribute("data-bind", 'css: {"bim-show" : globe, "bim-hide" : !globe}'), c.appendChild(m);
                var d = document.createElement("input");
                d.type = "checkbox", d.setAttribute("data-bind", "checked: modelMarkerVisible, click: showModelMarker"), m.appendChild(d), m.appendChild(document.createTextNode("Model Marker"))
            }
        }
        var v = document.createElement("div");
        c.appendChild(v);
        var g = document.createElement("input");
        g.type = "checkbox", g.setAttribute("data-bind", "checked: camera, click: toggleCamera"), v.appendChild(g), v.appendChild(document.createTextNode("Camera")), e.viewport.viewActivated.addEventListener(function (e) {
            i.camera = e.isCameraOn, v.className = e.view.supportsCamera ? void 0 : "bim-hidden"
        });
        var y = document.createElement("div");
        y.className = "bim-groupbox", y.setAttribute("data-bind", 'css: {"bim-settings-show" : renderingQualityVisible, "bim-settings-hide" : !renderingQualityVisible}'), o.appendChild(y);
        var w = document.createElement("div");
        w.className = "bim-groupbox-header", w.setAttribute("data-bind", "click: toggleRenderingQuality, attr: {title: renderingQualityTitle}");
        var x = document.createElement("span");
        x.className = "bim-expand-collapse-icon", w.appendChild(x), w.appendChild(document.createTextNode("Rendering Quality")), y.appendChild(w);
        var b = document.createElement("div");
        b.className = "bim-groupbox-content", y.appendChild(b), b.appendChild(n("maximumSSE", i.maximumSSE, "Quality", 64 * i.maximumSSE, "Performance", 1));
        var C = document.createElement("div");
        C.className = "bim-groupbox", C.setAttribute("data-bind", 'css: {"bim-settings-show" : animationVisible, "bim-settings-hide" : !animationVisible}'), o.appendChild(C);
        var M = document.createElement("div");
        M.className = "bim-groupbox-header", M.setAttribute("data-bind", "click: toggleAnimation, attr: {title: animationTitle}");
        var T = document.createElement("span");
        T.className = "bim-expand-collapse-icon", M.appendChild(T), M.appendChild(document.createTextNode("Animation Duration")), C.appendChild(M);
        var N = document.createElement("div");
        N.className = "bim-groupbox-content", C.appendChild(N), N.appendChild(n("animationTime", 0, "Shorter", 5, "Longer", .05));
        var E = document.createElement("div");
        E.className = "bim-groupbox", E.setAttribute("data-bind", 'css: {"bim-settings-show" : advancedVisible, "bim-settings-hide" : !advancedVisible}'), o.appendChild(E);
        var A = document.createElement("div");
        A.className = "bim-groupbox-header", A.setAttribute("data-bind", "click: toggleAdvanced, attr: {title: advancedTitle}");
        var S = document.createElement("span");
        S.className = "bim-expand-collapse-icon", A.appendChild(S), A.appendChild(document.createTextNode("Advanced")), E.appendChild(A);
        var P = document.createElement("div");
        P.className = "bim-groupbox-content", E.appendChild(P);
        var O = document.createElement("div");
        P.appendChild(O);
        var _ = document.createElement("input");
        _.type = "checkbox", _.setAttribute("data-bind", "checked: boundingVolumes, click: showBoundingVolumes"), O.appendChild(_), O.appendChild(document.createTextNode("Bounding volumes"));
        var I = document.createElement("div");
        P.appendChild(I);
        var B = document.createElement("input");
        B.type = "checkbox", B.setAttribute("data-bind", "checked: freezeFrame, click: debugFreezeFrame"), I.appendChild(B), I.appendChild(document.createTextNode("Freeze LOD"));
        var k = document.createElement("div");
        P.appendChild(k);
        var V = document.createElement("input");
        V.type = "checkbox", V.setAttribute("data-bind", "checked: inspectorVisible, click: toggleInspector"), k.appendChild(V), k.appendChild(document.createTextNode("Inspect"));
        var z = document.createElement("div");
        P.appendChild(z);
        var F = document.createElement("input");
        F.type = "checkbox", F.setAttribute("data-bind", "checked: performance, click: showPerformance"), z.appendChild(F), z.appendChild(document.createTextNode("Track FPS")), P.appendChild(r), Cesium.knockout.applyBindings(i, this._element)
    }
    return t.prototype.turnCameraOn = function () {
        var t = e.walkCameraAngle * (Math.PI / 180),
            n = this.viewer.viewport,
            r = n.geometry.bim.views[n.activeView.viewId];
        return Cesium.defined(r) && r.isCameraOn && (t = r.lensAngle), n.turnCameraOn(e.walkCameraAngle * (Math.PI / 180))
    }, Cesium.defineProperties(t.prototype, {
        updateAnimationTime: {
            get: function () {
                return this._updateAnimationTime
            }
        },
        showBoundingVolumes: {
            get: function () {
                return this._showBoundingVolumes
            }
        },
        showShadows: {
            get: function () {
                return this._showShadows
            }
        },
        toggleCamera: {
            get: function () {
                return this._toggleCamera
            }
        },
        showGlobe: {
            get: function () {
                return this._showGlobe
            }
        },
        showMapTiles: {
            get: function () {
                return this._showMapTiles
            }
        },
        showModelMarker: {
            get: function () {
                return this._showModelMarker
            }
        },
        toggleAdvanced: {
            get: function () {
                return this._toggleAdvanced
            }
        },
        toggleAnimation: {
            get: function () {
                return this._toggleAnimation
            }
        },
        toggleRenderingQuality: {
            get: function () {
                return this._toggleRenderingQuality
            }
        },
        toggleGeneral: {
            get: function () {
                return this._toggleGeneral
            }
        },
        debugFreezeFrame: {
            get: function () {
                return this._freezeFrame
            }
        },
        showPerformance: {
            get: function () {
                return this._showPerformance
            }
        },
        toggleInspector: {
            get: function () {
                return this._toggleInspector
            }
        },
        maximumSSE: {
            get: function () {
                return this.viewer.geometry.maximumScreenSpaceError
            }
        },
        update: {
            get: function () {
                var e = this;
                return function () {
                    e.performance && e.updatePerformanceDisplay()
                }
            }
        }
    }), t.prototype._createPerformanceDisplay = function () {
        var e = document.createElement("div");
        e.className = "bim-settings-performance";
        var t = document.createElement("div");
        t.className = "bim-settings-performance-fps", this._fpsText = document.createTextNode("Calculating..."), t.appendChild(this._fpsText), e.appendChild(t), this._performanceContainer.appendChild(e), this._lastFpsSampleTime = void 0, this._frameCount = 0, this._time = void 0, this._fps = 0, this._frameTime = 0;
        var n = this;
        this._unregisterPerformanceUpdate = this.viewer.scene.postRender.addEventListener(function () {
            n.update()
        })
    }, t.prototype.updatePerformanceDisplay = function () {
        if (!Cesium.defined(this._time)) return this._lastFpsSampleTime = Cesium.getTimestamp(), this._time = Cesium.getTimestamp(), void(this._fpsText.nodeValue = "Calculating...");
        var e = this._time,
            t = Cesium.getTimestamp();
        this._time = t;
        var n = t - e;
        this._frameCount++;
        var r = this._fps,
            i = t - this._lastFpsSampleTime;
        i > 1e3 && (r = 1e3 * this._frameCount / i | 0, this._lastFpsSampleTime = t, this._frameCount = 0), r !== this._fps && (this._fpsText.nodeValue = r + " FPS", this._fps = r), n !== this._frameTime && (this._frameTime = n)
    }, t.prototype._disableInspector = function () {
        Cesium.defined(this._removeInspector) && (this._removeInspector(), this._inspector = this._inspector.destroy(), this._removeInspector = void 0)
    }, t.prototype._enableInspector = function () {
        this._disableInspector();
        var e = document.createElement("div");
        e.className = "cesium-viewer-cesium3DTilesInspectorContainer", this.viewer._container.appendChild(e);
        var t = new Cesium.Cesium3DTilesInspector(e, this.viewer.scene);
        this._removeInspector = this.viewer.scene.postRender.addEventListener(function () {
            t.viewModel.update()
        }), this._inspector = t
    }, r.prototype.isDestroyed = function () {
        return !1
    }, r.prototype.destroy = function () {
        return Cesium.knockout.cleanNode(this._element), this.viewModel.destroy(), Cesium.destroyObject(this)
    }, r
})