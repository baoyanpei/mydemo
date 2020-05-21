define("Model", ["../Math/Matrix4", "../Math/Range3", "../Math/Cartesian3"], function (e, t, n) {
  function r(n, r, i, o, a) {
    a = Cesium.defaultValue(a, {}), this.bim = n, this.name = r, this.id = i, this.tilesetUrl = o, this.transform = new e, this.transform.copyFrom(Cesium.defaultValue(a.transform, e.IDENTITY)), this.extents = new t, Cesium.defined(a.extents) && this.extents.copyFrom(a.extents), this.isSpatialModel = this.isDrawingModel = !1
  }
  return r
})
