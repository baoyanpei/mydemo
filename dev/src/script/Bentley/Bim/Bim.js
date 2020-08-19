define("Bim", ["../Util/requestJson", "../Math/Cartesian3", "../Math/Matrix4", "./ViewFactory", "../Math/Range3", "./ModelFactory"], function (e, t, n, r, i, o) {
    function a(t) {
        if (this.readyPromise = Cesium.when.defer(), "string" == typeof t) {
            var n = this;
            e(t, function (e, t) {
                n._load(t)
            })
        } else this._load(t)
    }
    return a.prototype._load = function (e) {
        this.categories = e.categories, this.modelSelectors = e.modelSelectors, this.categorySelectors = e.categorySelectors, this.displayStyles = e.displayStyles, this.name = e.name, this.projectExtents = new i(t.fromObject(e.projectExtents.low), t.fromObject(e.projectExtents.high)), this.projectTransform = n.fromArray(e.projectTransform), this.models = {};
        var a, s, u = e.models;
        for (a in u) s = u[a], this.models[a] = o.createModel(this, a, s);
        this.views = {};
        var c, l, f = e.views;
        for (c in f) {
            l = f[c];
            var h = r.createView(l, this);
            h.viewId = c, this.views[c] = h
        }
        this.defaultView = this.views[e.defaultView];
        var p = e.bimOrigin;
        Cesium.defined(p) && (this.bimToTile = n.fromTranslation(t.fromObject(p))), this.geolocated = Cesium.defaultValue(e.geolocated, !0);
        var m = e.groundPoint;
        Cesium.defined(m) && (this.groundPoint = t.fromObject(m)), this.baseLayerPicker = Cesium.defaultValue(e.timeline, !0), this.modelMarker = Cesium.defaultValue(e.modelMarker, !1);
        var d = e.viewerOptions;
        Cesium.defined(d) && (0 == (this.displayInPlace = Cesium.defaultValue(d.displayInPlace, !1)) ? (this.groundPoint = void 0, this.baseLayerPicker = !1, this.geolocated = !1, this.modelMarker = !1) : (this.selectedImageryProvider = d.imageryProvider, this.selectedTerrainProvider = d.terrainProvider)), this.geocoder = this.geolocated, this.timeline = Cesium.defaultValue(e.timeline, !0), this.timelineVisible = Cesium.defaultValue(e.timelineVisible, !1), this.tileLoadIndicator = Cesium.defaultValue(e.timelineVisible, !0), Cesium.defined(e.tileLoadIndicatorClass) && (this.tileLoadIndicatorClass = e.tileLoadIndicatorClass), this.fullscreenButton = Cesium.defaultValue(e.fullscreenButton, !0), Cesium.defined(e.fullscreenElement) && (this.fullscreenElement = e.fullscreenElement), this.infoBox = Cesium.defaultValue(e.infoBox, !1), this.sceneModePicker = Cesium.defaultValue(e.sceneModePicker, !1), this.navigationInstructionsInitiallyVisible = Cesium.defaultValue(e.navigationInstructionsInitiallyVisible, !1), this.navigationHelpButton = Cesium.defaultValue(e.selectionIndicator, !1), this.selectionIndicator = Cesium.defaultValue(e.selectionIndicator, !1), this.animation = Cesium.defined(e.animation, !1), this.homeButton = Cesium.defined(e.homeButton, !1), this.readyPromise.resolve(this)
    }, a.prototype.createBentleyViewerOptions = function () {
        var e = {
            selectedImageryProvider: this.selectedImageryProvider,
            selectedTerrainProvider: this.selectedTerrainProvider,
            baseLayerPicker: this.baseLayerPicker,
            timeline: this.timeline,
            timelineVisible: this.timelineVisible,
            fullscreenButton: this.fullscreenButton,
            fullscreenElement: this.fullscreenElement,
            tileLoadIndicator: this.tileLoadIndicator,
            tileLoadIndicatorClass: this.tileLoadIndicatorClass,
            geocoder: this.geocoder,
            infoBox: this.infoBox,
            sceneModePicker: this.sceneModePicker,
            navigationInstructionsInitiallyVisible: this.navigationInstructionsInitiallyVisible,
            navigationHelpButton: this.navigationHelpButton,
            selectionIndicator: this.selectionIndicator,
            homeButton: this.homeButton,
            modelMarker: this.modelMarker,
            cesiumWidgetOptions: this.createCesiumWidgetOptions()
        };
        return e
    }, a.prototype.createCesiumWidgetOptions = function () {
        var e = Cesium.JulianDate.now();
        e.secondsOfDay = 0, Cesium.JulianDate.addHours(e, -12, e);
        var t = e.clone();
        Cesium.JulianDate.addHours(t, 24, t);
        var n = e.clone();
        Cesium.JulianDate.addHours(n, 15, n);
        var r = {
            shadows: !1,
            targetFrameRate: 60,
            contextOptions: {
                webgl: {
                    alpha: !0
                }
            },
            clock: new Cesium.Clock({
                startTime: e,
                currentTime: n,
                stopTime: t,
                clockRange: Cesium.ClockRange.LOOP_STOP,
                clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
                shouldAnimate: !1,
                canAnimate: !1
            }),
            imageryProvider: !1
        };
        return this.displayInPlace || (r.scene3DOnly = !0, r.globe = !1, r.skyBox = !1, r.skyAtmosphere = !1), r
    }, a.prototype.createCesiumViewerOptions = function () {
        var e = Cesium.JulianDate.now();
        e.secondsOfDay = 0, Cesium.JulianDate.addHours(e, -12, e);
        var t = e.clone();
        Cesium.JulianDate.addHours(t, 24, t);
        var n = e.clone();
        Cesium.JulianDate.addHours(n, 15, n);
        var r = {
            infoBox: !1,
            shadows: !1,
            sceneModePicker: !1,
            navigationInstructionsInitiallyVisible: !1,
            targetFrameRate: 60,
            geocoder: !1,
            selectionIndicator: !1,
            timeline: !0,
            navigationHelpButton: !1,
            animation: !1,
            homeButton: !1,
            contextOptions: {
                webgl: {
                    alpha: !0
                }
            },
            clock: new Cesium.Clock({
                startTime: e,
                currentTime: n,
                stopTime: t,
                clockRange: Cesium.ClockRange.LOOP_STOP,
                clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
                shouldAnimate: !1,
                canAnimate: !1
            }),
            baseLayerPicker: !0,
            imageryProvider: !1,
            selectedImageryProvider: this.selectedImageryProvider,
            selectedTerrainProvider: this.selectedTerrainProvider
        };
        return this.displayInPlace || (r.scene3DOnly = !0, r.globe = !1, r.skyBox = !1, r.skyAtmosphere = !1), {
            cesiumViewerOptions: r
        }
    }, a
})