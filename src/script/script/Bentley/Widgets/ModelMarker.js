define("ModelMarker", ["../Math/Cartesian3", "../Math/Matrix4", "../Bim/StandardView"], function (e, t, n) {
    function r(e, t) {
        var n = o(Cesium.defaultValue(t, {})),
            r = i(e.geometry, n);
        this.marker = a(e.scene, r, n), this.ellipsoid = e.scene.globe.ellipsoid, this.isModelMarkerVisibleChanged = new Cesium.Event;
        var s = this;
        this._eventHandler = new Cesium.ScreenSpaceEventHandler(e.scene.canvas), this._eventHandler.setInputAction(function (t) {
            s.pickBillboard(t, e)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK), e.scene.terrainProviderChanged.addEventListener(function (e) {
            s.placeMarkerOnSurface(e)
        })
    }

    function i(t, n) {
        var r = e.clone(t.range.high);
        return r.add(new e(n.offset, n.offset, n.offset)), r
    }

    function o(e) {
        var t = {
            image: Cesium.defaultValue(e.imageUrl, Cesium.buildModuleUrl("../Bentley/Assets/Icons/map-marker-icon.png")),
            height: Cesium.defaultValue(e.height, 50),
            width: Cesium.defaultValue(e.width, 50),
            offset: Cesium.defaultValue(e.offset, 10),
            isVisible: Cesium.defaultValue(e.isVisible, !0)
        };
        return t
    }

    function a(e, t, n) {
        var r = e.primitives.add(new Cesium.BillboardCollection),
            i = {
                position: t,
                image: n.image,
                height: n.height,
                width: n.width,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                imageIndex: 0,
                show: n.isVisible
            };
        return r.add(i)
    }

    function s(t, n) {
        var r = new e;
        e.fromRadians(n.longitude, n.latitude, n.height, t.ellipsoid, r), t.marker.position = r
    }
    return Cesium.defineProperties(r.prototype, {
        isModelMarkerVisible: {
            get: function () {
                return this.marker.show
            },
            set: function (e) {
                this.marker.show !== e && (this.marker.show = e, this.isModelMarkerVisibleChanged.raiseEvent(e))
            }
        }
    }), r.prototype.pickBillboard = function (e, t) {
        var n = t.scene.pick(e.position);
        Cesium.defined(n) && n.primitive instanceof Cesium.Billboard && t.fitView(!0)
    }, r.prototype.placeMarkerOnSurface = function (e) {
        if (Cesium.defined(e)) {
            var t = Cesium.Cartographic.fromCartesian(this.marker.position),
                n = [t],
                r = this;
            Cesium.sampleTerrain(e, 15, n).then(function () {
                s(r, n[0])
            })
        }
    }, r.prototype.destroy = function () {
        return Cesium.destroyObject(this)
    }, r.prototype.isDestroyed = function () {
        return !1
    }, r
})