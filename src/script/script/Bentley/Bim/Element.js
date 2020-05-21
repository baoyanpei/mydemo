define("Element", [], function () {
    function e(e, t, n) {
        this.elementId = e, this.modelId = t, this.categoryId = n
    }
    return e.isValidElement = function (e) {
        return Cesium.defined(e) && Cesium.defined(e.elementId)
    }, e
})