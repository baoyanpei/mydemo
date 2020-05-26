define("ViewFactory", ["./View", "./OrthoView", "./CameraView", "./DrawingView"], function (e, t, n, r) {
    function i(e, t) {
        var n = {};
        return e.split("&").forEach(function (e) {
            var t = e.split("="),
                r = t[0],
                i = t[1];
            if (Cesium.defined(i)) {
                var s = i.split(",");
                a(r, s) && (n[r] = o(r, s))
            }
        }), n
    }

    function o(e, t) {
        return "origin" === e || "extents" === e || "eyePoint" === e ? {
            x: Number(t[0]),
            y: Number(t[1]),
            z: Number(t[2])
        } : "lensAngle" === e || "focusDistance" === e ? Number(t[0]) : "rotation" === e ? t.map(Number) : t[0]
    }

    function a(e, t) {
        return "origin" === e || "extents" === e || "eyePoint" === e ? 3 === t.length && 0 === t.filter(function (e) {
            return isNaN(e)
        }).length : "lensAngle" === e || "focusDistance" === e ? 1 === t.length && 0 === t.filter(function (e) {
            return isNaN(e)
        }).length : "rotation" !== e || 9 === t.length && 0 === t.filter(function (e) {
            return isNaN(e)
        }).length
    }
    var s = {};
    return s.createView = function (e, i) {
        return "camera" == e.type ? new n(e, i) : "ortho" == e.type ? new t(e, i) : "drawing" == e.type ? new r(e, i) : void 0
    }, s.cloneViewFromUrl = function (e, t) {
        var n = i(e, t),
            r = t.views[n.viewId];
        if (Cesium.defined(r)) {
            var o = r.clone();
            return o.updateFromJson(n), o
        }
    }, s
})