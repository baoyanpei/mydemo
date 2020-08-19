define("GestureInfo", ["./GestureId", "../Math/Cartesian3", "../Math/Cartesian2"], function (e, t, n) {
    function r(e, t, r, i, o, a, s, u) {
        this.touches = [new n, new n, new n], this.ptsLocation = new n, Cesium.defined(e) && this.init(e, t, r, i, o, a, s, u)
    }

    function i(t) {
        switch (t) {
            case e.None:
                return "None";
            case e.MultiFingerMove:
                return "MultiFingerMove";
            case e.SingleFingerMove:
                return "SingleFingerMove";
            case e.TwoFingerTap:
                return "TwoFingerTap";
            case e.PressAndTap:
                return "PressAndTap";
            case e.SingleTap:
                return "SingleTap";
            case e.DoubleTap:
                return "DoubleTap";
            case e.LongPress:
                return "LongPress";
            default:
                return "UNKNOWN"
        }
    }

    function o(e, t) {
        for (var n = " touch[" + t + "]:", r = 0; r < t; r++) n += e[r].toString() + " ";
        return n
    }
    return r.prototype.init = function (e, t, n, r, i, o, a, s) {
        i = Cesium.defaultValue(i, []), this.gestureId = e, this.numberTouches = Math.min(i.length, 3), this.previousNumberTouches = s, this.isEndGesture = o, this.ptsLocation.x = Math.floor(t), this.ptsLocation.y = Math.floor(n), this.distance = r;
        for (var u = 0; u < this.numberTouches; u++) this.touches[u].x = Math.floor(i[u].x), this.touches[u].y = Math.floor(i[u].y);
        this.isFromMouse = a
    }, r.prototype.getViewPoint = function (e, n) {
        Cesium.defined(n) || (n = new t);
        var r = e.getViewRect();
        return n.init(this.ptsLocation.x - r.origin.x, this.ptsLocation.y - r.origin.y, 0), n
    }, r.prototype.copyFrom = function (e) {
        this.gestureId = e.gestureId, this.numberTouches = e.numberTouches, this.previousNumberTouches = e.previousNumberTouches, this.isEndGesture = e.isEndGesture, this.ptsLocation.x = e.ptsLocation.x, this.ptsLocation.y = e.ptsLocation.y, this.distance = e.distance;
        for (var t = 0; t < this.numberTouches; t++) this.touches[t].x = e.touches[t].x, this.touches[t].y = e.touches[t].y;
        this.isFromMouse = e.isFromMouse
    }, r.prototype.clone = function (e) {
        var t = Cesium.defined(e) ? e : new r;
        return t.copyFrom(this), t
    }, r.prototype.toString = function () {
        return i(this.gestureId) + ":" + this.ptsLocation.toString() + " dist:" + this.distance + o(this.touches, this.numberTouches)
    }, r
})