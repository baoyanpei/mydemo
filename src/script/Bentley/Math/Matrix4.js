define("Matrix4", ["./Cartesian3", "./Matrix3"], function (e, t) {
    return Cesium.Matrix4.prototype.setRowValues = function (e, t, n, r, i) {
        Cesium.Matrix4.setRow(this, e, new Cesium.Cartesian4(t, n, r, i), this)
    }, Cesium.Matrix4.prototype.initScaleAndTranslate = function (e, t) {
        this.setRowValues(0, e.x, 0, 0, t.x), this.setRowValues(1, 0, e.y, 0, t.y), this.setRowValues(2, 0, 0, e.z, t.z), this.setRowValues(3, 0, 0, 0, 1)
    }, Cesium.Matrix4.initFromRange = function (t, n, r, i) {
        if (!Cesium.defined(t) && !Cesium.defined(n)) throw new Cesium.DeveloperError("Invalid Parameters");
        var o = e.fromDifferenceOf(i, r);
        0 == o.x && (o.x = 1), 0 == o.y && (o.y = 1), 0 == o.z && (o.z = 1);
        var a = new Cesium.Matrix3;
        if (Cesium.defined(t) && (a.initFromScaleFactors(o.x, o.y, o.z), t.initFromMatrixAndTranslation(a, r)), Cesium.defined(n)) {
            var s = new e(-r.x / o.x, -r.y / o.y, -r.z / o.z);
            a.initFromScaleFactors(1 / o.x, 1 / o.y, 1 / o.z), n.initFromMatrixAndTranslation(a, s)
        }
    }, Cesium.Matrix4.fromIdentity = function () {
        return Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY)
    }, Cesium.Matrix4.prototype.initIdentity = function () {
        this.copyFrom(Cesium.Matrix4.IDENTITY)
    }, Cesium.Matrix4.prototype.copyFrom = function (e) {
        Cesium.Matrix4.clone(e, this)
    }, Cesium.Matrix4.prototype.initFromMatrix = function (e) {
        this.initFromMatrixAndTranslation(e, void 0)
    }, Cesium.Matrix4.prototype.initFromTranslation = function (e) {
        this.initFromMatrixAndTranslation(void 0, e)
    }, Cesium.Matrix4.fromTranslation = function (e, t) {
        return Cesium.defined(t) || (t = new Cesium.Matrix4), t.initFromTranslation(e), t
    }, Cesium.Matrix4.fromMatrixAndTranslation = function (e, t, n) {
        return Cesium.defined(n) || (n = new Cesium.Matrix4), n.initFromMatrixAndTranslation(e, t), n
    }, Cesium.Matrix4.prototype.initFromMatrixAndTranslation = function (t, n) {
        t = Cesium.defaultValue(t, Cesium.Matrix3.IDENTITY), n = Cesium.defaultValue(n, e.ZERO), Cesium.Matrix4.fromRotationTranslation(t, n, this)
    }, Cesium.Matrix4.prototype.initProduct = function (e, t) {
        Cesium.Matrix4.multiply(e, t, this)
    }, Cesium.Matrix4.fromProduct = function (e, t, n) {
        return Cesium.defined(n) || (n = new Cesium.Matrix4), Cesium.Matrix4.multiply(e, t, n)
    }, Cesium.Matrix4.prototype.multiplyByPointAsVector = function (t, n) {
        return Cesium.defined(n) || (n = new e), Cesium.Matrix4.multiplyByPointAsVector(this, t, n)
    }, Cesium.Matrix4.prototype.multiplyByPoint = function (t, n) {
        return Cesium.defined(n) || (n = new e), Cesium.Matrix4.multiplyByPoint(this, t, n)
    }, Cesium.Matrix4.prototype.element = function (e, t) {
        if (e > 3 || t > 3 || e < 0 || t < 0) throw new Cesium.DeveloperError("Invalid row or column");
        return this[4 * t + e]
    }, Cesium.Matrix4.prototype.setElement = function (e, t, n) {
        if (e > 3 || t > 3 || e < 0 || t < 0) throw new Cesium.DeveloperError("Invalid row or column");
        this[4 * t + e] = n
    }, Cesium.Matrix4.prototype.multiplyAndRenormalize = function (t, n) {
        Cesium.defined(n) || (n = new e);
        var r = t.x,
            i = t.y,
            o = t.z,
            a = this.element(0, 0) * r + this.element(0, 1) * i + this.element(0, 2) * o + this.element(0, 3),
            s = this.element(1, 0) * r + this.element(1, 1) * i + this.element(1, 2) * o + this.element(1, 3),
            u = this.element(2, 0) * r + this.element(2, 1) * i + this.element(2, 2) * o + this.element(2, 3),
            c = this.element(3, 0) * r + this.element(3, 1) * i + this.element(3, 2) * o + this.element(3, 3),
            l = 1 == c || 0 == c ? 1 : 1 / c;
        return n.x = a * l, n.y = s * l, n.z = u * l, n
    }, Cesium.Matrix4.prototype.multiplyAndRenormalizeArray = function (e, t) {
        for (var n = Cesium.defaultValue(t, e), r = 0; r < e.length; r++) this.multiplyAndRenormalize(e[r], n[r])
    }, Cesium.Matrix4.fromFixedPointAndScaleFactors = function (e, t, n, r) {
        return new Cesium.Matrix4(t, 0, 0, (1 - t) * e.x, 0, n, 0, (1 - n) * e.y, 0, 0, r, (1 - r) * e.z, 0, 0, 0, 1)
    }, Cesium.Matrix4.fromMatrixAndFixedPoint = function (e, t, n) {
        return Cesium.defined(n) || (n = new Cesium.Matrix4), n.initFromMatrixAndFixedPoint(e, t), n
    }, Cesium.Matrix4.prototype.initFromMatrixAndFixedPoint = function (e, t) {
        this.initFromMatrix(e), this.setFixedPoint(t)
    }, Cesium.Matrix4.prototype.setFixedPoint = function (e) {
        var t = e.x,
            n = e.y,
            r = e.z;
        this.setColumnValues(3, e.x - this.element(0, 0) * t - this.element(0, 1) * n - this.element(0, 2) * r, e.y - this.element(1, 0) * t - this.element(1, 1) * n - this.element(1, 2) * r, e.z - this.element(2, 0) * t - this.element(2, 1) * n - this.element(2, 2) * r)
    }, Cesium.Matrix4.prototype.setColumn = function (e, t) {
        Cesium.Matrix4.setColumn(this, e, t, this)
    }, Cesium.Matrix4.prototype.setColumnValues = function (e, t, n, r, i) {
        this.setColumn(e, new Cesium.Cartesian4(t, n, r, Cesium.defaultValue(i, 1)))
    }, Cesium.Matrix4.prototype.multiplyArray = function (e, t) {
        Cesium.defined(t) || (t = e);
        for (var n = 0; n < e.length; n++) this.multiplyByPoint(e[n], t[n])
    }, Cesium.Matrix4.prototype.inverseOf = function (e) {
        Cesium.Matrix4.inverse(e, this)
    }, Cesium.Matrix4.prototype.scaleCompleteRows = function (e, t, n, r) {
        for (var i = 0; i < 4; i++) this.setElement(0, i, e.element(0, i) * t), this.setElement(1, i, e.element(1, i) * n), this.setElement(2, i, e.element(2, i) * r);
        this.setRowValues(3, 0, 0, 0, 1)
    }, Cesium.Matrix4.prototype.multiply = function (e, t) {
        return t = Cesium.defaultValue(t, e), Cesium.Matrix4.multiplyByPoint(this, e, t), t
    }, Cesium.Matrix4.fromLineAndRotationAngle = function (e, t, n) {
        var r = new Cesium.Matrix4;
        return r.initFromLineAndRotationAngle(e, t, n), r
    }, Cesium.Matrix4.prototype.initFromLineAndRotationAngle = function (n, r, i) {
        var o = e.fromDifferenceOf(r, n),
            a = t.fromVectorAndRotationAngle(o, i);
        this.initFromMatrixAndFixedPoint(a, n)
    }, Cesium.Matrix4.prototype.initFromAxisAndRotationAngle = function (e, t, n) {
        var r = Cesium.Matrix3.fromVectorAndRotationAngle(t, n);
        this.initFromMatrixAndFixedPoint(r, e)
    }, Cesium.Matrix4
})