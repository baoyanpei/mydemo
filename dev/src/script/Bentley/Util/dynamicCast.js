define("dynamicCast", [], function () {
    function e(e, t) {
        return Cesium.defined(e) && Cesium.defined(t) && e instanceof t ? e : void 0
    }
    return e
})