define("Cartesian3", ["./Angle"], function (e) {
  function t(e, t, n) {
    return n = Cesium.defaultValue(n, 1e-15), Math.abs(t) > n * Math.abs(e) ? e / t : void 0
  }
  Cesium.Cartesian3.prototype.init = function (e, t, n) {
    Cesium.Cartesian3.fromElements(e, t, n, this)
  }, Cesium.Cartesian3.prototype.zero = function () {
    this.init(0, 0, 0)
  }, Cesium.Cartesian3.prototype.normalize = function () {
    var e = this.magnitude();
    if (e > 0) {
      var t = 1 / e;
      this.x *= t, this.y *= t, this.z *= t
    } else this.x = 1, this.y = 0, this.z = 0, e = 0;
    return e
  }, Cesium.Cartesian3.prototype.crossProduct = function (e, t) {
    Cesium.Cartesian3.cross(e, t, this)
  }, Cesium.Cartesian3.fromCrossProduct = function (e, t, n) {
    var r = Cesium.defined(n) ? n : new Cesium.Cartesian3;
    return r.crossProduct(e, t), r
  }, Cesium.Cartesian3.prototype.normalizedDifference = function (e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.normalize()
  }, Cesium.Cartesian3.prototype.normalizedCrossProduct = function (e, t) {
    return this.crossProduct(e, t), this.normalize()
  }, Cesium.Cartesian3.prototype.negate = function () {
    Cesium.Cartesian3.negate(this, this)
  }, Cesium.Cartesian3.prototype.sumOf = function (e, t, n) {
    n = Cesium.defaultValue(n, 1), this.x = e.x + t.x * n, this.y = e.y + t.y * n, this.z = e.z + t.z * n
  }, Cesium.Cartesian3.prototype.sumOf2ScaledVectors = function (e, t, n, r, i) {
    this.x = e.x + t.x * n + r.x * i, this.y = e.y + t.y * n + r.y * i, this.z = e.z + t.z * n + r.z * i
  }, Cesium.Cartesian3.prototype.sumOf3ScaledVectors = function (e, t, n, r, i, o, a) {
    this.x = e.x + t.x * n + r.x * i + o.x * a, this.y = e.y + t.y * n + r.y * i + o.y * a, this.z = e.z + t.z * n + r.z * i + o.z * a
  }, Cesium.Cartesian3.prototype.add = function (e) {
    Cesium.Cartesian3.add(this, e, this)
  }, Cesium.Cartesian3.prototype.scaleByVector = function (e, t) {
    this.x = e.x, this.y = e.y, this.z = e.z, this.scale(t)
  }, Cesium.Cartesian3.prototype.scale = function (e) {
    this.x *= e, this.y *= e, this.z *= e
  }, Cesium.Cartesian3.fromSumOf = function (e, t, n, r) {
    var i = Cesium.defined(r) ? r : new Cesium.Cartesian3;
    return i.sumOf(e, t, n), i
  }, Cesium.Cartesian3.prototype.magnitude = function () {
    return Cesium.Cartesian3.magnitude(this)
  }, Cesium.Cartesian3.prototype.magnitudeXY = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }, Cesium.Cartesian3.prototype.differenceOf = function (e, t) {
    return Cesium.Cartesian3.subtract(e, t, this)
  }, Cesium.Cartesian3.prototype.subtract = function (e) {
    Cesium.Cartesian3.subtract(this, e, this)
  }, Cesium.Cartesian3.fromDifferenceOf = function (e, t, n) {
    var r = Cesium.defined(n) ? n : new Cesium.Cartesian3;
    return r.differenceOf(e, t), r
  }, Cesium.Cartesian3.fromStartEnd = function (e, t, n) {
    return Cesium.defined(n) || (n = new Cesium.Cartesian3), n.x = t.x - e.x, n.y = t.y - e.y, n.z = t.z - e.z, n
  }, Cesium.Cartesian3.fromInterpolate = function (e, t, n) {
    var r = new Cesium.Cartesian3;
    return r.interpolate(e, t, n), r
  }, Cesium.Cartesian3.prototype.dot = function (e) {
    return Cesium.Cartesian3.dot(this, e)
  }, Cesium.Cartesian3.prototype.interpolate = function (e, t, n) {
    if (t < 0 || t > 1) throw new Cesium.DeveloperError("Fraction must be in [0.0..1.0]");
    var r = e;
    t > .5 && (r = n, t -= 1), this.x = r.x + t * (n.x - e.x), this.y = r.y + t * (n.y - e.y), this.z = r.z + t * (n.z - e.z)
  }, Cesium.Cartesian3.prototype.tripleProduct = function (e, t) {
    return this.x * (e.y * t.z - e.z * t.y) + this.y * (e.z * t.x - e.x * t.z) + this.z * (e.x * t.y - e.y * t.x)
  }, Cesium.Cartesian3.prototype.copyFrom = function (e) {
    Cesium.Cartesian3.clone(e, this)
  }, Cesium.Cartesian3.prototype.getNormalizedTriad = function (e, t, n) {
    var r = this.magnitude(),
      i = r / 64;
    if (0 == r) return e.copyFrom(Cesium.Cartesian3.UNIT_X), t.copyFrom(Cesium.Cartesian3.UNIT_Y), n.copyFrom(Cesium.Cartesian3.UNIT_Z), !1;
    n.copyFrom(this);
    var o = new Cesium.Cartesian3;
    return Math.abs(n.x) < i && Math.abs(n.y) < i ? o.y = 1 : o.z = 1, e.crossProduct(o, n), t.crossProduct(n, e), e.normalize(), t.normalize(), n.normalize(), !0
  }, Cesium.Cartesian3.prototype.distanceSquaredXY = function (e) {
    var t = e.x - this.x,
      n = e.y - this.y;
    return t * t + n * n
  }, Cesium.Cartesian3.prototype.distanceXY = function (e) {
    return Math.sqrt(this.distanceSquaredXY(e))
  }, Cesium.Cartesian3.prototype.distance = function (e) {
    return Cesium.Cartesian3.distance(this, e)
  }, Cesium.Cartesian3.prototype.scaleToLength = function (e) {
    var t = this.normalize();
    return this.scale(e), t
  }, Cesium.Cartesian3.fromScale = function (e, t) {
    return new Cesium.Cartesian3(e.x * t, e.y * t, e.z * t)
  }, Cesium.Cartesian3.prototype.initFromScaledVector = function (e, t) {
    this.init(e.x * t, e.y * t, e.z * t)
  }, Cesium.Cartesian3.fromObject = function (e) {
    return new Cesium.Cartesian3(e.x, e.y, e.z)
  };
  var n = new Cesium.Cartesian3;
  return Cesium.Cartesian3.prototype.angleTo = function (t) {
    var r = n;
    r.crossProduct(this, t);
    var i = r.magnitude(),
      o = this.dot(t);
    return e.atan2(i, o)
  }, Cesium.Cartesian3.prototype.tryNormalizeFrom = function (e) {
    var n = e.magnitude(),
      r = t(1, n);
    return Cesium.defined(r) ? (this.initFromScaledVector(e, r), n) : void this.init(1, 0, 0)
  }, Cesium.Cartesian3.prototype.angleAndAxisOfRotationFromVectorToVector = function (t) {
    var n = new Cesium.Cartesian3,
      r = n.tryNormalizeFrom(this);
    if (Cesium.defined(r)) {
      var i = new Cesium.Cartesian3,
        o = i.tryNormalizeFrom(t);
      if (Cesium.defined(o)) {
        var a = new Cesium.Cartesian3,
          s = n.dot(i);
        a.crossProduct(n, i);
        var u, c = new Cesium.Cartesian3,
          l = c.tryNormalizeFrom(a);
        if (Cesium.defined(l)) u = e.atan2(l, s);
        else {
          var f = new Cesium.Cartesian3,
            h = new Cesium.Cartesian3,
            p = new Cesium.Cartesian3;
          n.getNormalizedTriad(f, h, p), u = s < 0 ? Math.PI : 0
        }
        return {
          radians: u,
          axis: c
        }
      }
    }
  }, Cesium.Cartesian3.prototype.isEqual = function (e, t) {
    return Cesium.defined(t) ? Math.abs(this.x - e.x) <= t && Math.abs(this.y - e.y) <= t && Math.abs(this.z - e.z) <= t : this.equals(e)
  }, Cesium.Cartesian3.prototype.isZero = function () {
    return this.equals(Cesium.Cartesian3.ZERO)
  }, Cesium.Cartesian3
})
