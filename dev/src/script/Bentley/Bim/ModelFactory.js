define("ModelFactory", ["./DrawingModel", "./SpatialModel", "../Math/Range3", "../Math/Matrix4", "../Math/Cartesian3"], function (e, t, n, r, i) {
    var o = {};
    return o.createModel = function (o, a, s) {
        var u = {};
        return Cesium.defined(s.transform) && (u.transform = r.fromArray(s.transform)), Cesium.defined(s.extents) && (u.extents = new n(i.fromObject(s.extents.low), i.fromObject(s.extents.high))), "drawing" == s.type ? new e(o, s.name, a, s.tilesetUrl, u) : "spatial" == s.type ? new t(o, s.name, a, s.tilesetUrl, u) : void 0
    }, o
})