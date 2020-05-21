define("ViewWalk", ["./ViewNavigate", "./ViewHandleType", "./NavigateMotion", "../Util/extend", "./NavigateMode", "../Math/Cartesian3"], function (e, t, n, r, i, o) {
    function a(r) {
        e.call(this, r), this.handleType = t.ViewWalk, this.navigateMotion = new n(this.viewport)
    }
    r(e, a);
    var s = new o;
    return a.prototype.getNavigateMotion = function (e) {
        var t = this.getInputVector(s);
        if (0 != t.x || 0 != t.y) {
            var n = this.navigateMotion;
            switch (n.init(e), this.getNavigateMode()) {
                case i.Pan:
                    t.scale(this.getMaxLinearVelocity()), n.pan(t.x, t.y);
                    break;
                case i.Look:
                    t.scale(-this.getMaxAngularVelocity()), n.look(t.x, t.y);
                    break;
                case i.Travel:
                    n.travel(-t.x * this.getMaxAngularVelocity(), 0, -t.y * this.getMaxLinearVelocity(), !0)
            }
            return n
        }
    }, a
})