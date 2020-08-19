define("View", ["../Math/Matrix3", "../Math/Cartesian3", "../Math/Constants", "./NpcCorners", "./StandardViewMatrices", "../Math/Range3"], function (e, t, n, r, i, o) {
  function a(n, r) {
    return this.bim = r, this.dir = new t, this.up = new t, this.dest = new t, Cesium.defined(n) ? (this.name = n.name, this.type = n.type, this.categorySelector = n.categorySelector, this.modelSelector = n.modelSelector, this.displayStyle = n.displayStyle, this.origin = t.fromObject(n.origin), this.extents = t.fromObject(n.extents), void(this.rotation = e.fromArray(n.rotation))) : (this.origin = new t, this.extents = new t, void(this.rotation = new e))
  }
  var s = new t;
  Cesium.defineProperties(a.prototype, {
    categories: {
      get: function () {
        return this.bim.categorySelectors[this.categorySelector]
      }
    },
    models: {
      get: function () {
        return this.bim.modelSelectors[this.modelSelector]
      }
    },
    backgroundColor: {
      get: function () {
        return this.bim.displayStyles[this.displayStyle] ? this.bim.displayStyles[this.displayStyle].backgroundColor : void 0
      }
    },
    center: {
      get: function () {
        var e = s;
        this.rotation.multiplyTranspose(e, this.extents);
        var n = new t;
        return n.sumOf(this.origin, e, .5), n
      }
    },
    xVector: {
      get: function () {
        return this.rotation.getRow(0)
      }
    },
    yVector: {
      get: function () {
        return this.rotation.getRow(1)
      }
    },
    zVector: {
      get: function () {
        return this.rotation.getRow(2)
      }
    },
    isCameraView: {
      get: function () {
        return Cesium.defined(this.toCameraView())
      }
    },
    isOrthographicView: {
      get: function () {
        return Cesium.defined(this.toOrthographicView())
      }
    },
    isDrawingView: {
      get: function () {
        return Cesium.defined(this.toDrawingView())
      }
    },
    is3d: {
      get: function () {
        return !this.is2d
      }
    },
    is2d: {
      get: function () {
        return Cesium.defined(this.toView2d())
      }
    },
    isSpatialView: {
      get: function () {
        return Cesium.defined(this.toSpatialView())
      }
    },
    isCameraOn: {
      get: function () {
        return !1
      }
    }
  }), a.prototype.toUrl = function () {
    var e = "extents=" + this.extents.x + "," + this.extents.y + "," + this.extents.z + "&origin=" + this.origin.x + "," + this.origin.y + "," + this.origin.z + "&rotation=" + Cesium.Matrix3.toArray(this.rotation).toString();
    return e
  }, a.prototype.updateFromJson = function (n) {
    Cesium.defined(n.extents) && (this.extents = t.fromObject(n.extents)), Cesium.defined(n.origin) && (this.origin = t.fromObject(n.origin)), Cesium.defined(n.rotation) && (this.rotation = e.fromArray(n.rotation))
  }, a.prototype.copyFrom = function (e) {
    this.bim = e.bim, this.name = e.name, this.type = e.type, this.viewId = e.viewId, this.categorySelector = e.categorySelector, this.modelSelector = e.modelSelector, this.displayStyle = e.displayStyle, this.origin.copyFrom(e.origin), this.extents.copyFrom(e.extents), this.rotation.copyFrom(e.rotation)
  }, a.prototype.isEqual = function (e) {
    return this.name == e.name && this.type == e.type && this.categorySelector == e.categorySelector && this.modelSelector == e.modelSelector && this.origin.equals(e.origin) && this.extents.equals(e.extents) && this.rotation.equals(e.rotation)
  }, a.maxViewDelta = 2 * n.diameterOfEarth, a.minViewDelta = n.oneMillimeter / 100, a.limitWindowSize = function (e) {
    return e < a.minViewDelta ? e = a.minViewDelta : e > a.maxViewDelta && (e = a.maxViewDelta), e
  }, a.validateViewDelta = function (e) {
    var t = a.limitWindowSize(e.x),
      n = a.limitWindowSize(e.y);
    e.z = a.limitWindowSize(e.z);
    var r = t != e.x || n != e.y;
    return r && (e.x = t, e.y = n), !r
  }, a.fixFrustumOrder = function (e) {
    var t = e.pts,
      n = Cesium.Cartesian3.fromDifferenceOf(t[r.NPC_001], t[r.NPC_000]),
      i = Cesium.Cartesian3.fromDifferenceOf(t[r.NPC_010], t[r.NPC_000]),
      o = Cesium.Cartesian3.fromDifferenceOf(t[r.NPC_100], t[r.NPC_000]);
    if (n.tripleProduct(i, o) <= 0) return e;
    for (var a = e.clone(), s = 0; s < 8; s += 2) {
      var u = t[s].clone();
      Cesium.Cartesian3.clone(t[s + 1], a.pts[s]), Cesium.Cartesian3.clone(u, a.pts[s + 1])
    }
    return a
  }, a.prototype.setupFromFrustum = function (e) {
    var t = a.fixFrustumOrder(e);
    return this._setupFromFrustum(t)
  }, a.prototype._setupFromFrustum = function (e) {
    return this._baseSetupFromFrustum(e)
  }, a.prototype._baseSetupFromFrustum = function (n) {
    var i = n.pts,
      o = i[r.NPC_000].clone(),
      s = t.fromDifferenceOf(i[r.NPC_100], o),
      u = t.fromDifferenceOf(i[r.NPC_010], o),
      c = t.fromDifferenceOf(i[r.NPC_001], o),
      l = e.fromColumnVectors(s, u, c);
    if (!l.squareAndNormalizeColumns(l, 0, 1)) return !1;
    a.findNearbyStandardViewMatrix(l);
    var f = l.getColumn(0),
      h = l.getColumn(1),
      p = l.getColumn(2),
      m = new e;
    m.inverseOf(l);
    var d = p.dot(c);
    if (d < 0) return !1;
    var v = new t;
    v.sumOf2ScaledVectors(t.ZERO, f, f.dot(s), h, h.dot(u)), v.sumOf(v, p, d), o.sumOf(n.getCenter(), v, -.5);
    var g = new t;
    return m.multiply(v, g), !!a.validateViewDelta(g, !1) && (this.setOrigin(o), this.setExtents(g), this.setRotation(m), !0)
  }, a.prototype.lookAtViewAlignedVolume = function (e, r, i) {
    var o = this.extents.clone(),
      s = this.origin.clone(),
      u = this.rotation.clone(),
      c = e.low.clone(),
      l = new t;
    l.differenceOf(e.high, e.low);
    var f = n.oneMillimeter;
    l.z < f && (c.z -= (f - l.z) / 2, l.z = f);
    var h = l.clone();
    if (!this.isCameraOn) {
      l.scale(1.04);
      var p = l.magnitudeXY();
      p > l.z && (l.z = p)
    }
    if (a.validateViewDelta(l), this.setExtents(l), Cesium.defined(r) && this.adjustAspectRatio(r, !0), l.copyFrom(this.extents), c.x -= (l.x - h.x) / 2, c.y -= (l.y - h.y) / 2, c.z -= (l.z - h.z) / 2, this.isCameraView && !i) {
      u.multiply(s), c.z = s.z;
      var m = this.extents.clone();
      m.z = o.z, this.setExtents(m)
    }
    var d = new t;
    if (u.multiplyTranspose(d, c), this.setOrigin(d), this.isCameraOn) {
      this.cameraInfo.validateLens();
      var v = Math.max(l.x, l.y) / (2 * Math.tan(this.cameraInfo.lensAngle / 2)),
        g = v + l.z;
      this.cameraInfo.focusDistance = v, this.centerEyePoint(g), this.verifyFocusPlane()
    }
  }, a.findNearbyStandardViewMatrix = function (e) {
    for (var t = i, n = 0; n < t.length; n++) {
      var r = t[n],
        o = r.maxDiff(e);
      if (o < 1e-7) return e.copyFrom(r), !0
    }
    return !1
  }, a.prototype.toSpatialView = function () {}, a.prototype.toOrthographicView = function () {}, a.prototype.toCameraView = function () {}, a.prototype.toView2d = function () {}, a.prototype.toDrawingView = function () {};
  var u = new t,
    c = new t,
    l = new t,
    f = new t;
  return a.prototype.init = function () {
    if (Cesium.defined(this._origin)) {
      if (this._origin.equals(this.origin) && this._extents.equals(this.extents) && this._rotation.equals(this.rotation)) return !1;
      this._origin.copyFrom(this.origin), this._extents.copyFrom(this.extents), this._rotation.copyFrom(this.rotation)
    } else this._origin = this.origin.clone(), this._extents = this.extents.clone(), this._rotation = this.rotation.clone();
    var e = this.extents,
      n = this.rotation,
      r = n.getRow(1, u),
      i = n.getRow(2, c),
      o = l;
    n.multiply(this.origin, o), o.sumOf(o, e, .5), n.multiplyTransposeInPlace(o);
    var a = e.x / Math.tan(this.fov),
      s = t.fromSumOf(o, i, a, f);
    return r.normalize(), i.normalize(), i.negate(), this.dest.copyFrom(s), this.dir.copyFrom(i), this.up.copyFrom(r), !0
  }, a
})
