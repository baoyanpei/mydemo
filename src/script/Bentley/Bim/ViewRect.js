define("ViewRect", ["../Math/Cartesian3", "../Math/Cartesian2"], function (e, t) {
    function n(e, n) {
        this.origin = new t, this.corner = new t, Cesium.defined(e) && t.clone(e, this.origin), Cesium.defined(n) && t.clone(n, this.corner)
    }
    return n.from4Points = function (e, t, r, i) {
        var o = new n;
        return o.initFrom4Points(e, t, r, i), o
    }, n.prototype.initFrom4Points = function (e, t, n, r) {
        this.origin.x = e, this.origin.y = t, this.corner.x = n, this.corner.y = r
    }, Cesium.defineProperties(n.prototype, {
        left: {
            get: function () {
                return this.origin.x
            }
        },
        top: {
            get: function () {
                return this.origin.y
            }
        },
        right: {
            get: function () {
                return this.corner.x
            }
        },
        bottom: {
            get: function () {
                return this.corner.y
            }
        },
        width: {
            get: function () {
                return this.corner.x - this.origin.x + 1
            }
        },
        height: {
            get: function () {
                return this.corner.y - this.origin.y + 1
            }
        },
        area: {
            get: function () {
                return this.width * this.height
            }
        },
        aspect: {
            get: function () {
                return this.width / this.height
            }
        }
    }), n.prototype.equals = function (e) {
        return e.origin.equals(this.origin) && e.corner.equals(this.corner)
    }, n
})