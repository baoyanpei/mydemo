define("Matrix3", ["./Cartesian3", "./Angle"], function (e, t) {
  function n(e, t, n, r) {
    var i;
    return r > s ? (i = .5 * Math.sqrt(r), t * e < 0 && (i = -i)) : i = e * n, i
  }

  function r(n, r) {
    var i = Cesium.defined(r) ? r : new e;
    i.init(n.x, n.y, n.z);
    var o = i.normalize(),
      a = 2 * t.atan2(o, n.w);
    return a > Math.PI && (a = 2 * Math.PI - a, i.init(i.x * -1, i.y * -1, i.z * -1)), 0 == a && i.init(0, 0, 1), a
  }
  Cesium.Matrix3.prototype.element = function (e, t) {
    if (e > 2 || t > 2 || e < 0 || t < 0) throw new Cesium.DeveloperError("Invalid row or column");
    return this[3 * t + e]
  }, Cesium.Matrix3.prototype.setElement = function (e, t, n) {
    if (e > 2 || t > 2 || e < 0 || t < 0) throw new Cesium.DeveloperError("Invalid row or column");
    this[3 * t + e] = n
  }, Cesium.Matrix3.prototype.addToElement = function (e, t, n) {
    var r = this.element(e, t);
    this.setElement(e, t, r + n)
  }, Cesium.Matrix3.prototype.getRow = function (t, n) {
    return Cesium.defined(n) || (n = new e), Cesium.Matrix3.getRow(this, t, n), n
  }, Cesium.Matrix3.prototype.getRows = function (t, n, r) {
    return t = Cesium.defined(t) ? t : new e, n = Cesium.defined(n) ? n : new e, r = Cesium.defined(r) ? r : new e, this.getRow(0, t), this.getRow(1, n), this.getRow(2, r), [t, n, r]
  }, Cesium.Matrix3.prototype.getColumn = function (t, n) {
    return Cesium.defined(n) || (n = new e), Cesium.Matrix3.getColumn(this, t, n), n
  }, Cesium.Matrix3.prototype.copyFrom = function (e) {
    Cesium.Matrix3.clone(e, this)
  }, Cesium.Matrix3.prototype.maxDiff = function (e) {
    for (var t = 0, n = 0; n < 9; n++) {
      var r = Math.abs(this[n] - e[n]);
      r > t && (t = r)
    }
    return t
  }, Cesium.Matrix3.prototype.maxAbs = function () {
    for (var e = 0, t = 0; t < 9; t++) {
      var n = Math.abs(this[t]);
      n > e && (e = n)
    }
    return e
  }, Cesium.Matrix3.prototype.multiply = function (e, t) {
    t = Cesium.defaultValue(t, e), Cesium.Matrix3.multiplyByVector(this, e, t)
  }, Cesium.Matrix3.prototype.multiplyArray = function (e, t) {
    if (t = Cesium.defaultValue(t, e), e.length !== t.length) throw new Cesium.DeveloperError("Invalid Parameters");
    for (var n = 0; n < e.length; n++) this.multiply(e[n], t[n])
  };
  var i = new Cesium.Matrix3;
  Cesium.Matrix3.prototype.multiplyTranspose = function (e, t) {
    var n = Cesium.Matrix3.transpose(this, i);
    Cesium.Matrix3.multiplyByVector(n, t, e)
  }, Cesium.Matrix3.prototype.multiplyTransposeInPlace = function (e) {
    this.multiplyTranspose(e, e)
  }, Cesium.Matrix3.fromRowVectors = function (e, t, n) {
    var r = new Cesium.Matrix3;
    return r.fromRowVectors(e, t, n), r
  }, Cesium.Matrix3.prototype.fromRowVectors = function (e, t, n) {
    this.setRow(0, e), this.setRow(1, t), this.setRow(2, n)
  }, Cesium.Matrix3.fromColumnVectors = function (e, t, n) {
    var r = new Cesium.Matrix3;
    return r.initFromColumnVectors(e, t, n), r
  }, Cesium.Matrix3.prototype.initFromColumnVectors = function (e, t, n) {
    this.setColumn(0, e), this.setColumn(1, t), this.setColumn(2, n)
  }, Cesium.Matrix3.prototype.setRow = function (e, t) {
    Cesium.Matrix3.setRow(this, e, t, this)
  };
  var o = new e;
  Cesium.Matrix3.prototype.setRowValues = function (e, t, n, r) {
    var i = o;
    i.x = t, i.y = n, i.z = r, this.setRow(e, i)
  }, Cesium.Matrix3.prototype.setColumn = function (e, t) {
    Cesium.Matrix3.setColumn(this, e, t, this)
  }, Cesium.Matrix3.prototype.setColumnValues = function (e, t, n, r) {
    var i = o;
    i.x = t, i.y = n, i.z = r, this.setColumn(e, i)
  }, Cesium.Matrix3.prototype.initFromScaleFactors = function (e, t, n) {
    this[0] = e, this[4] = t, this[8] = n
  }, Cesium.Matrix3.prototype.initIdentity = function () {
    Cesium.Matrix3.clone(Cesium.Matrix3.IDENTITY, this)
  }, Cesium.Matrix3.prototype.squareAndNormalizeColumns = function (e, n, r) {
    var i = t.cyclic3dAxis(n),
      o = t.cyclic3dAxis(r),
      a = 3 - (i + o);
    if (i == o) return Cesium.Matrix3.clone(e, this), !1;
    var s = [e.getColumn(0), e.getColumn(1), e.getColumn(2)],
      u = s[i].normalize(),
      c = s[a].normalizedCrossProduct(s[i], s[o]);
    if (0 == c) return Cesium.Matrix3.clone(e, this), !1;
    var l = s[o].normalizedCrossProduct(s[a], s[i]);
    return 0 == l ? 0 == u ? (this.initIdentity(), !1) : (s[i].getNormalizedTriad(s[o], s[a], s[i]), this.initFromColumnVectors(s[0], s[1], s[2]), !1) : ((o + 1) % 3 == i && s[a].negate(), this.initFromColumnVectors(s[0], s[1], s[2]), !0)
  }, Cesium.Matrix3.prototype.inverseOf = function (e) {
    Cesium.Matrix3.inverse(e, this)
  }, Cesium.Matrix3.fromInverseOf = function (e, t) {
    var n = Cesium.defined(t) ? t : new Cesium.Matrix3;
    return n.inverseOf(e), n
  }, Cesium.Matrix3.prototype.isEqual = function (e, t) {
    return t = Cesium.defaultValue(t, 1e-6), this.maxDiff(e) <= t * this.maxAbs()
  }, Cesium.Matrix3.prototype.initFromScaledOuterProduct = function (e, t, n) {
    this.setColumnValues(0, n * e.x * t.x, n * e.y * t.x, n * e.z * t.x), this.setColumnValues(1, n * e.x * t.y, n * e.y * t.y, n * e.z * t.y), this.setColumnValues(2, n * e.x * t.z, n * e.y * t.z, n * e.z * t.z)
  };
  var a = new e;
  Cesium.Matrix3.prototype.initFromVectorAndRotationAngle = function (t, n) {
    var r = Math.cos(n),
      i = Math.sin(n),
      o = 1 - r,
      s = e.clone(t, a),
      u = s.normalize();
    return 0 == u ? void this.initIdentity() : (this.initFromScaledOuterProduct(s, s, o), this.addToElement(0, 0, r), this.addToElement(0, 1, -(i * s.z)), this.addToElement(0, 2, i * s.y), this.addToElement(1, 0, i * s.z), this.addToElement(1, 1, r), this.addToElement(1, 2, -(i * s.x)), this.addToElement(2, 0, -(i * s.y)), this.addToElement(2, 1, i * s.x), void this.addToElement(2, 2, r))
  }, Cesium.Matrix3.fromVectorAndRotationAngle = function (e, t, n) {
    var r = Cesium.defined(n) ? n : new Cesium.Matrix3;
    return r.initFromVectorAndRotationAngle(e, t), r
  }, Cesium.Matrix3.prototype.initFromAxisAndRotationAngle = function (e, t) {
    var n = Math.cos(t),
      r = Math.sin(t);
    switch (this.initIdentity(), e) {
      case 0:
        this.setElement(1, 1, n), this.setElement(2, 2, n), this.setElement(1, 2, -r), this.setElement(2, 1, r);
        break;
      case 1:
        this.setElement(0, 0, n), this.setElement(2, 2, n), this.setElement(0, 2, r), this.setElement(2, 0, -r);
        break;
      case 2:
        this.setElement(0, 0, n), this.setElement(1, 1, n), this.setElement(1, 0, r), this.setElement(0, 1, -r)
    }
  }, Cesium.Matrix3.fromAxisAndRotationAngle = function (e, t) {
    var n = new Cesium.Matrix3;
    return n.initFromAxisAndRotationAngle(e, t), n
  }, Cesium.Matrix3.prototype.initRotationFromVectorToVector = function (e, t) {
    var n = e.angleAndAxisOfRotationFromVectorToVector(t);
    return Cesium.defined(n) ? (this.initFromVectorAndRotationAngle(n.axis, n.radians), !0) : (this.initIdentity(), !1)
  }, Cesium.Matrix3.prototype.initProduct = function (e, t) {
    Cesium.Matrix3.multiply(e, t, this)
  }, Cesium.Matrix3.fromProduct = function (e, t, n) {
    return Cesium.defined(n) || (n = new Cesium.Matrix3), Cesium.Matrix3.multiply(e, t, n)
  };
  var s = .5;
  Cesium.Matrix3.prototype.toQuaternion = function (e, t) {
    for (var r = Cesium.defined(t) ? t : new Cesium.Cartesian4, i = this.element(0, 0), o = this.element(1, 1), a = this.element(2, 2), s = [1 + i - o - a, 1 - i + o - a, 1 - i - o + a, 1 + i + o + a], u = 0, c = 0; c < 4; c++) s[c] > s[u] && (u = c);
    var l;
    return 0 == u ? (r.x = .5 * Math.sqrt(s[0]), l = 1 / (4 * r.x), r.y = n(this.element(0, 1) + this.element(1, 0), r.x, l, s[1]), r.z = n(this.element(0, 2) + this.element(2, 0), r.x, l, s[2]), r.w = n(this.element(2, 1) - this.element(1, 2), r.x, l, s[3])) : 1 == u ? (r.y = .5 * Math.sqrt(s[1]), l = 1 / (4 * r.y), r.x = n(this.element(0, 1) + this.element(1, 0), r.y, l, s[0]), r.z = n(this.element(1, 2) + this.element(2, 1), r.y, l, s[2]), r.w = n(this.element(0, 2) - this.element(2, 0), r.y, l, s[3])) : 2 == u ? (r.z = .5 * Math.sqrt(s[2]), l = 1 / (4 * r.z), r.x = n(this.element(0, 2) + this.element(2, 0), r.z, l, s[0]), r.y = n(this.element(1, 2) + this.element(2, 1), r.z, l, s[1]), r.w = n(this.element(1, 0) - this.element(0, 1), r.z, l, s[3])) : (r.w = .5 * Math.sqrt(s[3]), l = 1 / (4 * r.w), r.x = n(this.element(2, 1) - this.element(1, 2), r.w, l, s[0]), r.y = n(this.element(0, 2) - this.element(2, 0), r.w, l, s[1]), r.z = n(this.element(1, 0) - this.element(0, 1), r.w, l, s[2])), e && (r.w = -r.w), r
  }, Cesium.Matrix3.prototype.getRotationAngleAndVector = function (e) {
    var t = this.toQuaternion(!1);
    return r(t, e)
  }, Cesium.Matrix3.fromScaleFactors = function (e, t, n) {
    var r = new Cesium.Matrix3;
    return r.initFromScaleFactors(e, t, n), r
  }, Cesium.Matrix3.fromTranspose = function (e) {
    var t = new Cesium.Matrix3;
    return t.transposeOf(e), t
  }, Cesium.Matrix3.prototype.transposeOf = function (e) {
    Cesium.Matrix3.transpose(e, this)
  }, Cesium.Matrix3.fromPrincipleAxisRotations = function (e, t, n, r, i) {
    var o = Cesium.defined(i) ? i : new Cesium.Matrix3;
    return o.initFromPrincipleAxisRotations(e, t, n, r), o
  };
  var u = new Cesium.Matrix3,
    c = new Cesium.Matrix3;
  return Cesium.Matrix3.prototype.initFromPrincipleAxisRotations = function (e, t, n, r) {
    var i = u,
      o = c;
    0 != t ? o.initFromAxisAndRotationAngle(0, t) : o.initIdentity(), 0 != n && (i.initFromAxisAndRotationAngle(1, n), o.initProduct(o, i)), 0 != r && (i.initFromAxisAndRotationAngle(2, r), o.initProduct(o, i)), this.initProduct(o, e)
  }, Cesium.Matrix3
})
