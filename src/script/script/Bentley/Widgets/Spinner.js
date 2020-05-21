define("Spinner", [], function () {
    function e(e) {
        this.spinnerVisible = !1, this.className = e, this.content = t(e), Cesium.knockout.track(this, ["spinnerVisible"])
    }

    function t(e) {
        var t = document.createElement("div");
        return t.className = e, t
    }

    function n(e) {
        var t = window.getComputedStyle(document.querySelector("." + e));
        return {
            bottom: parseFloat(t.getPropertyValue("bottom").replace("px", "")),
            right: parseFloat(t.getPropertyValue("right").replace("px", ""))
        }
    }
    return Cesium.defineProperties(e.prototype, {
        isVisible: {
            get: function () {
                return this.spinnerVisible
            }
        },
        element: {
            get: function () {
                return this.content
            }
        }
    }), e.prototype.setOriginIfUndefined = function () {
        Cesium.defined(this.origin) || (this.origin = n(this.className))
    }, e.prototype.toggle = function (e) {
        this.spinnerVisible != e && (this.content.style.visibility = e ? "hidden" : "visible", this.spinnerVisible = e)
    }, e.prototype.updatePosition = function (e, t) {
        if ("top" !== e && "bottom" !== e && "right" !== e && "left" !== e) throw new Cesium.DeveloperError("direction must be top,left,bottom or right");
        this.setOriginIfUndefined();
        var n = "top" === e || "left" === e ? -1 * parseFloat(t) : parseFloat(t);
        e = "top" === e ? "bottom" : "left" === e ? "right" : e, this.content.style[e] = this.origin[e] + n + "px"
    }, e.prototype.resetPosition = function () {
        this.setOriginIfUndefined(), this.content.style.bottom = this.origin.bottom + "px", this.content.style.right = this.origin.right + "px"
    }, e.prototype.destroy = function () {
        return Cesium.destroyObject(this)
    }, e.prototype.isDestroyed = function () {
        return !1
    }, e
})