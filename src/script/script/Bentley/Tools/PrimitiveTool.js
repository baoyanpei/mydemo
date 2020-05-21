define("PrimitiveTool", ["./Tool", "../Util/extend"], function (e, t) {
    function n(t, n) {
        e.call(this, t, n)
    }
    return t(e, n), n.prototype.installToolImplementation = function () {
        return this.toolAdmin.startPrimitiveTool(this), this.toolAdmin.setPrimitiveTool(this), this.toolAdmin.onPostInstallTool(this), !0
    }, n.prototype.exitTool = function () {
        this.toolAdmin.startDefaultTool()
    }, n.prototype.onSuspended = function () {}, n.prototype.onResumed = function () {}, n
})