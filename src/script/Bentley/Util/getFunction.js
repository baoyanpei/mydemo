define("getFunction", [], function () {
    var e = function (e, t) {
        if (Cesium.defined(e) && "object" == typeof e && "string" == typeof t) {
            var n = e[t];
            return "function" == typeof n ? n : void 0
        }
    };
    return e
})