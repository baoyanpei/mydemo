define("CameraInfo", [], function () {
    function e(e, t, n) {
        this.lensAngle = e, this.focusDistance = t, this.eyePoint = n
    }
    return Cesium.defineProperties(e.prototype, {
        isFocusValid: {
            get: function () {
                return this.focusDistance > 0 && this.focusDistance < 1e14
            }
        },
        isLensValid: {
            get: function () {
                return e.isValidLensAngle(this.lensAngle)
            }
        },
        isValid: {
            get: function () {
                return this.isLensValid && this.isFocusValid
            }
        }
    }), e.prototype.clone = function () {
        return new e(this.lensAngle, this.focusDistance, this.eyePoint.clone())
    }, e.isValidLensAngle = function (e) {
        return e > Math.PI / 8 && e < Math.PI
    }, e.prototype.invalidateFocus = function () {
        this.focusDistance = -1
    }, e.prototype.equals = function (e) {
        return e.lensAngle == this.lensAngle && e.focusDistance == this.focusDistance && e.eyePoint.equals(this.eyePoint)
    }, e.prototype.validateLens = function () {
        this.isLensValid || (this.lensAngle = Math.PI / 2)
    }, e.prototype.copyFrom = function (e) {
        this.lensAngle = e.lensAngle, this.focusDistance = e.focusDistance, this.eyePoint = e.eyePoint
    }, e
})

