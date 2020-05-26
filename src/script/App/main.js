define("scripts/App/main", ["../Bentley/Util/requestJson", "./ToolId", "./ToolFactory", "./RDS", "../Bentley/Bentley", "../Bentley/Tools/PrimitiveTool", "../Bentley/Util/extend", "./MeasurePositionTool", "./MeasureDistanceTool", "./MeasureAreaTool", "./MeasureToolsCommon"], function (e, t, n, r, o, a, s, u, c, l, f) {
  function h() {
    var e, t = /\+/g,
      n = /([^&=]+)=?([^&]*)/g,
      r = function (e) {
        return decodeURIComponent(e.replace(t, " "))
      },
      i = window.location.search.substring(1);
    let urlParams;
    for (urlParams = {}; e = n.exec(i);) urlParams[r(e[1])] = r(e[2]);
    return urlParams
  }

  function p(e, n, r) {
    r = Cesium.defaultValue(r, {});
    var i = Cesium.defaultValue(r.server, !1),
      a = (Cesium.defaultValue(r.debug, !1), e.createToolbar());
    new o.ToolbarButton(a, "视图", "bim-icon-savedview", e.createViewSelectionWidget())
    new o.ToolbarButton(a, "模型", "bim-icon-model", e.createModelToggleWidget())
    new o.ToolbarButton(a, "类别", "bim-icon-categories", e.createCategoryToggleWidget())
    new o.ToolbarButton(a, "旋转视图", "bim-icon-gyroscope", e.createViewRotationWidget())
    new o.ToolbarButton(a, "设置", "bim-icon-settings", e.createSettingsWidget())
    new o.ToolbarButton(a, "链接", "bim-icon-link", e.createViewLinkWidget()), i && e.createElementPropertiesWidget(e)
    var s = e.viewport;
    a.addActionButton(new o.ToolAction("回到中心", "bim-icon-fitview", s, t.FitView, function () {
      return new o.FitViewTool(s, !0)
    })), a.addActionButton(new o.ToolAction("窗口工具", "bim-icon-windowarea", s, t.WindowArea));
    var h = new o.ToolAction("旋转工具", "bim-icon-gyroscope", s, t.Rotate);
    a.addActionButton(h), a.addActionButton(new o.ToolAction("移动工具", "bim-icon-pan", s, t.Pan)), a.addActionButton(new o.ToolAction("第一人称", "bim-icon-walk", s, t.Walk)), a.addActionButton(new o.ViewHistoryAction(s, !0)), a.addActionButton(new o.ViewHistoryAction(s, !1));
    var p = !0;
    if (p) {
      var m, d, v = e.cesiumWidget.clock;
      n.isGeoreferenced ? Cesium.defined(r.units) && "imperial" == r.units ? (m = f.formatLengthFeet, d = f.formatAreaSqFeet) : (m = f.formatLengthMeters, d = f.formatAreaSqMeters) : (m = f.formatLengthNoUnit, d = f.formatAreaNoUnit);
      var g = new o.ToolAction("位置测量", "rd-icon-measure-position", s, t.MeasurePosition, function () {
          return new u(s, n, v, {
            formatLength: m
          })
        }),
        y = new o.ToolAction("距离测量", "rd-icon-measure-distance", s, t.MeasureDistance, function () {
          return new c(s, n, v, {
            formatLength: m
          })
        }),
        w = new o.ToolAction("区域测量", "rd-icon-measure-area", s, t.MeasureArea, function () {
          return new l(s, n, v, {
            formatLength: m,
            formatArea: d
          })
        });
      if (a.addActionButton(g), a.addActionButton(y), a.addActionButton(w), !s.scene.pickPositionSupported) {
        g.enabled = !1, y.enabled = !1, w.enabled = !1;
        var x = ": this tool is not available because your browser does not support WEBGL_depth_texture";
        g.tooltipText += x, y.tooltipText += x, w.tooltipText += x
      }
    }
    h.active = h.activate();
    var b = document.getElementsByClassName("cesium-viewer-fullscreenContainer");
    return a.cornerContainer.title = "Toggle toolbars", a.cornerContainer.onclick = function () {
      var e = "none" == a.topContainer.style.display ? "block" : "none";
      a.topContainer.style.display = e, a.leftContainer.style.display = e, 1 === b.length && (b[0].style.display = e)
    }, a
  }

  function m(e) {
    a.call(this, e, t.Default)
  }

  function d(e) {
    var t = {};
    if (Cesium.defined(e.region)) t.isGeoreferenced = !0, t.dataToGlobeTransform = Cesium.Matrix4.IDENTITY.clone(), t.globeToDataTransform = Cesium.Matrix4.IDENTITY.clone();
    else {
      var n;
      if (Cesium.defined(e.box)) {
        var r = e.box;
        n = Cesium.Cartesian3.fromElements(r[0], r[1], r[2])
      } else if (Cesium.defined(e.sphere)) {
        var i = e.sphere;
        n = Cesium.Cartesian3.fromElements(i[0], i[1], i[2])
      }
      var o = Cesium.Cartographic.fromCartesian(n);
      if (t.isGeoreferenced = o.height > -3e3 && o.height < 9e3, t.isGeoreferenced) t.dataToGlobeTransform = Cesium.Matrix4.IDENTITY.clone(), t.globeToDataTransform = Cesium.Matrix4.IDENTITY.clone();
      else {
        var o = [-90, 0, 0],
          a = Cesium.Cartesian3.fromDegrees(o[0], o[1], o[2]);
        Cesium.Cartesian3.subtract(a, n, a), t.dataToGlobeTransform = Cesium.Matrix4.fromTranslation(a), Cesium.Cartesian3.negate(a, a), t.globeToDataTransform = Cesium.Matrix4.fromTranslation(a)
      }
    }
    return t
  }

  function v(e, t, n, r) {
    if (Cesium.defined(e.box)) {
      var o = e.box,
        a = Cesium.Cartesian3.fromElements(o[0], o[1], o[2]),
        s = Cesium.Cartesian3.fromElements(o[3], o[4], o[5]),
        u = Cesium.Cartesian3.fromElements(o[6], o[7], o[8]),
        c = Cesium.Cartesian3.fromElements(o[9], o[10], o[11]),
        l = [];
      l[0] = Cesium.Cartesian3.add(a, s, new Cesium.Cartesian3), l[1] = Cesium.Cartesian3.add(a, u, new Cesium.Cartesian3), l[2] = Cesium.Cartesian3.add(a, c, new Cesium.Cartesian3), l[3] = Cesium.Cartesian3.subtract(a, s, new Cesium.Cartesian3), l[4] = Cesium.Cartesian3.subtract(a, u, new Cesium.Cartesian3), l[5] = Cesium.Cartesian3.subtract(a, c, new Cesium.Cartesian3), a = Cesium.Matrix4.multiplyByPoint(t, a, a);
      var f = 0;
      for (i = 0; i < 6; i++) l[i] = Cesium.Matrix4.multiplyByPoint(t, l[i], l[i]), f = Math.max(f, Cesium.Cartesian3.distance(a, l[i]));
      n.center = a, n.radius = f, r = Cesium.AxisAlignedBoundingBox.fromPoints(l, r)
    } else if (Cesium.defined(e.sphere)) {
      var h = e.sphere,
        a = Cesium.Cartesian3.fromElements(h[0], h[1], h[2]);
      a = Cesium.Matrix4.multiplyByPoint(t, a, a);
      var f = h[3];
      n.center = a, n.radius = f;
      var p = new Cesium.Cartesian3(f, f, f);
      r.maximum = Cesium.Cartesian3.add(a, p, r.maximum), r.minimum = Cesium.Cartesian3.subtract(a, p, r.minimum)
    }
  }

  function g(e, t, n) {
    if (Cesium.defined(t.root.boundingVolume)) {
      var r = {};
      r.referencing = d(t.root.boundingVolume);
      var i = new Cesium.BoundingSphere,
        o = new Cesium.AxisAlignedBoundingBox;
      v(t.root.boundingVolume, r.referencing.dataToGlobeTransform, i, o);
      var a = i.center,
        s = i.radius,
        u = r.referencing.isGeoreferenced ? Cesium.Transforms.eastNorthUpToFixedFrame(a) : Cesium.Matrix4.clone(r.referencing.dataToGlobeTransform);
      r.bimGeometryTransform = new Cesium.Matrix4, r.bimGeometryTransform.copyFrom(u);
      var c = 2 * i.radius,
        l = Cesium.Matrix4.getRotation(u, new Cesium.Matrix3);
      Cesium.Matrix3.transpose(l, l);
      var f = Cesium.Matrix3.fromRotationX(-1, new Cesium.Matrix3);
      Cesium.Matrix3.multiply(f, l, l);
      var h = Cesium.Matrix3.getRow(l, 0, new Cesium.Cartesian3),
        p = Cesium.Matrix3.getRow(l, 1, new Cesium.Cartesian3),
        m = Cesium.Matrix3.getRow(l, 2, new Cesium.Cartesian3),
        g = Cesium.Cartesian3.add(i.center, Cesium.Cartesian3.multiplyByScalar(m, c, new Cesium.Cartesian3), new Cesium.Cartesian3),
        y = new Cesium.Cartesian3(a.x - s * (h.x + p.x + m.x), a.y - s * (h.y + p.y + m.y), a.z - s * (h.z + p.z + m.z)),
        w = new Cesium.Cartesian3(2 * s, 2 * s, 2 * s);
      var extents = {
        low: {
          x: o.minimum.x,
          y: o.minimum.y,
          z: o.minimum.z
        },
        high: {
          x: o.maximum.x,
          y: o.maximum.y,
          z: o.maximum.z
        }
      };
      return extents, r.bimDescription = {
        categories: {
          1: "未分类"
        },
        categorySelectors: {
          1: ["1"]
        },
        defaultView: "1",
        displayStyles: {
          1: {
            backgroundColor: {
              blue: 1,
              green: 1,
              red: 1
            }
          }
        },
        modelSelectors: {
          1: ["1"]
        },
        models: {
          1: {
            extents: extents,
            name: e,
            tilesetUrl: n,
            type: "spatial"
          }
        },
        name: "Scene",
        projectExtents: extents,
        projectTransform: Cesium.Matrix4.toArray(r.bimGeometryTransform),
        views: {
          1: {
            categorySelector: "1",
            displayStyle: "1",
            extents: {
              x: w.x,
              y: w.y,
              z: w.z
            },
            eyePoint: {
              x: g.x,
              y: g.y,
              z: g.z
            },
            focusDistance: c,
            lensAngle: .8,
            modelSelector: "1",
            name: "默认视图",
            origin: {
              x: y.x,
              y: y.y,
              z: y.z
            },
            rotation: Cesium.Matrix3.toArray(l),
            type: "camera"
          }
        }
      }, r.referencing.isGeoreferenced ? r.bimDescription.viewerOptions = {
        displayInPlace: !0,
        imageryProvider: "ESRIWorldImagery",
        terrainProvider: "stk"
      } : r.bimDescription.viewerOptions = {
        displayInPlace: !1
      }, r
    }
  }
  s(a, m), m.prototype.onResetButtonDown = function (e) {
    var t = n.createRotateTool(this.viewport, !1, !1);
    return t.InstallTool()
  }, m.prototype.onDataButtonDown = function (e) {
    var t = n.createPanTool(this.viewport, !1, !1);
    return t.installTool()
  };
  var y = {
    loadConfig: function (t) {
      var n = Cesium.when.defer(),
        r = this;
      return e("resources/" + t + ".json", function (e, t) {
        Cesium.defined(e) ? n.reject(e) : (r.config = t, n.resolve())
      }), n
    },
    startFromURL: function (t, n, r, i, a) {
      // document.title = Cesium.defined(a.title) ? a.title : t.concat(" | ContextCapture Web Viewer 2.0 - Bentley Systems");
      var s = Cesium.when.defer();
      e(n, function (e, t) {
        Cesium.defined(e) ? s.reject(e) : s.resolve(t)
      }), Cesium.when(s).then(function (e) {
        var s = g(t, e, n),
          u = s.bimDescription,
          c = s.bimGeometryTransform,
          l = s.referencing;
        if (!Cesium.defined(u)) return void i("Invalid dataset");
        var f = new o.Bim(u);
        Cesium.when(f.readyPromise).then(function () {
          var e = {
              maximumScreenSpaceError: 1,
              refineToVisible: !1
            },
            t = new o.BimGeometry(f, void 0, e);
          Cesium.when(t.readyPromise).then(function () {
            Cesium.defineProperties(o.BimGeometry.prototype, {
              rootTransform: {
                get: function () {
                  return c
                }
              }
            });
            var e = t._primitives;
            for (var n in e) e[n].cesiumTileset._root.transform = l.dataToGlobeTransform;
            Cesium.BingMapsApi.defaultKey = "", i(), f.geocoder = !1;
            var s = new o.Viewer(r, t, f.createBentleyViewerOptions());
            p(s, l, a), Cesium.defined(s.viewport.scene.globe) && (s.viewport.scene.globe.depthTestAgainstTerrain = !1)
          }, function (e) {
            i("Failed to create scene geometry", e)
          })
        }, function (e) {
          i("Failed to create scene", e)
        })
      }, function (e) {
        i("Failed to load root of dataset（模型配置文件不存在）", e)
      })
    },
    startFromID: function (e, t, n, i, o) {
      var a = r.getTilesetNameAndURL(e, t, this.config.RDS),
        s = this;
      Cesium.when(a).then(function (e) {
        s.startFromURL(e.Name, e.URL, n, i, o)
      }, function (e) {
        i("Failed to access dataset on ProjectWise ContextShare", e)
      })
    },
    run: function (e, _config, t) {
      var n = h(),
        r = n.id,
        i = n.projectId,
        o = Cesium.defined(n.config) ? n.config : "config",
        a = this;
      // console.log('this', this)
      // console.log('this.loadConfig2(o)', this.loadConfig2(o))
      // Cesium.when(this.loadConfig(o)).then(function () {
      Cesium.when(true).then(function () {
        var o = {};
        a.config = _config
        Cesium.defined(n.units) ? o.units = n.units : Cesium.defined(a.config.units) && (o.units = a.config.units), Cesium.defined(a.config.title) && (o.title = a.config.title);
        var s;
        Cesium.defined(n.url) ? s = n.url : Cesium.defined(a.config.url) && (s = a.config.url);
        var u = "Unknown";
        Cesium.defined(n.name) ? u = n.name : Cesium.defined(a.config.name) && (u = a.config.name), Cesium.defined(r) ? a.startFromID(r, i, e, t, o) : Cesium.defined(s) ? a.startFromURL(u, s, e, t, o) : t("No dataset is specified")
      }, function (e) {
        t("Failed to load application configuration", e)
      })
    }
  };
  return y
})
