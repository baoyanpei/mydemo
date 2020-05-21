define("BimGeometry", ["../Bim/Bim", "./ModelGeometry", "../Math/Matrix4", "../Math/Range3"], function (e, t, n, r) {
    function i(e, t) {
        for (var n in e._sceneModels)
            if (t(e._sceneModels[n])) break
    }

    function o(e, t) {
        for (var n in e._primitives)
            if (t(e._primitives[n])) break
    }

    function a(e, t) {
        var n = 0;
        return i(e, function () {
            ++n
        }), n > 0 && (t /= n, 0 != t % n && ++t), t
    }

    function s(e, t) {
        e._maximumNumberOfLoadedTiles = t, t = a(e, t), i(e, function (e) {
            e.maximumNumberOfLoadedTiles = t
        })
    }

    function u(e, t) {
        for (var n = 0; n < t.length; n++)
            if (t[n].model.id == e) return !0;
        return !1
    }

    function c(e, t) {
        t = Cesium.defined(t) && Cesium.defined(t.length) ? t : [];
        for (var n = [], r = 0; r < t.length; r++) {
            var i = t[r],
                s = e._primitives[i];
            Cesium.defined(s) && n.push(s)
        }
        var c = e._scene;
        if (!Cesium.defined(c)) {
            e._sceneModels = {};
            for (var r = 0; r < n.length; r++) {
                var s = n[r];
                e._sceneModels[s.model.id] = s
            }
            return void e.modelSetChanged.raiseEvent(e)
        }
        for (var r = 0; r < n.length; r++) {
            var s = n[r];
            Cesium.defined(e._sceneModels[s.model.id]) || (e._sceneModels[s.model.id] = s, c.primitives.add(s))
        }
        for (var i in e._sceneModels)
            if (!u(i, n)) {
                var s = e._sceneModels[i];
                c.primitives.remove(s), delete e._sceneModels[i]
            } var l = a(e, e.maximumNumberOfLoadedTiles);
        o(e, function (e) {
            e.maximumNumberOfLoadedTiles = l
        }), e.modelSetChanged.raiseEvent(e)
    }

    function l(e) {
        e.ready && e._readyPromise.resolve(e)
    }

    function f(e, n, r) {
        var i = new t(n, r);
        Cesium.when(i.readyPromise).then(function () {
            e._primitives[n.id] = i, ++e._numLoadedModels, l(e)
        }).otherwise(function () {
            ++e._numFailedModels, l(e)
        })
    }

    function h(e) {
        var t = {
                debugFreezeFrame: e.debugFreezeFrame,
                debugShowBoundingVolume: e.debugShowBoundingVolume,
                maximumScreenSpaceError: e.maximumScreenSpaceError,
                maximumNumberOfLoadedTiles: a(e, e.maximumNumberOfLoadedTiles),
                refineToVisible: e.refineToVisible
            },
            n = e.bim.models;
        for (var r in n) {
            var i = n[r];
            f(e, i, t)
        }
    }

    function p(e, t, n) {
        this.bim = e, this._primitives = {}, this._sceneModels = {}, this._numLoadedModels = this._numFailedModels = 0, this._numModels = 0;
        for (var r in e.models) ++this._numModels;
        var i = m.any();
        n = Cesium.defaultValue(n, Cesium.defaultValue.EMPTY_OBJECT), this._debugShowBoundingVolume = Cesium.defaultValue(n.debugShowBoundingVolume, !1), this._debugFreezeFrame = Cesium.defaultValue(n.debugFreezeFrame, !1), this._maximumScreenSpaceError = Cesium.defaultValue(n.maximumScreenSpaceError, i ? 8 : 1), this._maximumNumberOfLoadedTiles = Cesium.defaultValue(n.maximumNumberOfLoadedTiles, i ? 10 : 1e3), this._refineToVisible = Cesium.defaultValue(n.refineToVisible, !0), this._readyPromise = Cesium.when.defer(), this.modelSetChanged = new Cesium.Event, h(this), this.models = t
    }
    var m = {
        Android: function () {
            return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i)
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i)
        },
        any: function () {
            return m.Android() || m.BlackBerry() || m.iOS() || m.Opera() || m.Windows()
        }
    };
    return p.prototype.isDestroyed = function () {
        return !1
    }, p.prototype.destroy = function () {
        return Cesium.defined(this._sceneModels) && (this.models = [], o(this, function (e) {
            e.destroy()
        })), this._primitives = void 0, this._sceneModels = void 0, this.bim = void 0, this._scene = void 0, Cesium.destroyObject(this)
    }, p.prototype.addToScene = function (e) {
        this._scene = e, e.primitives.destroyPrimitives = !1, i(this, function (t) {
            e.primitives.add(t)
        })
    }, p.prototype.findModelGeometryForTileset = function (e) {
        if (Cesium.defined(e)) {
            var t = void 0;
            return o(this, function (n) {
                if (n.cesiumTileset === e) return t = n, !0
            }), t
        }
    }, p.prototype.setModelInScene = function (e, t) {
        var n = [];
        for (var r in this.models) n.push(r);
        var i = n.indexOf(e),
            o = -1 != i;
        o != t && (o ? n.splice(i, 1) : n.push(e), this.models = n)
    }, p.prototype.adjustTranslation = function (e) {
        o(this, function (t) {
            t.adjustTranslation(e)
        })
    }, Cesium.defineProperties(p.prototype, {
        ready: {
            get: function () {
                return this._numLoadedModels + this._numFailedModels == this._numModels
            }
        },
        readyPromise: {
            get: function () {
                return this._readyPromise.promise
            }
        },
        models: {
            get: function () {
                return this._sceneModels
            },
            set: function (e) {
                c(this, e)
            }
        },
        style: {
            get: function () {
                return this._style
            },
            set: function (e) {
                this._style = e, o(this, function (t) {
                    t.style = e
                })
            }
        },
        boundingVolume: {
            get: function () {
                var e;
                return i(this, function (t) {
                    e = t.boundingVolume
                }), e
            }
        },
        range: {
            get: function () {
                var e = new r,
                    t = !0;
                return i(this, function (n) {
                    var r = n.model.extents;
                    t ? (e.copyFrom(r), t = !1) : e.union(r)
                }), e
            }
        },
        boundingSphere: {
            get: function () {
                var e = [];
                return i(this, function (t) {
                    e.push(t.boundingSphere)
                }), Cesium.BoundingSphere.fromBoundingSpheres(e)
            }
        },
        maximumNumberOfLoadedTiles: {
            get: function () {
                return this._maximumNumberOfLoadedTiles
            },
            set: function (e) {
                s(this, e)
            }
        },
        maximumScreenSpaceError: {
            get: function () {
                return this._maximumScreenSpaceError
            },
            set: function (e) {
                this._maximumScreenSpaceError = e, o(this, function (t) {
                    t.maximumScreenSpaceError = e
                })
            }
        },
        debugShowBoundingVolume: {
            get: function () {
                return this._debugShowBoundingVolume
            },
            set: function (e) {
                this._debugShowBoundingVolume = e, o(this, function (t) {
                    t.debugShowBoundingVolume = e
                })
            }
        },
        debugFreezeFrame: {
            get: function () {
                return this._debugFreezeFrame
            },
            set: function (e) {
                this._debugFreezeFrame = e, o(this, function (t) {
                    t.debugFreezeFrame = e
                })
            }
        },
        refineToVisible: {
            get: function () {
                return this._refineToVisible
            },
            set: function (e) {
                this._refineToVisible = e, o(this, function (t) {
                    t.refineToVisible = e
                })
            }
        },
        modelMatrix: {
            get: function () {
                var e;
                return i(this, function (t) {
                    e = t.modelMatrix
                }), Cesium.defaultValue(e, Cesium.Matrix4.IDENTITY)
            }
        },
        rootTransform: {
            configurable: !0,
            get: function () {
                var e;
                return i(this, function (t) {
                    e = t.rootTransform
                }), Cesium.defaultValue(e, n.IDENTITY)
            }
        },
        allTilesLoaded: {
            get: function () {
                var e = !0;
                return i(this, function (t) {
                    e = e && t.allTilesLoaded
                }), e
            }
        }
    }), p
})