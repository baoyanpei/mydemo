define("Cartesian2", ["./Angle"], function (e) {
  return Cesium.Cartesian2.prototype.init = function (e, t) {
    this.x = e, this.y = t
  }, Cesium.Cartesian2.prototype.copyFrom = function (e) {
    Cesium.Cartesian2.clone(e, this)
  }, Cesium.Cartesian2.prototype.round = function () {
    this.x = Math.round(this.x), this.y = Math.round(this.y)
  }, Cesium.Cartesian2.prototype.floor = function () {
    this.x = Math.floor(this.x), this.y = Math.floor(this.y)
  }, Cesium.Cartesian2.prototype.scale = function (e) {
    this.x *= e, this.y *= e
  }, Cesium.Cartesian2.prototype.dot = function (e) {
    return Cesium.Cartesian2.dot(this, e)
  }, Cesium.Cartesian2.prototype.crossProduct = function (e) {
    return this.x * e.y - this.y * e.x
  }, Cesium.Cartesian2.prototype.angleTo = function (t) {
    var n = this.crossProduct(t),
      r = this.dot(t);
    return e.atan2(n, r)
  }, Cesium.Cartesian2.prototype.distance = function (e) {
    return Cesium.Cartesian2.distance(this, e)
  }, Cesium.Cartesian2
})
