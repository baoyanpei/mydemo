define("scripts/App/MeasureToolsCommon", [], function () {
    var e = {
        formatAngleDegrees: function (e) {
            var t = 5;
            return Cesium.Math.toDegrees(e).toFixed(t) + "°"
        },
        formatLengthNoUnit: function (e) {
            var t = 4;
            return e.toFixed(t)
        },
        formatLengthMeters: function (e) {
            var t = 2;
            return e.toFixed(t) + "m"
        },
        formatLengthFeet: function (e) {
            var t = 2;
            return (e / .3048).toFixed(t) + "ft"
        },
        formatAreaNoUnit: function (e) {
            var t = 4;
            return e.toFixed(t)
        },
        formatAreaSqMeters: function (e) {
            var t = 2;
            return e.toFixed(t) + "m²"
        },
        formatAreaSqFeet: function (e) {
            var t = 2;
            return (e / .09290304).toFixed(t) + "ft²"
        },
        paddingStringLeft: function (e, t) {
            for (var n = e, r = 0; r < t - e.length; r++) n = " " + n;
            return n.slice(-t)
        }
    };
    return e
})