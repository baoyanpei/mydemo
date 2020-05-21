define("ModelGeometry", [], function () {
    function e(e, t) {
        this.model = e, t = Cesium.defaultValue(t, Cesium.defaultValue.EMPTY_OBJECT), this.cesiumTileset = new Cesium.Cesium3DTileset({
            url: e.tilesetUrl,
            maximumScreenSpaceError: t.maximumScreenSpaceError,
            maximumNumberOfLoadedTiles: t.maximumNumberOfLoadedTiles,
            debugShowBoundingVolume: t.debugShowBoundingVolume,
            debugFreezeFrame: t.debugFreezeFrame,
            refineToVisible: Cesium.defaultValue(t.refineToVisible, !0)
        }), this.allTilesLoaded = !0;
        var n = this;
        this.cesiumTileset.loadProgress.addEventListener(function (e, t) {
            n.allTilesLoaded = !1
        }), this.cesiumTileset.allTilesLoaded.addEventListener(function () {
            n.allTilesLoaded = !0
        })
    }
    return e.prototype.isDestroyed = function () {
        return !1
    }, e.prototype.destroy = function () {
        return this.cesiumTileset = this.cesiumTileset && this.cesiumTileset.destroy(), Cesium.destroyObject(this)
    }, e.prototype.update = function (e) {
        this.cesiumTileset.update(e)
    }, e.prototype.makeStyleDirty = function () {
        this.cesiumTileset.makeStyleDirty()
    }, e.prototype.adjustTranslation = function (e) {
        this.modelMatrix[12] = e.x, this.modelMatrix[13] = e.y, this.modelMatrix[14] = e.z
    }, Cesium.defineProperties(e.prototype, {
        asset: {
            get: function () {
                return this.cesiumTileset.asset
            }
        },
        properties: {
            get: function () {
                return this.cesiumTileset.properties
            }
        },
        ready: {
            get: function () {
                return this.cesiumTileset.ready
            }
        },
        readyPromise: {
            get: function () {
                return this.cesiumTileset.readyPromise
            }
        },
        url: {
            get: function () {
                return this.cesiumTileset.url
            }
        },
        baseUrl: {
            get: function () {
                return this.cesiumTileset.baseUrl
            }
        },
        boundingVolume: {
            get: function () {
                return this.cesiumTileset.boundingVolume
            }
        },
        boundingSphere: {
            get: function () {
                return this.cesiumTileset.boundingSphere
            }
        },
        styleEngine: {
            get: function () {
                return this.cesiumTileset.styleEngine
            }
        },
        modelMatrix: {
            get: function () {
                return this.cesiumTileset.modelMatrix
            }
        },
        rootTransform: {
            get: function () {
                return this.cesiumTileset._root.transform
            }
        },
        style: {
            get: function () {
                return this.cesiumTileset.style
            },
            set: function (e) {
                this.cesiumTileset.style = e
            }
        },
        maximumScreenSpaceError: {
            get: function () {
                return this.cesiumTileset.maximumScreenSpaceError
            },
            set: function (e) {
                this.cesiumTileset.maximumScreenSpaceError = e
            }
        },
        maximumNumberOfLoadedTiles: {
            get: function () {
                return this.cesiumTileset.maximumNumberOfLoadedTiles
            },
            set: function (e) {
                this.cesiumTileset.maximumNumberOfLoadedTiles = e
            }
        },
        debugShowBoundingVolume: {
            get: function () {
                return this.cesiumTileset.debugShowBoundingVolume
            },
            set: function (e) {
                this.cesiumTileset.debugShowBoundingVolume = e
            }
        },
        debugFreezeFrame: {
            get: function () {
                return this.cesiumTileset.debugFreezeFrame
            },
            set: function (e) {
                this.cesiumTileset.debugFreezeFrame = e
            }
        }
    }), e
})