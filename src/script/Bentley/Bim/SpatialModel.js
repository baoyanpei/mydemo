define("SpatialModel", ["./Model", "../Util/extend"], function (e, t) {
  function n(t, n, r, i, o) {
    o.transform = t.projectTransform, e.call(this, t, n, r, i, o), this.isSpatialModel = !0
  }
  return t(e, n), n
})
