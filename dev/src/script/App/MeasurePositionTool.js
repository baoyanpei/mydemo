define("MeasurePositionTool", ["../Bentley/Tools/PrimitiveTool", "../Bentley/Util/extend", "../Bentley/Bim/InputEventModifiers", "./ToolId", "./MeasureToolsCommon"], function (e, t, n, r, i) {
  function o(t, n, o, a) {
    e.call(this, t, r.MeasurePosition), this.referencing = n, this.formatLength = Cesium.defaultValue(a.formatLength, i.formatLengthMeters), this.formatAngle = Cesium.defaultValue(a.formatAngle, i.formatAngleDegrees), this.maxPickedPositions = 3, this.markerUrl = "resources/position.png", this.labelOffset = new Cesium.Cartesian2(0, -20), this.pickedPositions = [], this.dataSourceCollection = new Cesium.DataSourceCollection, this.dataSourceDisplay = new Cesium.DataSourceDisplay({
      scene: this.viewport.scene,
      dataSourceCollection: this.dataSourceCollection
    }), this.entities = this.dataSourceDisplay.defaultDataSource.entities, this.eventHelper = new Cesium.EventHelper, this.eventHelper.add(o.onTick, function (e) {
      this.dataSourceDisplay.update(e)
    }, this)
  }
  return t(e, o), o.prototype.clearPickedPositions = function () {
    for (var e = 0; e < this.pickedPositions.length; e++) this.entities.remove(this.pickedPositions[e].marker), this.entities.remove(this.pickedPositions[e].label);
    this.pickedPositions.length = 0
  }, o.prototype.onDataButtonDown = function (e) {
    if (n.None != e.keyModifiers) return !1;
    var t = this.viewport.scene;
    if (!t.pickPositionSupported) return !1;
    var r = t.pickPosition(e.viewPoint);
    if (!Cesium.defined(r)) return !1;
    var o = t.pick(e.viewPoint);
    if (!o) return !1;
    var a = new Cesium.Cartesian3;
    Cesium.Matrix4.multiplyByPoint(this.referencing.globeToDataTransform, r, a);
    var s;
    if (this.referencing.isGeoreferenced) {
      var u = Cesium.Cartographic.fromCartesian(a),
        c = this.formatAngle(u.longitude),
        l = this.formatAngle(u.latitude),
        f = this.formatLength(u.height),
        h = Math.max(Math.max(c.length, l.length), f.length);
      s = "Lon:" + i.paddingStringLeft(c, h) + "\nLat:" + i.paddingStringLeft(l, h) + "\nAlt:" + i.paddingStringLeft(f, h)
    } else {
      var p = this.formatLength(a.x),
        m = this.formatLength(a.y),
        d = this.formatLength(a.z),
        h = Math.max(Math.max(p.length, m.length), d.length);
      s = "x:" + i.paddingStringLeft(p, h) + "\ny:" + i.paddingStringLeft(m, h) + "\nz:" + i.paddingStringLeft(d, h)
    }
    var v = [];
    for (v.marker = this.entities.add({
        billboard: {
          heightReference: Cesium.HeightReference.NONE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          image: this.markerUrl
        },
        position: r
      }), v.label = this.entities.add({
        label: {
          heightReference: Cesium.HeightReference.NONE,
          showBackground: !0,
          font: "14px monospace",
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: this.labelOffset,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          text: s
        },
        position: r
      }); this.pickedPositions.length >= this.maxPickedPositions;) {
      var g = this.pickedPositions.shift();
      this.entities.remove(g.marker), this.entities.remove(g.label)
    }
    return this.pickedPositions.push(v), !0
  }, o.prototype.onCleanup = function () {
    return this.clearPickedPositions(), this.eventHelper.removeAll(), this.dataSourceDisplay = this.dataSourceDisplay.destroy(), this.dataSourceCollection = this.dataSourceCollection.destroy(),
      !0
  }, o
})
