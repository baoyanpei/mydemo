define("MeasureAreaTool", ["../Bentley/Tools/PrimitiveTool", "../Bentley/Util/extend", "../Bentley/Bim/InputEventModifiers", "./ToolId", "./MeasureToolsCommon", "./MeasureArea"], function (e, t, n, r, i, o) {
    function a(t, n, o, a) {
        e.call(this, t, r.MeasureArea), this.referencing = n, this.formatLength = Cesium.defaultValue(a.formatLength, i.formatLengthMeters), this.formatArea = Cesium.defaultValue(a.formatArea, i.formatAreaSqMeters), this.startUrl = "resources/start.png", this.finishUrl = "resources/finish.png", this.labelOffset = new Cesium.Cartesian2(0, -20), this.polygonFinished = !1, this.pointPositions = [], this.pointEntities = [], this.edgeEntities = [], this.polygonEntity = null, this.labelEntity = null, this.tmpLine1Entity = null, this.tmpLine2Entity = null, this.dataSourceCollection = new Cesium.DataSourceCollection, this.dataSourceDisplay = new Cesium.DataSourceDisplay({
            scene: this.viewport.scene,
            dataSourceCollection: this.dataSourceCollection
        }), this.entities = this.dataSourceDisplay.defaultDataSource.entities, this.displayDepthFail = this.viewport.scene.context.fragmentDepth, this.eventHelper = new Cesium.EventHelper, this.eventHelper.add(o.onTick, function (e) {
            this.dataSourceDisplay.update(e)
        }, this)
    }
    return t(e, a), a.prototype.clearTemporaryPolygonCompletion = function () {
        this.tmpLine1Entity && (this.entities.remove(this.tmpLine1Entity), this.tmpLine1Entity = null), this.tmpLine2Entity && (this.entities.remove(this.tmpLine2Entity), this.tmpLine2Entity = null)
    }, a.prototype.clearAreaPolygon = function () {
        if (this.polygonFinished) {
            for (var e = 0; e < this.pointEntities.length; e++) this.entities.remove(this.pointEntities[e]);
            this.pointEntities.length = 0;
            for (var e = 0; e < this.edgeEntities.length; e++) this.entities.remove(this.edgeEntities[e]);
            this.edgeEntities.length = 0, this.polygonEntity && (this.entities.remove(this.polygonEntity), this.polygonEntity = null), this.labelEntity && (this.entities.remove(this.labelEntity), this.labelEntity = null), this.pointPositions.length = 0, this.polygonFinished = !1
        }
    }, a.prototype.addPoint = function (e) {
        var t = this.entities.add({
            billboard: {
                heightReference: Cesium.HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                image: 0 == this.pointEntities.length ? this.startUrl : this.finishUrl
            },
            position: e
        });
        this.pointEntities.push(t), this.pointPositions.push(e);
        var n = this.pointPositions.length - 1;
        if (n > 0) {
            var r = {
                polyline: {
                    positions: [this.pointPositions[n - 1], this.pointPositions[n]],
                    width: 2,
                    material: Cesium.Color.STEELBLUE,
                    followSurface: !1
                }
            };
            if (this.displayDepthFail) {
                var i = new Cesium.Color(.67, .03, .03);
                r.polyline.depthFailMaterial = i
            }
            var o = this.entities.add(r);
            this.edgeEntities.push(o)
        }
    }, a.prototype.updatePolygonEdges = function (e) {
        for (var t = 0; t < this.edgeEntities.length; t++) this.entities.remove(this.edgeEntities[t]);
        this.edgeEntities.length = 0;
        for (var t = 0; t < e.length; t++) {
            var n = {
                polyline: {
                    positions: [e[t], e[(t + 1) % e.length]],
                    width: 2,
                    material: Cesium.Color.STEELBLUE,
                    followSurface: !1
                }
            };
            if (this.displayDepthFail) {
                var r = new Cesium.Color(.67, .03, .03);
                n.polyline.depthFailMaterial = r
            }
            var i = this.entities.add(n);
            this.edgeEntities.push(i)
        }
    }, a.prototype.onDataButtonDown = function (e) {
        if (n.None != e.keyModifiers) return !1;
        var t = this.viewport.scene;
        if (!t.pickPositionSupported) return !1;
        var r = t.pickPosition(e.viewPoint);
        if (!Cesium.defined(r)) return !1;
        var i = t.pick(e.viewPoint);
        return !!i && (this.polygonFinished && this.clearAreaPolygon(), this.addPoint(r), !0)
    }, a.prototype.onModelMotion = function (e) {
        if (n.None != e.keyModifiers) return !1;
        if (this.polygonFinished) return !1;
        var t = this.pointPositions.length;
        if (t < 1) return !1;
        var r = this.viewport.scene;
        if (!r.pickPositionSupported) return !1;
        var i = r.pickPosition(e.viewPoint);
        if (!Cesium.defined(i)) return !1;
        var o = r.pick(e.viewPoint);
        if (!o) return !1;
        this.tmpLine1Entity || (this.tmpLine1Entity = this.entities.add({
            polyline: {
                width: 2,
                material: Cesium.Color.LIMEGREEN,
                followSurface: !1
            }
        }));
        var a = this;
        return this.tmpLine1Entity.polyline.positions = new Cesium.CallbackProperty(function () {
            return [a.pointPositions[t - 1], i]
        }, !1), t >= 2 && (this.tmpLine2Entity || (this.tmpLine2Entity = this.entities.add({
            polyline: {
                width: 2,
                material: Cesium.Color.LIMEGREEN,
                followSurface: !1
            }
        })), this.tmpLine2Entity.polyline.positions = new Cesium.CallbackProperty(function () {
            return [a.pointPositions[0], i]
        }, !1)), !0
    }, a.prototype.onResetButtonDown = function (e) {
        return n.None == e.keyModifiers && this.finishPolygon(e.viewPoint)
    }, a.prototype.onLongPress = function (e) {
        return this.finishPolygon(e.viewPoint)
    }, a.prototype.finishPolygon = function (e) {
        if (this.polygonFinished) return !1;
        var t = this.pointPositions.length;
        if (t < 2) return !1;
        var n = this.viewport.scene;
        if (!n.pickPositionSupported) return !1;
        var r = n.pickPosition(e);
        if (!Cesium.defined(r)) return !1;
        var a = n.pick(e);
        if (!a) return !1;
        this.clearTemporaryPolygonCompletion(), this.addPoint(r), this.polygonFinished = !0;
        var t = this.pointPositions.length;
        if (t > 2) {
            var s = {
                polyline: {
                    positions: [this.pointPositions[0], this.pointPositions[t - 1]],
                    width: 2,
                    material: Cesium.Color.STEELBLUE,
                    followSurface: !1
                }
            };
            if (this.displayDepthFail) {
                var u = new Cesium.Color(.67, .03, .03);
                s.polyline.depthFailMaterial = u
            }
            var c = this.entities.add(s);
            this.edgeEntities.push(c)
        }
        var l = [],
            f = !1,
            h = o.fitPlane(this.pointPositions),
            p = [];
        if (h)
            if (l = o.projectionPoints(this.pointPositions, h), p = o.dimensionsOfPolygon(l, h), p.area > 0) {
                for (var m = Array(), d = 0; d < l.length; d++) {
                    var v = Cesium.Cartesian3.fromElements(l[d].x, l[d].y, l[d].z);
                    m.push(v)
                }
                this.polygonEntity = this.entities.add({
                    name: "polygon with per-position heights",
                    polygon: {
                        hierarchy: m,
                        perPositionHeight: !0,
                        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(.5)
                    }
                }), this.updatePolygonEdges(m)
            } else f = !0;
        else f = !0;
        var g = o.centroidOfPoints(this.pointPositions),
            y = "";
        if (f) y = "Error: the area could not be computed.";
        else {
            var w = this.formatArea(p.area),
                x = this.formatLength(p.perimeter),
                b = Math.max(w.length, x.length);
            y = "Area:     " + i.paddingStringLeft(w, b) + "\nPerimeter:" + i.paddingStringLeft(x, b)
        }
        return this.labelEntity = this.entities.add({
            label: {
                heightReference: Cesium.HeightReference.NONE,
                showBackground: !0,
                font: "14px monospace",
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: this.labelOffset,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                text: y
            },
            position: g
        }), !0
    }, a.prototype.onCleanup = function () {
        return this.clearTemporaryPolygonCompletion(), this.clearAreaPolygon(), this.eventHelper.removeAll(), this.dataSourceDisplay = this.dataSourceDisplay.destroy(), this.dataSourceCollection = this.dataSourceCollection.destroy(), !0
    }, a
})