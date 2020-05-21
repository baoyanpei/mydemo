define("MeasureDistanceTool", ["../Bentley/Tools/PrimitiveTool", "../Bentley/Util/extend", "../Bentley/Bim/InputEventModifiers", "./ToolId", "./MeasureToolsCommon"], function (e, t, n, r, i) {
    function o(t, n, o, a) {
        e.call(this, t, r.MeasureDistance), this.referencing = n, this.formatLength = Cesium.defaultValue(a.formatLength, i.formatLengthMeters), this.markerUrl = "resources/position.png", this.labelOffset = new Cesium.Cartesian2(0, -20), this.firstDataPosition = null, this.secondDataPosition = null, this.firstPoint = null, this.secondPoint = null, this.firstBillboardEntity = null, this.secondBillboardEntity = null, this.lineEntity = null, this.labelEntity = null, this.dataSourceCollection = new Cesium.DataSourceCollection, this.dataSourceDisplay = new Cesium.DataSourceDisplay({
            scene: this.viewport.scene,
            dataSourceCollection: this.dataSourceCollection
        }), this.entities = this.dataSourceDisplay.defaultDataSource.entities, this.displayDepthFail = this.viewport.scene.context.fragmentDepth, this.eventHelper = new Cesium.EventHelper, this.eventHelper.add(o.onTick, function (e) {
            this.dataSourceDisplay.update(e)
        }, this)
    }
    return t(e, o), o.prototype.clearDistanceLine = function () {
        this.firstBillboardEntity && (this.entities.remove(this.firstBillboardEntity), this.firstBillboardEntity = null), this.secondBillboardEntity && (this.entities.remove(this.secondBillboardEntity), this.secondBillboardEntity = null), this.lineEntity && (this.entities.remove(this.lineEntity), this.lineEntity = null), this.labelEntity && (this.entities.remove(this.labelEntity), this.labelEntity = null), this.firstDataPosition = null, this.secondDataPosition = null, this.firstPoint = null, this.secondPoint = null
    }, o.prototype.onDataButtonDown = function (e) {
        if (n.None != e.keyModifiers) return !1;
        var t = this.viewport.scene;
        if (!t.pickPositionSupported) return !1;
        var r = t.pickPosition(e.viewPoint);
        if (!Cesium.defined(r)) return !1;
        var i = t.pick(e.viewPoint);
        if (!i) return !1;
        var o = new Cesium.Cartesian3;
        if (Cesium.Matrix4.multiplyByPoint(this.referencing.globeToDataTransform, r, o), this.secondPoint && this.clearDistanceLine(), this.firstPoint) {
            this.secondDataPosition = o, this.secondPoint = r;
            var a, s = Cesium.Cartesian3.distance(this.firstDataPosition, this.secondDataPosition);
            a = this.referencing.isGeoreferenced ? Cesium.Cartographic.fromCartesian(this.secondDataPosition).height - Cesium.Cartographic.fromCartesian(this.firstDataPosition).height : this.secondDataPosition.z - this.firstDataPosition.z;
            var u = new Cesium.Cartesian3;
            Cesium.Cartesian3.add(this.firstPoint, this.secondPoint, u), Cesium.Cartesian3.divideByScalar(u, 2, u), this.secondBillboardEntity = this.entities.add({
                billboard: {
                    heightReference: Cesium.HeightReference.NONE,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    image: this.markerUrl
                },
                position: this.secondPoint
            }), this.lineEntity.polyline.positions = [this.firstPoint, this.secondPoint], this.labelEntity = this.entities.add({
                label: {
                    heightReference: Cesium.HeightReference.NONE,
                    showBackground: !0,
                    font: "14px monospace",
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: this.labelOffset,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    text: "Distance: " + this.formatLength(s) + "\nHeight difference: " + this.formatLength(a)
                },
                position: u
            })
        } else {
            this.firstDataPosition = o, this.firstPoint = r, this.firstBillboardEntity = this.entities.add({
                billboard: {
                    heightReference: Cesium.HeightReference.NONE,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    image: this.markerUrl
                },
                position: this.firstPoint
            });
            var c = {
                polyline: {
                    positions: [this.firstPoint, this.firstPoint],
                    width: 2,
                    material: Cesium.Color.STEELBLUE,
                    followSurface: !1
                }
            };
            if (this.displayDepthFail) {
                var l = new Cesium.Color(.67, .03, .03);
                c.polyline.depthFailMaterial = l
            }
            this.lineEntity = this.entities.add(c)
        }
        return !0
    }, o.prototype.onModelMotion = function (e) {
        if (n.None != e.keyModifiers) return !1;
        if (!this.firstPoint || this.secondPoint) return !1;
        var t = this.viewport.scene;
        if (!t.pickPositionSupported) return !1;
        var r = t.pickPosition(e.viewPoint);
        if (!Cesium.defined(r)) return !1;
        var i = t.pick(e.viewPoint);
        if (!i) return !1;
        var o = this;
        return this.lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
            return [o.firstPoint, r]
        }, !1), !0
    }, o.prototype.onCleanup = function () {
        return this.clearDistanceLine(), this.eventHelper.removeAll(), this.dataSourceDisplay = this.dataSourceDisplay.destroy(), this.dataSourceCollection = this.dataSourceCollection.destroy(), !0
    }, o
}), ! function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("scripts/App/math.min", [], t) : "object" == typeof exports ? exports.math = t() : e.math = t()
}(this, function () {
    return function (e) {
        function t(r) {
            if (n[r]) return n[r].exports;
            var i = n[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.i = function (e) {
            return e
        }, t.d = function (e, n, r) {
            t.o(e, n) || Object.defineProperty(e, n, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }, t.n = function (e) {
            var n = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return t.d(n, "a", n), n
        }, t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = "", t(t.s = 519)
    }([function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function i(t, n, r) {
                var i = e.Matrix.storage(n || "default");
                return new i(t, r)
            }
            var o = r("matrix", {
                "": function () {
                    return i([])
                },
                string: function (e) {
                    return i([], e)
                },
                "string, string": function (e, t) {
                    return i([], e, t)
                },
                Array: function (e) {
                    return i(e)
                },
                Matrix: function (e) {
                    return i(e, e.storage())
                },
                "Array | Matrix, string": i,
                "Array | Matrix, string, string": i
            });
            return o.toTex = {
                0: "\\begin{bmatrix}\\end{bmatrix}",
                1: "\\left(${args[0]}\\right)",
                2: "\\left(${args[0]}\\right)"
            }, o
        }
        t.name = "matrix", t.factory = r
    }, function (e, t, n) {
        "use strict";
        e.exports = function e(t, n, r) {
            return t && "function" == typeof t.map ? t.map(function (t) {
                return e(t, n, r)
            }) : n(t)
        }
    }, function (e, t, n) {
        "use strict";

        function r(e) {
            for (var t = [], n = 0; n < e; n++) t.push(0);
            return t
        }
        t.isNumber = function (e) {
            return "number" == typeof e
        }, t.isInteger = function (e) {
            return !!isFinite(e) && e == Math.round(e)
        }, t.sign = Math.sign || function (e) {
            return e > 0 ? 1 : e < 0 ? -1 : 0
        }, t.format = function (e, n) {
            if ("function" == typeof n) return n(e);
            if (e === 1 / 0) return "Infinity";
            if (e === -(1 / 0)) return "-Infinity";
            if (isNaN(e)) return "NaN";
            var r = "auto",
                i = void 0;
            switch (n && (n.notation && (r = n.notation), t.isNumber(n) ? i = n : n.precision && (i = n.precision)), r) {
                case "fixed":
                    return t.toFixed(e, i);
                case "exponential":
                    return t.toExponential(e, i);
                case "engineering":
                    return t.toEngineering(e, i);
                case "auto":
                    return t.toPrecision(e, i, n && n.exponential).replace(/((\.\d*?)(0+))($|e)/, function () {
                        var e = arguments[2],
                            t = arguments[4];
                        return "." !== e ? e + t : t
                    });
                default:
                    throw new Error('Unknown notation "' + r + '". Choose "auto", "exponential", or "fixed".')
            }
        }, t.splitNumber = function (e) {
            var t = String(e).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
            if (!t) throw new SyntaxError("Invalid number " + e);
            var n = t[1],
                r = t[2],
                i = parseFloat(t[4] || "0"),
                o = r.indexOf(".");
            i += o !== -1 ? o - 1 : r.length - 1;
            var a = r.replace(".", "").replace(/^0*/, function (e) {
                return i -= e.length, ""
            }).replace(/0*$/, "").split("").map(function (e) {
                return parseInt(e)
            });
            return 0 === a.length && (a.push(0), i++), {
                sign: n,
                coefficients: a,
                exponent: i
            }
        }, t.toEngineering = function (e, n) {
            if (isNaN(e) || !isFinite(e)) return String(e);
            var i = t.roundDigits(t.splitNumber(e), n),
                o = i.exponent,
                a = i.coefficients,
                s = o % 3 === 0 ? o : o < 0 ? o - 3 - o % 3 : o - o % 3,
                u = o >= 0 ? o : Math.abs(s);
            a.length - 1 < u && (a = a.concat(r(u - (a.length - 1))));
            for (var c = Math.abs(o - s), l = 1; --c >= 0;) l++;
            var f = a.slice(l).join(""),
                h = f.match(/[1-9]/) ? "." + f : "",
                p = a.slice(0, l).join("") + h + "e" + (o >= 0 ? "+" : "") + s.toString();
            return i.sign + p
        }, t.toFixed = function (e, n) {
            if (isNaN(e) || !isFinite(e)) return String(e);
            var i = t.splitNumber(e),
                o = t.roundDigits(i, i.exponent + 1 + (n || 0)),
                a = o.coefficients,
                s = o.exponent + 1,
                u = s + (n || 0);
            return a.length < u && (a = a.concat(r(u - a.length))), s < 0 && (a = r(-s + 1).concat(a), s = 1), n && a.splice(s, 0, 0 === s ? "0." : "."), o.sign + a.join("")
        }, t.toExponential = function (e, n) {
            if (isNaN(e) || !isFinite(e)) return String(e);
            var i = t.splitNumber(e),
                o = n ? t.roundDigits(i, n) : i,
                a = o.coefficients,
                s = o.exponent;
            a.length < n && (a = a.concat(r(n - a.length)));
            var u = a.shift();
            return o.sign + u + (a.length > 0 ? "." + a.join("") : "") + "e" + (s >= 0 ? "+" : "") + s
        }, t.toPrecision = function (e, n, i) {
            if (isNaN(e) || !isFinite(e)) return String(e);
            var o = i && void 0 !== i.lower ? i.lower : .001,
                a = i && void 0 !== i.upper ? i.upper : 1e5,
                s = t.splitNumber(e),
                u = Math.abs(Math.pow(10, s.exponent));
            if (u < o || u >= a) return t.toExponential(e, n);
            var c = n ? t.roundDigits(s, n) : s,
                l = c.coefficients,
                f = c.exponent;
            l.length < n && (l = l.concat(r(n - l.length))), l = l.concat(r(f - l.length + 1 + (l.length < n ? n - l.length : 0))), l = r(-f).concat(l);
            var h = f > 0 ? f : 0;
            return h < l.length - 1 && l.splice(h + 1, 0, "."), c.sign + l.join("")
        }, t.roundDigits = function (e, t) {
            for (var n = {
                    sign: e.sign,
                    coefficients: e.coefficients,
                    exponent: e.exponent
                }, r = n.coefficients; t <= 0;) r.unshift(0), n.exponent++, t++;
            if (r.length > t) {
                var i = r.splice(t, r.length - t);
                if (i[0] >= 5) {
                    var o = t - 1;
                    for (r[o]++; 10 === r[o];) r.pop(), 0 === o && (r.unshift(0), n.exponent++, o++), o--, r[o]++
                }
            }
            return n
        }, t.digits = function (e) {
            return e.toExponential().replace(/e.*$/, "").replace(/^0\.?0*|\./, "").length
        }, t.DBL_EPSILON = Number.EPSILON || 2.220446049250313e-16, t.nearlyEqual = function (e, n, r) {
            if (null == r) return e == n;
            if (e == n) return !0;
            if (isNaN(e) || isNaN(n)) return !1;
            if (isFinite(e) && isFinite(n)) {
                var i = Math.abs(e - n);
                return i < t.DBL_EPSILON || i <= Math.max(Math.abs(e), Math.abs(n)) * r
            }
            return !1
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n) {
            var i, o = e.length;
            if (o != t[n]) throw new l(o, t[n]);
            if (n < t.length - 1) {
                var a = n + 1;
                for (i = 0; i < o; i++) {
                    var s = e[i];
                    if (!Array.isArray(s)) throw new l(t.length - 1, t.length, "<");
                    r(e[i], t, a)
                }
            } else
                for (i = 0; i < o; i++)
                    if (Array.isArray(e[i])) throw new l(t.length + 1, t.length, ">")
        }

        function i(e, n, r, o) {
            var a, s, u = e.length,
                c = n[r],
                l = Math.min(u, c);
            if (e.length = c, r < n.length - 1) {
                var f = r + 1;
                for (a = 0; a < l; a++) s = e[a], Array.isArray(s) || (s = [s], e[a] = s), i(s, n, f, o);
                for (a = l; a < c; a++) s = [], e[a] = s, i(s, n, f, o)
            } else {
                for (a = 0; a < l; a++)
                    for (; Array.isArray(e[a]);) e[a] = e[a][0];
                if (o !== t.UNINITIALIZED)
                    for (a = l; a < c; a++) e[a] = o
            }
        }

        function o(e, t) {
            var n, r = [];
            if (0 === t.length) {
                if (0 === e.length) throw new l(null, null, "!=");
                return e.shift()
            }
            for (n = 0; n < t[0]; n += 1) r.push(o(e, t.slice(1)));
            return r
        }

        function a(e, t, n) {
            var r, i;
            if (n < t) {
                var o = n + 1;
                for (r = 0, i = e.length; r < i; r++) e[r] = a(e[r], t, o)
            } else
                for (; Array.isArray(e);) e = e[0];
            return e
        }

        function s(e, t, n) {
            var r, i;
            if (Array.isArray(e)) {
                var o = n + 1;
                for (r = 0, i = e.length; r < i; r++) e[r] = s(e[r], t, o)
            } else
                for (var a = n; a < t; a++) e = [e];
            return e
        }
        var u = n(2),
            c = n(11),
            l = (n(5), n(63), n(9)),
            f = n(44);
        t.size = function (e) {
            for (var t = []; Array.isArray(e);) t.push(e.length), e = e[0];
            return t
        }, t.validate = function (e, t) {
            var n = 0 == t.length;
            if (n) {
                if (Array.isArray(e)) throw new l(e.length, 0)
            } else r(e, t, 0)
        }, t.validateIndex = function (e, t) {
            if (!u.isNumber(e) || !u.isInteger(e)) throw new TypeError("Index must be an integer (value: " + e + ")");
            if (e < 0 || "number" == typeof t && e >= t) throw new f(e, t)
        }, t.UNINITIALIZED = {}, t.resize = function (e, t, n) {
            if (!Array.isArray(e) || !Array.isArray(t)) throw new TypeError("Array expected");
            if (0 === t.length) throw new Error("Resizing to scalar is not supported");
            t.forEach(function (e) {
                if (!u.isNumber(e) || !u.isInteger(e) || e < 0) throw new TypeError("Invalid size, must contain positive integers (size: " + c.format(t) + ")")
            });
            var r = void 0 !== n ? n : 0;
            return i(e, t, 0, r), e
        }, t.reshape = function (e, n) {
            var r, i = t.flatten(e),
                a = function (e) {
                    return e.reduce(function (e, t) {
                        return e * t
                    })
                };
            if (!Array.isArray(e) || !Array.isArray(n)) throw new TypeError("Array expected");
            if (0 === n.length) throw new l(0, a(t.size(e)), "!=");
            try {
                r = o(i, n)
            } catch (r) {
                if (r instanceof l) throw new l(a(n), a(t.size(e)), "!=");
                throw r
            }
            if (i.length > 0) throw new l(a(n), a(t.size(e)), "!=");
            return r
        }, t.squeeze = function (e, n) {
            for (var r = n || t.size(e); Array.isArray(e) && 1 === e.length;) e = e[0], r.shift();
            for (var i = r.length; 1 === r[i - 1];) i--;
            return i < r.length && (e = a(e, i, 0), r.length = i), e
        }, t.unsqueeze = function (e, n, r, i) {
            var o = i || t.size(e);
            if (r)
                for (var a = 0; a < r; a++) e = [e], o.unshift(1);
            for (e = s(e, n, 0); o.length < n;) o.push(1);
            return e
        }, t.flatten = function (e) {
            if (!Array.isArray(e)) return e;
            var t = [];
            return e.forEach(function e(n) {
                Array.isArray(n) ? n.forEach(e) : t.push(n)
            }), t
        }, t.map = function (e, t) {
            return Array.prototype.map.call(e, t)
        }, t.forEach = function (e, t) {
            Array.prototype.forEach.call(e, t)
        }, t.join = function (e, t) {
            return Array.prototype.join.call(e, t)
        }, t.isArray = Array.isArray
    }, function (e, t, n) {
        "use strict";
        t.symbols = {
            Alpha: "A",
            alpha: "\\alpha",
            Beta: "B",
            beta: "\\beta",
            Gamma: "\\Gamma",
            gamma: "\\gamma",
            Delta: "\\Delta",
            delta: "\\delta",
            Epsilon: "E",
            epsilon: "\\epsilon",
            varepsilon: "\\varepsilon",
            Zeta: "Z",
            zeta: "\\zeta",
            Eta: "H",
            eta: "\\eta",
            Theta: "\\Theta",
            theta: "\\theta",
            vartheta: "\\vartheta",
            Iota: "I",
            iota: "\\iota",
            Kappa: "K",
            kappa: "\\kappa",
            varkappa: "\\varkappa",
            Lambda: "\\Lambda",
            lambda: "\\lambda",
            Mu: "M",
            mu: "\\mu",
            Nu: "N",
            nu: "\\nu",
            Xi: "\\Xi",
            xi: "\\xi",
            Omicron: "O",
            omicron: "o",
            Pi: "\\Pi",
            pi: "\\pi",
            varpi: "\\varpi",
            Rho: "P",
            rho: "\\rho",
            varrho: "\\varrho",
            Sigma: "\\Sigma",
            sigma: "\\sigma",
            varsigma: "\\varsigma",
            Tau: "T",
            tau: "\\tau",
            Upsilon: "\\Upsilon",
            upsilon: "\\upsilon",
            Phi: "\\Phi",
            phi: "\\phi",
            varphi: "\\varphi",
            Chi: "X",
            chi: "\\chi",
            Psi: "\\Psi",
            psi: "\\psi",
            Omega: "\\Omega",
            omega: "\\omega",
            true: "\\mathrm{True}",
            false: "\\mathrm{False}",
            i: "i",
            inf: "\\infty",
            Inf: "\\infty",
            infinity: "\\infty",
            Infinity: "\\infty",
            oo: "\\infty",
            lim: "\\lim",
            undefined: "\\mathbf{?}"
        }, t.operators = {
            transpose: "^\\top",
            factorial: "!",
            pow: "^",
            dotPow: ".^\\wedge",
            unaryPlus: "+",
            unaryMinus: "-",
            bitNot: "~",
            not: "\\neg",
            multiply: "\\cdot",
            divide: "\\frac",
            dotMultiply: ".\\cdot",
            dotDivide: ".:",
            mod: "\\mod",
            add: "+",
            subtract: "-",
            to: "\\rightarrow",
            leftShift: "<<",
            rightArithShift: ">>",
            rightLogShift: ">>>",
            equal: "=",
            unequal: "\\neq",
            smaller: "<",
            larger: ">",
            smallerEq: "\\leq",
            largerEq: "\\geq",
            bitAnd: "\\&",
            bitXor: "\\underline{|}",
            bitOr: "|",
            and: "\\wedge",
            xor: "\\veebar",
            or: "\\vee"
        }, t.defaultTemplate = "\\mathrm{${name}}\\left(${args}\\right)";
        var r = {
            deg: "^\\circ"
        };
        t.toSymbol = function (e, n) {
            if (n = "undefined" != typeof n && n) return r.hasOwnProperty(e) ? r[e] : "\\mathrm{" + e + "}";
            if (t.symbols.hasOwnProperty(e)) return t.symbols[e];
            if (e.indexOf("_") !== -1) {
                var i = e.indexOf("_");
                return t.toSymbol(e.substring(0, i)) + "_{" + t.toSymbol(e.substring(i + 1)) + "}"
            }
            return e
        }
    }, function (e, t, n) {
        "use strict";
        t.clone = function e(n) {
            var r = typeof n;
            if ("number" === r || "string" === r || "boolean" === r || null === n || void 0 === n) return n;
            if ("function" == typeof n.clone) return n.clone();
            if (Array.isArray(n)) return n.map(function (t) {
                return e(t)
            });
            if (n instanceof Number) return new Number(n.valueOf());
            if (n instanceof String) return new String(n.valueOf());
            if (n instanceof Boolean) return new Boolean(n.valueOf());
            if (n instanceof Date) return new Date(n.valueOf());
            if (n && n.isBigNumber === !0) return n;
            if (n instanceof RegExp) throw new TypeError("Cannot clone " + n);
            return t.map(n, e)
        }, t.map = function (e, n) {
            var r = {};
            for (var i in e) t.hasOwnProperty(e, i) && (r[i] = n(e[i]));
            return r
        }, t.extend = function (e, n) {
            for (var r in n) t.hasOwnProperty(n, r) && (e[r] = n[r]);
            return e
        }, t.deepExtend = function e(n, r) {
            if (Array.isArray(r)) throw new TypeError("Arrays are not supported by deepExtend");
            for (var i in r)
                if (t.hasOwnProperty(r, i))
                    if (r[i] && r[i].constructor === Object) void 0 === n[i] && (n[i] = {}), n[i].constructor === Object ? e(n[i], r[i]) : n[i] = r[i];
                    else {
                        if (Array.isArray(r[i])) throw new TypeError("Arrays are not supported by deepExtend");
                        n[i] = r[i]
                    } return n
        }, t.deepEqual = function (e, n) {
            var r, i, o;
            if (Array.isArray(e)) {
                if (!Array.isArray(n)) return !1;
                if (e.length != n.length) return !1;
                for (i = 0, o = e.length; i < o; i++)
                    if (!t.deepEqual(e[i], n[i])) return !1;
                return !0
            }
            if (e instanceof Object) {
                if (Array.isArray(n) || !(n instanceof Object)) return !1;
                for (r in e)
                    if (!t.deepEqual(e[r], n[r])) return !1;
                for (r in n)
                    if (!t.deepEqual(e[r], n[r])) return !1;
                return !0
            }
            return typeof e == typeof n && e == n
        }, t.canDefineProperty = function () {
            try {
                if (Object.defineProperty) return Object.defineProperty({}, "x", {
                    get: function () {}
                }), !0
            } catch (e) {}
            return !1
        }, t.lazy = function (e, n, r) {
            if (t.canDefineProperty()) {
                var i, o = !0;
                Object.defineProperty(e, n, {
                    get: function () {
                        return o && (i = r(), o = !1), i
                    },
                    set: function (e) {
                        i = e, o = !1
                    },
                    configurable: !0,
                    enumerable: !0
                })
            } else e[n] = r()
        }, t.traverse = function (e, t) {
            var n = e;
            if (t)
                for (var r = t.split("."), i = 0; i < r.length; i++) {
                    var o = r[i];
                    o in n || (n[o] = {}), n = n[o]
                }
            return n
        }, t.hasOwnProperty = function (e, t) {
            return e && Object.hasOwnProperty.call(e, t)
        }, t.isFactory = function (e) {
            return e && "function" == typeof e.factory
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = e.DenseMatrix,
                a = function (e, t, n, a) {
                    var u, c = e._data,
                        l = e._size,
                        f = e._datatype,
                        h = n;
                    "string" == typeof f && (u = f, t = r.convert(t, u), h = r.find(n, [u, u]));
                    var p = l.length > 0 ? s(h, 0, l, l[0], c, t, a) : [];
                    return new o({
                        data: p,
                        size: i(l),
                        datatype: u
                    })
                },
                s = function (e, t, n, r, i, o, a) {
                    var u = [];
                    if (t === n.length - 1)
                        for (var c = 0; c < r; c++) u[c] = a ? e(o, i[c]) : e(i[c], o);
                    else
                        for (var l = 0; l < r; l++) u[l] = s(e, t + 1, n, n[t + 1], i[l], o, a);
                    return u
                };
            return a
        }
        var i = n(5).clone;
        t.name = "algorithm14", t.factory = r
    }, function (e, t, n) {
        function r() {
            function e(e, t) {
                if (void 0 !== n[e]) throw new Error('Cannot register type "' + e + '": already exists');
                n[e] = t
            }

            function t(e, t, r) {
                if (i(n, e.type)) {
                    var o = n[e.type];
                    return o(e, t, r)
                }
                if ("function" != typeof e._compile || i(e, "_compile")) throw new Error('Cannot compile node: unknown type "' + e.type + '"');
                return e._compile(t, r)
            }
            var n = {};
            return {
                register: e,
                compile: t
            }
        }
        var i = n(5).hasOwnProperty;
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = e.DenseMatrix,
                a = function (e, t, n) {
                    var a = e._data,
                        u = e._size,
                        c = e._datatype,
                        l = t._data,
                        f = t._size,
                        h = t._datatype,
                        p = [];
                    if (u.length !== f.length) throw new o(u.length, f.length);
                    for (var m = 0; m < u.length; m++) {
                        if (u[m] !== f[m]) throw new RangeError("Dimension mismatch. Matrix A (" + u + ") must match Matrix B (" + f + ")");
                        p[m] = u[m]
                    }
                    var d, v = n;
                    "string" == typeof c && c === h && (d = c, t = r.convert(t, d), v = r.find(n, [d, d]));
                    var g = p.length > 0 ? s(v, 0, p, p[0], a, l) : [];
                    return new i({
                        data: g,
                        size: p,
                        datatype: d
                    })
                },
                s = function (e, t, n, r, i, o) {
                    var a = [];
                    if (t === n.length - 1)
                        for (var u = 0; u < r; u++) a[u] = e(i[u], o[u]);
                    else
                        for (var c = 0; c < r; c++) a[c] = s(e, t + 1, n, n[t + 1], i[c], o[c]);
                    return a
                };
            return a
        }
        var i = n(25),
            o = n(9),
            a = i.string;
        a.isString, t.name = "algorithm13", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n) {
            if (!(this instanceof r)) throw new SyntaxError("Constructor must be called with the new operator");
            this.actual = e, this.expected = t, this.relation = n, this.message = "Dimension mismatch (" + (Array.isArray(e) ? "[" + e.join(", ") + "]" : e) + " " + (this.relation || "!=") + " " + (Array.isArray(t) ? "[" + t.join(", ") + "]" : t) + ")", this.stack = (new Error).stack
        }
        r.prototype = new RangeError, r.prototype.constructor = RangeError, r.prototype.name = "DimensionError", r.prototype.isDimensionError = !0, e.exports = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("equalScalar", {
                "boolean, boolean": function (e, t) {
                    return e === t
                },
                "number, number": function (e, n) {
                    return e === n || i(e, n, t.epsilon)
                },
                "BigNumber, BigNumber": function (e, n) {
                    return e.eq(n) || o(e, n, t.epsilon)
                },
                "Fraction, Fraction": function (e, t) {
                    return e.equals(t)
                },
                "Complex, Complex": function (e, t) {
                    return e.equals(t)
                },
                "Unit, Unit": function (e, t) {
                    if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                    return a(e.value, t.value)
                },
                "string, string": function (e, t) {
                    return e === t
                }
            });
            return a
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, n) {
            if (Array.isArray(e)) {
                for (var i = "[", o = e.length, a = 0; a < o; a++) 0 != a && (i += ", "), i += r(e[a], n);
                return i += "]"
            }
            return t.format(e, n)
        }
        var i = n(2).format,
            o = n(506).format;
        t.isString = function (e) {
            return "string" == typeof e
        }, t.endsWith = function (e, t) {
            var n = e.length - t.length,
                r = e.length;
            return e.substring(n, r) === t
        }, t.format = function (e, n) {
            if ("number" == typeof e) return i(e, n);
            if (e && e.isBigNumber === !0) return o(e, n);
            if (e && e.isFraction === !0) return n && "decimal" === n.fraction ? e.toString() : e.s * e.n + "/" + e.d;
            if (Array.isArray(e)) return r(e, n);
            if (t.isString(e)) return '"' + e + '"';
            if ("function" == typeof e) return e.syntax ? String(e.syntax) : "function";
            if (e && "object" == typeof e) {
                if ("function" == typeof e.format) return e.format(n);
                if (e && e.toString() !== {}.toString()) return e.toString();
                var a = [];
                for (var s in e) e.hasOwnProperty(s) && a.push('"' + s + '": ' + t.format(e[s], n));
                return "{" + a.join(", ") + "}"
            }
            return String(e)
        }, t.stringify = function (e) {
            for (var t = String(e), n = "", r = 0; r < t.length;) {
                var i = t.charAt(r);
                "\\" === i ? (n += i, r++, i = t.charAt(r), "" !== i && '"\\/bfnrtu'.indexOf(i) !== -1 || (n += "\\"), n += i) : n += '"' === i ? '\\"' : i, r++
            }
            return '"' + n + '"'
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = r(n(20)),
                l = r(n(22)),
                f = r(n(10)),
                h = r(n(15)),
                p = r(n(6)),
                m = e.DenseMatrix,
                d = e.SparseMatrix,
                v = a("multiply", i({
                    "Array, Array": function (e, t) {
                        g(o.size(e), o.size(t));
                        var n = v(u(e), u(t));
                        return n && n.isMatrix === !0 ? n.valueOf() : n
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n = e.size(),
                            r = t.size();
                        return g(n, r), 1 === n.length ? 1 === r.length ? y(e, t, n[0]) : w(e, t) : 1 === r.length ? b(e, t) : C(e, t)
                    },
                    "Matrix, Array": function (e, t) {
                        return v(e, u(t))
                    },
                    "Array, Matrix": function (e, t) {
                        return v(u(e, t.storage()), t)
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = h(e, t, l, !1);
                                break;
                            case "dense":
                                n = p(e, t, l, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = h(t, e, l, !0);
                                break;
                            case "dense":
                                n = p(t, e, l, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return p(u(e), t, l, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return p(u(t), e, l, !0).valueOf()
                    },
                    "any, any": l,
                    "any, any, ...any": function (e, t, n) {
                        for (var r = v(e, t), i = 0; i < n.length; i++) r = v(r, n[i]);
                        return r
                    }
                }, l.signatures)),
                g = function (e, t) {
                    switch (e.length) {
                        case 1:
                            switch (t.length) {
                                case 1:
                                    if (e[0] !== t[0]) throw new RangeError("Dimension mismatch in multiplication. Vectors must have the same length");
                                    break;
                                case 2:
                                    if (e[0] !== t[0]) throw new RangeError("Dimension mismatch in multiplication. Vector length (" + e[0] + ") must match Matrix rows (" + t[0] + ")");
                                    break;
                                default:
                                    throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + t.length + " dimensions)")
                            }
                            break;
                        case 2:
                            switch (t.length) {
                                case 1:
                                    if (e[1] !== t[0]) throw new RangeError("Dimension mismatch in multiplication. Matrix columns (" + e[1] + ") must match Vector length (" + t[0] + ")");
                                    break;
                                case 2:
                                    if (e[1] !== t[0]) throw new RangeError("Dimension mismatch in multiplication. Matrix A columns (" + e[1] + ") must match Matrix B rows (" + t[0] + ")");
                                    break;
                                default:
                                    throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + t.length + " dimensions)")
                            }
                            break;
                        default:
                            throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix A has " + e.length + " dimensions)")
                    }
                },
                y = function (e, t, n) {
                    if (0 === n) throw new Error("Cannot multiply two empty vectors");
                    var r, i = e._data,
                        o = e._datatype,
                        s = t._data,
                        u = t._datatype,
                        f = c,
                        h = l;
                    o && u && o === u && "string" == typeof o && (r = o, f = a.find(c, [r, r]), h = a.find(l, [r, r]));
                    for (var p = h(i[0], s[0]), m = 1; m < n; m++) p = f(p, h(i[m], s[m]));
                    return p
                },
                w = function (e, t) {
                    switch (t.storage()) {
                        case "dense":
                            return x(e, t)
                    }
                    throw new Error("Not implemented")
                },
                x = function (e, t) {
                    var n, r = e._data,
                        i = e._size,
                        o = e._datatype,
                        s = t._data,
                        u = t._size,
                        f = t._datatype,
                        h = i[0],
                        p = u[1],
                        d = c,
                        v = l;
                    o && f && o === f && "string" == typeof o && (n = o, d = a.find(c, [n, n]), v = a.find(l, [n, n]));
                    for (var g = [], y = 0; y < p; y++) {
                        for (var w = v(r[0], s[0][y]), x = 1; x < h; x++) w = d(w, v(r[x], s[x][y]));
                        g[y] = w
                    }
                    return new m({
                        data: g,
                        size: [p],
                        datatype: n
                    })
                },
                b = function (e, t) {
                    switch (e.storage()) {
                        case "dense":
                            return M(e, t);
                        case "sparse":
                            return E(e, t)
                    }
                },
                C = function (e, t) {
                    switch (e.storage()) {
                        case "dense":
                            switch (t.storage()) {
                                case "dense":
                                    return T(e, t);
                                case "sparse":
                                    return N(e, t)
                            }
                            break;
                        case "sparse":
                            switch (t.storage()) {
                                case "dense":
                                    return A(e, t);
                                case "sparse":
                                    return S(e, t)
                            }
                    }
                },
                M = function (e, t) {
                    var n, r = e._data,
                        i = e._size,
                        o = e._datatype,
                        s = t._data,
                        u = t._datatype,
                        f = i[0],
                        h = i[1],
                        p = c,
                        d = l;
                    o && u && o === u && "string" == typeof o && (n = o, p = a.find(c, [n, n]), d = a.find(l, [n, n]));
                    for (var v = [], g = 0; g < f; g++) {
                        for (var y = r[g], w = d(y[0], s[0]), x = 1; x < h; x++) w = p(w, d(y[x], s[x]));
                        v[g] = w
                    }
                    return new m({
                        data: v,
                        size: [f],
                        datatype: n
                    })
                },
                T = function (e, t) {
                    var n, r = e._data,
                        i = e._size,
                        o = e._datatype,
                        s = t._data,
                        u = t._size,
                        f = t._datatype,
                        h = i[0],
                        p = i[1],
                        d = u[1],
                        v = c,
                        g = l;
                    o && f && o === f && "string" == typeof o && (n = o, v = a.find(c, [n, n]), g = a.find(l, [n, n]));
                    for (var y = [], w = 0; w < h; w++) {
                        var x = r[w];
                        y[w] = [];
                        for (var b = 0; b < d; b++) {
                            for (var C = g(x[0], s[0][b]), M = 1; M < p; M++) C = v(C, g(x[M], s[M][b]));
                            y[w][b] = C
                        }
                    }
                    return new m({
                        data: y,
                        size: [h, d],
                        datatype: n
                    })
                },
                N = function (e, t) {
                    var n = e._data,
                        r = e._size,
                        i = e._datatype,
                        o = t._values,
                        s = t._index,
                        u = t._ptr,
                        h = t._size,
                        p = t._datatype;
                    if (!o) throw new Error("Cannot multiply Dense Matrix times Pattern only Matrix");
                    var m, v = r[0],
                        g = h[1],
                        y = c,
                        w = l,
                        x = f,
                        b = 0;
                    i && p && i === p && "string" == typeof i && (m = i, y = a.find(c, [m, m]), w = a.find(l, [m, m]), x = a.find(f, [m, m]), b = a.convert(0, m));
                    for (var C = [], M = [], T = [], N = new d({
                            values: C,
                            index: M,
                            ptr: T,
                            size: [v, g],
                            datatype: m
                        }), E = 0; E < g; E++) {
                        T[E] = M.length;
                        var A = u[E],
                            S = u[E + 1];
                        if (S > A)
                            for (var P = 0, O = 0; O < v; O++) {
                                for (var _, I = O + 1, B = A; B < S; B++) {
                                    var k = s[B];
                                    P !== I ? (_ = w(n[O][k], o[B]), P = I) : _ = y(_, w(n[O][k], o[B]))
                                }
                                P !== I || x(_, b) || (M.push(O), C.push(_))
                            }
                    }
                    return T[g] = M.length, N
                },
                E = function (e, t) {
                    var n = e._values,
                        r = e._index,
                        i = e._ptr,
                        o = e._datatype;
                    if (!n) throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
                    var s, u = t._data,
                        h = t._datatype,
                        p = e._size[0],
                        m = t._size[0],
                        v = [],
                        g = [],
                        y = [],
                        w = c,
                        x = l,
                        b = f,
                        C = 0;
                    o && h && o === h && "string" == typeof o && (s = o, w = a.find(c, [s, s]), x = a.find(l, [s, s]), b = a.find(f, [s, s]), C = a.convert(0, s));
                    var M = [],
                        T = [];
                    y[0] = 0;
                    for (var N = 0; N < m; N++) {
                        var E = u[N];
                        if (!b(E, C))
                            for (var A = i[N], S = i[N + 1], P = A; P < S; P++) {
                                var O = r[P];
                                T[O] ? M[O] = w(M[O], x(E, n[P])) : (T[O] = !0, g.push(O), M[O] = x(E, n[P]))
                            }
                    }
                    for (var _ = g.length, I = 0; I < _; I++) {
                        var B = g[I];
                        v[I] = M[B]
                    }
                    return y[1] = g.length, new d({
                        values: v,
                        index: g,
                        ptr: y,
                        size: [p, 1],
                        datatype: s
                    })
                },
                A = function (e, t) {
                    var n = e._values,
                        r = e._index,
                        i = e._ptr,
                        o = e._datatype;
                    if (!n) throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
                    var s, u = t._data,
                        h = t._datatype,
                        p = e._size[0],
                        m = t._size[0],
                        v = t._size[1],
                        g = c,
                        y = l,
                        w = f,
                        x = 0;
                    o && h && o === h && "string" == typeof o && (s = o, g = a.find(c, [s, s]), y = a.find(l, [s, s]), w = a.find(f, [s, s]), x = a.convert(0, s));
                    for (var b = [], C = [], M = [], T = new d({
                            values: b,
                            index: C,
                            ptr: M,
                            size: [p, v],
                            datatype: s
                        }), N = [], E = [], A = 0; A < v; A++) {
                        M[A] = C.length;
                        for (var S = A + 1, P = 0; P < m; P++) {
                            var O = u[P][A];
                            if (!w(O, x))
                                for (var _ = i[P], I = i[P + 1], B = _; B < I; B++) {
                                    var k = r[B];
                                    E[k] !== S ? (E[k] = S, C.push(k), N[k] = y(O, n[B])) : N[k] = g(N[k], y(O, n[B]))
                                }
                        }
                        for (var V = M[A], z = C.length, F = V; F < z; F++) {
                            var D = C[F];
                            b[F] = N[D]
                        }
                    }
                    return M[v] = C.length, T
                },
                S = function (e, t) {
                    var n, r = e._values,
                        i = e._index,
                        o = e._ptr,
                        s = e._datatype,
                        u = t._values,
                        f = t._index,
                        h = t._ptr,
                        p = t._datatype,
                        m = e._size[0],
                        v = t._size[1],
                        g = r && u,
                        y = c,
                        w = l;
                    s && p && s === p && "string" == typeof s && (n = s, y = a.find(c, [n, n]), w = a.find(l, [n, n]));
                    for (var x, b, C, M, T, N, E, A, S = g ? [] : void 0, P = [], O = [], _ = new d({
                            values: S,
                            index: P,
                            ptr: O,
                            size: [m, v],
                            datatype: n
                        }), I = g ? [] : void 0, B = [], k = 0; k < v; k++) {
                        O[k] = P.length;
                        var V = k + 1;
                        for (T = h[k], N = h[k + 1], M = T; M < N; M++)
                            if (A = f[M], g)
                                for (b = o[A], C = o[A + 1], x = b; x < C; x++) E = i[x], B[E] !== V ? (B[E] = V, P.push(E), I[E] = w(u[M], r[x])) : I[E] = y(I[E], w(u[M], r[x]));
                            else
                                for (b = o[A], C = o[A + 1], x = b; x < C; x++) E = i[x], B[E] !== V && (B[E] = V, P.push(E));
                        if (g)
                            for (var z = O[k], F = P.length, D = z; D < F; D++) {
                                var R = P[D];
                                S[D] = I[R]
                            }
                    }
                    return O[v] = P.length, _
                };
            return v.toTex = {
                2: "\\left(${args[0]}" + s.operators.multiply + "${args[1]}\\right)"
            }, v
        }
        var i = n(5).extend,
            o = n(3);
        t.name = "multiply", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s, u) {
            function c() {
                if (!(this instanceof c)) throw new SyntaxError("Constructor must be called with the new operator")
            }

            function l(e) {
                for (var t in e)
                    if (a(e, t) && t in i) throw new Error('Scope contains an illegal symbol, "' + t + '" is a reserved keyword')
            }
            var f = r(n(7)).compile;
            return c.prototype.eval = function (e) {
                return this.compile().eval(e)
            }, c.prototype.type = "Node", c.prototype.isNode = !0, c.prototype.comment = "", c.prototype.compile = function () {
                if (arguments.length > 0) throw new Error("Calling compile(math) is deprecated. Call the function as compile() instead.");
                var e = {
                        math: u.expression.mathWithTransform,
                        args: {},
                        _validateScope: l
                    },
                    t = {},
                    n = f(this, e, t),
                    r = Object.keys(e).map(function (e) {
                        return "    var " + e + ' = defs["' + e + '"];'
                    }),
                    i = r.join(" ") + 'return {  "eval": function (scope) {    if (scope) _validateScope(scope);    scope = scope || {};    return ' + n + ";  }};",
                    o = new Function("defs", i);
                return o(e)
            }, c.prototype.forEach = function (e) {
                throw new Error("Cannot run forEach on a Node interface")
            }, c.prototype.map = function (e) {
                throw new Error("Cannot run map on a Node interface")
            }, c.prototype._ifNode = function (e) {
                if (!e || !e.isNode) throw new TypeError("Callback function must return a Node");
                return e
            }, c.prototype.traverse = function (e) {
                function t(e, n) {
                    e.forEach(function (e, r, i) {
                        n(e, r, i), t(e, n)
                    })
                }
                e(this, null, null), t(this, e)
            }, c.prototype.transform = function (e) {
                function t(e, n) {
                    return e.map(function (e, r, i) {
                        var o = n(e, r, i);
                        return t(o, n)
                    })
                }
                var n = e(this, null, null);
                return t(n, e)
            }, c.prototype.filter = function (e) {
                var t = [];
                return this.traverse(function (n, r, i) {
                    e(n, r, i) && t.push(n)
                }), t
            }, c.prototype.find = function () {
                throw new Error("Function Node.find is deprecated. Use Node.filter instead.")
            }, c.prototype.match = function () {
                throw new Error("Function Node.match is deprecated. See functions Node.filter, Node.transform, Node.traverse.")
            }, c.prototype.clone = function () {
                throw new Error("Cannot clone a Node interface")
            }, c.prototype.cloneDeep = function () {
                return this.map(function (e) {
                    return e.cloneDeep()
                })
            }, c.prototype.equals = function (e) {
                return !!e && o(this, e)
            }, c.prototype.toString = function (e) {
                var t;
                if (e && "object" == typeof e) switch (typeof e.handler) {
                    case "object":
                    case "undefined":
                        break;
                    case "function":
                        t = e.handler(this, e);
                        break;
                    default:
                        throw new TypeError("Object or function expected as callback")
                }
                return "undefined" != typeof t ? t : this._toString(e)
            }, c.prototype._toString = function () {
                throw new Error("_toString not implemented for " + this.type)
            }, c.prototype.toTex = function (e) {
                var t;
                if (e && "object" == typeof e) switch (typeof e.handler) {
                    case "object":
                    case "undefined":
                        break;
                    case "function":
                        t = e.handler(this, e);
                        break;
                    default:
                        throw new TypeError("Object or function expected as callback")
                }
                return "undefined" != typeof t ? t : this._toTex(e)
            }, c.prototype._toTex = function (e) {
                throw new Error("_toTex not implemented for " + this.type)
            }, c.prototype.getIdentifier = function () {
                return this.type
            }, c.prototype.getContent = function () {
                return this
            }, c
        }
        var i = n(64),
            o = n(5).deepEqual,
            a = n(5).hasOwnProperty;
        t.name = "Node", t.path = "expression.node", t.math = !0, t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = e.DenseMatrix,
                a = function (e, t, n, a) {
                    var s = e._data,
                        u = e._size,
                        c = e._datatype,
                        l = t._values,
                        f = t._index,
                        h = t._ptr,
                        p = t._size,
                        m = t._datatype;
                    if (u.length !== p.length) throw new i(u.length, p.length);
                    if (u[0] !== p[0] || u[1] !== p[1]) throw new RangeError("Dimension mismatch. Matrix A (" + u + ") must match Matrix B (" + p + ")");
                    if (!l) throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
                    var d, v = u[0],
                        g = u[1],
                        y = 0,
                        w = n;
                    "string" == typeof c && c === m && (d = c, y = r.convert(0, d), w = r.find(n, [d, d]));
                    for (var x = [], b = 0; b < v; b++) x[b] = [];
                    for (var C = [], M = [], T = 0; T < g; T++) {
                        for (var N = T + 1, E = h[T], A = h[T + 1], S = E; S < A; S++) {
                            var P = f[S];
                            C[P] = a ? w(l[S], s[P][T]) : w(s[P][T], l[S]), M[P] = N
                        }
                        for (var O = 0; O < v; O++) M[O] === N ? x[O][T] = C[O] : x[O][T] = a ? w(y, s[O][T]) : w(s[O][T], y)
                    }
                    return new o({
                        data: x,
                        size: [v, g],
                        datatype: d
                    })
                };
            return a
        }
        var i = n(9);
        t.name = "algorithm03", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(10)),
                a = e.SparseMatrix,
                s = function (e, t, n, r) {
                    var s = e._values,
                        u = e._index,
                        c = e._ptr,
                        l = e._size,
                        f = e._datatype;
                    if (!s) throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
                    var h, p = l[0],
                        m = l[1],
                        d = o,
                        v = 0,
                        g = n;
                    "string" == typeof f && (h = f, d = i.find(o, [h, h]), v = i.convert(0, h), t = i.convert(t, h), g = i.find(n, [h, h]));
                    for (var y = [], w = [], x = [], b = new a({
                            values: y,
                            index: w,
                            ptr: x,
                            size: [p, m],
                            datatype: h
                        }), C = 0; C < m; C++) {
                        x[C] = w.length;
                        for (var M = c[C], T = c[C + 1], N = M; N < T; N++) {
                            var E = u[N],
                                A = r ? g(t, s[N]) : g(s[N], t);
                            d(A, v) || (w.push(E), y.push(A))
                        }
                    }
                    return x[m] = w.length, b
                };
            return s
        }
        t.name = "algorithm11", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = e.DenseMatrix,
                o = function (e, t, n, o) {
                    var a = e._values,
                        s = e._index,
                        u = e._ptr,
                        c = e._size,
                        l = e._datatype;
                    if (!a) throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
                    var f, h = c[0],
                        p = c[1],
                        m = n;
                    "string" == typeof l && (f = l, t = r.convert(t, f), m = r.find(n, [f, f]));
                    for (var d = [], v = new i({
                            data: d,
                            size: [h, p],
                            datatype: f
                        }), g = [], y = [], w = 0; w < p; w++) {
                        for (var x = w + 1, b = u[w], C = u[w + 1], M = b; M < C; M++) {
                            var T = s[M];
                            g[T] = a[M], y[T] = x
                        }
                        for (var N = 0; N < h; N++) 0 === w && (d[N] = []), y[N] === x ? d[N][w] = o ? m(t, g[N]) : m(g[N], t) : d[N][w] = o ? m(t, 0) : m(0, t)
                    }
                    return v
                };
            return o
        }
        t.name = "algorithm12", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t) {
            if (u(e)) {
                if (c(e, t)) return e[t];
                if (!(t in e)) return
            }
            if ("function" == typeof e[t] && s(e, t)) throw new Error('Cannot access method "' + t + '" as a property');
            throw new Error('No access to property "' + t + '"')
        }

        function i(e, t, n) {
            if (u(e)) {
                if (!(t in e)) return e[t] = n;
                if (c(e, t)) return e[t] = n
            }
            throw new Error('No access to property "' + t + '"')
        }

        function o(e) {
            return !(e in {})
        }

        function a(e, t) {
            if (!s(e, t)) throw new Error('No access to method "' + t + '"')
        }

        function s(e, t) {
            return c(e, t) ? u(e) : e && "function" != typeof e && (c(e.constructor.prototype, t) || c(e.__proto__, t)) && (!c(Object.prototype, t) || c(l, t))
        }

        function u(e) {
            return "object" == typeof e && e && e.constructor === Object
        }
        var c = n(5).hasOwnProperty,
            l = {
                toString: !0,
                valueOf: !0,
                toLocaleString: !0
            };
        t.getSafeProperty = r, t.setSafeProperty = i, t.isSafeProperty = o, t.validateSafeMethod = a, t.isSafeMethod = s, t.isPlainObject = u
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(0)),
                s = r(n(20)),
                u = n(4),
                c = r(n(29)),
                l = r(n(76)),
                f = r(n(34)),
                h = r(n(8)),
                p = r(n(6)),
                m = o("add", i({
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, s);
                                        break;
                                    default:
                                        n = c(t, e, s, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, s, !1);
                                        break;
                                    default:
                                        n = h(e, t, s)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(a(e), a(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(a(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, a(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, s, !1);
                                break;
                            default:
                                n = p(e, t, s, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = f(t, e, s, !0);
                                break;
                            default:
                                n = p(t, e, s, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return p(a(e), t, s, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return p(a(t), e, s, !0).valueOf()
                    },
                    "any, any": s,
                    "any, any, ...any": function (e, t, n) {
                        for (var r = m(e, t), i = 0; i < n.length; i++) r = m(r, n[i]);
                        return r
                    }
                }, s.signatures));
            return m.toTex = {
                2: "\\left(${args[0]}" + u.operators.add + "${args[1]}\\right)"
            }, m
        }
        var i = n(5).extend;
        t.name = "add", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(22)),
                a = i("divide", {
                    "number, number": function (e, t) {
                        return e / t
                    },
                    "Complex, Complex": function (e, t) {
                        return e.div(t)
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        return e.div(t)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return e.div(t)
                    },
                    "Unit, number | Fraction | BigNumber": function (e, t) {
                        var n = e.clone();
                        return n.value = a(null === n.value ? n._normalize(1) : n.value, t), n
                    },
                    "number | Fraction | BigNumber, Unit": function (e, t) {
                        var n = t.pow(-1);
                        return n.value = o(null === n.value ? n._normalize(1) : n.value, e), n
                    },
                    "Unit, Unit": function (e, t) {
                        return e.divide(t)
                    }
                });
            return a
        }
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = r("add", {
                "number, number": function (e, t) {
                    return e + t
                },
                "Complex, Complex": function (e, t) {
                    return e.add(t)
                },
                "BigNumber, BigNumber": function (e, t) {
                    return e.plus(t)
                },
                "Fraction, Fraction": function (e, t) {
                    return e.add(t)
                },
                "Unit, Unit": function (e, t) {
                    if (null == e.value) throw new Error("Parameter x contains a unit with undefined value");
                    if (null == t.value) throw new Error("Parameter y contains a unit with undefined value");
                    if (!e.equalBase(t)) throw new Error("Units do not match");
                    var n = e.clone();
                    return n.value = i(n.value, t.value), n.fixPrefix = !1, n
                }
            });
            return i
        }
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = n(4),
                s = r(n(0)),
                u = r(n(20)),
                c = r(n(32)),
                l = r(n(29)),
                f = r(n(14)),
                h = r(n(59)),
                p = r(n(34)),
                m = r(n(8)),
                d = r(n(6)),
                v = o("subtract", {
                    "number, number": function (e, t) {
                        return e - t
                    },
                    "Complex, Complex": function (e, t) {
                        return e.sub(t)
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        return e.minus(t)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return e.sub(t)
                    },
                    "Unit, Unit": function (e, t) {
                        if (null == e.value) throw new Error("Parameter x contains a unit with undefined value");
                        if (null == t.value) throw new Error("Parameter y contains a unit with undefined value");
                        if (!e.equalBase(t)) throw new Error("Units do not match");
                        var n = e.clone();
                        return n.value = v(n.value, t.value), n.fixPrefix = !1, n
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n = e.size(),
                            r = t.size();
                        if (n.length !== r.length) throw new i(n.length, r.length);
                        var o;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        o = h(e, t, v);
                                        break;
                                    default:
                                        o = f(t, e, v, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        o = l(e, t, v, !1);
                                        break;
                                    default:
                                        o = m(e, t, v)
                                }
                        }
                        return o
                    },
                    "Array, Array": function (e, t) {
                        return v(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return v(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return v(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = p(e, c(t), u);
                                break;
                            default:
                                n = d(e, t, v)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = p(t, e, v, !0);
                                break;
                            default:
                                n = d(t, e, v, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return d(s(e), t, v, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return d(s(t), e, v, !0).valueOf()
                    }
                });
            return v.toTex = {
                2: "\\left(${args[0]}" + a.operators.subtract + "${args[1]}\\right)"
            }, v
        }
        var i = n(9);
        t.name = "subtract", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = r("multiplyScalar", {
                "number, number": function (e, t) {
                    return e * t
                },
                "Complex, Complex": function (e, t) {
                    return e.mul(t)
                },
                "BigNumber, BigNumber": function (e, t) {
                    return e.times(t)
                },
                "Fraction, Fraction": function (e, t) {
                    return e.mul(t)
                },
                "number | Fraction | BigNumber | Complex, Unit": function (e, t) {
                    var n = t.clone();
                    return n.value = null === n.value ? n._normalize(e) : i(n.value, e), n
                },
                "Unit, number | Fraction | BigNumber | Complex": function (e, t) {
                    var n = e.clone();
                    return n.value = null === n.value ? n._normalize(t) : i(n.value, t), n
                },
                "Unit, Unit": function (e, t) {
                    return e.multiply(t)
                }
            });
            return i
        }
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(10)),
                s = e.SparseMatrix,
                u = function (e, t, n, r) {
                    var u = e._data,
                        c = e._size,
                        l = e._datatype,
                        f = t._values,
                        h = t._index,
                        p = t._ptr,
                        m = t._size,
                        d = t._datatype;
                    if (c.length !== m.length) throw new i(c.length, m.length);
                    if (c[0] !== m[0] || c[1] !== m[1]) throw new RangeError("Dimension mismatch. Matrix A (" + c + ") must match Matrix B (" + m + ")");
                    if (!f) throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
                    var v, g = c[0],
                        y = c[1],
                        w = a,
                        x = 0,
                        b = n;
                    "string" == typeof l && l === d && (v = l, w = o.find(a, [v, v]), x = o.convert(0, v), b = o.find(n, [v, v]));
                    for (var C = [], M = [], T = [], N = 0; N < y; N++) {
                        T[N] = M.length;
                        for (var E = p[N], A = p[N + 1], S = E; S < A; S++) {
                            var P = h[S],
                                O = r ? b(f[S], u[P][N]) : b(u[P][N], f[S]);
                            w(O, x) || (M.push(P), C.push(O))
                        }
                    }
                    return T[y] = M.length, new s({
                        values: C,
                        index: M,
                        ptr: T,
                        size: [g, y],
                        datatype: v
                    })
                };
            return u
        }
        var i = n(9);
        t.name = "algorithm02", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = e.DenseMatrix,
                a = function (e, t, n) {
                    var a = e._size,
                        u = e._datatype,
                        c = t._size,
                        l = t._datatype;
                    if (a.length !== c.length) throw new i(a.length, c.length);
                    if (a[0] !== c[0] || a[1] !== c[1]) throw new RangeError("Dimension mismatch. Matrix A (" + a + ") must match Matrix B (" + c + ")");
                    var f, h = a[0],
                        p = a[1],
                        m = 0,
                        d = n;
                    "string" == typeof u && u === l && (f = u, m = r.convert(0, f), d = r.find(n, [f, f]));
                    var v, g, y = [];
                    for (v = 0; v < h; v++) y[v] = [];
                    var w = new o({
                            data: y,
                            size: [h, p],
                            datatype: f
                        }),
                        x = [],
                        b = [],
                        C = [],
                        M = [];
                    for (g = 0; g < p; g++) {
                        var T = g + 1;
                        for (s(e, g, C, x, T), s(t, g, M, b, T), v = 0; v < h; v++) {
                            var N = C[v] === T ? x[v] : m,
                                E = M[v] === T ? b[v] : m;
                            y[v][g] = d(N, E)
                        }
                    }
                    return w
                },
                s = function (e, t, n, r, i) {
                    for (var o = e._values, a = e._index, s = e._ptr, u = s[t], c = s[t + 1]; u < c; u++) {
                        var l = a[u];
                        n[l] = i, r[l] = o[u]
                    }
                };
            return a
        }
        var i = n(9);
        t.name = "algorithm07", t.factory = r
    }, function (e, t, n) {
        "use strict";
        t.array = n(3), t.boolean = n(509), t.function = n(37), t.number = n(2), t.object = n(5), t.string = n(11), t.types = n(63), t.emitter = n(139)
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("abs", {
                number: Math.abs,
                Complex: function (e) {
                    return e.abs()
                },
                BigNumber: function (e) {
                    return e.abs()
                },
                Fraction: function (e) {
                    return e.abs()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                },
                Unit: function (e) {
                    return e.abs()
                }
            });
            return o.toTex = {
                1: "\\left|${args[0]}\\right|"
            }, o
        }
        var i = n(1);
        t.name = "abs", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, u, c) {
            function l(e) {
                if (!(this instanceof l)) throw new SyntaxError("Constructor must be called with the new operator");
                if ("string" != typeof e) throw new TypeError('String expected for parameter "name"');
                this.name = e
            }

            function f(e, t, n) {
                if (!(e instanceof l)) throw new TypeError("No valid SymbolNode");
                t.undef = h, t.Unit = d, t.getSafeProperty = s, t.hasOwnProperty = a;
                var r = o(e.name);
                return a(n, e.name) ? n[e.name] : e.name in t.math ? "(" + r + " in scope ? getSafeProperty(scope, " + r + ") : getSafeProperty(math, " + r + "))" : "(" + r + " in scope ? getSafeProperty(scope, " + r + ") : " + (d.isValuelessUnit(e.name) ? "new Unit(null, " + r + ")" : "undef(" + r + ")") + ")"
            }

            function h(e) {
                throw new Error("Undefined symbol " + e)
            }
            var p = r(n(7)).register,
                m = (r(n(7)).compile, r(n(13))),
                d = r(n(137));
            return l.prototype = new m, l.prototype.type = "SymbolNode", l.prototype.isSymbolNode = !0, p(l.prototype.type, f), l.prototype.forEach = function (e) {}, l.prototype.map = function (e) {
                return this.clone()
            }, l.prototype.clone = function () {
                return new l(this.name)
            }, l.prototype._toString = function (e) {
                return this.name
            }, l.prototype._toTex = function (e) {
                var t = !1;
                "undefined" == typeof c[this.name] && d.isValuelessUnit(this.name) && (t = !0);
                var n = i.toSymbol(this.name, t);
                return "\\" === n[0] ? n : " " + n
            }, l
        }
        var i = n(4),
            o = n(11).stringify,
            a = n(5).hasOwnProperty,
            s = n(17).getSafeProperty;
        t.name = "SymbolNode", t.path = "expression.node", t.math = !0, t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(14)),
                c = r(n(24)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = n(4),
                m = a("larger", {
                    "boolean, boolean": function (e, t) {
                        return e > t
                    },
                    "number, number": function (e, n) {
                        return e > n && !i(e, n, t.epsilon)
                    },
                    "BigNumber, BigNumber": function (e, n) {
                        return e.gt(n) && !o(e, n, t.epsilon)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return 1 === e.compare(t)
                    },
                    "Complex, Complex": function () {
                        throw new TypeError("No ordering relation is defined for complex numbers")
                    },
                    "Unit, Unit": function (e, t) {
                        if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                        return m(e.value, t.value)
                    },
                    "string, string": function (e, t) {
                        return e > t
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m);
                                        break;
                                    default:
                                        n = u(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, m, !1);
                                        break;
                                    default:
                                        n = f(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, m, !1);
                                break;
                            default:
                                n = h(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, m, !0);
                                break;
                            default:
                                n = h(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(s(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(s(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + p.operators.larger + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.name = "larger", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = e.DenseMatrix,
                a = function (e, t, n, a) {
                    var s = e._data,
                        u = e._size,
                        c = e._datatype,
                        l = t._values,
                        f = t._index,
                        h = t._ptr,
                        p = t._size,
                        m = t._datatype;
                    if (u.length !== p.length) throw new i(u.length, p.length);
                    if (u[0] !== p[0] || u[1] !== p[1]) throw new RangeError("Dimension mismatch. Matrix A (" + u + ") must match Matrix B (" + p + ")");
                    if (!l) throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
                    var d, v, g = u[0],
                        y = u[1],
                        w = "string" == typeof c && c === m ? c : void 0,
                        x = w ? r.find(n, [w, w]) : n,
                        b = [];
                    for (d = 0; d < g; d++) b[d] = [];
                    var C = [],
                        M = [];
                    for (v = 0; v < y; v++) {
                        for (var T = v + 1, N = h[v], E = h[v + 1], A = N; A < E; A++) d = f[A], C[d] = a ? x(l[A], s[d][v]) : x(s[d][v], l[A]), M[d] = T;
                        for (d = 0; d < g; d++) M[d] === T ? b[d][v] = C[d] : b[d][v] = s[d][v]
                    }
                    return new o({
                        data: b,
                        size: [g, y],
                        datatype: w
                    })
                };
            return a
        }
        var i = n(9);
        t.name = "algorithm01", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(t, n) {
                if (1 != arguments.length && 2 != arguments.length) throw new i("parse", arguments.length, 1, 2);
                if (pe = n && n.nodes ? n.nodes : {}, "string" == typeof t) return me = t, g();
                if (Array.isArray(t) || t instanceof e.Matrix) return o(t, function (e) {
                    if ("string" != typeof e) throw new TypeError("String expected");
                    return me = e, g()
                });
                throw new TypeError("String or matrix expected")
            }

            function u() {
                ve = 0, ge = me.charAt(0), xe = 0, be = null
            }

            function c() {
                ve++, ge = me.charAt(ve)
            }

            function l() {
                return me.charAt(ve - 1)
            }

            function f() {
                return me.charAt(ve + 1)
            }

            function h() {
                return me.charAt(ve + 2)
            }

            function p() {
                for (we = le.NULL, ye = "", de = ""; s.isWhitespace(ge, xe);) c();
                if ("#" == ge)
                    for (;
                        "\n" != ge && "" != ge;) de += ge, c();
                if ("" == ge) return void(we = le.DELIMITER);
                if ("\n" == ge && !xe) return we = le.DELIMITER, ye = ge, void c();
                var e = ge + f(),
                    t = e + h();
                if (3 == t.length && fe[t]) return we = le.DELIMITER, ye = t, c(), c(), void c();
                if (2 == e.length && fe[e]) return we = le.DELIMITER, ye = e, c(), void c();
                if (fe[ge]) return we = le.DELIMITER, ye = ge, void c();
                if (!s.isDigitDot(ge)) {
                    if (s.isAlpha(ge, l(), f())) {
                        for (; s.isAlpha(ge, l(), f()) || s.isDigit(ge);) ye += ge, c();
                        return void(we = he.hasOwnProperty(ye) ? le.DELIMITER : le.SYMBOL)
                    }
                    for (we = le.UNKNOWN;
                        "" != ge;) ye += ge, c();
                    throw Z('Syntax error in part "' + ye + '"')
                }
                if (we = le.NUMBER, "." == ge) ye += ge, c(), s.isDigit(ge) || (we = le.DELIMITER);
                else {
                    for (; s.isDigit(ge);) ye += ge, c();
                    s.isDecimalMark(ge, f()) && (ye += ge, c())
                }
                for (; s.isDigit(ge);) ye += ge, c();
                if (e = f(), "E" == ge || "e" == ge)
                    if (s.isDigit(e) || "-" == e || "+" == e) {
                        if (ye += ge, c(), "+" != ge && "-" != ge || (ye += ge, c()), !s.isDigit(ge)) throw Z('Digit expected, got "' + ge + '"');
                        for (; s.isDigit(ge);) ye += ge, c();
                        if (s.isDecimalMark(ge, f())) throw Z('Digit expected, got "' + ge + '"')
                    } else if ("." == e) throw c(), Z('Digit expected, got "' + ge + '"')
            }

            function m() {
                do p(); while ("\n" == ye)
            }

            function d() {
                xe++
            }

            function v() {
                xe--
            }

            function g() {
                u(), p();
                var e = y();
                if ("" != ye) throw we == le.DELIMITER ? Y("Unexpected operator " + ye) : Z('Unexpected part "' + ye + '"');
                return e
            }

            function y() {
                var e, t, n = [];
                for ("" != ye && "\n" != ye && ";" != ye && (e = w(), e.comment = de);
                    "\n" == ye || ";" == ye;) 0 == n.length && e && (t = ";" != ye, n.push({
                    node: e,
                    visible: t
                })), p(), "\n" != ye && ";" != ye && "" != ye && (e = w(), e.comment = de, t = ";" != ye, n.push({
                    node: e,
                    visible: t
                }));
                return n.length > 0 ? new K(n) : (e || (e = new te("undefined", "undefined"), e.comment = de), e)
            }

            function w() {
                var e, t, n, r, i = x();
                if ("=" == ye) {
                    if (i && i.isSymbolNode) return e = i.name, m(), n = w(), new Q(new ce(e), n);
                    if (i && i.isAccessorNode) return m(), n = w(), new Q(i.object, i.index, n);
                    if (i && i.isFunctionNode && (r = !0, t = [], e = i.name, i.args.forEach(function (e, n) {
                            e && e.isSymbolNode ? t[n] = e.name : r = !1
                        }), r)) return m(), n = w(), new ne(e, t, n);
                    throw Z("Invalid left hand side of assignment operator =")
                }
                return i
            }

            function x() {
                for (var e = b();
                    "?" == ye;) {
                    var t = be;
                    be = xe, m();
                    var n = e,
                        r = w();
                    if (":" != ye) throw Z("False part of conditional expression expected");
                    be = null, m();
                    var i = w();
                    e = new ee(n, r, i), be = t
                }
                return e
            }

            function b() {
                for (var e = C();
                    "or" == ye;) m(), e = new oe("or", "or", [e, C()]);
                return e
            }

            function C() {
                for (var e = M();
                    "xor" == ye;) m(), e = new oe("xor", "xor", [e, M()]);
                return e
            }

            function M() {
                for (var e = T();
                    "and" == ye;) m(), e = new oe("and", "and", [e, T()]);
                return e
            }

            function T() {
                for (var e = N();
                    "|" == ye;) m(), e = new oe("|", "bitOr", [e, N()]);
                return e
            }

            function N() {
                for (var e = E();
                    "^|" == ye;) m(), e = new oe("^|", "bitXor", [e, E()]);
                return e
            }

            function E() {
                for (var e = A();
                    "&" == ye;) m(), e = new oe("&", "bitAnd", [e, A()]);
                return e
            }

            function A() {
                var e, t, n, r, i;
                for (e = S(), t = {
                        "==": "equal",
                        "!=": "unequal",
                        "<": "smaller",
                        ">": "larger",
                        "<=": "smallerEq",
                        ">=": "largerEq"
                    }; t.hasOwnProperty(ye);) n = ye, r = t[n], m(), i = [e, S()], e = new oe(n, r, i);
                return e
            }

            function S() {
                var e, t, n, r, i;
                for (e = P(), t = {
                        "<<": "leftShift",
                        ">>": "rightArithShift",
                        ">>>": "rightLogShift"
                    }; t.hasOwnProperty(ye);) n = ye, r = t[n], m(), i = [e, P()], e = new oe(n, r, i);
                return e
            }

            function P() {
                var e, t, n, r, i;
                for (e = O(), t = {
                        to: "to",
                        in: "to"
                    }; t.hasOwnProperty(ye);) n = ye, r = t[n], m(), "in" === n && "" === ye ? e = new oe("*", "multiply", [e, new ce("in")], !0) : (i = [e, O()], e = new oe(n, r, i));
                return e
            }

            function O() {
                var e, t = [];
                if (e = ":" == ye ? new te("1", "number") : _(), ":" == ye && be !== xe) {
                    for (t.push(e);
                        ":" == ye && t.length < 3;) m(), ")" == ye || "]" == ye || "," == ye || "" == ye ? t.push(new ce("end")) : t.push(_());
                    e = 3 == t.length ? new ue(t[0], t[2], t[1]) : new ue(t[0], t[1])
                }
                return e
            }

            function _() {
                var e, t, n, r, i;
                for (e = I(), t = {
                        "+": "add",
                        "-": "subtract"
                    }; t.hasOwnProperty(ye);) n = ye, r = t[n], m(), i = [e, I()], e = new oe(n, r, i);
                return e
            }

            function I() {
                var e, t, n, r, i;
                for (e = B(), t = e, n = {
                        "*": "multiply",
                        ".*": "dotMultiply",
                        "/": "divide",
                        "./": "dotDivide",
                        "%": "mod",
                        mod: "mod"
                    };;)
                    if (n.hasOwnProperty(ye)) r = ye, i = n[r], m(), t = B(), e = new oe(r, i, [e, t]);
                    else {
                        if (!(we == le.SYMBOL || "in" == ye && e && e.isConstantNode) && (we != le.NUMBER || t.isConstantNode || t.isOperatorNode && "!" !== t.op) && "(" != ye) break;
                        t = B(), e = new oe("*", "multiply", [e, t], !0)
                    } return e
            }

            function B() {
                var e, t, n, r = {
                    "-": "unaryMinus",
                    "+": "unaryPlus",
                    "~": "bitNot",
                    not: "not"
                };
                return r.hasOwnProperty(ye) ? (n = r[ye], e = ye, m(), t = [B()], new oe(e, n, t)) : k()
            }

            function k() {
                var e, t, n, r;
                return e = V(), "^" != ye && ".^" != ye || (t = ye, n = "^" == t ? "pow" : "dotPow", m(), r = [e, B()], e = new oe(t, n, r)), e
            }

            function V() {
                var e, t, n, r, i;
                for (e = z(), t = {
                        "!": "factorial",
                        "'": "transpose"
                    }; t.hasOwnProperty(ye);) n = ye, r = t[n], p(), i = [e], e = new oe(n, r, i), e = D(e);
                return e
            }

            function z() {
                var e = [];
                if (we == le.SYMBOL && pe.hasOwnProperty(ye)) {
                    var t = pe[ye];
                    if (p(), "(" == ye) {
                        if (e = [], d(), p(), ")" != ye)
                            for (e.push(w());
                                "," == ye;) p(), e.push(w());
                        if (")" != ye) throw Z("Parenthesis ) expected");
                        v(), p()
                    }
                    return new t(e)
                }
                return F()
            }

            function F() {
                var e, t;
                return we == le.SYMBOL || we == le.DELIMITER && ye in he ? (t = ye, p(), e = new ce(t), e = D(e)) : R()
            }

            function D(e, t) {
                for (var n; !("(" != ye && "[" != ye && "." != ye || t && t.indexOf(ye) === -1);)
                    if (n = [], "(" == ye) {
                        if (!(e.isSymbolNode || e.isAccessorNode || e.isFunctionNode)) return e;
                        if (d(), p(), ")" != ye)
                            for (n.push(w());
                                "," == ye;) p(), n.push(w());
                        if (")" != ye) throw Z("Parenthesis ) expected");
                        v(), p(), e = new se(e, n)
                    } else if ("[" == ye) {
                    if (d(), p(), "]" != ye)
                        for (n.push(w());
                            "," == ye;) p(), n.push(w());
                    if ("]" != ye) throw Z("Parenthesis ] expected");
                    v(), p(), e = new X(e, new re(n))
                } else {
                    if (p(), we != le.SYMBOL) throw Z("Property name expected after dot");
                    n.push(new te(ye)), p();
                    var r = !0;
                    e = new X(e, new re(n, r))
                }
                return e
            }

            function R() {
                var e, t;
                return '"' == ye ? (t = U(), e = new te(t, "string"), e = D(e)) : L()
            }

            function U() {
                for (var e = "";
                    "" != ge && '"' != ge;) "\\" == ge && (e += ge, c()), e += ge, c();
                if (p(), '"' != ye) throw Z('End of string " expected');
                return p(), e
            }

            function L() {
                var e, t, n, r;
                if ("[" == ye) {
                    if (d(), p(), "]" != ye) {
                        var i = q();
                        if (";" == ye) {
                            for (n = 1, t = [i];
                                ";" == ye;) p(), t[n] = q(), n++;
                            if ("]" != ye) throw Z("End of matrix ] expected");
                            v(), p(), r = t[0].items.length;
                            for (var o = 1; o < n; o++)
                                if (t[o].items.length != r) throw Y("Column dimensions mismatch (" + t[o].items.length + " != " + r + ")");
                            e = new J(t)
                        } else {
                            if ("]" != ye) throw Z("End of matrix ] expected");
                            v(), p(), e = i
                        }
                    } else v(), p(), e = new J([]);
                    return D(e)
                }
                return j()
            }

            function q() {
                for (var e = [w()], t = 1;
                    "," == ye;) p(), e[t] = w(), t++;
                return new J(e)
            }

            function j() {
                if ("{" == ye) {
                    var e, t = {};
                    do
                        if (p(), "}" != ye) {
                            if ('"' == ye) e = U();
                            else {
                                if (we != le.SYMBOL) throw Z("Symbol or string expected as object key");
                                e = ye, p()
                            }
                            if (":" != ye) throw Z("Colon : expected after object key");
                            p(), t[e] = w()
                        } while ("," == ye);
                    if ("}" != ye) throw Z("Comma , or bracket } expected after object value");
                    p();
                    var n = new ie(t);
                    return n = D(n)
                }
                return W()
            }

            function W() {
                var e;
                return we == le.NUMBER ? (e = ye, p(), new te(e, "number")) : G()
            }

            function G() {
                var e;
                if ("(" == ye) {
                    if (d(), p(), e = w(), ")" != ye) throw Z("Parenthesis ) expected");
                    return v(), p(), e = new ae(e), e = D(e)
                }
                return H()
            }

            function H() {
                throw Z("" == ye ? "Unexpected end of expression" : "Value expected")
            }

            function $() {
                return ve - ye.length + 1
            }

            function Z(e) {
                var t = $(),
                    n = new SyntaxError(e + " (char " + t + ")");
                return n.char = t, n
            }

            function Y(e) {
                var t = $(),
                    n = new SyntaxError(e + " (char " + t + ")");
                return n.char = t, n
            }
            var X = r(n(86)),
                J = r(n(65)),
                Q = r(n(87)),
                K = r(n(88)),
                ee = r(n(89)),
                te = r(n(45)),
                ne = r(n(90)),
                re = r(n(66)),
                ie = r(n(91)),
                oe = r(n(52)),
                ae = r(n(53)),
                se = r(n(46)),
                ue = r(n(67)),
                ce = r(n(27)),
                le = {
                    NULL: 0,
                    DELIMITER: 1,
                    NUMBER: 2,
                    SYMBOL: 3,
                    UNKNOWN: 4
                },
                fe = {
                    ",": !0,
                    "(": !0,
                    ")": !0,
                    "[": !0,
                    "]": !0,
                    "{": !0,
                    "}": !0,
                    '"': !0,
                    ";": !0,
                    "+": !0,
                    "-": !0,
                    "*": !0,
                    ".*": !0,
                    "/": !0,
                    "./": !0,
                    "%": !0,
                    "^": !0,
                    ".^": !0,
                    "~": !0,
                    "!": !0,
                    "&": !0,
                    "|": !0,
                    "^|": !0,
                    "'": !0,
                    "=": !0,
                    ":": !0,
                    "?": !0,
                    "==": !0,
                    "!=": !0,
                    "<": !0,
                    ">": !0,
                    "<=": !0,
                    ">=": !0,
                    "<<": !0,
                    ">>": !0,
                    ">>>": !0
                },
                he = {
                    mod: !0,
                    to: !0,
                    in: !0,
                    and: !0,
                    xor: !0,
                    or: !0,
                    not: !0
                },
                pe = {},
                me = "",
                de = "",
                ve = 0,
                ge = "",
                ye = "",
                we = le.NULL,
                xe = 0,
                be = null;
            return s.isAlpha = function (e, t, n) {
                return s.isValidLatinOrGreek(e) || s.isValidMathSymbol(e, n) || s.isValidMathSymbol(t, e)
            }, s.isValidLatinOrGreek = function (e) {
                return /^[a-zA-Z_\u00C0-\u02AF\u0370-\u03FF\u2100-\u214F]$/.test(e)
            }, s.isValidMathSymbol = function (e, t) {
                return /^[\uD835]$/.test(e) && /^[\uDC00-\uDFFF]$/.test(t) && /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(t)
            }, s.isWhitespace = function (e, t) {
                return " " == e || "\t" == e || "\n" == e && t > 0
            }, s.isDecimalMark = function (e, t) {
                return "." == e && "/" !== t && "*" !== t && "^" !== t
            }, s.isDigitDot = function (e) {
                return e >= "0" && e <= "9" || "." == e
            }, s.isDigit = function (e) {
                return e >= "0" && e <= "9"
            }, s
        }
        var i = n(43),
            o = n(1);
        t.name = "parse", t.path = "expression", t.factory = r
    }, function (e, t, n) {
        var r = n(44);
        t.transform = function (e) {
            return e && e.isIndexError ? new r(e.index + 1, e.min + 1, void 0 !== e.max ? e.max + 1 : void 0) : e
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = n(4),
                s = o("unaryMinus", {
                    number: function (e) {
                        return -e
                    },
                    Complex: function (e) {
                        return e.neg()
                    },
                    BigNumber: function (e) {
                        return e.neg()
                    },
                    Fraction: function (e) {
                        return e.neg()
                    },
                    Unit: function (e) {
                        var t = e.clone();
                        return t.value = s(e.value), t
                    },
                    "Array | Matrix": function (e) {
                        return i(e, s, !0)
                    }
                });
            return s.toTex = {
                1: a.operators.unaryMinus + "\\left(${args[0]}\\right)"
            }, s
        }
        var i = n(1);
        t.name = "unaryMinus", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(t, n) {
                var r = u(t),
                    i = r ? new e.BigNumber(0) : 0;
                if (c(t), n) {
                    var a = l(n);
                    return t.length > 0 ? a.resize(t, i) : a
                }
                var s = [];
                return t.length > 0 ? o(s, t, i) : s
            }

            function u(e) {
                var t = !1;
                return e.forEach(function (e, n, r) {
                    e && e.isBigNumber === !0 && (t = !0, r[n] = e.toNumber())
                }), t
            }

            function c(e) {
                e.forEach(function (e) {
                    if ("number" != typeof e || !i(e) || e < 0) throw new Error("Parameters in function zeros must be positive integers")
                })
            }
            var l = r(n(0)),
                f = a("zeros", {
                    "": function () {
                        return "Array" === t.matrix ? s([]) : s([], "default")
                    },
                    "...number | BigNumber | string": function (e) {
                        var n = e[e.length - 1];
                        if ("string" == typeof n) {
                            var r = e.pop();
                            return s(e, r)
                        }
                        return "Array" === t.matrix ? s(e) : s(e, "default")
                    },
                    Array: s,
                    Matrix: function (e) {
                        var t = e.storage();
                        return s(e.valueOf(), t)
                    },
                    "Array | Matrix, string": function (e, t) {
                        return s(e.valueOf(), t)
                    }
                });
            return f.toTex = void 0, f
        }
        var i = n(2).isInteger,
            o = n(3).resize;
        t.name = "zeros", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = e.DenseMatrix,
                o = function (e, t, n, o) {
                    var a = e._values,
                        s = e._index,
                        u = e._ptr,
                        c = e._size,
                        l = e._datatype;
                    if (!a) throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
                    var f, h = c[0],
                        p = c[1],
                        m = n;
                    "string" == typeof l && (f = l, t = r.convert(t, f), m = r.find(n, [f, f]));
                    for (var d = [], v = new i({
                            data: d,
                            size: [h, p],
                            datatype: f
                        }), g = [], y = [], w = 0; w < p; w++) {
                        for (var x = w + 1, b = u[w], C = u[w + 1], M = b; M < C; M++) {
                            var T = s[M];
                            g[T] = a[M], y[T] = x
                        }
                        for (var N = 0; N < h; N++) 0 === w && (d[N] = []), y[N] === x ? d[N][w] = o ? m(t, g[N]) : m(g[N], t) : d[N][w] = t
                    }
                    return v
                };
            return o
        }
        t.name = "algorithm10", t.factory = r
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e, t, n) {
            if (null == n) return e.eq(t);
            if (e.eq(t)) return !0;
            if (e.isNaN() || t.isNaN()) return !1;
            if (e.isFinite() && t.isFinite()) {
                var r = e.minus(t).abs();
                if (r.isZero()) return !0;
                var i = e.constructor.max(e.abs(), t.abs());
                return r.lte(i.times(n))
            }
            return !1
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function e(t, n) {
            t && t.isMatrix === !0 && (t = t.valueOf());
            for (var r = 0, i = t.length; r < i; r++) {
                var o = t[r];
                Array.isArray(o) ? e(o, n) : n(o)
            }
        }
    }, function (e, t) {
        t.memoize = function (e, t) {
            return function n() {
                "object" != typeof n.cache && (n.cache = {});
                for (var r = [], i = 0; i < arguments.length; i++) r[i] = arguments[i];
                var o = t ? t(r) : JSON.stringify(r);
                return o in n.cache ? n.cache[o] : n.cache[o] = e.apply(e, r)
            }
        }, t.maxArgumentCount = function (e) {
            return Object.keys(e.signatures || {}).reduce(function (e, t) {
                var n = (t.match(/,/g) || []).length + 1;
                return Math.max(e, n)
            }, -1)
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(19)),
                s = r(n(12)),
                u = r(n(114)),
                c = r(n(0)),
                l = r(n(15)),
                f = r(n(6)),
                h = o("divide", i({
                    "Array | Matrix, Array | Matrix": function (e, t) {
                        return s(e, u(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, a, !1);
                                break;
                            case "dense":
                                n = f(e, t, a, !1)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return f(c(e), t, a, !1).valueOf()
                    },
                    "any, Array | Matrix": function (e, t) {
                        return s(e, u(t))
                    }
                }, a.signatures));
            return h.toTex = {
                2: "\\frac{${args[0]}}{${args[1]}}"
            }, h
        }
        var i = n(5).extend;
        t.name = "divide", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(n, r) {
                if (t.predictable && !i(r) && n < 0) try {
                    var o = m(r),
                        a = d(o);
                    if ((r === a || Math.abs((r - a) / r) < 1e-14) && o.d % 2 === 1) return (o.n % 2 === 0 ? 1 : -1) * Math.pow(-n, r)
                } catch (e) {}
                return n * n < 1 && r === 1 / 0 || n * n > 1 && r === -(1 / 0) ? 0 : t.predictable && (n < -1 && r === 1 / 0 || n > -1 && n < 0 && r === -(1 / 0)) ? NaN : i(r) || n >= 0 || t.predictable ? Math.pow(n, r) : new e.Complex(n, 0).pow(r, 0)
            }

            function u(e, t) {
                if (!i(t) || t < 0) throw new TypeError("For A^b, b must be a positive integer (value is " + t + ")");
                var n = o(e);
                if (2 != n.length) throw new Error("For A^b, A must be 2 dimensional (A has " + n.length + " dimensions)");
                if (n[0] != n[1]) throw new Error("For A^b, A must be square (size is " + n[0] + "x" + n[1] + ")");
                for (var r = f(n[0]).valueOf(), a = e; t >= 1;) 1 == (1 & t) && (r = h(a, r)), t >>= 1, a = h(a, a);
                return r
            }

            function c(e, t) {
                return p(u(e.valueOf(), t))
            }
            var l = n(4),
                f = r(n(54)),
                h = r(n(12)),
                p = r(n(0)),
                m = r(n(132)),
                d = r(n(78)),
                v = a("pow", {
                    "number, number": s,
                    "Complex, Complex": function (e, t) {
                        return e.pow(t)
                    },
                    "BigNumber, BigNumber": function (n, r) {
                        return r.isInteger() || n >= 0 || t.predictable ? n.pow(r) : new e.Complex(n.toNumber(), 0).pow(r.toNumber(), 0)
                    },
                    "Fraction, Fraction": function (e, n) {
                        if (1 !== n.d) {
                            if (t.predictable) throw new Error("Function pow does not support non-integer exponents for fractions.");
                            return s(e.valueOf(), n.valueOf())
                        }
                        return e.pow(n)
                    },
                    "Array, number": u,
                    "Array, BigNumber": function (e, t) {
                        return u(e, t.toNumber())
                    },
                    "Matrix, number": c,
                    "Matrix, BigNumber": function (e, t) {
                        return c(e, t.toNumber())
                    },
                    "Unit, number": function (e, t) {
                        return e.pow(t)
                    }
                });
            return v.toTex = {
                2: "\\left(${args[0]}\\right)" + l.operators.pow + "{${args[1]}}"
            }, v
        }
        var i = n(2).isInteger,
            o = n(3).size;
        t.name = "pow", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(14)),
                c = r(n(24)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = n(4),
                m = a("smaller", {
                    "boolean, boolean": function (e, t) {
                        return e < t
                    },
                    "number, number": function (e, n) {
                        return e < n && !i(e, n, t.epsilon)
                    },
                    "BigNumber, BigNumber": function (e, n) {
                        return e.lt(n) && !o(e, n, t.epsilon)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return e.compare(t) === -1
                    },
                    "Complex, Complex": function (e, t) {
                        throw new TypeError("No ordering relation is defined for complex numbers")
                    },
                    "Unit, Unit": function (e, t) {
                        if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                        return m(e.value, t.value)
                    },
                    "string, string": function (e, t) {
                        return e < t
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m);
                                        break;
                                    default:
                                        n = u(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, m, !1);
                                        break;
                                    default:
                                        n = f(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, m, !1);
                                break;
                            default:
                                n = h(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, m, !0);
                                break;
                            default:
                                n = h(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(s(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(s(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + p.operators.smaller + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.name = "smaller", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("isInteger", {
                number: o.isInteger,
                BigNumber: function (e) {
                    return e.isInt()
                },
                Fraction: function (e) {
                    return 1 === e.d && isFinite(e.n)
                },
                "Array | Matrix": function (e) {
                    return i(e, a)
                }
            });
            return a
        }
        var i = n(1),
            o = n(2);
        t.name = "isInteger", t.factory = r
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e) {
            return Array.isArray(e) || e && e.isMatrix === !0
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, i) {
            if (!(this instanceof r)) throw new SyntaxError("Constructor must be called with the new operator");
            this.fn = e, this.count = t, this.min = n, this.max = i, this.message = "Wrong number of arguments in function " + e + " (" + t + " provided, " + n + (void 0 != i ? "-" + i : "") + " expected)", this.stack = (new Error).stack
        }
        r.prototype = new Error, r.prototype.constructor = Error, r.prototype.name = "ArgumentsError", r.prototype.isArgumentsError = !0, e.exports = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n) {
            if (!(this instanceof r)) throw new SyntaxError("Constructor must be called with the new operator");
            this.index = e, arguments.length < 3 ? (this.min = 0, this.max = t) : (this.min = t, this.max = n), void 0 !== this.min && this.index < this.min ? this.message = "Index out of range (" + this.index + " < " + this.min + ")" : void 0 !== this.max && this.index >= this.max ? this.message = "Index out of range (" + this.index + " > " + (this.max - 1) + ")" : this.message = "Index out of range (" + this.index + ")", this.stack = (new Error).stack
        }
        r.prototype = new RangeError, r.prototype.constructor = RangeError, r.prototype.name = "IndexError", r.prototype.isIndexError = !0, e.exports = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e, t) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                if (t) {
                    if ("string" != typeof t) throw new TypeError('String expected for parameter "valueType"');
                    if ("string" != typeof e) throw new TypeError('String expected for parameter "value"');
                    this.value = e, this.valueType = t
                } else this.value = e + "", this.valueType = i(e);
                if (!h[this.valueType]) throw new TypeError('Unsupported type of value "' + this.valueType + '"')
            }

            function u(e, n, r) {
                if (!(e instanceof s)) throw new TypeError("No valid ConstantNode");
                switch (e.valueType) {
                    case "number":
                        return "BigNumber" === t.number ? "math.bignumber(" + o(e.value) + ")" : "Fraction" === t.number ? "math.fraction(" + o(e.value) + ")" : (c(e.value), e.value.replace(/^(0*)[0-9]/, function (e, t) {
                            return e.substring(t.length)
                        }));
                    case "string":
                        return o(e.value);
                    case "boolean":
                        return "true" === String(e.value) ? "true" : "false";
                    case "undefined":
                        return "undefined";
                    case "null":
                        return "null";
                    default:
                        throw new TypeError('Unsupported type of constant "' + e.valueType + '"')
                }
            }

            function c(e) {
                if ("string" != typeof e || !/^[\-+]?((\d+\.?\d*)|(\d*\.?\d+))([eE][+\-]?\d+)?$/.test(e)) throw new Error('Invalid numeric value "' + e + '"')
            }
            var l = r(n(7)).register,
                f = (r(n(7)).compile, r(n(13))),
                h = {
                    number: !0,
                    string: !0,
                    boolean: !0,
                    undefined: !0,
                    null: !0
                };
            return s.prototype = new f, s.prototype.type = "ConstantNode", s.prototype.isConstantNode = !0, l(s.prototype.type, u), s.prototype.forEach = function (e) {}, s.prototype.map = function (e) {
                return this.clone()
            }, s.prototype.clone = function () {
                return new s(this.value, this.valueType)
            }, s.prototype._toString = function (e) {
                switch (this.valueType) {
                    case "string":
                        return o(this.value);
                    default:
                        return this.value
                }
            }, s.prototype._toTex = function (e) {
                var t, n = this.value;
                switch (this.valueType) {
                    case "string":
                        return "\\mathtt{" + o(n) + "}";
                    case "number":
                        return t = n.toLowerCase().indexOf("e"), t !== -1 ? n.substring(0, t) + "\\cdot10^{" + n.substring(t + 1) + "}" : n;
                    default:
                        return n
                }
            }, s
        }
        var i = n(63).type,
            o = n(11).stringify;
        t.name = "ConstantNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, h, p) {
            function m(e, t) {
                if (!(this instanceof m)) throw new SyntaxError("Constructor must be called with the new operator");
                if ("string" == typeof e && (e = new b(e)), !e || !e.isNode) throw new TypeError('Node expected as parameter "fn"');
                if (!Array.isArray(t) || !t.every(function (e) {
                        return e && e.isNode
                    })) throw new TypeError('Array containing Nodes expected for parameter "args"');
                this.fn = e, this.args = t || [], Object.defineProperty(this, "name", {
                    get: function () {
                        return this.fn.name || ""
                    }.bind(this),
                    set: function () {
                        throw new Error("Cannot assign a new name, name is read-only")
                    }
                });
                var n = function () {
                    throw new Error("Property `FunctionNode.object` is deprecated, use `FunctionNode.fn` instead")
                };
                Object.defineProperty(this, "object", {
                    get: n,
                    set: n
                })
            }

            function d(e, t, n) {
                if (!(e instanceof m)) throw new TypeError("No valid FunctionNode");
                var r, i = w(e.fn, t, n),
                    a = u(e.args, function (e) {
                        return w(e, t, n)
                    }),
                    h = v(t, n);
                if (e.fn.isSymbolNode) {
                    var p = e.fn.name,
                        d = s(t.math, p) ? t.math[p] : void 0,
                        g = "function" == typeof d && 1 == d.rawArgs;
                    return g ? (r = f(t), t[r] = e.args, i + "(" + r + ", math, " + h + ")") : i + "(" + c(a, ", ") + ")"
                }
                if (e.fn.isAccessorNode && e.fn.index.isObjectProperty()) {
                    r = f(t), t[r] = e.args, t.validateSafeMethod = l;
                    var y = w(e.fn.object, t, n),
                        x = o(e.fn.index.getObjectProperty());
                    return "(function () {var object = " + y + ";validateSafeMethod(object, " + x + ");return (object[" + x + "] && object[" + x + "].rawArgs)  ? object[" + x + "](" + r + ", math, " + h + ") : object[" + x + "](" + c(a, ", ") + ")})()"
                }
                return r = f(t), t[r] = e.args, "(function () {var fn = " + i + ";return (fn && fn.rawArgs)  ? fn(" + r + ", math, " + h + ") : fn(" + c(a, ", ") + ")})()"
            }

            function v(e, t) {
                var n = Object.keys(t);
                if (0 === n.length) return "scope";
                e.extend = a;
                var r = u(n, function (e) {
                    return o(e) + ": " + t[e]
                });
                return "extend(extend({}, scope), {" + c(r, ", ") + "})"
            }

            function g(e, t, n) {
                for (var r, i = "", o = new RegExp("\\$(?:\\{([a-z_][a-z_0-9]*)(?:\\[([0-9]+)\\])?\\}|\\$)", "ig"), a = 0; null !== (r = o.exec(e));)
                    if (i += e.substring(a, r.index), a = r.index, "$$" === r[0]) i += "$", a++;
                    else {
                        a += r[0].length;
                        var s = t[r[1]];
                        if (!s) throw new ReferenceError("Template: Property " + r[1] + " does not exist.");
                        if (void 0 === r[2]) switch (typeof s) {
                            case "string":
                                i += s;
                                break;
                            case "object":
                                if (s.isNode) i += s.toTex(n);
                                else {
                                    if (!Array.isArray(s)) throw new TypeError("Template: " + r[1] + " has to be a Node, String or array of Nodes");
                                    i += s.map(function (e, t) {
                                        if (e && e.isNode) return e.toTex(n);
                                        throw new TypeError("Template: " + r[1] + "[" + t + "] is not a Node.")
                                    }).join(",")
                                }
                                break;
                            default:
                                throw new TypeError("Template: " + r[1] + " has to be a Node, String or array of Nodes")
                        } else {
                            if (!s[r[2]] || !s[r[2]].isNode) throw new TypeError("Template: " + r[1] + "[" + r[2] + "] is not a Node.");
                            i += s[r[2]].toTex(n)
                        }
                    } return i += e.slice(a)
            }
            var y = r(n(7)).register,
                w = r(n(7)).compile,
                x = r(n(13)),
                b = r(n(27));
            m.prototype = new x, m.prototype.type = "FunctionNode", m.prototype.isFunctionNode = !0, y(m.prototype.type, d), m.prototype.forEach = function (e) {
                for (var t = 0; t < this.args.length; t++) e(this.args[t], "args[" + t + "]", this)
            }, m.prototype.map = function (e) {
                for (var t = this.fn.map(e), n = [], r = 0; r < this.args.length; r++) n[r] = this._ifNode(e(this.args[r], "args[" + r + "]", this));
                return new m(t, n)
            }, m.prototype.clone = function () {
                return new m(this.fn, this.args.slice(0))
            };
            var C = m.prototype.toString;
            m.prototype.toString = function (e) {
                var t, n = this.fn.toString(e);
                return e && "object" == typeof e.handler && s(e.handler, n) && (t = e.handler[n](this, e)), "undefined" != typeof t ? t : C.call(this, e)
            }, m.prototype._toString = function (e) {
                var t = this.args.map(function (t) {
                    return t.toString(e)
                });
                return this.fn.toString(e) + "(" + t.join(", ") + ")"
            };
            var M = m.prototype.toTex;
            return m.prototype.toTex = function (e) {
                var t;
                return e && "object" == typeof e.handler && s(e.handler, this.name) && (t = e.handler[this.name](this, e)), "undefined" != typeof t ? t : M.call(this, e)
            }, m.prototype._toTex = function (e) {
                var t, n = this.args.map(function (t) {
                    return t.toTex(e)
                });
                !p[this.name] || "function" != typeof p[this.name].toTex && "object" != typeof p[this.name].toTex && "string" != typeof p[this.name].toTex || (t = p[this.name].toTex);
                var r;
                switch (typeof t) {
                    case "function":
                        r = t(this, e);
                        break;
                    case "string":
                        r = g(t, this, e);
                        break;
                    case "object":
                        switch (typeof t[n.length]) {
                            case "function":
                                r = t[n.length](this, e);
                                break;
                            case "string":
                                r = g(t[n.length], this, e)
                        }
                }
                return "undefined" != typeof r ? r : g(i.defaultTemplate, this, e)
            }, m.prototype.getIdentifier = function () {
                return this.type + ":" + this.name
            }, m
        }
        var i = n(4),
            o = n(11).stringify,
            a = n(5).extend,
            s = n(5).hasOwnProperty,
            u = n(3).map,
            c = n(3).join,
            l = n(17).validateSafeMethod,
            f = n(93);
        t.name = "FunctionNode", t.path = "expression.node", t.math = !0, t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t) {
            var n = e;
            "keep" !== t && (n = e.getContent());
            for (var r = n.getIdentifier(), i = 0; i < a.length; i++)
                if (r in a[i]) return i;
            return null
        }

        function i(e, t) {
            var n = e;
            "keep" !== t && (n = e.getContent());
            var i = n.getIdentifier(),
                o = r(n, t);
            if (null === o) return null;
            var s = a[o][i];
            if (s.hasOwnProperty("associativity")) {
                if ("left" === s.associativity) return "left";
                if ("right" === s.associativity) return "right";
                throw Error("'" + i + "' has the invalid associativity '" + s.associativity + "'.")
            }
            return null
        }

        function o(e, t, n) {
            var i = e,
                o = t;
            if ("keep" !== n) var i = e.getContent(),
                o = t.getContent();
            var s = i.getIdentifier(),
                u = o.getIdentifier(),
                c = r(i, n);
            if (null === c) return null;
            var l = a[c][s];
            if (l.hasOwnProperty("associativeWith") && l.associativeWith instanceof Array) {
                for (var f = 0; f < l.associativeWith.length; f++)
                    if (l.associativeWith[f] === u) return !0;
                return !1
            }
            return null
        }
        var a = [{
            AssignmentNode: {},
            FunctionAssignmentNode: {}
        }, {
            ConditionalNode: {
                latexLeftParens: !1,
                latexRightParens: !1,
                latexParens: !1
            }
        }, {
            "OperatorNode:or": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:xor": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:and": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:bitOr": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:bitXor": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:bitAnd": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:equal": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:unequal": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:smaller": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:larger": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:smallerEq": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:largerEq": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:leftShift": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:rightArithShift": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:rightLogShift": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:to": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            RangeNode: {}
        }, {
            "OperatorNode:add": {
                associativity: "left",
                associativeWith: ["OperatorNode:add", "OperatorNode:subtract"]
            },
            "OperatorNode:subtract": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:multiply": {
                associativity: "left",
                associativeWith: ["OperatorNode:multiply", "OperatorNode:divide", "Operator:dotMultiply", "Operator:dotDivide"]
            },
            "OperatorNode:divide": {
                associativity: "left",
                associativeWith: [],
                latexLeftParens: !1,
                latexRightParens: !1,
                latexParens: !1
            },
            "OperatorNode:dotMultiply": {
                associativity: "left",
                associativeWith: ["OperatorNode:multiply", "OperatorNode:divide", "OperatorNode:dotMultiply", "OperatorNode:doDivide"]
            },
            "OperatorNode:dotDivide": {
                associativity: "left",
                associativeWith: []
            },
            "OperatorNode:mod": {
                associativity: "left",
                associativeWith: []
            }
        }, {
            "OperatorNode:unaryPlus": {
                associativity: "right"
            },
            "OperatorNode:unaryMinus": {
                associativity: "right"
            },
            "OperatorNode:bitNot": {
                associativity: "right"
            },
            "OperatorNode:not": {
                associativity: "right"
            }
        }, {
            "OperatorNode:pow": {
                associativity: "right",
                associativeWith: [],
                latexRightParens: !1
            },
            "OperatorNode:dotPow": {
                associativity: "right",
                associativeWith: []
            }
        }, {
            "OperatorNode:factorial": {
                associativity: "left"
            }
        }, {
            "OperatorNode:transpose": {
                associativity: "left"
            }
        }];
        e.exports.properties = a, e.exports.getPrecedence = r, e.exports.getAssociativity = i, e.exports.isAssociativeWith = o
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function o(n) {
                return n >= 0 || t.predictable ? Math.sqrt(n) : new e.Complex(n, 0).sqrt()
            }
            var a = r("sqrt", {
                number: o,
                Complex: function (e) {
                    return e.sqrt()
                },
                BigNumber: function (e) {
                    return !e.isNegative() || t.predictable ? e.sqrt() : o(e.toNumber())
                },
                "Array | Matrix": function (e) {
                    return i(e, a, !0)
                },
                Unit: function (e) {
                    return e.pow(.5)
                }
            });
            return a.toTex = {
                1: "\\sqrt{${args[0]}}"
            }, a
        }
        var i = n(1);
        t.name = "sqrt", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(14)),
                c = r(n(59)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = a("compare", {
                    "boolean, boolean": function (e, t) {
                        return e === t ? 0 : e > t ? 1 : -1
                    },
                    "number, number": function (e, n) {
                        return e === n || i(e, n, t.epsilon) ? 0 : e > n ? 1 : -1
                    },
                    "BigNumber, BigNumber": function (n, r) {
                        return n.eq(r) || o(n, r, t.epsilon) ? new e.BigNumber(0) : new e.BigNumber(n.cmp(r))
                    },
                    "Fraction, Fraction": function (t, n) {
                        return new e.Fraction(t.compare(n))
                    },
                    "Complex, Complex": function () {
                        throw new TypeError("No ordering relation is defined for complex numbers")
                    },
                    "Unit, Unit": function (e, t) {
                        if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                        return p(e.value, t.value)
                    },
                    "string, string": function (e, t) {
                        return e === t ? 0 : e > t ? 1 : -1
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, p);
                                        break;
                                    default:
                                        n = u(t, e, p, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, p, !1);
                                        break;
                                    default:
                                        n = f(e, t, p)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return p(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return p(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return p(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, p, !1);
                                break;
                            default:
                                n = h(e, t, p, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, p, !0);
                                break;
                            default:
                                n = h(t, e, p, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(s(e), t, p, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(s(t), e, p, !0).valueOf()
                    }
                });
            return p.toTex = void 0, p
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.name = "compare", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("isNegative", {
                number: function (e) {
                    return e < 0
                },
                BigNumber: function (e) {
                    return e.isNeg() && !e.isZero() && !e.isNaN()
                },
                Fraction: function (e) {
                    return e.s < 0
                },
                Unit: function (e) {
                    return o(e.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        n(2), t.name = "isNegative", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("isPositive", {
                number: function (e) {
                    return e > 0
                },
                BigNumber: function (e) {
                    return !e.isNeg() && !e.isZero() && !e.isNaN()
                },
                Fraction: function (e) {
                    return e.s > 0 && e.n > 0
                },
                Unit: function (e) {
                    return o(e.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        n(2), t.name = "isPositive", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, l, f) {
            function h(e, t, n, r) {
                if (!(this instanceof h)) throw new SyntaxError("Constructor must be called with the new operator");
                if ("string" != typeof e) throw new TypeError('string expected for parameter "op"');
                if ("string" != typeof t) throw new TypeError('string expected for parameter "fn"');
                if (!Array.isArray(n) || !n.every(function (e) {
                        return e && e.isNode
                    })) throw new TypeError('Array containing Nodes expected for parameter "args"');
                this.implicit = r === !0, this.op = e, this.fn = t, this.args = n || []
            }

            function p(e, t, n) {
                if (!(e instanceof h)) throw new TypeError("No valid OperatorNode");
                if ("string" != typeof e.fn || !u(t.math, e.fn)) throw t.math[e.fn] ? new Error('No access to function "' + e.fn + '"') : new Error("Function " + e.fn + ' missing in provided namespace "math"');
                var r = o(e.args, function (e) {
                    return v(e, t, n)
                });
                return "math[" + s(e.fn) + "](" + a(r, ", ") + ")"
            }

            function m(e, t, n, r) {
                var i = c.getPrecedence(e, t),
                    o = c.getAssociativity(e, t);
                if ("all" === t || n.length > 2 && "OperatorNode:add" !== e.getIdentifier() && "OperatorNode:multiply" !== e.getIdentifier()) {
                    var a = n.map(function (e) {
                        switch (e.getContent().type) {
                            case "ArrayNode":
                            case "ConstantNode":
                            case "SymbolNode":
                            case "ParenthesisNode":
                                return !1;
                            default:
                                return !0
                        }
                    });
                    return a
                }
                if (0 === n.length) return [];
                if (1 === n.length) {
                    var s = c.getPrecedence(n[0], t);
                    if (r && null !== s) {
                        var u, l;
                        if ("keep" === t ? (u = n[0].getIdentifier(), l = e.getIdentifier()) : (u = n[0].getContent().getIdentifier(), l = e.getContent().getIdentifier()), c.properties[i][l].latexLeftParens === !1) return [!1];
                        if (c.properties[s][u].latexParens === !1) return [!1]
                    }
                    return null === s ? [!1] : s <= i ? [!0] : [!1]
                }
                if (2 === n.length) {
                    var f, h = c.getPrecedence(n[0], t),
                        p = c.isAssociativeWith(e, n[0], t);
                    f = null !== h && (h === i && "right" === o && !p || h < i);
                    var m, d = c.getPrecedence(n[1], t),
                        v = c.isAssociativeWith(e, n[1], t);
                    if (m = null !== d && (d === i && "left" === o && !v || d < i), r) {
                        var l, g, y;
                        "keep" === t ? (l = e.getIdentifier(), g = e.args[0].getIdentifier(), y = e.args[1].getIdentifier()) : (l = e.getContent().getIdentifier(), g = e.args[0].getContent().getIdentifier(), y = e.args[1].getContent().getIdentifier()), null !== h && (c.properties[i][l].latexLeftParens === !1 && (f = !1), c.properties[h][g].latexParens === !1 && (f = !1)), null !== d && (c.properties[i][l].latexRightParens === !1 && (m = !1), c.properties[d][y].latexParens === !1 && (m = !1))
                    }
                    return [f, m]
                }
                if (n.length > 2 && ("OperatorNode:add" === e.getIdentifier() || "OperatorNode:multiply" === e.getIdentifier())) {
                    var w = n.map(function (n) {
                        var r = c.getPrecedence(n, t),
                            a = c.isAssociativeWith(e, n, t),
                            s = c.getAssociativity(n, t);
                        return null !== r && (i === r && o === s && !a || r < i)
                    });
                    return w
                }
            }
            var d = r(n(7)).register,
                v = r(n(7)).compile,
                g = r(n(13));
            return r(n(45)), r(n(27)), r(n(46)), h.prototype = new g, h.prototype.type = "OperatorNode", h.prototype.isOperatorNode = !0, d(h.prototype.type, p), h.prototype.forEach = function (e) {
                for (var t = 0; t < this.args.length; t++) e(this.args[t], "args[" + t + "]", this)
            }, h.prototype.map = function (e) {
                for (var t = [], n = 0; n < this.args.length; n++) t[n] = this._ifNode(e(this.args[n], "args[" + n + "]", this));
                return new h(this.op, this.fn, t)
            }, h.prototype.clone = function () {
                return new h(this.op, this.fn, this.args.slice(0), this.implicit)
            }, h.prototype._toString = function (e) {
                var t = e && e.parenthesis ? e.parenthesis : "keep",
                    n = e && e.implicit ? e.implicit : "hide",
                    r = this.args,
                    i = m(this, t, r, !1);
                if (1 === r.length) {
                    var o = c.getAssociativity(this, t),
                        a = r[0].toString(e);
                    return i[0] && (a = "(" + a + ")"), "right" === o ? this.op + a : "left" === o ? a + this.op : a + this.op
                }
                if (2 == r.length) {
                    var s = r[0].toString(e),
                        u = r[1].toString(e);
                    return i[0] && (s = "(" + s + ")"), i[1] && (u = "(" + u + ")"), this.implicit && "OperatorNode:multiply" === this.getIdentifier() && "hide" == n ? s + " " + u : s + " " + this.op + " " + u
                }
                if (r.length > 2 && ("OperatorNode:add" === this.getIdentifier() || "OperatorNode:multiply" === this.getIdentifier())) {
                    var l = r.map(function (t, n) {
                        return t = t.toString(e), i[n] && (t = "(" + t + ")"), t
                    });
                    return this.implicit && "OperatorNode:multiply" === this.getIdentifier() && "hide" === n ? l.join(" ") : l.join(" " + this.op + " ")
                }
                return this.fn + "(" + this.args.join(", ") + ")"
            }, h.prototype._toTex = function (e) {
                var t = e && e.parenthesis ? e.parenthesis : "keep",
                    n = e && e.implicit ? e.implicit : "hide",
                    r = this.args,
                    o = m(this, t, r, !0),
                    a = i.operators[this.fn];
                if (a = "undefined" == typeof a ? this.op : a, 1 === r.length) {
                    var s = c.getAssociativity(this, t),
                        u = r[0].toTex(e);
                    return o[0] && (u = "\\left(" + u + "\\right)"), "right" === s ? a + u : "left" === s ? u + a : u + a
                }
                if (2 === r.length) {
                    var l = r[0],
                        f = l.toTex(e);
                    o[0] && (f = "\\left(" + f + "\\right)");
                    var h = r[1],
                        p = h.toTex(e);
                    o[1] && (p = "\\left(" + p + "\\right)");
                    var d;
                    switch (d = "keep" === t ? l.getIdentifier() : l.getContent().getIdentifier(), this.getIdentifier()) {
                        case "OperatorNode:divide":
                            return a + "{" + f + "}{" + p + "}";
                        case "OperatorNode:pow":
                            switch (f = "{" + f + "}", p = "{" + p + "}", d) {
                                case "ConditionalNode":
                                case "OperatorNode:divide":
                                    f = "\\left(" + f + "\\right)"
                            }
                            case "OperatorNode:multiply":
                                if (this.implicit && "hide" === n) return f + "~" + p
                    }
                    return f + a + p
                }
                if (r.length > 2 && ("OperatorNode:add" === this.getIdentifier() || "OperatorNode:multiply" === this.getIdentifier())) {
                    var v = r.map(function (t, n) {
                        return t = t.toTex(e), o[n] && (t = "\\left(" + t + "\\right)"), t
                    });
                    return "OperatorNode:multiply" === this.getIdentifier() && this.implicit ? v.join("~") : v.join(a)
                }
                return "\\mathrm{" + this.fn + "}\\left(" + r.map(function (t) {
                    return t.toTex(e)
                }).join(",") + "\\right)"
            }, h.prototype.getIdentifier = function () {
                return this.type + ":" + this.fn
            }, h
        }
        var i = n(4),
            o = n(3).map,
            a = n(3).join,
            s = n(11).stringify,
            u = n(17).isSafeMethod,
            c = n(47);
        t.name = "OperatorNode", t.path = "expression.node", t.math = !0, t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e) {
                if (!(this instanceof o)) throw new SyntaxError("Constructor must be called with the new operator");
                if (!e || !e.isNode) throw new TypeError('Node expected for parameter "content"');
                this.content = e
            }

            function a(e, t, n) {
                if (!(e instanceof o)) throw new TypeError("No valid ParenthesisNode");
                return u(e.content, t, n)
            }
            var s = r(n(7)).register,
                u = r(n(7)).compile,
                c = r(n(13));
            return o.prototype = new c, o.prototype.type = "ParenthesisNode", o.prototype.isParenthesisNode = !0, s(o.prototype.type, a), o.prototype.getContent = function () {
                return this.content.getContent()
            }, o.prototype.forEach = function (e) {
                e(this.content, "content", this)
            }, o.prototype.map = function (e) {
                var t = e(this.content, "content", this);
                return new o(t)
            }, o.prototype.clone = function () {
                return new o(this.content)
            }, o.prototype._toString = function (e) {
                return !e || e && !e.parenthesis || e && "keep" === e.parenthesis ? "(" + this.content.toString(e) + ")" : this.content.toString(e)
            }, o.prototype._toTex = function (e) {
                return !e || e && !e.parenthesis || e && "keep" === e.parenthesis ? "\\left(" + this.content.toTex(e) + "\\right)" : this.content.toTex(e)
            }, o
        }
        t.name = "ParenthesisNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e, t) {
                switch (e.length) {
                    case 0:
                        return t ? c(t) : [];
                    case 1:
                        return u(e[0], e[0], t);
                    case 2:
                        return u(e[0], e[1], t);
                    default:
                        throw new Error("Vector containing two values expected")
                }
            }

            function u(t, n, r) {
                var a = t && t.isBigNumber === !0 ? e.BigNumber : n && n.isBigNumber === !0 ? e.BigNumber : null;
                if (t && t.isBigNumber === !0 && (t = t.toNumber()), n && n.isBigNumber === !0 && (n = n.toNumber()), !o(t) || t < 1) throw new Error("Parameters in function eye must be positive integers");
                if (!o(n) || n < 1) throw new Error("Parameters in function eye must be positive integers");
                var s = a ? new e.BigNumber(1) : 1,
                    u = a ? new a(0) : 0,
                    c = [t, n];
                if (r) {
                    var l = e.Matrix.storage(r);
                    return l.diagonal(c, s, 0, u)
                }
                for (var f = i.resize([], c, u), h = t < n ? t : n, p = 0; p < h; p++) f[p][p] = s;
                return f
            }
            var c = r(n(0)),
                l = a("eye", {
                    "": function () {
                        return "Matrix" === t.matrix ? c([]) : []
                    },
                    string: function (e) {
                        return c(e)
                    },
                    "number | BigNumber": function (e) {
                        return u(e, e, "Matrix" === t.matrix ? "default" : void 0)
                    },
                    "number | BigNumber, string": function (e, t) {
                        return u(e, e, t)
                    },
                    "number | BigNumber, number | BigNumber": function (e, n) {
                        return u(e, n, "Matrix" === t.matrix ? "default" : void 0)
                    },
                    "number | BigNumber, number | BigNumber, string": function (e, t, n) {
                        return u(e, t, n)
                    },
                    Array: function (e) {
                        return s(e)
                    },
                    "Array, string": function (e, t) {
                        return s(e, t)
                    },
                    Matrix: function (e) {
                        return s(e.valueOf(), e.storage())
                    },
                    "Matrix, string": function (e, t) {
                        return s(e.valueOf(), t)
                    }
                });
            return l.toTex = void 0, l
        }
        var i = n(3),
            o = n(2).isInteger;
        t.name = "eye", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, u) {
            function c(e, t) {
                if (!t || t.isIndex !== !0) throw new TypeError("Index expected");
                if (1 != t.size().length) throw new l(t.size().length, 1);
                var n = e.length;
                s(t.min()[0], n), s(t.max()[0], n);
                var r = t.dimension(0),
                    i = "";
                return r.forEach(function (t) {
                    i += e.charAt(t)
                }), i
            }

            function f(e, t, n, r) {
                if (!t || t.isIndex !== !0) throw new TypeError("Index expected");
                if (1 != t.size().length) throw new l(t.size().length, 1);
                if (void 0 !== r) {
                    if ("string" != typeof r || 1 !== r.length) throw new TypeError("Single character expected as defaultValue")
                } else r = " ";
                var i = t.dimension(0),
                    o = i.size()[0];
                if (o != n.length) throw new l(i.size()[0], n.length);
                var a = e.length;
                s(t.min()[0]), s(t.max()[0]);
                for (var u = [], c = 0; c < a; c++) u[c] = e.charAt(c);
                if (i.forEach(function (e, t) {
                        u[e] = n.charAt(t[0])
                    }), u.length > a)
                    for (c = a - 1, o = u.length; c < o; c++) u[c] || (u[c] = r);
                return u.join("")
            }
            var h = r(n(0)),
                p = u("subset", {
                    "Array, Index": function (e, t) {
                        var n = h(e),
                            r = n.subset(t);
                        return t.isScalar() ? r : r.valueOf()
                    },
                    "Matrix, Index": function (e, t) {
                        return e.subset(t)
                    },
                    "Object, Index": i,
                    "string, Index": c,
                    "Array, Index, any": function (e, t, n) {
                        return h(a(e)).subset(t, n, void 0).valueOf()
                    },
                    "Array, Index, any, any": function (e, t, n, r) {
                        return h(a(e)).subset(t, n, r).valueOf()
                    },
                    "Matrix, Index, any": function (e, t, n) {
                        return e.clone().subset(t, n)
                    },
                    "Matrix, Index, any, any": function (e, t, n, r) {
                        return e.clone().subset(t, n, r)
                    },
                    "string, Index, string": f,
                    "string, Index, string, string": f,
                    "Object, Index, any": o
                });
            return p.toTex = void 0, p
        }

        function i(e, t) {
            if (1 !== t.size().length) throw new l(t.size(), 1);
            var n = t.dimension(0);
            if ("string" != typeof n) throw new TypeError("String expected as index to retrieve an object property");
            return u(e, n)
        }

        function o(e, t, n) {
            if (1 !== t.size().length) throw new l(t.size(), 1);
            var r = t.dimension(0);
            if ("string" != typeof r) throw new TypeError("String expected as index to retrieve an object property");
            var i = a(e);
            return c(i, r, n), i
        }
        var a = n(5).clone,
            s = n(3).validateIndex,
            u = n(17).getSafeProperty,
            c = n(17).setSafeProperty,
            l = n(9);
        t.name = "subset", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = e.DenseMatrix,
                l = e.SparseMatrix,
                f = a("transpose", {
                    Array: function (e) {
                        return f(u(e)).valueOf()
                    },
                    Matrix: function (e) {
                        var t, n = e.size();
                        switch (n.length) {
                            case 1:
                                t = e.clone();
                                break;
                            case 2:
                                var r = n[0],
                                    i = n[1];
                                if (0 === i) throw new RangeError("Cannot transpose a 2D matrix with no columns (size: " + o(n) + ")");
                                switch (e.storage()) {
                                    case "dense":
                                        t = h(e, r, i);
                                        break;
                                    case "sparse":
                                        t = p(e, r, i)
                                }
                                break;
                            default:
                                throw new RangeError("Matrix must be a vector or two dimensional (size: " + o(this._size) + ")")
                        }
                        return t
                    },
                    any: function (e) {
                        return i(e)
                    }
                }),
                h = function (e, t, n) {
                    for (var r, o = e._data, a = [], s = 0; s < n; s++) {
                        r = a[s] = [];
                        for (var u = 0; u < t; u++) r[u] = i(o[u][s])
                    }
                    return new c({
                        data: a,
                        size: [n, t],
                        datatype: e._datatype
                    })
                },
                p = function (e, t, n) {
                    for (var r = e._values, o = e._index, a = e._ptr, s = r ? [] : void 0, u = [], c = [], f = [], h = 0; h < t; h++) f[h] = 0;
                    var p, m, d;
                    for (p = 0, m = o.length; p < m; p++) f[o[p]]++;
                    for (var v = 0, g = 0; g < t; g++) c.push(v), v += f[g], f[g] = c[g];
                    for (c.push(v), d = 0; d < n; d++)
                        for (var y = a[d], w = a[d + 1], x = y; x < w; x++) {
                            var b = f[o[x]]++;
                            u[b] = d, r && (s[b] = i(r[x]))
                        }
                    return new l({
                        values: s,
                        index: u,
                        ptr: c,
                        size: [n, t],
                        datatype: e._datatype
                    })
                };
            return f.toTex = {
                1: "\\left(${args[0]}\\right)" + s.operators.transpose
            }, f
        }
        var i = n(5).clone,
            o = n(11).format;
        t.name = "transpose", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("combinations", {
                "number, number": function (e, t) {
                    var n, r, i;
                    if (!o(e) || e < 0) throw new TypeError("Positive integer value expected in function combinations");
                    if (!o(t) || t < 0) throw new TypeError("Positive integer value expected in function combinations");
                    if (t > e) throw new TypeError("k must be less than or equal to n");
                    for (n = Math.max(t, e - t), r = 1, i = 1; i <= e - n; i++) r = r * (n + i) / i;
                    return r
                },
                "BigNumber, BigNumber": function (t, n) {
                    var r, o, a, s, u = new e.BigNumber(1);
                    if (!i(t) || !i(n)) throw new TypeError("Positive integer value expected in function combinations");
                    if (n.gt(t)) throw new TypeError("k must be less than n in function combinations");
                    for (r = t.minus(n), n.lt(r) && (r = n), o = u, a = u, s = t.minus(r); a.lte(s); a = a.plus(1)) o = o.times(r.plus(a)).dividedBy(a);
                    return o
                }
            });
            return a.toTex = {
                2: "\\binom{${args[0]}}{${args[1]}}"
            }, a
        }

        function i(e) {
            return e.isInteger() && e.gte(0)
        }
        var o = n(2).isInteger;
        t.name = "combinations", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(118)),
                s = n(4),
                u = o("factorial", {
                    number: function (e) {
                        if (e < 0) throw new Error("Value must be non-negative");
                        return a(e + 1)
                    },
                    BigNumber: function (e) {
                        if (e.isNegative()) throw new Error("Value must be non-negative");
                        return a(e.plus(1))
                    },
                    "Array | Matrix": function (e) {
                        return i(e, u)
                    }
                });
            return u.toTex = {
                1: "\\left(${args[0]}\\right)" + s.operators.factorial
            }, u
        }
        var i = n(1);
        t.name = "factorial", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(10)),
                s = e.SparseMatrix,
                u = function (e, t, n) {
                    var r = e._values,
                        u = e._index,
                        c = e._ptr,
                        l = e._size,
                        f = e._datatype,
                        h = t._values,
                        p = t._index,
                        m = t._ptr,
                        d = t._size,
                        v = t._datatype;
                    if (l.length !== d.length) throw new i(l.length, d.length);
                    if (l[0] !== d[0] || l[1] !== d[1]) throw new RangeError("Dimension mismatch. Matrix A (" + l + ") must match Matrix B (" + d + ")");
                    var g, y = l[0],
                        w = l[1],
                        x = a,
                        b = 0,
                        C = n;
                    "string" == typeof f && f === v && (g = f, x = o.find(a, [g, g]), b = o.convert(0, g), C = o.find(n, [g, g]));
                    var M, T, N, E, A = r && h ? [] : void 0,
                        S = [],
                        P = [],
                        O = new s({
                            values: A,
                            index: S,
                            ptr: P,
                            size: [y, w],
                            datatype: g
                        }),
                        _ = A ? [] : void 0,
                        I = A ? [] : void 0,
                        B = [],
                        k = [];
                    for (T = 0; T < w; T++) {
                        P[T] = S.length;
                        var V = T + 1;
                        for (N = c[T], E = c[T + 1]; N < E; N++) M = u[N], S.push(M), B[M] = V, _ && (_[M] = r[N]);
                        for (N = m[T], E = m[T + 1]; N < E; N++) M = p[N], B[M] !== V && S.push(M), k[M] = V, I && (I[M] = h[N]);
                        if (A)
                            for (N = P[T]; N < S.length;) {
                                M = S[N];
                                var z = B[M],
                                    F = k[M];
                                if (z === V || F === V) {
                                    var D = z === V ? _[M] : b,
                                        R = F === V ? I[M] : b,
                                        U = C(D, R);
                                    x(U, b) ? S.splice(N, 1) : (A.push(U), N++)
                                }
                            }
                    }
                    return P[w] = S.length, O
                };
            return u
        }
        var i = n(9);
        t.name = "algorithm05", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(10)),
                u = e.SparseMatrix,
                c = function (e, t, n) {
                    var r = e._values,
                        c = e._size,
                        l = e._datatype,
                        f = t._values,
                        h = t._size,
                        p = t._datatype;
                    if (c.length !== h.length) throw new o(c.length, h.length);
                    if (c[0] !== h[0] || c[1] !== h[1]) throw new RangeError("Dimension mismatch. Matrix A (" + c + ") must match Matrix B (" + h + ")");
                    var m, d = c[0],
                        v = c[1],
                        g = s,
                        y = 0,
                        w = n;
                    "string" == typeof l && l === p && (m = l, g = a.find(s, [m, m]), y = a.convert(0, m), w = a.find(n, [m, m]));
                    for (var x = r && f ? [] : void 0, b = [], C = [], M = new u({
                            values: x,
                            index: b,
                            ptr: C,
                            size: [d, v],
                            datatype: m
                        }), T = x ? [] : void 0, N = [], E = [], A = 0; A < v; A++) {
                        C[A] = b.length;
                        var S = A + 1;
                        if (i(e, A, N, T, E, S, M, w), i(t, A, N, T, E, S, M, w), T)
                            for (var P = C[A]; P < b.length;) {
                                var O = b[P];
                                if (E[O] === S) {
                                    var _ = T[O];
                                    g(_, y) ? b.splice(P, 1) : (x.push(_), P++)
                                } else b.splice(P, 1)
                            } else
                                for (var I = C[A]; I < b.length;) {
                                    var B = b[I];
                                    E[B] !== S ? b.splice(I, 1) : I++
                                }
                    }
                    return C[v] = b.length, M
                };
            return c
        }
        var i = n(510),
            o = n(9);
        t.name = "algorithm06", t.factory = r
    }, function (e, t, n) {
        "use strict";
        var r = n(42);
        e.exports = function (e) {
            for (var t = 0; t < e.length; t++)
                if (r(e[t])) return !0;
            return !1
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n) {
            var o, a, s, u;
            if (t <= 0) {
                if (Array.isArray(e[0])) {
                    for (u = i(e), a = [], o = 0; o < u.length; o++) a[o] = r(u[o], t - 1, n);
                    return a
                }
                for (s = e[0], o = 1; o < e.length; o++) s = n(s, e[o]);
                return s
            }
            for (a = [], o = 0; o < e.length; o++) a[o] = r(e[o], t - 1, n);
            return a
        }

        function i(e) {
            var t, n, r = e.length,
                i = e[0].length,
                o = [];
            for (n = 0; n < i; n++) {
                var a = [];
                for (t = 0; t < r; t++) a.push(e[t][n]);
                o.push(a)
            }
            return o
        }
        var o = n(3).size,
            a = n(44);
        e.exports = function (e, t, n) {
            var i = Array.isArray(e) ? o(e) : e.size();
            if (t < 0 || t >= i.length) throw new a(t, i.length);
            return e && e.isMatrix === !0 ? e.create(r(e.valueOf(), t, n)) : r(e, t, n)
        }
    }, function (e, t, n) {
        "use strict";
        t.type = function (e) {
            var t = typeof e;
            return "object" === t ? null === e ? "null" : e instanceof Boolean ? "boolean" : e instanceof Number ? "number" : e instanceof String ? "string" : Array.isArray(e) ? "Array" : e instanceof Date ? "Date" : e instanceof RegExp ? "RegExp" : "Object" : "function" === t ? "Function" : t
        }, t.isScalar = function (e) {
            return !(e && e.isMatrix || Array.isArray(e))
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = {
            end: !0
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                if (this.items = e || [], !Array.isArray(this.items) || !this.items.every(function (e) {
                        return e && e.isNode
                    })) throw new TypeError("Array containing Nodes expected");
                var t = function () {
                    throw new Error("Property `ArrayNode.nodes` is deprecated, use `ArrayNode.items` instead")
                };
                Object.defineProperty(this, "nodes", {
                    get: t,
                    set: t
                })
            }

            function u(e, t, n) {
                if (!(e instanceof s)) throw new TypeError("No valid ArrayNode");
                var r = "Array" !== t.math.config().matrix,
                    a = i(e.items, function (e) {
                        return l(e, t, n)
                    });
                return (r ? "math.matrix([" : "[") + o(a, ",") + (r ? "])" : "]")
            }
            var c = r(n(7)).register,
                l = r(n(7)).compile,
                f = r(n(13));
            return s.prototype = new f, s.prototype.type = "ArrayNode", s.prototype.isArrayNode = !0, c(s.prototype.type, u), s.prototype.forEach = function (e) {
                for (var t = 0; t < this.items.length; t++) {
                    var n = this.items[t];
                    e(n, "items[" + t + "]", this)
                }
            }, s.prototype.map = function (e) {
                for (var t = [], n = 0; n < this.items.length; n++) t[n] = this._ifNode(e(this.items[n], "items[" + n + "]", this));
                return new s(t)
            }, s.prototype.clone = function () {
                return new s(this.items.slice(0))
            }, s.prototype._toString = function (e) {
                var t = this.items.map(function (t) {
                    return t.toString(e)
                });
                return "[" + t.join(", ") + "]"
            }, s.prototype._toTex = function (e) {
                var t = "\\begin{bmatrix}";
                return this.items.forEach(function (n) {
                    t += n.items ? n.items.map(function (t) {
                        return t.toTex(e)
                    }).join("&") : n.toTex(e), t += "\\\\"
                }), t += "\\end{bmatrix}"
            }, s
        }
        var i = n(3).map,
            o = n(3).join;
        t.name = "ArrayNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e, t) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                if (this.dimensions = e, this.dotNotation = t || !1, !p(e) || !e.every(function (e) {
                        return e && e.isNode
                    })) throw new TypeError('Array containing Nodes expected for parameter "dimensions"');
                if (this.dotNotation && !this.isObjectProperty()) throw new Error("dotNotation only applicable for object properties");
                var n = function () {
                    throw new Error("Property `IndexNode.object` is deprecated, use `IndexNode.fn` instead")
                };
                Object.defineProperty(this, "object", {
                    get: n,
                    set: n
                })
            }

            function u(e, t, n) {
                if (!(e instanceof s)) throw new TypeError("No valid IndexNode");
                var r = Object.create(n);
                t.range = function (e, t, n) {
                    return new h(e && e.isBigNumber === !0 ? e.toNumber() : e, t && t.isBigNumber === !0 ? t.toNumber() : t, n && n.isBigNumber === !0 ? n.toNumber() : n)
                };
                var a = i(e.dimensions, function (e, n) {
                    return e && e.isRangeNode ? e.needsEnd() ? (r.end = "end", "(function () {var end = size[" + n + "]; return range(" + l(e.start, t, r) + ", " + l(e.end, t, r) + ", " + (e.step ? l(e.step, t, r) : "1") + "); })()") : "range(" + l(e.start, t, r) + ", " + l(e.end, t, r) + ", " + (e.step ? l(e.step, t, r) : "1") + ")" : e.isSymbolNode && "end" === e.name ? (r.end = "end", "(function () {var end = size[" + n + "]; return " + l(e, t, r) + "; })()") : l(e, t, r)
                });
                return "math.index(" + o(a, ", ") + ")"
            }
            var c = r(n(7)).register,
                l = r(n(7)).compile,
                f = r(n(13)),
                h = (r(n(67)), r(n(27)), r(n(134))),
                p = Array.isArray;
            return s.prototype = new f, s.prototype.type = "IndexNode", s.prototype.isIndexNode = !0, c(s.prototype.type, u), s.prototype.forEach = function (e) {
                for (var t = 0; t < this.dimensions.length; t++) e(this.dimensions[t], "dimensions[" + t + "]", this)
            }, s.prototype.map = function (e) {
                for (var t = [], n = 0; n < this.dimensions.length; n++) t[n] = this._ifNode(e(this.dimensions[n], "dimensions[" + n + "]", this));
                return new s(t)
            }, s.prototype.clone = function () {
                return new s(this.dimensions.slice(0))
            }, s.prototype.isObjectProperty = function () {
                return 1 === this.dimensions.length && this.dimensions[0].isConstantNode && "string" === this.dimensions[0].valueType
            }, s.prototype.getObjectProperty = function () {
                return this.isObjectProperty() ? this.dimensions[0].value : null
            }, s.prototype._toString = function (e) {
                return this.dotNotation ? "." + this.getObjectProperty() : "[" + this.dimensions.join(", ") + "]"
            }, s.prototype._toTex = function (e) {
                var t = this.dimensions.map(function (t) {
                    return t.toTex(e)
                });
                return this.dotNotation ? "." + this.getObjectProperty() : "_{" + t.join(",") + "}"
            }, s.prototype.needsSize = function () {
                return this.dimensions.some(function (e) {
                    return e.isRangeNode && e.needsEnd() || e.isSymbolNode && "end" === e.name
                })
            }, s
        }
        var i = n(3).map,
            o = n(3).join;
        t.name = "IndexNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t, n) {
                if (!(this instanceof a)) throw new SyntaxError("Constructor must be called with the new operator");
                if (!e || !e.isNode) throw new TypeError("Node expected");
                if (!t || !t.isNode) throw new TypeError("Node expected");
                if (n && (!n || !n.isNode)) throw new TypeError("Node expected");
                if (arguments.length > 3) throw new Error("Too many arguments");
                this.start = e, this.end = t, this.step = n || null
            }

            function s(e, t, n) {
                if (!(e instanceof a)) throw new TypeError("No valid RangeNode");
                return "math.range(" + l(e.start, t, n) + ", " + l(e.end, t, n) + (e.step ? ", " + l(e.step, t, n) : "") + ")"
            }

            function u(e, t) {
                var n = i.getPrecedence(e, t),
                    r = {},
                    o = i.getPrecedence(e.start, t);
                if (r.start = null !== o && o <= n || "all" === t, e.step) {
                    var a = i.getPrecedence(e.step, t);
                    r.step = null !== a && a <= n || "all" === t
                }
                var s = i.getPrecedence(e.end, t);
                return r.end = null !== s && s <= n || "all" === t, r
            }
            var c = r(n(7)).register,
                l = r(n(7)).compile,
                f = r(n(13));
            return a.prototype = new f, a.prototype.type = "RangeNode", a.prototype.isRangeNode = !0, a.prototype.needsEnd = function () {
                var e = this.filter(function (e) {
                    return e && e.isSymbolNode && "end" == e.name
                });
                return e.length > 0
            }, c(a.prototype.type, s), a.prototype.forEach = function (e) {
                e(this.start, "start", this), e(this.end, "end", this), this.step && e(this.step, "step", this)
            }, a.prototype.map = function (e) {
                return new a(this._ifNode(e(this.start, "start", this)), this._ifNode(e(this.end, "end", this)), this.step && this._ifNode(e(this.step, "step", this)))
            }, a.prototype.clone = function () {
                return new a(this.start, this.end, this.step && this.step)
            }, a.prototype._toString = function (e) {
                var t, n = e && e.parenthesis ? e.parenthesis : "keep",
                    r = u(this, n),
                    i = this.start.toString(e);
                if (r.start && (i = "(" + i + ")"), t = i, this.step) {
                    var o = this.step.toString(e);
                    r.step && (o = "(" + o + ")"), t += ":" + o
                }
                var a = this.end.toString(e);
                return r.end && (a = "(" + a + ")"), t += ":" + a
            }, a.prototype._toTex = function (e) {
                var t = e && e.parenthesis ? e.parenthesis : "keep",
                    n = u(this, t),
                    r = this.start.toTex(e);
                if (n.start && (r = "\\left(" + r + "\\right)"), this.step) {
                    var i = this.step.toTex(e);
                    n.step && (i = "\\left(" + i + "\\right)"), r += ":" + i
                }
                var o = this.end.toTex(e);
                return n.end && (o = "\\left(" + o + "\\right)"), r += ":" + o
            }, a
        }
        var i = n(47);
        t.name = "RangeNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e) {
            var t = e.DenseMatrix,
                n = function (e, n, r) {
                    var i = e.size();
                    if (2 !== i.length) throw new RangeError("Matrix must be two dimensional (size: " + o.format(i) + ")");
                    var u = i[0],
                        c = i[1];
                    if (u !== c) throw new RangeError("Matrix must be square (size: " + o.format(i) + ")");
                    var l, f, h;
                    if (n && n.isMatrix === !0) {
                        var p = n.size();
                        if (1 === p.length) {
                            if (p[0] !== u) throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
                            for (l = [], h = n._data, f = 0; f < u; f++) l[f] = [h[f]];
                            return new t({
                                data: l,
                                size: [u, 1],
                                datatype: n._datatype
                            })
                        }
                        if (2 === p.length) {
                            if (p[0] !== u || 1 !== p[1]) throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
                            if (n.isDenseMatrix === !0) {
                                if (r) {
                                    for (l = [], h = n._data, f = 0; f < u; f++) l[f] = [h[f][0]];
                                    return new t({
                                        data: l,
                                        size: [u, 1],
                                        datatype: n._datatype
                                    })
                                }
                                return n
                            }
                            for (l = [], f = 0; f < u; f++) l[f] = [0];
                            for (var m = n._values, d = n._index, v = n._ptr, g = v[1], y = v[0]; y < g; y++) f = d[y], l[f][0] = m[y];
                            return new t({
                                data: l,
                                size: [u, 1],
                                datatype: n._datatype
                            })
                        }
                        throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
                    }
                    if (s(n)) {
                        var w = a.size(n);
                        if (1 === w.length) {
                            if (w[0] !== u) throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
                            for (l = [], f = 0; f < u; f++) l[f] = [n[f]];
                            return new t({
                                data: l,
                                size: [u, 1]
                            })
                        }
                        if (2 === w.length) {
                            if (w[0] !== u || 1 !== w[1]) throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
                            for (l = [], f = 0; f < u; f++) l[f] = [n[f][0]];
                            return new t({
                                data: l,
                                size: [u, 1]
                            })
                        }
                        throw new RangeError("Dimension mismatch. Matrix columns must match vector length.")
                    }
                };
            return n
        }
        var i = n(25),
            o = i.string,
            a = i.array,
            s = Array.isArray;
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e) {
                return -e - 2
            };
            return e
        }
        t.name = "cs_flip", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t) {
                return -c(e, t)
            }

            function s(e, t, n) {
                if (!i(t) || t < 0) throw new Error("k must be a non-negative integer");
                if (e && e.isMatrix) {
                    var r = e.size();
                    if (r.length > 1) throw new Error("Only one dimensional matrices supported");
                    return u(e.valueOf(), t, n)
                }
                if (Array.isArray(e)) return u(e, t, n)
            }

            function u(e, t, n) {
                if (t >= e.length) throw new Error("k out of bounds");
                for (var r = 0, i = e.length - 1; r < i;) {
                    for (var o = r, a = i, s = e[Math.floor(Math.random() * (i - r + 1)) + r]; o < a;)
                        if (n(e[o], s) >= 0) {
                            var u = e[a];
                            e[a] = e[o], e[o] = u, --a
                        } else ++o;
                    n(e[o], s) > 0 && --o, t <= o ? i = o : r = o + 1
                }
                return e[t]
            }
            var c = r(n(49));
            return o("partitionSelect", {
                "Array | Matrix, number": function (e, t) {
                    return s(e, t, c)
                },
                "Array | Matrix, number, string": function (e, t, n) {
                    if ("asc" === n) return s(e, t, c);
                    if ("desc" === n) return s(e, t, a);
                    throw new Error('Compare string must be "asc" or "desc"')
                },
                "Array | Matrix, number, function": s
            })
        }
        var i = n(2).isInteger;
        t.name = "partitionSelect", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s, u) {
            function c(e) {
                if (!p.hasOwnProperty(e)) throw new Error("Unknown distribution " + e);
                var t = Array.prototype.slice.call(arguments, 1),
                    n = p[e].apply(this, t);
                return function (e) {
                    var t = {
                            random: function (e, t, n) {
                                var s, u, f;
                                if (arguments.length > 3) throw new i("random", arguments.length, 0, 3);
                                if (1 === arguments.length ? o(e) ? s = e : f = e : 2 === arguments.length ? o(e) ? (s = e, f = t) : (u = e, f = t) : (s = e, u = t, f = n), void 0 !== u && !a(u) || void 0 !== f && !a(f)) throw new TypeError("Invalid argument in function random");
                                if (void 0 === f && (f = 1), void 0 === u && (u = 0), void 0 !== s) {
                                    var h = c(s.valueOf(), u, f, r);
                                    return s && s.isMatrix === !0 ? l(h) : h
                                }
                                return r(u, f)
                            },
                            randomInt: s({
                                "number | Array": function (e) {
                                    var t = 0;
                                    if (o(e)) {
                                        var n = e,
                                            r = 1,
                                            i = c(n.valueOf(), t, r, u);
                                        return n && n.isMatrix === !0 ? l(i) : i
                                    }
                                    var r = e;
                                    return u(t, r)
                                },
                                "number | Array, number": function (e, t) {
                                    if (o(e)) {
                                        var n = e,
                                            r = t,
                                            i = 0,
                                            a = c(n.valueOf(), i, r, u);
                                        return n && n.isMatrix === !0 ? l(a) : a
                                    }
                                    var i = e,
                                        r = t;
                                    return u(i, r)
                                },
                                "Array, number, number": function (e, t, n) {
                                    var r = c(e.valueOf(), t, n, u);
                                    return e && e.isMatrix === !0 ? l(r) : r
                                }
                            }),
                            pickRandom: s({
                                Array: function (e) {
                                    return n(e)
                                },
                                "Array, number | Array": function (e, t) {
                                    var r, i;
                                    if (Array.isArray(t)) i = t;
                                    else {
                                        if (!a(t)) throw new TypeError("Invalid argument in function pickRandom");
                                        r = t
                                    }
                                    return n(e, r, i)
                                },
                                "Array, number | Array, Array | number": function (e, t, r) {
                                    var i, o;
                                    if (Array.isArray(t) ? (o = t, i = r) : (o = r, i = t), !Array.isArray(o) || !a(i)) throw new TypeError("Invalid argument in function pickRandom");
                                    return n(e, i, o)
                                }
                            })
                        },
                        n = function (e, t, n) {
                            var r = "undefined" == typeof t;
                            if (r && (t = 1), e && e.isMatrix === !0) e = e.valueOf();
                            else if (!Array.isArray(e)) throw new TypeError("Unsupported type of value in function pickRandom");
                            if (f.size(e).length > 1) throw new Error("Only one dimensional vectors supported");
                            if ("undefined" != typeof n) {
                                if (n.length != e.length) throw new Error("Weights must have the same length as possibles");
                                for (var i = 0, o = 0, s = n.length; o < s; o++) {
                                    if (!a(n[o]) || n[o] < 0) throw new Error("Weights must be an array of positive numbers");
                                    i += n[o]
                                }
                            }
                            var u = e.length;
                            if (0 == u) return [];
                            if (t >= u) return e;
                            for (var c, l = []; l.length < t;) {
                                if ("undefined" == typeof n) c = e[Math.floor(h() * u)];
                                else
                                    for (var p = h() * i, o = 0, s = e.length; o < s; o++)
                                        if (p -= n[o], p < 0) {
                                            c = e[o];
                                            break
                                        } l.indexOf(c) == -1 && l.push(c)
                            }
                            return r ? l[0] : l
                        },
                        r = function (t, n) {
                            return t + e() * (n - t)
                        },
                        u = function (t, n) {
                            return Math.floor(t + e() * (n - t))
                        },
                        c = function (e, t, n, r) {
                            var i, o, a = [];
                            if (e = e.slice(0), e.length > 1)
                                for (var o = 0, i = e.shift(); o < i; o++) a.push(c(e, t, n, r));
                            else
                                for (var o = 0, i = e.shift(); o < i; o++) a.push(r(t, n));
                            return a
                        };
                    return t
                }(n)
            }
            var l = r(n(0)),
                f = n(3),
                h = r(n(430)),
                p = {
                    uniform: function () {
                        return h
                    },
                    normal: function () {
                        return function () {
                            for (var e, t, n = -1; n < 0 || n > 1;) e = h(), t = h(), n = 1 / 6 * Math.pow(-2 * Math.log(e), .5) * Math.cos(2 * Math.PI * t) + .5;
                            return n
                        }
                    }
                };
            return c.toTex = void 0, c
        }
        var i = n(43),
            o = n(42),
            a = n(2).isNumber;
        t.name = "distribution", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(10)),
                s = r(n(14)),
                u = r(n(24)),
                c = r(n(16)),
                l = r(n(8)),
                f = r(n(6)),
                h = n(4),
                p = i("equal", {
                    "any, any": function (e, t) {
                        return null === e ? null === t : null === t ? null === e : void 0 === e ? void 0 === t : void 0 === t ? void 0 === e : a(e, t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, a);
                                        break;
                                    default:
                                        n = s(t, e, a, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = s(e, t, a, !1);
                                        break;
                                    default:
                                        n = l(e, t, a)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return p(o(e), o(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return p(o(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return p(e, o(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = c(e, t, a, !1);
                                break;
                            default:
                                n = f(e, t, a, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = c(t, e, a, !0);
                                break;
                            default:
                                n = f(t, e, a, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return f(o(e), t, a, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return f(o(t), e, a, !0).valueOf()
                    }
                });
            return p.toTex = {
                2: "\\left(${args[0]}" + h.operators.equal + "${args[1]}\\right)"
            }, p
        }
        t.name = "equal", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("isNumeric", {
                "number | BigNumber | Fraction | boolean": function () {
                    return !0
                },
                "Complex | Unit | string": function () {
                    return !1
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        n(2), t.name = "isNumeric", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("isZero", {
                number: function (e) {
                    return 0 === e
                },
                BigNumber: function (e) {
                    return e.isZero()
                },
                Complex: function (e) {
                    return 0 === e.re && 0 === e.im
                },
                Fraction: function (e) {
                    return 1 === e.d && 0 === e.n
                },
                Unit: function (e) {
                    return o(e.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        n(2), t.name = "isZero", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function i() {
                if (!(this instanceof i)) throw new SyntaxError("Constructor must be called with the new operator")
            }
            return i.prototype.type = "Matrix", i.prototype.isMatrix = !0, i.storage = function (e) {
                if (!a(e)) throw new TypeError("format must be a string value");
                var t = i._storage[e];
                if (!t) throw new SyntaxError("Unsupported matrix storage format: " + e);
                return t
            }, i._storage = {}, i.prototype.storage = function () {
                throw new Error("Cannot invoke storage on a Matrix interface")
            }, i.prototype.datatype = function () {
                throw new Error("Cannot invoke datatype on a Matrix interface")
            }, i.prototype.create = function (e, t) {
                throw new Error("Cannot invoke create on a Matrix interface")
            }, i.prototype.subset = function (e, t, n) {
                throw new Error("Cannot invoke subset on a Matrix interface")
            }, i.prototype.get = function (e) {
                throw new Error("Cannot invoke get on a Matrix interface")
            }, i.prototype.set = function (e, t, n) {
                throw new Error("Cannot invoke set on a Matrix interface")
            }, i.prototype.resize = function (e, t) {
                throw new Error("Cannot invoke resize on a Matrix interface")
            }, i.prototype.reshape = function (e, t) {
                throw new Error("Cannot invoke reshape on a Matrix interface")
            }, i.prototype.clone = function () {
                throw new Error("Cannot invoke clone on a Matrix interface")
            }, i.prototype.size = function () {
                throw new Error("Cannot invoke size on a Matrix interface")
            }, i.prototype.map = function (e, t) {
                throw new Error("Cannot invoke map on a Matrix interface")
            }, i.prototype.forEach = function (e) {
                throw new Error("Cannot invoke forEach on a Matrix interface")
            }, i.prototype.toArray = function () {
                throw new Error("Cannot invoke toArray on a Matrix interface")
            }, i.prototype.valueOf = function () {
                throw new Error("Cannot invoke valueOf on a Matrix interface")
            }, i.prototype.format = function (e) {
                throw new Error("Cannot invoke format on a Matrix interface")
            }, i.prototype.toString = function () {
                throw new Error("Cannot invoke toString on a Matrix interface")
            }, i
        }
        var i = n(25),
            o = i.string,
            a = o.isString;
        t.name = "Matrix", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(10)),
                s = e.SparseMatrix,
                u = function (e, t, n) {
                    var r = e._values,
                        u = e._index,
                        c = e._ptr,
                        l = e._size,
                        f = e._datatype,
                        h = t._values,
                        p = t._index,
                        m = t._ptr,
                        d = t._size,
                        v = t._datatype;
                    if (l.length !== d.length) throw new i(l.length, d.length);
                    if (l[0] !== d[0] || l[1] !== d[1]) throw new RangeError("Dimension mismatch. Matrix A (" + l + ") must match Matrix B (" + d + ")");
                    var g, y = l[0],
                        w = l[1],
                        x = a,
                        b = 0,
                        C = n;
                    "string" == typeof f && f === v && (g = f, x = o.find(a, [g, g]), b = o.convert(0, g), C = o.find(n, [g, g]));
                    var M, T, N, E, A, S = r && h ? [] : void 0,
                        P = [],
                        O = [],
                        _ = new s({
                            values: S,
                            index: P,
                            ptr: O,
                            size: [y, w],
                            datatype: g
                        }),
                        I = r && h ? [] : void 0,
                        B = r && h ? [] : void 0,
                        k = [],
                        V = [];
                    for (T = 0; T < w; T++) {
                        O[T] = P.length;
                        var z = T + 1;
                        for (E = c[T], A = c[T + 1], N = E; N < A; N++) M = u[N], P.push(M), k[M] = z, I && (I[M] = r[N]);
                        for (E = m[T], A = m[T + 1], N = E; N < A; N++)
                            if (M = p[N], k[M] === z) {
                                if (I) {
                                    var F = C(I[M], h[N]);
                                    x(F, b) ? k[M] = null : I[M] = F
                                }
                            } else P.push(M), V[M] = z, B && (B[M] = h[N]);
                        if (I && B)
                            for (N = O[T]; N < P.length;) M = P[N], k[M] === z ? (S[N] = I[M], N++) : V[M] === z ? (S[N] = B[M], N++) : P.splice(N, 1)
                    }
                    return O[w] = P.length, _
                };
            return u
        }
        var i = n(9);
        t.name = "algorithm04", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(10)),
                s = e.SparseMatrix,
                u = function (e, t, n) {
                    var r = e._values,
                        u = e._index,
                        c = e._ptr,
                        l = e._size,
                        f = e._datatype,
                        h = t._values,
                        p = t._index,
                        m = t._ptr,
                        d = t._size,
                        v = t._datatype;
                    if (l.length !== d.length) throw new i(l.length, d.length);
                    if (l[0] !== d[0] || l[1] !== d[1]) throw new RangeError("Dimension mismatch. Matrix A (" + l + ") must match Matrix B (" + d + ")");
                    if (!r || !h) throw new Error("Cannot perform operation on Pattern Sparse Matrices");
                    var g, y = l[0],
                        w = l[1],
                        x = a,
                        b = 0,
                        C = n;
                    "string" == typeof f && f === v && (g = f, x = o.find(a, [g, g]), b = o.convert(0, g), C = o.find(n, [g, g]));
                    for (var M, T, N, E, A = [], S = [], P = [], O = new s({
                            values: A,
                            index: S,
                            ptr: P,
                            size: [y, w],
                            datatype: g
                        }), _ = [], I = [], B = 0; B < w; B++) {
                        P[B] = S.length;
                        var k = B + 1;
                        for (T = c[B], N = c[B + 1], M = T; M < N; M++) E = u[M], I[E] = k, _[E] = r[M], S.push(E);
                        for (T = m[B], N = m[B + 1], M = T; M < N; M++) E = p[M], I[E] === k && (_[E] = C(_[E], h[M]));
                        for (M = P[B]; M < S.length;) {
                            E = S[M];
                            var V = _[E];
                            x(V, b) ? S.splice(M, 1) : (A.push(V), M++)
                        }
                    }
                    return P[w] = S.length, O
                };
            return u
        }
        var i = n(9);
        t.name = "algorithm08", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("number", {
                "": function () {
                    return 0
                },
                number: function (e) {
                    return e
                },
                string: function (e) {
                    var t = Number(e);
                    if (isNaN(t)) throw new SyntaxError('String "' + e + '" is no valid number');
                    return t
                },
                BigNumber: function (e) {
                    return e.toNumber()
                },
                Fraction: function (e) {
                    return e.valueOf()
                },
                Unit: function (e) {
                    throw new Error("Second argument with valueless unit expected")
                },
                "Unit, string | Unit": function (e, t) {
                    return e.toNumber(t)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                0: "0",
                1: "\\left(${args[0]}\\right)",
                2: "\\left(\\left(${args[0]}\\right)${args[1]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "number", t.factory = r
    }, function (e, t) {
        e.exports = function (e) {
            if (e.isFinite() && !e.isInteger()) throw new Error("Integer expected in function bitNot");
            var t = e.constructor,
                n = t.precision;
            t.config({
                precision: 1e9
            });
            var e = e.plus(new t(1));
            return e.s = -e.s || null, t.config({
                precision: n
            }), e
        }
    }, function (e, t, n) {
        function r(e) {
            for (var t = e.d, n = t[0] + "", r = 1; r < t.length; ++r) {
                for (var i = t[r] + "", o = 7 - i.length; o--;) i = "0" + i;
                n += i
            }
            var a;
            for (a = n.length - 1;
                "0" == n.charAt(a); --a);
            var s = e.e,
                u = n.slice(0, a + 1 || 1),
                c = u.length;
            if (s > 0)
                if (++s > c)
                    for (s -= c; s--; u += "0");
                else s < c && (u = u.slice(0, s) + "." + u.slice(s));
            for (var l = [0], r = 0; r < u.length;) {
                for (var f = l.length; f--; l[f] *= 10);
                l[0] += u.charAt(r++) << 0;
                for (var a = 0; a < l.length; ++a) l[a] > 1 && (null == l[a + 1] && (l[a + 1] = 0), l[a + 1] += l[a] >> 1, l[a] &= 1)
            }
            return l.reverse()
        }
        var i = n(79);
        e.exports = function (e, t, n) {
            var o, a, s = e.constructor,
                u = +(e.s < 0),
                c = +(t.s < 0);
            if (u) {
                o = r(i(e));
                for (var l = 0; l < o.length; ++l) o[l] ^= 1
            } else o = r(e);
            if (c) {
                a = r(i(t));
                for (var l = 0; l < a.length; ++l) a[l] ^= 1
            } else a = r(t);
            var f, h, p;
            o.length <= a.length ? (f = o, h = a, p = u) : (f = a, h = o, p = c);
            var m = f.length,
                d = h.length,
                v = 1 ^ n(u, c),
                g = new s(1 ^ v),
                y = new s(1),
                w = new s(2),
                x = s.precision;
            for (s.config({
                    precision: 1e9
                }); m > 0;) n(f[--m], h[--d]) == v && (g = g.plus(y)), y = y.times(w);
            for (; d > 0;) n(p, h[--d]) == v && (g = g.plus(y)), y = y.times(w);
            return s.config({
                precision: x
            }), 0 == v && (g.s = -g.s), g
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a, s) {
            function u() {
                if (!(this instanceof u)) throw new SyntaxError("Constructor must be called with the new operator");
                this.scope = {}
            }
            var c = r(n(30));
            return u.prototype.type = "Parser", u.prototype.isParser = !0, u.prototype.parse = function (e) {
                throw new Error("Parser.parse is deprecated. Use math.parse instead.")
            }, u.prototype.compile = function (e) {
                throw new Error("Parser.compile is deprecated. Use math.compile instead.")
            }, u.prototype.eval = function (e) {
                return c(e).compile().eval(this.scope)
            }, u.prototype.get = function (e) {
                return e in this.scope ? o.getSafeProperty(this.scope, e) : void 0
            }, u.prototype.getAll = function () {
                return i({}, this.scope)
            }, u.prototype.set = function (e, t) {
                return o.setSafeProperty(this.scope, e, t)
            }, u.prototype.remove = function (e) {
                delete this.scope[e]
            }, u.prototype.clear = function () {
                for (var e in this.scope) this.scope.hasOwnProperty(e) && delete this.scope[e]
            }, u
        }
        var i = n(5).extend,
            o = n(17);
        t.name = "Parser", t.path = "expression", t.factory = r, t.math = !0
    }, function (e, t) {
        e.exports = {
            name: "e",
            category: "Constants",
            syntax: ["e"],
            description: "Euler's number, the base of the natural logarithm. Approximately equal to 2.71828",
            examples: ["e", "e ^ 2", "exp(2)", "log(e)"],
            seealso: ["exp"]
        }
    }, function (e, t) {
        e.exports = {
            name: "pi",
            category: "Constants",
            syntax: ["pi"],
            description: "The number pi is a mathematical constant that is the ratio of a circle's circumference to its diameter, and is approximately equal to 3.14159",
            examples: ["pi", "sin(pi/2)"],
            seealso: ["tau"]
        }
    }, function (e, t, n) {
        function r(e, t, r, i) {
            var o = {};
            return o.bignumber = n(164), o.boolean = n(165), o.complex = n(166), o.createUnit = n(167), o.fraction = n(168), o.index = n(169), o.matrix = n(170), o.number = n(171), o.sparse = n(172), o.splitUnit = n(173), o.string = n(174), o.unit = n(175), o.e = n(82), o.E = n(82), o.false = n(157), o.i = n(158), o.Infinity = n(149), o.LN2 = n(151), o.LN10 = n(150), o.LOG2E = n(153), o.LOG10E = n(152), o.NaN = n(154), o.null = n(159), o.pi = n(83), o.PI = n(83), o.phi = n(160), o.SQRT1_2 = n(155), o.SQRT2 = n(156), o.tau = n(161), o.true = n(162), o.version = n(163), o.speedOfLight = {
                description: "Speed of light in vacuum",
                examples: ["speedOfLight"]
            }, o.gravitationConstant = {
                description: "Newtonian constant of gravitation",
                examples: ["gravitationConstant"]
            }, o.planckConstant = {
                description: "Planck constant",
                examples: ["planckConstant"]
            }, o.reducedPlanckConstant = {
                description: "Reduced Planck constant",
                examples: ["reducedPlanckConstant"]
            }, o.magneticConstant = {
                description: "Magnetic constant (vacuum permeability)",
                examples: ["magneticConstant"]
            }, o.electricConstant = {
                description: "Electric constant (vacuum permeability)",
                examples: ["electricConstant"]
            }, o.vacuumImpedance = {
                description: "Characteristic impedance of vacuum",
                examples: ["vacuumImpedance"]
            }, o.coulomb = {
                description: "Coulomb's constant",
                examples: ["coulomb"]
            }, o.elementaryCharge = {
                description: "Elementary charge",
                examples: ["elementaryCharge"]
            }, o.bohrMagneton = {
                description: "Borh magneton",
                examples: ["bohrMagneton"]
            }, o.conductanceQuantum = {
                description: "Conductance quantum",
                examples: ["conductanceQuantum"]
            }, o.inverseConductanceQuantum = {
                description: "Inverse conductance quantum",
                examples: ["inverseConductanceQuantum"]
            }, o.magneticFluxQuantum = {
                description: "Magnetic flux quantum",
                examples: ["magneticFluxQuantum"]
            }, o.nuclearMagneton = {
                description: "Nuclear magneton",
                examples: ["nuclearMagneton"]
            }, o.klitzing = {
                description: "Von Klitzing constant",
                examples: ["klitzing"]
            }, o.bohrRadius = {
                description: "Borh radius",
                examples: ["bohrRadius"]
            }, o.classicalElectronRadius = {
                description: "Classical electron radius",
                examples: ["classicalElectronRadius"]
            }, o.electronMass = {
                description: "Electron mass",
                examples: ["electronMass"]
            }, o.fermiCoupling = {
                description: "Fermi coupling constant",
                examples: ["fermiCoupling"]
            }, o.fineStructure = {
                description: "Fine-structure constant",
                examples: ["fineStructure"]
            }, o.hartreeEnergy = {
                description: "Hartree energy",
                examples: ["hartreeEnergy"]
            }, o.protonMass = {
                description: "Proton mass",
                examples: ["protonMass"]
            }, o.deuteronMass = {
                description: "Deuteron Mass",
                examples: ["deuteronMass"]
            }, o.neutronMass = {
                description: "Neutron mass",
                examples: ["neutronMass"]
            }, o.quantumOfCirculation = {
                description: "Quantum of circulation",
                examples: ["quantumOfCirculation"]
            }, o.rydberg = {
                description: "Rydberg constant",
                examples: ["rydberg"]
            }, o.thomsonCrossSection = {
                description: "Thomson cross section",
                examples: ["thomsonCrossSection"]
            }, o.weakMixingAngle = {
                description: "Weak mixing angle",
                examples: ["weakMixingAngle"]
            }, o.efimovFactor = {
                description: "Efimov factor",
                examples: ["efimovFactor"]
            }, o.atomicMass = {
                description: "Atomic mass constant",
                examples: ["atomicMass"]
            }, o.avogadro = {
                description: "Avogadro's number",
                examples: ["avogadro"]
            }, o.boltzmann = {
                description: "Boltzmann constant",
                examples: ["boltzmann"]
            }, o.faraday = {
                description: "Faraday constant",
                examples: ["faraday"]
            }, o.firstRadiation = {
                description: "First radiation constant",
                examples: ["firstRadiation"]
            }, o.loschmidt = {
                description: "Loschmidt constant at T=273.15 K and p=101.325 kPa",
                examples: ["loschmidt"]
            }, o.gasConstant = {
                description: "Gas constant",
                examples: ["gasConstant"]
            }, o.molarPlanckConstant = {
                description: "Molar Planck constant",
                examples: ["molarPlanckConstant"]
            }, o.molarVolume = {
                description: "Molar volume of an ideal gas at T=273.15 K and p=101.325 kPa",
                examples: ["molarVolume"]
            }, o.sackurTetrode = {
                description: "Sackur-Tetrode constant at T=1 K and p=101.325 kPa",
                examples: ["sackurTetrode"]
            }, o.secondRadiation = {
                description: "Second radiation constant",
                examples: ["secondRadiation"]
            }, o.stefanBoltzmann = {
                description: "Stefan-Boltzmann constant",
                examples: ["stefanBoltzmann"]
            }, o.wienDisplacement = {
                description: "Wien displacement law constant",
                examples: ["wienDisplacement"]
            }, o.molarMass = {
                description: "Molar mass constant",
                examples: ["molarMass"]
            }, o.molarMassC12 = {
                description: "Molar mass constant of carbon-12",
                examples: ["molarMassC12"]
            }, o.gravity = {
                description: "Standard acceleration of gravity (standard acceleration of free-fall on Earth)",
                examples: ["gravity"]
            }, o.planckLength = {
                description: "Planck length",
                examples: ["planckLength"]
            }, o.planckMass = {
                description: "Planck mass",
                examples: ["planckMass"]
            }, o.planckTime = {
                description: "Planck time",
                examples: ["planckTime"]
            }, o.planckCharge = {
                description: "Planck charge",
                examples: ["planckCharge"]
            }, o.planckTemperature = {
                description: "Planck temperature",
                examples: ["planckTemperature"]
            }, o.derivative = n(179), o.lsolve = n(180), o.lup = n(181), o.lusolve = n(182), o.simplify = n(184), o.slu = n(185), o.usolve = n(186), o.qr = n(183), o.abs = n(187), o.add = n(188), o.cbrt = n(189), o.ceil = n(190), o.cube = n(191), o.divide = n(192), o.dotDivide = n(193), o.dotMultiply = n(194), o.dotPow = n(195), o.exp = n(196), o.fix = n(197), o.floor = n(198), o.gcd = n(199), o.hypot = n(200), o.lcm = n(201), o.log = n(202), o.log10 = n(203), o.mod = n(204), o.multiply = n(205), o.norm = n(206), o.nthRoot = n(207), o.pow = n(208), o.round = n(209), o.sign = n(210), o.sqrt = n(211), o.square = n(212), o.subtract = n(213), o.unaryMinus = n(214), o.unaryPlus = n(215), o.xgcd = n(216), o.bitAnd = n(217), o.bitNot = n(218), o.bitOr = n(219), o.bitXor = n(220), o.leftShift = n(221), o.rightArithShift = n(222), o.rightLogShift = n(223), o.bellNumbers = n(224), o.catalan = n(225), o.composition = n(226), o.stirlingS2 = n(227), o.config = n(176), o.import = n(177), o.typed = n(178), o.arg = n(228), o.conj = n(229), o.re = n(231), o.im = n(230), o.eval = n(232), o.help = n(233), o.distance = n(234), o.intersect = n(235), o.and = n(236), o.not = n(237), o.or = n(238), o.xor = n(239), o.concat = n(240), o.cross = n(241), o.det = n(242), o.diag = n(243), o.dot = n(244), o.eye = n(245), o.filter = n(246), o.flatten = n(247), o.forEach = n(248), o.inv = n(249), o.kron = n(250), o.map = n(251), o.ones = n(252), o.partitionSelect = n(253), o.range = n(254), o.resize = n(256), o.reshape = n(255), o.size = n(257), o.sort = n(258), o.squeeze = n(259), o.subset = n(260), o.trace = n(261), o.transpose = n(262), o.zeros = n(263), o.combinations = n(264), o.factorial = n(265), o.gamma = n(266), o.kldivergence = n(267), o.multinomial = n(268), o.permutations = n(269), o.pickRandom = n(270), o.random = n(271), o.randomInt = n(272), o.compare = n(273), o.deepEqual = n(274), o.equal = n(275), o.larger = n(276), o.largerEq = n(277), o.smaller = n(278), o.smallerEq = n(279), o.unequal = n(280), o.erf = n(281), o.mad = n(282), o.max = n(283), o.mean = n(284), o.median = n(285), o.min = n(286), o.mode = n(287), o.prod = n(288), o.quantileSeq = n(289), o.std = n(290), o.sum = n(291), o.var = n(292), o.acos = n(293), o.acosh = n(294), o.acot = n(295), o.acoth = n(296), o.acsc = n(297), o.acsch = n(298), o.asec = n(299), o.asech = n(300), o.asin = n(301), o.asinh = n(302), o.atan = n(303), o.atanh = n(305), o.atan2 = n(304), o.cos = n(306), o.cosh = n(307), o.cot = n(308), o.coth = n(309), o.csc = n(310), o.csch = n(311), o.sec = n(312), o.sech = n(313), o.sin = n(314), o.sinh = n(315), o.tan = n(316), o.tanh = n(317), o.to = n(318), o.clone = n(319), o.format = n(320), o.isNaN = n(322), o.isInteger = n(321), o.isNegative = n(323), o.isNumeric = n(324), o.isPositive = n(325), o.isPrime = n(326), o.isZero = n(327), o.typeof = n(328), o
        }
        t.name = "docs", t.path = "expression", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i, o) {
            var a = r(n(81));
            return i("parser", {
                "": function () {
                    return new a(o)
                }
            })
        }
        t.name = "parser", t.factory = r, t.math = !0
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e, t) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                if (!e || !e.isNode) throw new TypeError('Node expected for parameter "object"');
                if (!t || !t.isIndexNode) throw new TypeError('IndexNode expected for parameter "index"');
                this.object = e || null, this.index = t, Object.defineProperty(this, "name", {
                    get: function () {
                        return this.index ? this.index.isObjectProperty() ? this.index.getObjectProperty() : "" : this.object.name || ""
                    }.bind(this),
                    set: function () {
                        throw new Error("Cannot assign a new name, name is read-only")
                    }
                })
            }

            function u(e, t, n) {
                if (!(e instanceof s)) throw new TypeError("No valid AccessorNode");
                t.access = p, t.getSafeProperty = o;
                var r = f(e.object, t, n),
                    a = f(e.index, t, n);
                if (e.index.isObjectProperty()) {
                    var u = i(e.index.getObjectProperty());
                    return "getSafeProperty(" + r + ", " + u + ")"
                }
                return e.index.needsSize() ? "(function () {  var object = " + r + ";  var size = math.size(object).valueOf();  return access(object, " + a + ");})()" : "access(" + r + ", " + a + ")"
            }

            function c(e) {
                return !(e.isAccessorNode || e.isArrayNode || e.isConstantNode || e.isFunctionNode || e.isObjectNode || e.isParenthesisNode || e.isSymbolNode)
            }
            var l = r(n(7)).register,
                f = r(n(7)).compile,
                h = r(n(13)),
                p = (r(n(66)), r(n(92)));
            return s.prototype = new h, s.prototype.type = "AccessorNode", s.prototype.isAccessorNode = !0, l(s.prototype.type, u), s.prototype.forEach = function (e) {
                e(this.object, "object", this), e(this.index, "index", this)
            }, s.prototype.map = function (e) {
                return new s(this._ifNode(e(this.object, "object", this)), this._ifNode(e(this.index, "index", this)))
            }, s.prototype.clone = function () {
                return new s(this.object, this.index)
            }, s.prototype._toString = function (e) {
                var t = this.object.toString(e);
                return c(this.object) && (t = "(" + t + ")"), t + this.index.toString(e)
            }, s.prototype._toTex = function (e) {
                var t = this.object.toTex(e);
                return c(this.object) && (t = "\\left(" + t + "\\right)"), t + this.index.toTex(e)
            }, s
        }
        var i = n(11).stringify,
            o = n(17).getSafeProperty;
        t.name = "AccessorNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s) {
            function u(e, t, n) {
                if (!(this instanceof u)) throw new SyntaxError("Constructor must be called with the new operator");
                if (this.object = e, this.index = n ? t : null, this.value = n ? n : t, !e || !e.isSymbolNode && !e.isAccessorNode) throw new TypeError('SymbolNode or AccessorNode expected as "object"');
                if (e && e.isSymbolNode && "end" === e.name) throw new Error('Cannot assign to symbol "end"');
                if (this.index && !this.index.isIndexNode) throw new TypeError('IndexNode expected as "index"');
                if (!this.value || !this.value.isNode) throw new TypeError('Node expected as "value"');
                Object.defineProperty(this, "name", {
                    get: function () {
                        return this.index ? this.index.isObjectProperty() ? this.index.getObjectProperty() : "" : this.object.name || ""
                    }.bind(this),
                    set: function () {
                        throw new Error("Cannot assign a new name, name is read-only")
                    }
                })
            }

            function c(e, t, n) {
                if (!(e instanceof u)) throw new TypeError("No valid AssignmentNode");
                t.assign = m, t.access = d, t.getSafeProperty = o, t.setSafeProperty = a;
                var r, s = h(e.object, t, n),
                    c = e.index ? h(e.index, t, n) : null,
                    l = h(e.value, t, n),
                    f = i(e.object.name);
                if (e.index) {
                    if (e.index.isObjectProperty()) {
                        var p = i(e.index.getObjectProperty());
                        return "setSafeProperty(" + s + ", " + p + ", " + l + ")"
                    }
                    if (e.object.isSymbolNode) return r = e.index.needsSize() ? "var size = math.size(object).valueOf();" : "", "(function () {  var object = " + s + ";  var value = " + l + ";  " + r + "  setSafeProperty(scope, " + f + ", assign(object, " + c + ", value));  return value;})()";
                    r = e.index.needsSize() ? "var size = math.size(object).valueOf();" : "";
                    var v = h(e.object.object, t, n);
                    if (e.object.index.isObjectProperty()) {
                        var g = i(e.object.index.getObjectProperty());
                        return "(function () {  var parent = " + v + ";  var object = getSafeProperty(parent, " + g + ");  var value = " + l + ";" + r + "  setSafeProperty(parent, " + g + ", assign(object, " + c + ", value));  return value;})()"
                    }
                    var y = e.object.index.needsSize() ? "var size = math.size(parent).valueOf();" : "",
                        w = h(e.object.index, t, n);
                    return "(function () {  var parent = " + v + ";  " + y + "  var parentIndex = " + w + ";  var object = access(parent, parentIndex);  var value = " + l + ";  " + r + "  assign(parent, parentIndex, assign(object, " + c + ", value));  return value;})()"
                }
                if (!e.object.isSymbolNode) throw new TypeError("SymbolNode expected as object");
                return "setSafeProperty(scope, " + f + ", " + l + ")"
            }

            function l(e, t) {
                t || (t = "keep");
                var n = v.getPrecedence(e, t),
                    r = v.getPrecedence(e.value, t);
                return "all" === t || null !== r && r <= n
            }
            var f = r(n(7)).register,
                h = r(n(7)).compile,
                p = r(n(13)),
                m = (r(n(65)), r(n(0)), r(n(337))),
                d = r(n(92)),
                v = (n(64), n(47));
            return u.prototype = new p, u.prototype.type = "AssignmentNode", u.prototype.isAssignmentNode = !0, f(u.prototype.type, c), u.prototype.forEach = function (e) {
                e(this.object, "object", this), this.index && e(this.index, "index", this), e(this.value, "value", this)
            }, u.prototype.map = function (e) {
                var t = this._ifNode(e(this.object, "object", this)),
                    n = this.index ? this._ifNode(e(this.index, "index", this)) : null,
                    r = this._ifNode(e(this.value, "value", this));
                return new u(t, n, r)
            }, u.prototype.clone = function () {
                return new u(this.object, this.index, this.value)
            }, u.prototype._toString = function (e) {
                var t = this.object.toString(e),
                    n = this.index ? this.index.toString(e) : "",
                    r = this.value.toString(e);
                return l(this, e && e.parenthesis) && (r = "(" + r + ")"), t + n + " = " + r
            }, u.prototype._toTex = function (e) {
                var t = this.object.toTex(e),
                    n = this.index ? this.index.toTex(e) : "",
                    r = this.value.toTex(e);
                return l(this, e && e.parenthesis) && (r = "\\left(" + r + "\\right)"), t + n + ":=" + r
            }, u
        }
        var i = (n(4), n(11).stringify),
            o = n(17).getSafeProperty,
            a = n(17).setSafeProperty;
        t.name = "AssignmentNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                if (!Array.isArray(e)) throw new Error("Array expected");
                this.blocks = e.map(function (e) {
                    var t = e && e.node,
                        n = !e || void 0 === e.visible || e.visible;
                    if (!t || !t.isNode) throw new TypeError('Property "node" must be a Node');
                    if ("boolean" != typeof n) throw new TypeError('Property "visible" must be a boolean');
                    return {
                        node: t,
                        visible: n
                    }
                })
            }

            function u(e, t, n) {
                if (!(e instanceof s)) throw new TypeError("No valid BlockNode");
                t.ResultSet = h;
                var r = i(e.blocks, function (e) {
                    var r = l(e.node, t, n);
                    return e.visible ? "results.push(" + r + ");" : r + ";"
                });
                return "(function () {var results = [];" + o(r, "") + "return new ResultSet(results);})()"
            }
            var c = r(n(7)).register,
                l = r(n(7)).compile,
                f = r(n(13)),
                h = r(n(136));
            return s.prototype = new f, s.prototype.type = "BlockNode", s.prototype.isBlockNode = !0, c(s.prototype.type, u), s.prototype.forEach = function (e) {
                for (var t = 0; t < this.blocks.length; t++) e(this.blocks[t].node, "blocks[" + t + "].node", this)
            }, s.prototype.map = function (e) {
                for (var t = [], n = 0; n < this.blocks.length; n++) {
                    var r = this.blocks[n],
                        i = this._ifNode(e(r.node, "blocks[" + n + "].node", this));
                    t[n] = {
                        node: i,
                        visible: r.visible
                    }
                }
                return new s(t)
            }, s.prototype.clone = function () {
                var e = this.blocks.map(function (e) {
                    return {
                        node: e.node,
                        visible: e.visible
                    }
                });
                return new s(e)
            }, s.prototype._toString = function (e) {
                return this.blocks.map(function (t) {
                    return t.node.toString(e) + (t.visible ? "" : ";")
                }).join("\n")
            }, s.prototype._toTex = function (e) {
                return this.blocks.map(function (t) {
                    return t.node.toTex(e) + (t.visible ? "" : ";")
                }).join("\\;\\;\n")
            }, s
        }
        var i = n(3).map,
            o = n(3).join;
        t.name = "BlockNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t, n) {
                if (!(this instanceof a)) throw new SyntaxError("Constructor must be called with the new operator");
                if (!e || !e.isNode) throw new TypeError("Parameter condition must be a Node");
                if (!t || !t.isNode) throw new TypeError("Parameter trueExpr must be a Node");
                if (!n || !n.isNode) throw new TypeError("Parameter falseExpr must be a Node");
                this.condition = e, this.trueExpr = t, this.falseExpr = n
            }

            function s(e, t, n) {
                if (!(e instanceof a)) throw new TypeError("No valid ConditionalNode");
                return t.testCondition = function (e) {
                    if ("number" == typeof e || "boolean" == typeof e || "string" == typeof e) return !!e;
                    if (e) {
                        if (e.isBigNumber === !0) return !e.isZero();
                        if (e.isComplex === !0) return !(!e.re && !e.im);
                        if (e.isUnit === !0) return !!e.value
                    }
                    if (null === e || void 0 === e) return !1;
                    throw new TypeError('Unsupported type of condition "' + t.math.typeof(e) + '"')
                }, "testCondition(" + c(e.condition, t, n) + ") ? ( " + c(e.trueExpr, t, n) + ") : ( " + c(e.falseExpr, t, n) + ")"
            }
            var u = r(n(7)).register,
                c = r(n(7)).compile,
                l = r(n(13));
            return a.prototype = new l, a.prototype.type = "ConditionalNode", a.prototype.isConditionalNode = !0, u(a.prototype.type, s), a.prototype.forEach = function (e) {
                e(this.condition, "condition", this), e(this.trueExpr, "trueExpr", this), e(this.falseExpr, "falseExpr", this)
            }, a.prototype.map = function (e) {
                return new a(this._ifNode(e(this.condition, "condition", this)), this._ifNode(e(this.trueExpr, "trueExpr", this)), this._ifNode(e(this.falseExpr, "falseExpr", this)))
            }, a.prototype.clone = function () {
                return new a(this.condition, this.trueExpr, this.falseExpr)
            }, a.prototype._toString = function (e) {
                var t = e && e.parenthesis ? e.parenthesis : "keep",
                    n = i.getPrecedence(this, t),
                    r = this.condition.toString(e),
                    o = i.getPrecedence(this.condition, t);
                ("all" === t || "OperatorNode" === this.condition.type || null !== o && o <= n) && (r = "(" + r + ")");
                var a = this.trueExpr.toString(e),
                    s = i.getPrecedence(this.trueExpr, t);
                ("all" === t || "OperatorNode" === this.trueExpr.type || null !== s && s <= n) && (a = "(" + a + ")");
                var u = this.falseExpr.toString(e),
                    c = i.getPrecedence(this.falseExpr, t);
                return ("all" === t || "OperatorNode" === this.falseExpr.type || null !== c && c <= n) && (u = "(" + u + ")"), r + " ? " + a + " : " + u
            }, a.prototype._toTex = function (e) {
                return "\\begin{cases} {" + this.trueExpr.toTex(e) + "}, &\\quad{\\text{if }\\;" + this.condition.toTex(e) + "}\\\\{" + this.falseExpr.toTex(e) + "}, &\\quad{\\text{otherwise}}\\end{cases}"
            }, a
        }
        var i = (n(4), n(47));
        t.name = "ConditionalNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, h) {
            function p(e, t, n) {
                if (!(this instanceof p)) throw new SyntaxError("Constructor must be called with the new operator");
                if ("string" != typeof e) throw new TypeError('String expected for parameter "name"');
                if (!Array.isArray(t)) throw new TypeError('Array containing strings or objects expected for parameter "params"');
                if (!n || !n.isNode) throw new TypeError('Node expected for parameter "expr"');
                if (e in i) throw new Error('Illegal function name, "' + e + '" is a reserved keyword');
                this.name = e, this.params = t.map(function (e) {
                    return e && e.name || e
                }), this.types = t.map(function (e) {
                    return e && e.type || "any"
                }), this.expr = n
            }

            function m(e, t, n) {
                if (!(e instanceof p)) throw new TypeError("No valid FunctionAssignmentNode");
                t.typed = h, t.setSafeProperty = l;
                var r = Object.create(n),
                    i = a(e.params, function (e) {
                        return r[e] = f(r), r[e]
                    }),
                    u = g(e.expr, t, r),
                    c = o(e.name);
                return "setSafeProperty(scope, " + c + ",   (function () {    var fn = typed(" + c + ", {      " + o(s(e.types, ",")) + ": function (" + s(i, ",") + ") {        return " + u + "      }    });    fn.syntax = " + o(e.name + "(" + s(e.params, ", ") + ")") + ";    return fn;  })())"
            }

            function d(e, t) {
                var n = c.getPrecedence(e, t),
                    r = c.getPrecedence(e.expr, t);
                return "all" === t || null !== r && r <= n
            }
            var v = r(n(7)).register,
                g = r(n(7)).compile,
                y = r(n(13));
            return p.prototype = new y, p.prototype.type = "FunctionAssignmentNode",
                p.prototype.isFunctionAssignmentNode = !0, v(p.prototype.type, m), p.prototype.forEach = function (e) {
                    e(this.expr, "expr", this)
                }, p.prototype.map = function (e) {
                    var t = this._ifNode(e(this.expr, "expr", this));
                    return new p(this.name, this.params.slice(0), t)
                }, p.prototype.clone = function () {
                    return new p(this.name, this.params.slice(0), this.expr)
                }, p.prototype._toString = function (e) {
                    var t = e && e.parenthesis ? e.parenthesis : "keep",
                        n = this.expr.toString(e);
                    return d(this, t) && (n = "(" + n + ")"), this.name + "(" + this.params.join(", ") + ") = " + n
                }, p.prototype._toTex = function (e) {
                    var t = e && e.parenthesis ? e.parenthesis : "keep",
                        n = this.expr.toTex(e);
                    return d(this, t) && (n = "\\left(" + n + "\\right)"), "\\mathrm{" + this.name + "}\\left(" + this.params.map(u.toSymbol).join(",") + "\\right):=" + n
                }, p
        }
        var i = n(64),
            o = n(11).stringify,
            a = n(3).map,
            s = n(3).join,
            u = n(4),
            c = n(47),
            l = n(17).setSafeProperty,
            f = n(93);
        t.name = "FunctionAssignmentNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s) {
            function u(e) {
                if (!(this instanceof u)) throw new SyntaxError("Constructor must be called with the new operator");
                if (this.properties = e || {}, e && ("object" != typeof e || Object.keys(e).some(function (t) {
                        return !e[t] || !e[t].isNode
                    }))) throw new TypeError("Object containing Nodes expected")
            }

            function c(e, t, n) {
                if (!(e instanceof u)) throw new TypeError("No valid ObjectNode");
                var r = [];
                for (var s in e.properties)
                    if (a(e.properties, s)) {
                        if (!o(s)) throw new Error('No access to property "' + s + '"');
                        r.push(i(s) + ": " + f(e.properties[s], t, n))
                    } return "{" + r.join(", ") + "}"
            }
            var l = r(n(7)).register,
                f = r(n(7)).compile,
                h = r(n(13));
            return u.prototype = new h, u.prototype.type = "ObjectNode", u.prototype.isObjectNode = !0, l(u.prototype.type, c), u.prototype.forEach = function (e) {
                for (var t in this.properties) this.properties.hasOwnProperty(t) && e(this.properties[t], "properties[" + i(t) + "]", this)
            }, u.prototype.map = function (e) {
                var t = {};
                for (var n in this.properties) this.properties.hasOwnProperty(n) && (t[n] = this._ifNode(e(this.properties[n], "properties[" + i(n) + "]", this)));
                return new u(t)
            }, u.prototype.clone = function () {
                var e = {};
                for (var t in this.properties) this.properties.hasOwnProperty(t) && (e[t] = this.properties[t]);
                return new u(e)
            }, u.prototype._toString = function (e) {
                var t = [];
                for (var n in this.properties) this.properties.hasOwnProperty(n) && t.push(i(n) + ": " + this.properties[n].toString(e));
                return "{" + t.join(", ") + "}"
            }, u.prototype._toTex = function (e) {
                var t = [];
                for (var n in this.properties) this.properties.hasOwnProperty(n) && t.push("\\mathbf{" + n + ":} & " + this.properties[n].toTex(e) + "\\\\");
                return "\\left\\{\\begin{array}{ll}" + t.join("\n") + "\\end{array}\\right\\}"
            }, u
        }
        var i = n(11).stringify,
            o = n(17).isSafeProperty,
            a = n(5).hasOwnProperty;
        t.name = "ObjectNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(55));
            return function (e, t) {
                try {
                    if (Array.isArray(e)) return s(e, t);
                    if (e && "function" == typeof e.subset) return e.subset(t);
                    if ("string" == typeof e) return s(e, t);
                    if ("object" == typeof e) {
                        if (!t.isObjectProperty()) throw new TypeError("Cannot apply a numeric index as object property");
                        return o(e, t.getObjectProperty())
                    }
                    throw new TypeError("Cannot apply index: unsupported type of object")
                } catch (e) {
                    throw i(e)
                }
            }
        }
        var i = n(31).transform,
            o = n(17).getSafeProperty;
        t.factory = r
    }, function (e, t) {
        function n(e) {
            return "arg" + Object.keys(e).length
        }
        e.exports = n
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var a = r(n(0)),
                s = r(n(26)),
                u = r(n(20)),
                c = r(n(19)),
                l = r(n(22)),
                f = r(n(21)),
                h = r(n(28)),
                p = r(n(10)),
                m = r(n(32)),
                d = e.SparseMatrix,
                v = e.DenseMatrix,
                g = e.Spa,
                y = i("lup", {
                    DenseMatrix: function (e) {
                        return w(e)
                    },
                    SparseMatrix: function (e) {
                        return x(e)
                    },
                    Array: function (e) {
                        var t = a(e),
                            n = w(t);
                        return {
                            L: n.L.valueOf(),
                            U: n.U.valueOf(),
                            p: n.p
                        }
                    }
                }),
                w = function (e) {
                    var t, n, r, i = e._size[0],
                        a = e._size[1],
                        m = Math.min(i, a),
                        d = o.clone(e._data),
                        g = [],
                        y = [i, m],
                        w = [],
                        x = [m, a],
                        b = [];
                    for (t = 0; t < i; t++) b[t] = t;
                    for (n = 0; n < a; n++) {
                        if (n > 0)
                            for (t = 0; t < i; t++) {
                                var C = Math.min(t, n),
                                    M = 0;
                                for (r = 0; r < C; r++) M = u(M, l(d[t][r], d[r][n]));
                                d[t][n] = f(d[t][n], M)
                            }
                        var T = n,
                            N = 0,
                            E = 0;
                        for (t = n; t < i; t++) {
                            var A = d[t][n],
                                S = s(A);
                            h(S, N) && (T = t, N = S, E = A)
                        }
                        if (n !== T && (b[n] = [b[T], b[T] = b[n]][0], v._swapRows(n, T, d)), n < i)
                            for (t = n + 1; t < i; t++) {
                                var P = d[t][n];
                                p(P, 0) || (d[t][n] = c(d[t][n], E))
                            }
                    }
                    for (n = 0; n < a; n++)
                        for (t = 0; t < i; t++) 0 === n && (t < a && (w[t] = []), g[t] = []), t < n ? (t < a && (w[t][n] = d[t][n]), n < i && (g[t][n] = 0)) : t !== n ? (t < a && (w[t][n] = 0), n < i && (g[t][n] = d[t][n])) : (t < a && (w[t][n] = d[t][n]), n < i && (g[t][n] = 1));
                    var O = new v({
                            data: g,
                            size: y
                        }),
                        _ = new v({
                            data: w,
                            size: x
                        }),
                        I = [];
                    for (t = 0, m = b.length; t < m; t++) I[b[t]] = t;
                    return {
                        L: O,
                        U: _,
                        p: I,
                        toString: function () {
                            return "L: " + this.L.toString() + "\nU: " + this.U.toString() + "\nP: " + this.p
                        }
                    }
                },
                x = function (e) {
                    var t, n, r, i = e._size[0],
                        o = e._size[1],
                        a = Math.min(i, o),
                        u = e._values,
                        f = e._index,
                        v = e._ptr,
                        y = [],
                        w = [],
                        x = [],
                        b = [i, a],
                        C = [],
                        M = [],
                        T = [],
                        N = [a, o],
                        E = [],
                        A = [];
                    for (t = 0; t < i; t++) E[t] = t, A[t] = t;
                    var S = function (e, t) {
                        var n = A[e],
                            r = A[t];
                        E[n] = t, E[r] = e, A[e] = r, A[t] = n
                    };
                    for (n = 0; n < o; n++) {
                        var P = new g;
                        n < i && (x.push(y.length), y.push(1), w.push(n)), T.push(C.length);
                        var O = v[n],
                            _ = v[n + 1];
                        for (r = O; r < _; r++) t = f[r], P.set(E[t], u[r]);
                        n > 0 && P.forEach(0, n - 1, function (e, t) {
                            d._forEachRow(e, y, w, x, function (n, r) {
                                n > e && P.accumulate(n, m(l(r, t)))
                            })
                        });
                        var I = n,
                            B = P.get(n),
                            k = s(B);
                        P.forEach(n + 1, i - 1, function (e, t) {
                            var n = s(t);
                            h(n, k) && (I = e, k = n, B = t)
                        }), n !== I && (d._swapRows(n, I, b[1], y, w, x), d._swapRows(n, I, N[1], C, M, T), P.swap(n, I), S(n, I)), P.forEach(0, i - 1, function (e, t) {
                            e <= n ? (C.push(t), M.push(e)) : (t = c(t, B), p(t, 0) || (y.push(t), w.push(e)))
                        })
                    }
                    return T.push(C.length), x.push(y.length), {
                        L: new d({
                            values: y,
                            index: w,
                            ptr: x,
                            size: b
                        }),
                        U: new d({
                            values: C,
                            index: M,
                            ptr: T,
                            size: N
                        }),
                        p: E,
                        toString: function () {
                            return "L: " + this.L.toString() + "\nU: " + this.U.toString() + "\nP: " + this.p
                        }
                    }
                };
            return y
        }
        var i = n(25),
            o = i.object;
        t.name = "lup", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(366)),
                s = r(n(361)),
                u = i("slu", {
                    "SparseMatrix, number, number": function (e, t, n) {
                        if (!a(t) || t < 0 || t > 3) throw new Error("Symbolic Ordering and Analysis order must be an integer number in the interval [0, 3]");
                        if (n < 0 || n > 1) throw new Error("Partial pivoting threshold must be a number from 0 to 1");
                        var r = o(t, e, !1),
                            i = s(e, r, n);
                        return {
                            L: i.L,
                            U: i.U,
                            p: i.pinv,
                            q: r.q,
                            toString: function () {
                                return "L: " + this.L.toString() + "\nU: " + this.U.toString() + "\np: " + this.p.toString() + (this.q ? "\nq: " + this.q.toString() : "") + "\n"
                            }
                        }
                    }
                });
            return u
        }
        var i = n(25),
            o = i.number,
            a = o.isInteger;
        t.name = "slu", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i, o) {
            function a(e) {
                return e.transform(function (e, t, n) {
                    return e.isParenthesisNode ? e.content : e
                })
            }

            function s(e) {
                for (var t = [], n = 0; n < e.length; n++) {
                    var r, i = e[n],
                        o = typeof i;
                    switch (o) {
                        case "string":
                            var s = i.split("->");
                            if (2 !== s.length) throw SyntaxError("Could not parse rule: " + i);
                            i = {
                                l: s[0],
                                r: s[1]
                            };
                        case "object":
                            if (r = {
                                    l: a(d(i.l)),
                                    r: a(d(i.r))
                                }, i.context && (r.evaluate = i.context), i.evaluate && (r.evaluate = d(i.evaluate)), r.l.isOperatorNode && T(r.l)) {
                                var c = S(r.l),
                                    l = u();
                                r.expanded = {}, r.expanded.l = c([r.l.clone(), l]), N(r.expanded.l), E(r.expanded.l), r.expanded.r = c([r.r, l])
                            }
                            break;
                        case "function":
                            r = i;
                            break;
                        default:
                            throw TypeError("Unsupported type of rule: " + o)
                    }
                    t.push(r)
                }
                return t
            }

            function u() {
                return new x("_p" + _++)
            }

            function c(e, t) {
                var n, r, i = [],
                    o = S(e);
                if (M(e, t))
                    for (var a = 0; a < e.args.length; a++) r = e.args.slice(0), r.splice(a, 1), n = 1 === r.length ? r[0] : o(r), i.push(o([e.args[a], n]));
                else r = e.args.slice(1), n = 1 === r.length ? r[0] : o(r), i.push(o([e.args[0], n]));
                return i
            }

            function l(e, t) {
                var n = {
                    placeholders: {}
                };
                if (!e.placeholders && !t.placeholders) return n;
                if (!e.placeholders) return t;
                if (!t.placeholders) return e;
                for (var r in e.placeholders)
                    if (n.placeholders[r] = e.placeholders[r], t.placeholders.hasOwnProperty(r) && !m(e.placeholders[r], t.placeholders[r])) return null;
                for (var r in t.placeholders) n.placeholders[r] = t.placeholders[r];
                return n
            }

            function f(e, t) {
                var n = [];
                if (0 === e.length || 0 === t.length) return n;
                for (var r, i = 0; i < e.length; i++)
                    for (var o = 0; o < t.length; o++) r = l(e[i], t[o]), r && n.push(r);
                return n
            }

            function h(e) {
                if (0 === e.length) return e;
                for (var t = e.reduce(f), n = [], r = {}, i = 0; i < t.length; i++) {
                    var o = JSON.stringify(t[i]);
                    r[o] || (r[o] = !0, n.push(t[i]))
                }
                return n
            }

            function p(e, t, n) {
                var r = [{
                    placeholders: {}
                }];
                if (e instanceof y && t instanceof y || e instanceof g && t instanceof g) {
                    if (e instanceof y) {
                        if (e.op !== t.op || e.fn !== t.fn) return []
                    } else if (e instanceof g && e.name !== t.name) return [];
                    if ((1 !== t.args.length || 1 !== e.args.length) && T(t) && !n) {
                        if (t.args.length >= 2 && 2 === e.args.length) {
                            for (var i = c(t, e.context), a = [], s = 0; s < i.length; s++) {
                                var u = p(e, i[s], !0);
                                a = a.concat(u)
                            }
                            return a
                        }
                        if (e.args.length > 2) throw Error("Unexpected non-binary associative function: " + e.toString());
                        return []
                    }
                    for (var l = [], s = 0; s < e.args.length; s++) {
                        var f = p(e.args[s], t.args[s]);
                        if (0 === f.length) return [];
                        l.push(f)
                    }
                    r = h(l)
                } else if (e instanceof x) {
                    if (0 === e.name.length) throw new Error("Symbol in rule has 0 length...!?");
                    if (o.hasOwnProperty(e.name)) {
                        if (!O[e.name]) throw new Error("Built in constant: " + e.name + " is not supported by simplify.");
                        if (e.name !== t.name) return []
                    } else if ("n" == e.name[0] || "_p" == e.name.substring(0, 2)) r[0].placeholders[e.name] = t;
                    else if ("v" == e.name[0]) {
                        if (t.isConstantNode) return [];
                        r[0].placeholders[e.name] = t
                    } else {
                        if ("c" != e.name[0]) throw new Error("Invalid symbol in rule: " + e.name);
                        if (!(t instanceof v)) return [];
                        r[0].placeholders[e.name] = t
                    }
                } else {
                    if (!(e instanceof v)) return [];
                    if (e.value !== t.value) return []
                }
                return r
            }

            function m(e, t) {
                if (e instanceof v && t instanceof v) {
                    if (e.value !== t.value) return !1
                } else if (e instanceof x && t instanceof x) {
                    if (e.name !== t.name) return !1
                } else {
                    if (!(e instanceof y && t instanceof y || e instanceof g && t instanceof g)) return !1;
                    if (e instanceof y) {
                        if (e.op !== t.op || e.fn !== t.fn) return !1
                    } else if (e instanceof g && e.name !== t.name) return !1;
                    if (e.args.length !== t.args.length) return !1;
                    for (var n = 0; n < e.args.length; n++)
                        if (!m(e.args[n], t.args[n])) return !1
                }
                return !0
            }
            var d = r(n(30)),
                v = r(n(45)),
                g = r(n(46)),
                y = r(n(52)),
                w = r(n(53)),
                x = r(n(27)),
                b = (r(n(13)), r(n(352))),
                C = r(n(97)),
                M = C.isCommutative,
                T = C.isAssociative,
                N = C.flatten,
                E = C.unflattenr,
                A = C.unflattenl,
                S = C.createMakeNodeFunction,
                P = i("simplify", {
                    string: function (e) {
                        return P(d(e), P.rules)
                    },
                    "string, Array": function (e, t) {
                        return P(d(e), t)
                    },
                    Node: function (e) {
                        return P(e, P.rules)
                    },
                    "Node, Array": function (e, t) {
                        t = s(t);
                        for (var n = a(e), r = {}, i = n.toString({
                                parenthesis: "all"
                            }); !r[i];) {
                            r[i] = !0, _ = 0;
                            for (var o = 0; o < t.length; o++) "function" == typeof t[o] ? n = t[o](n) : (N(n), n = I(n, t[o])), A(n);
                            i = n.toString({
                                parenthesis: "all"
                            })
                        }
                        return n
                    }
                }),
                O = {
                    true: !0,
                    false: !0,
                    e: !0,
                    i: !0,
                    Infinity: !0,
                    LN2: !0,
                    LN10: !0,
                    LOG2E: !0,
                    LOG10E: !0,
                    NaN: !0,
                    phi: !0,
                    pi: !0,
                    SQRT1_2: !0,
                    SQRT2: !0,
                    tau: !0
                };
            P.rules = [{
                l: "n+0",
                r: "n"
            }, {
                l: "n^0",
                r: "1"
            }, {
                l: "0*n",
                r: "0"
            }, {
                l: "n/n",
                r: "1"
            }, {
                l: "n^1",
                r: "n"
            }, {
                l: "+n1",
                r: "n1"
            }, {
                l: "n--n1",
                r: "n+n1"
            }, {
                l: "log(e)",
                r: "1"
            }, {
                l: "n-n1",
                r: "n+-n1"
            }, {
                l: "-(c*v)",
                r: "(-c) * v"
            }, {
                l: "-v",
                r: "(-1) * v"
            }, {
                l: "n/n1^n2",
                r: "n*n1^-n2"
            }, {
                l: "n/n1",
                r: "n*n1^-1"
            }, {
                l: "n*n",
                r: "n^2"
            }, {
                l: "n * n^n1",
                r: "n^(n1+1)"
            }, {
                l: "n^n1 * n^n2",
                r: "n^(n1+n2)"
            }, {
                l: "n+n",
                r: "2*n"
            }, {
                l: "n+-n",
                r: "0"
            }, {
                l: "n1*n2 + n2",
                r: "(n1+1)*n2"
            }, {
                l: "n1*n3 + n2*n3",
                r: "(n1+n2)*n3"
            }, b, {
                l: "(-n)*n1",
                r: "-(n*n1)"
            }, {
                l: "c+v",
                r: "v+c",
                context: {
                    add: {
                        commutative: !1
                    }
                }
            }, {
                l: "v*c",
                r: "c*v",
                context: {
                    multiply: {
                        commutative: !1
                    }
                }
            }, {
                l: "(-1) * n",
                r: "-n"
            }, {
                l: "n+-n1",
                r: "n-n1"
            }, {
                l: "n*(n1^-1)",
                r: "n/n1"
            }, {
                l: "n*n1^-n2",
                r: "n/n1^n2"
            }, {
                l: "n1^-1",
                r: "1/n1"
            }, {
                l: "n*(n1/n2)",
                r: "(n*n1)/n2"
            }, {
                l: "n-(n1+n2)",
                r: "n-n1-n2"
            }, {
                l: "1*n",
                r: "n"
            }];
            var _ = 0,
                I = i("applyRule", {
                    "Node, Object": function (e, t) {
                        var n = e;
                        if (n instanceof y || n instanceof g) {
                            if (n.args)
                                for (var r = 0; r < n.args.length; r++) n.args[r] = I(n.args[r], t)
                        } else n instanceof w && n.content && (n.content = I(n.content, t));
                        var i = t.r,
                            o = p(t.l, n)[0];
                        return !o && t.expanded && (i = t.expanded.r, o = p(t.expanded.l, n)[0]), o && (n = i.clone(), n = n.transform(function (e, t, n) {
                            if (e.isSymbolNode && o.placeholders.hasOwnProperty(e.name)) {
                                var r = o.placeholders[e.name].clone();
                                return r
                            }
                            return e
                        })), n
                    }
                });
            return P
        }
        t.math = !0, t.name = "simplify", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r, i) {
            function o(e, t) {
                if (!e.args || e.args.length <= 1) return !0;
                var n = e.fn.toString();
                return t && t.hasOwnProperty(n) && t[n].hasOwnProperty("commutative") ? t[n].commutative : d[n] || !1
            }

            function a(e, t) {
                if (!e.args || e.args.length <= 1) return !0;
                var n = e.fn.toString();
                return t && t.hasOwnProperty(n) && t[n].hasOwnProperty("associative") ? t[n].associative : v[n] || !1
            }

            function s(e) {
                if (!e.args || 0 === e.args.length) return e;
                e.args = u(e);
                for (var t = 0; t < e.args.length; t++) s(e.args[t])
            }

            function u(e) {
                var t, n = [],
                    r = function (e) {
                        for (var i = 0; i < e.args.length; i++) {
                            var o = e.args[i];
                            o.isOperatorNode && t === o.op ? r(o) : n.push(o)
                        }
                    };
                return e.isOperatorNode && a(e) ? (t = e.op, r(e), n) : e.args
            }

            function c(e) {
                if (e.args && 0 !== e.args.length) {
                    for (var t = f(e), n = e.args.length, r = 0; r < n; r++) c(e.args[r]);
                    if (n > 2 && a(e)) {
                        for (var i = e.args.pop(); e.args.length > 0;) i = t([e.args.pop(), i]);
                        e.args = i.args
                    }
                }
            }

            function l(e) {
                if (e.args && 0 !== e.args.length) {
                    for (var t = f(e), n = e.args.length, r = 0; r < n; r++) l(e.args[r]);
                    if (n > 2 && a(e)) {
                        for (var i = e.args.shift(); e.args.length > 0;) i = t([i, e.args.shift()]);
                        e.args = i.args
                    }
                }
            }

            function f(e) {
                return e.isOperatorNode ? function (t) {
                    try {
                        return new p(e.op, e.fn, t)
                    } catch (e) {
                        return console.error(e), []
                    }
                } : function (t) {
                    return new h(new m(e.name), t)
                }
            }
            var h = i.expression.node.FunctionNode,
                p = i.expression.node.OperatorNode,
                m = i.expression.node.SymbolNode,
                d = {
                    add: !0,
                    multiply: !0
                },
                v = {
                    add: !0,
                    multiply: !0
                };
            return {
                createMakeNodeFunction: f,
                isCommutative: o,
                isAssociative: a,
                flatten: s,
                allChildren: u,
                unflattenr: c,
                unflattenl: l
            }
        }
        t.factory = r, t.math = !0
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(19)),
                s = r(n(22)),
                u = r(n(21)),
                c = r(n(10)),
                l = r(n(68)),
                f = e.DenseMatrix,
                h = i("lsolve", {
                    "SparseMatrix, Array | Matrix": function (e, t) {
                        return m(e, t)
                    },
                    "DenseMatrix, Array | Matrix": function (e, t) {
                        return p(e, t)
                    },
                    "Array, Array | Matrix": function (e, t) {
                        var n = o(e),
                            r = p(n, t);
                        return r.valueOf()
                    }
                }),
                p = function (e, t) {
                    t = l(e, t, !0);
                    for (var n = t._data, r = e._size[0], i = e._size[1], o = [], h = e._data, p = 0; p < i; p++) {
                        var m, d = n[p][0] || 0;
                        if (c(d, 0)) m = 0;
                        else {
                            var v = h[p][p];
                            if (c(v, 0)) throw new Error("Linear system cannot be solved since matrix is singular");
                            m = a(d, v);
                            for (var g = p + 1; g < r; g++) n[g] = [u(n[g][0] || 0, s(m, h[g][p]))]
                        }
                        o[p] = [m]
                    }
                    return new f({
                        data: o,
                        size: [r, 1]
                    })
                },
                m = function (e, t) {
                    t = l(e, t, !0);
                    for (var n, r, i = t._data, o = e._size[0], h = e._size[1], p = e._values, m = e._index, d = e._ptr, v = [], g = 0; g < h; g++) {
                        var y = i[g][0] || 0;
                        if (c(y, 0)) v[g] = [0];
                        else {
                            var w = 0,
                                x = [],
                                b = [],
                                C = d[g + 1];
                            for (r = d[g]; r < C; r++) n = m[r], n === g ? w = p[r] : n > g && (x.push(p[r]), b.push(n));
                            if (c(w, 0)) throw new Error("Linear system cannot be solved since matrix is singular");
                            var M = a(y, w);
                            for (r = 0, C = b.length; r < C; r++) n = b[r], i[n] = [u(i[n][0] || 0, s(M, x[r]))];
                            v[g] = [M]
                        }
                    }
                    return new f({
                        data: v,
                        size: [o, 1]
                    })
                };
            return h
        }
        t.name = "lsolve", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(19)),
                s = r(n(22)),
                u = r(n(21)),
                c = r(n(10)),
                l = r(n(68)),
                f = e.DenseMatrix,
                h = i("usolve", {
                    "SparseMatrix, Array | Matrix": function (e, t) {
                        return m(e, t)
                    },
                    "DenseMatrix, Array | Matrix": function (e, t) {
                        return p(e, t)
                    },
                    "Array, Array | Matrix": function (e, t) {
                        var n = o(e),
                            r = p(n, t);
                        return r.valueOf()
                    }
                }),
                p = function (e, t) {
                    t = l(e, t, !0);
                    for (var n = t._data, r = e._size[0], i = e._size[1], o = [], h = e._data, p = i - 1; p >= 0; p--) {
                        var m, d = n[p][0] || 0;
                        if (c(d, 0)) m = 0;
                        else {
                            var v = h[p][p];
                            if (c(v, 0)) throw new Error("Linear system cannot be solved since matrix is singular");
                            m = a(d, v);
                            for (var g = p - 1; g >= 0; g--) n[g] = [u(n[g][0] || 0, s(m, h[g][p]))]
                        }
                        o[p] = [m]
                    }
                    return new f({
                        data: o,
                        size: [r, 1]
                    })
                },
                m = function (e, t) {
                    t = l(e, t, !0);
                    for (var n, r, i = t._data, o = e._size[0], h = e._size[1], p = e._values, m = e._index, d = e._ptr, v = [], g = h - 1; g >= 0; g--) {
                        var y = i[g][0] || 0;
                        if (c(y, 0)) v[g] = [0];
                        else {
                            var w = 0,
                                x = [],
                                b = [],
                                C = d[g],
                                M = d[g + 1];
                            for (r = M - 1; r >= C; r--) n = m[r], n === g ? w = p[r] : n < g && (x.push(p[r]), b.push(n));
                            if (c(w, 0)) throw new Error("Linear system cannot be solved since matrix is singular");
                            var T = a(y, w);
                            for (r = 0, M = b.length; r < M; r++) n = b[r], i[n] = [u(i[n][0], s(T, x[r]))];
                            v[g] = [T]
                        }
                    }
                    return new f({
                        data: v,
                        size: [o, 1]
                    })
                };
            return h
        }
        t.name = "usolve", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(69)),
                o = function (e, t) {
                    e[t] = i(e[t])
                };
            return o
        }
        t.name = "cs_mark", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e, t) {
                return e[t] < 0
            };
            return e
        }
        t.name = "cs_marked", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e, t, n, r, i, o, a) {
                var s = 0;
                for (n[a] = e; s >= 0;) {
                    var u = n[a + s],
                        c = n[r + u];
                    c == -1 ? (s--, o[t++] = u) : (n[r + u] = n[i + c], ++s, n[a + s] = c)
                }
                return t
            };
            return e
        }
        t.name = "cs_tdfs", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(19)),
                s = n(4),
                u = r(n(23)),
                c = r(n(14)),
                l = r(n(24)),
                f = r(n(15)),
                h = r(n(16)),
                p = r(n(8)),
                m = r(n(6)),
                d = i("dotDivide", {
                    "any, any": a,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, a, !1);
                                        break;
                                    default:
                                        n = u(t, e, a, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, a, !1);
                                        break;
                                    default:
                                        n = p(e, t, a)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return d(o(e), o(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return d(o(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return d(e, o(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, a, !1);
                                break;
                            default:
                                n = m(e, t, a, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = h(t, e, a, !0);
                                break;
                            default:
                                n = m(t, e, a, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return m(o(e), t, a, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return m(o(t), e, a, !0).valueOf()
                    }
                });
            return d.toTex = {
                2: "\\left(${args[0]}" + s.operators.dotDivide + "${args[1]}\\right)"
            }, d
        }
        t.name = "dotDivide", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("fix", {
                number: function (e) {
                    return e > 0 ? Math.floor(e) : Math.ceil(e)
                },
                Complex: function (t) {
                    return new e.Complex(t.re > 0 ? Math.floor(t.re) : Math.ceil(t.re), t.im > 0 ? Math.floor(t.im) : Math.ceil(t.im))
                },
                BigNumber: function (e) {
                    return e.isNegative() ? e.ceil() : e.floor()
                },
                Fraction: function (e) {
                    return e.s < 0 ? e.ceil() : e.floor()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\mathrm{${name}}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "fix", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(19)),
                s = o("log", {
                    number: function (n) {
                        return n >= 0 || t.predictable ? Math.log(n) : new e.Complex(n, 0).log()
                    },
                    Complex: function (e) {
                        return e.log()
                    },
                    BigNumber: function (n) {
                        return !n.isNegative() || t.predictable ? n.ln() : new e.Complex(n.toNumber(), 0).log()
                    },
                    "Array | Matrix": function (e) {
                        return i(e, s)
                    },
                    "any, any": function (e, t) {
                        return a(s(e), s(t))
                    }
                });
            return s.toTex = {
                1: "\\ln\\left(${args[0]}\\right)",
                2: "\\log_{${args[1]}}\\left(${args[0]}\\right)"
            }, s
        }
        var i = n(1);
        t.name = "log", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("sign", {
                number: i.sign,
                Complex: function (e) {
                    return e.sign()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(t.cmp(0))
                },
                Fraction: function (t) {
                    return new e.Fraction(t.s, 1)
                },
                "Array | Matrix": function (e) {
                    return o(e, a, !0)
                },
                Unit: function (e) {
                    return a(e.value)
                }
            });
            return a.toTex = {
                1: "\\mathrm{${name}}\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(2),
            o = n(1);
        t.name = "sign", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(18)),
                a = r(n(21)),
                s = r(n(12)),
                u = r(n(38)),
                c = r(n(39)),
                l = r(n(58)),
                f = r(n(57)),
                h = r(n(50)),
                p = r(n(41)),
                m = r(n(28)),
                d = i("stirlingS2", {
                    "number | BigNumber, number | BigNumber": function (e, t) {
                        if (!p(e) || h(e) || !p(t) || h(t)) throw new TypeError("Non-negative integer value expected in function stirlingS2");
                        if (m(t, e)) throw new TypeError("k must be less than or equal to n in function stirlingS2");
                        for (var n = l(t), r = 0, i = 0; i <= t; i++) {
                            var d = c(-1, a(t, i)),
                                v = f(t, i),
                                g = c(i, e);
                            r = o(r, s(s(v, g), d))
                        }
                        return u(r, n)
                    }
                });
            return d.toTex = {
                2: "\\mathrm{S}\\left(${args}\\right)"
            }, d
        }
        t.name = "stirlingS2", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("conj", {
                number: function (e) {
                    return e
                },
                BigNumber: function (e) {
                    return e
                },
                Complex: function (e) {
                    return e.conjugate()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\left(${args[0]}\\right)^*"
            }, o
        }
        var i = n(1);
        t.name = "conj", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = n(4),
                s = o("not", {
                    number: function (e) {
                        return !e
                    },
                    Complex: function (e) {
                        return 0 === e.re && 0 === e.im
                    },
                    BigNumber: function (e) {
                        return e.isZero() || e.isNaN()
                    },
                    Unit: function (e) {
                        return s(e.value)
                    },
                    "Array | Matrix": function (e) {
                        return i(e, s)
                    }
                });
            return s.toTex = {
                1: a.operators.not + "\\left(${args[0]}\\right)"
            }, s
        }
        var i = n(1);
        t.name = "not", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, l) {
            var f = r(n(0)),
                h = l("concat", {
                    "...Array | Matrix | number | BigNumber": function (e) {
                        var t, n, r = e.length,
                            l = -1,
                            h = !1,
                            p = [];
                        for (t = 0; t < r; t++) {
                            var m = e[t];
                            if (m && m.isMatrix === !0 && (h = !0), "number" == typeof m || m && m.isBigNumber === !0) {
                                if (t !== r - 1) throw new Error("Dimension must be specified as last argument");
                                if (n = l, l = m.valueOf(), !a(l)) throw new TypeError("Integer number expected for dimension");
                                if (l < 0 || t > 0 && l > n) throw new u(l, n + 1)
                            } else {
                                var d = o(m).valueOf(),
                                    v = s.size(d);
                                if (p[t] = d, n = l, l = v.length - 1, t > 0 && l != n) throw new c(n + 1, l + 1)
                            }
                        }
                        if (0 == p.length) throw new SyntaxError("At least one matrix expected");
                        for (var g = p.shift(); p.length;) g = i(g, p.shift(), l, 0);
                        return h ? f(g) : g
                    },
                    "...string": function (e) {
                        return e.join("")
                    }
                });
            return h.toTex = void 0, h
        }

        function i(e, t, n, r) {
            if (r < n) {
                if (e.length != t.length) throw new c(e.length, t.length);
                for (var o = [], a = 0; a < e.length; a++) o[a] = i(e[a], t[a], n, r + 1);
                return o
            }
            return e.concat(t)
        }
        var o = n(5).clone,
            a = n(2).isInteger,
            s = n(3),
            u = n(44),
            c = n(9);
        t.name = "concat", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function s(e, t, n) {
                if (1 == t) return o.clone(e[0][0]);
                if (2 == t) return l(f(e[0][0], e[1][1]), f(e[1][0], e[0][1]));
                for (var r = function (e) {
                        var t, n, r = new Array(e.length),
                            i = 0;
                        for (t = 1; t < e.length; t++) i = c(i, e[t][t]);
                        for (t = 0; t < e.length; t++) {
                            for (r[t] = new Array(e.length), r[t][t] = h(i), n = 0; n < t; n++) r[t][n] = 0;
                            for (n = t + 1; n < e.length; n++) r[t][n] = e[t][n];
                            t + 1 < e.length && (i = l(i, e[t + 1][t + 1]))
                        }
                        return r
                    }, i = e, a = 0; a < t - 1; a++) i = f(r(i), e);
                return t % 2 == 0 ? h(i[0][0]) : i[0][0]
            }
            var u = r(n(0)),
                c = r(n(18)),
                l = r(n(21)),
                f = r(n(12)),
                h = r(n(32)),
                p = i("det", {
                    any: function (e) {
                        return o.clone(e)
                    },
                    "Array | Matrix": function (e) {
                        var t;
                        switch (e && e.isMatrix === !0 ? t = e.size() : Array.isArray(e) ? (e = u(e), t = e.size()) : t = [], t.length) {
                            case 0:
                                return o.clone(e);
                            case 1:
                                if (1 == t[0]) return o.clone(e.valueOf()[0]);
                                throw new RangeError("Matrix must be square (size: " + a.format(t) + ")");
                            case 2:
                                var n = t[0],
                                    r = t[1];
                                if (n == r) return s(e.clone().valueOf(), n, r);
                                throw new RangeError("Matrix must be square (size: " + a.format(t) + ")");
                            default:
                                throw new RangeError("Matrix must be two dimensional (size: " + a.format(t) + ")")
                        }
                    }
                });
            return p.toTex = {
                1: "\\det\\left(${args[0]}\\right)"
            }, p
        }
        var i = n(25),
            o = i.object,
            a = i.string;
        t.name = "det", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = a("filter", {
                    "Array, function": i,
                    "Array, RegExp": o,
                    "Matrix, function": function (e, t) {
                        return s(i(e.toArray(), t))
                    },
                    "Matrix, RegExp": function (e, t) {
                        return s(o(e.toArray(), t))
                    }
                });
            return u.toTex = void 0, u
        }

        function i(e, t) {
            if (1 !== a(e).length) throw new Error("Only one dimensional matrices supported");
            var n = s(t);
            return e.filter(function (e, r, i) {
                return 1 === n ? t(e) : 2 === n ? t(e, [r]) : t(e, [r], i)
            })
        }

        function o(e, t) {
            if (1 !== a(e).length) throw new Error("Only one dimensional matrices supported");
            return e.filter(function (e) {
                return t.test(e)
            })
        }
        var a = n(3).size,
            s = n(37).maxArgumentCount;
        t.name = "filter", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("forEach", {
                "Array, function": i,
                "Matrix, function": function (e, t) {
                    return e.forEach(t)
                }
            });
            return o.toTex = void 0, o
        }

        function i(e, t) {
            var n = o(t),
                r = function (i, o) {
                    Array.isArray(i) ? i.forEach(function (e, t) {
                        r(e, o.concat(t))
                    }) : 1 === n ? t(i) : 2 === n ? t(i, o) : t(i, o, e)
                };
            r(e, [])
        }
        var o = n(37).maxArgumentCount;
        t.name = "forEach", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t, n) {
                var r, i, o, a, s;
                if (1 == t) {
                    if (a = e[0][0], 0 == a) throw Error("Cannot calculate inverse, determinant is zero");
                    return [
                        [u(1, a)]
                    ]
                }
                if (2 == t) {
                    var m = h(e);
                    if (0 == m) throw Error("Cannot calculate inverse, determinant is zero");
                    return [
                        [u(e[1][1], m), u(f(e[0][1]), m)],
                        [u(f(e[1][0]), m), u(e[0][0], m)]
                    ]
                }
                var d = e.concat();
                for (r = 0; r < t; r++) d[r] = d[r].concat();
                for (var v = p(t).valueOf(), g = 0; g < n; g++) {
                    for (r = g; r < t && 0 == d[r][g];) r++;
                    if (r == t || 0 == d[r][g]) throw Error("Cannot calculate inverse, determinant is zero");
                    r != g && (s = d[g], d[g] = d[r], d[r] = s, s = v[g], v[g] = v[r], v[r] = s);
                    var y = d[g],
                        w = v[g];
                    for (r = 0; r < t; r++) {
                        var x = d[r],
                            b = v[r];
                        if (r != g) {
                            if (0 != x[g]) {
                                for (o = u(f(x[g]), y[g]), i = g; i < n; i++) x[i] = c(x[i], l(o, y[i]));
                                for (i = 0; i < n; i++) b[i] = c(b[i], l(o, w[i]))
                            }
                        } else {
                            for (o = y[g], i = g; i < n; i++) x[i] = u(x[i], o);
                            for (i = 0; i < n; i++) b[i] = u(b[i], o)
                        }
                    }
                }
                return v
            }
            var s = r(n(0)),
                u = r(n(19)),
                c = r(n(20)),
                l = r(n(12)),
                f = r(n(32)),
                h = r(n(111)),
                p = r(n(54)),
                m = o("inv", {
                    "Array | Matrix": function (e) {
                        var t = e.isMatrix === !0 ? e.size() : i.array.size(e);
                        switch (t.length) {
                            case 1:
                                if (1 == t[0]) return e.isMatrix === !0 ? s([u(1, e.valueOf()[0])]) : [u(1, e[0])];
                                throw new RangeError("Matrix must be square (size: " + i.string.format(t) + ")");
                            case 2:
                                var n = t[0],
                                    r = t[1];
                                if (n == r) return e.isMatrix === !0 ? s(a(e.valueOf(), n, r), e.storage()) : a(e, n, r);
                                throw new RangeError("Matrix must be square (size: " + i.string.format(t) + ")");
                            default:
                                throw new RangeError("Matrix must be two dimensional (size: " + i.string.format(t) + ")")
                        }
                    },
                    any: function (e) {
                        return u(1, e)
                    }
                });
            return m.toTex = {
                1: "\\left(${args[0]}\\right)^{-1}"
            }, m
        }
        var i = n(25);
        t.name = "inv", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("map", {
                "Array, function": i,
                "Matrix, function": function (e, t) {
                    return e.map(t)
                }
            });
            return o.toTex = void 0, o
        }

        function i(e, t) {
            var n = o(t),
                r = function (i, o) {
                    return Array.isArray(i) ? i.map(function (e, t) {
                        return r(e, o.concat(t))
                    }) : 1 === n ? t(i) : 2 === n ? t(i, o) : t(i, o, e)
                };
            return r(e, [])
        }
        var o = n(37).maxArgumentCount;
        t.name = "map", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e) {
                return "Array" === t.matrix ? e : h(e)
            }

            function a(n, r) {
                var i = f(n);
                if (!i) throw new SyntaxError('String "' + n + '" is no valid range');
                var a;
                return "BigNumber" === t.number ? (a = r ? l : c, o(a(new e.BigNumber(i.start), new e.BigNumber(i.end), new e.BigNumber(i.step)))) : (a = r ? u : s, o(a(i.start, i.end, i.step)))
            }

            function s(e, t, n) {
                var r = [],
                    i = e;
                if (n > 0)
                    for (; i < t;) r.push(i), i += n;
                else if (n < 0)
                    for (; i > t;) r.push(i), i += n;
                return r
            }

            function u(e, t, n) {
                var r = [],
                    i = e;
                if (n > 0)
                    for (; i <= t;) r.push(i), i += n;
                else if (n < 0)
                    for (; i >= t;) r.push(i), i += n;
                return r
            }

            function c(e, t, n) {
                var r = [],
                    i = e;
                if (n.gt(p))
                    for (; i.lt(t);) r.push(i), i = i.plus(n);
                else if (n.lt(p))
                    for (; i.gt(t);) r.push(i), i = i.plus(n);
                return r
            }

            function l(e, t, n) {
                var r = [],
                    i = e;
                if (n.gt(p))
                    for (; i.lte(t);) r.push(i), i = i.plus(n);
                else if (n.lt(p))
                    for (; i.gte(t);) r.push(i), i = i.plus(n);
                return r
            }

            function f(e) {
                var t = e.split(":"),
                    n = t.map(function (e) {
                        return Number(e)
                    }),
                    r = n.some(function (e) {
                        return isNaN(e)
                    });
                if (r) return null;
                switch (n.length) {
                    case 2:
                        return {
                            start: n[0], end: n[1], step: 1
                        };
                    case 3:
                        return {
                            start: n[0], end: n[2], step: n[1]
                        };
                    default:
                        return null
                }
            }
            var h = r(n(0)),
                p = new e.BigNumber(0),
                m = new e.BigNumber(1),
                d = i("range", {
                    string: a,
                    "string, boolean": a,
                    "number, number": function (e, t) {
                        return o(s(e, t, 1))
                    },
                    "number, number, number": function (e, t, n) {
                        return o(s(e, t, n))
                    },
                    "number, number, boolean": function (e, t, n) {
                        return o(n ? u(e, t, 1) : s(e, t, 1))
                    },
                    "number, number, number, boolean": function (e, t, n, r) {
                        return o(r ? u(e, t, n) : s(e, t, n))
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        return o(c(e, t, m))
                    },
                    "BigNumber, BigNumber, BigNumber": function (e, t, n) {
                        return o(c(e, t, n))
                    },
                    "BigNumber, BigNumber, boolean": function (e, t, n) {
                        return o(n ? l(e, t, m) : c(e, t, m))
                    },
                    "BigNumber, BigNumber, BigNumber, boolean": function (e, t, n, r) {
                        return o(r ? l(e, t, n) : c(e, t, n))
                    }
                });
            return d.toTex = void 0, d
        }
        t.name = "range", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(18)),
                c = a("trace", {
                    Array: function (e) {
                        return c(s(e))
                    },
                    Matrix: function (e) {
                        var t;
                        switch (e.storage()) {
                            case "dense":
                                t = l(e);
                                break;
                            case "sparse":
                                t = f(e)
                        }
                        return t
                    },
                    any: i
                }),
                l = function (e) {
                    var t = e._size,
                        n = e._data;
                    switch (t.length) {
                        case 1:
                            if (1 == t[0]) return i(n[0]);
                            throw new RangeError("Matrix must be square (size: " + o(t) + ")");
                        case 2:
                            var r = t[0],
                                a = t[1];
                            if (r === a) {
                                for (var s = 0, c = 0; c < r; c++) s = u(s, n[c][c]);
                                return s
                            }
                            throw new RangeError("Matrix must be square (size: " + o(t) + ")");
                        default:
                            throw new RangeError("Matrix must be two dimensional (size: " + o(t) + ")")
                    }
                },
                f = function (e) {
                    var t = e._values,
                        n = e._index,
                        r = e._ptr,
                        i = e._size,
                        a = i[0],
                        s = i[1];
                    if (a === s) {
                        var c = 0;
                        if (t.length > 0)
                            for (var l = 0; l < s; l++)
                                for (var f = r[l], h = r[l + 1], p = f; p < h; p++) {
                                    var m = n[p];
                                    if (m === l) {
                                        c = u(c, t[p]);
                                        break
                                    }
                                    if (m > l) break
                                }
                        return c
                    }
                    throw new RangeError("Matrix must be square (size: " + o(i) + ")")
                };
            return c.toTex = {
                1: "\\mathrm{tr}\\left(${args[0]}\\right)"
            }, c
        }
        var i = n(5).clone,
            o = n(11).format;
        t.name = "trace", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, u) {
            function c(n) {
                if (n.isZero()) return new e.BigNumber(1);
                for (var r = t.precision + (0 | Math.log(n.toNumber())), i = e.BigNumber.clone({
                        precision: r
                    }), o = new i(n), a = n.toNumber() - 1; a > 1;) o = o.times(a), a--;
                return new e.BigNumber(o.toPrecision(e.BigNumber.precision))
            }
            var l = r(n(12)),
                f = r(n(39)),
                h = u("gamma", {
                    number: function (e) {
                        var t, n;
                        if (o(e)) {
                            if (e <= 0) return isFinite(e) ? 1 / 0 : NaN;
                            if (e > 171) return 1 / 0;
                            for (var r = e - 2, i = e - 1; r > 1;) i *= r, r--;
                            return 0 == i && (i = 1), i
                        }
                        if (e < .5) return Math.PI / (Math.sin(Math.PI * e) * h(1 - e));
                        if (e >= 171.35) return 1 / 0;
                        if (e > 85) {
                            var u = e * e,
                                c = u * e,
                                l = c * e,
                                f = l * e;
                            return Math.sqrt(2 * Math.PI / e) * Math.pow(e / Math.E, e) * (1 + 1 / (12 * e) + 1 / (288 * u) - 139 / (51840 * c) - 571 / (2488320 * l) + 163879 / (209018880 * f) + 5246819 / (75246796800 * f * e))
                        }--e, n = s[0];
                        for (var p = 1; p < s.length; ++p) n += s[p] / (e + p);
                        return t = e + a + .5, Math.sqrt(2 * Math.PI) * Math.pow(t, e + .5) * Math.exp(-t) * n
                    },
                    Complex: function (t) {
                        var n, r;
                        if (0 == t.im) return h(t.re);
                        t = new e.Complex(t.re - 1, t.im), r = new e.Complex(s[0], 0);
                        for (var i = 1; i < s.length; ++i) {
                            var o = t.re + i,
                                u = o * o + t.im * t.im;
                            0 != u ? (r.re += s[i] * o / u, r.im += -(s[i] * t.im) / u) : r.re = s[i] < 0 ? -(1 / 0) : 1 / 0
                        }
                        n = new e.Complex(t.re + a + .5, t.im);
                        var c = Math.sqrt(2 * Math.PI);
                        t.re += .5;
                        var p = f(n, t);
                        0 == p.im ? p.re *= c : 0 == p.re ? p.im *= c : (p.re *= c, p.im *= c);
                        var m = Math.exp(-n.re);
                        return n.re = m * Math.cos(-n.im), n.im = m * Math.sin(-n.im), l(l(p, n), r)
                    },
                    BigNumber: function (t) {
                        if (t.isInteger()) return t.isNegative() || t.isZero() ? new e.BigNumber(1 / 0) : c(t.minus(1));
                        if (!t.isFinite()) return new e.BigNumber(t.isNegative() ? NaN : 1 / 0);
                        throw new Error("Integer BigNumber expected")
                    },
                    "Array | Matrix": function (e) {
                        return i(e, h)
                    }
                });
            return h.toTex = {
                1: "\\Gamma\\left(${args[0]}\\right)"
            }, h
        }
        var i = n(1),
            o = n(2).isInteger,
            a = 4.7421875,
            s = [.9999999999999971, 57.15623566586292, -59.59796035547549, 14.136097974741746, -.4919138160976202, 3399464998481189e-20, 4652362892704858e-20, -9837447530487956e-20, .0001580887032249125, -.00021026444172410488, .00021743961811521265, -.0001643181065367639, 8441822398385275e-20, -26190838401581408e-21, 36899182659531625e-22];
        t.name = "gamma", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(14)),
                c = r(n(24)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = n(4),
                m = a("largerEq", {
                    "boolean, boolean": function (e, t) {
                        return e >= t
                    },
                    "number, number": function (e, n) {
                        return e >= n || i(e, n, t.epsilon)
                    },
                    "BigNumber, BigNumber": function (e, n) {
                        return e.gte(n) || o(e, n, t.epsilon)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return e.compare(t) !== -1
                    },
                    "Complex, Complex": function () {
                        throw new TypeError("No ordering relation is defined for complex numbers")
                    },
                    "Unit, Unit": function (e, t) {
                        if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                        return m(e.value, t.value)
                    },
                    "string, string": function (e, t) {
                        return e >= t
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m);
                                        break;
                                    default:
                                        n = u(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, m, !1);
                                        break;
                                    default:
                                        n = f(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, m, !1);
                                break;
                            default:
                                n = h(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, m, !0);
                                break;
                            default:
                                n = h(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(s(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(s(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + p.operators.largerEq + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.name = "largerEq", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(14)),
                c = r(n(24)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = n(4),
                m = a("unequal", {
                    "any, any": function (e, t) {
                        return null === e ? null !== t : null === t ? null !== e : void 0 === e ? void 0 !== t : void 0 === t ? void 0 !== e : d(e, t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, d);
                                        break;
                                    default:
                                        n = u(t, e, d, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, d, !1);
                                        break;
                                    default:
                                        n = f(e, t, d)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, d, !1);
                                break;
                            default:
                                n = h(e, t, d, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, d, !0);
                                break;
                            default:
                                n = h(t, e, d, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(s(e), t, d, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(s(t), e, d, !0).valueOf()
                    }
                }),
                d = a("_unequal", {
                    "boolean, boolean": function (e, t) {
                        return e !== t
                    },
                    "number, number": function (e, n) {
                        return !i(e, n, t.epsilon)
                    },
                    "BigNumber, BigNumber": function (e, n) {
                        return !o(e, n, t.epsilon)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return !e.equals(t)
                    },
                    "Complex, Complex": function (e, t) {
                        return !e.equals(t)
                    },
                    "Unit, Unit": function (e, t) {
                        if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                        return m(e.value, t.value)
                    },
                    "string, string": function (e, t) {
                        return e !== t
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + p.operators.unequal + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.name = "unequal", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s) {
            function u(e, t) {
                return l(e, t) ? e : t
            }

            function c(e) {
                var t = void 0;
                if (i(e, function (e) {
                        (void 0 === t || l(e, t)) && (t = e)
                    }), void 0 === t) throw new Error("Cannot calculate max of an empty array");
                return t
            }
            var l = r(n(28)),
                f = s("max", {
                    "Array | Matrix": c,
                    "Array | Matrix, number | BigNumber": function (e, t) {
                        return o(e, t.valueOf(), u)
                    },
                    "...": function (e) {
                        if (a(e)) throw new TypeError("Scalar values expected in function max");
                        return c(e)
                    }
                });
            return f.toTex = "\\max\\left(${args}\\right)", f
        }
        var i = n(36),
            o = n(62),
            a = n(61);
        t.name = "max", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, u) {
            function c(e, t) {
                var n = a(e, t, f),
                    r = Array.isArray(e) ? i(e) : e.size();
                return h(n, r[t])
            }

            function l(e) {
                var t = 0,
                    n = 0;
                if (o(e, function (e) {
                        t = f(t, e), n++
                    }), 0 === n) throw new Error("Cannot calculate mean of an empty array");
                return h(t, n)
            }
            var f = r(n(18)),
                h = r(n(38)),
                p = u("mean", {
                    "Array | Matrix": l,
                    "Array | Matrix, number | BigNumber": c,
                    "...": function (e) {
                        if (s(e)) throw new TypeError("Scalar values expected in function mean");
                        return l(e)
                    }
                });
            return p.toTex = void 0, p
        }
        var i = n(3).size,
            o = n(36),
            a = n(62),
            s = n(61);
        t.name = "mean", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e) {
                e = i(e.valueOf());
                var t = e.length;
                if (0 == t) throw new Error("Cannot calculate median of an empty array");
                if (t % 2 == 0) {
                    for (var n = t / 2 - 1, r = f(e, n + 1), o = e[n], a = 0; a < n; ++a) l(e[a], o) > 0 && (o = e[a]);
                    return m(o, r)
                }
                var s = f(e, (t - 1) / 2);
                return p(s)
            }
            var u = r(n(20)),
                c = r(n(19)),
                l = r(n(49)),
                f = r(n(70)),
                h = a("median", {
                    "Array | Matrix": s,
                    "Array | Matrix, number | BigNumber": function (e, t) {
                        throw new Error("median(A, dim) is not yet supported")
                    },
                    "...": function (e) {
                        if (o(e)) throw new TypeError("Scalar values expected in function median");
                        return s(e)
                    }
                }),
                p = a({
                    "number | BigNumber | Unit": function (e) {
                        return e
                    }
                }),
                m = a({
                    "number | BigNumber | Unit, number | BigNumber | Unit": function (e, t) {
                        return c(u(e, t), 2)
                    }
                });
            return h.toTex = void 0, h
        }
        var i = n(3).flatten,
            o = (n(62), n(61));
        t.name = "median", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s) {
            function u(e, t) {
                return l(e, t) ? e : t
            }

            function c(e) {
                var t = void 0;
                if (i(e, function (e) {
                        (void 0 === t || l(e, t)) && (t = e)
                    }), void 0 === t) throw new Error("Cannot calculate min of an empty array");
                return t
            }
            var l = r(n(40)),
                f = s("min", {
                    "Array | Matrix": c,
                    "Array | Matrix, number | BigNumber": function (e, t) {
                        return o(e, t.valueOf(), u)
                    },
                    "...": function (e) {
                        if (a(e)) throw new TypeError("Scalar values expected in function min");
                        return c(e)
                    }
                });
            return f.toTex = "\\min\\left(${args}\\right)", f
        }
        var i = n(36),
            o = n(62),
            a = n(61);
        t.name = "min", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(n) {
                var r = void 0;
                if (i(n, function (e) {
                        r = void 0 === r ? e : s(r, e)
                    }), void 0 === r) switch (t.number) {
                    case "number":
                        return 0;
                    case "BigNumber":
                        return new e.BigNumber(0);
                    case "Fraction":
                        return new e.Fraction(0);
                    default:
                        return 0
                }
                return r
            }
            var s = r(n(20)),
                u = o("sum", {
                    "Array | Matrix": function (e) {
                        return a(e)
                    },
                    "Array | Matrix, number | BigNumber": function () {
                        throw new Error("sum(A, dim) is not yet supported")
                    },
                    "...": function (e) {
                        return a(e)
                    }
                });
            return u.toTex = void 0, u
        }
        var i = n(36);
        t.name = "sum", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(t, n) {
                var r = 0,
                    i = 0;
                if (0 == t.length) throw new SyntaxError("Function var requires one or more parameters (0 provided)");
                if (o(t, function (e) {
                        r = u(r, e), i++
                    }), 0 === i) throw new Error("Cannot calculate var of an empty array");
                var a = f(r, i);
                switch (r = 0, o(t, function (e) {
                    var t = c(e, a);
                    r = u(r, l(t, t))
                }), n) {
                    case "uncorrected":
                        return f(r, i);
                    case "biased":
                        return f(r, i + 1);
                    case "unbiased":
                        var s = r && r.isBigNumber === !0 ? new e.BigNumber(0) : 0;
                        return 1 == i ? s : f(r, i - 1);
                    default:
                        throw new Error('Unknown normalization "' + n + '". Choose "unbiased" (default), "uncorrected", or "biased".')
                }
            }
            var u = r(n(20)),
                c = r(n(21)),
                l = r(n(22)),
                f = r(n(19)),
                h = a("variance", {
                    "Array | Matrix": function (e) {
                        return s(e, i)
                    },
                    "Array | Matrix, string": s,
                    "...": function (e) {
                        return s(e, i)
                    }
                });
            return h.toTex = "\\mathrm{Var}\\left(${args}\\right)", h
        }
        var i = "unbiased",
            o = n(36);
        t.name = "var", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("format", {
                any: i.format,
                "any, Object | function | number": i.format
            });
            return o.toTex = void 0, o
        }
        var i = n(11);
        t.name = "format", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("acosh", {
                number: function (n) {
                    return n >= 1 || t.predictable ? o(n) : n <= -1 ? new e.Complex(Math.log(Math.sqrt(n * n - 1) - n), Math.PI) : new e.Complex(n, 0).acosh()
                },
                Complex: function (e) {
                    return e.acosh()
                },
                BigNumber: function (e) {
                    return e.acosh()
                },
                "Array | Matrix": function (e) {
                    return i(e, a)
                }
            });
            return a.toTex = {
                1: "\\cosh^{-1}\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = Math.acosh || function (e) {
                return Math.log(Math.sqrt(e * e - 1) + e)
            };
        t.name = "acosh", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("clone", {
                any: i.clone
            });
            return o.toTex = void 0, o
        }
        var i = n(5);
        t.name = "clone", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("_typeof", {
                any: function (e) {
                    var t = i.type(e);
                    if ("Object" === t) {
                        if (e.isBigNumber === !0) return "BigNumber";
                        if (e.isComplex === !0) return "Complex";
                        if (e.isFraction === !0) return "Fraction";
                        if (e.isMatrix === !0) return "Matrix";
                        if (e.isUnit === !0) return "Unit";
                        if (e.isIndex === !0) return "Index";
                        if (e.isRange === !0) return "Range";
                        if (e.isChain === !0) return "Chain";
                        if (e.isHelp === !0) return "Help"
                    }
                    return t
                }
            });
            return o.toTex = void 0, o
        }
        var i = n(63);
        t.name = "typeof", t.factory = r
    }, function (e, t, n) {
        function r(e, t, n, r, s) {
            return i.prototype.type = "Complex", i.prototype.isComplex = !0, i.prototype.toJSON = function () {
                return {
                    mathjs: "Complex",
                    re: this.re,
                    im: this.im
                }
            }, i.prototype.toPolar = function () {
                return {
                    r: this.abs(),
                    phi: this.arg()
                }
            }, i.prototype.format = function (e) {
                var t = "",
                    n = this.im,
                    r = this.re,
                    i = o(this.re, e),
                    s = o(this.im, e),
                    u = a(e) ? e : e ? e.precision : null;
                if (null !== u) {
                    var c = Math.pow(10, -u);
                    Math.abs(r / n) < c && (r = 0), Math.abs(n / r) < c && (n = 0)
                }
                return t = 0 == n ? i : 0 == r ? 1 == n ? "i" : n == -1 ? "-i" : s + "i" : n < 0 ? n == -1 ? i + " - i" : i + " - " + (/[\d-.]/.test(s.charAt(0)) ? s.substring(1) : s) + "i" : 1 == n ? i + " + i" : i + " + " + s + "i"
            }, i.fromPolar = function (e) {
                switch (arguments.length) {
                    case 1:
                        var t = arguments[0];
                        if ("object" == typeof t) return i(t);
                        throw new TypeError("Input has to be an object with r and phi keys.");
                    case 2:
                        var n = arguments[0],
                            r = arguments[1];
                        if (a(n)) {
                            if (r && r.isUnit && r.hasBase("ANGLE") && (r = r.toNumber("rad")), a(r)) return new i({
                                r: n,
                                phi: r
                            });
                            throw new TypeError("Phi is not a number nor an angle unit.")
                        }
                        throw new TypeError("Radius r is not a number.");
                    default:
                        throw new SyntaxError("Wrong number of arguments in function fromPolar")
                }
            }, i.prototype.valueOf = i.prototype.toString, i.fromJSON = function (e) {
                return new i(e)
            }, i.EPSILON = t.epsilon, s.on("config", function (e, t) {
                e.epsilon !== t.epsilon && (i.EPSILON = e.epsilon)
            }), i
        }
        var i = n(512),
            o = n(2).format,
            a = n(2).isNumber;
        t.name = "Complex", t.path = "type", t.factory = r, t.math = !0
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("fraction", {
                number: function (t) {
                    if (!isFinite(t) || isNaN(t)) throw new Error(t + " cannot be represented as a fraction");
                    return new e.Fraction(t)
                },
                string: function (t) {
                    return new e.Fraction(t)
                },
                "number, number": function (t, n) {
                    return new e.Fraction(t, n)
                },
                BigNumber: function (t) {
                    return new e.Fraction(t.toString())
                },
                Fraction: function (e) {
                    return e
                },
                Object: function (t) {
                    return new e.Fraction(t)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        t.name = "fraction", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, c) {
            function d(e, t) {
                if (!(this instanceof d)) throw new SyntaxError("Constructor must be called with the new operator");
                if (t && !p(t)) throw new Error("Invalid datatype: " + t);
                if (e && e.isMatrix === !0) "DenseMatrix" === e.type ? (this._data = u.clone(e._data), this._size = u.clone(e._size), this._datatype = t || e._datatype) : (this._data = e.toArray(), this._size = e.size(), this._datatype = t || e._datatype);
                else if (e && l(e.data) && l(e.size)) this._data = e.data, this._size = e.size, this._datatype = t || e.datatype;
                else if (l(e)) this._data = b(e), this._size = s.size(this._data), s.validate(this._data, this._size), this._datatype = t;
                else {
                    if (e) throw new TypeError("Unsupported type of data (" + i.types.type(e) + ")");
                    this._data = [], this._size = [0], this._datatype = t
                }
            }

            function v(e, t) {
                if (!t || t.isIndex !== !0) throw new TypeError("Invalid index");
                var n = t.isScalar();
                if (n) return e.get(t.min());
                var r = t.size();
                if (r.length != e._size.length) throw new o(r.length, e._size.length);
                for (var i = t.min(), a = t.max(), s = 0, u = e._size.length; s < u; s++) m(i[s], e._size[s]), m(a[s], e._size[s]);
                return new d(g(e._data, t, r.length, 0), e._datatype)
            }

            function g(e, t, n, r) {
                var i = r === n - 1,
                    o = t.dimension(r);
                return i ? o.map(function (t) {
                    return m(t, e.length), e[t]
                }).valueOf() : o.map(function (i) {
                    m(i, e.length);
                    var o = e[i];
                    return g(o, t, n, r + 1)
                }).valueOf()
            }

            function y(e, t, n, r) {
                if (!t || t.isIndex !== !0) throw new TypeError("Invalid index");
                var i, a = t.size(),
                    c = t.isScalar();
                if (n && n.isMatrix === !0 ? (i = n.size(), n = n.valueOf()) : i = s.size(n), c) {
                    if (0 !== i.length) throw new TypeError("Scalar expected");
                    e.set(t.min(), n, r)
                } else {
                    if (a.length < e._size.length) throw new o(a.length, e._size.length, "<");
                    if (i.length < a.length) {
                        for (var l = 0, f = 0; 1 === a[l] && 1 === i[l];) l++;
                        for (; 1 === a[l];) f++, l++;
                        n = s.unsqueeze(n, a.length, f, i)
                    }
                    if (!u.deepEqual(a, i)) throw new o(a, i, ">");
                    var h = t.max().map(function (e) {
                        return e + 1
                    });
                    x(e, h, r);
                    var p = a.length,
                        m = 0;
                    w(e._data, t, n, p, m)
                }
                return e
            }

            function w(e, t, n, r, i) {
                var o = i === r - 1,
                    a = t.dimension(i);
                o ? a.forEach(function (t, r) {
                    m(t), e[t] = n[r[0]]
                }) : a.forEach(function (o, a) {
                    m(o), w(e[o], t, n[a[0]], r, i + 1)
                })
            }

            function x(e, t, n) {
                for (var r = e._size.slice(0), i = !1; r.length < t.length;) r.push(0), i = !0;
                for (var o = 0, a = t.length; o < a; o++) t[o] > r[o] && (r[o] = t[o], i = !0);
                i && M(e, r, n)
            }

            function b(e) {
                for (var t = 0, n = e.length; t < n; t++) {
                    var r = e[t];
                    l(r) ? e[t] = b(r) : r && r.isMatrix === !0 && (e[t] = b(r.valueOf()))
                }
                return e
            }
            var C = r(n(75));
            d.prototype = new C, d.prototype.type = "DenseMatrix", d.prototype.isDenseMatrix = !0, d.prototype.storage = function () {
                return "dense"
            }, d.prototype.datatype = function () {
                return this._datatype
            }, d.prototype.create = function (e, t) {
                return new d(e, t)
            }, d.prototype.subset = function (e, t, n) {
                switch (arguments.length) {
                    case 1:
                        return v(this, e);
                    case 2:
                    case 3:
                        return y(this, e, t, n);
                    default:
                        throw new SyntaxError("Wrong number of arguments")
                }
            }, d.prototype.get = function (e) {
                if (!l(e)) throw new TypeError("Array expected");
                if (e.length != this._size.length) throw new o(e.length, this._size.length);
                for (var t = 0; t < e.length; t++) m(e[t], this._size[t]);
                for (var n = this._data, r = 0, i = e.length; r < i; r++) {
                    var a = e[r];
                    m(a, n.length), n = n[a]
                }
                return n
            }, d.prototype.set = function (e, t, n) {
                if (!l(e)) throw new TypeError("Array expected");
                if (e.length < this._size.length) throw new o(e.length, this._size.length, "<");
                var r, i, a, s = e.map(function (e) {
                    return e + 1
                });
                x(this, s, n);
                var u = this._data;
                for (r = 0, i = e.length - 1; r < i; r++) a = e[r], m(a, u.length), u = u[a];
                return a = e[e.length - 1], m(a, u.length), u[a] = t, this
            }, d.prototype.resize = function (e, t, n) {
                if (!l(e)) throw new TypeError("Array expected");
                var r = n ? this.clone() : this;
                return M(r, e, t)
            };
            var M = function (e, t, n) {
                if (0 === t.length) {
                    for (var r = e._data; l(r);) r = r[0];
                    return r
                }
                return e._size = t.slice(0), e._data = s.resize(e._data, e._size, n), e
            };
            return d.prototype.reshape = function (e, t) {
                var n = t ? this.clone() : this;
                return n._data = s.reshape(n._data, e), n._size = e.slice(0), n
            }, d.prototype.clone = function () {
                var e = new d({
                    data: u.clone(this._data),
                    size: u.clone(this._size),
                    datatype: this._datatype
                });
                return e
            }, d.prototype.size = function () {
                return this._size.slice(0)
            }, d.prototype.map = function (e) {
                var t = this,
                    n = function (r, i) {
                        return l(r) ? r.map(function (e, t) {
                            return n(e, i.concat(t))
                        }) : e(r, i, t)
                    };
                return new d({
                    data: n(this._data, []),
                    size: u.clone(this._size),
                    datatype: this._datatype
                })
            }, d.prototype.forEach = function (e) {
                var t = this,
                    n = function (r, i) {
                        l(r) ? r.forEach(function (e, t) {
                            n(e, i.concat(t))
                        }) : e(r, i, t)
                    };
                n(this._data, [])
            }, d.prototype.toArray = function () {
                return u.clone(this._data)
            }, d.prototype.valueOf = function () {
                return this._data
            }, d.prototype.format = function (e) {
                return a.format(this._data, e)
            }, d.prototype.toString = function () {
                return a.format(this._data)
            }, d.prototype.toJSON = function () {
                return {
                    mathjs: "DenseMatrix",
                    data: this._data,
                    size: this._size,
                    datatype: this._datatype
                }
            }, d.prototype.diagonal = function (e) {
                if (e) {
                    if (e.isBigNumber === !0 && (e = e.toNumber()), !f(e) || !h(e)) throw new TypeError("The parameter k must be an integer number")
                } else e = 0;
                for (var t = e > 0 ? e : 0, n = e < 0 ? -e : 0, r = this._size[0], i = this._size[1], o = Math.min(r - n, i - t), a = [], s = 0; s < o; s++) a[s] = this._data[s + n][s + t];
                return new d({
                    data: a,
                    size: [o],
                    datatype: this._datatype
                })
            }, d.diagonal = function (t, n, r, i, o) {
                if (!l(t)) throw new TypeError("Array expected, size parameter");
                if (2 !== t.length) throw new Error("Only two dimensions matrix are supported");
                if (t = t.map(function (e) {
                        if (e && e.isBigNumber === !0 && (e = e.toNumber()), !f(e) || !h(e) || e < 1) throw new Error("Size values must be positive integers");
                        return e
                    }), r) {
                    if (r && r.isBigNumber === !0 && (r = r.toNumber()), !f(r) || !h(r)) throw new TypeError("The parameter k must be an integer number")
                } else r = 0;
                i && p(o) && (i = c.convert(i, o));
                var a, u = r > 0 ? r : 0,
                    m = r < 0 ? -r : 0,
                    v = t[0],
                    g = t[1],
                    y = Math.min(v - m, g - u);
                if (l(n)) {
                    if (n.length !== y) throw new Error("Invalid value array length");
                    a = function (e) {
                        return n[e]
                    }
                } else if (n && n.isMatrix === !0) {
                    var w = n.size();
                    if (1 !== w.length || w[0] !== y) throw new Error("Invalid matrix length");
                    a = function (e) {
                        return n.get([e])
                    }
                } else a = function () {
                    return n
                };
                i || (i = a(0) && a(0).isBigNumber === !0 ? new e.BigNumber(0) : 0);
                var x = [];
                if (t.length > 0) {
                    x = s.resize(x, t, i);
                    for (var b = 0; b < y; b++) x[b + m][b + u] = a(b)
                }
                return new d({
                    data: x,
                    size: [v, g]
                })
            }, d.fromJSON = function (e) {
                return new d(e)
            }, d.prototype.swapRows = function (e, t) {
                if (!(f(e) && h(e) && f(t) && h(t))) throw new Error("Row index must be positive integers");
                if (2 !== this._size.length) throw new Error("Only two dimensional matrix is supported");
                return m(e, this._size[0]), m(t, this._size[0]), d._swapRows(e, t, this._data), this
            }, d._swapRows = function (e, t, n) {
                var r = n[e];
                n[e] = n[t], n[t] = r
            }, e.Matrix._storage.dense = d, e.Matrix._storage.default = d, d
        }
        var i = n(25),
            o = n(9),
            a = (n(17).getSafeProperty, n(17).setSafeProperty, i.string),
            s = i.array,
            u = i.object,
            c = i.number,
            l = Array.isArray,
            f = c.isNumber,
            h = c.isInteger,
            p = a.isString,
            m = s.validateIndex;
        t.name = "DenseMatrix", t.path = "type", t.factory = r, t.lazy = !1
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function o(e, t, n) {
                if (!(this instanceof o)) throw new SyntaxError("Constructor must be called with the new operator");
                if (null != e)
                    if (e.isBigNumber === !0) e = e.toNumber();
                    else if ("number" != typeof e) throw new TypeError("Parameter start must be a number");
                if (null != t)
                    if (t.isBigNumber === !0) t = t.toNumber();
                    else if ("number" != typeof t) throw new TypeError("Parameter end must be a number");
                if (null != n)
                    if (n.isBigNumber === !0) n = n.toNumber();
                    else if ("number" != typeof n) throw new TypeError("Parameter step must be a number");
                this.start = null != e ? parseFloat(e) : 0, this.end = null != t ? parseFloat(t) : 0, this.step = null != n ? parseFloat(n) : 1
            }
            return o.prototype.type = "Range", o.prototype.isRange = !0, o.parse = function (e) {
                if ("string" != typeof e) return null;
                var t = e.split(":"),
                    n = t.map(function (e) {
                        return parseFloat(e)
                    }),
                    r = n.some(function (e) {
                        return isNaN(e)
                    });
                if (r) return null;
                switch (n.length) {
                    case 2:
                        return new o(n[0], n[1]);
                    case 3:
                        return new o(n[0], n[2], n[1]);
                    default:
                        return null
                }
            }, o.prototype.clone = function () {
                return new o(this.start, this.end, this.step)
            }, o.prototype.size = function () {
                var e = 0,
                    t = this.start,
                    n = this.step,
                    r = this.end,
                    o = r - t;
                return i.sign(n) == i.sign(o) ? e = Math.ceil(o / n) : 0 == o && (e = 0), isNaN(e) && (e = 0), [e]
            }, o.prototype.min = function () {
                var e = this.size()[0];
                return e > 0 ? this.step > 0 ? this.start : this.start + (e - 1) * this.step : void 0
            }, o.prototype.max = function () {
                var e = this.size()[0];
                return e > 0 ? this.step > 0 ? this.start + (e - 1) * this.step : this.start : void 0
            }, o.prototype.forEach = function (e) {
                var t = this.start,
                    n = this.step,
                    r = this.end,
                    i = 0;
                if (n > 0)
                    for (; t < r;) e(t, [i], this), t += n, i++;
                else if (n < 0)
                    for (; t > r;) e(t, [i], this), t += n, i++
            }, o.prototype.map = function (e) {
                var t = [];
                return this.forEach(function (n, r, i) {
                    t[r[0]] = e(n, r, i)
                }), t
            }, o.prototype.toArray = function () {
                var e = [];
                return this.forEach(function (t, n) {
                    e[n[0]] = t
                }), e
            }, o.prototype.valueOf = function () {
                return this.toArray()
            }, o.prototype.format = function (e) {
                var t = i.format(this.start, e);
                return 1 != this.step && (t += ":" + i.format(this.step, e)), t += ":" + i.format(this.end, e)
            }, o.prototype.toString = function () {
                return this.format()
            }, o.prototype.toJSON = function () {
                return {
                    mathjs: "Range",
                    start: this.start,
                    end: this.end,
                    step: this.step
                }
            }, o.fromJSON = function (e) {
                return new o(e.start, e.end, e.step)
            }, o
        }
        var i = n(2);
        t.name = "Range", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(10)),
                s = e.SparseMatrix,
                u = function (e, t, n) {
                    var r = e._values,
                        u = e._index,
                        c = e._ptr,
                        l = e._size,
                        f = e._datatype,
                        h = t._values,
                        p = t._index,
                        m = t._ptr,
                        d = t._size,
                        v = t._datatype;
                    if (l.length !== d.length) throw new i(l.length, d.length);
                    if (l[0] !== d[0] || l[1] !== d[1]) throw new RangeError("Dimension mismatch. Matrix A (" + l + ") must match Matrix B (" + d + ")");
                    var g, y = l[0],
                        w = l[1],
                        x = a,
                        b = 0,
                        C = n;
                    "string" == typeof f && f === v && (g = f, x = o.find(a, [g, g]), b = o.convert(0, g), C = o.find(n, [g, g]));
                    var M, T, N, E, A, S = r && h ? [] : void 0,
                        P = [],
                        O = [],
                        _ = new s({
                            values: S,
                            index: P,
                            ptr: O,
                            size: [y, w],
                            datatype: g
                        }),
                        I = S ? [] : void 0,
                        B = [];
                    for (T = 0; T < w; T++) {
                        O[T] = P.length;
                        var k = T + 1;
                        if (I)
                            for (E = m[T], A = m[T + 1], N = E; N < A; N++) M = p[N], B[M] = k, I[M] = h[N];
                        for (E = c[T], A = c[T + 1], N = E; N < A; N++)
                            if (M = u[N], I) {
                                var V = B[M] === k ? I[M] : b,
                                    z = C(r[N], V);
                                x(z, b) || (P.push(M), S.push(z))
                            } else P.push(M)
                    }
                    return O[w] = P.length, _
                };
            return u
        }
        var i = n(9);
        t.name = "algorithm09", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function i(e) {
                if (!(this instanceof i)) throw new SyntaxError("Constructor must be called with the new operator");
                this.entries = e || []
            }
            return i.prototype.type = "ResultSet", i.prototype.isResultSet = !0, i.prototype.valueOf = function () {
                return this.entries
            }, i.prototype.toString = function () {
                return "[" + this.entries.join(", ") + "]"
            }, i.prototype.toJSON = function () {
                return {
                    mathjs: "ResultSet",
                    entries: this.entries
                }
            }, i.fromJSON = function (e) {
                return new i(e.entries)
            }, i
        }
        t.name = "ResultSet", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s, u) {
            function c(e, t) {
                if (!(this instanceof c)) throw new Error("Constructor must be called with the new operator");
                if (void 0 !== e && !P(e) && !e.isComplex) throw new TypeError("First parameter in Unit constructor must be number, BigNumber, Fraction, Complex, or undefined");
                if (void 0 != t && ("string" != typeof t || "" == t)) throw new TypeError("Second parameter in Unit constructor must be a string");
                if (void 0 != t) {
                    var n = c.parse(t);
                    this.units = n.units, this.dimensions = n.dimensions
                } else {
                    this.units = [{
                        unit: j,
                        prefix: D.NONE,
                        power: 0
                    }], this.dimensions = [];
                    for (var r = 0; r < U.length; r++) this.dimensions[r] = 0
                }
                this.value = void 0 != e ? this._normalize(e) : null, this.fixPrefix = !1, this.isUnitListSimplified = !0
            }

            function l() {
                for (;
                    " " == z || "\t" == z;) p()
            }

            function f(e) {
                return e >= "0" && e <= "9" || "." == e
            }

            function h(e) {
                return e >= "0" && e <= "9"
            }

            function p() {
                V++, z = k.charAt(V)
            }

            function m(e) {
                V = e, z = k.charAt(V)
            }

            function d() {
                var e, t = "";
                if (e = V, "+" == z ? p() : "-" == z && (t += z, p()), !f(z)) return m(e), null;
                if ("." == z) {
                    if (t += z, p(), !h(z)) return m(e), null
                } else {
                    for (; h(z);) t += z, p();
                    "." == z && (t += z, p())
                }
                for (; h(z);) t += z, p();
                if ("E" == z || "e" == z) {
                    var n = "",
                        r = V;
                    if (n += z, p(), "+" != z && "-" != z || (n += z, p()), !h(z)) return m(r), t;
                    for (t += n; h(z);) t += z, p()
                }
                return t
            }

            function v() {
                for (var e = "", t = k.charCodeAt(V); t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122;) e += z, p(), t = k.charCodeAt(V);
                return t = e.charCodeAt(0), t >= 65 && t <= 90 || t >= 97 && t <= 122 ? e || null : null
            }

            function g(e) {
                return z === e ? (p(), e) : null
            }

            function y(e) {
                if (W.hasOwnProperty(e)) {
                    var t = W[e],
                        n = t.prefixes[""];
                    return {
                        unit: t,
                        prefix: n
                    }
                }
                for (var r in W)
                    if (W.hasOwnProperty(r) && i(e, r)) {
                        var t = W[r],
                            o = e.length - r.length,
                            a = e.substring(0, o),
                            n = t.prefixes.hasOwnProperty(a) ? t.prefixes[a] : void 0;
                        if (void 0 !== n) return {
                            unit: t,
                            prefix: n
                        }
                    } return null
            }

            function w(t) {
                if ("BigNumber" === t.number) {
                    var n = a.pi(e.BigNumber);
                    W.rad.value = new e.BigNumber(1), W.deg.value = n.div(180), W.grad.value = n.div(200), W.cycle.value = n.times(2), W.arcsec.value = n.div(648e3), W.arcmin.value = n.div(10800)
                } else W.rad.value = 1, W.deg.value = Math.PI / 180, W.grad.value = Math.PI / 200, W.cycle.value = 2 * Math.PI, W.arcsec.value = Math.PI / 648e3, W.arcmin.value = Math.PI / 10800
            }

            function x(e) {
                for (var t = 0; t < e.length; t++) {
                    var n = e.charAt(t),
                        r = function (e) {
                            return /^[a-zA-Z]$/.test(e)
                        },
                        i = function (e) {
                            return e >= "0" && e <= "9"
                        };
                    if (0 === t && !r(n)) throw new Error('Invalid unit name (must begin with alpha character): "' + e + '"');
                    if (t > 0 && !r(n) && !i(n)) throw new Error('Invalid unit name (only alphanumeric characters are allowed): "' + e + '"')
                }
            }
            var b = r(n(20)),
                C = r(n(21)),
                M = r(n(22)),
                T = r(n(19)),
                N = r(n(39)),
                E = r(n(26)),
                A = r(n(104)),
                S = r(n(72)),
                P = r(n(73)),
                O = r(n(127)),
                _ = r(n(130)),
                I = r(n(78)),
                B = r(n(131));
            c.prototype.type = "Unit", c.prototype.isUnit = !0;
            var k, V, z;
            c.parse = function (n, r) {
                if (r = r || {}, k = n, V = -1, z = "", "string" != typeof k) throw new TypeError("Invalid argument in Unit.parse, string expected");
                var i = new c;
                i.units = [], p(), l();
                var o = d(),
                    a = null;
                o && (a = "BigNumber" === t.number ? new e.BigNumber(o) : "Fraction" === t.number ? new e.Fraction(o) : parseFloat(o)), l();
                for (var s = 1, u = !1, f = [], h = 1;;) {
                    for (l();
                        "(" === z;) f.push(s), h *= s, s = 1, p(), l();
                    if (!z) break;
                    var m = z,
                        w = v();
                    if (null == w) throw new SyntaxError('Unexpected "' + m + '" in "' + k + '" at index ' + V.toString());
                    var x = y(w);
                    if (null == x) throw new SyntaxError('Unit "' + w + '" not found.');
                    var b = s * h;
                    if (l(), g("^")) {
                        l();
                        var C = d();
                        if (null == C) throw new SyntaxError('In "' + n + '", "^" must be followed by a floating-point number');
                        b *= C
                    }
                    i.units.push({
                        unit: x.unit,
                        prefix: x.prefix,
                        power: b
                    });
                    for (var M = 0; M < U.length; M++) i.dimensions[M] += (x.unit.dimensions[M] || 0) * b;
                    for (l();
                        ")" === z;) {
                        if (0 === f.length) throw new SyntaxError('Unmatched ")" in "' + k + '" at index ' + V.toString());
                        h /= f.pop(), p(), l()
                    }
                    if (u = !1, g("*") ? (s = 1, u = !0) : g("/") ? (s = -1, u = !0) : s = 1, x.unit.base) {
                        var T = x.unit.base.key;
                        H.auto[T] = {
                            unit: x.unit,
                            prefix: x.prefix
                        }
                    }
                }
                if (l(), z) throw new SyntaxError('Could not parse: "' + n + '"');
                if (u) throw new SyntaxError('Trailing characters: "' + n + '"');
                if (0 !== f.length) throw new SyntaxError('Unmatched "(" in "' + k + '"');
                if (0 == i.units.length && !r.allowNoUnits) throw new SyntaxError('"' + n + '" contains no units');
                return i.value = void 0 != a ? i._normalize(a) : null, i
            }, c.prototype.clone = function () {
                var e = new c;
                e.fixPrefix = this.fixPrefix, e.isUnitListSimplified = this.isUnitListSimplified, e.value = o(this.value), e.dimensions = this.dimensions.slice(0), e.units = [];
                for (var t = 0; t < this.units.length; t++) {
                    e.units[t] = {};
                    for (var n in this.units[t]) this.units[t].hasOwnProperty(n) && (e.units[t][n] = this.units[t][n])
                }
                return e
            }, c.prototype._isDerived = function () {
                return 0 !== this.units.length && (this.units.length > 1 || Math.abs(this.units[0].power - 1) > 1e-15)
            }, c.prototype._normalize = function (e) {
                var t, n, r, i, o;
                if (null == e || 0 === this.units.length) return e;
                if (this._isDerived()) {
                    var a = e;
                    o = c._getNumberConverter(_(e));
                    for (var s = 0; s < this.units.length; s++) t = o(this.units[s].unit.value), i = o(this.units[s].prefix.value), r = o(this.units[s].power), a = M(a, N(M(t, i), r));
                    return a
                }
                return o = c._getNumberConverter(_(e)), t = o(this.units[0].unit.value), n = o(this.units[0].unit.offset), i = o(this.units[0].prefix.value), M(b(e, n), M(t, i))
            }, c.prototype._denormalize = function (e, t) {
                var n, r, i, o, a;
                if (null == e || 0 === this.units.length) return e;
                if (this._isDerived()) {
                    var s = e;
                    a = c._getNumberConverter(_(e));
                    for (var u = 0; u < this.units.length; u++) n = a(this.units[u].unit.value), o = a(this.units[u].prefix.value), i = a(this.units[u].power), s = T(s, N(M(n, o), i));
                    return s
                }
                return a = c._getNumberConverter(_(e)), n = a(this.units[0].unit.value), o = a(this.units[0].prefix.value), r = a(this.units[0].unit.offset), void 0 == t ? C(T(T(e, n), o), r) : C(T(T(e, n), t), r)
            }, c.isValuelessUnit = function (e) {
                return null != y(e)
            }, c.prototype.hasBase = function (e) {
                if ("string" == typeof e && (e = L[e]), !e) return !1;
                for (var t = 0; t < U.length; t++)
                    if (Math.abs((this.dimensions[t] || 0) - (e.dimensions[t] || 0)) > 1e-12) return !1;
                return !0
            }, c.prototype.equalBase = function (e) {
                for (var t = 0; t < U.length; t++)
                    if (Math.abs((this.dimensions[t] || 0) - (e.dimensions[t] || 0)) > 1e-12) return !1;
                return !0
            }, c.prototype.equals = function (e) {
                return this.equalBase(e) && S(this.value, e.value)
            }, c.prototype.multiply = function (e) {
                for (var t = this.clone(), n = 0; n < U.length; n++) t.dimensions[n] = (this.dimensions[n] || 0) + (e.dimensions[n] || 0);
                for (var n = 0; n < e.units.length; n++) {
                    var r = {};
                    for (var i in e.units[n]) r[i] = e.units[n][i];
                    t.units.push(r)
                }
                if (null != this.value || null != e.value) {
                    var o = null == this.value ? this._normalize(1) : this.value,
                        a = null == e.value ? e._normalize(1) : e.value;
                    t.value = M(o, a)
                } else t.value = null;
                return t.isUnitListSimplified = !1, F(t)
            }, c.prototype.divide = function (e) {
                for (var t = this.clone(), n = 0; n < U.length; n++) t.dimensions[n] = (this.dimensions[n] || 0) - (e.dimensions[n] || 0);
                for (var n = 0; n < e.units.length; n++) {
                    var r = {};
                    for (var i in e.units[n]) r[i] = e.units[n][i];
                    r.power = -r.power, t.units.push(r)
                }
                if (null != this.value || null != e.value) {
                    var o = null == this.value ? this._normalize(1) : this.value,
                        a = null == e.value ? e._normalize(1) : e.value;
                    t.value = T(o, a)
                } else t.value = null;
                return t.isUnitListSimplified = !1, F(t)
            }, c.prototype.pow = function (e) {
                for (var t = this.clone(), n = 0; n < U.length; n++) t.dimensions[n] = (this.dimensions[n] || 0) * e;
                for (var n = 0; n < t.units.length; n++) t.units[n].power *= e;
                return null != t.value ? t.value = N(t.value, e) : t.value = null, t.isUnitListSimplified = !1, F(t)
            };
            var F = function (e) {
                return e.equalBase(L.NONE) && null !== e.value && !t.predictable ? e.value : e
            };
            c.prototype.abs = function () {
                var e = this.clone();
                e.value = E(e.value);
                for (var t in e.units) "VA" !== e.units[t].unit.name && "VAR" !== e.units[t].unit.name || (e.units[t].unit = W.W);
                return e
            }, c.prototype.to = function (e) {
                var t, n = null == this.value ? this._normalize(1) : this.value;
                if ("string" == typeof e) {
                    if (t = c.parse(e), !this.equalBase(t)) throw new Error("Units do not match");
                    if (null !== t.value) throw new Error("Cannot convert to a unit with a value");
                    return t.value = o(n), t.fixPrefix = !0, t.isUnitListSimplified = !0, t
                }
                if (e && e.isUnit) {
                    if (!this.equalBase(e)) throw new Error("Units do not match");
                    if (null !== e.value) throw new Error("Cannot convert to a unit with a value");
                    return t = e.clone(), t.value = o(n), t.fixPrefix = !0, t.isUnitListSimplified = !0, t
                }
                throw new Error("String or Unit expected as parameter")
            }, c.prototype.toNumber = function (e) {
                return I(this.toNumeric(e))
            }, c.prototype.toNumeric = function (e) {
                var t = this;
                return e && (t = this.to(e)), t._isDerived() ? t._denormalize(t.value) : t._denormalize(t.value, t.units[0].prefix.value)
            }, c.prototype.toString = function () {
                return this.format()
            }, c.prototype.toJSON = function () {
                return {
                    mathjs: "Unit",
                    value: this._denormalize(this.value),
                    unit: this.formatUnits(),
                    fixPrefix: this.fixPrefix
                }
            }, c.fromJSON = function (e) {
                var t = new c(e.value, e.unit);
                return t.fixPrefix = e.fixPrefix || !1, t
            }, c.prototype.valueOf = c.prototype.toString, c.prototype.simplifyUnitListLazy = function () {
                if (!this.isUnitListSimplified && null != this.value) {
                    var e, t = [];
                    for (var n in $)
                        if (this.hasBase(L[n])) {
                            e = n;
                            break
                        } if ("NONE" === e) this.units = [];
                    else {
                        var r;
                        if (e && $.hasOwnProperty(e) && (r = $[e]), r) this.units = [{
                            unit: r.unit,
                            prefix: r.prefix,
                            power: 1
                        }];
                        else {
                            for (var i = !1, o = 0; o < U.length; o++) {
                                var a = U[o];
                                Math.abs(this.dimensions[o] || 0) > 1e-12 && ($.hasOwnProperty(a) ? t.push({
                                    unit: $[a].unit,
                                    prefix: $[a].prefix,
                                    power: this.dimensions[o] || 0
                                }) : i = !0)
                            }
                            t.length < this.units.length && !i && (this.units = t)
                        }
                    }
                    this.isUnitListSimplified = !0
                }
            }, c.prototype.toSI = function () {
                for (var e = this.clone(), t = [], n = 0; n < U.length; n++) {
                    var r = U[n];
                    if (Math.abs(e.dimensions[n] || 0) > 1e-12) {
                        if (!H.si.hasOwnProperty(r)) throw new Error("Cannot express custom unit " + r + " in SI units");
                        t.push({
                            unit: H.si[r].unit,
                            prefix: H.si[r].prefix,
                            power: e.dimensions[n] || 0
                        })
                    }
                }
                return e.units = t, e.isUnitListSimplified = !0, e
            }, c.prototype.formatUnits = function () {
                this.simplifyUnitListLazy();
                for (var e = "", t = "", n = 0, r = 0, i = 0; i < this.units.length; i++) this.units[i].power > 0 ? (n++, e += " " + this.units[i].prefix.name + this.units[i].unit.name, Math.abs(this.units[i].power - 1) > 1e-15 && (e += "^" + this.units[i].power)) : this.units[i].power < 0 && r++;
                if (r > 0)
                    for (var i = 0; i < this.units.length; i++) this.units[i].power < 0 && (n > 0 ? (t += " " + this.units[i].prefix.name + this.units[i].unit.name, Math.abs(this.units[i].power + 1) > 1e-15 && (t += "^" + -this.units[i].power)) : (t += " " + this.units[i].prefix.name + this.units[i].unit.name, t += "^" + this.units[i].power));
                e = e.substr(1), t = t.substr(1), n > 1 && r > 0 && (e = "(" + e + ")"), r > 1 && n > 0 && (t = "(" + t + ")");
                var o = e;
                return n > 0 && r > 0 && (o += " / "), o += t
            }, c.prototype.format = function (e) {
                this.simplifyUnitListLazy();
                var t = !1,
                    n = !0;
                "undefined" != typeof this.value && null !== this.value && this.value.isComplex && (t = Math.abs(this.value.re) < 1e-14, n = Math.abs(this.value.im) < 1e-14);
                for (var r in this.units) this.units[r].unit && ("VA" === this.units[r].unit.name && t ? this.units[r].unit = W.VAR : "VAR" !== this.units[r].unit.name || t || (this.units[r].unit = W.VA));
                1 !== this.units.length || this.fixPrefix || Math.abs(this.units[0].power - Math.round(this.units[0].power)) < 1e-14 && (this.units[0].prefix = this._bestPrefix());
                var i = this._denormalize(this.value),
                    o = null !== this.value ? O(i, e || {}) : "",
                    a = this.formatUnits();
                return this.value && this.value.isComplex && (o = "(" + o + ")"), a.length > 0 && o.length > 0 && (o += " "), o += a
            }, c.prototype._bestPrefix = function () {
                if (1 !== this.units.length) throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
                if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) >= 1e-14) throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
                var e = E(this.value),
                    t = E(this.units[0].unit.value),
                    n = this.units[0].prefix;
                if (0 === e) return n;
                var r = this.units[0].power,
                    i = Math.log(e / Math.pow(n.value * t, r)) / Math.LN10 - 1.2;
                if (i > -2.200001 && i < 1.800001) return n;
                i = Math.abs(i);
                var o = this.units[0].unit.prefixes;
                for (var a in o)
                    if (o.hasOwnProperty(a)) {
                        var s = o[a];
                        if (s.scientific) {
                            var u = Math.abs(Math.log(e / Math.pow(s.value * t, r)) / Math.LN10 - 1.2);
                            (u < i || u === i && s.name.length < n.name.length) && (n = s, i = u)
                        }
                    } return n
            }, c.prototype.splitUnit = function (e) {
                for (var t = this.clone(), n = [], r = 0; r < e.length && (t = t.to(e[r]), r != e.length - 1); r++) {
                    var i = A(t.toNumeric()),
                        o = new c(i, e[r].toString());
                    n.push(o), t = C(t, o)
                }
                return n.push(t), n
            };
            var D = {
                NONE: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    }
                },
                SHORT: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    da: {
                        name: "da",
                        value: 10,
                        scientific: !1
                    },
                    h: {
                        name: "h",
                        value: 100,
                        scientific: !1
                    },
                    k: {
                        name: "k",
                        value: 1e3,
                        scientific: !0
                    },
                    M: {
                        name: "M",
                        value: 1e6,
                        scientific: !0
                    },
                    G: {
                        name: "G",
                        value: 1e9,
                        scientific: !0
                    },
                    T: {
                        name: "T",
                        value: 1e12,
                        scientific: !0
                    },
                    P: {
                        name: "P",
                        value: 1e15,
                        scientific: !0
                    },
                    E: {
                        name: "E",
                        value: 1e18,
                        scientific: !0
                    },
                    Z: {
                        name: "Z",
                        value: 1e21,
                        scientific: !0
                    },
                    Y: {
                        name: "Y",
                        value: 1e24,
                        scientific: !0
                    },
                    d: {
                        name: "d",
                        value: .1,
                        scientific: !1
                    },
                    c: {
                        name: "c",
                        value: .01,
                        scientific: !1
                    },
                    m: {
                        name: "m",
                        value: .001,
                        scientific: !0
                    },
                    u: {
                        name: "u",
                        value: 1e-6,
                        scientific: !0
                    },
                    n: {
                        name: "n",
                        value: 1e-9,
                        scientific: !0
                    },
                    p: {
                        name: "p",
                        value: 1e-12,
                        scientific: !0
                    },
                    f: {
                        name: "f",
                        value: 1e-15,
                        scientific: !0
                    },
                    a: {
                        name: "a",
                        value: 1e-18,
                        scientific: !0
                    },
                    z: {
                        name: "z",
                        value: 1e-21,
                        scientific: !0
                    },
                    y: {
                        name: "y",
                        value: 1e-24,
                        scientific: !0
                    }
                },
                LONG: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    deca: {
                        name: "deca",
                        value: 10,
                        scientific: !1
                    },
                    hecto: {
                        name: "hecto",
                        value: 100,
                        scientific: !1
                    },
                    kilo: {
                        name: "kilo",
                        value: 1e3,
                        scientific: !0
                    },
                    mega: {
                        name: "mega",
                        value: 1e6,
                        scientific: !0
                    },
                    giga: {
                        name: "giga",
                        value: 1e9,
                        scientific: !0
                    },
                    tera: {
                        name: "tera",
                        value: 1e12,
                        scientific: !0
                    },
                    peta: {
                        name: "peta",
                        value: 1e15,
                        scientific: !0
                    },
                    exa: {
                        name: "exa",
                        value: 1e18,
                        scientific: !0
                    },
                    zetta: {
                        name: "zetta",
                        value: 1e21,
                        scientific: !0
                    },
                    yotta: {
                        name: "yotta",
                        value: 1e24,
                        scientific: !0
                    },
                    deci: {
                        name: "deci",
                        value: .1,
                        scientific: !1
                    },
                    centi: {
                        name: "centi",
                        value: .01,
                        scientific: !1
                    },
                    milli: {
                        name: "milli",
                        value: .001,
                        scientific: !0
                    },
                    micro: {
                        name: "micro",
                        value: 1e-6,
                        scientific: !0
                    },
                    nano: {
                        name: "nano",
                        value: 1e-9,
                        scientific: !0
                    },
                    pico: {
                        name: "pico",
                        value: 1e-12,
                        scientific: !0
                    },
                    femto: {
                        name: "femto",
                        value: 1e-15,
                        scientific: !0
                    },
                    atto: {
                        name: "atto",
                        value: 1e-18,
                        scientific: !0
                    },
                    zepto: {
                        name: "zepto",
                        value: 1e-21,
                        scientific: !0
                    },
                    yocto: {
                        name: "yocto",
                        value: 1e-24,
                        scientific: !0
                    }
                },
                SQUARED: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    da: {
                        name: "da",
                        value: 100,
                        scientific: !1
                    },
                    h: {
                        name: "h",
                        value: 1e4,
                        scientific: !1
                    },
                    k: {
                        name: "k",
                        value: 1e6,
                        scientific: !0
                    },
                    M: {
                        name: "M",
                        value: 1e12,
                        scientific: !0
                    },
                    G: {
                        name: "G",
                        value: 1e18,
                        scientific: !0
                    },
                    T: {
                        name: "T",
                        value: 1e24,
                        scientific: !0
                    },
                    P: {
                        name: "P",
                        value: 1e30,
                        scientific: !0
                    },
                    E: {
                        name: "E",
                        value: 1e36,
                        scientific: !0
                    },
                    Z: {
                        name: "Z",
                        value: 1e42,
                        scientific: !0
                    },
                    Y: {
                        name: "Y",
                        value: 1e48,
                        scientific: !0
                    },
                    d: {
                        name: "d",
                        value: .01,
                        scientific: !1
                    },
                    c: {
                        name: "c",
                        value: 1e-4,
                        scientific: !1
                    },
                    m: {
                        name: "m",
                        value: 1e-6,
                        scientific: !0
                    },
                    u: {
                        name: "u",
                        value: 1e-12,
                        scientific: !0
                    },
                    n: {
                        name: "n",
                        value: 1e-18,
                        scientific: !0
                    },
                    p: {
                        name: "p",
                        value: 1e-24,
                        scientific: !0
                    },
                    f: {
                        name: "f",
                        value: 1e-30,
                        scientific: !0
                    },
                    a: {
                        name: "a",
                        value: 1e-36,
                        scientific: !0
                    },
                    z: {
                        name: "z",
                        value: 1e-42,
                        scientific: !0
                    },
                    y: {
                        name: "y",
                        value: 1e-48,
                        scientific: !0
                    }
                },
                CUBIC: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    da: {
                        name: "da",
                        value: 1e3,
                        scientific: !1
                    },
                    h: {
                        name: "h",
                        value: 1e6,
                        scientific: !1
                    },
                    k: {
                        name: "k",
                        value: 1e9,
                        scientific: !0
                    },
                    M: {
                        name: "M",
                        value: 1e18,
                        scientific: !0
                    },
                    G: {
                        name: "G",
                        value: 1e27,
                        scientific: !0
                    },
                    T: {
                        name: "T",
                        value: 1e36,
                        scientific: !0
                    },
                    P: {
                        name: "P",
                        value: 1e45,
                        scientific: !0
                    },
                    E: {
                        name: "E",
                        value: 1e54,
                        scientific: !0
                    },
                    Z: {
                        name: "Z",
                        value: 1e63,
                        scientific: !0
                    },
                    Y: {
                        name: "Y",
                        value: 1e72,
                        scientific: !0
                    },
                    d: {
                        name: "d",
                        value: .001,
                        scientific: !1
                    },
                    c: {
                        name: "c",
                        value: 1e-6,
                        scientific: !1
                    },
                    m: {
                        name: "m",
                        value: 1e-9,
                        scientific: !0
                    },
                    u: {
                        name: "u",
                        value: 1e-18,
                        scientific: !0
                    },
                    n: {
                        name: "n",
                        value: 1e-27,
                        scientific: !0
                    },
                    p: {
                        name: "p",
                        value: 1e-36,
                        scientific: !0
                    },
                    f: {
                        name: "f",
                        value: 1e-45,
                        scientific: !0
                    },
                    a: {
                        name: "a",
                        value: 1e-54,
                        scientific: !0
                    },
                    z: {
                        name: "z",
                        value: 1e-63,
                        scientific: !0
                    },
                    y: {
                        name: "y",
                        value: 1e-72,
                        scientific: !0
                    }
                },
                BINARY_SHORT: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    k: {
                        name: "k",
                        value: 1e3,
                        scientific: !0
                    },
                    M: {
                        name: "M",
                        value: 1e6,
                        scientific: !0
                    },
                    G: {
                        name: "G",
                        value: 1e9,
                        scientific: !0
                    },
                    T: {
                        name: "T",
                        value: 1e12,
                        scientific: !0
                    },
                    P: {
                        name: "P",
                        value: 1e15,
                        scientific: !0
                    },
                    E: {
                        name: "E",
                        value: 1e18,
                        scientific: !0
                    },
                    Z: {
                        name: "Z",
                        value: 1e21,
                        scientific: !0
                    },
                    Y: {
                        name: "Y",
                        value: 1e24,
                        scientific: !0
                    },
                    Ki: {
                        name: "Ki",
                        value: 1024,
                        scientific: !0
                    },
                    Mi: {
                        name: "Mi",
                        value: Math.pow(1024, 2),
                        scientific: !0
                    },
                    Gi: {
                        name: "Gi",
                        value: Math.pow(1024, 3),
                        scientific: !0
                    },
                    Ti: {
                        name: "Ti",
                        value: Math.pow(1024, 4),
                        scientific: !0
                    },
                    Pi: {
                        name: "Pi",
                        value: Math.pow(1024, 5),
                        scientific: !0
                    },
                    Ei: {
                        name: "Ei",
                        value: Math.pow(1024, 6),
                        scientific: !0
                    },
                    Zi: {
                        name: "Zi",
                        value: Math.pow(1024, 7),
                        scientific: !0
                    },
                    Yi: {
                        name: "Yi",
                        value: Math.pow(1024, 8),
                        scientific: !0
                    }
                },
                BINARY_LONG: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    kilo: {
                        name: "kilo",
                        value: 1e3,
                        scientific: !0
                    },
                    mega: {
                        name: "mega",
                        value: 1e6,
                        scientific: !0
                    },
                    giga: {
                        name: "giga",
                        value: 1e9,
                        scientific: !0
                    },
                    tera: {
                        name: "tera",
                        value: 1e12,
                        scientific: !0
                    },
                    peta: {
                        name: "peta",
                        value: 1e15,
                        scientific: !0
                    },
                    exa: {
                        name: "exa",
                        value: 1e18,
                        scientific: !0
                    },
                    zetta: {
                        name: "zetta",
                        value: 1e21,
                        scientific: !0
                    },
                    yotta: {
                        name: "yotta",
                        value: 1e24,
                        scientific: !0
                    },
                    kibi: {
                        name: "kibi",
                        value: 1024,
                        scientific: !0
                    },
                    mebi: {
                        name: "mebi",
                        value: Math.pow(1024, 2),
                        scientific: !0
                    },
                    gibi: {
                        name: "gibi",
                        value: Math.pow(1024, 3),
                        scientific: !0
                    },
                    tebi: {
                        name: "tebi",
                        value: Math.pow(1024, 4),
                        scientific: !0
                    },
                    pebi: {
                        name: "pebi",
                        value: Math.pow(1024, 5),
                        scientific: !0
                    },
                    exi: {
                        name: "exi",
                        value: Math.pow(1024, 6),
                        scientific: !0
                    },
                    zebi: {
                        name: "zebi",
                        value: Math.pow(1024, 7),
                        scientific: !0
                    },
                    yobi: {
                        name: "yobi",
                        value: Math.pow(1024, 8),
                        scientific: !0
                    }
                },
                BTU: {
                    "": {
                        name: "",
                        value: 1,
                        scientific: !0
                    },
                    MM: {
                        name: "MM",
                        value: 1e6,
                        scientific: !0
                    }
                }
            };
            D.SHORTLONG = {};
            for (var R in D.SHORT) D.SHORT.hasOwnProperty(R) && (D.SHORTLONG[R] = D.SHORT[R]);
            for (var R in D.LONG) D.LONG.hasOwnProperty(R) && (D.SHORTLONG[R] = D.LONG[R]);
            var U = ["MASS", "LENGTH", "TIME", "CURRENT", "TEMPERATURE", "LUMINOUS_INTENSITY", "AMOUNT_OF_SUBSTANCE", "ANGLE", "BIT"],
                L = {
                    NONE: {
                        dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    MASS: {
                        dimensions: [1, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    LENGTH: {
                        dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0]
                    },
                    TIME: {
                        dimensions: [0, 0, 1, 0, 0, 0, 0, 0, 0]
                    },
                    CURRENT: {
                        dimensions: [0, 0, 0, 1, 0, 0, 0, 0, 0]
                    },
                    TEMPERATURE: {
                        dimensions: [0, 0, 0, 0, 1, 0, 0, 0, 0]
                    },
                    LUMINOUS_INTENSITY: {
                        dimensions: [0, 0, 0, 0, 0, 1, 0, 0, 0]
                    },
                    AMOUNT_OF_SUBSTANCE: {
                        dimensions: [0, 0, 0, 0, 0, 0, 1, 0, 0]
                    },
                    FORCE: {
                        dimensions: [1, 1, -2, 0, 0, 0, 0, 0, 0]
                    },
                    SURFACE: {
                        dimensions: [0, 2, 0, 0, 0, 0, 0, 0, 0]
                    },
                    VOLUME: {
                        dimensions: [0, 3, 0, 0, 0, 0, 0, 0, 0]
                    },
                    ENERGY: {
                        dimensions: [1, 2, -2, 0, 0, 0, 0, 0, 0]
                    },
                    POWER: {
                        dimensions: [1, 2, -3, 0, 0, 0, 0, 0, 0]
                    },
                    PRESSURE: {
                        dimensions: [1, -1, -2, 0, 0, 0, 0, 0, 0]
                    },
                    ELECTRIC_CHARGE: {
                        dimensions: [0, 0, 1, 1, 0, 0, 0, 0, 0]
                    },
                    ELECTRIC_CAPACITANCE: {
                        dimensions: [-1, -2, 4, 2, 0, 0, 0, 0, 0]
                    },
                    ELECTRIC_POTENTIAL: {
                        dimensions: [1, 2, -3, -1, 0, 0, 0, 0, 0]
                    },
                    ELECTRIC_RESISTANCE: {
                        dimensions: [1, 2, -3, -2, 0, 0, 0, 0, 0]
                    },
                    ELECTRIC_INDUCTANCE: {
                        dimensions: [1, 2, -2, -2, 0, 0, 0, 0, 0]
                    },
                    ELECTRIC_CONDUCTANCE: {
                        dimensions: [-1, -2, 3, 2, 0, 0, 0, 0, 0]
                    },
                    MAGNETIC_FLUX: {
                        dimensions: [1, 2, -2, -1, 0, 0, 0, 0, 0]
                    },
                    MAGNETIC_FLUX_DENSITY: {
                        dimensions: [1, 0, -2, -1, 0, 0, 0, 0, 0]
                    },
                    FREQUENCY: {
                        dimensions: [0, 0, -1, 0, 0, 0, 0, 0, 0]
                    },
                    ANGLE: {
                        dimensions: [0, 0, 0, 0, 0, 0, 0, 1, 0]
                    },
                    BIT: {
                        dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 1]
                    }
                };
            for (var R in L) L[R].key = R;
            var q = {},
                j = {
                    name: "",
                    base: q,
                    value: 1,
                    offset: 0,
                    dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                W = {
                    meter: {
                        name: "meter",
                        base: L.LENGTH,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    inch: {
                        name: "inch",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .0254,
                        offset: 0
                    },
                    foot: {
                        name: "foot",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .3048,
                        offset: 0
                    },
                    yard: {
                        name: "yard",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .9144,
                        offset: 0
                    },
                    mile: {
                        name: "mile",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 1609.344,
                        offset: 0
                    },
                    link: {
                        name: "link",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .201168,
                        offset: 0
                    },
                    rod: {
                        name: "rod",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 5.02921,
                        offset: 0
                    },
                    chain: {
                        name: "chain",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 20.1168,
                        offset: 0
                    },
                    angstrom: {
                        name: "angstrom",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 1e-10,
                        offset: 0
                    },
                    m: {
                        name: "m",
                        base: L.LENGTH,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    in: {
                        name: "in",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .0254,
                        offset: 0
                    },
                    ft: {
                        name: "ft",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .3048,
                        offset: 0
                    },
                    yd: {
                        name: "yd",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .9144,
                        offset: 0
                    },
                    mi: {
                        name: "mi",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 1609.344,
                        offset: 0
                    },
                    li: {
                        name: "li",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: .201168,
                        offset: 0
                    },
                    rd: {
                        name: "rd",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 5.02921,
                        offset: 0
                    },
                    ch: {
                        name: "ch",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 20.1168,
                        offset: 0
                    },
                    mil: {
                        name: "mil",
                        base: L.LENGTH,
                        prefixes: D.NONE,
                        value: 254e-7,
                        offset: 0
                    },
                    m2: {
                        name: "m2",
                        base: L.SURFACE,
                        prefixes: D.SQUARED,
                        value: 1,
                        offset: 0
                    },
                    sqin: {
                        name: "sqin",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 64516e-8,
                        offset: 0
                    },
                    sqft: {
                        name: "sqft",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: .09290304,
                        offset: 0
                    },
                    sqyd: {
                        name: "sqyd",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: .83612736,
                        offset: 0
                    },
                    sqmi: {
                        name: "sqmi",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 2589988.110336,
                        offset: 0
                    },
                    sqrd: {
                        name: "sqrd",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 25.29295,
                        offset: 0
                    },
                    sqch: {
                        name: "sqch",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 404.6873,
                        offset: 0
                    },
                    sqmil: {
                        name: "sqmil",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 6.4516e-10,
                        offset: 0
                    },
                    acre: {
                        name: "acre",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 4046.86,
                        offset: 0
                    },
                    hectare: {
                        name: "hectare",
                        base: L.SURFACE,
                        prefixes: D.NONE,
                        value: 1e4,
                        offset: 0
                    },
                    m3: {
                        name: "m3",
                        base: L.VOLUME,
                        prefixes: D.CUBIC,
                        value: 1,
                        offset: 0
                    },
                    L: {
                        name: "L",
                        base: L.VOLUME,
                        prefixes: D.SHORT,
                        value: .001,
                        offset: 0
                    },
                    l: {
                        name: "l",
                        base: L.VOLUME,
                        prefixes: D.SHORT,
                        value: .001,
                        offset: 0
                    },
                    litre: {
                        name: "litre",
                        base: L.VOLUME,
                        prefixes: D.LONG,
                        value: .001,
                        offset: 0
                    },
                    cuin: {
                        name: "cuin",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 16387064e-12,
                        offset: 0
                    },
                    cuft: {
                        name: "cuft",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .028316846592,
                        offset: 0
                    },
                    cuyd: {
                        name: "cuyd",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .764554857984,
                        offset: 0
                    },
                    teaspoon: {
                        name: "teaspoon",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 5e-6,
                        offset: 0
                    },
                    tablespoon: {
                        name: "tablespoon",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 15e-6,
                        offset: 0
                    },
                    drop: {
                        name: "drop",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 5e-8,
                        offset: 0
                    },
                    gtt: {
                        name: "gtt",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 5e-8,
                        offset: 0
                    },
                    minim: {
                        name: "minim",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 6.161152e-8,
                        offset: 0
                    },
                    fluiddram: {
                        name: "fluiddram",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 36966911e-13,
                        offset: 0
                    },
                    fluidounce: {
                        name: "fluidounce",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 2957353e-11,
                        offset: 0
                    },
                    gill: {
                        name: "gill",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0001182941,
                        offset: 0
                    },
                    cc: {
                        name: "cc",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 1e-6,
                        offset: 0
                    },
                    cup: {
                        name: "cup",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0002365882,
                        offset: 0
                    },
                    pint: {
                        name: "pint",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0004731765,
                        offset: 0
                    },
                    quart: {
                        name: "quart",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0009463529,
                        offset: 0
                    },
                    gallon: {
                        name: "gallon",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .003785412,
                        offset: 0
                    },
                    beerbarrel: {
                        name: "beerbarrel",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .1173478,
                        offset: 0
                    },
                    oilbarrel: {
                        name: "oilbarrel",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .1589873,
                        offset: 0
                    },
                    hogshead: {
                        name: "hogshead",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .238481,
                        offset: 0
                    },
                    fldr: {
                        name: "fldr",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 36966911e-13,
                        offset: 0
                    },
                    floz: {
                        name: "floz",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: 2957353e-11,
                        offset: 0
                    },
                    gi: {
                        name: "gi",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0001182941,
                        offset: 0
                    },
                    cp: {
                        name: "cp",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0002365882,
                        offset: 0
                    },
                    pt: {
                        name: "pt",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0004731765,
                        offset: 0
                    },
                    qt: {
                        name: "qt",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .0009463529,
                        offset: 0
                    },
                    gal: {
                        name: "gal",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .003785412,
                        offset: 0
                    },
                    bbl: {
                        name: "bbl",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .1173478,
                        offset: 0
                    },
                    obl: {
                        name: "obl",
                        base: L.VOLUME,
                        prefixes: D.NONE,
                        value: .1589873,
                        offset: 0
                    },
                    g: {
                        name: "g",
                        base: L.MASS,
                        prefixes: D.SHORT,
                        value: .001,
                        offset: 0
                    },
                    gram: {
                        name: "gram",
                        base: L.MASS,
                        prefixes: D.LONG,
                        value: .001,
                        offset: 0
                    },
                    ton: {
                        name: "ton",
                        base: L.MASS,
                        prefixes: D.SHORT,
                        value: 907.18474,
                        offset: 0
                    },
                    tonne: {
                        name: "tonne",
                        base: L.MASS,
                        prefixes: D.SHORT,
                        value: 1e3,
                        offset: 0
                    },
                    grain: {
                        name: "grain",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: 6479891e-11,
                        offset: 0
                    },
                    dram: {
                        name: "dram",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .0017718451953125,
                        offset: 0
                    },
                    ounce: {
                        name: "ounce",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .028349523125,
                        offset: 0
                    },
                    poundmass: {
                        name: "poundmass",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .45359237,
                        offset: 0
                    },
                    hundredweight: {
                        name: "hundredweight",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: 45.359237,
                        offset: 0
                    },
                    stick: {
                        name: "stick",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .115,
                        offset: 0
                    },
                    stone: {
                        name: "stone",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: 6.35029318,
                        offset: 0
                    },
                    gr: {
                        name: "gr",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: 6479891e-11,
                        offset: 0
                    },
                    dr: {
                        name: "dr",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .0017718451953125,
                        offset: 0
                    },
                    oz: {
                        name: "oz",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .028349523125,
                        offset: 0
                    },
                    lbm: {
                        name: "lbm",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: .45359237,
                        offset: 0
                    },
                    cwt: {
                        name: "cwt",
                        base: L.MASS,
                        prefixes: D.NONE,
                        value: 45.359237,
                        offset: 0
                    },
                    s: {
                        name: "s",
                        base: L.TIME,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    min: {
                        name: "min",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 60,
                        offset: 0
                    },
                    h: {
                        name: "h",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 3600,
                        offset: 0
                    },
                    second: {
                        name: "second",
                        base: L.TIME,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    sec: {
                        name: "sec",
                        base: L.TIME,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    minute: {
                        name: "minute",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 60,
                        offset: 0
                    },
                    hour: {
                        name: "hour",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 3600,
                        offset: 0
                    },
                    day: {
                        name: "day",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 86400,
                        offset: 0
                    },
                    week: {
                        name: "week",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 604800,
                        offset: 0
                    },
                    month: {
                        name: "month",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 2629800,
                        offset: 0
                    },
                    year: {
                        name: "year",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 31557600,
                        offset: 0
                    },
                    decade: {
                        name: "year",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 315576e3,
                        offset: 0
                    },
                    century: {
                        name: "century",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 315576e4,
                        offset: 0
                    },
                    millennium: {
                        name: "millennium",
                        base: L.TIME,
                        prefixes: D.NONE,
                        value: 315576e5,
                        offset: 0
                    },
                    hertz: {
                        name: "Hertz",
                        base: L.FREQUENCY,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0,
                        reciprocal: !0
                    },
                    Hz: {
                        name: "Hz",
                        base: L.FREQUENCY,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0,
                        reciprocal: !0
                    },
                    rad: {
                        name: "rad",
                        base: L.ANGLE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    deg: {
                        name: "deg",
                        base: L.ANGLE,
                        prefixes: D.LONG,
                        value: null,
                        offset: 0
                    },
                    grad: {
                        name: "grad",
                        base: L.ANGLE,
                        prefixes: D.LONG,
                        value: null,
                        offset: 0
                    },
                    cycle: {
                        name: "cycle",
                        base: L.ANGLE,
                        prefixes: D.NONE,
                        value: null,
                        offset: 0
                    },
                    arcsec: {
                        name: "arcsec",
                        base: L.ANGLE,
                        prefixes: D.NONE,
                        value: null,
                        offset: 0
                    },
                    arcmin: {
                        name: "arcmin",
                        base: L.ANGLE,
                        prefixes: D.NONE,
                        value: null,
                        offset: 0
                    },
                    A: {
                        name: "A",
                        base: L.CURRENT,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    ampere: {
                        name: "ampere",
                        base: L.CURRENT,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    K: {
                        name: "K",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1,
                        offset: 0
                    },
                    degC: {
                        name: "degC",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1,
                        offset: 273.15
                    },
                    degF: {
                        name: "degF",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1 / 1.8,
                        offset: 459.67
                    },
                    degR: {
                        name: "degR",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1 / 1.8,
                        offset: 0
                    },
                    kelvin: {
                        name: "kelvin",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1,
                        offset: 0
                    },
                    celsius: {
                        name: "celsius",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1,
                        offset: 273.15
                    },
                    fahrenheit: {
                        name: "fahrenheit",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1 / 1.8,
                        offset: 459.67
                    },
                    rankine: {
                        name: "rankine",
                        base: L.TEMPERATURE,
                        prefixes: D.NONE,
                        value: 1 / 1.8,
                        offset: 0
                    },
                    mol: {
                        name: "mol",
                        base: L.AMOUNT_OF_SUBSTANCE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    mole: {
                        name: "mole",
                        base: L.AMOUNT_OF_SUBSTANCE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    cd: {
                        name: "cd",
                        base: L.LUMINOUS_INTENSITY,
                        prefixes: D.NONE,
                        value: 1,
                        offset: 0
                    },
                    candela: {
                        name: "candela",
                        base: L.LUMINOUS_INTENSITY,
                        prefixes: D.NONE,
                        value: 1,
                        offset: 0
                    },
                    N: {
                        name: "N",
                        base: L.FORCE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    newton: {
                        name: "newton",
                        base: L.FORCE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    dyn: {
                        name: "dyn",
                        base: L.FORCE,
                        prefixes: D.SHORT,
                        value: 1e-5,
                        offset: 0
                    },
                    dyne: {
                        name: "dyne",
                        base: L.FORCE,
                        prefixes: D.LONG,
                        value: 1e-5,
                        offset: 0
                    },
                    lbf: {
                        name: "lbf",
                        base: L.FORCE,
                        prefixes: D.NONE,
                        value: 4.4482216152605,
                        offset: 0
                    },
                    poundforce: {
                        name: "poundforce",
                        base: L.FORCE,
                        prefixes: D.NONE,
                        value: 4.4482216152605,
                        offset: 0
                    },
                    kip: {
                        name: "kip",
                        base: L.FORCE,
                        prefixes: D.LONG,
                        value: 4448.2216,
                        offset: 0
                    },
                    J: {
                        name: "J",
                        base: L.ENERGY,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    joule: {
                        name: "joule",
                        base: L.ENERGY,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    erg: {
                        name: "erg",
                        base: L.ENERGY,
                        prefixes: D.NONE,
                        value: 1e-5,
                        offset: 0
                    },
                    Wh: {
                        name: "Wh",
                        base: L.ENERGY,
                        prefixes: D.SHORT,
                        value: 3600,
                        offset: 0
                    },
                    BTU: {
                        name: "BTU",
                        base: L.ENERGY,
                        prefixes: D.BTU,
                        value: 1055.05585262,
                        offset: 0
                    },
                    eV: {
                        name: "eV",
                        base: L.ENERGY,
                        prefixes: D.SHORT,
                        value: 1.602176565e-19,
                        offset: 0
                    },
                    electronvolt: {
                        name: "electronvolt",
                        base: L.ENERGY,
                        prefixes: D.LONG,
                        value: 1.602176565e-19,
                        offset: 0
                    },
                    W: {
                        name: "W",
                        base: L.POWER,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    watt: {
                        name: "W",
                        base: L.POWER,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    hp: {
                        name: "hp",
                        base: L.POWER,
                        prefixes: D.NONE,
                        value: 745.6998715386,
                        offset: 0
                    },
                    VAR: {
                        name: "VAR",
                        base: L.POWER,
                        prefixes: D.SHORT,
                        value: B.I,
                        offset: 0
                    },
                    VA: {
                        name: "VA",
                        base: L.POWER,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    Pa: {
                        name: "Pa",
                        base: L.PRESSURE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    psi: {
                        name: "psi",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 6894.75729276459,
                        offset: 0
                    },
                    atm: {
                        name: "atm",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 101325,
                        offset: 0
                    },
                    bar: {
                        name: "bar",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 1e5,
                        offset: 0
                    },
                    torr: {
                        name: "torr",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 133.322,
                        offset: 0
                    },
                    mmHg: {
                        name: "mmHg",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 133.322,
                        offset: 0
                    },
                    mmH2O: {
                        name: "mmH2O",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 9.80665,
                        offset: 0
                    },
                    cmH2O: {
                        name: "cmH2O",
                        base: L.PRESSURE,
                        prefixes: D.NONE,
                        value: 98.0665,
                        offset: 0
                    },
                    coulomb: {
                        name: "coulomb",
                        base: L.ELECTRIC_CHARGE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    C: {
                        name: "C",
                        base: L.ELECTRIC_CHARGE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    farad: {
                        name: "farad",
                        base: L.ELECTRIC_CAPACITANCE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    F: {
                        name: "F",
                        base: L.ELECTRIC_CAPACITANCE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    volt: {
                        name: "volt",
                        base: L.ELECTRIC_POTENTIAL,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    V: {
                        name: "V",
                        base: L.ELECTRIC_POTENTIAL,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    ohm: {
                        name: "ohm",
                        base: L.ELECTRIC_RESISTANCE,
                        prefixes: D.SHORTLONG,
                        value: 1,
                        offset: 0
                    },
                    henry: {
                        name: "henry",
                        base: L.ELECTRIC_INDUCTANCE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    H: {
                        name: "H",
                        base: L.ELECTRIC_INDUCTANCE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    siemens: {
                        name: "siemens",
                        base: L.ELECTRIC_CONDUCTANCE,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    S: {
                        name: "S",
                        base: L.ELECTRIC_CONDUCTANCE,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    weber: {
                        name: "weber",
                        base: L.MAGNETIC_FLUX,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    Wb: {
                        name: "Wb",
                        base: L.MAGNETIC_FLUX,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    tesla: {
                        name: "tesla",
                        base: L.MAGNETIC_FLUX_DENSITY,
                        prefixes: D.LONG,
                        value: 1,
                        offset: 0
                    },
                    T: {
                        name: "T",
                        base: L.MAGNETIC_FLUX_DENSITY,
                        prefixes: D.SHORT,
                        value: 1,
                        offset: 0
                    },
                    b: {
                        name: "b",
                        base: L.BIT,
                        prefixes: D.BINARY_SHORT,
                        value: 1,
                        offset: 0
                    },
                    bits: {
                        name: "bits",
                        base: L.BIT,
                        prefixes: D.BINARY_LONG,
                        value: 1,
                        offset: 0
                    },
                    B: {
                        name: "B",
                        base: L.BIT,
                        prefixes: D.BINARY_SHORT,
                        value: 8,
                        offset: 0
                    },
                    bytes: {
                        name: "bytes",
                        base: L.BIT,
                        prefixes: D.BINARY_LONG,
                        value: 8,
                        offset: 0
                    }
                },
                G = {
                    meters: "meter",
                    inches: "inch",
                    feet: "foot",
                    yards: "yard",
                    miles: "mile",
                    links: "link",
                    rods: "rod",
                    chains: "chain",
                    angstroms: "angstrom",
                    lt: "l",
                    litres: "litre",
                    liter: "litre",
                    liters: "litre",
                    teaspoons: "teaspoon",
                    tablespoons: "tablespoon",
                    minims: "minim",
                    fluiddrams: "fluiddram",
                    fluidounces: "fluidounce",
                    gills: "gill",
                    cups: "cup",
                    pints: "pint",
                    quarts: "quart",
                    gallons: "gallon",
                    beerbarrels: "beerbarrel",
                    oilbarrels: "oilbarrel",
                    hogsheads: "hogshead",
                    gtts: "gtt",
                    grams: "gram",
                    tons: "ton",
                    tonnes: "tonne",
                    grains: "grain",
                    drams: "dram",
                    ounces: "ounce",
                    poundmasses: "poundmass",
                    hundredweights: "hundredweight",
                    sticks: "stick",
                    lb: "lbm",
                    lbs: "lbm",
                    kips: "kip",
                    acres: "acre",
                    hectares: "hectare",
                    sqfeet: "sqft",
                    sqyard: "sqyd",
                    sqmile: "sqmi",
                    sqmiles: "sqmi",
                    mmhg: "mmHg",
                    mmh2o: "mmH2O",
                    cmh2o: "cmH2O",
                    seconds: "second",
                    secs: "second",
                    minutes: "minute",
                    mins: "minute",
                    hours: "hour",
                    hr: "hour",
                    hrs: "hour",
                    days: "day",
                    weeks: "week",
                    months: "month",
                    years: "year",
                    hertz: "hertz",
                    radians: "rad",
                    degree: "deg",
                    degrees: "deg",
                    gradian: "grad",
                    gradians: "grad",
                    cycles: "cycle",
                    arcsecond: "arcsec",
                    arcseconds: "arcsec",
                    arcminute: "arcmin",
                    arcminutes: "arcmin",
                    BTUs: "BTU",
                    watts: "watt",
                    joules: "joule",
                    amperes: "ampere",
                    coulombs: "coulomb",
                    volts: "volt",
                    ohms: "ohm",
                    farads: "farad",
                    webers: "weber",
                    teslas: "tesla",
                    electronvolts: "electronvolt",
                    moles: "mole"
                };
            w(t), u.on("config", function (e, t) {
                e.number !== t.number && w(e)
            });
            var H = {
                si: {
                    NONE: {
                        unit: j,
                        prefix: D.NONE[""]
                    },
                    LENGTH: {
                        unit: W.m,
                        prefix: D.SHORT[""]
                    },
                    MASS: {
                        unit: W.g,
                        prefix: D.SHORT.k
                    },
                    TIME: {
                        unit: W.s,
                        prefix: D.SHORT[""]
                    },
                    CURRENT: {
                        unit: W.A,
                        prefix: D.SHORT[""]
                    },
                    TEMPERATURE: {
                        unit: W.K,
                        prefix: D.SHORT[""]
                    },
                    LUMINOUS_INTENSITY: {
                        unit: W.cd,
                        prefix: D.SHORT[""]
                    },
                    AMOUNT_OF_SUBSTANCE: {
                        unit: W.mol,
                        prefix: D.SHORT[""]
                    },
                    ANGLE: {
                        unit: W.rad,
                        prefix: D.SHORT[""]
                    },
                    BIT: {
                        unit: W.bit,
                        prefix: D.SHORT[""]
                    },
                    FORCE: {
                        unit: W.N,
                        prefix: D.SHORT[""]
                    },
                    ENERGY: {
                        unit: W.J,
                        prefix: D.SHORT[""]
                    },
                    POWER: {
                        unit: W.W,
                        prefix: D.SHORT[""]
                    },
                    PRESSURE: {
                        unit: W.Pa,
                        prefix: D.SHORT[""]
                    },
                    ELECTRIC_CHARGE: {
                        unit: W.C,
                        prefix: D.SHORT[""]
                    },
                    ELECTRIC_CAPACITANCE: {
                        unit: W.F,
                        prefix: D.SHORT[""]
                    },
                    ELECTRIC_POTENTIAL: {
                        unit: W.V,
                        prefix: D.SHORT[""]
                    },
                    ELECTRIC_RESISTANCE: {
                        unit: W.ohm,
                        prefix: D.SHORT[""]
                    },
                    ELECTRIC_INDUCTANCE: {
                        unit: W.H,
                        prefix: D.SHORT[""]
                    },
                    ELECTRIC_CONDUCTANCE: {
                        unit: W.S,
                        prefix: D.SHORT[""]
                    },
                    MAGNETIC_FLUX: {
                        unit: W.Wb,
                        prefix: D.SHORT[""]
                    },
                    MAGNETIC_FLUX_DENSITY: {
                        unit: W.T,
                        prefix: D.SHORT[""]
                    },
                    FREQUENCY: {
                        unit: W.Hz,
                        prefix: D.SHORT[""]
                    }
                }
            };
            H.cgs = JSON.parse(JSON.stringify(H.si)), H.cgs.LENGTH = {
                unit: W.m,
                prefix: D.SHORT.c
            }, H.cgs.MASS = {
                unit: W.g,
                prefix: D.SHORT[""]
            }, H.cgs.FORCE = {
                unit: W.dyn,
                prefix: D.SHORT[""]
            }, H.cgs.ENERGY = {
                unit: W.erg,
                prefix: D.NONE[""]
            }, H.us = JSON.parse(JSON.stringify(H.si)), H.us.LENGTH = {
                unit: W.ft,
                prefix: D.NONE[""]
            }, H.us.MASS = {
                unit: W.lbm,
                prefix: D.NONE[""]
            }, H.us.TEMPERATURE = {
                unit: W.degF,
                prefix: D.NONE[""]
            }, H.us.FORCE = {
                unit: W.lbf,
                prefix: D.NONE[""]
            }, H.us.ENERGY = {
                unit: W.BTU,
                prefix: D.BTU[""]
            }, H.us.POWER = {
                unit: W.hp,
                prefix: D.NONE[""]
            }, H.us.PRESSURE = {
                unit: W.psi,
                prefix: D.NONE[""]
            }, H.auto = JSON.parse(JSON.stringify(H.si));
            var $ = H.auto;
            c.setUnitSystem = function (e) {
                if (!H.hasOwnProperty(e)) throw new Error("Unit system " + e + " does not exist. Choices are: " + Object.keys(H).join(", "));
                $ = H[e]
            }, c.getUnitSystem = function () {
                for (var e in H)
                    if (H[e] === $) return e
            }, c.typeConverters = {
                BigNumber: function (t) {
                    return new e.BigNumber(t + "")
                },
                Fraction: function (t) {
                    return new e.Fraction(t)
                },
                Complex: function (e) {
                    return e
                },
                number: function (e) {
                    return e
                }
            }, c._getNumberConverter = function (e) {
                if (!c.typeConverters[e]) throw new TypeError('Unsupported type "' + e + '"');
                return c.typeConverters[e]
            };
            for (var R in W) {
                var Z = W[R];
                Z.dimensions = Z.base.dimensions
            }
            for (var Y in G)
                if (G.hasOwnProperty(Y)) {
                    var Z = W[G[Y]],
                        X = {};
                    for (var R in Z) Z.hasOwnProperty(R) && (X[R] = Z[R]);
                    X.name = Y, W[Y] = X
                } return c.createUnit = function (e, t) {
                if ("object" != typeof e) throw new TypeError("createUnit expects first parameter to be of type 'Object'");
                if (t && t.override)
                    for (var n in e)
                        if (e.hasOwnProperty(n) && c.deleteUnit(n), e[n].aliases)
                            for (var r = 0; r < e[n].aliases.length; r++) c.deleteUnit(e[n].aliases[r]);
                var i;
                for (var n in e) e.hasOwnProperty(n) && (i = c.createUnitSingle(n, e[n]));
                return i
            }, c.createUnitSingle = function (e, t, n) {
                if ("undefined" != typeof t && null !== t || (t = {}), "string" != typeof e) throw new TypeError("createUnitSingle expects first parameter to be of type 'string'");
                if (W.hasOwnProperty(e)) throw new Error('Cannot create unit "' + e + '": a unit with that name already exists');
                x(e);
                var r, i, o = null,
                    a = [],
                    s = 0;
                if (t && "Unit" === t.type) o = t.clone();
                else if ("string" == typeof t) "" !== t && (r = t);
                else {
                    if ("object" != typeof t) throw new TypeError('Cannot create unit "' + e + '" from "' + t.toString() + '": expecting "string" or "Unit" or "Object"');
                    r = t.definition, i = t.prefixes, s = t.offset, t.aliases && (a = t.aliases.valueOf())
                }
                if (a)
                    for (var u = 0; u < a.length; u++)
                        if (W.hasOwnProperty(a[u])) throw new Error('Cannot create alias "' + a[u] + '": a unit with that name already exists');
                if (r && "string" == typeof r && !o) try {
                    o = c.parse(r, {
                        allowNoUnits: !0
                    })
                } catch (t) {
                    throw t.message = 'Could not create unit "' + e + '" from "' + r + '": ' + t.message, t
                } else r && "Unit" === r.type && (o = r.clone());
                a = a || [], s = s || 0, i = i && i.toUpperCase ? D[i.toUpperCase()] || D.NONE : D.NONE;
                var l = {};
                if (o) {
                    l = {
                        name: e,
                        value: o.value,
                        dimensions: o.dimensions.slice(0),
                        prefixes: i,
                        offset: s
                    };
                    var f = !1;
                    for (var u in L)
                        if (L.hasOwnProperty(u)) {
                            for (var h = !0, p = 0; p < U.length; p++)
                                if (Math.abs((l.dimensions[p] || 0) - (L[u].dimensions[p] || 0)) > 1e-12) {
                                    h = !1;
                                    break
                                } if (h) {
                                f = !0;
                                break
                            }
                        } if (!f) {
                        var m = e + "_STUFF",
                            d = {
                                dimensions: o.dimensions.slice(0)
                            };
                        d.key = m, L[m] = d, $[m] = {
                            unit: l,
                            prefix: D.NONE[""]
                        }, l.base = m
                    }
                } else {
                    var m = e + "_STUFF";
                    if (U.indexOf(m) >= 0) throw new Error('Cannot create new base unit "' + e + '": a base unit with that name already exists (and cannot be overridden)');
                    U.push(m);
                    for (var v in L) L.hasOwnProperty(v) && (L[v].dimensions[U.length - 1] = 0);
                    for (var d = {
                            dimensions: []
                        }, u = 0; u < U.length; u++) d.dimensions[u] = 0;
                    d.dimensions[U.length - 1] = 1, d.key = m, L[m] = d, l = {
                        name: e,
                        value: 1,
                        dimensions: L[m].dimensions.slice(0),
                        prefixes: i,
                        offset: s,
                        base: m
                    }, $[m] = {
                        unit: l,
                        prefix: D.NONE[""]
                    }
                }
                c.UNITS[e] = l;
                for (var u = 0; u < a.length; u++) {
                    var g = a[u],
                        y = {};
                    for (var w in l) l.hasOwnProperty(w) && (y[w] = l[w]);
                    y.name = g, c.UNITS[g] = y
                }
                return new c(null, e)
            }, c.deleteUnit = function (e) {
                delete c.UNITS[e]
            }, c.PREFIXES = D, c.BASE_DIMENSIONS = U, c.BASE_UNITS = L, c.UNIT_SYSTEMS = H, c.UNITS = W, c
        }
        var i = n(11).endsWith,
            o = n(5).clone,
            a = n(138);
        t.name = "Unit", t.path = "type", t.factory = r, t.math = !0
    }, function (e, t, n) {
        function r(e) {
            return e[0].precision
        }
        var i = n(37).memoize;
        t.e = i(function (e) {
            return new e(1).exp()
        }, r), t.phi = i(function (e) {
            return new e(1).plus(new e(5).sqrt()).div(2)
        }, r), t.pi = i(function (e) {
            return e.acos(-1)
        }, r), t.tau = i(function (e) {
            return t.pi(e).times(2)
        }, r)
    }, function (e, t, n) {
        var r = n(516);
        t.mixin = function (e) {
            var t = new r;
            return e.on = t.on.bind(t), e.off = t.off.bind(t), e.once = t.once.bind(t), e.emit = t.emit.bind(t), e
        }
    }, function (e, t, n) {
        e.exports = n(143)
    }, function (e, t, n) {
        e.exports = [n(487), n(142), n(334), n(406), n(474), n(147)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, a, u, c) {
            c.on("config", function (n, i) {
                n.number !== i.number && r(e, t, a, u, c)
            }), i(c, "true", !0), i(c, "false", !1), i(c, "null", null), i(c, "uninitialized", n(3).UNINITIALIZED), "BigNumber" === t.number ? (i(c, "Infinity", new e.BigNumber(1 / 0)), i(c, "NaN", new e.BigNumber(NaN)), o(c, "pi", function () {
                return s.pi(e.BigNumber)
            }), o(c, "tau", function () {
                return s.tau(e.BigNumber)
            }), o(c, "e", function () {
                return s.e(e.BigNumber)
            }), o(c, "phi", function () {
                return s.phi(e.BigNumber)
            }), o(c, "E", function () {
                return c.e
            }), o(c, "LN2", function () {
                return new e.BigNumber(2).ln()
            }), o(c, "LN10", function () {
                return new e.BigNumber(10).ln()
            }), o(c, "LOG2E", function () {
                return new e.BigNumber(1).div(new e.BigNumber(2).ln())
            }), o(c, "LOG10E", function () {
                return new e.BigNumber(1).div(new e.BigNumber(10).ln())
            }), o(c, "PI", function () {
                return c.pi
            }), o(c, "SQRT1_2", function () {
                return new e.BigNumber("0.5").sqrt()
            }), o(c, "SQRT2", function () {
                return new e.BigNumber(2).sqrt()
            })) : (i(c, "Infinity", 1 / 0), i(c, "NaN", NaN), i(c, "pi", Math.PI), i(c, "tau", 2 * Math.PI), i(c, "e", Math.E), i(c, "phi", 1.618033988749895), i(c, "E", c.e), i(c, "LN2", Math.LN2), i(c, "LN10", Math.LN10), i(c, "LOG2E", Math.LOG2E), i(c, "LOG10E", Math.LOG10E), i(c, "PI", c.pi), i(c, "SQRT1_2", Math.SQRT1_2), i(c, "SQRT2", Math.SQRT2)), i(c, "i", e.Complex.I), i(c, "version", n(511))
        }

        function i(e, t, n) {
            e[t] = n, e.expression.mathWithTransform[t] = n
        }

        function o(e, t, n) {
            a.lazy(e, t, n), a.lazy(e.expression.mathWithTransform, t, n)
        }
        var a = n(5),
            s = n(138);
        t.factory = r, t.lazy = !1, t.math = !0
    }, function (e, t, n) {
        var r = n(5).isFactory,
            i = n(146),
            o = n(139),
            a = n(145),
            s = n(144);
        t.create = function (e) {
            function t(e) {
                if (!r(e)) throw new Error("Factory object with properties `type`, `name`, and `factory` expected");
                var i, o = n.indexOf(e);
                return o === -1 ? (i = e.math === !0 ? e.factory(c.type, l, t, c.typed, c) : e.factory(c.type, l, t, c.typed), n.push(e), u.push(i)) : i = u[o], i
            }
            if ("function" != typeof Object.create) throw new Error("ES5 not supported by this JavaScript engine. Please load the es5-shim and es5-sham library for compatibility.");
            var n = [],
                u = [],
                c = o.mixin({});
            c.type = {}, c.expression = {
                transform: {},
                mathWithTransform: {}
            }, c.typed = i.create(c.type);
            var l = {
                epsilon: 1e-12,
                matrix: "Matrix",
                number: "number",
                precision: 64,
                predictable: !1,
                randomSeed: null
            };
            return c.import = t(a), c.config = t(s), c.expression.mathWithTransform.config = c.config, e && c.config(e), c
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r, i) {
            function o(e) {
                if (e) {
                    var n = s.map(t, s.clone);
                    a(e, "matrix", u), a(e, "number", c), s.deepExtend(t, e);
                    var r = s.map(t, s.clone),
                        o = s.map(e, s.clone);
                    return i.emit("config", r, n, o), r
                }
                return s.map(t, s.clone)
            }
            var u = ["Matrix", "Array"],
                c = ["number", "BigNumber", "Fraction"];
            return o.MATRIX = u, o.NUMBER = c, o
        }

        function i(e, t) {
            return e.indexOf(t) !== -1
        }

        function o(e, t) {
            return e.map(function (e) {
                return e.toLowerCase()
            }).indexOf(t.toLowerCase())
        }

        function a(e, t, n) {
            if (void 0 !== e[t] && !i(n, e[t])) {
                var r = o(n, e[t]);
                r !== -1 ? (console.warn('Warning: Wrong casing for configuration option "' + t + '", should be "' + n[r] + '" instead of "' + e[t] + '".'), e[t] = n[r]) : console.warn('Warning: Unknown value "' + e[t] + '" for configuration option "' + t + '". Available options: ' + n.map(JSON.stringify).join(", ") + ".")
            }
        }
        var s = n(5);
        t.name = "config", t.math = !0, t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r, u) {
            function c(e, t) {
                var n = arguments.length;
                if (1 !== n && 2 !== n) throw new s("import", n, 1, 2);
                if (t || (t = {}), o(e)) p(e, t);
                else if (Array.isArray(e)) e.forEach(function (e) {
                    c(e, t)
                });
                else if ("object" == typeof e) {
                    for (var r in e)
                        if (e.hasOwnProperty(r)) {
                            var i = e[r];
                            m(i) ? l(r, i, t) : o(e) ? p(e, t) : c(i, t)
                        }
                } else if (!t.silent) throw new TypeError("Factory, Object, or Array expected")
            }

            function l(e, t, n) {
                if (n.wrap && "function" == typeof t && (t = h(t)), d(u[e]) && d(t)) return t = n.override ? r(e, t.signatures) : r(u[e], t), u[e] = t, f(e, t), void u.emit("import", e, function () {
                    return t
                });
                if (void 0 === u[e] || n.override) return u[e] = t, f(e, t), void u.emit("import", e, function () {
                    return t
                });
                if (!n.silent) throw new Error('Cannot import "' + e + '": already exists')
            }

            function f(e, t) {
                t && "function" == typeof t.transform ? (u.expression.transform[e] = t.transform, v(e) && (u.expression.mathWithTransform[e] = t.transform)) : (delete u.expression.transform[e], v(e) && (u.expression.mathWithTransform[e] = t))
            }

            function h(e) {
                var t = function () {
                    for (var t = [], n = 0, r = arguments.length; n < r; n++) {
                        var i = arguments[n];
                        t[n] = i && i.valueOf()
                    }
                    return e.apply(u, t)
                };
                return e.transform && (t.transform = e.transform), t
            }

            function p(e, t) {
                if ("string" == typeof e.name) {
                    var o = e.name,
                        s = o in u.expression.transform,
                        c = e.path ? a(u, e.path) : u,
                        l = c.hasOwnProperty(o) ? c[o] : void 0,
                        f = function () {
                            var i = n(e);
                            if (i && "function" == typeof i.transform) throw new Error('Transforms cannot be attached to factory functions. Please create a separate function for it with exports.path="expression.transform"');
                            if (d(l) && d(i)) return t.override || (i = r(l, i)), i;
                            if (void 0 === l || t.override) return i;
                            if (!t.silent) throw new Error('Cannot import "' + o + '": already exists')
                        };
                    e.lazy !== !1 ? (i(c, o, f), s || ("expression.transform" === e.path || g(e)) && i(u.expression.mathWithTransform, o, f)) : (c[o] = f(), s || ("expression.transform" === e.path || g(e)) && (u.expression.mathWithTransform[o] = f())), u.emit("import", o, f, e.path)
                } else n(e)
            }

            function m(e) {
                return "function" == typeof e || "number" == typeof e || "string" == typeof e || "boolean" == typeof e || null === e || e && e.isUnit === !0 || e && e.isComplex === !0 || e && e.isBigNumber === !0 || e && e.isFraction === !0 || e && e.isMatrix === !0 || e && Array.isArray(e) === !0
            }

            function d(e) {
                return "function" == typeof e && "object" == typeof e.signatures
            }

            function v(e) {
                return !y.hasOwnProperty(e)
            }

            function g(e) {
                return void 0 === e.path && !y.hasOwnProperty(e.name)
            }
            var y = {
                expression: !0,
                type: !0,
                docs: !0,
                error: !0,
                json: !0,
                chain: !0
            };
            return c
        }
        var i = n(5).lazy,
            o = n(5).isFactory,
            a = n(5).traverse,
            s = n(43);
        t.math = !0, t.name = "import", t.factory = r, t.lazy = !0
    }, function (e, t, n) {
        var r = n(517),
            i = n(2).digits,
            o = function () {
                return o = r.create, r
            };
        t.create = function (e) {
            var t = o();
            return t.types = [{
                name: "number",
                test: function (e) {
                    return "number" == typeof e
                }
            }, {
                name: "Complex",
                test: function (e) {
                    return e && e.isComplex
                }
            }, {
                name: "BigNumber",
                test: function (e) {
                    return e && e.isBigNumber
                }
            }, {
                name: "Fraction",
                test: function (e) {
                    return e && e.isFraction
                }
            }, {
                name: "Unit",
                test: function (e) {
                    return e && e.isUnit
                }
            }, {
                name: "string",
                test: function (e) {
                    return "string" == typeof e
                }
            }, {
                name: "Array",
                test: Array.isArray
            }, {
                name: "Matrix",
                test: function (e) {
                    return e && e.isMatrix
                }
            }, {
                name: "DenseMatrix",
                test: function (e) {
                    return e && e.isDenseMatrix
                }
            }, {
                name: "SparseMatrix",
                test: function (e) {
                    return e && e.isSparseMatrix
                }
            }, {
                name: "Range",
                test: function (e) {
                    return e && e.isRange
                }
            }, {
                name: "Index",
                test: function (e) {
                    return e && e.isIndex
                }
            }, {
                name: "boolean",
                test: function (e) {
                    return "boolean" == typeof e
                }
            }, {
                name: "ResultSet",
                test: function (e) {
                    return e && e.isResultSet
                }
            }, {
                name: "Help",
                test: function (e) {
                    return e && e.isHelp
                }
            }, {
                name: "function",
                test: function (e) {
                    return "function" == typeof e
                }
            }, {
                name: "Date",
                test: function (e) {
                    return e instanceof Date
                }
            }, {
                name: "RegExp",
                test: function (e) {
                    return e instanceof RegExp
                }
            }, {
                name: "Object",
                test: function (e) {
                    return "object" == typeof e
                }
            }, {
                name: "null",
                test: function (e) {
                    return null === e
                }
            }, {
                name: "undefined",
                test: function (e) {
                    return void 0 === e
                }
            }, {
                name: "OperatorNode",
                test: function (e) {
                    return e && e.isOperatorNode
                }
            }, {
                name: "ConstantNode",
                test: function (e) {
                    return e && e.isConstantNode
                }
            }, {
                name: "SymbolNode",
                test: function (e) {
                    return e && e.isSymbolNode
                }
            }, {
                name: "ParenthesisNode",
                test: function (e) {
                    return e && e.isParenthesisNode
                }
            }, {
                name: "FunctionNode",
                test: function (e) {
                    return e && e.isFunctionNode
                }
            }, {
                name: "FunctionAssignmentNode",
                test: function (e) {
                    return e && e.isFunctionAssignmentNode
                }
            }, {
                name: "ArrayNode",
                test: function (e) {
                    return e && e.isArrayNode
                }
            }, {
                name: "AssignmentNode",
                test: function (e) {
                    return e && e.isAssignmentNode
                }
            }, {
                name: "BlockNode",
                test: function (e) {
                    return e && e.isBlockNode
                }
            }, {
                name: "ConditionalNode",
                test: function (e) {
                    return e && e.isConditionalNode
                }
            }, {
                name: "IndexNode",
                test: function (e) {
                    return e && e.isIndexNode
                }
            }, {
                name: "RangeNode",
                test: function (e) {
                    return e && e.isRangeNode
                }
            }, {
                name: "UpdateNode",
                test: function (e) {
                    return e && e.isUpdateNode
                }
            }, {
                name: "Node",
                test: function (e) {
                    return e && e.isNode
                }
            }], t.conversions = [{
                from: "number",
                to: "BigNumber",
                convert: function (t) {
                    if (i(t) > 15) throw new TypeError("Cannot implicitly convert a number with >15 significant digits to BigNumber (value: " + t + "). Use function bignumber(x) to convert to BigNumber.");
                    return new e.BigNumber(t)
                }
            }, {
                from: "number",
                to: "Complex",
                convert: function (t) {
                    return new e.Complex(t, 0)
                }
            }, {
                from: "number",
                to: "string",
                convert: function (e) {
                    return e + ""
                }
            }, {
                from: "BigNumber",
                to: "Complex",
                convert: function (t) {
                    return new e.Complex(t.toNumber(), 0)
                }
            }, {
                from: "Fraction",
                to: "BigNumber",
                convert: function (e) {
                    throw new TypeError("Cannot implicitly convert a Fraction to BigNumber or vice versa. Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.")
                }
            }, {
                from: "Fraction",
                to: "Complex",
                convert: function (t) {
                    return new e.Complex(t.valueOf(), 0)
                }
            }, {
                from: "number",
                to: "Fraction",
                convert: function (t) {
                    var n = new e.Fraction(t);
                    if (n.valueOf() !== t) throw new TypeError("Cannot implicitly convert a number to a Fraction when there will be a loss of precision (value: " + t + "). Use function fraction(x) to convert to Fraction.");
                    return new e.Fraction(t)
                }
            }, {
                from: "string",
                to: "number",
                convert: function (e) {
                    var t = Number(e);
                    if (isNaN(t)) throw new Error('Cannot convert "' + e + '" to a number');
                    return t
                }
            }, {
                from: "string",
                to: "BigNumber",
                convert: function (t) {
                    try {
                        return new e.BigNumber(t)
                    } catch (e) {
                        throw new Error('Cannot convert "' + t + '" to BigNumber')
                    }
                }
            }, {
                from: "string",
                to: "Fraction",
                convert: function (t) {
                    try {
                        return new e.Fraction(t)
                    } catch (e) {
                        throw new Error('Cannot convert "' + t + '" to Fraction')
                    }
                }
            }, {
                from: "string",
                to: "Complex",
                convert: function (t) {
                    try {
                        return new e.Complex(t)
                    } catch (e) {
                        throw new Error('Cannot convert "' + t + '" to Complex')
                    }
                }
            }, {
                from: "boolean",
                to: "number",
                convert: function (e) {
                    return +e
                }
            }, {
                from: "boolean",
                to: "BigNumber",
                convert: function (t) {
                    return new e.BigNumber(+t)
                }
            }, {
                from: "boolean",
                to: "Fraction",
                convert: function (t) {
                    return new e.Fraction(+t)
                }
            }, {
                from: "boolean",
                to: "string",
                convert: function (e) {
                    return +e
                }
            }, {
                from: "null",
                to: "number",
                convert: function () {
                    return 0
                }
            }, {
                from: "null",
                to: "string",
                convert: function () {
                    return "null"
                }
            }, {
                from: "null",
                to: "BigNumber",
                convert: function () {
                    return new e.BigNumber(0)
                }
            }, {
                from: "null",
                to: "Fraction",
                convert: function () {
                    return new e.Fraction(0)
                }
            }, {
                from: "Array",
                to: "Matrix",
                convert: function (t) {
                    return new e.DenseMatrix(t)
                }
            }, {
                from: "Matrix",
                to: "Array",
                convert: function (e) {
                    return e.valueOf()
                }
            }], t
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(43),
            i = n(9),
            o = n(44);
        e.exports = [{
            name: "ArgumentsError",
            path: "error",
            factory: function () {
                return r
            }
        }, {
            name: "DimensionError",
            path: "error",
            factory: function () {
                return i
            }
        }, {
            name: "IndexError",
            path: "error",
            factory: function () {
                return o
            }
        }]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                if (!e) throw new Error('Argument "doc" missing');
                this.doc = e
            }
            var u = r(n(85))();
            return s.prototype.type = "Help", s.prototype.isHelp = !0, s.prototype.toString = function () {
                var e = this.doc || {},
                    t = "\n";
                if (e.name && (t += "Name: " + e.name + "\n\n"), e.category && (t += "Category: " + e.category + "\n\n"), e.description && (t += "Description:\n    " + e.description + "\n\n"), e.syntax && (t += "Syntax:\n    " + e.syntax.join("\n    ") + "\n\n"), e.examples) {
                    t += "Examples:\n";
                    for (var n = 0; n < e.examples.length; n++) {
                        var r = e.examples[n];
                        t += "    " + r + "\n";
                        var i;
                        try {
                            i = u.eval(r)
                        } catch (e) {
                            i = e
                        }
                        i && !i.isHelp && (t += "        " + o.format(i, {
                            precision: 14
                        }) + "\n")
                    }
                    t += "\n"
                }
                return e.seealso && (t += "See also: " + e.seealso.join(", ") + "\n"), t
            }, s.prototype.toJSON = function () {
                var e = i.clone(this.doc);
                return e.mathjs = "Help", e
            }, s.fromJSON = function (e) {
                var t = {};
                for (var n in e) "mathjs" !== n && (t[n] = e[n]);
                return new s(t)
            }, s.prototype.valueOf = s.prototype.toString, s
        }
        var i = n(5),
            o = n(11);
        t.name = "Help", t.path = "type", t.factory = r
    }, function (e, t) {
        e.exports = {
            name: "Infinity",
            category: "Constants",
            syntax: ["Infinity"],
            description: "Infinity, a number which is larger than the maximum number that can be handled by a floating point number.",
            examples: ["Infinity", "1 / 0"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "LN10",
            category: "Constants",
            syntax: ["LN10"],
            description: "Returns the natural logarithm of 10, approximately equal to 2.302",
            examples: ["LN10", "log(10)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "LN2",
            category: "Constants",
            syntax: ["LN2"],
            description: "Returns the natural logarithm of 2, approximately equal to 0.693",
            examples: ["LN2", "log(2)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "LOG10E",
            category: "Constants",
            syntax: ["LOG10E"],
            description: "Returns the base-10 logarithm of E, approximately equal to 0.434",
            examples: ["LOG10E", "log(e, 10)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "LOG2E",
            category: "Constants",
            syntax: ["LOG2E"],
            description: "Returns the base-2 logarithm of E, approximately equal to 1.442",
            examples: ["LOG2E", "log(e, 2)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "NaN",
            category: "Constants",
            syntax: ["NaN"],
            description: "Not a number",
            examples: ["NaN", "0 / 0"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "SQRT1_2",
            category: "Constants",
            syntax: ["SQRT1_2"],
            description: "Returns the square root of 1/2, approximately equal to 0.707",
            examples: ["SQRT1_2", "sqrt(1/2)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "SQRT2",
            category: "Constants",
            syntax: ["SQRT2"],
            description: "Returns the square root of 2, approximately equal to 1.414",
            examples: ["SQRT2", "sqrt(2)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "false",
            category: "Constants",
            syntax: ["false"],
            description: "Boolean value false",
            examples: ["false"],
            seealso: ["true"]
        }
    }, function (e, t) {
        e.exports = {
            name: "i",
            category: "Constants",
            syntax: ["i"],
            description: "Imaginary unit, defined as i*i=-1. A complex number is described as a + b*i, where a is the real part, and b is the imaginary part.",
            examples: ["i", "i * i", "sqrt(-1)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "null",
            category: "Constants",
            syntax: ["null"],
            description: "Value null",
            examples: ["null"],
            seealso: ["true", "false"]
        }
    }, function (e, t) {
        e.exports = {
            name: "phi",
            category: "Constants",
            syntax: ["phi"],
            description: "Phi is the golden ratio. Two quantities are in the golden ratio if their ratio is the same as the ratio of their sum to the larger of the two quantities. Phi is defined as `(1 + sqrt(5)) / 2` and is approximately 1.618034...",
            examples: ["tau"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "tau",
            category: "Constants",
            syntax: ["tau"],
            description: "Tau is the ratio constant of a circle's circumference to radius, equal to 2 * pi, approximately 6.2832.",
            examples: ["tau", "2 * pi"],
            seealso: ["pi"]
        }
    }, function (e, t) {
        e.exports = {
            name: "true",
            category: "Constants",
            syntax: ["true"],
            description: "Boolean value true",
            examples: ["true"],
            seealso: ["false"]
        }
    }, function (e, t) {
        e.exports = {
            name: "version",
            category: "Constants",
            syntax: ["version"],
            description: "A string with the version number of math.js",
            examples: ["version"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "bignumber",
            category: "Construction",
            syntax: ["bignumber(x)"],
            description: "Create a big number from a number or string.",
            examples: ["0.1 + 0.2", "bignumber(0.1) + bignumber(0.2)", 'bignumber("7.2")', 'bignumber("7.2e500")', "bignumber([0.1, 0.2, 0.3])"],
            seealso: ["boolean", "complex", "fraction", "index", "matrix", "string", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "boolean",
            category: "Construction",
            syntax: ["x", "boolean(x)"],
            description: "Convert a string or number into a boolean.",
            examples: ["boolean(0)", "boolean(1)", "boolean(3)", 'boolean("true")', 'boolean("false")', "boolean([1, 0, 1, 1])"],
            seealso: ["bignumber", "complex", "index", "matrix", "number", "string", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "complex",
            category: "Construction",
            syntax: ["complex()", "complex(re, im)", "complex(string)"],
            description: "Create a complex number.",
            examples: ["complex()", "complex(2, 3)", 'complex("7 - 2i")'],
            seealso: ["bignumber", "boolean", "index", "matrix", "number", "string", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "createUnit",
            category: "Construction",
            syntax: ["createUnit(definitions)", "createUnit(name, definition)"],
            description: "Create a user-defined unit and register it with the Unit type.",
            examples: ['createUnit("foo")', 'createUnit("knot", {definition: "0.514444444 m/s", aliases: ["knots", "kt", "kts"]})', 'createUnit("mph", "1 mile/hour")'],
            seealso: ["unit", "splitUnit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "fraction",
            category: "Construction",
            syntax: ["fraction(num)", "fraction(num,den)"],
            description: "Create a fraction from a number or from a numerator and denominator.",
            examples: ["fraction(0.125)", "fraction(1, 3) + fraction(2, 5)"],
            seealso: ["bignumber", "boolean", "complex", "index", "matrix", "string", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "index",
            category: "Construction",
            syntax: ["[start]", "[start:end]", "[start:step:end]", "[start1, start 2, ...]", "[start1:end1, start2:end2, ...]", "[start1:step1:end1, start2:step2:end2, ...]"],
            description: "Create an index to get or replace a subset of a matrix",
            examples: ["[]", "[1, 2, 3]", "A = [1, 2, 3; 4, 5, 6]", "A[1, :]", "A[1, 2] = 50", "A[0:2, 0:2] = ones(2, 2)"],
            seealso: ["bignumber", "boolean", "complex", "matrix,", "number", "range", "string", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "matrix",
            category: "Construction",
            syntax: ["[]", "[a1, b1, ...; a2, b2, ...]", "matrix()", 'matrix("dense")', "matrix([...])"],
            description: "Create a matrix.",
            examples: ["[]", "[1, 2, 3]", "[1, 2, 3; 4, 5, 6]", "matrix()", "matrix([3, 4])", 'matrix([3, 4; 5, 6], "sparse")', 'matrix([3, 4; 5, 6], "sparse", "number")'],
            seealso: ["bignumber", "boolean", "complex", "index", "number", "string", "unit", "sparse"]
        }
    }, function (e, t) {
        e.exports = {
            name: "number",
            category: "Construction",
            syntax: ["x", "number(x)"],
            description: "Create a number or convert a string or boolean into a number.",
            examples: ["2", "2e3", "4.05", "number(2)", 'number("7.2")', "number(true)", "number([true, false, true, true])", 'number("52cm", "m")'],
            seealso: ["bignumber", "boolean", "complex", "fraction", "index", "matrix", "string", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sparse",
            category: "Construction",
            syntax: ["sparse()", "sparse([a1, b1, ...; a1, b2, ...])", 'sparse([a1, b1, ...; a1, b2, ...], "number")'],
            description: "Create a sparse matrix.",
            examples: ["sparse()", "sparse([3, 4; 5, 6])", 'sparse([3, 0; 5, 0], "number")'],
            seealso: ["bignumber", "boolean", "complex", "index", "number", "string", "unit", "matrix"]
        }
    }, function (e, t) {
        e.exports = {
            name: "splitUnit",
            category: "Construction",
            syntax: ["splitUnit(unit: Unit, parts: Unit[])"],
            description: "Split a unit in an array of units whose sum is equal to the original unit.",
            examples: ['splitUnit(1 m, ["feet", "inch"])'],
            seealso: ["unit", "createUnit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "string",
            category: "Construction",
            syntax: ['"text"', "string(x)"],
            description: "Create a string or convert a value to a string",
            examples: ['"Hello World!"', "string(4.2)", "string(3 + 2i)"],
            seealso: ["bignumber", "boolean", "complex", "index", "matrix", "number", "unit"]
        }
    }, function (e, t) {
        e.exports = {
            name: "unit",
            category: "Construction",
            syntax: ["value unit", "unit(value, unit)", "unit(string)"],
            description: "Create a unit.",
            examples: ["5.5 mm", "3 inch", 'unit(7.1, "kilogram")', 'unit("23 deg")'],
            seealso: ["bignumber", "boolean", "complex", "index", "matrix", "number", "string"]
        }
    }, function (e, t) {
        e.exports = {
            name: "config",
            category: "Core",
            syntax: ["config()", "config(options)"],
            description: "Get configuration or change configuration.",
            examples: ["config()", "1/3 + 1/4", 'config({number: "Fraction"})', "1/3 + 1/4"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "import",
            category: "Core",
            syntax: ["import(functions)", "import(functions, options)"],
            description: "Import functions or constants from an object.",
            examples: ["import({myFn: f(x)=x^2, myConstant: 32 })", "myFn(2)", "myConstant"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "typed",
            category: "Core",
            syntax: ["typed(signatures)", "typed(name, signatures)"],
            description: "Create a typed function.",
            examples: ['double = typed({ "number, number": f(x)=x+x })', "double(2)", 'double("hello")'],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "derivative",
            category: "Algebra",
            syntax: ["derivative(expr)", "derivative(expr, {simplify: boolean})"],
            description: "Takes the derivative of an expression expressed in parser Nodes. The derivative will be taken over the supplied variable in the second parameter. If there are multiple variables in the expression, it will return a partial derivative.",
            examples: ['derivative("2x^3", "x")', 'derivative("2x^3", "x", {simplify: false})', 'derivative("2x^2 + 3x + 4", "x")', 'derivative("sin(2x)", "x")', 'f = parse("x^2 + x")', 'x = parse("x")', "df = derivative(f, x)", "df.eval({x: 3})"],
            seealso: ["simplify", "parse", "eval"]
        }
    }, function (e, t) {
        e.exports = {
            name: "lsolve",
            category: "Algebra",
            syntax: ["x=lsolve(L, b)"],
            description: "Solves the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.",
            examples: ["a = [-2, 3; 2, 1]", "b = [11, 9]", "x = lsolve(a, b)"],
            seealso: ["lup", "lusolve", "usolve", "matrix", "sparse"]
        }
    }, function (e, t) {
        e.exports = {
            name: "lup",
            category: "Algebra",
            syntax: ["lup(m)"],
            description: "Calculate the Matrix LU decomposition with partial pivoting. Matrix A is decomposed in three matrices (L, U, P) where P * A = L * U",
            examples: ["lup([[2, 1], [1, 4]])", "lup(matrix([[2, 1], [1, 4]]))", "lup(sparse([[2, 1], [1, 4]]))"],
            seealso: ["lusolve", "lsolve", "usolve", "matrix", "sparse", "slu", "qr"]
        }
    }, function (e, t) {
        e.exports = {
            name: "lusolve",
            category: "Algebra",
            syntax: ["x=lusolve(A, b)", "x=lusolve(lu, b)"],
            description: "Solves the linear system A * x = b where A is an [n x n] matrix and b is a [n] column vector.",
            examples: ["a = [-2, 3; 2, 1]", "b = [11, 9]", "x = lusolve(a, b)"],
            seealso: ["lup", "slu", "lsolve", "usolve", "matrix", "sparse"]
        }
    }, function (e, t) {
        e.exports = {
            name: "qr",
            category: "Algebra",
            syntax: ["qr(A)"],
            description: "Calculates the Matrix QR decomposition. Matrix `A` is decomposed in two matrices (`Q`, `R`) where `Q` is an orthogonal matrix and `R` is an upper triangular matrix.",
            examples: ["qr([[1, -1,  4], [1,  4, -2], [1,  4,  2], [1,  -1, 0]])"],
            seealso: ["lup", "slu", "matrix"]
        }
    }, function (e, t) {
        e.exports = {
            name: "simplify",
            category: "Algebra",
            syntax: ["simplify(expr)", "simplify(expr, rules)"],
            description: "Simplify an expression tree.",
            examples: ['simplify("3 + 2 / 4")', 'simplify("2x + x")', 'f = parse("x * (x + 2 + x)")', "simplified = simplify(f)", "simplified.eval({x: 2})"],
            seealso: ["derivative", "parse", "eval"]
        }
    }, function (e, t) {
        e.exports = {
            name: "slu",
            category: "Algebra",
            syntax: ["slu(A, order, threshold)"],
            description: "Calculate the Matrix LU decomposition with full pivoting. Matrix A is decomposed in two matrices (L, U) and two permutation vectors (pinv, q) where P * A * Q = L * U",
            examples: ["slu(sparse([4.5, 0, 3.2, 0; 3.1, 2.9, 0, 0.9; 0, 1.7, 3, 0; 3.5, 0.4, 0, 1]), 1, 0.001)"],
            seealso: ["lusolve", "lsolve", "usolve", "matrix", "sparse", "lup", "qr"]
        }
    }, function (e, t) {
        e.exports = {
            name: "usolve",
            category: "Algebra",
            syntax: ["x=usolve(U, b)"],
            description: "Solves the linear system U * x = b where U is an [n x n] upper triangular matrix and b is a [n] column vector.",
            examples: ["x=usolve(sparse([1, 1, 1, 1; 0, 1, 1, 1; 0, 0, 1, 1; 0, 0, 0, 1]), [1; 2; 3; 4])"],
            seealso: ["lup", "lusolve", "lsolve", "matrix", "sparse"]
        }
    }, function (e, t) {
        e.exports = {
            name: "abs",
            category: "Arithmetic",
            syntax: ["abs(x)"],
            description: "Compute the absolute value.",
            examples: ["abs(3.5)", "abs(-4.2)"],
            seealso: ["sign"]
        }
    }, function (e, t) {
        e.exports = {
            name: "add",
            category: "Operators",
            syntax: ["x + y", "add(x, y)"],
            description: "Add two values.",
            examples: ["a = 2.1 + 3.6", "a - 3.6", "3 + 2i", "3 cm + 2 inch", '"2.3" + "4"'],
            seealso: ["subtract"]
        }
    }, function (e, t) {
        e.exports = {
            name: "cbrt",
            category: "Arithmetic",
            syntax: ["cbrt(x)", "cbrt(x, allRoots)"],
            description: "Compute the cubic root value. If x = y * y * y, then y is the cubic root of x. When `x` is a number or complex number, an optional second argument `allRoots` can be provided to return all three cubic roots. If not provided, the principal root is returned",
            examples: ["cbrt(64)", "cube(4)", "cbrt(-8)", "cbrt(2 + 3i)", "cbrt(8i)", "cbrt(8i, true)", "cbrt(27 m^3)"],
            seealso: ["square", "sqrt", "cube", "multiply"]
        }
    }, function (e, t) {
        e.exports = {
            name: "ceil",
            category: "Arithmetic",
            syntax: ["ceil(x)"],
            description: "Round a value towards plus infinity. If x is complex, both real and imaginary part are rounded towards plus infinity.",
            examples: ["ceil(3.2)", "ceil(3.8)", "ceil(-4.2)"],
            seealso: ["floor", "fix", "round"]
        }
    }, function (e, t) {
        e.exports = {
            name: "cube",
            category: "Arithmetic",
            syntax: ["cube(x)"],
            description: "Compute the cube of a value. The cube of x is x * x * x.",
            examples: ["cube(2)", "2^3", "2 * 2 * 2"],
            seealso: ["multiply", "square", "pow"]
        }
    }, function (e, t) {
        e.exports = {
            name: "divide",
            category: "Operators",
            syntax: ["x / y", "divide(x, y)"],
            description: "Divide two values.",
            examples: ["a = 2 / 3", "a * 3", "4.5 / 2", "3 + 4 / 2", "(3 + 4) / 2", "18 km / 4.5"],
            seealso: ["multiply"]
        }
    }, function (e, t) {
        e.exports = {
            name: "dotDivide",
            category: "Operators",
            syntax: ["x ./ y", "dotDivide(x, y)"],
            description: "Divide two values element wise.",
            examples: ["a = [1, 2, 3; 4, 5, 6]", "b = [2, 1, 1; 3, 2, 5]", "a ./ b"],
            seealso: ["multiply", "dotMultiply", "divide"]
        }
    }, function (e, t) {
        e.exports = {
            name: "dotMultiply",
            category: "Operators",
            syntax: ["x .* y", "dotMultiply(x, y)"],
            description: "Multiply two values element wise.",
            examples: ["a = [1, 2, 3; 4, 5, 6]", "b = [2, 1, 1; 3, 2, 5]", "a .* b"],
            seealso: ["multiply", "divide", "dotDivide"]
        }
    }, function (e, t) {
        e.exports = {
            name: "dotpow",
            category: "Operators",
            syntax: ["x .^ y", "dotpow(x, y)"],
            description: "Calculates the power of x to y element wise.",
            examples: ["a = [1, 2, 3; 4, 5, 6]", "a .^ 2"],
            seealso: ["pow"]
        }
    }, function (e, t) {
        e.exports = {
            name: "exp",
            category: "Arithmetic",
            syntax: ["exp(x)"],
            description: "Calculate the exponent of a value.",
            examples: ["exp(1.3)", "e ^ 1.3", "log(exp(1.3))", "x = 2.4", "(exp(i*x) == cos(x) + i*sin(x))   # Euler's formula"],
            seealso: ["pow", "log"]
        }
    }, function (e, t) {
        e.exports = {
            name: "fix",
            category: "Arithmetic",
            syntax: ["fix(x)"],
            description: "Round a value towards zero. If x is complex, both real and imaginary part are rounded towards zero.",
            examples: ["fix(3.2)", "fix(3.8)", "fix(-4.2)", "fix(-4.8)"],
            seealso: ["ceil", "floor", "round"]
        }
    }, function (e, t) {
        e.exports = {
            name: "floor",
            category: "Arithmetic",
            syntax: ["floor(x)"],
            description: "Round a value towards minus infinity.If x is complex, both real and imaginary part are rounded towards minus infinity.",
            examples: ["floor(3.2)", "floor(3.8)", "floor(-4.2)"],
            seealso: ["ceil", "fix", "round"]
        }
    }, function (e, t) {
        e.exports = {
            name: "gcd",
            category: "Arithmetic",
            syntax: ["gcd(a, b)", "gcd(a, b, c, ...)"],
            description: "Compute the greatest common divisor.",
            examples: ["gcd(8, 12)", "gcd(-4, 6)", "gcd(25, 15, -10)"],
            seealso: ["lcm", "xgcd"]
        }
    }, function (e, t) {
        e.exports = {
            name: "hypot",
            category: "Arithmetic",
            syntax: ["hypot(a, b, c, ...)", "hypot([a, b, c, ...])"],
            description: "Calculate the hypotenusa of a list with values. ",
            examples: ["hypot(3, 4)", "sqrt(3^2 + 4^2)", "hypot(-2)", "hypot([3, 4, 5])"],
            seealso: ["abs", "norm"]
        }
    }, function (e, t) {
        e.exports = {
            name: "lcm",
            category: "Arithmetic",
            syntax: ["lcm(x, y)"],
            description: "Compute the least common multiple.",
            examples: ["lcm(4, 6)", "lcm(6, 21)", "lcm(6, 21, 5)"],
            seealso: ["gcd"]
        }
    }, function (e, t) {
        e.exports = {
            name: "log",
            category: "Arithmetic",
            syntax: ["log(x)", "log(x, base)"],
            description: "Compute the logarithm of a value. If no base is provided, the natural logarithm of x is calculated. If base if provided, the logarithm is calculated for the specified base. log(x, base) is defined as log(x) / log(base).",
            examples: ["log(3.5)", "a = log(2.4)", "exp(a)", "10 ^ 4", "log(10000, 10)", "log(10000) / log(10)", "b = log(1024, 2)", "2 ^ b"],
            seealso: ["exp", "log10"]
        }
    }, function (e, t) {
        e.exports = {
            name: "log10",
            category: "Arithmetic",
            syntax: ["log10(x)"],
            description: "Compute the 10-base logarithm of a value.",
            examples: ["log10(0.00001)", "log10(10000)", "10 ^ 4", "log(10000) / log(10)", "log(10000, 10)"],
            seealso: ["exp", "log"]
        }
    }, function (e, t) {
        e.exports = {
            name: "mod",
            category: "Operators",
            syntax: ["x % y", "x mod y", "mod(x, y)"],
            description: "Calculates the modulus, the remainder of an integer division.",
            examples: ["7 % 3", "11 % 2", "10 mod 4", "function isOdd(x) = x % 2", "isOdd(2)", "isOdd(3)"],
            seealso: ["divide"]
        }
    }, function (e, t) {
        e.exports = {
            name: "multiply",
            category: "Operators",
            syntax: ["x * y", "multiply(x, y)"],
            description: "multiply two values.",
            examples: ["a = 2.1 * 3.4", "a / 3.4", "2 * 3 + 4", "2 * (3 + 4)", "3 * 2.1 km"],
            seealso: ["divide"]
        }
    }, function (e, t) {
        e.exports = {
            name: "norm",
            category: "Arithmetic",
            syntax: ["norm(x)", "norm(x, p)"],
            description: "Calculate the norm of a number, vector or matrix.",
            examples: ["abs(-3.5)", "norm(-3.5)", "norm(3 - 4i))", "norm([1, 2, -3], Infinity)", "norm([1, 2, -3], -Infinity)", "norm([3, 4], 2)", "norm([[1, 2], [3, 4]], 1)", "norm([[1, 2], [3, 4]], 'inf')", "norm([[1, 2], [3, 4]], 'fro')"]
        }
    }, function (e, t) {
        e.exports = {
            name: "nthRoot",
            category: "Arithmetic",
            syntax: ["nthRoot(a)", "nthRoot(a, root)"],
            description: 'Calculate the nth root of a value. The principal nth root of a positive real number A, is the positive real solution of the equation "x^root = A".',
            examples: ["4 ^ 3", "nthRoot(64, 3)", "nthRoot(9, 2)", "sqrt(9)"],
            seealso: ["sqrt", "pow"]
        }
    }, function (e, t) {
        e.exports = {
            name: "pow",
            category: "Operators",
            syntax: ["x ^ y", "pow(x, y)"],
            description: "Calculates the power of x to y, x^y.",
            examples: ["2^3 = 8", "2*2*2", "1 + e ^ (pi * i)"],
            seealso: ["multiply"]
        }
    }, function (e, t) {
        e.exports = {
            name: "round",
            category: "Arithmetic",
            syntax: ["round(x)", "round(x, n)"],
            description: "round a value towards the nearest integer.If x is complex, both real and imaginary part are rounded towards the nearest integer. When n is specified, the value is rounded to n decimals.",
            examples: ["round(3.2)", "round(3.8)", "round(-4.2)", "round(-4.8)", "round(pi, 3)", "round(123.45678, 2)"],
            seealso: ["ceil", "floor", "fix"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sign",
            category: "Arithmetic",
            syntax: ["sign(x)"],
            description: "Compute the sign of a value. The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.",
            examples: ["sign(3.5)", "sign(-4.2)", "sign(0)"],
            seealso: ["abs"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sqrt",
            category: "Arithmetic",
            syntax: ["sqrt(x)"],
            description: "Compute the square root value. If x = y * y, then y is the square root of x.",
            examples: ["sqrt(25)", "5 * 5", "sqrt(-1)"],
            seealso: ["square", "multiply"]
        }
    }, function (e, t) {
        e.exports = {
            name: "square",
            category: "Arithmetic",
            syntax: ["square(x)"],
            description: "Compute the square of a value. The square of x is x * x.",
            examples: ["square(3)", "sqrt(9)", "3^2", "3 * 3"],
            seealso: ["multiply", "pow", "sqrt", "cube"]
        }
    }, function (e, t) {
        e.exports = {
            name: "subtract",
            category: "Operators",
            syntax: ["x - y", "subtract(x, y)"],
            description: "subtract two values.",
            examples: ["a = 5.3 - 2", "a + 2", "2/3 - 1/6", "2 * 3 - 3", "2.1 km - 500m"],
            seealso: ["add"]
        }
    }, function (e, t) {
        e.exports = {
            name: "unaryMinus",
            category: "Operators",
            syntax: ["-x", "unaryMinus(x)"],
            description: "Inverse the sign of a value. Converts booleans and strings to numbers.",
            examples: ["-4.5", "-(-5.6)", '-"22"'],
            seealso: ["add", "subtract", "unaryPlus"]
        }
    }, function (e, t) {
        e.exports = {
            name: "unaryPlus",
            category: "Operators",
            syntax: ["+x", "unaryPlus(x)"],
            description: "Converts booleans and strings to numbers.",
            examples: ["+true", '+"2"'],
            seealso: ["add", "subtract", "unaryMinus"]
        }
    }, function (e, t) {
        e.exports = {
            name: "xgcd",
            category: "Arithmetic",
            syntax: ["xgcd(a, b)"],
            description: "Calculate the extended greatest common divisor for two values",
            examples: ["xgcd(8, 12)", "gcd(8, 12)", "xgcd(36163, 21199)"],
            seealso: ["gcd", "lcm"]
        }
    }, function (e, t) {
        e.exports = {
            name: "bitAnd",
            category: "Bitwise",
            syntax: ["x & y", "bitAnd(x, y)"],
            description: "Bitwise AND operation. Performs the logical AND operation on each pair of the corresponding bits of the two given values by multiplying them. If both bits in the compared position are 1, the bit in the resulting binary representation is 1, otherwise, the result is 0",
            examples: ["5 & 3", "bitAnd(53, 131)", "[1, 12, 31] & 42"],
            seealso: ["bitNot", "bitOr", "bitXor", "leftShift", "rightArithShift", "rightLogShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "bitNot",
            category: "Bitwise",
            syntax: ["~x", "bitNot(x)"],
            description: "Bitwise NOT operation. Performs a logical negation on each bit of the given value. Bits that are 0 become 1, and those that are 1 become 0.",
            examples: ["~1", "~2", "bitNot([2, -3, 4])"],
            seealso: ["bitAnd", "bitOr", "bitXor", "leftShift", "rightArithShift", "rightLogShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "bitOr",
            category: "Bitwise",
            syntax: ["x | y", "bitOr(x, y)"],
            description: "Bitwise OR operation. Performs the logical inclusive OR operation on each pair of corresponding bits of the two given values. The result in each position is 1 if the first bit is 1 or the second bit is 1 or both bits are 1, otherwise, the result is 0.",
            examples: ["5 | 3", "bitOr([1, 2, 3], 4)"],
            seealso: ["bitAnd", "bitNot", "bitXor", "leftShift", "rightArithShift", "rightLogShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "bitXor",
            category: "Bitwise",
            syntax: ["bitXor(x, y)"],
            description: "Bitwise XOR operation, exclusive OR. Performs the logical exclusive OR operation on each pair of corresponding bits of the two given values. The result in each position is 1 if only the first bit is 1 or only the second bit is 1, but will be 0 if both are 0 or both are 1.",
            examples: ["bitOr(1, 2)", "bitXor([2, 3, 4], 4)"],
            seealso: ["bitAnd", "bitNot", "bitOr", "leftShift", "rightArithShift", "rightLogShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "leftShift",
            category: "Bitwise",
            syntax: ["x << y", "leftShift(x, y)"],
            description: "Bitwise left logical shift of a value x by y number of bits.",
            examples: ["4 << 1", "8 >> 1"],
            seealso: ["bitAnd", "bitNot", "bitOr", "bitXor", "rightArithShift", "rightLogShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "rightArithShift",
            category: "Bitwise",
            syntax: ["x >> y", "leftShift(x, y)"],
            description: "Bitwise right arithmetic shift of a value x by y number of bits.",
            examples: ["8 >> 1", "4 << 1", "-12 >> 2"],
            seealso: ["bitAnd", "bitNot", "bitOr", "bitXor", "leftShift", "rightLogShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "rightLogShift",
            category: "Bitwise",
            syntax: ["x >> y", "leftShift(x, y)"],
            description: "Bitwise right logical shift of a value x by y number of bits.",
            examples: ["8 >>> 1", "4 << 1", "-12 >>> 2"],
            seealso: ["bitAnd", "bitNot", "bitOr", "bitXor", "leftShift", "rightArithShift"]
        }
    }, function (e, t) {
        e.exports = {
            name: "bellNumbers",
            category: "Combinatorics",
            syntax: ["bellNumbers(n)"],
            description: "The Bell Numbers count the number of partitions of a set. A partition is a pairwise disjoint subset of S whose union is S. `bellNumbers` only takes integer arguments. The following condition must be enforced: n >= 0.",
            examples: ["bellNumbers(3)", "bellNumbers(8)"],
            seealso: ["stirlingS2"]
        }
    }, function (e, t) {
        e.exports = {
            name: "catalan",
            category: "Combinatorics",
            syntax: ["catalan(n)"],
            description: "The Catalan Numbers enumerate combinatorial structures of many different types. catalan only takes integer arguments. The following condition must be enforced: n >= 0.",
            examples: ["catalan(3)", "catalan(8)"],
            seealso: ["bellNumbers"]
        }
    }, function (e, t) {
        e.exports = {
            name: "composition",
            category: "Combinatorics",
            syntax: ["composition(n, k)"],
            description: "The composition counts of n into k parts. composition only takes integer arguments. The following condition must be enforced: k <= n.",
            examples: ["composition(5, 3)"],
            seealso: ["combinations"]
        }
    }, function (e, t) {
        e.exports = {
            name: "stirlingS2",
            category: "Combinatorics",
            syntax: ["stirlingS2(n, k)"],
            description: "he Stirling numbers of the second kind, counts the number of ways to partition a set of n labelled objects into k nonempty unlabelled subsets. `stirlingS2` only takes integer arguments. The following condition must be enforced: k <= n. If n = k or k = 1, then s(n,k) = 1.",
            examples: ["stirlingS2(5, 3)"],
            seealso: ["bellNumbers"]
        }
    }, function (e, t) {
        e.exports = {
            name: "arg",
            category: "Complex",
            syntax: ["arg(x)"],
            description: "Compute the argument of a complex value. If x = a+bi, the argument is computed as atan2(b, a).",
            examples: ["arg(2 + 2i)", "atan2(3, 2)", "arg(2 + 3i)"],
            seealso: ["re", "im", "conj", "abs"]
        }
    }, function (e, t) {
        e.exports = {
            name: "conj",
            category: "Complex",
            syntax: ["conj(x)"],
            description: "Compute the complex conjugate of a complex value. If x = a+bi, the complex conjugate is a-bi.",
            examples: ["conj(2 + 3i)", "conj(2 - 3i)", "conj(-5.2i)"],
            seealso: ["re", "im", "abs", "arg"]
        }
    }, function (e, t) {
        e.exports = {
            name: "im",
            category: "Complex",
            syntax: ["im(x)"],
            description: "Get the imaginary part of a complex number.",
            examples: ["im(2 + 3i)", "re(2 + 3i)", "im(-5.2i)", "im(2.4)"],
            seealso: ["re", "conj", "abs", "arg"]
        }
    }, function (e, t) {
        e.exports = {
            name: "re",
            category: "Complex",
            syntax: ["re(x)"],
            description: "Get the real part of a complex number.",
            examples: ["re(2 + 3i)", "im(2 + 3i)", "re(-5.2i)", "re(2.4)"],
            seealso: ["im", "conj", "abs", "arg"]
        }
    }, function (e, t) {
        e.exports = {
            name: "eval",
            category: "Expression",
            syntax: ["eval(expression)", "eval([expr1, expr2, expr3, ...])"],
            description: "Evaluate an expression or an array with expressions.",
            examples: ['eval("2 + 3")', 'eval("sqrt(" + 4 + ")")'],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "help",
            category: "Expression",
            syntax: ["help(object)", "help(string)"],
            description: "Display documentation on a function or data type.",
            examples: ["help(sqrt)", 'help("complex")'],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "distance",
            category: "Geometry",
            syntax: ["distance([x1, y1], [x2, y2])", "distance([[x1, y1], [x2, y2])"],
            description: "Calculates the Euclidean distance between two points.",
            examples: ["distance([0,0], [4,4])", "distance([[0,0], [4,4]])"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "intersect",
            category: "Geometry",
            syntax: ["intersect(expr1, expr2, expr3, expr4)", "intersect(expr1, expr2, expr3)"],
            description: "Computes the intersection point of lines and/or planes.",
            examples: ["intersect([0, 0], [10, 10], [10, 0], [0, 10])", "intersect([1, 0, 1],  [4, -2, 2], [1, 1, 1, 6])"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "and",
            category: "Logical",
            syntax: ["x and y", "and(x, y)"],
            description: "Logical and. Test whether two values are both defined with a nonzero/nonempty value.",
            examples: ["true and false", "true and true", "2 and 4"],
            seealso: ["not", "or", "xor"]
        }
    }, function (e, t) {
        e.exports = {
            name: "not",
            category: "Logical",
            syntax: ["not x", "not(x)"],
            description: "Logical not. Flips the boolean value of given argument.",
            examples: ["not true", "not false", "not 2", "not 0"],
            seealso: ["and", "or", "xor"]
        }
    }, function (e, t) {
        e.exports = {
            name: "or",
            category: "Logical",
            syntax: ["x or y", "or(x, y)"],
            description: "Logical or. Test if at least one value is defined with a nonzero/nonempty value.",
            examples: ["true or false", "false or false", "0 or 4"],
            seealso: ["not", "and", "xor"]
        }
    }, function (e, t) {
        e.exports = {
            name: "xor",
            category: "Logical",
            syntax: ["x or y", "or(x, y)"],
            description: "Logical exclusive or, xor. Test whether one and only one value is defined with a nonzero/nonempty value.",
            examples: ["true xor false", "false xor false", "true xor true", "0 or 4"],
            seealso: ["not", "and", "or"]
        }
    }, function (e, t) {
        e.exports = {
            name: "concat",
            category: "Matrix",
            syntax: ["concat(A, B, C, ...)", "concat(A, B, C, ..., dim)"],
            description: "Concatenate matrices. By default, the matrices are concatenated by the last dimension. The dimension on which to concatenate can be provided as last argument.",
            examples: ["A = [1, 2; 5, 6]", "B = [3, 4; 7, 8]", "concat(A, B)", "concat(A, B, 1)", "concat(A, B, 2)"],
            seealso: ["det", "diag", "eye", "inv", "ones", "range", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "cross",
            category: "Matrix",
            syntax: ["cross(A, B)"],
            description: "Calculate the cross product for two vectors in three dimensional space.",
            examples: ["cross([1, 1, 0],  [0, 1, 1])", "cross([3, -3, 1], [4, 9, 2])", "cross([2, 3, 4],  [5, 6, 7])"],
            seealso: ["multiply", "dot"]
        }
    }, function (e, t) {
        e.exports = {
            name: "det",
            category: "Matrix",
            syntax: ["det(x)"],
            description: "Calculate the determinant of a matrix",
            examples: ["det([1, 2; 3, 4])", "det([-2, 2, 3; -1, 1, 3; 2, 0, -1])"],
            seealso: ["concat", "diag", "eye", "inv", "ones", "range", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "diag",
            category: "Matrix",
            syntax: ["diag(x)", "diag(x, k)"],
            description: "Create a diagonal matrix or retrieve the diagonal of a matrix. When x is a vector, a matrix with the vector values on the diagonal will be returned. When x is a matrix, a vector with the diagonal values of the matrix is returned. When k is provided, the k-th diagonal will be filled in or retrieved, if k is positive, the values are placed on the super diagonal. When k is negative, the values are placed on the sub diagonal.",
            examples: ["diag(1:3)", "diag(1:3, 1)", "a = [1, 2, 3; 4, 5, 6; 7, 8, 9]", "diag(a)"],
            seealso: ["concat", "det", "eye", "inv", "ones", "range", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "dot",
            category: "Matrix",
            syntax: ["dot(A, B)"],
            description: "Calculate the dot product of two vectors. The dot product of A = [a1, a2, a3, ..., an] and B = [b1, b2, b3, ..., bn] is defined as dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn",
            examples: ["dot([2, 4, 1], [2, 2, 3])", "[2, 4, 1] * [2, 2, 3]"],
            seealso: ["multiply", "cross"]
        }
    }, function (e, t) {
        e.exports = {
            name: "eye",
            category: "Matrix",
            syntax: ["eye(n)", "eye(m, n)", "eye([m, n])", "eye"],
            description: "Returns the identity matrix with size m-by-n. The matrix has ones on the diagonal and zeros elsewhere.",
            examples: ["eye(3)", "eye(3, 5)", "a = [1, 2, 3; 4, 5, 6]", "eye(size(a))"],
            seealso: ["concat", "det", "diag", "inv", "ones", "range", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "filter",
            category: "Matrix",
            syntax: ["filter(x, test)"],
            description: "Filter items in a matrix.",
            examples: ["isPositive(x) = x > 0", "filter([6, -2, -1, 4, 3], isPositive)", "filter([6, -2, 0, 1, 0], x != 0)"],
            seealso: ["sort", "map", "forEach"]
        }
    }, function (e, t) {
        e.exports = {
            name: "flatten",
            category: "Matrix",
            syntax: ["flatten(x)"],
            description: "Flatten a multi dimensional matrix into a single dimensional matrix.",
            examples: ["a = [1, 2, 3; 4, 5, 6]", "size(a)", "b = flatten(a)", "size(b)"],
            seealso: ["concat", "resize", "size", "squeeze"]
        }
    }, function (e, t) {
        e.exports = {
            name: "forEach",
            category: "Matrix",
            syntax: ["forEach(x, callback)"],
            description: "Iterates over all elements of a matrix/array, and executes the given callback function.",
            examples: ["forEach([1, 2, 3], function(val) { console.log(val) })"],
            seealso: ["map", "sort", "filter"]
        }
    }, function (e, t) {
        e.exports = {
            name: "inv",
            category: "Matrix",
            syntax: ["inv(x)"],
            description: "Calculate the inverse of a matrix",
            examples: ["inv([1, 2; 3, 4])", "inv(4)", "1 / 4"],
            seealso: ["concat", "det", "diag", "eye", "ones", "range", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "kron",
            category: "Matrix",
            syntax: ["math.kron(x, y)"],
            description: "Calculates the kronecker product of 2 matrices or vectors.",
            examples: ["kron([[1, 0], [0, 1]], [[1, 2], [3, 4]])", "kron([1,1], [2,3,4])"],
            seealso: ["multiply", "dot", "cross"]
        }
    }, function (e, t) {
        e.exports = {
            name: "map",
            category: "Matrix",
            syntax: ["map(x, callback)"],
            description: "Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array.",
            examples: ["map([1, 2, 3], function(val) { return value * value })"],
            seealso: ["filter", "forEach"]
        }
    }, function (e, t) {
        e.exports = {
            name: "ones",
            category: "Matrix",
            syntax: ["ones(m)", "ones(m, n)", "ones(m, n, p, ...)", "ones([m])", "ones([m, n])", "ones([m, n, p, ...])", "ones"],
            description: "Create a matrix containing ones.",
            examples: ["ones(3)", "ones(3, 5)", "ones([2,3]) * 4.5", "a = [1, 2, 3; 4, 5, 6]", "ones(size(a))"],
            seealso: ["concat", "det", "diag", "eye", "inv", "range", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "partitionSelect",
            category: "Matrix",
            syntax: ["partitionSelect(x, k)", "partitionSelect(x, k, compare)"],
            description: "Partition-based selection of an array or 1D matrix. Will find the kth smallest value, and mutates the input array. Uses Quickselect.",
            examples: ["partitionSelect([5, 10, 1], 2)", 'partitionSelect(["C", "B", "A", "D"], 1)'],
            seealso: ["sort"]
        }
    }, function (e, t) {
        e.exports = {
            name: "range",
            category: "Type",
            syntax: ["start:end", "start:step:end", "range(start, end)", "range(start, end, step)", "range(string)"],
            description: "Create a range. Lower bound of the range is included, upper bound is excluded.",
            examples: ["1:5", "3:-1:-3", "range(3, 7)", "range(0, 12, 2)", 'range("4:10")', "a = [1, 2, 3, 4; 5, 6, 7, 8]", "a[1:2, 1:2]"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "size", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "reshape",
            category: "Matrix",
            syntax: ["reshape(x, sizes)"],
            description: "Reshape a multi dimensional array to fit the specified dimensions.",
            examples: ["reshape([1, 2, 3, 4, 5, 6], [2, 3])", "reshape([[1, 2], [3, 4]], [1, 4])", "reshape([[1, 2], [3, 4]], [4])"],
            seealso: ["size", "squeeze", "resize"]
        }
    }, function (e, t) {
        e.exports = {
            name: "resize",
            category: "Matrix",
            syntax: ["resize(x, size)", "resize(x, size, defaultValue)"],
            description: "Resize a matrix.",
            examples: ["resize([1,2,3,4,5], [3])", "resize([1,2,3], [5])", "resize([1,2,3], [5], -1)", "resize(2, [2, 3])", 'resize("hello", [8], "!")'],
            seealso: ["size", "subset", "squeeze", "reshape"]
        }
    }, function (e, t) {
        e.exports = {
            name: "size",
            category: "Matrix",
            syntax: ["size(x)"],
            description: "Calculate the size of a matrix.",
            examples: ["size(2.3)", 'size("hello world")', "a = [1, 2; 3, 4; 5, 6]", "size(a)", "size(1:6)"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "range", "squeeze", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sort",
            category: "Matrix",
            syntax: ["sort(x)", "sort(x, compare)"],
            description: 'Sort the items in a matrix. Compare can be a string "asc" or "desc", or a custom sort function.',
            examples: ["sort([5, 10, 1])", 'sort(["C", "B", "A", "D"])', "sortByLength(a, b) = size(a)[1] - size(b)[1]", 'sort(["Langdon", "Tom", "Sara"], sortByLength)'],
            seealso: ["map", "filter", "forEach"]
        }
    }, function (e, t) {
        e.exports = {
            name: "squeeze",
            category: "Matrix",
            syntax: ["squeeze(x)"],
            description: "Remove inner and outer singleton dimensions from a matrix.",
            examples: ["a = zeros(3,2,1)", "size(squeeze(a))", "b = zeros(1,1,3)", "size(squeeze(b))"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "range", "size", "subset", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "subset",
            category: "Matrix",
            syntax: ["value(index)", "value(index) = replacement", "subset(value, [index])", "subset(value, [index], replacement)"],
            description: "Get or set a subset of a matrix or string. Indexes are one-based. Both the ranges lower-bound and upper-bound are included.",
            examples: ["d = [1, 2; 3, 4]", "e = []", "e[1, 1:2] = [5, 6]", "e[2, :] = [7, 8]", "f = d * e", "f[2, 1]", "f[:, 1]"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "range", "size", "squeeze", "trace", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "trace",
            category: "Matrix",
            syntax: ["trace(A)"],
            description: "Calculate the trace of a matrix: the sum of the elements on the main diagonal of a square matrix.",
            examples: ["A = [1, 2, 3; -1, 2, 3; 2, 0, 3]", "trace(A)"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "range", "size", "squeeze", "subset", "transpose", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "transpose",
            category: "Matrix",
            syntax: ["x'", "transpose(x)"],
            description: "Transpose a matrix",
            examples: ["a = [1, 2, 3; 4, 5, 6]", "a'", "transpose(a)"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "range", "size", "squeeze", "subset", "trace", "zeros"]
        }
    }, function (e, t) {
        e.exports = {
            name: "zeros",
            category: "Matrix",
            syntax: ["zeros(m)", "zeros(m, n)", "zeros(m, n, p, ...)", "zeros([m])", "zeros([m, n])", "zeros([m, n, p, ...])", "zeros"],
            description: "Create a matrix containing zeros.",
            examples: ["zeros(3)", "zeros(3, 5)", "a = [1, 2, 3; 4, 5, 6]", "zeros(size(a))"],
            seealso: ["concat", "det", "diag", "eye", "inv", "ones", "range", "size", "squeeze", "subset", "trace", "transpose"]
        }
    }, function (e, t) {
        e.exports = {
            name: "combinations",
            category: "Probability",
            syntax: ["combinations(n, k)"],
            description: "Compute the number of combinations of n items taken k at a time",
            examples: ["combinations(7, 5)"],
            seealso: ["permutations", "factorial"]
        }
    }, function (e, t) {
        e.exports = {
            name: "factorial",
            category: "Probability",
            syntax: ["kldivergence(x, y)"],
            description: "Compute the factorial of a value",
            examples: ["5!", "5 * 4 * 3 * 2 * 1", "3!"],
            seealso: ["combinations", "permutations", "gamma"]
        }
    }, function (e, t) {
        e.exports = {
            name: "gamma",
            category: "Probability",
            syntax: ["gamma(n)"],
            description: "Compute the gamma function. For small values, the Lanczos approximation is used, and for large values the extended Stirling approximation.",
            examples: ["gamma(4)", "3!", "gamma(1/2)", "sqrt(pi)"],
            seealso: ["factorial"]
        }
    }, function (e, t) {
        e.exports = {
            name: "kldivergence",
            category: "Probability",
            syntax: ["n!", "factorial(n)"],
            description: "Calculate the Kullback-Leibler (KL) divergence  between two distributions.",
            examples: ["math.kldivergence([0.7,0.5,0.4], [0.2,0.9,0.5])"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "multinomial",
            category: "Probability",
            syntax: ["multinomial(A)"],
            description: "Multinomial Coefficients compute the number of ways of picking a1, a2, ..., ai unordered outcomes from `n` possibilities. multinomial takes one array of integers as an argument. The following condition must be enforced: every ai <= 0.",
            examples: ["multinomial([1, 2, 1])"],
            seealso: ["combinations", "factorial"]
        }
    }, function (e, t) {
        e.exports = {
            name: "permutations",
            category: "Probability",
            syntax: ["permutations(n)", "permutations(n, k)"],
            description: "Compute the number of permutations of n items taken k at a time",
            examples: ["permutations(5)", "permutations(5, 3)"],
            seealso: ["combinations", "factorial"]
        }
    }, function (e, t) {
        e.exports = {
            name: "pickRandom",
            category: "Probability",
            syntax: ["pickRandom(array)", "pickRandom(array, number)", "pickRandom(array, weights)", "pickRandom(array, number, weights)", "pickRandom(array, weights, number)"],
            description: "Pick a random entry from a given array.",
            examples: ["pickRandom(0:10)", "pickRandom([1, 3, 1, 6])", "pickRandom([1, 3, 1, 6], 2)", "pickRandom([1, 3, 1, 6], [2, 3, 2, 1])", "pickRandom([1, 3, 1, 6], 2, [2, 3, 2, 1])", "pickRandom([1, 3, 1, 6], [2, 3, 2, 1], 2)"],
            seealso: ["random", "randomInt"]
        }
    }, function (e, t) {
        e.exports = {
            name: "random",
            category: "Probability",
            syntax: ["random()", "random(max)", "random(min, max)", "random(size)", "random(size, max)", "random(size, min, max)"],
            description: "Return a random number.",
            examples: ["random()", "random(10, 20)", "random([2, 3])"],
            seealso: ["pickRandom", "randomInt"]
        }
    }, function (e, t) {
        e.exports = {
            name: "randInt",
            category: "Probability",
            syntax: ["randInt(max)", "randInt(min, max)", "randInt(size)", "randInt(size, max)", "randInt(size, min, max)"],
            description: "Return a random integer number",
            examples: ["randInt(10, 20)", "randInt([2, 3], 10)"],
            seealso: ["pickRandom", "random"]
        }
    }, function (e, t) {
        e.exports = {
            name: "compare",
            category: "Relational",
            syntax: ["compare(x, y)"],
            description: "Compare two values. Returns 1 if x is larger than y, -1 if x is smaller than y, and 0 if x and y are equal.",
            examples: ["compare(2, 3)", "compare(3, 2)", "compare(2, 2)", "compare(5cm, 40mm)", "compare(2, [1, 2, 3])"],
            seealso: ["equal", "unequal", "smaller", "smallerEq", "largerEq"]
        }
    }, function (e, t) {
        e.exports = {
            name: "deepEqual",
            category: "Relational",
            syntax: ["deepEqual(x, y)"],
            description: "Check equality of two matrices element wise. Returns true if the size of both matrices is equal and when and each of the elements are equal.",
            examples: ["[1,3,4] == [1,3,4]", "[1,3,4] == [1,3]"],
            seealso: ["equal", "unequal", "smaller", "larger", "smallerEq", "largerEq", "compare"]
        }
    }, function (e, t) {
        e.exports = {
            name: "equal",
            category: "Relational",
            syntax: ["x == y", "equal(x, y)"],
            description: "Check equality of two values. Returns true if the values are equal, and false if not.",
            examples: ["2+2 == 3", "2+2 == 4", "a = 3.2", "b = 6-2.8", "a == b", "50cm == 0.5m"],
            seealso: ["unequal", "smaller", "larger", "smallerEq", "largerEq", "compare", "deepEqual"]
        }
    }, function (e, t) {
        e.exports = {
            name: "larger",
            category: "Relational",
            syntax: ["x > y", "larger(x, y)"],
            description: "Check if value x is larger than y. Returns true if x is larger than y, and false if not.",
            examples: ["2 > 3", "5 > 2*2", "a = 3.3", "b = 6-2.8", "(a > b)", "(b < a)", "5 cm > 2 inch"],
            seealso: ["equal", "unequal", "smaller", "smallerEq", "largerEq", "compare"]
        }
    }, function (e, t) {
        e.exports = {
            name: "largerEq",
            category: "Relational",
            syntax: ["x >= y", "largerEq(x, y)"],
            description: "Check if value x is larger or equal to y. Returns true if x is larger or equal to y, and false if not.",
            examples: ["2 > 1+1", "2 >= 1+1", "a = 3.2", "b = 6-2.8", "(a > b)"],
            seealso: ["equal", "unequal", "smallerEq", "smaller", "largerEq", "compare"]
        }
    }, function (e, t) {
        e.exports = {
            name: "smaller",
            category: "Relational",
            syntax: ["x < y", "smaller(x, y)"],
            description: "Check if value x is smaller than value y. Returns true if x is smaller than y, and false if not.",
            examples: ["2 < 3", "5 < 2*2", "a = 3.3", "b = 6-2.8", "(a < b)", "5 cm < 2 inch"],
            seealso: ["equal", "unequal", "larger", "smallerEq", "largerEq", "compare"]
        }
    }, function (e, t) {
        e.exports = {
            name: "smallerEq",
            category: "Relational",
            syntax: ["x <= y", "smallerEq(x, y)"],
            description: "Check if value x is smaller or equal to value y. Returns true if x is smaller than y, and false if not.",
            examples: ["2 < 1+1", "2 <= 1+1", "a = 3.2", "b = 6-2.8", "(a < b)"],
            seealso: ["equal", "unequal", "larger", "smaller", "largerEq", "compare"]
        }
    }, function (e, t) {
        e.exports = {
            name: "unequal",
            category: "Relational",
            syntax: ["x != y", "unequal(x, y)"],
            description: "Check unequality of two values. Returns true if the values are unequal, and false if they are equal.",
            examples: ["2+2 != 3", "2+2 != 4", "a = 3.2", "b = 6-2.8", "a != b", "50cm != 0.5m", "5 cm != 2 inch"],
            seealso: ["equal", "smaller", "larger", "smallerEq", "largerEq", "compare", "deepEqual"]
        }
    }, function (e, t) {
        e.exports = {
            name: "erf",
            category: "Special",
            syntax: ["erf(x)"],
            description: "Compute the erf function of a value using a rational Chebyshev approximations for different intervals of x",
            examples: ["erf(0.2)", "erf(-0.5)", "erf(4)"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "mad",
            category: "Statistics",
            syntax: ["mad(a, b, c, ...)", "mad(A)"],
            description: "Compute the median absolute deviation of a matrix or a list with values. The median absolute deviation is defined as the median of the absolute deviations from the median.",
            examples: ["mad(10, 20, 30)", "mad([1, 2, 3])", "mad(10, 20, 30)"],
            seealso: ["mean", "median", "std", "abs"]
        }
    }, function (e, t) {
        e.exports = {
            name: "max",
            category: "Statistics",
            syntax: ["max(a, b, c, ...)", "max(A)", "max(A, dim)"],
            description: "Compute the maximum value of a list of values.",
            examples: ["max(2, 3, 4, 1)", "max([2, 3, 4, 1])", "max([2, 5; 4, 3])", "max([2, 5; 4, 3], 1)", "max([2, 5; 4, 3], 2)", "max(2.7, 7.1, -4.5, 2.0, 4.1)", "min(2.7, 7.1, -4.5, 2.0, 4.1)"],
            seealso: ["mean", "median", "min", "prod", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "mean",
            category: "Statistics",
            syntax: ["mean(a, b, c, ...)", "mean(A)", "mean(A, dim)"],
            description: "Compute the arithmetic mean of a list of values.",
            examples: ["mean(2, 3, 4, 1)", "mean([2, 3, 4, 1])", "mean([2, 5; 4, 3])", "mean([2, 5; 4, 3], 1)", "mean([2, 5; 4, 3], 2)", "mean([1.0, 2.7, 3.2, 4.0])"],
            seealso: ["max", "median", "min", "prod", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "median",
            category: "Statistics",
            syntax: ["median(a, b, c, ...)", "median(A)"],
            description: "Compute the median of all values. The values are sorted and the middle value is returned. In case of an even number of values, the average of the two middle values is returned.",
            examples: ["median(5, 2, 7)", "median([3, -1, 5, 7])"],
            seealso: ["max", "mean", "min", "prod", "std", "sum", "var", "quantileSeq"]
        }
    }, function (e, t) {
        e.exports = {
            name: "min",
            category: "Statistics",
            syntax: ["min(a, b, c, ...)", "min(A)", "min(A, dim)"],
            description: "Compute the minimum value of a list of values.",
            examples: ["min(2, 3, 4, 1)", "min([2, 3, 4, 1])", "min([2, 5; 4, 3])", "min([2, 5; 4, 3], 1)", "min([2, 5; 4, 3], 2)", "min(2.7, 7.1, -4.5, 2.0, 4.1)", "max(2.7, 7.1, -4.5, 2.0, 4.1)"],
            seealso: ["max", "mean", "median", "prod", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "mode",
            category: "Statistics",
            syntax: ["mode(a, b, c, ...)", "mode(A)", "mode(A, a, b, B, c, ...)"],
            description: "Computes the mode of all values as an array. In case mode being more than one, multiple values are returned in an array.",
            examples: ["mode(5, 2, 7)", "mode([3, -1, 5, 7])"],
            seealso: ["max", "mean", "min", "median", "prod", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "prod",
            category: "Statistics",
            syntax: ["prod(a, b, c, ...)", "prod(A)"],
            description: "Compute the product of all values.",
            examples: ["prod(2, 3, 4)", "prod([2, 3, 4])", "prod([2, 5; 4, 3])"],
            seealso: ["max", "mean", "min", "median", "min", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "quantileSeq",
            category: "Statistics",
            syntax: ["quantileSeq(A, prob[, sorted])", "quantileSeq(A, [prob1, prob2, ...][, sorted])", "quantileSeq(A, N[, sorted])"],
            description: "Compute the prob order quantile of a matrix or a list with values. The sequence is sorted and the middle value is returned. Supported types of sequence values are: Number, BigNumber, Unit Supported types of probablity are: Number, BigNumber. \n\nIn case of a (multi dimensional) array or matrix, the prob order quantile of all elements will be calculated.",
            examples: ["quantileSeq([3, -1, 5, 7], 0.5)", "quantileSeq([3, -1, 5, 7], [1/3, 2/3])", "quantileSeq([3, -1, 5, 7], 2)", "quantileSeq([-1, 3, 5, 7], 0.5, true)"],
            seealso: ["mean", "median", "min", "max", "prod", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "std",
            category: "Statistics",
            syntax: ["std(a, b, c, ...)", "std(A)", "std(A, normalization)"],
            description: 'Compute the standard deviation of all values, defined as std(A) = sqrt(var(A)). Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
            examples: ["std(2, 4, 6)", "std([2, 4, 6, 8])", 'std([2, 4, 6, 8], "uncorrected")', 'std([2, 4, 6, 8], "biased")', "std([1, 2, 3; 4, 5, 6])"],
            seealso: ["max", "mean", "min", "median", "min", "prod", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sum",
            category: "Statistics",
            syntax: ["sum(a, b, c, ...)", "sum(A)"],
            description: "Compute the sum of all values.",
            examples: ["sum(2, 3, 4, 1)", "sum([2, 3, 4, 1])", "sum([2, 5; 4, 3])"],
            seealso: ["max", "mean", "median", "min", "prod", "std", "sum", "var"]
        }
    }, function (e, t) {
        e.exports = {
            name: "var",
            category: "Statistics",
            syntax: ["var(a, b, c, ...)", "var(A)", "var(A, normalization)"],
            description: 'Compute the variance of all values. Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
            examples: ["var(2, 4, 6)", "var([2, 4, 6, 8])", 'var([2, 4, 6, 8], "uncorrected")', 'var([2, 4, 6, 8], "biased")', "var([1, 2, 3; 4, 5, 6])"],
            seealso: ["max", "mean", "min", "median", "min", "prod", "std", "sum"]
        }
    }, function (e, t) {
        e.exports = {
            name: "acos",
            category: "Trigonometry",
            syntax: ["acos(x)"],
            description: "Compute the inverse cosine of a value in radians.",
            examples: ["acos(0.5)", "acos(cos(2.3))"],
            seealso: ["cos", "atan", "asin"]
        }
    }, function (e, t) {
        e.exports = {
            name: "acosh",
            category: "Trigonometry",
            syntax: ["acosh(x)"],
            description: "Calculate the hyperbolic arccos of a value, defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.",
            examples: ["acosh(1.5)"],
            seealso: ["cosh", "asinh", "atanh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "acot",
            category: "Trigonometry",
            syntax: ["acot(x)"],
            description: "Calculate the inverse cotangent of a value.",
            examples: ["acot(0.5)", "acot(cot(0.5))", "acot(2)"],
            seealso: ["cot", "atan"]
        }
    }, function (e, t) {
        e.exports = {
            name: "acoth",
            category: "Trigonometry",
            syntax: ["acoth(x)"],
            description: "Calculate the hyperbolic arccotangent of a value, defined as `acoth(x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.",
            examples: ["acoth(0.5)"],
            seealso: ["acsch", "asech"]
        }
    }, function (e, t) {
        e.exports = {
            name: "acsc",
            category: "Trigonometry",
            syntax: ["acsc(x)"],
            description: "Calculate the inverse cotangent of a value.",
            examples: ["acsc(0.5)", "acsc(csc(0.5))", "acsc(2)"],
            seealso: ["csc", "asin", "asec"]
        }
    }, function (e, t) {
        e.exports = {
            name: "acsch",
            category: "Trigonometry",
            syntax: ["acsch(x)"],
            description: "Calculate the hyperbolic arccosecant of a value, defined as `acsch(x) = ln(1/x + sqrt(1/x^2 + 1))`.",
            examples: ["acsch(0.5)"],
            seealso: ["asech", "acoth"]
        }
    }, function (e, t) {
        e.exports = {
            name: "asec",
            category: "Trigonometry",
            syntax: ["asec(x)"],
            description: "Calculate the inverse secant of a value.",
            examples: ["asec(0.5)", "asec(sec(0.5))", "asec(2)"],
            seealso: ["acos", "acot", "acsc"]
        }
    }, function (e, t) {
        e.exports = {
            name: "asech",
            category: "Trigonometry",
            syntax: ["asech(x)"],
            description: "Calculate the inverse secant of a value.",
            examples: ["asech(0.5)"],
            seealso: ["acsch", "acoth"]
        }
    }, function (e, t) {
        e.exports = {
            name: "asin",
            category: "Trigonometry",
            syntax: ["asin(x)"],
            description: "Compute the inverse sine of a value in radians.",
            examples: ["asin(0.5)", "asin(sin(2.3))"],
            seealso: ["sin", "acos", "atan"]
        }
    }, function (e, t) {
        e.exports = {
            name: "asinh",
            category: "Trigonometry",
            syntax: ["asinh(x)"],
            description: "Calculate the hyperbolic arcsine of a value, defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.",
            examples: ["asinh(0.5)"],
            seealso: ["acosh", "atanh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "atan",
            category: "Trigonometry",
            syntax: ["atan(x)"],
            description: "Compute the inverse tangent of a value in radians.",
            examples: ["atan(0.5)", "atan(tan(2.3))"],
            seealso: ["tan", "acos", "asin"]
        }
    }, function (e, t) {
        e.exports = {
            name: "atan2",
            category: "Trigonometry",
            syntax: ["atan2(y, x)"],
            description: "Computes the principal value of the arc tangent of y/x in radians.",
            examples: ["atan2(2, 2) / pi", "angle = 60 deg in rad", "x = cos(angle)", "y = sin(angle)", "atan2(y, x)"],
            seealso: ["sin", "cos", "tan"]
        }
    }, function (e, t) {
        e.exports = {
            name: "atanh",
            category: "Trigonometry",
            syntax: ["atanh(x)"],
            description: "Calculate the hyperbolic arctangent of a value, defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.",
            examples: ["atanh(0.5)"],
            seealso: ["acosh", "asinh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "cos",
            category: "Trigonometry",
            syntax: ["cos(x)"],
            description: "Compute the cosine of x in radians.",
            examples: ["cos(2)", "cos(pi / 4) ^ 2", "cos(180 deg)", "cos(60 deg)", "sin(0.2)^2 + cos(0.2)^2"],
            seealso: ["acos", "sin", "tan"]
        }
    }, function (e, t) {
        e.exports = {
            name: "cosh",
            category: "Trigonometry",
            syntax: ["cosh(x)"],
            description: "Compute the hyperbolic cosine of x in radians.",
            examples: ["cosh(0.5)"],
            seealso: ["sinh", "tanh", "coth"]
        }
    }, function (e, t) {
        e.exports = {
            name: "cot",
            category: "Trigonometry",
            syntax: ["cot(x)"],
            description: "Compute the cotangent of x in radians. Defined as 1/tan(x)",
            examples: ["cot(2)", "1 / tan(2)"],
            seealso: ["sec", "csc", "tan"]
        }
    }, function (e, t) {
        e.exports = {
            name: "coth",
            category: "Trigonometry",
            syntax: ["coth(x)"],
            description: "Compute the hyperbolic cotangent of x in radians.",
            examples: ["coth(2)", "1 / tanh(2)"],
            seealso: ["sech", "csch", "tanh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "csc",
            category: "Trigonometry",
            syntax: ["csc(x)"],
            description: "Compute the cosecant of x in radians. Defined as 1/sin(x)",
            examples: ["csc(2)", "1 / sin(2)"],
            seealso: ["sec", "cot", "sin"]
        }
    }, function (e, t) {
        e.exports = {
            name: "csch",
            category: "Trigonometry",
            syntax: ["csch(x)"],
            description: "Compute the hyperbolic cosecant of x in radians. Defined as 1/sinh(x)",
            examples: ["csch(2)", "1 / sinh(2)"],
            seealso: ["sech", "coth", "sinh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sec",
            category: "Trigonometry",
            syntax: ["sec(x)"],
            description: "Compute the secant of x in radians. Defined as 1/cos(x)",
            examples: ["sec(2)", "1 / cos(2)"],
            seealso: ["cot", "csc", "cos"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sech",
            category: "Trigonometry",
            syntax: ["sech(x)"],
            description: "Compute the hyperbolic secant of x in radians. Defined as 1/cosh(x)",
            examples: ["sech(2)", "1 / cosh(2)"],
            seealso: ["coth", "csch", "cosh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sin",
            category: "Trigonometry",
            syntax: ["sin(x)"],
            description: "Compute the sine of x in radians.",
            examples: ["sin(2)", "sin(pi / 4) ^ 2", "sin(90 deg)", "sin(30 deg)", "sin(0.2)^2 + cos(0.2)^2"],
            seealso: ["asin", "cos", "tan"]
        }
    }, function (e, t) {
        e.exports = {
            name: "sinh",
            category: "Trigonometry",
            syntax: ["sinh(x)"],
            description: "Compute the hyperbolic sine of x in radians.",
            examples: ["sinh(0.5)"],
            seealso: ["cosh", "tanh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "tan",
            category: "Trigonometry",
            syntax: ["tan(x)"],
            description: "Compute the tangent of x in radians.",
            examples: ["tan(0.5)", "sin(0.5) / cos(0.5)", "tan(pi / 4)", "tan(45 deg)"],
            seealso: ["atan", "sin", "cos"]
        }
    }, function (e, t) {
        e.exports = {
            name: "tanh",
            category: "Trigonometry",
            syntax: ["tanh(x)"],
            description: "Compute the hyperbolic tangent of x in radians.",
            examples: ["tanh(0.5)", "sinh(0.5) / cosh(0.5)"],
            seealso: ["sinh", "cosh"]
        }
    }, function (e, t) {
        e.exports = {
            name: "to",
            category: "Units",
            syntax: ["x to unit", "to(x, unit)"],
            description: "Change the unit of a value.",
            examples: ["5 inch to cm", "3.2kg to g", "16 bytes in bits"],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "clone",
            category: "Utils",
            syntax: ["clone(x)"],
            description: "Clone a variable. Creates a copy of primitive variables,and a deep copy of matrices",
            examples: ["clone(3.5)", "clone(2 - 4i)", "clone(45 deg)", "clone([1, 2; 3, 4])", 'clone("hello world")'],
            seealso: []
        }
    }, function (e, t) {
        e.exports = {
            name: "format",
            category: "Utils",
            syntax: ["format(value)", "format(value, precision)"],
            description: "Format a value of any type as string.",
            examples: ["format(2.3)", "format(3 - 4i)", "format([])", "format(pi, 3)"],
            seealso: ["print"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isInteger",
            category: "Utils",
            syntax: ["isInteger(x)"],
            description: "Test whether a value is an integer number.",
            examples: ["isInteger(2)", "isInteger(3.5)", "isInteger([3, 0.5, -2])"],
            seealso: ["isNegative", "isNumeric", "isPositive", "isZero"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isNaN",
            category: "Utils",
            syntax: ["isNaN(x)"],
            description: "Test whether a value is NaN (not a number)",
            examples: ["isNaN(2)", "isNaN(0 / 0)", "isNaN(NaN)", "isNaN(Infinity)"],
            seealso: ["isNegative", "isNumeric", "isPositive", "isZero"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isNegative",
            category: "Utils",
            syntax: ["isNegative(x)"],
            description: "Test whether a value is negative: smaller than zero.",
            examples: ["isNegative(2)", "isNegative(0)", "isNegative(-4)", "isNegative([3, 0.5, -2])"],
            seealso: ["isInteger", "isNumeric", "isPositive", "isZero"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isNumeric",
            category: "Utils",
            syntax: ["isNumeric(x)"],
            description: "Test whether a value is a numeric value. Returns true when the input is a number, BigNumber, Fraction, or boolean.",
            examples: ["isNumeric(2)", "isNumeric(0)", "isNumeric(bignumber(500))", "isNumeric(fraction(0.125))", 'isNumeric("3")', "isNumeric(2 + 3i)", 'isNumeric([2.3, "foo", false])'],
            seealso: ["isInteger", "isZero", "isNegative", "isPositive", "isNaN"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isPositive",
            category: "Utils",
            syntax: ["isPositive(x)"],
            description: "Test whether a value is positive: larger than zero.",
            examples: ["isPositive(2)", "isPositive(0)", "isPositive(-4)", "isPositive([3, 0.5, -2])"],
            seealso: ["isInteger", "isNumeric", "isNegative", "isZero"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isPrime",
            category: "Utils",
            syntax: ["isPrime(x)"],
            description: "Test whether a value is prime: has no divisors other than itself and one.",
            examples: ["isPrime(3)", "isPrime(-2)", "isPrime([2, 17, 100])"],
            seealso: ["isInteger", "isNumeric", "isNegative", "isZero"]
        }
    }, function (e, t) {
        e.exports = {
            name: "isZero",
            category: "Utils",
            syntax: ["isZero(x)"],
            description: "Test whether a value is zero.",
            examples: ["isZero(2)", "isZero(0)", "isZero(-4)", "isZero([3, 0, -2, 0])"],
            seealso: ["isInteger", "isNumeric", "isNegative", "isPositive"]
        }
    }, function (e, t) {
        e.exports = {
            name: "typeof",
            category: "Utils",
            syntax: ["typeof(x)"],
            description: "Get the type of a variable.",
            examples: ["typeof(3.5)", "typeof(2 - 4i)", "typeof(45 deg)", 'typeof("hello world")'],
            seealso: []
        }
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(30));
            return o("compile", {
                string: function (e) {
                    return a(e).compile()
                },
                "Array | Matrix": function (e) {
                    return i(e, function (e) {
                        return a(e).compile()
                    })
                }
            })
        }
        var i = n(1);
        t.name = "compile", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(30));
            return o("compile", {
                string: function (e) {
                    var t = {};
                    return a(e).compile().eval(t)
                },
                "string, Object": function (e, t) {
                    return a(e).compile().eval(t)
                },
                "Array | Matrix": function (e) {
                    var t = {};
                    return i(e, function (e) {
                        return a(e).compile().eval(t)
                    })
                },
                "Array | Matrix, Object": function (e, t) {
                    return i(e, function (e) {
                        return a(e).compile().eval(t)
                    })
                }
            })
        }
        var i = n(1);
        t.name = "eval", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i, o) {
            var a = r(n(84));
            return i("help", {
                any: function (t) {
                    var n, r = t;
                    if ("string" != typeof t)
                        for (n in o)
                            if (o.hasOwnProperty(n) && t === o[n]) {
                                r = n;
                                break
                            } var i = a[r];
                    if (!i) throw new Error('No documentation found on "' + r + '"');
                    return new e.Help(i)
                }
            })
        }
        t.math = !0, t.name = "help", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(329), n(330), n(331), n(333), n(85)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(30));
            return i("parse", {
                "string | Array | Matrix": o,
                "string | Array | Matrix, Object": o
            })
        }
        t.name = "parse", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(84), n(332), n(336), n(341), n(148), n(30), n(81)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function i() {
                throw new Error("UpdateNode is deprecated. Use AssignmentNode instead.")
            }
            return i
        }
        t.name = "UpdateNode", t.path = "expression.node", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(86), n(65), n(87), n(88), n(89), n(45), n(66), n(90), n(46), n(13), n(91), n(52), n(53), n(67), n(27), n(335)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(55)),
                u = r(n(0));
            return function (e, t, n) {
                try {
                    if (Array.isArray(e)) return u(e).subset(t, n).valueOf();
                    if (e && "function" == typeof e.subset) return e.subset(t, n);
                    if ("string" == typeof e) return s(e, t, n);
                    if ("object" == typeof e) {
                        if (!t.isObjectProperty()) throw TypeError("Cannot apply a numeric index as object property");
                        return o(e, t.getObjectProperty(), n), e
                    }
                    throw new TypeError("Cannot apply index: unsupported type of object")
                } catch (e) {
                    throw i(e)
                }
            }
        }
        var i = n(31).transform,
            o = n(17).setSafeProperty;
        t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(110));
            return o("concat", {
                "...any": function (e) {
                    var t = e.length - 1,
                        n = e[t];
                    "number" == typeof n ? e[t] = n - 1 : n && n.isBigNumber === !0 && (e[t] = n.minus(1));
                    try {
                        return a.apply(null, e)
                    } catch (e) {
                        throw i(e)
                    }
                }
            })
        }
        var i = n(31).transform;
        t.name = "concat", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e, t, n) {
                var r, i;
                if (e[0] && (r = e[0].compile().eval(n)), e[1])
                    if (e[1] && e[1].isSymbolNode) i = e[1].compile().eval(n);
                    else {
                        var o = n || {},
                            s = e[1].filter(function (e) {
                                return e && e.isSymbolNode && !(e.name in t) && !(e.name in o)
                            })[0],
                            u = Object.create(o),
                            c = e[1].compile();
                        if (!s) throw new Error("No undefined variable found in filter equation");
                        var l = s.name;
                        i = function (e) {
                            return u[l] = e, c.eval(u)
                        }
                    } return a(r, i)
            }
            var a = r(n(112));
            return r(n(27)), o.rawArgs = !0, o
        }
        t.name = "filter", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            return r(n(113)), o("forEach", {
                "Array | Matrix, function": function (e, t) {
                    var n = i(t),
                        r = function (i, o) {
                            Array.isArray(i) ? i.forEach(function (e, t) {
                                r(e, o.concat(t + 1))
                            }) : 1 === n ? t(i) : 2 === n ? t(i, o) : t(i, o, e)
                        };
                    r(e.valueOf(), [])
                }
            })
        }
        var i = n(37).maxArgumentCount;
        t.name = "forEach", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(338), n(339), n(340), n(342), n(343), n(344), n(345), n(346), n(347), n(348)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n) {
            return function () {
                for (var t = [], n = 0, r = arguments.length; n < r; n++) {
                    var i = arguments[n];
                    if (i && i.isRange === !0) i.start--, i.end -= i.step > 0 ? 0 : 2;
                    else if (i && i.isSet === !0) i = i.map(function (e) {
                        return e - 1
                    });
                    else if (i && (i.isArray === !0 || i.isMatrix)) i = i.map(function (e) {
                        return e - 1
                    });
                    else if ("number" == typeof i) i--;
                    else if (i && i.isBigNumber === !0) i = i.toNumber() - 1;
                    else if ("string" != typeof i) throw new TypeError("Dimension must be an Array, Matrix, number, string, or Range");
                    t[n] = i
                }
                var o = new e.Index;
                return e.Index.apply(o, t), o
            }
        }
        t.name = "index", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(0));
            return o("max", {
                "Array, function": function (e, t) {
                    return i(e, t, e)
                },
                "Matrix, function": function (e, t) {
                    return a(i(e.valueOf(), t, e))
                }
            })
        }

        function i(e, t, n) {
            function r(e, o) {
                return Array.isArray(e) ? e.map(function (e, t) {
                    return r(e, o.concat(t + 1))
                }) : 1 === i ? t(e) : 2 === i ? t(e, o) : t(e, o, n)
            }
            var i = o(t);
            return r(e, [])
        }
        var o = n(37).maxArgumentCount;
        t.name = "map", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(121));
            return a("max", {
                "...any": function (e) {
                    if (2 == e.length && o(e[0])) {
                        var t = e[1];
                        "number" == typeof t ? e[1] = t - 1 : t && t.isBigNumber === !0 && (e[1] = t.minus(1))
                    }
                    try {
                        return s.apply(null, e)
                    } catch (e) {
                        throw i(e)
                    }
                }
            })
        }
        var i = n(31).transform,
            o = n(42);
        t.name = "max", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(122));
            return a("mean", {
                "...any": function (e) {
                    if (2 == e.length && o(e[0])) {
                        var t = e[1];
                        "number" == typeof t ? e[1] = t - 1 : t && t.isBigNumber === !0 && (e[1] = t.minus(1))
                    }
                    try {
                        return s.apply(null, e)
                    } catch (e) {
                        throw i(e)
                    }
                }
            })
        }
        var i = n(31).transform,
            o = n(42);
        t.name = "mean", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(124));
            return a("min", {
                "...any": function (e) {
                    if (2 == e.length && o(e[0])) {
                        var t = e[1];
                        "number" == typeof t ? e[1] = t - 1 : t && t.isBigNumber === !0 && (e[1] = t.minus(1))
                    }
                    try {
                        return s.apply(null, e)
                    } catch (e) {
                        throw i(e)
                    }
                }
            })
        }
        var i = n(31).transform,
            o = n(42);
        t.name = "min", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(116));
            return i("range", {
                "...any": function (e) {
                    var t = e.length - 1,
                        n = e[t];
                    return "boolean" != typeof n && e.push(!0), o.apply(null, e)
                }
            })
        }
        t.name = "range", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(55));
            return o("subset", {
                "...any": function (e) {
                    try {
                        return a.apply(null, e)
                    } catch (e) {
                        throw i(e)
                    }
                }
            })
        }
        var i = n(31).transform;
        t.name = "subset", t.path = "expression.transform", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(33)),
                s = r(n(54)),
                u = (r(n(129)), r(n(74))),
                c = (r(n(51)), r(n(120))),
                l = (r(n(26)), r(n(106))),
                f = r(n(48)),
                h = r(n(108)),
                p = r(n(32)),
                m = r(n(20)),
                d = r(n(19)),
                v = r(n(22)),
                g = r(n(21)),
                y = i("qr", {
                    DenseMatrix: function (e) {
                        return w(e)
                    },
                    SparseMatrix: function (e) {
                        return x(e)
                    },
                    Array: function (e) {
                        var t = o(e),
                            n = w(t);
                        return {
                            Q: n.Q.valueOf(),
                            R: n.R.valueOf()
                        }
                    }
                }),
                w = function (e) {
                    var t, n, r, i = e._size[0],
                        o = e._size[1],
                        y = s([i], "dense"),
                        w = y._data,
                        x = e.clone(),
                        b = x._data,
                        C = a([i], "");
                    for (r = 0; r < Math.min(o, i); ++r) {
                        var M = b[r][r],
                            T = p(l(M)),
                            N = h(T),
                            E = 0;
                        for (t = r; t < i; t++) E = m(E, v(b[t][r], h(b[t][r])));
                        var A = v(T, f(E));
                        if (!u(A)) {
                            var S = g(M, A);
                            for (C[r] = 1, t = r + 1; t < i; t++) C[t] = d(b[t][r], S);
                            var P, O = p(h(d(S, A)));
                            for (n = r; n < o; n++) {
                                for (P = 0, t = r; t < i; t++) P = m(P, v(h(C[t]), b[t][n]));
                                for (P = v(P, O), t = r; t < i; t++) b[t][n] = v(g(b[t][n], v(C[t], P)), N)
                            }
                            for (t = 0; t < i; t++) {
                                for (P = 0, n = r; n < i; n++) P = m(P, v(w[t][n], C[n]));
                                for (P = v(P, O), n = r; n < i; ++n) w[t][n] = d(g(w[t][n], v(P, h(C[n]))), N)
                            }
                        }
                    }
                    for (t = 0; t < i; ++t)
                        for (n = 0; n < t && n < o; ++n) {
                            if (c(0, d(b[t][n], 1e5))) throw new Error("math.qr(): unknown error - R is not lower triangular (element (" + t + ", " + n + ")  = " + b[t][n] + ")");
                            b[t][n] = v(b[t][n], 0)
                        }
                    return {
                        Q: y,
                        R: x,
                        toString: function () {
                            return "Q: " + this.Q.toString() + "\nR: " + this.R.toString()
                        }
                    }
                },
                x = function (e) {
                    throw new Error("qr not implemented for sparse matrices yet")
                };
            return y
        }
        t.name = "qr", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e) {
                if ("log" != e.name && "nthRoot" != e.name || 2 != e.args.length) {
                    for (var t = 0; t < e.args.length; ++t) e.args[t] = new u(0);
                    throw e.compile().eval(), new Error("Expected TypeError, but none found")
                }
            }
            var a = r(n(30)),
                s = r(n(96)),
                u = r(n(45)),
                c = r(n(46)),
                l = r(n(52)),
                f = r(n(53)),
                h = r(n(27)),
                p = i("derivative", {
                    "Node, SymbolNode, Object": function (e, t, n) {
                        var r = {};
                        d(r, e, t.name);
                        var i = v(e, r);
                        return n.simplify ? s(i) : i
                    },
                    "Node, SymbolNode": function (e, t) {
                        return p(e, t, {
                            simplify: !0
                        })
                    },
                    "string, SymbolNode": function (e, t) {
                        return p(a(e), t)
                    },
                    "string, SymbolNode, Object": function (e, t, n) {
                        return p(a(e), t, n)
                    },
                    "string, string": function (e, t) {
                        return p(a(e), a(t))
                    },
                    "string, string, Object": function (e, t, n) {
                        return p(a(e), a(t), n)
                    },
                    "Node, string": function (e, t) {
                        return p(e, a(t))
                    },
                    "Node, string, Object": function (e, t, n) {
                        return p(e, a(t), n)
                    }
                });
            p._simplify = !0, p.toTex = function (e) {
                return m.apply(null, e.args)
            };
            var m = i("_derivTex", {
                    "Node, SymbolNode": function (e, t) {
                        return m(e.toString(), t.toString(), 1)
                    },
                    "Node, SymbolNode, ConstantNode": function (e, t, n) {
                        return m(e.toString(), t.name, n.value)
                    },
                    "string, string, number": function (e, t, n) {
                        var r;
                        return r = 1 === n ? "{d\\over d" + t + "}" : "{d^{" + n + "}\\over d" + t + "^{" + n + "}}", r + "\\left[" + e + "\\right]"
                    }
                }),
                d = i("constTag", {
                    "Object, ConstantNode, string": function (e, t) {
                        return e[t] = !0
                    },
                    "Object, SymbolNode, string": function (e, t, n) {
                        return t.name != n && (e[t] = !0)
                    },
                    "Object, ParenthesisNode, string": function (e, t, n) {
                        return d(e, t.content, n)
                    },
                    "Object, FunctionAssignmentNode, string": function (e, t, n) {
                        return t.params.indexOf(n) == -1 ? e[t] = !0 : d(e, t.expr, n)
                    },
                    "Object, FunctionNode | OperatorNode, string": function (e, t, n) {
                        if (0 != t.args.length) {
                            for (var r = d(e, t.args[0], n), i = 1; i < t.args.length; ++i) r = d(e, t.args[i], n) && r;
                            if (r) return e[t] = !0
                        }
                        return !1
                    }
                }),
                v = i("_derivative", {
                    "ConstantNode, Object": function (e) {
                        return new u("0", e.valueType)
                    },
                    "SymbolNode, Object": function (e, n) {
                        return void 0 !== n[e] ? new u("0", t.number) : new u("1", t.number)
                    },
                    "ParenthesisNode, Object": function (e, t) {
                        return new f(v(e.content, t))
                    },
                    "FunctionAssignmentNode, Object": function (e, n) {
                        return void 0 !== n[e] ? new u("0", t.number) : v(e.expr, n)
                    },
                    "FunctionNode, Object": function (e, n) {
                        if (1 != e.args.length && o(e), void 0 !== n[e]) return new u("0", t.number);
                        var r, i, a = e.args[0],
                            s = !1,
                            f = !1;
                        switch (e.name) {
                            case "cbrt":
                                s = !0, i = new l("*", "multiply", [new u("3", t.number), new l("^", "pow", [a, new l("/", "divide", [new u("2", t.number), new u("3", t.number)])])]);
                                break;
                            case "sqrt":
                            case "nthRoot":
                                if (1 == e.args.length) {
                                    s = !0, i = new l("*", "multiply", [new u("2", t.number), new c("sqrt", [a])]);
                                    break
                                }
                                return r = new l("/", "divide", [new u("1", t.number), e.args[1]]), n[r] = n[e.args[1]], v(new l("^", "pow", [a, r]), n);
                            case "log10":
                                r = new u("10", t.number);
                            case "log":
                                if (r || 1 != e.args.length) {
                                    if (!r && void 0 === n[e.args[1]]) return v(new l("/", "divide", [new c("log", [a]), new c("log", [e.args[1]])]), n);
                                    i = new l("*", "multiply", [a.clone(), new c("log", [r || e.args[1]])])
                                } else i = a.clone();
                                s = !0;
                                break;
                            case "exp":
                                i = new c("exp", [a.clone()]);
                                break;
                            case "sin":
                                i = new c("cos", [a.clone()]);
                                break;
                            case "cos":
                                i = new l("-", "unaryMinus", [new c("sin", [a.clone()])]);
                                break;
                            case "tan":
                                i = new l("^", "pow", [new c("sec", [a.clone()]), new u("2", t.number)]);
                                break;
                            case "sec":
                                i = new l("*", "multiply", [e, new c("tan", [a.clone()])]);
                                break;
                            case "csc":
                                f = !0, i = new l("*", "multiply", [e, new c("cot", [a.clone()])]);
                                break;
                            case "cot":
                                f = !0, i = new l("^", "pow", [new c("csc", [a.clone()]), new u("2", t.number)]);
                                break;
                            case "asin":
                                s = !0, i = new c("sqrt", [new l("-", "subtract", [new u("1", t.number), new l("^", "pow", [a.clone(), new u("2", t.number)])])]);
                                break;
                            case "acos":
                                s = !0, f = !0, i = new c("sqrt", [new l("-", "subtract", [new u("1", t.number), new l("^", "pow", [a.clone(), new u("2", t.number)])])]);
                                break;
                            case "atan":
                                s = !0, i = new l("+", "add", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)]);
                                break;
                            case "asec":
                                s = !0, i = new l("*", "multiply", [new c("abs", [a.clone()]), new c("sqrt", [new l("-", "subtract", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)])])]);
                                break;
                            case "acsc":
                                s = !0, f = !0, i = new l("*", "multiply", [new c("abs", [a.clone()]), new c("sqrt", [new l("-", "subtract", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)])])]);
                                break;
                            case "acot":
                                s = !0, f = !0, i = new l("+", "add", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)]);
                                break;
                            case "sinh":
                                i = new c("cosh", [a.clone()]);
                                break;
                            case "cosh":
                                i = new c("sinh", [a.clone()]);
                                break;
                            case "tanh":
                                i = new l("^", "pow", [new c("sech", [a.clone()]), new u("2", t.number)]);
                                break;
                            case "sech":
                                f = !0, i = new l("*", "multiply", [e, new c("tanh", [a.clone()])]);
                                break;
                            case "csch":
                                f = !0, i = new l("*", "multiply", [e, new c("coth", [a.clone()])]);
                                break;
                            case "coth":
                                f = !0, i = new l("^", "pow", [new c("csch", [a.clone()]), new u("2", t.number)]);
                                break;
                            case "asinh":
                                s = !0, i = new c("sqrt", [new l("+", "add", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)])]);
                                break;
                            case "acosh":
                                s = !0, i = new c("sqrt", [new l("-", "subtract", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)])]);
                                break;
                            case "atanh":
                                s = !0, i = new l("-", "subtract", [new u("1", t.number), new l("^", "pow", [a.clone(), new u("2", t.number)])]);
                                break;
                            case "asech":
                                s = !0, f = !0, i = new l("*", "multiply", [a.clone(), new c("sqrt", [new l("-", "subtract", [new u("1", t.number), new l("^", "pow", [a.clone(), new u("2", t.number)])])])]);
                                break;
                            case "acsch":
                                s = !0, f = !0, i = new l("*", "multiply", [new c("abs", [a.clone()]), new c("sqrt", [new l("+", "add", [new l("^", "pow", [a.clone(), new u("2", t.number)]), new u("1", t.number)])])]);
                                break;
                            case "acoth":
                                s = !0, f = !0, i = new l("-", "subtract", [new u("1", t.number), new l("^", "pow", [a.clone(), new u("2", t.number)])]);
                                break;
                            case "abs":
                                i = new l("/", "divide", [new c(new h("abs"), [a.clone()]), a.clone()]);
                                break;
                            case "gamma":
                            default:
                                throw new Error('Function "' + e.name + '" not supported by derivative')
                        }
                        var p, m;
                        s ? (p = "/", m = "divide") : (p = "*", m = "multiply");
                        var d = v(a, n);
                        return f && (d = new l("-", "unaryMinus", [d])), new l(p, m, [d, i])
                    },
                    "OperatorNode, Object": function (e, n) {
                        if (void 0 !== n[e]) return new u("0", t.number);
                        var r = e.args[0],
                            i = e.args[1];
                        switch (e.op) {
                            case "+":
                            case "-":
                                return 1 == e.args.length ? new l(e.op, e.fn, [v(r, n)]) : new l(e.op, e.fn, [v(r, n), v(i, n)]);
                            case "*":
                                if (void 0 !== n[r] || void 0 !== n[i]) {
                                    var o = void 0 !== n[r] ? [r.clone(), v(i, n)] : [i.clone(), v(r, n)];
                                    return new l("*", "multiply", o)
                                }
                                return new l("+", "add", [new l("*", "multiply", [v(r, n), i.clone()]), new l("*", "multiply", [r.clone(), v(i, n)])]);
                            case "/":
                                return void 0 !== n[i] ? new l("/", "divide", [v(r, n), i]) : void 0 !== n[r] ? new l("*", "multiply", [new l("-", "unaryMinus", [r]), new l("/", "divide", [v(i, n), new l("^", "pow", [i.clone(), new u("2", t.number)])])]) : new l("/", "divide", [new l("-", "subtract", [new l("*", "multiply", [v(r, n), i.clone()]), new l("*", "multiply", [r.clone(), v(i, n)])]), new l("^", "pow", [i.clone(), new u("2", t.number)])]);
                            case "^":
                                if (void 0 !== n[r]) return !r.isConstantNode || "0" != r.value && "1" != r.value ? new l("*", "multiply", [e, new l("*", "multiply", [new c("log", [r.clone()]), v(i.clone(), n)])]) : new u("0", t.number);
                                if (void 0 !== n[i]) {
                                    if (i.isConstantNode) {
                                        var a = i.value;
                                        if ("0" == a) return new u("0", t.number);
                                        if ("1" == a) return v(r, n)
                                    }
                                    var s = new l("^", "pow", [r.clone(), new l("-", "subtract", [i, new u("1", t.number)])]);
                                    return new l("*", "multiply", [i.clone(), new l("*", "multiply", [v(r, n), s])])
                                }
                                return new l("*", "multiply", [new l("^", "pow", [r.clone(), i.clone()]), new l("+", "add", [new l("*", "multiply", [v(r, n), new l("/", "divide", [i.clone(), r.clone()])]), new l("*", "multiply", [v(i, n), new c("log", [r.clone()])])])]);
                            case "%":
                            case "mod":
                            default:
                                throw new Error('Operator "' + e.op + '" not supported by derivative')
                        }
                    }
                });
            return p
        }
        t.name = "derivative", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(350), n(96), n(349), n(94), n(95), n(98), n(353), n(99)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i, o) {
            function a(e) {
                var t = h(e);
                return t.isNode ? t : x(t)
            }

            function s(e, t) {
                try {
                    return b(o[e].apply(null, t))
                } catch (n) {
                    return t = t.map(function (e) {
                        return e.isFraction ? e.valueOf() : e
                    }), b(o[e].apply(null, t))
                }
            }

            function u(e) {
                if (isFinite(e)) {
                    var t = o.fraction(e);
                    if (t.valueOf() === e) return t
                }
                return e
            }

            function c(e) {
                return new w("-", "unaryMinus", [e])
            }

            function l(e) {
                var t, n = e.s * e.n;
                return t = n < 0 ? new w("-", "unaryMinus", [new y(-n)]) : new y(n), 1 === e.d ? t : new w("/", "divide", [t, new y(e.d)])
            }

            function f(e, t, n) {
                return t.reduce(function (t, r) {
                    if (t.isNode || r.isNode) t.isNode ? r.isNode || (r = x(r)) : t = x(t);
                    else {
                        try {
                            return s(e, [t, r])
                        } catch (e) {}
                        t = x(t), r = x(r)
                    }
                    return n([t, r])
                })
            }

            function h(e) {
                switch (e.type) {
                    case "SymbolNode":
                        return e;
                    case "ConstantNode":
                        return "number" === e.valueType ? b(e.value) : e;
                    case "FunctionNode":
                        if (o[e.name] && o[e.name].rawArgs) return e;
                    case "OperatorNode":
                        var t, n, r = e.fn.toString(),
                            i = g(e);
                        if (1 === e.args.length) t = [h(e.args[0])], n = t[0].isNode ? i(t) : s(r, t);
                        else if (d(e))
                            if (t = v(e), t = t.map(h), m(r)) {
                                for (var a = [], u = [], c = 0; c < t.length; c++) t[c].isNode ? u.push(t[c]) : a.push(t[c]);
                                a.length > 1 ? (n = f(r, a, i), u.unshift(n), n = f(r, u, i)) : n = f(r, t, i)
                            } else n = f(r, t, i);
                        else t = e.args.map(h), n = f(r, t, i);
                        return n;
                    case "ParenthesisNode":
                        return h(e.content);
                    case "AccessorNode":
                    case "ArrayNode":
                    case "AssignmentNode":
                    case "BlockNode":
                    case "FunctionAssignmentNode":
                    case "IndexNode":
                    case "ObjectNode":
                    case "RangeNode":
                    case "UpdateNode":
                    case "ConditionalNode":
                    default:
                        throw "Unimplemented node type in simplifyConstant: " + e.type
                }
            }
            var p = r(n(97)),
                m = p.isCommutative,
                d = p.isAssociative,
                v = p.allChildren,
                g = p.createMakeNodeFunction,
                y = o.expression.node.ConstantNode,
                w = o.expression.node.OperatorNode,
                x = i({
                    Fraction: l,
                    number: function (e) {
                        return e < 0 ? c(new y(-e)) : new y(e)
                    },
                    BigNumber: function (e) {
                        return e < 0 ? c(new y(e.negated().toString(), "number")) : new y(e.toString(), "number")
                    },
                    Complex: function (e) {
                        throw "Cannot convert Complex number to Node"
                    }
                }),
                b = i({
                    string: function (e) {
                        return "BigNumber" === t.number ? o.bignumber(e) : "Fraction" === t.number ? o.fraction(e) : u(parseFloat(e))
                    },
                    Fraction: function (e) {
                        return e
                    },
                    BigNumber: function (e) {
                        return e
                    },
                    number: function (e) {
                        return u(e)
                    },
                    Complex: function (e) {
                        return 0 !== e.im ? e : u(e.re)
                    }
                });
            return a
        }
        n(2).digits, t.math = !0, t.name = "simplifyConstant", t.path = "algebra.simplify", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(0)),
                s = r(n(94)),
                u = r(n(95)),
                c = r(n(359)),
                l = r(n(68)),
                f = r(n(99)),
                h = r(n(98)),
                p = o("lusolve", {
                    "Array, Array | Matrix": function (e, t) {
                        e = a(e);
                        var n = s(e),
                            r = d(n.L, n.U, n.p, null, t);
                        return r.valueOf()
                    },
                    "DenseMatrix, Array | Matrix": function (e, t) {
                        var n = s(e);
                        return d(n.L, n.U, n.p, null, t)
                    },
                    "SparseMatrix, Array | Matrix": function (e, t) {
                        var n = s(e);
                        return d(n.L, n.U, n.p, null, t)
                    },
                    "SparseMatrix, Array | Matrix, number, number": function (e, t, n, r) {
                        var i = u(e, n, r);
                        return d(i.L, i.U, i.p, i.q, t)
                    },
                    "Object, Array | Matrix": function (e, t) {
                        return d(e.L, e.U, e.p, e.q, t)
                    }
                }),
                m = function (e) {
                    if (e && e.isMatrix === !0) return e;
                    if (i(e)) return a(e);
                    throw new TypeError("Invalid Matrix LU decomposition")
                },
                d = function (e, t, n, r, i) {
                    e = m(e), t = m(t), i = l(e, i, !1), n && (i._data = c(n, i._data));
                    var o = h(e, i),
                        a = f(t, o);
                    return r && (a._data = c(r, a._data)), a
                };
            return p
        }
        var i = Array.isArray;
        t.name = "lusolve", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(69)),
                o = r(n(358)),
                a = r(n(102)),
                s = r(n(18)),
                u = r(n(12)),
                c = r(n(56)),
                l = function (e, t) {
                    if (!t || e <= 0 || e > 3) return null;
                    var n = t._size,
                        r = n[0],
                        s = n[1],
                        u = 0,
                        c = Math.max(16, 10 * Math.sqrt(s));
                    c = Math.min(s - 2, c);
                    var l = f(e, t, r, s, c);
                    o(l, d, null);
                    for (var v, g, y, w, x, b, C, M, T, N, E, A, S, P, O, _, I = l._index, B = l._ptr, k = B[s], V = [], z = [], F = 0, D = s + 1, R = 2 * (s + 1), U = 3 * (s + 1), L = 4 * (s + 1), q = 5 * (s + 1), j = 6 * (s + 1), W = 7 * (s + 1), G = V, H = h(s, B, z, F, U, G, R, W, D, j, L, q), $ = p(s, B, z, q, L, j, c, D, U, G, R), Z = 0; $ < s;) {
                        for (y = -1; Z < s && (y = z[U + Z]) == -1; Z++);
                        z[R + y] != -1 && (G[z[R + y]] = -1), z[U + Z] = z[R + y];
                        var Y = z[L + y],
                            X = z[D + y];
                        $ += X;
                        var J = 0;
                        z[D + y] = -X;
                        var Q = B[y],
                            K = 0 === Y ? Q : k,
                            ee = K;
                        for (w = 1; w <= Y + 1; w++) {
                            for (w > Y ? (b = y, C = Q, M = z[F + y] - Y) : (b = I[Q++], C = B[b], M = z[F + b]), x = 1; x <= M; x++) v = I[C++], (T = z[D + v]) <= 0 || (J += T, z[D + v] = -T, I[ee++] = v, z[R + v] != -1 && (G[z[R + v]] = G[v]), G[v] != -1 ? z[R + G[v]] = z[R + v] : z[U + z[q + v]] = z[R + v]);
                            b != y && (B[b] = i(y), z[j + b] = 0)
                        }
                        for (0 !== Y && (k = ee), z[q + y] = J, B[y] = K, z[F + y] = ee - K, z[L + y] = -2, H = m(H, u, z, j, s), N = K; N < ee; N++)
                            if (v = I[N], !((E = z[L + v]) <= 0)) {
                                T = -z[D + v];
                                var te = H - T;
                                for (Q = B[v], A = B[v] + E - 1; Q <= A; Q++) b = I[Q], z[j + b] >= H ? z[j + b] -= T : 0 !== z[j + b] && (z[j + b] = z[q + b] + te)
                            } for (N = K; N < ee; N++) {
                            for (v = I[N], A = B[v], S = A + z[L + v] - 1, P = A, O = 0, _ = 0, Q = A; Q <= S; Q++)
                                if (b = I[Q], 0 !== z[j + b]) {
                                    var ne = z[j + b] - H;
                                    ne > 0 ? (_ += ne, I[P++] = b, O += b) : (B[b] = i(y), z[j + b] = 0)
                                } z[L + v] = P - A + 1;
                            var re = P,
                                ie = A + z[F + v];
                            for (Q = S + 1; Q < ie; Q++) {
                                g = I[Q];
                                var oe = z[D + g];
                                oe <= 0 || (_ += oe, I[P++] = g, O += g)
                            }
                            0 === _ ? (B[v] = i(y), T = -z[D + v], J -= T, X += T, $ += T, z[D + v] = 0, z[L + v] = -1) : (z[q + v] = Math.min(z[q + v], _), I[P] = I[re], I[re] = I[A], I[A] = y, z[F + v] = P - A + 1, O = (O < 0 ? -O : O) % s, z[R + v] = z[W + O], z[W + O] = v, G[v] = O)
                        }
                        for (z[q + y] = J, u = Math.max(u, J), H = m(H + u, u, z, j, s), N = K; N < ee; N++)
                            if (v = I[N], !(z[D + v] >= 0))
                                for (O = G[v], v = z[W + O], z[W + O] = -1; v != -1 && z[R + v] != -1; v = z[R + v], H++) {
                                    for (M = z[F + v], E = z[L + v], Q = B[v] + 1; Q <= B[v] + M - 1; Q++) z[j + I[Q]] = H;
                                    var ae = v;
                                    for (g = z[R + v]; g != -1;) {
                                        var se = z[F + g] === M && z[L + g] === E;
                                        for (Q = B[g] + 1; se && Q <= B[g] + M - 1; Q++) z[j + I[Q]] != H && (se = 0);
                                        se ? (B[g] = i(v), z[D + v] += z[D + g], z[D + g] = 0, z[L + g] = -1, g = z[R + g], z[R + ae] = g) : (ae = g, g = z[R + g])
                                    }
                                }
                        for (Q = K, N = K; N < ee; N++) v = I[N], (T = -z[D + v]) <= 0 || (z[D + v] = T, _ = z[q + v] + J - T, _ = Math.min(_, s - $ - T), z[U + _] != -1 && (G[z[U + _]] = v), z[R + v] = z[U + _], G[v] = -1, z[U + _] = v, Z = Math.min(Z, _), z[q + v] = _, I[Q++] = v);
                        z[D + y] = X, 0 === (z[F + y] = Q - K) && (B[y] = -1, z[j + y] = 0), 0 !== Y && (k = Q)
                    }
                    for (v = 0; v < s; v++) B[v] = i(B[v]);
                    for (g = 0; g <= s; g++) z[U + g] = -1;
                    for (g = s; g >= 0; g--) z[D + g] > 0 || (z[R + g] = z[U + B[g]], z[U + B[g]] = g);
                    for (b = s; b >= 0; b--) z[D + b] <= 0 || B[b] != -1 && (z[R + b] = z[U + B[b]], z[U + B[b]] = b);
                    for (y = 0, v = 0; v <= s; v++) B[v] == -1 && (y = a(v, y, z, U, R, V, j));
                    return V.splice(V.length - 1, 1), V
                },
                f = function (e, t, n, r, i) {
                    var o = c(t);
                    if (1 === e && r === n) return s(t, o);
                    if (2 == e) {
                        for (var a = o._index, l = o._ptr, f = 0, h = 0; h < n; h++) {
                            var p = l[h];
                            if (l[h] = f, !(l[h + 1] - p > i))
                                for (var m = l[h + 1]; p < m; p++) a[f++] = a[p]
                        }
                        return l[n] = f, t = c(o), u(o, t)
                    }
                    return u(o, t)
                },
                h = function (e, t, n, r, i, o, a, s, u, c, l, f) {
                    for (var h = 0; h < e; h++) n[r + h] = t[h + 1] - t[h];
                    n[r + e] = 0;
                    for (var p = 0; p <= e; p++) n[i + p] = -1, o[p] = -1, n[a + p] = -1, n[s + p] = -1, n[u + p] = 1, n[c + p] = 1, n[l + p] = 0, n[f + p] = n[r + p];
                    var d = m(0, 0, n, c, e);
                    return n[l + e] = -2, t[e] = -1, n[c + e] = 0, d
                },
                p = function (e, t, n, r, o, a, s, u, c, l, f) {
                    for (var h = 0, p = 0; p < e; p++) {
                        var m = n[r + p];
                        if (0 === m) n[o + p] = -2, h++, t[p] = -1, n[a + p] = 0;
                        else if (m > s) n[u + p] = 0, n[o + p] = -1, h++, t[p] = i(e), n[u + e]++;
                        else {
                            var d = n[c + m];
                            d != -1 && (l[d] = p), n[f + p] = n[c + m], n[c + m] = p
                        }
                    }
                    return h
                },
                m = function (e, t, n, r, i) {
                    if (e < 2 || e + t < 0) {
                        for (var o = 0; o < i; o++) 0 !== n[r + o] && (n[r + o] = 1);
                        e = 2
                    }
                    return e
                },
                d = function (e, t) {
                    return e != t
                };
            return l
        }
        t.name = "cs_amd", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(56)),
                o = r(n(360)),
                a = function (e, t, n, r) {
                    if (!e || !t || !n) return null;
                    var a, s, u, c, l, f, h, p = e._size,
                        m = p[0],
                        d = p[1],
                        v = 4 * d + (r ? d + m + 1 : 0),
                        g = [],
                        y = 0,
                        w = d,
                        x = 2 * d,
                        b = 3 * d,
                        C = 4 * d,
                        M = 5 * d + 1;
                    for (u = 0; u < v; u++) g[u] = -1;
                    var T = [],
                        N = i(e),
                        E = N._index,
                        A = N._ptr;
                    for (u = 0; u < d; u++)
                        for (s = n[u], T[s] = g[b + s] == -1 ? 1 : 0; s != -1 && g[b + s] == -1; s = t[s]) g[b + s] = u;
                    if (r) {
                        for (u = 0; u < d; u++) g[n[u]] = u;
                        for (a = 0; a < m; a++) {
                            for (u = d, f = A[a], h = A[a + 1], l = f; l < h; l++) u = Math.min(u, g[E[l]]);
                            g[M + a] = g[C + u], g[C + u] = a
                        }
                    }
                    for (a = 0; a < d; a++) g[y + a] = a;
                    for (u = 0; u < d; u++) {
                        for (s = n[u], t[s] != -1 && T[t[s]]--, c = r ? g[C + u] : s; c != -1; c = r ? g[M + c] : -1)
                            for (l = A[c]; l < A[c + 1]; l++) {
                                a = E[l];
                                var S = o(a, s, g, b, w, x, y);
                                S.jleaf >= 1 && T[s]++, 2 == S.jleaf && T[S.q]--
                            }
                        t[s] != -1 && (g[y + s] = t[s])
                    }
                    for (s = 0; s < d; s++) t[s] != -1 && (T[t[s]] += T[s]);
                    return T
                };
            return a
        }
        t.name = "cs_counts", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(101)),
                o = r(n(100)),
                a = r(n(367)),
                s = function (e, t, n, r, s) {
                    var u, c, l, f = t._index,
                        h = t._ptr,
                        p = t._size,
                        m = p[1],
                        d = 0;
                    for (r[0] = e; d >= 0;) {
                        e = r[d];
                        var v = s ? s[e] : e;
                        i(h, e) || (o(h, e), r[m + d] = v < 0 ? 0 : a(h[v]));
                        var g = 1;
                        for (c = r[m + d], l = v < 0 ? 0 : a(h[v + 1]); c < l; c++)
                            if (u = f[c], !i(h, u)) {
                                r[m + d] = c, r[++d] = u, g = 0;
                                break
                            } g && (d--, r[--n] = e)
                    }
                    return n
                };
            return s
        }
        t.name = "cs_dfs", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e, t) {
                if (!e) return null;
                var n, r, i = e._index,
                    o = e._ptr,
                    a = e._size,
                    s = a[0],
                    u = a[1],
                    c = [],
                    l = [],
                    f = 0,
                    h = u;
                if (t)
                    for (n = 0; n < s; n++) l[h + n] = -1;
                for (var p = 0; p < u; p++) {
                    c[p] = -1, l[f + p] = -1;
                    for (var m = o[p], d = o[p + 1], v = m; v < d; v++) {
                        var g = i[v];
                        for (n = t ? l[h + g] : g; n != -1 && n < p; n = r) r = l[f + n], l[f + n] = p, r == -1 && (c[n] = p);
                        t && (l[h + g] = p)
                    }
                }
                return c
            };
            return e
        }
        t.name = "cs_etree", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e, t, n) {
                for (var r = e._values, i = e._index, o = e._ptr, a = e._size, s = a[1], u = 0, c = 0; c < s; c++) {
                    var l = o[c];
                    for (o[c] = u; l < o[c + 1]; l++) t(i[l], c, r ? r[l] : 1, n) && (i[u] = i[l], r && (r[u] = r[l]), u++)
                }
                return o[s] = u, i.splice(u, i.length - u), r && r.splice(u, r.length - u), u
            };
            return e
        }
        t.name = "cs_fkeep", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e, t, n) {
                var r, n = t.length,
                    i = [];
                if (e)
                    for (r = 0; r < n; r++) i[e[r]] = t[r];
                else
                    for (r = 0; r < n; r++) i[r] = t[r];
                return i
            };
            return e
        }
        t.name = "cs_ipvec", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r() {
            var e = function (e, t, n, r, i, o, a) {
                var s, u, c, l, f = 0;
                if (e <= t || n[r + t] <= n[i + e]) return -1;
                if (n[i + e] = n[r + t], c = n[o + e], n[o + e] = t, c === -1) f = 1, l = e;
                else {
                    for (f = 2, l = c; l != n[a + l]; l = n[a + l]);
                    for (s = c; s != l; s = u) u = n[a + s], n[a + s] = l
                }
                return {
                    jleaf: f,
                    q: l
                }
            };
            return e
        }
        t.name = "cs_leaf", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(26)),
                o = r(n(19)),
                a = r(n(12)),
                s = r(n(28)),
                u = r(n(119)),
                c = r(n(365)),
                l = e.SparseMatrix,
                f = function (e, t, n) {
                    if (!e) return null;
                    var r, f = e._size,
                        h = f[1],
                        p = 100,
                        m = 100;
                    t && (r = t.q, p = t.lnz || p, m = t.unz || m);
                    var d, v, g = [],
                        y = [],
                        w = [],
                        x = new l({
                            values: g,
                            index: y,
                            ptr: w,
                            size: [h, h]
                        }),
                        b = [],
                        C = [],
                        M = [],
                        T = new l({
                            values: b,
                            index: C,
                            ptr: M,
                            size: [h, h]
                        }),
                        N = [],
                        E = [],
                        A = [];
                    for (d = 0; d < h; d++) E[d] = 0, N[d] = -1, w[d + 1] = 0;
                    p = 0, m = 0;
                    for (var S = 0; S < h; S++) {
                        w[S] = p, M[S] = m;
                        var P = r ? r[S] : S,
                            O = c(x, e, P, A, E, N, 1),
                            _ = -1,
                            I = -1;
                        for (v = O; v < h; v++)
                            if (d = A[v], N[d] < 0) {
                                var B = i(E[d]);
                                s(B, I) && (I = B, _ = d)
                            } else C[m] = N[d], b[m++] = E[d];
                        if (_ == -1 || I <= 0) return null;
                        N[P] < 0 && u(i(E[P]), a(I, n)) && (_ = P);
                        var k = E[_];
                        for (C[m] = S, b[m++] = k, N[_] = S, y[p] = _, g[p++] = 1, v = O; v < h; v++) d = A[v], N[d] < 0 && (y[p] = d, g[p++] = o(E[d], k)), E[d] = 0
                    }
                    for (w[h] = p, M[h] = m, v = 0; v < p; v++) y[v] = N[y[v]];
                    return g.splice(p, g.length - p), y.splice(p, y.length - p), b.splice(m, b.length - m), C.splice(m, C.length - m), {
                        L: x,
                        U: T,
                        pinv: N
                    }
                };
            return f
        }
        t.name = "cs_lu", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e) {
            var t = e.SparseMatrix,
                n = function (e, n, r, i) {
                    for (var o = e._values, a = e._index, s = e._ptr, u = e._size, c = e._datatype, l = u[0], f = u[1], h = i && e._values ? [] : null, p = [], m = [], d = 0, v = 0; v < f; v++) {
                        m[v] = d;
                        for (var g = r ? r[v] : v, y = s[g], w = s[g + 1], x = y; x < w; x++) {
                            var b = n ? n[a[x]] : a[x];
                            p[d] = b, h && (h[d] = o[x]), d++
                        }
                    }
                    return m[f] = d, new t({
                        values: h,
                        index: p,
                        ptr: m,
                        size: [l, f],
                        datatype: c
                    })
                };
            return n
        }
        t.name = "cs_permute", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(102)),
                o = function (e, t) {
                    if (!e) return null;
                    var n, r = 0,
                        o = [],
                        a = [],
                        s = 0,
                        u = t,
                        c = 2 * t;
                    for (n = 0; n < t; n++) a[s + n] = -1;
                    for (n = t - 1; n >= 0; n--) e[n] != -1 && (a[u + n] = a[s + e[n]], a[s + e[n]] = n);
                    for (n = 0; n < t; n++) e[n] == -1 && (r = i(n, r, a, s, u, o, c));
                    return o
                };
            return o
        }
        t.name = "cs_post", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(356)),
                o = r(n(101)),
                a = r(n(100)),
                s = function (e, t, n, r, s) {
                    var u, c, l, f = e._ptr,
                        h = e._size,
                        p = t._index,
                        m = t._ptr,
                        d = h[1],
                        v = d;
                    for (c = m[n], l = m[n + 1], u = c; u < l; u++) {
                        var g = p[u];
                        o(f, g) || (v = i(g, e, v, r, s))
                    }
                    for (u = v; u < d; u++) a(f, r[u]);
                    return v
                };
            return s
        }
        t.name = "cs_reach", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(19)),
                o = r(n(12)),
                a = r(n(21)),
                s = r(n(364)),
                u = function (e, t, n, r, u, c, l) {
                    var f, h, p, m, d = e._values,
                        v = e._index,
                        g = e._ptr,
                        y = e._size,
                        w = y[1],
                        x = t._values,
                        b = t._index,
                        C = t._ptr,
                        M = s(e, t, n, r, c);
                    for (f = M; f < w; f++) u[r[f]] = 0;
                    for (h = C[n], p = C[n + 1], f = h; f < p; f++) u[b[f]] = x[f];
                    for (var T = M; T < w; T++) {
                        var N = r[T],
                            E = c ? c[N] : N;
                        if (!(E < 0))
                            for (h = g[E], p = g[E + 1], u[N] = i(u[N], d[l ? h : p - 1]), f = l ? h + 1 : h, m = l ? p : p - 1; f < m; f++) {
                                var A = v[f];
                                u[A] = a(u[A], o(d[f], u[N]))
                            }
                    }
                    return M
                };
            return u
        }
        t.name = "cs_spsolve", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(354)),
                o = r(n(362)),
                a = r(n(357)),
                s = r(n(363)),
                u = r(n(355)),
                c = function (e, t, n) {
                    var r, c = t._ptr,
                        f = t._size,
                        h = f[1],
                        p = {};
                    if (p.q = i(e, t), e && !p.q) return null;
                    if (n) {
                        var m = e ? o(t, null, p.q, 0) : t;
                        p.parent = a(m, 1);
                        var d = s(p.parent, h);
                        if (p.cp = u(m, p.parent, d, 1), m && p.parent && p.cp && l(m, p))
                            for (p.unz = 0, r = 0; r < h; r++) p.unz += p.cp[r]
                    } else p.unz = 4 * c[h] + h, p.lnz = p.unz;
                    return p
                },
                l = function (e, t) {
                    var n = e._ptr,
                        r = e._index,
                        i = e._size,
                        o = i[0],
                        a = i[1];
                    t.pinv = [], t.leftmost = [];
                    var s, u, c, l, f, h = t.parent,
                        p = t.pinv,
                        m = t.leftmost,
                        d = [],
                        v = 0,
                        g = o,
                        y = o + a,
                        w = o + 2 * a;
                    for (u = 0; u < a; u++) d[g + u] = -1, d[y + u] = -1, d[w + u] = 0;
                    for (s = 0; s < o; s++) m[s] = -1;
                    for (u = a - 1; u >= 0; u--)
                        for (l = n[u], f = n[u + 1], c = l; c < f; c++) m[r[c]] = u;
                    for (s = o - 1; s >= 0; s--) p[s] = -1, u = m[s], u != -1 && (0 === d[w + u]++ && (d[y + u] = s), d[v + s] = d[g + u], d[g + u] = s);
                    for (t.lnz = 0, t.m2 = o, u = 0; u < a; u++)
                        if (s = d[g + u], t.lnz++, s < 0 && (s = t.m2++), p[s] = u, !(--w[u] <= 0)) {
                            t.lnz += d[w + u];
                            var x = h[u];
                            x != -1 && (0 === d[w + x] && (d[y + x] = d[y + u]), d[v + d[y + u]] = d[g + x], d[g + x] = d[v + s], d[w + x] += d[w + u])
                        } for (s = 0; s < o; s++) p[s] < 0 && (p[s] = u++);
                    return !0
                };
            return c
        }
        t.name = "cs_sqr", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            var i = r(n(69)),
                o = function (e) {
                    return e < 0 ? i(e) : e
                };
            return o
        }
        t.name = "cs_unflip", t.path = "sparse", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(n, r) {
                var i = n.arg() / 3,
                    a = n.abs(),
                    s = new e.Complex(o(a), 0).mul(new e.Complex(0, i).exp());
                if (r) {
                    var u = [s, new e.Complex(o(a), 0).mul(new e.Complex(0, i + 2 * Math.PI / 3).exp()), new e.Complex(o(a), 0).mul(new e.Complex(0, i - 2 * Math.PI / 3).exp())];
                    return "Array" === t.matrix ? u : f(u)
                }
                return s
            }

            function u(t) {
                if (t.value && t.value.isComplex) {
                    var n = t.clone();
                    return n.value = 1, n = n.pow(1 / 3), n.value = s(t.value), n
                }
                var r = l(t.value);
                r && (t.value = c(t.value));
                var i;
                i = t.value && t.value.isBigNumber ? new e.BigNumber(1).div(3) : t.value && t.value.isFraction ? new e.Fraction(1, 3) : 1 / 3;
                var n = t.pow(i);
                return r && (n.value = c(n.value)), n
            }
            var c = r(n(32)),
                l = r(n(50)),
                f = r(n(0)),
                h = a("cbrt", {
                    number: o,
                    Complex: s,
                    "Complex, boolean": s,
                    BigNumber: function (e) {
                        return e.cbrt()
                    },
                    Unit: u,
                    "Array | Matrix": function (e) {
                        return i(e, h, !0)
                    }
                });
            return h.toTex = {
                1: "\\sqrt[3]{${args[0]}}"
            }, h
        }
        var i = n(1),
            o = Math.cbrt || function (e) {
                if (0 === e) return e;
                var t, n = e < 0;
                return n && (e = -e), isFinite(e) ? (t = Math.exp(Math.log(e) / 3), t = (e / (t * t) + 2 * t) / 3) : t = e, n ? -t : t
            };
        t.name = "cbrt", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("ceil", {
                number: Math.ceil,
                Complex: function (e) {
                    return e.ceil()
                },
                BigNumber: function (e) {
                    return e.ceil()
                },
                Fraction: function (e) {
                    return e.ceil()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\left\\lceil${args[0]}\\right\\rceil"
            }, o
        }
        var i = n(1);
        t.name = "ceil", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("cube", {
                number: function (e) {
                    return e * e * e
                },
                Complex: function (e) {
                    return e.mul(e).mul(e)
                },
                BigNumber: function (e) {
                    return e.times(e).times(e)
                },
                Fraction: function (e) {
                    return e.pow(3)
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                },
                Unit: function (e) {
                    return e.pow(3)
                }
            });
            return o.toTex = {
                1: "\\left(${args[0]}\\right)^3"
            }, o
        }
        var i = n(1);
        t.name = "cube", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(22)),
                s = n(4),
                u = r(n(23)),
                c = r(n(135)),
                l = r(n(15)),
                f = r(n(8)),
                h = r(n(6)),
                p = i("dotMultiply", {
                    "any, any": a,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, a, !1);
                                        break;
                                    default:
                                        n = u(t, e, a, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, a, !1);
                                        break;
                                    default:
                                        n = f(e, t, a)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return p(o(e), o(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return p(o(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return p(e, o(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, a, !1);
                                break;
                            default:
                                n = h(e, t, a, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, a, !0);
                                break;
                            default:
                                n = h(t, e, a, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(o(e), t, a, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(o(t), e, a, !0).valueOf()
                    }
                });
            return p.toTex = {
                2: "\\left(${args[0]}" + s.operators.dotMultiply + "${args[1]}\\right)"
            }, p
        }
        t.name = "dotMultiply", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(39)),
                s = n(4),
                u = r(n(14)),
                c = r(n(24)),
                l = r(n(15)),
                f = r(n(16)),
                h = r(n(8)),
                p = r(n(6)),
                m = i("dotPow", {
                    "any, any": a,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, a, !1);
                                        break;
                                    default:
                                        n = u(t, e, a, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, a, !1);
                                        break;
                                    default:
                                        n = h(e, t, a)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(o(e), o(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(o(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, o(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, m, !1);
                                break;
                            default:
                                n = p(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = f(t, e, m, !0);
                                break;
                            default:
                                n = p(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return p(o(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return p(o(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + s.operators.dotPow + "${args[1]}\\right)"
            }, m
        }
        t.name = "dotPow", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("exp", {
                number: Math.exp,
                Complex: function (e) {
                    return e.exp()
                },
                BigNumber: function (e) {
                    return e.exp()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\exp\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "exp", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("floor", {
                number: Math.floor,
                Complex: function (e) {
                    return e.floor()
                },
                BigNumber: function (e) {
                    return e.floor()
                },
                Fraction: function (e) {
                    return e.floor()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\left\\lfloor${args[0]}\\right\\rfloor"
            }, o
        }
        var i = n(1);
        t.name = "floor", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(t, n) {
                if (!t.isInt() || !n.isInt()) throw new Error("Parameters in function gcd must be integer numbers");
                for (var r = new e.BigNumber(0); !n.isZero();) {
                    var i = t.mod(n);
                    t = n, n = i
                }
                return t.lt(r) ? t.neg() : t
            }
            var s = r(n(0)),
                u = r(n(29)),
                c = r(n(76)),
                l = r(n(34)),
                f = r(n(8)),
                h = r(n(6)),
                p = o("gcd", {
                    "number, number": i,
                    "BigNumber, BigNumber": a,
                    "Fraction, Fraction": function (e, t) {
                        return e.gcd(t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, p);
                                        break;
                                    default:
                                        n = u(t, e, p, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, p, !1);
                                        break;
                                    default:
                                        n = f(e, t, p)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return p(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return p(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return p(e, s(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, p, !1);
                                break;
                            default:
                                n = h(e, t, p, !1)
                        }
                        return n
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, p, !0);
                                break;
                            default:
                                n = h(t, e, p, !0)
                        }
                        return n
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return h(s(e), t, p, !1).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return h(s(t), e, p, !0).valueOf()
                    },
                    "Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber": function (e, t, n) {
                        for (var r = p(e, t), i = 0; i < n.length; i++) r = p(r, n[i]);
                        return r
                    }
                });
            return p.toTex = "\\gcd\\left(${args}\\right)", p
        }

        function i(e, t) {
            if (!o(e) || !o(t)) throw new Error("Parameters in function gcd must be integer numbers");
            for (var n; 0 != t;) n = e % t, e = t, t = n;
            return e < 0 ? -e : e
        }
        var o = n(2).isInteger;
        t.name = "gcd", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e) {
                for (var t = 0, n = 0, r = 0; r < e.length; r++) {
                    var i = s(e[r]);
                    h(n, i) ? (t = l(t, l(c(n, i), c(n, i))), t = u(t, 1), n = i) : t = u(t, p(i) ? l(c(i, n), c(i, n)) : i)
                }
                return l(n, f(t))
            }
            var s = r(n(26)),
                u = r(n(20)),
                c = r(n(19)),
                l = r(n(22)),
                f = r(n(48)),
                h = r(n(40)),
                p = r(n(51)),
                m = o("hypot", {
                    "... number | BigNumber": a,
                    Array: function (e) {
                        return m.apply(m, i(e))
                    },
                    Matrix: function (e) {
                        return m.apply(m, i(e.toArray()))
                    }
                });
            return m.toTex = "\\hypot\\left(${args}\\right)", m
        }
        var i = n(3).flatten;
        t.name = "hypot", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(26), n(18), n(20), n(368), n(369), n(370), n(38), n(103), n(371), n(372), n(373), n(104), n(374), n(375), n(376), n(378), n(105), n(379), n(380), n(12), n(381), n(382), n(39), n(383), n(106), n(48), n(384), n(21), n(32), n(385), n(386)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(t, n) {
                if (!t.isInt() || !n.isInt()) throw new Error("Parameters in function lcm must be integer numbers");
                if (t.isZero() || n.isZero()) return new e.BigNumber(0);
                for (var r = t.times(n); !n.isZero();) {
                    var i = n;
                    n = t.mod(i), t = i
                }
                return r.div(t).abs()
            }
            var s = r(n(0)),
                u = r(n(23)),
                c = r(n(60)),
                l = r(n(15)),
                f = r(n(8)),
                h = r(n(6)),
                p = o("lcm", {
                    "number, number": i,
                    "BigNumber, BigNumber": a,
                    "Fraction, Fraction": function (e, t) {
                        return e.lcm(t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, p);
                                        break;
                                    default:
                                        n = u(t, e, p, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, p, !1);
                                        break;
                                    default:
                                        n = f(e, t, p)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return p(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return p(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return p(e, s(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, p, !1);
                                break;
                            default:
                                n = h(e, t, p, !1)
                        }
                        return n
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, p, !0);
                                break;
                            default:
                                n = h(t, e, p, !0)
                        }
                        return n
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return h(s(e), t, p, !1).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return h(s(t), e, p, !0).valueOf()
                    },
                    "Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber": function (e, t, n) {
                        for (var r = p(e, t), i = 0; i < n.length; i++) r = p(r, n[i]);
                        return r
                    }
                });
            return p.toTex = void 0, p
        }

        function i(e, t) {
            if (!o(e) || !o(t)) throw new Error("Parameters in function lcm must be integer numbers");
            if (0 == e || 0 == t) return 0;
            for (var n, r = e * t; 0 != t;) n = t, t = e % n, e = n;
            return Math.abs(r / e)
        }
        var o = n(2).isInteger;
        t.name = "lcm", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("log10", {
                number: function (n) {
                    return n >= 0 || t.predictable ? o(n) : new e.Complex(n, 0).log().div(Math.LN10)
                },
                Complex: function (t) {
                    return new e.Complex(t).log().div(Math.LN10)
                },
                BigNumber: function (n) {
                    return !n.isNegative() || t.predictable ? n.log() : new e.Complex(n.toNumber(), 0).log().div(Math.LN10)
                },
                "Array | Matrix": function (e) {
                    return i(e, a)
                }
            });
            return a.toTex = {
                1: "\\log_{10}\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = Math.log10 || function (e) {
                return Math.log(e) / Math.LN10
            };
        t.name = "log10", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e, t) {
                if (t > 0) return e - t * Math.floor(e / t);
                if (0 === t) return e;
                throw new Error("Cannot calculate mod for a negative divisor")
            }
            var a = r(n(0)),
                s = n(4),
                u = r(n(23)),
                c = r(n(14)),
                l = r(n(59)),
                f = r(n(15)),
                h = r(n(16)),
                p = r(n(8)),
                m = r(n(6)),
                d = i("mod", {
                    "number, number": o,
                    "BigNumber, BigNumber": function (e, t) {
                        return t.isZero() ? e : e.mod(t)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return e.mod(t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, d, !1);
                                        break;
                                    default:
                                        n = u(t, e, d, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, d, !1);
                                        break;
                                    default:
                                        n = p(e, t, d)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return d(a(e), a(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return d(a(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return d(e, a(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, d, !1);
                                break;
                            default:
                                n = m(e, t, d, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = h(t, e, d, !0);
                                break;
                            default:
                                n = m(t, e, d, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return m(a(e), t, d, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return m(a(t), e, d, !0).valueOf()
                    }
                });
            return d.toTex = {
                2: "\\left(${args[0]}" + s.operators.mod + "${args[1]}\\right)"
            }, d
        }
        t.name = "mod", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e, t) {
                var n = e.size();
                if (1 == n.length) {
                    if (t === Number.POSITIVE_INFINITY || "inf" === t) {
                        var r = 0;
                        return e.forEach(function (e) {
                            var t = a(e);
                            h(t, r) && (r = t)
                        }, !0), r
                    }
                    if (t === Number.NEGATIVE_INFINITY || "-inf" === t) {
                        var i;
                        return e.forEach(function (e) {
                            var t = a(e);
                            i && !p(t, i) || (i = t)
                        }, !0), i || 0
                    }
                    if ("fro" === t) return o(e, 2);
                    if ("number" == typeof t && !isNaN(t)) {
                        if (!f(t, 0)) {
                            var m = 0;
                            return e.forEach(function (e) {
                                m = s(u(a(e), t), m)
                            }, !0), u(m, 1 / t)
                        }
                        return Number.POSITIVE_INFINITY
                    }
                    throw new Error("Unsupported parameter value")
                }
                if (2 == n.length) {
                    if (1 === t) {
                        var g = [],
                            y = 0;
                        return e.forEach(function (e, t) {
                            var n = t[1],
                                r = s(g[n] || 0, a(e));
                            h(r, y) && (y = r), g[n] = r
                        }, !0), y
                    }
                    if (t === Number.POSITIVE_INFINITY || "inf" === t) {
                        var w = [],
                            x = 0;
                        return e.forEach(function (e, t) {
                            var n = t[0],
                                r = s(w[n] || 0, a(e));
                            h(r, x) && (x = r), w[n] = r
                        }, !0), x
                    }
                    if ("fro" === t) return c(d(l(v(e), e)));
                    if (2 === t) throw new Error("Unsupported parameter value, missing implementation of matrix singular value decomposition");
                    throw new Error("Unsupported parameter value")
                }
            }
            var a = r(n(26)),
                s = r(n(18)),
                u = r(n(39)),
                c = r(n(48)),
                l = r(n(12)),
                f = r(n(10)),
                h = r(n(28)),
                p = r(n(40)),
                m = r(n(0)),
                d = r(n(117)),
                v = r(n(56)),
                g = i("norm", {
                    number: Math.abs,
                    Complex: function (e) {
                        return e.abs()
                    },
                    BigNumber: function (e) {
                        return e.abs()
                    },
                    "boolean | null": function (e) {
                        return Math.abs(e)
                    },
                    Array: function (e) {
                        return o(m(e), 2)
                    },
                    Matrix: function (e) {
                        return o(e, 2)
                    },
                    "number | Complex | BigNumber | boolean | null, number | BigNumber | string": function (e) {
                        return g(e)
                    },
                    "Array, number | BigNumber | string": function (e, t) {
                        return o(m(e), t)
                    },
                    "Matrix, number | BigNumber | string": function (e, t) {
                        return o(e, t)
                    }
                });
            return g.toTex = {
                1: "\\left\\|${args[0]}\\right\\|",
                2: void 0
            }, g
        }
        t.name = "norm", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(t, n) {
                var r = e.BigNumber.precision,
                    i = e.BigNumber.clone({
                        precision: r + 2
                    }),
                    o = new e.BigNumber(0),
                    a = new i(1),
                    s = n.isNegative();
                if (s && (n = n.neg()), n.isZero()) throw new Error("Root must be non-zero");
                if (t.isNegative() && !n.abs().mod(2).equals(1)) throw new Error("Root must be odd when a is negative.");
                if (t.isZero()) return s ? new i(1 / 0) : 0;
                if (!t.isFinite()) return s ? o : t;
                var u = t.abs().pow(a.div(n));
                return u = t.isNeg() ? u.neg() : u, new e.BigNumber((s ? a.div(u) : u).toPrecision(r))
            }
            var u = r(n(0)),
                c = r(n(29)),
                l = r(n(23)),
                f = r(n(60)),
                h = r(n(15)),
                p = r(n(8)),
                m = r(n(6)),
                d = a("nthRoot", {
                    number: function (e) {
                        return i(e, 2)
                    },
                    "number, number": i,
                    BigNumber: function (t) {
                        return s(t, new e.BigNumber(2))
                    },
                    Complex: function (e) {
                        return o(e, 2)
                    },
                    "Complex, number": o,
                    "BigNumber, BigNumber": s,
                    "Array | Matrix": function (e) {
                        return d(e, 2)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        if (1 !== t.density()) throw new Error("Root must be non-zero");
                                        n = f(e, t, d);
                                        break;
                                    default:
                                        n = l(t, e, d, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        if (1 !== t.density()) throw new Error("Root must be non-zero");
                                        n = c(e, t, d, !1);
                                        break;
                                    default:
                                        n = p(e, t, d)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return d(u(e), u(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return d(u(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return d(e, u(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = h(e, t, d, !1);
                                break;
                            default:
                                n = m(e, t, d, !1)
                        }
                        return n
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                if (1 !== t.density()) throw new Error("Root must be non-zero");
                                n = h(t, e, d, !0);
                                break;
                            default:
                                n = m(t, e, d, !0)
                        }
                        return n
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return d(u(e), t).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return d(e, u(t)).valueOf()
                    }
                });
            return d.toTex = {
                2: "\\sqrt[${args[1]}]{${args[0]}}"
            }, d
        }

        function i(e, t) {
            var n = t < 0;
            if (n && (t = -t), 0 === t) throw new Error("Root must be non-zero");
            if (e < 0 && Math.abs(t) % 2 != 1) throw new Error("Root must be odd when a is negative.");
            if (0 == e) return n ? 1 / 0 : 0;
            if (!isFinite(e)) return n ? 0 : e;
            var r = Math.pow(Math.abs(e), 1 / t);
            return r = e < 0 ? -r : r, n ? 1 / r : r
        }

        function o(e, t) {
            if (t < 0) throw new Error("Root must be greater than zero");
            if (0 === t) throw new Error("Root must be non-zero");
            if (t % 1 !== 0) throw new Error("Root must be an integer");
            for (var n = e.arg(), r = e.abs(), i = [], o = Math.pow(r, 1 / t), a = 0; a < t; a++) i.push({
                r: o,
                phi: (n + 2 * Math.PI * a) / t
            });
            return i
        }
        t.name = "nthRoot", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var c = r(n(0)),
                l = r(n(10)),
                f = r(n(33)),
                h = r(n(15)),
                p = r(n(16)),
                m = r(n(6)),
                d = a("round", {
                    number: Math.round,
                    "number, number": function (e, t) {
                        if (!o(t)) throw new TypeError(u);
                        if (t < 0 || t > 15) throw new Error("Number of decimals in function round must be in te range of 0-15");
                        return i(e, t)
                    },
                    Complex: function (e) {
                        return e.round()
                    },
                    "Complex, number": function (e, t) {
                        if (t % 1) throw new TypeError(u);
                        return e.round(t)
                    },
                    "Complex, BigNumber": function (e, t) {
                        if (!t.isInteger()) throw new TypeError(u);
                        var n = t.toNumber();
                        return e.round(n)
                    },
                    "number, BigNumber": function (t, n) {
                        if (!n.isInteger()) throw new TypeError(u);
                        return new e.BigNumber(t).toDecimalPlaces(n.toNumber())
                    },
                    BigNumber: function (e) {
                        return e.toDecimalPlaces(0)
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        if (!t.isInteger()) throw new TypeError(u);
                        return e.toDecimalPlaces(t.toNumber())
                    },
                    Fraction: function (e) {
                        return e.round()
                    },
                    "Fraction, number": function (e, t) {
                        if (t % 1) throw new TypeError(u);
                        return e.round(t)
                    },
                    "Array | Matrix": function (e) {
                        return s(e, d, !0)
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = h(e, t, d, !1);
                                break;
                            default:
                                n = m(e, t, d, !1)
                        }
                        return n
                    },
                    "number | Complex | BigNumber, Matrix": function (e, t) {
                        if (!l(e, 0)) {
                            var n;
                            switch (t.storage()) {
                                case "sparse":
                                    n = p(t, e, d, !0);
                                    break;
                                default:
                                    n = m(t, e, d, !0)
                            }
                            return n
                        }
                        return f(t.size(), t.storage())
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return m(c(e), t, d, !1).valueOf()
                    },
                    "number | Complex | BigNumber, Array": function (e, t) {
                        return m(c(t), e, d, !0).valueOf()
                    }
                });
            return d.toTex = {
                1: "\\left\\lfloor${args[0]}\\right\\rceil",
                2: void 0
            }, d
        }

        function i(e, t) {
            return parseFloat(a(e, t))
        }
        var o = n(2).isInteger,
            a = n(2).toFixed,
            s = n(1),
            u = "Number of decimals in function round must be an integer";
        t.name = "round", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("square", {
                number: function (e) {
                    return e * e
                },
                Complex: function (e) {
                    return e.mul(e)
                },
                BigNumber: function (e) {
                    return e.times(e)
                },
                Fraction: function (e) {
                    return e.mul(e)
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                },
                Unit: function (e) {
                    return e.pow(2)
                }
            });
            return o.toTex = {
                1: "\\left(${args[0]}\\right)^2"
            }, o
        }
        var i = n(1);
        t.name = "square", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = n(4),
                s = o("unaryPlus", {
                    number: function (e) {
                        return e
                    },
                    Complex: function (e) {
                        return e
                    },
                    BigNumber: function (e) {
                        return e
                    },
                    Fraction: function (e) {
                        return e
                    },
                    Unit: function (e) {
                        return e.clone()
                    },
                    "Array | Matrix": function (e) {
                        return i(e, s, !0)
                    },
                    "boolean | string | null": function (n) {
                        return "BigNumber" == t.number ? new e.BigNumber(+n) : +n
                    }
                });
            return s.toTex = {
                1: a.operators.unaryPlus + "\\left(${args[0]}\\right)"
            }, s
        }
        var i = n(1);
        t.name = "unaryPlus", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, n) {
                var r, o, a, s = 0,
                    c = 1,
                    l = 1,
                    f = 0;
                if (!i(e) || !i(n)) throw new Error("Parameters in function xgcd must be integer numbers");
                for (; n;) o = Math.floor(e / n), a = e - o * n, r = s, s = c - o * s, c = r, r = l, l = f - o * l, f = r, e = n, n = a;
                var h;
                return h = e < 0 ? [-e, -c, -f] : [e, e ? c : 0, f], "Array" === t.matrix ? h : u(h)
            }

            function s(n, r) {
                var i, o, a, s = new e.BigNumber(0),
                    c = new e.BigNumber(1),
                    l = s,
                    f = c,
                    h = c,
                    p = s;
                if (!n.isInt() || !r.isInt()) throw new Error("Parameters in function xgcd must be integer numbers");
                for (; !r.isZero();) o = n.div(r).floor(), a = n.mod(r), i = l, l = f.minus(o.times(l)), f = i, i = h, h = p.minus(o.times(h)), p = i, n = r, r = a;
                var m;
                return m = n.lt(s) ? [n.neg(), f.neg(), p.neg()] : [n, n.isZero() ? 0 : f, p], "Array" === t.matrix ? m : u(m)
            }
            var u = r(n(0)),
                c = o("xgcd", {
                    "number, number": a,
                    "BigNumber, BigNumber": s
                });
            return c.toTex = void 0, c
        }
        var i = n(2).isInteger;
        t.name = "xgcd", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = r(n(23)),
                l = r(n(60)),
                f = r(n(15)),
                h = r(n(8)),
                p = r(n(6)),
                m = a("bitAnd", {
                    "number, number": function (e, t) {
                        if (!i(e) || !i(t)) throw new Error("Integers expected in function bitAnd");
                        return e & t
                    },
                    "BigNumber, BigNumber": o,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, m, !1);
                                        break;
                                    default:
                                        n = c(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m, !1);
                                        break;
                                    default:
                                        n = h(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(u(e), u(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(u(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, u(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, m, !1);
                                break;
                            default:
                                n = p(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = f(t, e, m, !0);
                                break;
                            default:
                                n = p(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return p(u(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return p(u(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + s.operators.bitAnd + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).isInteger,
            o = n(503);
        t.name = "bitAnd", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s) {
            var u = n(4),
                c = s("bitNot", {
                    number: function (e) {
                        if (!a(e)) throw new Error("Integer expected in function bitNot");
                        return ~e
                    },
                    BigNumber: o,
                    "Array | Matrix": function (e) {
                        return i(e, c)
                    }
                });
            return c.toTex = {
                1: u.operators.bitNot + "\\left(${args[0]}\\right)"
            }, c
        }
        var i = n(1),
            o = n(79),
            a = n(2).isInteger;
        t.name = "bitNot", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = r(n(29)),
                l = r(n(76)),
                f = r(n(34)),
                h = r(n(8)),
                p = r(n(6)),
                m = a("bitOr", {
                    "number, number": function (e, t) {
                        if (!i(e) || !i(t)) throw new Error("Integers expected in function bitOr");
                        return e | t
                    },
                    "BigNumber, BigNumber": o,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, m);
                                        break;
                                    default:
                                        n = c(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m, !1);
                                        break;
                                    default:
                                        n = h(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(u(e), u(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(u(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, u(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, m, !1);
                                break;
                            default:
                                n = p(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = f(t, e, m, !0);
                                break;
                            default:
                                n = p(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return p(u(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return p(u(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + s.operators.bitOr + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).isInteger,
            o = n(504);
        t.name = "bitOr", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = r(n(14)),
                l = r(n(24)),
                f = r(n(16)),
                h = r(n(8)),
                p = r(n(6)),
                m = a("bitXor", {
                    "number, number": function (e, t) {
                        if (!i(e) || !i(t)) throw new Error("Integers expected in function bitXor");
                        return e ^ t
                    },
                    "BigNumber, BigNumber": o,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, m);
                                        break;
                                    default:
                                        n = c(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m, !1);
                                        break;
                                    default:
                                        n = h(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(u(e), u(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(u(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, u(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, m, !1);
                                break;
                            default:
                                n = p(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = f(t, e, m, !0);
                                break;
                            default:
                                n = p(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return p(u(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return p(u(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + s.operators.bitXor + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).isInteger,
            o = n(505);
        t.name = "bitXor", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(387), n(388), n(389), n(390), n(392), n(393), n(394)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = r(n(10)),
                l = r(n(33)),
                f = r(n(29)),
                h = r(n(23)),
                p = r(n(77)),
                m = r(n(34)),
                d = r(n(15)),
                v = r(n(8)),
                g = r(n(6)),
                y = a("leftShift", {
                    "number, number": function (e, t) {
                        if (!i(e) || !i(t)) throw new Error("Integers expected in function leftShift");
                        return e << t
                    },
                    "BigNumber, BigNumber": o,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = p(e, t, y, !1);
                                        break;
                                    default:
                                        n = h(t, e, y, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = f(e, t, y, !1);
                                        break;
                                    default:
                                        n = v(e, t, y)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return y(u(e), u(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return y(u(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return y(e, u(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        if (!c(t, 0)) {
                            var n;
                            switch (e.storage()) {
                                case "sparse":
                                    n = d(e, t, y, !1);
                                    break;
                                default:
                                    n = g(e, t, y, !1)
                            }
                            return n
                        }
                        return e.clone()
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        if (!c(e, 0)) {
                            var n;
                            switch (t.storage()) {
                                case "sparse":
                                    n = m(t, e, y, !0);
                                    break;
                                default:
                                    n = g(t, e, y, !0)
                            }
                            return n
                        }
                        return l(t.size(), t.storage())
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return y(u(e), t).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return y(e, u(t)).valueOf()
                    }
                });
            return y.toTex = {
                2: "\\left(${args[0]}" + s.operators.leftShift + "${args[1]}\\right)"
            }, y
        }
        var i = n(2).isInteger,
            o = n(507);
        t.name = "leftShift", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = n(4),
                u = r(n(0)),
                c = r(n(10)),
                l = r(n(33)),
                f = r(n(29)),
                h = r(n(23)),
                p = r(n(77)),
                m = r(n(34)),
                d = r(n(15)),
                v = r(n(8)),
                g = r(n(6)),
                y = a("rightArithShift", {
                    "number, number": function (e, t) {
                        if (!i(e) || !i(t)) throw new Error("Integers expected in function rightArithShift");
                        return e >> t
                    },
                    "BigNumber, BigNumber": o,
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = p(e, t, y, !1);
                                        break;
                                    default:
                                        n = h(t, e, y, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = f(e, t, y, !1);
                                        break;
                                    default:
                                        n = v(e, t, y)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return y(u(e), u(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return y(u(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return y(e, u(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        if (!c(t, 0)) {
                            var n;
                            switch (e.storage()) {
                                case "sparse":
                                    n = d(e, t, y, !1);
                                    break;
                                default:
                                    n = g(e, t, y, !1)
                            }
                            return n
                        }
                        return e.clone()
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        if (!c(e, 0)) {
                            var n;
                            switch (t.storage()) {
                                case "sparse":
                                    n = m(t, e, y, !0);
                                    break;
                                default:
                                    n = g(t, e, y, !0)
                            }
                            return n
                        }
                        return l(t.size(), t.storage())
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return y(u(e), t).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return y(e, u(t)).valueOf()
                    }
                });
            return y.toTex = {
                2: "\\left(${args[0]}" + s.operators.rightArithShift + "${args[1]}\\right)"
            }, y
        }
        var i = n(2).isInteger,
            o = n(508);
        t.name = "rightArithShift", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = n(4),
                s = r(n(0)),
                u = r(n(10)),
                c = r(n(33)),
                l = r(n(29)),
                f = r(n(23)),
                h = r(n(77)),
                p = r(n(34)),
                m = r(n(15)),
                d = r(n(8)),
                v = r(n(6)),
                g = o("rightLogShift", {
                    "number, number": function (e, t) {
                        if (!i(e) || !i(t)) throw new Error("Integers expected in function rightLogShift");
                        return e >>> t
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = h(e, t, g, !1);
                                        break;
                                    default:
                                        n = f(t, e, g, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, g, !1);
                                        break;
                                    default:
                                        n = d(e, t, g)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return g(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return g(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return g(e, s(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        if (!u(t, 0)) {
                            var n;
                            switch (e.storage()) {
                                case "sparse":
                                    n = m(e, t, g, !1);
                                    break;
                                default:
                                    n = v(e, t, g, !1)
                            }
                            return n
                        }
                        return e.clone()
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        if (!u(e, 0)) {
                            var n;
                            switch (t.storage()) {
                                case "sparse":
                                    n = p(t, e, g, !0);
                                    break;
                                default:
                                    n = v(t, e, g, !0)
                            }
                            return n
                        }
                        return c(t.size(), t.storage())
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return g(s(e), t).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return g(e, s(t)).valueOf()
                    }
                });
            return g.toTex = {
                2: "\\left(${args[0]}" + a.operators.rightLogShift + "${args[1]}\\right)"
            }, g
        }
        var i = n(2).isInteger;
        t.name = "rightLogShift", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(18)),
                a = r(n(107)),
                s = r(n(50)),
                u = r(n(41)),
                c = i("bellNumbers", {
                    "number | BigNumber": function (e) {
                        if (!u(e) || s(e)) throw new TypeError("Non-negative integer value expected in function bellNumbers");
                        for (var t = 0, n = 0; n <= e; n++) t = o(t, a(e, n));
                        return t
                    }
                });
            return c.toTex = {
                1: "\\mathrm{B}_{${args[0]}}"
            }, c
        }
        t.name = "bellNumbers", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(18)),
                a = r(n(38)),
                s = r(n(12)),
                u = r(n(57)),
                c = r(n(50)),
                l = r(n(41)),
                f = i("catalan", {
                    "number | BigNumber": function (e) {
                        if (!l(e) || c(e)) throw new TypeError("Non-negative integer value expected in function catalan");
                        return a(u(s(e, 2), e), o(e, 1))
                    }
                });
            return f.toTex = {
                1: "\\mathrm{C}_{${args[0]}}"
            }, f
        }
        t.name = "catalan", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(57)),
                a = r(n(20)),
                s = r(n(51)),
                u = r(n(41)),
                c = r(n(28)),
                l = i("composition", {
                    "number | BigNumber, number | BigNumber": function (e, t) {
                        if (!(u(e) && s(e) && u(t) && s(t))) throw new TypeError("Positive integer value expected in function composition");
                        if (c(t, e)) throw new TypeError("k must be less than or equal to n in function composition");
                        return o(a(e, -1), a(t, -1))
                    }
                });
            return l.toTex = void 0, l
        }
        t.name = "composition", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(395), n(397), n(107), n(396)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("arg", {
                number: function (e) {
                    return Math.atan2(0, e)
                },
                BigNumber: function (t) {
                    return e.BigNumber.atan2(0, t)
                },
                Complex: function (e) {
                    return e.arg()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\arg\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "arg", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("im", {
                number: function (e) {
                    return 0
                },
                BigNumber: function (t) {
                    return new e.BigNumber(0)
                },
                Complex: function (e) {
                    return e.im
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\Im\\left\\lbrace${args[0]}\\right\\rbrace"
            }, o
        }
        var i = n(1);
        t.name = "im", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(399), n(108), n(400), n(402)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("re", {
                number: function (e) {
                    return e
                },
                BigNumber: function (e) {
                    return e
                },
                Complex: function (e) {
                    return e.re
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\Re\\left\\lbrace${args[0]}\\right\\rbrace"
            }, o
        }
        var i = n(1);
        t.name = "re", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, s) {
            var m = (r(n(0)), s("distance", {
                "Array, Array, Array": function (e, t, n) {
                    if (2 == e.length && 2 == t.length && 2 == n.length) {
                        if (!i(e)) throw new TypeError("Array with 2 numbers expected for first argument");
                        if (!i(t)) throw new TypeError("Array with 2 numbers expected for second argument");
                        if (!i(n)) throw new TypeError("Array with 2 numbers expected for third argument");
                        var r = (n[1] - n[0]) / (t[1] - t[0]),
                            o = r * r * t[0],
                            a = -1 * (r * t[0]),
                            s = e[1];
                        return c(e[0], e[1], o, a, s)
                    }
                    throw new TypeError("Invalid Arguments: Try again")
                },
                "Object, Object, Object": function (e, t, n) {
                    if (2 == Object.keys(e).length && 2 == Object.keys(t).length && 2 == Object.keys(n).length) {
                        if (!i(e)) throw new TypeError("Values of pointX and pointY should be numbers");
                        if (!i(t)) throw new TypeError("Values of lineOnePtX and lineOnePtY should be numbers");
                        if (!i(n)) throw new TypeError("Values of lineTwoPtX and lineTwoPtY should be numbers");
                        if (e.hasOwnProperty("pointX") && e.hasOwnProperty("pointY") && t.hasOwnProperty("lineOnePtX") && t.hasOwnProperty("lineOnePtY") && n.hasOwnProperty("lineTwoPtX") && n.hasOwnProperty("lineTwoPtY")) {
                            var r = (n.lineTwoPtY - n.lineTwoPtX) / (t.lineOnePtY - t.lineOnePtX),
                                o = r * r * t.lineOnePtX,
                                a = -1 * (r * t.lineOnePtX),
                                s = e.pointX;
                            return c(e.pointX, e.pointY, o, a, s)
                        }
                        throw new TypeError("Key names do not match")
                    }
                    throw new TypeError("Invalid Arguments: Try again")
                },
                "Array, Array": function (e, t) {
                    if (2 == e.length && 3 == t.length) {
                        if (!i(e)) throw new TypeError("Array with 2 numbers expected for first argument");
                        if (!o(t)) throw new TypeError("Array with 3 numbers expected for second argument");
                        return c(e[0], e[1], t[0], t[1], t[2])
                    }
                    if (3 == e.length && 6 == t.length) {
                        if (!o(e)) throw new TypeError("Array with 3 numbers expected for first argument");
                        if (!a(t)) throw new TypeError("Array with 6 numbers expected for second argument");
                        return l(e[0], e[1], e[2], t[0], t[1], t[2], t[3], t[4], t[5])
                    }
                    if (2 == e.length && 2 == t.length) {
                        if (!i(e)) throw new TypeError("Array with 2 numbers expected for first argument");
                        if (!i(t)) throw new TypeError("Array with 2 numbers expected for second argument");
                        return f(e[0], e[1], t[0], t[1])
                    }
                    if (3 == e.length && 3 == t.length) {
                        if (!o(e)) throw new TypeError("Array with 3 numbers expected for first argument");
                        if (!o(t)) throw new TypeError("Array with 3 numbers expected for second argument");
                        return h(e[0], e[1], e[2], t[0], t[1], t[2])
                    }
                    throw new TypeError("Invalid Arguments: Try again")
                },
                "Object, Object": function (e, t) {
                    if (2 == Object.keys(e).length && 3 == Object.keys(t).length) {
                        if (!i(e)) throw new TypeError("Values of pointX and pointY should be numbers");
                        if (!o(t)) throw new TypeError("Values of xCoeffLine, yCoeffLine and constant should be numbers");
                        if (e.hasOwnProperty("pointX") && e.hasOwnProperty("pointY") && t.hasOwnProperty("xCoeffLine") && t.hasOwnProperty("yCoeffLine") && t.hasOwnProperty("yCoeffLine")) return c(e.pointX, e.pointY, t.xCoeffLine, t.yCoeffLine, t.constant);
                        throw new TypeError("Key names do not match")
                    }
                    if (3 == Object.keys(e).length && 6 == Object.keys(t).length) {
                        if (!o(e)) throw new TypeError("Values of pointX, pointY and pointZ should be numbers");
                        if (!a(t)) throw new TypeError("Values of x0, y0, z0, a, b and c should be numbers");
                        if (e.hasOwnProperty("pointX") && e.hasOwnProperty("pointY") && t.hasOwnProperty("x0") && t.hasOwnProperty("y0") && t.hasOwnProperty("z0") && t.hasOwnProperty("a") && t.hasOwnProperty("b") && t.hasOwnProperty("c")) return l(e.pointX, e.pointY, e.pointZ, t.x0, t.y0, t.z0, t.a, t.b, t.c);
                        throw new TypeError("Key names do not match")
                    }
                    if (2 == Object.keys(e).length && 2 == Object.keys(t).length) {
                        if (!i(e)) throw new TypeError("Values of pointOneX and pointOneY should be numbers");
                        if (!i(t)) throw new TypeError("Values of pointTwoX and pointTwoY should be numbers");
                        if (e.hasOwnProperty("pointOneX") && e.hasOwnProperty("pointOneY") && t.hasOwnProperty("pointTwoX") && t.hasOwnProperty("pointTwoY")) return f(e.pointOneX, e.pointOneY, t.pointTwoX, t.pointTwoY);
                        throw new TypeError("Key names do not match")
                    }
                    if (3 == Object.keys(e).length && 3 == Object.keys(t).length) {
                        if (!o(e)) throw new TypeError("Values of pointOneX, pointOneY and pointOneZ should be numbers");
                        if (!o(t)) throw new TypeError("Values of pointTwoX, pointTwoY and pointTwoZ should be numbers");
                        if (e.hasOwnProperty("pointOneX") && e.hasOwnProperty("pointOneY") && e.hasOwnProperty("pointOneZ") && t.hasOwnProperty("pointTwoX") && t.hasOwnProperty("pointTwoY") && t.hasOwnProperty("pointTwoZ")) return h(e.pointOneX, e.pointOneY, e.pointOneZ, t.pointTwoX, t.pointTwoY, t.pointTwoZ);
                        throw new TypeError("Key names do not match")
                    }
                    throw new TypeError("Invalid Arguments: Try again")
                },
                Array: function (e) {
                    if (!u(e)) throw new TypeError("Incorrect array format entered for pairwise distance calculation");
                    return p(e)
                }
            }));
            return m
        }

        function i(e) {
            return e.constructor !== Array && (e = s(e)), "number" == typeof e[0] && "number" == typeof e[1]
        }

        function o(e) {
            return e.constructor !== Array && (e = s(e)), "number" == typeof e[0] && "number" == typeof e[1] && "number" == typeof e[2]
        }

        function a(e) {
            return e.constructor !== Array && (e = s(e)), "number" == typeof e[0] && "number" == typeof e[1] && "number" == typeof e[2] && "number" == typeof e[3] && "number" == typeof e[4] && "number" == typeof e[5]
        }

        function s(e) {
            for (var t = Object.keys(e), n = [], r = 0; r < t.length; r++) n.push(e[t[r]]);
            return n
        }

        function u(e) {
            if (2 == e[0].length && "number" == typeof e[0][0] && "number" == typeof e[0][1]) {
                for (var t in e)
                    if (2 != e[t].length || "number" != typeof e[t][0] || "number" != typeof e[t][1]) return !1
            } else {
                if (3 != e[0].length || "number" != typeof e[0][0] || "number" != typeof e[0][1] || "number" != typeof e[0][2]) return !1;
                for (var t in e)
                    if (3 != e[t].length || "number" != typeof e[t][0] || "number" != typeof e[t][1] || "number" != typeof e[t][2]) return !1
            }
            return !0
        }

        function c(e, t, n, r, i) {
            var o = Math.abs(n * e + r * t + i),
                a = Math.pow(n * n + r * r, .5),
                s = o / a;
            return s
        }

        function l(e, t, n, r, i, o, a, s, u) {
            var c = [(i - t) * u - (o - n) * s, (o - n) * a - (r - e) * u, (r - e) * s - (i - t) * a];
            c = Math.pow(c[0] * c[0] + c[1] * c[1] + c[2] * c[2], .5);
            var l = Math.pow(a * a + s * s + u * u, .5),
                f = c / l;
            return f
        }

        function f(e, t, n, r) {
            var i = r - t,
                o = n - e,
                a = i * i + o * o,
                s = Math.pow(a, .5);
            return s
        }

        function h(e, t, n, r, i, o) {
            var a = o - n,
                s = i - t,
                u = r - e,
                c = a * a + s * s + u * u,
                l = Math.pow(c, .5);
            return l
        }

        function p(e) {
            for (var t = [], n = 0; n < e.length - 1; n++)
                for (var r = n + 1; r < e.length; r++) 2 == e[0].length ? t.push(f(e[n][0], e[n][1], e[r][0], e[r][1])) : 3 == e[0].length && t.push(h(e[n][0], e[n][1], e[n][2], e[r][0], e[r][1], e[r][2]));
            return t
        }
        t.name = "distance", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(405), n(403)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e) {
                return 2 === e.length && "number" == typeof e[0] && "number" == typeof e[1]
            }

            function a(e) {
                return 3 === e.length && "number" == typeof e[0] && "number" == typeof e[1] && "number" == typeof e[2]
            }

            function s(e) {
                return 4 === e.length && "number" == typeof e[0] && "number" == typeof e[1] && "number" == typeof e[2] && "number" == typeof e[3]
            }

            function u(e, n, r, i) {
                var o = e,
                    a = r,
                    s = d(o, n),
                    u = d(a, i),
                    c = s[0] * u[1] - u[0] * s[1];
                if (f(c) < t.epsilon) return null;
                var l = (u[0] * o[1] - u[1] * o[0] - u[0] * a[1] + u[1] * a[0]) / c;
                return h(m(s, l), o)
            }

            function c(e, t, n, r, i, o, a, s, u, c, l, f) {
                var h = (e - a) * (c - a) + (t - s) * (l - s) + (n - u) * (f - u),
                    p = (c - a) * (r - e) + (l - s) * (i - t) + (f - u) * (o - n),
                    m = (e - a) * (r - e) + (t - s) * (i - t) + (n - u) * (o - n),
                    d = (c - a) * (c - a) + (l - s) * (l - s) + (f - u) * (f - u),
                    v = (r - e) * (r - e) + (i - t) * (i - t) + (o - n) * (o - n),
                    g = (h * p - m * d) / (v * d - p * p),
                    y = (h + g * p) / d,
                    w = e + g * (r - e),
                    x = t + g * (i - t),
                    b = n + g * (o - n),
                    C = a + y * (c - a),
                    M = s + y * (l - s),
                    T = u + y * (f - u);
                return w === C && x === M && b === T ? [w, x, b] : null
            }

            function l(e, t, n, r, i, o, a, s, u, c) {
                var l = (c - e * a - t * s - n * u) / (r * a + i * s + o * u - e * a - t * s - n * u),
                    f = e + l * (r - e),
                    h = t + l * (i - t),
                    p = n + l * (o - n);
                return [f, h, p]
            }
            var f = r(n(26)),
                h = r(n(18)),
                p = r(n(0)),
                m = r(n(12)),
                d = r(n(21)),
                v = i("intersect", {
                    "Array, Array, Array": function (e, t, n) {
                        if (!a(e)) throw new TypeError("Array with 3 numbers expected for first argument");
                        if (!a(t)) throw new TypeError("Array with 3 numbers expected for second argument");
                        if (!s(n)) throw new TypeError("Array with 4 numbers expected as third argument");
                        return l(e[0], e[1], e[2], t[0], t[1], t[2], n[0], n[1], n[2], n[3])
                    },
                    "Array, Array, Array, Array": function (e, t, n, r) {
                        if (2 === e.length) {
                            if (!o(e)) throw new TypeError("Array with 2 numbers expected for first argument");
                            if (!o(t)) throw new TypeError("Array with 2 numbers expected for second argument");
                            if (!o(n)) throw new TypeError("Array with 2 numbers expected for third argument");
                            if (!o(r)) throw new TypeError("Array with 2 numbers expected for fourth argument");
                            return u(e, t, n, r)
                        }
                        if (3 === e.length) {
                            if (!a(e)) throw new TypeError("Array with 3 numbers expected for first argument");
                            if (!a(t)) throw new TypeError("Array with 3 numbers expected for second argument");
                            if (!a(n)) throw new TypeError("Array with 3 numbers expected for third argument");
                            if (!a(r)) throw new TypeError("Array with 3 numbers expected for fourth argument");
                            return c(e[0], e[1], e[2], t[0], t[1], t[2], n[0], n[1], n[2], r[0], r[1], r[2])
                        }
                        throw new TypeError("Arrays with two or thee dimensional points expected")
                    },
                    "Matrix, Matrix, Matrix": function (e, t, n) {
                        return p(v(e.valueOf(), t.valueOf(), n.valueOf()))
                    },
                    "Matrix, Matrix, Matrix, Matrix": function (e, t, n, r) {
                        return p(v(e.valueOf(), t.valueOf(), n.valueOf(), r.valueOf()))
                    }
                });
            return v
        }
        t.name = "intersect", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(351), n(377), n(391), n(398), n(401), n(404), n(408), n(415), n(423), n(432), n(435), n(436), n(442), n(462), n(469), n(471)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = n(4),
                a = r(n(0)),
                s = r(n(33)),
                u = r(n(109)),
                c = (r(n(74)), r(n(23))),
                l = r(n(60)),
                f = r(n(15)),
                h = r(n(8)),
                p = r(n(6)),
                m = i("and", {
                    "number, number": function (e, t) {
                        return !(!e || !t)
                    },
                    "Complex, Complex": function (e, t) {
                        return !(0 === e.re && 0 === e.im || 0 === t.re && 0 === t.im)
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        return !(e.isZero() || t.isZero() || e.isNaN() || t.isNaN())
                    },
                    "Unit, Unit": function (e, t) {
                        return m(e.value, t.value)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = l(e, t, m, !1);
                                        break;
                                    default:
                                        n = c(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m, !1);
                                        break;
                                    default:
                                        n = h(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(a(e), a(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(a(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, a(t))
                    },
                    "Matrix, any": function (e, t) {
                        if (u(t)) return s(e.size(), e.storage());
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = f(e, t, m, !1);
                                break;
                            default:
                                n = p(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        if (u(e)) return s(e.size(), e.storage());
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = f(t, e, m, !0);
                                break;
                            default:
                                n = p(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return m(a(e), t).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return m(e, a(t)).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + o.operators.and + "${args[1]}\\right)"
            }, m
        }
        t.name = "and", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(407), n(109), n(409), n(410)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = n(4),
                a = r(n(0)),
                s = r(n(14)),
                u = r(n(59)),
                c = r(n(16)),
                l = r(n(8)),
                f = r(n(6)),
                h = i("or", {
                    "number, number": function (e, t) {
                        return !(!e && !t)
                    },
                    "Complex, Complex": function (e, t) {
                        return 0 !== e.re || 0 !== e.im || 0 !== t.re || 0 !== t.im
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        return !e.isZero() && !e.isNaN() || !t.isZero() && !t.isNaN()
                    },
                    "Unit, Unit": function (e, t) {
                        return h(e.value, t.value)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, h);
                                        break;
                                    default:
                                        n = s(t, e, h, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = s(e, t, h, !1);
                                        break;
                                    default:
                                        n = l(e, t, h)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return h(a(e), a(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return h(a(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return h(e, a(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = c(e, t, h, !1);
                                break;
                            default:
                                n = f(e, t, h, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = c(t, e, h, !0);
                                break;
                            default:
                                n = f(t, e, h, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return f(a(e), t, h, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return f(a(t), e, h, !0).valueOf()
                    }
                });
            return h.toTex = {
                2: "\\left(${args[0]}" + o.operators.or + "${args[1]}\\right)"
            }, h
        }
        t.name = "or", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = n(4),
                a = r(n(0)),
                s = r(n(14)),
                u = r(n(24)),
                c = r(n(16)),
                l = r(n(8)),
                f = r(n(6)),
                h = i("xor", {
                    "number, number": function (e, t) {
                        return !!(!!e ^ !!t)
                    },
                    "Complex, Complex": function (e, t) {
                        return (0 !== e.re || 0 !== e.im) != (0 !== t.re || 0 !== t.im)
                    },
                    "BigNumber, BigNumber": function (e, t) {
                        return (!e.isZero() && !e.isNaN()) != (!t.isZero() && !t.isNaN())
                    },
                    "Unit, Unit": function (e, t) {
                        return h(e.value, t.value)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, h);
                                        break;
                                    default:
                                        n = s(t, e, h, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = s(e, t, h, !1);
                                        break;
                                    default:
                                        n = l(e, t, h)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return h(a(e), a(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return h(a(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return h(e, a(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = c(e, t, h, !1);
                                break;
                            default:
                                n = f(e, t, h, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = c(t, e, h, !0);
                                break;
                            default:
                                n = f(t, e, h, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return f(a(e), t, h, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return f(a(t), e, h, !0).valueOf()
                    }
                });
            return h.toTex = {
                2: "\\left(${args[0]}" + o.operators.xor + "${args[1]}\\right)"
            }, h
        }
        t.name = "xor", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t) {
                var n = Math.max(i.size(e).length, i.size(t).length);
                e = i.squeeze(e), t = i.squeeze(t);
                var r = i.size(e),
                    o = i.size(t);
                if (1 != r.length || 1 != o.length || 3 != r[0] || 3 != o[0]) throw new RangeError("Vectors with length 3 expected (Size A = [" + r.join(", ") + "], B = [" + o.join(", ") + "])");
                var a = [u(c(e[1], t[2]), c(e[2], t[1])), u(c(e[2], t[0]), c(e[0], t[2])), u(c(e[0], t[1]), c(e[1], t[0]))];
                return n > 1 ? [a] : a
            }
            var s = r(n(0)),
                u = r(n(21)),
                c = r(n(12)),
                l = o("cross", {
                    "Matrix, Matrix": function (e, t) {
                        return s(a(e.toArray(), t.toArray()))
                    },
                    "Matrix, Array": function (e, t) {
                        return s(a(e.toArray(), t))
                    },
                    "Array, Matrix": function (e, t) {
                        return s(a(e, t.toArray()))
                    },
                    "Array, Array": a
                });
            return l.toTex = {
                2: "\\left(${args[0]}\\right)\\times\\left(${args[1]}\\right)"
            }, l
        }
        var i = n(3);
        t.name = "cross", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(e, t, n, r) {
                if (!o(t)) throw new TypeError("Second parameter in function diag must be an integer");
                var i = t > 0 ? t : 0,
                    a = t < 0 ? -t : 0;
                switch (n.length) {
                    case 1:
                        return u(e, t, r, n[0], a, i);
                    case 2:
                        return c(e, t, r, n, a, i)
                }
                throw new RangeError("Matrix for function diag must be 2 dimensional")
            }

            function u(t, n, r, i, o, a) {
                var s = [i + o, i + a],
                    u = e.Matrix.storage(r || "dense"),
                    c = u.diagonal(s, t, n);
                return null !== r ? c : c.valueOf()
            }

            function c(e, t, n, r, i, o) {
                if (e && e.isMatrix === !0) {
                    var a = e.diagonal(t);
                    return null !== n ? n !== a.storage() ? l(a, n) : a : a.valueOf()
                }
                for (var s = Math.min(r[0] - i, r[1] - o), u = [], c = 0; c < s; c++) u[c] = e[c + i][c + o];
                return null !== n ? l(u) : u
            }
            var l = r(n(0)),
                f = a("diag", {
                    Array: function (e) {
                        return s(e, 0, i.size(e), null)
                    },
                    "Array, number": function (e, t) {
                        return s(e, t, i.size(e), null)
                    },
                    "Array, BigNumber": function (e, t) {
                        return s(e, t.toNumber(), i.size(e), null)
                    },
                    "Array, string": function (e, t) {
                        return s(e, 0, i.size(e), t)
                    },
                    "Array, number, string": function (e, t, n) {
                        return s(e, t, i.size(e), n)
                    },
                    "Array, BigNumber, string": function (e, t, n) {
                        return s(e, t.toNumber(), i.size(e), n)
                    },
                    Matrix: function (e) {
                        return s(e, 0, e.size(), e.storage())
                    },
                    "Matrix, number": function (e, t) {
                        return s(e, t, e.size(), e.storage())
                    },
                    "Matrix, BigNumber": function (e, t) {
                        return s(e, t.toNumber(), e.size(), e.storage())
                    },
                    "Matrix, string": function (e, t) {
                        return s(e, 0, e.size(), t)
                    },
                    "Matrix, number, string": function (e, t, n) {
                        return s(e, t, e.size(), n)
                    },
                    "Matrix, BigNumber, string": function (e, t, n) {
                        return s(e, t.toNumber(), e.size(), n)
                    }
                });
            return f.toTex = void 0, f
        }
        var i = n(3),
            o = (n(5).clone, n(2).isInteger);
        t.name = "diag", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t) {
                var n = i(e),
                    r = i(t),
                    o = n[0];
                if (1 !== n.length || 1 !== r.length) throw new RangeError("Vector expected");
                if (n[0] != r[0]) throw new RangeError("Vectors must have equal length (" + n[0] + " != " + r[0] + ")");
                if (0 == o) throw new RangeError("Cannot calculate the dot product of empty vectors");
                for (var a = 0, c = 0; c < o; c++) a = s(a, u(e[c], t[c]));
                return a
            }
            var s = r(n(18)),
                u = r(n(12)),
                c = o("dot", {
                    "Matrix, Matrix": function (e, t) {
                        return a(e.toArray(), t.toArray())
                    },
                    "Matrix, Array": function (e, t) {
                        return a(e.toArray(), t)
                    },
                    "Array, Matrix": function (e, t) {
                        return a(e, t.toArray())
                    },
                    "Array, Array": a
                });
            return c.toTex = {
                2: "\\left(${args[0]}\\cdot${args[1]}\\right)"
            }, c
        }
        var i = n(3).size;
        t.name = "dot", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = a("flatten", {
                    Array: function (e) {
                        return o(i(e))
                    },
                    Matrix: function (e) {
                        var t = o(i(e.toArray()));
                        return s(t)
                    }
                });
            return u.toTex = void 0, u
        }
        var i = n(5).clone,
            o = n(3).flatten;
        t.name = "flatten", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(110), n(411), n(111), n(412), n(413), n(54), n(112), n(414), n(113), n(114), n(416), n(115), n(417), n(70), n(116), n(418), n(419), n(420), n(421), n(422), n(55), n(117), n(56), n(33)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e, t) {
                if (1 === i(e).length && (e = [e]), 1 === i(t).length && (t = [t]), i(e).length > 2 || i(t).length > 2) throw new RangeError("Vectors with dimensions greater then 2 are not supported expected (Size x = " + JSON.stringify(e.length) + ", y = " + JSON.stringify(t.length) + ")");
                var n = [],
                    r = [];
                return e.map(function (e) {
                    return t.map(function (t) {
                        return e.map(function (e) {
                            return t.map(function (t) {
                                return r.push(u(e, t))
                            })
                        }, n.push(r = []))
                    })
                }, n = []) && n
            }
            var s = r(n(0)),
                u = r(n(22)),
                c = o("kron", {
                    "Matrix, Matrix": function (e, t) {
                        return s(a(e.toArray(), t.toArray()))
                    },
                    "Matrix, Array": function (e, t) {
                        return s(a(e.toArray(), t))
                    },
                    "Array, Matrix": function (e, t) {
                        return s(a(e, t.toArray()))
                    },
                    "Array, Array": a
                });
            return c
        }
        var i = n(3).size;
        t.name = "kron", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            function s(t, n) {
                var r = u(t),
                    i = r ? new e.BigNumber(1) : 1;
                if (c(t), n) {
                    var a = l(n);
                    return t.length > 0 ? a.resize(t, i) : a
                }
                var s = [];
                return t.length > 0 ? o(s, t, i) : s
            }

            function u(e) {
                var t = !1;
                return e.forEach(function (e, n, r) {
                    e && e.isBigNumber === !0 && (t = !0, r[n] = e.toNumber())
                }), t
            }

            function c(e) {
                e.forEach(function (e) {
                    if ("number" != typeof e || !i(e) || e < 0) throw new Error("Parameters in function ones must be positive integers")
                })
            }
            var l = r(n(0)),
                f = a("ones", {
                    "": function () {
                        return "Array" === t.matrix ? s([]) : s([], "default")
                    },
                    "...number | BigNumber | string": function (e) {
                        var n = e[e.length - 1];
                        if ("string" == typeof n) {
                            var r = e.pop();
                            return s(e, r)
                        }
                        return "Array" === t.matrix ? s(e) : s(e, "default")
                    },
                    Array: s,
                    Matrix: function (e) {
                        var t = e.storage();
                        return s(e.valueOf(), t)
                    },
                    "Array | Matrix, string": function (e, t) {
                        return s(e.valueOf(), t)
                    }
                });
            return f.toTex = void 0, f
        }
        var i = n(2).isInteger,
            o = n(3).resize;
        t.name = "ones", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = a("reshape", {
                    "Matrix, Array": function (e, t) {
                        return e.reshape ? e.reshape(t) : s(o.reshape(e.valueOf(), t))
                    },
                    "Array, Array": function (e, t) {
                        return t.forEach(function (e) {
                            if (!i(e)) throw new TypeError("Invalid size for dimension: " + e)
                        }), o.reshape(e, t)
                    }
                });
            return u.toTex = void 0, u
        }
        var i = (n(9), n(2).isInteger),
            o = n(3);
        t.name = "reshape", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, l) {
            function f(e, t, n) {
                if (void 0 !== n) {
                    if ("string" != typeof n || 1 !== n.length) throw new TypeError("Single character expected as defaultValue")
                } else n = " ";
                if (1 !== t.length) throw new i(t.length, 1);
                var r = t[0];
                if ("number" != typeof r || !a(r)) throw new TypeError("Invalid size, must contain positive integers (size: " + s(t) + ")");
                if (e.length > r) return e.substring(0, r);
                if (e.length < r) {
                    for (var o = e, u = 0, c = r - e.length; u < c; u++) o += n;
                    return o
                }
                return e
            }
            var h = r(n(0)),
                p = function (e, n, r) {
                    if (2 != arguments.length && 3 != arguments.length) throw new o("resize", arguments.length, 2, 3);
                    if (n && n.isMatrix === !0 && (n = n.valueOf()), n.length && n[0] && n[0].isBigNumber === !0 && (n = n.map(function (e) {
                            return e && e.isBigNumber === !0 ? e.toNumber() : e
                        })), e && e.isMatrix === !0) return e.resize(n, r, !0);
                    if ("string" == typeof e) return f(e, n, r);
                    var i = !Array.isArray(e) && "Array" !== t.matrix;
                    if (0 == n.length) {
                        for (; Array.isArray(e);) e = e[0];
                        return u(e)
                    }
                    Array.isArray(e) || (e = [e]), e = u(e);
                    var a = c.resize(e, n, r);
                    return i ? h(a) : a
                };
            return p.toTex = void 0, p
        }
        var i = n(9),
            o = n(43),
            a = n(2).isInteger,
            s = n(11).format,
            u = n(5).clone,
            c = n(3);
        t.name = "resize", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(0)),
                s = o("size", {
                    Matrix: function (e) {
                        return a(e.size())
                    },
                    Array: i.size,
                    string: function (e) {
                        return "Array" === t.matrix ? [e.length] : a([e.length])
                    },
                    "number | Complex | BigNumber | Unit | boolean | null": function (e) {
                        return "Array" === t.matrix ? [] : a([])
                    }
                });
            return s.toTex = void 0, s
        }
        var i = n(3);
        t.name = "size", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e) {
                if ("asc" === e) return l;
                if ("desc" === e) return f;
                throw new Error('String "asc" or "desc" expected')
            }

            function s(e) {
                if (1 !== i(e).length) throw new Error("One dimensional array expected")
            }

            function u(e) {
                if (1 !== e.size().length) throw new Error("One dimensional matrix expected")
            }
            var c = r(n(0)),
                l = r(n(49)),
                f = function (e, t) {
                    return -l(e, t)
                },
                h = o("sort", {
                    Array: function (e) {
                        return s(e), e.sort(l)
                    },
                    Matrix: function (e) {
                        return u(e), c(e.toArray().sort(l), e.storage())
                    },
                    "Array, function": function (e, t) {
                        return s(e), e.sort(t)
                    },
                    "Matrix, function": function (e, t) {
                        return u(e), c(e.toArray().sort(t), e.storage())
                    },
                    "Array, string": function (e, t) {
                        return s(e), e.sort(a(t))
                    },
                    "Matrix, string": function (e, t) {
                        return u(e), c(e.toArray().sort(a(t)), e.storage())
                    }
                });
            return h.toTex = void 0, h
        }
        var i = n(3).size;
        t.name = "sort", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = a("squeeze", {
                    Array: function (e) {
                        return o.squeeze(i.clone(e))
                    },
                    Matrix: function (e) {
                        var t = o.squeeze(e.toArray());
                        return Array.isArray(t) ? s(t) : t
                    },
                    any: function (e) {
                        return i.clone(e)
                    }
                });
            return u.toTex = void 0, u
        }
        var i = n(5),
            o = n(3);
        t.name = "squeeze", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(57), n(58), n(118), n(424), n(425), n(426), n(427), n(428), n(429)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e, t) {
                var n = t.size().length,
                    r = e.size().length;
                if (n > 1) throw new Error("first object must be one dimensional");
                if (r > 1) throw new Error("second object must be one dimensional");
                if (n !== r) throw new Error("Length of two vectors must be equal");
                var i = u(e);
                if (0 === i) throw new Error("Sum of elements in first object must be non zero");
                var o = u(t);
                if (0 === o) throw new Error("Sum of elements in second object must be non zero");
                var a = s(e, u(e)),
                    p = s(t, u(t)),
                    m = u(c(a, f(l(a, p))));
                return h(m) ? m : Number.NaN
            }
            var a = r(n(0)),
                s = r(n(38)),
                u = r(n(125)),
                c = r(n(12)),
                l = r(n(103)),
                f = r(n(105)),
                h = r(n(73)),
                p = i("kldivergence", {
                    "Array, Array": function (e, t) {
                        return o(a(e), a(t))
                    },
                    "Matrix, Array": function (e, t) {
                        return o(e, a(t))
                    },
                    "Array, Matrix": function (e, t) {
                        return o(a(e), t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        return o(e, t)
                    }
                });
            return p
        }
        t.name = "kldivergence", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = r(n(18)),
                s = r(n(12)),
                u = r(n(38)),
                c = r(n(58)),
                l = r(n(41)),
                f = r(n(51));
            return o("multinomial", {
                "Array | Matrix": function (e) {
                    var t = 0,
                        n = 1;
                    return i(e, function (e) {
                        if (!l(e) || !f(e)) throw new TypeError("Positive integer value expected in function multinomial");
                        t = a(t, e), n = s(n, c(e))
                    }), u(c(t), n)
                }
            })
        }
        var i = n(36);
        t.name = "multinomial", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(58)),
                u = a("permutations", {
                    "number | BigNumber": s,
                    "number, number": function (e, t) {
                        var n, r;
                        if (!o(e) || e < 0) throw new TypeError("Positive integer value expected in function permutations");
                        if (!o(t) || t < 0) throw new TypeError("Positive integer value expected in function permutations");
                        if (t > e) throw new TypeError("second argument k must be less than or equal to first argument n");
                        for (n = 1, r = e - t + 1; r <= e; r++) n *= r;
                        return n
                    },
                    "BigNumber, BigNumber": function (t, n) {
                        var r, o;
                        if (!i(t) || !i(n)) throw new TypeError("Positive integer value expected in function permutations");
                        if (n.gt(t)) throw new TypeError("second argument k must be less than or equal to first argument n");
                        for (r = new e.BigNumber(1), o = t.minus(n).plus(1); o.lte(t); o = o.plus(1)) r = r.times(o);
                        return r
                    }
                });
            return u.toTex = void 0, u
        }

        function i(e) {
            return e.isInteger() && e.gte(0)
        }
        var o = n(2).isInteger;
        t.name = "permutations", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(71)),
                a = o("uniform").pickRandom;
            return a.toTex = void 0, a
        }
        t.name = "pickRandom", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(71)),
                a = o("uniform").random;
            return a.toTex = void 0, a
        }
        t.name = "random", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(71)),
                a = o("uniform").randomInt;
            return a.toTex = void 0, a
        }
        t.name = "randomInt", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r, a) {
            function s(e) {
                c = null === e ? o : i(String(e))
            }

            function u() {
                return c()
            }
            var c;
            return s(t.randomSeed), a.on("config", function (e, t, n) {
                void 0 !== n.randomSeed && s(e.randomSeed)
            }), u
        }
        var i = n(515),
            o = i();
        t.factory = r, t.math = !0
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e, t) {
                if (Array.isArray(e)) {
                    if (Array.isArray(t)) {
                        var n = e.length;
                        if (n !== t.length) return !1;
                        for (var r = 0; r < n; r++)
                            if (!o(e[r], t[r])) return !1;
                        return !0
                    }
                    return !1
                }
                return !Array.isArray(t) && a(e, t)
            }
            var a = r(n(72)),
                s = i("deepEqual", {
                    "any, any": function (e, t) {
                        return o(e.valueOf(), t.valueOf())
                    }
                });
            return s.toTex = void 0, s
        }
        t.name = "deepEqual", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(49), n(431), n(72), n(28), n(119), n(40), n(433), n(120)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, a) {
            var s = r(n(0)),
                u = r(n(14)),
                c = r(n(24)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = n(4),
                m = a("smallerEq", {
                    "boolean, boolean": function (e, t) {
                        return e <= t
                    },
                    "number, number": function (e, n) {
                        return e <= n || i(e, n, t.epsilon)
                    },
                    "BigNumber, BigNumber": function (e, n) {
                        return e.lte(n) || o(e, n, t.epsilon)
                    },
                    "Fraction, Fraction": function (e, t) {
                        return 1 !== e.compare(t)
                    },
                    "Complex, Complex": function () {
                        throw new TypeError("No ordering relation is defined for complex numbers")
                    },
                    "Unit, Unit": function (e, t) {
                        if (!e.equalBase(t)) throw new Error("Cannot compare units with different base");
                        return m(e.value, t.value)
                    },
                    "string, string": function (e, t) {
                        return e <= t
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = c(e, t, m);
                                        break;
                                    default:
                                        n = u(t, e, m, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, m, !1);
                                        break;
                                    default:
                                        n = f(e, t, m)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return m(s(e), s(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return m(s(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return m(e, s(t))
                    },
                    "Matrix, any": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = l(e, t, m, !1);
                                break;
                            default:
                                n = h(e, t, m, !1)
                        }
                        return n
                    },
                    "any, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, m, !0);
                                break;
                            default:
                                n = h(t, e, m, !0)
                        }
                        return n
                    },
                    "Array, any": function (e, t) {
                        return h(s(e), t, m, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return h(s(t), e, m, !0).valueOf()
                    }
                });
            return m.toTex = {
                2: "\\left(${args[0]}" + p.operators.smallerEq + "${args[1]}\\right)"
            }, m
        }
        var i = n(2).nearlyEqual,
            o = n(35);
        t.name = "smallerEq", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function f(e) {
                var t, n = e * e,
                    r = u[0][4] * n,
                    i = n;
                for (t = 0; t < 3; t += 1) r = (r + u[0][t]) * n, i = (i + c[0][t]) * n;
                return e * (r + u[0][3]) / (i + c[0][3])
            }

            function h(e) {
                var t, n = u[1][8] * e,
                    r = e;
                for (t = 0; t < 7; t += 1) n = (n + u[1][t]) * e, r = (r + c[1][t]) * e;
                var i = (n + u[1][7]) / (r + c[1][7]),
                    o = parseInt(16 * e) / 16,
                    a = (e - o) * (e + o);
                return Math.exp(-o * o) * Math.exp(-a) * i
            }

            function p(e) {
                var t, n = 1 / (e * e),
                    r = u[2][5] * n,
                    i = n;
                for (t = 0; t < 4; t += 1) r = (r + u[2][t]) * n, i = (i + c[2][t]) * n;
                var o = n * (r + u[2][4]) / (i + c[2][4]);
                o = (s - o) / e, n = parseInt(16 * e) / 16;
                var a = (e - n) * (e + n);
                return Math.exp(-n * n) * Math.exp(-a) * o
            }
            var m = r("erf", {
                number: function (e) {
                    var t = Math.abs(e);
                    return t >= l ? o(e) : t <= a ? o(e) * f(t) : t <= 4 ? o(e) * (1 - h(t)) : o(e) * (1 - p(t))
                },
                BigNumber: function (t) {
                    return new e.BigNumber(m(t.toNumber()))
                },
                "Array | Matrix": function (e) {
                    return i(e, m)
                }
            });
            return m.toTex = {
                1: "erf\\left(${args[0]}\\right)"
            }, m
        }
        var i = n(1),
            o = n(2).sign,
            a = .46875,
            s = .5641895835477563,
            u = [
                [3.1611237438705655, 113.86415415105016, 377.485237685302, 3209.3775891384694, .18577770618460315],
                [.5641884969886701, 8.883149794388377, 66.11919063714163, 298.6351381974001, 881.952221241769, 1712.0476126340707, 2051.0783778260716, 1230.3393547979972, 2.1531153547440383e-8],
                [.30532663496123236, .36034489994980445, .12578172611122926, .016083785148742275, .0006587491615298378, .016315387137302097]
            ],
            c = [
                [23.601290952344122, 244.02463793444417, 1282.6165260773723, 2844.236833439171],
                [15.744926110709835, 117.6939508913125, 537.1811018620099, 1621.3895745666903, 3290.7992357334597, 4362.619090143247, 3439.3676741437216, 1230.3393548037495],
                [2.568520192289822, 1.8729528499234604, .5279051029514285, .06051834131244132, .0023352049762686918]
            ],
            l = Math.pow(2, 53);
        t.name = "erf", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(434)]
    }, function (e, t, n) {
        e.exports = [n(437), n(121), n(122), n(123), n(124), n(438), n(439), n(440), n(441), n(125), n(126)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e) {
                if (e = i(e.valueOf()), 0 === e.length) throw new Error("Cannot calculate median absolute deviation of an empty array");
                var t = c(e);
                return c(u(e, function (e) {
                    return s(l(e, t))
                }))
            }
            var s = r(n(26)),
                u = r(n(115)),
                c = r(n(123)),
                l = r(n(21)),
                f = o("mad", {
                    "Array | Matrix": a,
                    "...": function (e) {
                        return a(e)
                    }
                });
            return f.toTex = void 0, f
        }
        var i = n(3).flatten;
        t.name = "mad", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            function o(e) {
                e = i(e.valueOf());
                var t = e.length;
                if (0 == t) throw new Error("Cannot calculate mode of an empty array");
                var n = {},
                    r = [],
                    o = 0;
                for (var a in e) e[a] in n || (n[e[a]] = 0), n[e[a]]++, n[e[a]] == o ? r.push(e[a]) : n[e[a]] > o && (o = n[e[a]], r = [e[a]]);
                return r
            }
            var a = r("mode", {
                "Array | Matrix": o,
                "...": function (e) {
                    return o(e)
                }
            });
            return a
        }
        var i = n(3).flatten;
        t.name = "mode", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            function a(e) {
                var t = void 0;
                if (i(e, function (e) {
                        t = void 0 === t ? e : s(t, e)
                    }), void 0 === t) throw new Error("Cannot calculate prod of an empty array");
                return t
            }
            var s = r(n(22)),
                u = o("prod", {
                    "Array | Matrix": a,
                    "Array | Matrix, number | BigNumber": function (e, t) {
                        throw new Error("prod(A, dim) is not yet supported")
                    },
                    "...": function (e) {
                        return a(e)
                    }
                });
            return u.toTex = void 0, u
        }
        var i = n(36);
        t.name = "prod", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, u) {
            function c(t, n, r) {
                var a, u, c;
                if (arguments.length < 2 || arguments.length > 3) throw new SyntaxError("Function quantileSeq requires two or three parameters");
                if (s(t)) {
                    if (r = r || !1, "boolean" == typeof r) {
                        if (u = t.valueOf(), o(n)) {
                            if (n < 0) throw new Error("N/prob must be non-negative");
                            if (n <= 1) return l(u, n, r);
                            if (n > 1) {
                                if (!i(n)) throw new Error("N must be a positive integer");
                                var f = n + 1;
                                a = new Array(n);
                                for (var h = 0; h < n;) a[h] = l(u, ++h / f, r);
                                return a
                            }
                        }
                        if (n && n.isBigNumber) {
                            if (n.isNegative()) throw new Error("N/prob must be non-negative");
                            if (c = new n.constructor(1), n.lte(c)) return l(u, n, r);
                            if (n.gt(c)) {
                                if (!n.isInteger()) throw new Error("N must be a positive integer");
                                var p = n.toNumber();
                                if (p > 4294967295) throw new Error("N must be less than or equal to 2^32-1, as that is the maximum length of an Array");
                                var f = new e.BigNumber(p + 1);
                                a = new Array(p);
                                for (var h = 0; h < p;) a[h] = l(u, new e.BigNumber(++h).div(f), r);
                                return a
                            }
                        }
                        if (Array.isArray(n)) {
                            a = new Array(n.length);
                            for (var h = 0; h < a.length; ++h) {
                                var m = n[h];
                                if (o(m)) {
                                    if (m < 0 || m > 1) throw new Error("Probability must be between 0 and 1, inclusive")
                                } else {
                                    if (!m || !m.isBigNumber) throw new TypeError("Unexpected type of argument in function quantileSeq");
                                    if (c = new m.constructor(1), m.isNegative() || m.gt(c)) throw new Error("Probability must be between 0 and 1, inclusive")
                                }
                                a[h] = l(u, m, r)
                            }
                            return a
                        }
                        throw new TypeError("Unexpected type of argument in function quantileSeq")
                    }
                    throw new TypeError("Unexpected type of argument in function quantileSeq")
                }
                throw new TypeError("Unexpected type of argument in function quantileSeq")
            }

            function l(e, t, n) {
                var r = a(e),
                    i = r.length;
                if (0 === i) throw new Error("Cannot calculate quantile of an empty sequence");
                if (o(t)) {
                    var s = t * (i - 1),
                        u = s % 1;
                    if (0 === u) {
                        var c = n ? r[s] : p(r, s);
                        return d(c), c
                    }
                    var l, v, g = Math.floor(s);
                    if (n) l = r[g], v = r[g + 1];
                    else {
                        v = p(r, g + 1), l = r[g];
                        for (var y = 0; y < g; ++y) m(r[y], l) > 0 && (l = r[y])
                    }
                    return d(l), d(v), f(h(l, 1 - u), h(v, u))
                }
                var s = t.times(i - 1);
                if (s.isInteger()) {
                    s = s.toNumber();
                    var c = n ? r[s] : p(r, s);
                    return d(c), c
                }
                var l, v, g = s.floor(),
                    u = s.minus(g),
                    w = g.toNumber();
                if (n) l = r[w], v = r[w + 1];
                else {
                    v = p(r, w + 1), l = r[w];
                    for (var y = 0; y < w; ++y) m(r[y], l) > 0 && (l = r[y])
                }
                d(l), d(v);
                var x = new u.constructor(1);
                return f(h(l, x.minus(u)), h(v, u))
            }
            var f = r(n(18)),
                h = r(n(12)),
                p = r(n(70)),
                m = r(n(49)),
                d = u({
                    "number | BigNumber | Unit": function (e) {
                        return e
                    }
                });
            return c
        }
        var i = n(2).isInteger,
            o = n(2).isNumber,
            a = n(3).flatten,
            s = n(42);
        t.name = "quantileSeq", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o(e, t) {
                if (0 == e.length) throw new SyntaxError("Function std requires one or more parameters (0 provided)");
                return a(s.apply(null, arguments))
            }
            var a = r(n(48)),
                s = r(n(126)),
                u = i("std", {
                    "Array | Matrix": o,
                    "Array | Matrix, string": o,
                    "...": function (e) {
                        return o(e)
                    }
                });
            return u.toTex = void 0, u
        }
        t.name = "std", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(127), n(443)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("print", {
                "string, Object": i,
                "string, Object, number | Object": i
            });
            return o.toTex = void 0, o
        }

        function i(e, t, n) {
            return e.replace(/\$([\w\.]+)/g, function (e, r) {
                for (var i = r.split("."), s = t[i.shift()]; i.length && void 0 !== s;) {
                    var u = i.shift();
                    s = u ? s[u] : s + "."
                }
                return void 0 !== s ? o(s) ? s : a(s, n) : e
            })
        }
        var o = n(11).isString,
            a = n(11).format;
        t.name = "print", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("acos", {
                number: function (n) {
                    return n >= -1 && n <= 1 || t.predictable ? Math.acos(n) : new e.Complex(n, 0).acos()
                },
                Complex: function (e) {
                    return e.acos()
                },
                BigNumber: function (e) {
                    return e.acos()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\cos^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "acos", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("acot", {
                number: function (e) {
                    return Math.atan(1 / e)
                },
                Complex: function (e) {
                    return e.acot()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t).atan()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\cot^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "acot", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("acoth", {
                number: function (n) {
                    return n >= 1 || n <= -1 || t.predictable ? isFinite(n) ? (Math.log((n + 1) / n) + Math.log(n / (n - 1))) / 2 : 0 : new e.Complex(n, 0).acoth()
                },
                Complex: function (e) {
                    return e.acoth()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t).atanh()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\coth^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "acoth", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("acsc", {
                number: function (n) {
                    return n <= -1 || n >= 1 || t.predictable ? Math.asin(1 / n) : new e.Complex(n, 0).acsc()
                },
                Complex: function (e) {
                    return e.acsc()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t).asin()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\csc^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "acsc", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("acsch", {
                number: function (e) {
                    return e = 1 / e, Math.log(e + Math.sqrt(e * e + 1))
                },
                Complex: function (e) {
                    return e.acsch()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t).asinh()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\mathrm{csch}^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "acsch", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("asec", {
                number: function (n) {
                    return n <= -1 || n >= 1 || t.predictable ? Math.acos(1 / n) : new e.Complex(n, 0).asec()
                },
                Complex: function (e) {
                    return e.asec()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t).acos()
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\sec^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "asec", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = (o.find(r(n(128)), ["Complex"]), o("asech", {
                number: function (n) {
                    if (n <= 1 && n >= -1 || t.predictable) {
                        n = 1 / n;
                        var r = Math.sqrt(n * n - 1);
                        return n > 0 || t.predictable ? Math.log(r + n) : new e.Complex(Math.log(r - n), Math.PI)
                    }
                    return new e.Complex(n, 0).asech()
                },
                Complex: function (e) {
                    return e.asech()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t).acosh()
                },
                "Array | Matrix": function (e) {
                    return i(e, a)
                }
            }));
            return a.toTex = {
                1: "\\mathrm{sech}^{-1}\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1);
        t.name = "asech", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("asin", {
                number: function (n) {
                    return n >= -1 && n <= 1 || t.predictable ? Math.asin(n) : new e.Complex(n, 0).asin()
                },
                Complex: function (e) {
                    return e.asin()
                },
                BigNumber: function (e) {
                    return e.asin()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\sin^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "asin", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("asinh", {
                number: Math.asinh || function (e) {
                    return Math.log(Math.sqrt(e * e + 1) + e)
                },
                Complex: function (e) {
                    return e.asinh()
                },
                BigNumber: function (e) {
                    return e.asinh()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\sinh^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "asinh", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("atan", {
                number: function (e) {
                    return Math.atan(e)
                },
                Complex: function (e) {
                    return e.atan()
                },
                BigNumber: function (e) {
                    return e.atan()
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\tan^{-1}\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "atan", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = r(n(0)),
                a = r(n(23)),
                s = r(n(14)),
                u = r(n(135)),
                c = r(n(15)),
                l = r(n(16)),
                f = r(n(8)),
                h = r(n(6)),
                p = i("atan2", {
                    "number, number": Math.atan2,
                    "BigNumber, BigNumber": function (t, n) {
                        return e.BigNumber.atan2(t, n)
                    },
                    "Matrix, Matrix": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                switch (t.storage()) {
                                    case "sparse":
                                        n = u(e, t, p, !1);
                                        break;
                                    default:
                                        n = a(t, e, p, !0)
                                }
                                break;
                            default:
                                switch (t.storage()) {
                                    case "sparse":
                                        n = s(e, t, p, !1);
                                        break;
                                    default:
                                        n = f(e, t, p)
                                }
                        }
                        return n
                    },
                    "Array, Array": function (e, t) {
                        return p(o(e), o(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return p(o(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return p(e, o(t))
                    },
                    "Matrix, number | BigNumber": function (e, t) {
                        var n;
                        switch (e.storage()) {
                            case "sparse":
                                n = c(e, t, p, !1);
                                break;
                            default:
                                n = h(e, t, p, !1)
                        }
                        return n
                    },
                    "number | BigNumber, Matrix": function (e, t) {
                        var n;
                        switch (t.storage()) {
                            case "sparse":
                                n = l(t, e, p, !0);
                                break;
                            default:
                                n = h(t, e, p, !0)
                        }
                        return n
                    },
                    "Array, number | BigNumber": function (e, t) {
                        return h(o(e), t, p, !1).valueOf()
                    },
                    "number | BigNumber, Array": function (e, t) {
                        return h(o(t), e, p, !0).valueOf()
                    }
                });
            return p.toTex = {
                2: "\\mathrm{atan2}\\left(${args}\\right)"
            }, p
        }
        t.name = "atan2", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("atanh", {
                number: function (n) {
                    return n <= 1 && n >= -1 || t.predictable ? o(n) : new e.Complex(n, 0).atanh()
                },
                Complex: function (e) {
                    return e.atanh()
                },
                BigNumber: function (e) {
                    return e.atanh()
                },
                "Array | Matrix": function (e) {
                    return i(e, a, !0)
                }
            });
            return a.toTex = {
                1: "\\tanh^{-1}\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = Math.atanh || function (e) {
                return Math.log((1 + e) / (1 - e)) / 2
            };
        t.name = "atanh", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("cos", {
                number: Math.cos,
                Complex: function (e) {
                    return e.cos()
                },
                BigNumber: function (e) {
                    return e.cos()
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function cos is no angle");
                    return o(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\cos\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "cos", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("cosh", {
                number: o,
                Complex: function (e) {
                    return e.cosh()
                },
                BigNumber: function (e) {
                    return e.cosh()
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function cosh is no angle");
                    return a(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, a)
                }
            });
            return a.toTex = {
                1: "\\cosh\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = Math.cosh || function (e) {
                return (Math.exp(e) + Math.exp(-e)) / 2
            };
        t.name = "cosh", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("cot", {
                number: function (e) {
                    return 1 / Math.tan(e)
                },
                Complex: function (e) {
                    return e.cot()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t.tan())
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function cot is no angle");
                    return o(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\cot\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "cot", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("coth", {
                number: i,
                Complex: function (e) {
                    return e.coth()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t.tanh())
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function coth is no angle");
                    return a(t.value)
                },
                "Array | Matrix": function (e) {
                    return o(e, a)
                }
            });
            return a.toTex = {
                1: "\\coth\\left(${args[0]}\\right)"
            }, a
        }

        function i(e) {
            var t = Math.exp(2 * e);
            return (t + 1) / (t - 1)
        }
        var o = n(1);
        t.name = "coth", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("csc", {
                number: function (e) {
                    return 1 / Math.sin(e)
                },
                Complex: function (e) {
                    return e.csc()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t.sin())
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function csc is no angle");
                    return o(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\csc\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "csc", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("csch", {
                number: i,
                Complex: function (e) {
                    return e.csch()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t.sinh())
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function csch is no angle");
                    return a(t.value)
                },
                "Array | Matrix": function (e) {
                    return o(e, a)
                }
            });
            return a.toTex = {
                1: "\\mathrm{csch}\\left(${args[0]}\\right)"
            }, a
        }

        function i(e) {
            return 0 == e ? Number.POSITIVE_INFINITY : Math.abs(2 / (Math.exp(e) - Math.exp(-e))) * a(e)
        }
        var o = n(1),
            a = n(2).sign;
        t.name = "csch", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(444), n(128), n(445), n(446), n(447), n(448), n(449), n(450), n(451), n(452), n(453), n(454), n(455), n(456), n(457), n(458), n(459), n(460), n(461), n(463), n(464), n(465), n(466), n(467), n(468)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("sec", {
                number: function (e) {
                    return 1 / Math.cos(e)
                },
                Complex: function (e) {
                    return e.sec()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t.cos())
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function sec is no angle");
                    return o(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\sec\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "sec", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("sech", {
                number: i,
                Complex: function (e) {
                    return e.sech()
                },
                BigNumber: function (t) {
                    return new e.BigNumber(1).div(t.cosh())
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function sech is no angle");
                    return a(t.value)
                },
                "Array | Matrix": function (e) {
                    return o(e, a)
                }
            });
            return a.toTex = {
                1: "\\mathrm{sech}\\left(${args[0]}\\right)"
            }, a
        }

        function i(e) {
            return 2 / (Math.exp(e) + Math.exp(-e))
        }
        var o = n(1);
        t.name = "sech", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("sin", {
                number: Math.sin,
                Complex: function (e) {
                    return e.sin()
                },
                BigNumber: function (e) {
                    return e.sin()
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function sin is no angle");
                    return o(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\sin\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "sin", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("sinh", {
                number: o,
                Complex: function (e) {
                    return e.sinh()
                },
                BigNumber: function (e) {
                    return e.sinh()
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function sinh is no angle");
                    return a(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, a, !0)
                }
            });
            return a.toTex = {
                1: "\\sinh\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = Math.sinh || function (e) {
                return (Math.exp(e) - Math.exp(-e)) / 2
            };
        t.name = "sinh", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("tan", {
                number: Math.tan,
                Complex: function (e) {
                    return e.tan()
                },
                BigNumber: function (e) {
                    return e.tan()
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function tan is no angle");
                    return o(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, o, !0)
                }
            });
            return o.toTex = {
                1: "\\tan\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "tan", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("tanh", {
                number: o,
                Complex: function (e) {
                    return e.tanh()
                },
                BigNumber: function (e) {
                    return e.tanh()
                },
                Unit: function (t) {
                    if (!t.hasBase(e.Unit.BASE_UNITS.ANGLE)) throw new TypeError("Unit in function tanh is no angle");
                    return a(t.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, a, !0)
                }
            });
            return a.toTex = {
                1: "\\tanh\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = Math.tanh || function (e) {
                var t = Math.exp(2 * e);
                return (t - 1) / (t + 1)
            };
        t.name = "tanh", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(470)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            var o = n(4),
                a = r(n(0)),
                s = r(n(8)),
                u = r(n(6)),
                c = i("to", {
                    "Unit, Unit | string": function (e, t) {
                        return e.to(t)
                    },
                    "Matrix, Matrix": function (e, t) {
                        return s(e, t, c)
                    },
                    "Array, Array": function (e, t) {
                        return c(a(e), a(t)).valueOf()
                    },
                    "Array, Matrix": function (e, t) {
                        return c(a(e), t)
                    },
                    "Matrix, Array": function (e, t) {
                        return c(e, a(t))
                    },
                    "Matrix, any": function (e, t) {
                        return u(e, t, c, !1)
                    },
                    "any, Matrix": function (e, t) {
                        return u(t, e, c, !0)
                    },
                    "Array, any": function (e, t) {
                        return u(a(e), t, c, !1).valueOf()
                    },
                    "any, Array": function (e, t) {
                        return u(a(t), e, c, !0).valueOf()
                    }
                });
            return c.toTex = {
                2: "\\left(${args[0]}" + o.operators.to + "${args[1]}\\right)"
            }, c
        }
        t.name = "to", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(129), n(41), n(50), n(73), n(51), n(473), n(74), n(472), n(130)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("isNaN", {
                number: function (e) {
                    return Number.isNaN(e)
                },
                BigNumber: function (e) {
                    return e.isNaN()
                },
                Fraction: function (e) {
                    return !1
                },
                Complex: function (e) {
                    return Number.isNaN(e.re) && Number.isNaN(e.im)
                },
                Unit: function (e) {
                    return Number.isNaN(e.value)
                },
                "Array | Matrix": function (e) {
                    return i(e, Number.isNaN)
                }
            });
            return o
        }
        var i = n(1);
        n(2), t.name = "isNaN", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("isPrime", {
                number: function (e) {
                    if (e < 2) return !1;
                    if (2 == e) return !0;
                    if (e % 2 == 0) return !1;
                    for (var t = 3; t * t <= e; t += 2)
                        if (e % t == 0) return !1;
                    return !0
                },
                BigNumber: function (t) {
                    if (t.lt(2)) return !1;
                    if (t.equals(2)) return !0;
                    if (t.mod(2).isZero()) return !1;
                    for (var n = e.BigNumber(3); n.times(n).lte(t); n = n.plus(1))
                        if (t.mod(n).isZero()) return !1;
                    return !0
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        t.name = "isPrime", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(475)];
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            return function (t, n) {
                var r = e[n && n.mathjs];
                return r && "function" == typeof r.fromJSON ? r.fromJSON(n) : n
            }
        }
        t.name = "reviver", t.path = "json", t.factory = r
    }, function (e, t, n) {
        function r(e, t, n, r, o) {
            var a = i.clone({
                precision: t.precision
            });
            return a.prototype.type = "BigNumber", a.prototype.isBigNumber = !0, a.prototype.toJSON = function () {
                return {
                    mathjs: "BigNumber",
                    value: this.toString()
                }
            }, a.fromJSON = function (e) {
                return new a(e.value)
            }, o.on("config", function (e, t) {
                e.precision !== t.precision && a.config({
                    precision: e.precision
                })
            }), a
        }
        var i = n(513);
        t.name = "BigNumber", t.path = "type", t.factory = r, t.math = !0
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("bignumber", {
                "": function () {
                    return new e.BigNumber(0)
                },
                number: function (t) {
                    return new e.BigNumber(t + "")
                },
                string: function (t) {
                    return new e.BigNumber(t)
                },
                BigNumber: function (e) {
                    return e
                },
                Fraction: function (t) {
                    return new e.BigNumber(t.n).div(t.d)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                0: "0",
                1: "\\left(${args[0]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "bignumber", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(476), n(477)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("bool", {
                "": function () {
                    return !1
                },
                boolean: function (e) {
                    return e
                },
                number: function (e) {
                    return !!e
                },
                BigNumber: function (e) {
                    return !e.isZero()
                },
                string: function (e) {
                    var t = e.toLowerCase();
                    if ("true" === t) return !0;
                    if ("false" === t) return !1;
                    var n = Number(e);
                    if ("" != e && !isNaN(n)) return !!n;
                    throw new Error('Cannot convert "' + e + '" to a boolean')
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o
        }
        var i = n(1);
        t.name = "boolean", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r, a) {
            function s(e) {
                if (!(this instanceof s)) throw new SyntaxError("Constructor must be called with the new operator");
                e && e.isChain ? this.value = e.value : this.value = e
            }

            function u(e, t) {
                "function" == typeof t && (s.prototype[e] = l(t))
            }

            function c(e, t) {
                o(s.prototype, e, function () {
                    var e = t();
                    if ("function" == typeof e) return l(e)
                })
            }

            function l(e) {
                return function () {
                    for (var t = [this.value], n = 0; n < arguments.length; n++) t[n + 1] = arguments[n];
                    return new s(e.apply(e, t))
                }
            }
            return s.prototype.type = "Chain", s.prototype.isChain = !0, s.prototype.done = function () {
                return this.value
            }, s.prototype.valueOf = function () {
                return this.value
            }, s.prototype.toString = function () {
                return i(this.value)
            }, s.createProxy = function (e, t) {
                if ("string" == typeof e) u(e, t);
                else
                    for (var n in e) e.hasOwnProperty(n) && u(n, e[n])
            }, s.createProxy(a), a.on("import", function (e, t, n) {
                void 0 === n && c(e, t)
            }), s
        }
        var i = n(11).format,
            o = n(5).lazy;
        t.name = "Chain", t.path = "type", t.factory = r, t.math = !0, t.lazy = !1
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            return r("chain", {
                "": function () {
                    return new e.Chain
                },
                any: function (t) {
                    return new e.Chain(t)
                }
            })
        }
        t.name = "chain", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(480), n(481)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, o) {
            var a = n(4),
                s = o("complex", {
                    "": function () {
                        return e.Complex.ZERO
                    },
                    number: function (t) {
                        return new e.Complex(t, 0)
                    },
                    "number, number": function (t, n) {
                        return new e.Complex(t, n)
                    },
                    "BigNumber, BigNumber": function (t, n) {
                        return new e.Complex(t.toNumber(), n.toNumber())
                    },
                    Complex: function (e) {
                        return e.clone()
                    },
                    string: function (t) {
                        return e.Complex(t)
                    },
                    Object: function (t) {
                        if ("re" in t && "im" in t) return new e.Complex(t.re, t.im);
                        if ("r" in t && "phi" in t) return new e.Complex(t);
                        throw new Error("Expected object with either properties re and im, or properties r and phi.")
                    },
                    "Array | Matrix": function (e) {
                        return i(e, s)
                    }
                });
            return s.toTex = {
                0: "0",
                1: "\\left(${args[0]}\\right)",
                2: "\\left(\\left(${args[0]}\\right)+" + a.symbols.i + "\\cdot\\left(${args[1]}\\right)\\right)"
            }, s
        }
        var i = n(1);
        t.name = "complex", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(131), n(483)]
    }, function (e, t, n) {
        function r(e, t, n, r) {
            return i
        }
        var i = n(514);
        i.prototype.type = "Fraction", i.prototype.isFraction = !0, i.prototype.toJSON = function () {
            return {
                mathjs: "Fraction",
                n: this.s * this.n,
                d: this.d
            }
        }, i.fromJSON = function (e) {
            return new i(e)
        }, t.name = "Fraction", t.path = "type", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(485), n(132)]
    }, function (e, t, n) {
        e.exports = [n(478), n(479), n(482), n(484), n(486), n(495), n(78), n(496), n(497), n(501)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, i) {
            function o() {
                if (!(this instanceof o)) throw new SyntaxError("Constructor must be called with the new operator");
                this._minimum = null, this._size = 0
            }
            var a = r(n(40)),
                s = r(n(28)),
                u = 1 / Math.log((1 + Math.sqrt(5)) / 2);
            o.prototype.type = "FibonacciHeap", o.prototype.isFibonacciHeap = !0, o.prototype.insert = function (e, t) {
                var n = {
                    key: e,
                    value: t,
                    degree: 0
                };
                if (this._minimum) {
                    var r = this._minimum;
                    n.left = r, n.right = r.right, r.right = n, n.right.left = n, a(e, r.key) && (this._minimum = n)
                } else n.left = n, n.right = n, this._minimum = n;
                return this._size++, n
            }, o.prototype.size = function () {
                return this._size
            }, o.prototype.clear = function () {
                this._minimum = null, this._size = 0
            }, o.prototype.isEmpty = function () {
                return !!this._minimum
            }, o.prototype.extractMinimum = function () {
                var e = this._minimum;
                if (null === e) return e;
                for (var t = this._minimum, n = e.degree, r = e.child; n > 0;) {
                    var i = r.right;
                    r.left.right = r.right, r.right.left = r.left, r.left = t, r.right = t.right, t.right = r, r.right.left = r, r.parent = null, r = i, n--
                }
                return e.left.right = e.right, e.right.left = e.left, e == e.right ? t = null : (t = e.right, t = p(t, this._size)), this._size--, this._minimum = t, e
            }, o.prototype.remove = function (e) {
                this._minimum = c(this._minimum, e, -1), this.extractMinimum()
            };
            var c = function (e, t, n) {
                    t.key = n;
                    var r = t.parent;
                    return r && a(t.key, r.key) && (l(e, t, r), f(e, r)), a(t.key, e.key) && (e = t), e
                },
                l = function (e, t, n) {
                    t.left.right = t.right, t.right.left = t.left, n.degree--, n.child == t && (n.child = t.right), 0 === n.degree && (n.child = null), t.left = e, t.right = e.right, e.right = t, t.right.left = t, t.parent = null, t.mark = !1
                },
                f = function (e, t) {
                    var n = t.parent;
                    n && (t.mark ? (l(e, t, n), f(n)) : t.mark = !0)
                },
                h = function (e, t) {
                    e.left.right = e.right, e.right.left = e.left, e.parent = t, t.child ? (e.left = t.child, e.right = t.child.right, t.child.right = e, e.right.left = e) : (t.child = e, e.right = e, e.left = e), t.degree++, e.mark = !1
                },
                p = function (e, t) {
                    var n = Math.floor(Math.log(t) * u) + 1,
                        r = new Array(n),
                        i = 0,
                        o = e;
                    if (o)
                        for (i++, o = o.right; o !== e;) i++, o = o.right;
                    for (var c; i > 0;) {
                        for (var l = o.degree, f = o.right; c = r[l], c;) {
                            if (s(o.key, c.key)) {
                                var p = c;
                                c = o, o = p
                            }
                            h(c, o), r[l] = null, l++
                        }
                        r[l] = o, o = f, i--
                    }
                    e = null;
                    for (var m = 0; m < n; m++) c = r[m], c && (e ? (c.left.right = c.right, c.right.left = c.left, c.left = e, c.right = e.right, e.right = c, c.right.left = c, a(c.key, e.key) && (e = c)) : e = c);
                    return e
                };
            return o
        }
        t.name = "FibonacciHeap", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            function o(e, t) {
                if (!(this instanceof o)) throw new SyntaxError("Constructor must be called with the new operator");
                if (t && !u(t)) throw new Error("Invalid datatype: " + t);
                if (e && e.isMatrix === !0 || s(e)) {
                    var n = new c(e, t);
                    this._data = n._data, this._size = n._size, this._datatype = n._datatype, this._min = null, this._max = null
                } else if (e && s(e.data) && s(e.size)) this._data = e.data, this._size = e.size, this._datatype = e.datatype, this._min = "undefined" != typeof e.min ? e.min : null, this._max = "undefined" != typeof e.max ? e.max : null;
                else {
                    if (e) throw new TypeError("Unsupported type of data (" + i.types.type(e) + ")");
                    this._data = [], this._size = [0], this._datatype = t, this._min = null, this._max = null
                }
            }
            var c = r(n(133)),
                l = r(n(40));
            return o.prototype = new c, o.prototype.type = "ImmutableDenseMatrix", o.prototype.isImmutableDenseMatrix = !0, o.prototype.subset = function (e) {
                switch (arguments.length) {
                    case 1:
                        var t = c.prototype.subset.call(this, e);
                        return t.isMatrix ? new o({
                            data: t._data,
                            size: t._size,
                            datatype: t._datatype
                        }) : t;
                    case 2:
                    case 3:
                        throw new Error("Cannot invoke set subset on an Immutable Matrix instance");
                    default:
                        throw new SyntaxError("Wrong number of arguments")
                }
            }, o.prototype.set = function () {
                throw new Error("Cannot invoke set on an Immutable Matrix instance")
            }, o.prototype.resize = function () {
                throw new Error("Cannot invoke resize on an Immutable Matrix instance")
            }, o.prototype.reshape = function () {
                throw new Error("Cannot invoke reshape on an Immutable Matrix instance")
            }, o.prototype.clone = function () {
                var e = new o({
                    data: a.clone(this._data),
                    size: a.clone(this._size),
                    datatype: this._datatype
                });
                return e
            }, o.prototype.toJSON = function () {
                return {
                    mathjs: "ImmutableDenseMatrix",
                    data: this._data,
                    size: this._size,
                    datatype: this._datatype
                }
            }, o.fromJSON = function (e) {
                return new o(e)
            }, o.prototype.swapRows = function () {
                throw new Error("Cannot invoke swapRows on an Immutable Matrix instance")
            }, o.prototype.min = function () {
                if (null === this._min) {
                    var e = null;
                    this.forEach(function (t) {
                        (null === e || l(t, e)) && (e = t)
                    }), this._min = null !== e ? e : void 0
                }
                return this._min
            }, o.prototype.max = function () {
                if (null === this._max) {
                    var e = null;
                    this.forEach(function (t) {
                        (null === e || l(e, t)) && (e = t)
                    }), this._max = null !== e ? e : void 0
                }
                return this._max
            }, o
        }
        var i = n(25),
            o = i.string,
            a = i.object,
            s = Array.isArray,
            u = o.isString;
        t.name = "ImmutableDenseMatrix", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e) {
            function t(e) {
                if (!(this instanceof t)) throw new SyntaxError("Constructor must be called with the new operator");
                this._dimensions = [], this._isScalar = !0;
                for (var r = 0, i = arguments.length; r < i; r++) {
                    var o = arguments[r];
                    if (o && o.isRange === !0) this._dimensions.push(o), this._isScalar = !1;
                    else if (o && (Array.isArray(o) || o.isMatrix === !0)) {
                        var a = n(o.valueOf());
                        this._dimensions.push(a);
                        var s = a.size();
                        1 === s.length && 1 === s[0] || (this._isScalar = !1)
                    } else if ("number" == typeof o) this._dimensions.push(n([o]));
                    else {
                        if ("string" != typeof o) throw new TypeError("Dimension must be an Array, Matrix, number, string, or Range");
                        this._dimensions.push(o)
                    }
                }
            }

            function n(t) {
                for (var n = 0, r = t.length; n < r; n++)
                    if ("number" != typeof t[n] || !o(t[n])) throw new TypeError("Index parameters must be positive integer numbers");
                return new e.ImmutableDenseMatrix(t)
            }
            return t.prototype.type = "Index", t.prototype.isIndex = !0, t.prototype.clone = function () {
                var e = new t;
                return e._dimensions = i(this._dimensions), e._isScalar = this._isScalar, e
            }, t.create = function (e) {
                var n = new t;
                return t.apply(n, e), n
            }, t.prototype.size = function () {
                for (var e = [], t = 0, n = this._dimensions.length; t < n; t++) {
                    var r = this._dimensions[t];
                    e[t] = "string" == typeof r ? 1 : r.size()[0]
                }
                return e
            }, t.prototype.max = function () {
                for (var e = [], t = 0, n = this._dimensions.length; t < n; t++) {
                    var r = this._dimensions[t];
                    e[t] = "string" == typeof r ? r : r.max()
                }
                return e
            }, t.prototype.min = function () {
                for (var e = [], t = 0, n = this._dimensions.length; t < n; t++) {
                    var r = this._dimensions[t];
                    e[t] = "string" == typeof r ? r : r.min()
                }
                return e
            }, t.prototype.forEach = function (e) {
                for (var t = 0, n = this._dimensions.length; t < n; t++) e(this._dimensions[t], t, this)
            }, t.prototype.dimension = function (e) {
                return this._dimensions[e] || null
            }, t.prototype.isObjectProperty = function () {
                return 1 === this._dimensions.length && "string" == typeof this._dimensions[0]
            }, t.prototype.getObjectProperty = function () {
                return this.isObjectProperty() ? this._dimensions[0] : null
            }, t.prototype.isScalar = function () {
                return this._isScalar
            }, t.prototype.toArray = function () {
                for (var e = [], t = 0, n = this._dimensions.length; t < n; t++) {
                    var r = this._dimensions[t];
                    e.push("string" == typeof r ? r : r.toArray())
                }
                return e
            }, t.prototype.valueOf = t.prototype.toArray, t.prototype.toString = function () {
                for (var e = [], t = 0, n = this._dimensions.length; t < n; t++) {
                    var r = this._dimensions[t];
                    "string" == typeof r ? e.push(JSON.stringify(r)) : e.push(r.toString())
                }
                return "[" + e.join(", ") + "]"
            }, t.prototype.toJSON = function () {
                return {
                    mathjs: "Index",
                    dimensions: this._dimensions
                }
            }, t.fromJSON = function (e) {
                return t.create(e.dimensions)
            }, t
        }
        var i = n(5).clone,
            o = n(2).isInteger;
        t.name = "Index", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r) {
            function i() {
                if (!(this instanceof i)) throw new SyntaxError("Constructor must be called with the new operator");
                this._values = [], this._heap = new e.FibonacciHeap
            }
            var o = r(n(18)),
                a = r(n(10));
            return i.prototype.type = "Spa", i.prototype.isSpa = !0, i.prototype.set = function (e, t) {
                if (this._values[e]) this._values[e].value = t;
                else {
                    var n = this._heap.insert(e, t);
                    this._values[e] = n
                }
            }, i.prototype.get = function (e) {
                var t = this._values[e];
                return t ? t.value : 0
            }, i.prototype.accumulate = function (e, t) {
                var n = this._values[e];
                n ? n.value = o(n.value, t) : (n = this._heap.insert(e, t), this._values[e] = n)
            }, i.prototype.forEach = function (e, t, n) {
                var r = this._heap,
                    i = this._values,
                    o = [],
                    s = r.extractMinimum();
                for (s && o.push(s); s && s.key <= t;) s.key >= e && (a(s.value, 0) || n(s.key, s.value, this)), s = r.extractMinimum(), s && o.push(s);
                for (var u = 0; u < o.length; u++) {
                    var c = o[u];
                    s = r.insert(c.key, c.value), i[s.key] = s
                }
            }, i.prototype.swap = function (e, t) {
                var n = this._values[e],
                    r = this._values[t];
                if (!n && r) n = this._heap.insert(e, r.value), this._heap.remove(r), this._values[e] = n, this._values[t] = void 0;
                else if (n && !r) r = this._heap.insert(t, n.value), this._heap.remove(n), this._values[t] = r, this._values[e] = void 0;
                else if (n && r) {
                    var i = n.value;
                    n.value = r.value, r.value = i
                }
            }, i
        }
        t.name = "Spa", t.path = "type", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, r, d) {
            function v(e, t) {
                if (!(this instanceof v)) throw new SyntaxError("Constructor must be called with the new operator");
                if (t && !p(t)) throw new Error("Invalid datatype: " + t);
                if (e && e.isMatrix === !0) w(this, e, t);
                else if (e && l(e.index) && l(e.ptr) && l(e.size)) this._values = e.values, this._index = e.index, this._ptr = e.ptr, this._size = e.size, this._datatype = t || e.datatype;
                else if (l(e)) x(this, e, t);
                else {
                    if (e) throw new TypeError("Unsupported type of data (" + i.types.type(e) + ")");
                    this._values = [], this._index = [], this._ptr = [0], this._size = [0, 0], this._datatype = t
                }
            }
            var g = r(n(75)),
                y = r(n(10)),
                w = function (e, t, n) {
                    "SparseMatrix" === t.type ? (e._values = t._values ? s.clone(t._values) : void 0, e._index = s.clone(t._index), e._ptr = s.clone(t._ptr), e._size = s.clone(t._size), e._datatype = n || t._datatype) : x(e, t.valueOf(), n || t._datatype)
                },
                x = function (e, t, n) {
                    e._values = [], e._index = [], e._ptr = [], e._datatype = n;
                    var r = t.length,
                        i = 0,
                        o = y,
                        a = 0;
                    if (p(n) && (o = d.find(y, [n, n]) || y, a = d.convert(0, n)), r > 0) {
                        var s = 0;
                        do {
                            e._ptr.push(e._index.length);
                            for (var u = 0; u < r; u++) {
                                var c = t[u];
                                if (l(c)) {
                                    if (0 === s && i < c.length && (i = c.length), s < c.length) {
                                        var f = c[s];
                                        o(f, a) || (e._values.push(f), e._index.push(u))
                                    }
                                } else 0 === s && i < 1 && (i = 1), o(c, a) || (e._values.push(c), e._index.push(u))
                            }
                            s++
                        } while (s < i)
                    }
                    e._ptr.push(e._index.length), e._size = [r, i]
                };
            v.prototype = new g, v.prototype.type = "SparseMatrix", v.prototype.isSparseMatrix = !0, v.prototype.storage = function () {
                return "sparse"
            }, v.prototype.datatype = function () {
                return this._datatype
            }, v.prototype.create = function (e, t) {
                return new v(e, t)
            }, v.prototype.density = function () {
                var e = this._size[0],
                    t = this._size[1];
                return 0 !== e && 0 !== t ? this._index.length / (e * t) : 0
            }, v.prototype.subset = function (e, t, n) {
                if (!this._values) throw new Error("Cannot invoke subset on a Pattern only matrix");
                switch (arguments.length) {
                    case 1:
                        return b(this, e);
                    case 2:
                    case 3:
                        return C(this, e, t, n);
                    default:
                        throw new SyntaxError("Wrong number of arguments")
                }
            };
            var b = function (e, t) {
                    if (!t || t.isIndex !== !0) throw new TypeError("Invalid index");
                    var n = t.isScalar();
                    if (n) return e.get(t.min());
                    var r = t.size();
                    if (r.length != e._size.length) throw new o(r.length, e._size.length);
                    var i, a, s, u, c = t.min(),
                        l = t.max();
                    for (i = 0, a = e._size.length; i < a; i++) m(c[i], e._size[i]), m(l[i], e._size[i]);
                    var f = e._values,
                        h = e._index,
                        p = e._ptr,
                        d = t.dimension(0),
                        g = t.dimension(1),
                        y = [],
                        w = [];
                    d.forEach(function (e, t) {
                        w[e] = t[0], y[e] = !0
                    });
                    var x = f ? [] : void 0,
                        b = [],
                        C = [];
                    return g.forEach(function (e) {
                        for (C.push(b.length), s = p[e], u = p[e + 1]; s < u; s++) i = h[s], y[i] === !0 && (b.push(w[i]), x && x.push(f[s]))
                    }), C.push(b.length), new v({
                        values: x,
                        index: b,
                        ptr: C,
                        size: r,
                        datatype: e._datatype
                    })
                },
                C = function (e, t, n, r) {
                    if (!t || t.isIndex !== !0) throw new TypeError("Invalid index");
                    var i, u = t.size(),
                        c = t.isScalar();
                    if (n && n.isMatrix === !0 ? (i = n.size(), n = n.toArray()) : i = a.size(n), c) {
                        if (0 !== i.length) throw new TypeError("Scalar expected");
                        e.set(t.min(), n, r)
                    } else {
                        if (1 !== u.length && 2 !== u.length) throw new o(u.length, e._size.length, "<");
                        if (i.length < u.length) {
                            for (var l = 0, f = 0; 1 === u[l] && 1 === i[l];) l++;
                            for (; 1 === u[l];) f++, l++;
                            n = a.unsqueeze(n, u.length, f, i)
                        }
                        if (!s.deepEqual(u, i)) throw new o(u, i, ">");
                        for (var h = t.min()[0], p = t.min()[1], m = i[0], d = i[1], v = 0; v < m; v++)
                            for (var g = 0; g < d; g++) {
                                var y = n[v][g];
                                e.set([v + h, g + p], y, r)
                            }
                    }
                    return e
                };
            v.prototype.get = function (e) {
                if (!l(e)) throw new TypeError("Array expected");
                if (e.length != this._size.length) throw new o(e.length, this._size.length);
                if (!this._values) throw new Error("Cannot invoke get on a Pattern only matrix");
                var t = e[0],
                    n = e[1];
                m(t, this._size[0]), m(n, this._size[1]);
                var r = M(t, this._ptr[n], this._ptr[n + 1], this._index);
                return r < this._ptr[n + 1] && this._index[r] === t ? this._values[r] : 0
            }, v.prototype.set = function (e, t, n) {
                if (!l(e)) throw new TypeError("Array expected");
                if (e.length != this._size.length) throw new o(e.length, this._size.length);
                if (!this._values) throw new Error("Cannot invoke set on a Pattern only matrix");
                var r = e[0],
                    i = e[1],
                    a = this._size[0],
                    s = this._size[1],
                    u = y,
                    c = 0;
                p(this._datatype) && (u = d.find(y, [this._datatype, this._datatype]) || y, c = d.convert(0, this._datatype)), (r > a - 1 || i > s - 1) && (E(this, Math.max(r + 1, a), Math.max(i + 1, s), n), a = this._size[0], s = this._size[1]), m(r, a), m(i, s);
                var f = M(r, this._ptr[i], this._ptr[i + 1], this._index);
                return f < this._ptr[i + 1] && this._index[f] === r ? u(t, c) ? T(f, i, this._values, this._index, this._ptr) : this._values[f] = t : N(f, r, i, t, this._values, this._index, this._ptr), this
            };
            var M = function (e, t, n, r) {
                    if (n - t === 0) return n;
                    for (var i = t; i < n; i++)
                        if (r[i] === e) return i;
                    return t
                },
                T = function (e, t, n, r, i) {
                    n.splice(e, 1), r.splice(e, 1);
                    for (var o = t + 1; o < i.length; o++) i[o]--
                },
                N = function (e, t, n, r, i, o, a) {
                    i.splice(e, 0, r), o.splice(e, 0, t);
                    for (var s = n + 1; s < a.length; s++) a[s]++
                };
            v.prototype.resize = function (e, t, n) {
                if (!l(e)) throw new TypeError("Array expected");
                if (2 !== e.length) throw new Error("Only two dimensions matrix are supported");
                e.forEach(function (t) {
                    if (!c.isNumber(t) || !c.isInteger(t) || t < 0) throw new TypeError("Invalid size, must contain positive integers (size: " + u.format(e) + ")")
                });
                var r = n ? this.clone() : this;
                return E(r, e[0], e[1], t)
            };
            var E = function (e, t, n, r) {
                var i = r || 0,
                    o = y,
                    a = 0;
                p(e._datatype) && (o = d.find(y, [e._datatype, e._datatype]) || y, a = d.convert(0, e._datatype), i = d.convert(i, e._datatype));
                var s, u, c, l = !o(i, a),
                    f = e._size[0],
                    h = e._size[1];
                if (n > h) {
                    for (u = h; u < n; u++)
                        if (e._ptr[u] = e._values.length, l)
                            for (s = 0; s < f; s++) e._values.push(i), e._index.push(s);
                    e._ptr[n] = e._values.length
                } else n < h && (e._ptr.splice(n + 1, h - n), e._values.splice(e._ptr[n], e._values.length), e._index.splice(e._ptr[n], e._index.length));
                if (h = n, t > f) {
                    if (l) {
                        var m = 0;
                        for (u = 0; u < h; u++) {
                            e._ptr[u] = e._ptr[u] + m, c = e._ptr[u + 1] + m;
                            var v = 0;
                            for (s = f; s < t; s++, v++) e._values.splice(c + v, 0, i), e._index.splice(c + v, 0, s), m++
                        }
                        e._ptr[h] = e._values.length
                    }
                } else if (t < f) {
                    var g = 0;
                    for (u = 0; u < h; u++) {
                        e._ptr[u] = e._ptr[u] - g;
                        var w = e._ptr[u],
                            x = e._ptr[u + 1] - g;
                        for (c = w; c < x; c++) s = e._index[c], s > t - 1 && (e._values.splice(c, 1), e._index.splice(c, 1), g++)
                    }
                    e._ptr[u] = e._values.length
                }
                return e._size[0] = t, e._size[1] = n, e
            };
            v.prototype.reshape = function (e, t) {
                if (!l(e)) throw new TypeError("Array expected");
                if (2 !== e.length) throw new Error("Sparse matrices can only be reshaped in two dimensions");
                if (e.forEach(function (t) {
                        if (!c.isNumber(t) || !c.isInteger(t) || t < 0) throw new TypeError("Invalid size, must contain positive integers (size: " + u.format(e) + ")")
                    }), this._size[0] * this._size[1] !== e[0] * e[1]) throw new Error("Reshaping sparse matrix will result in the wrong number of elements");
                var n = t ? this.clone() : this;
                if (this._size[0] === e[0] && this._size[1] === e[1]) return n;
                for (var r = [], i = 0; i < n._ptr.length; i++)
                    for (var o = 0; o < n._ptr[i + 1] - n._ptr[i]; o++) r.push(i);
                for (var a = n._values.slice(), s = n._index.slice(), i = 0; i < n._index.length; i++) {
                    var f = s[i],
                        h = r[i],
                        p = f * n._size[1] + h;
                    r[i] = p % e[1], s[i] = Math.floor(p / e[1])
                }
                n._values.length = 0, n._index.length = 0, n._ptr.length = e[1] + 1, n._size = e.slice();
                for (var i = 0; i < n._ptr.length; i++) n._ptr[i] = 0;
                for (var m = 0; m < a.length; m++) {
                    var i = s[m],
                        o = r[m],
                        d = a[m],
                        v = M(i, n._ptr[o], n._ptr[o + 1], n._index);
                    N(v, i, o, d, n._values, n._index, n._ptr)
                }
                return n
            }, v.prototype.clone = function () {
                var e = new v({
                    values: this._values ? s.clone(this._values) : void 0,
                    index: s.clone(this._index),
                    ptr: s.clone(this._ptr),
                    size: s.clone(this._size),
                    datatype: this._datatype
                });
                return e
            }, v.prototype.size = function () {
                return this._size.slice(0)
            }, v.prototype.map = function (e, t) {
                if (!this._values) throw new Error("Cannot invoke map on a Pattern only matrix");
                var n = this,
                    r = this._size[0],
                    i = this._size[1],
                    o = function (t, r, i) {
                        return e(t, [r, i], n)
                    };
                return A(this, 0, r - 1, 0, i - 1, o, t)
            };
            var A = function (e, t, n, r, i, o, a) {
                var s = [],
                    u = [],
                    c = [],
                    l = y,
                    f = 0;
                p(e._datatype) && (l = d.find(y, [e._datatype, e._datatype]) || y, f = d.convert(0, e._datatype));
                for (var h = function (e, t, n) {
                        e = o(e, t, n), l(e, f) || (s.push(e), u.push(t))
                    }, m = r; m <= i; m++) {
                    c.push(s.length);
                    for (var g = e._ptr[m], w = e._ptr[m + 1], x = t, b = g; b < w; b++) {
                        var C = e._index[b];
                        if (C >= t && C <= n) {
                            if (!a)
                                for (var M = x; M < C; M++) h(0, M - t, m - r);
                            h(e._values[b], C - t, m - r)
                        }
                        x = C + 1
                    }
                    if (!a)
                        for (var T = x; T <= n; T++) h(0, T - t, m - r)
                }
                return c.push(s.length), new v({
                    values: s,
                    index: u,
                    ptr: c,
                    size: [n - t + 1, i - r + 1]
                })
            };
            v.prototype.forEach = function (e, t) {
                if (!this._values) throw new Error("Cannot invoke forEach on a Pattern only matrix");
                for (var n = this, r = this._size[0], i = this._size[1], o = 0; o < i; o++) {
                    for (var a = this._ptr[o], s = this._ptr[o + 1], u = 0, c = a; c < s; c++) {
                        var l = this._index[c];
                        if (!t)
                            for (var f = u; f < l; f++) e(0, [f, o], n);
                        e(this._values[c], [l, o], n), u = l + 1
                    }
                    if (!t)
                        for (var h = u; h < r; h++) e(0, [h, o], n)
                }
            }, v.prototype.toArray = function () {
                return S(this._values, this._index, this._ptr, this._size, !0)
            }, v.prototype.valueOf = function () {
                return S(this._values, this._index, this._ptr, this._size, !1)
            };
            var S = function (e, t, n, r, i) {
                var o, a, u = r[0],
                    c = r[1],
                    l = [];
                for (o = 0; o < u; o++)
                    for (l[o] = [], a = 0; a < c; a++) l[o][a] = 0;
                for (a = 0; a < c; a++)
                    for (var f = n[a], h = n[a + 1], p = f; p < h; p++) o = t[p], l[o][a] = e ? i ? s.clone(e[p]) : e[p] : 1;
                return l
            };
            return v.prototype.format = function (e) {
                for (var t = this._size[0], n = this._size[1], r = this.density(), i = "Sparse Matrix [" + u.format(t, e) + " x " + u.format(n, e) + "] density: " + u.format(r, e) + "\n", o = 0; o < n; o++)
                    for (var a = this._ptr[o], s = this._ptr[o + 1], c = a; c < s; c++) {
                        var l = this._index[c];
                        i += "\n    (" + u.format(l, e) + ", " + u.format(o, e) + ") ==> " + (this._values ? u.format(this._values[c], e) : "X")
                    }
                return i
            }, v.prototype.toString = function () {
                return u.format(this.toArray())
            }, v.prototype.toJSON = function () {
                return {
                    mathjs: "SparseMatrix",
                    values: this._values,
                    index: this._index,
                    ptr: this._ptr,
                    size: this._size,
                    datatype: this._datatype
                }
            }, v.prototype.diagonal = function (e) {
                if (e) {
                    if (e.isBigNumber === !0 && (e = e.toNumber()), !f(e) || !h(e)) throw new TypeError("The parameter k must be an integer number")
                } else e = 0;
                var t = e > 0 ? e : 0,
                    n = e < 0 ? -e : 0,
                    r = this._size[0],
                    i = this._size[1],
                    o = Math.min(r - n, i - t),
                    a = [],
                    s = [],
                    u = [];
                u[0] = 0;
                for (var c = t; c < i && a.length < o; c++)
                    for (var l = this._ptr[c], p = this._ptr[c + 1], m = l; m < p; m++) {
                        var d = this._index[m];
                        if (d === c - t + n) {
                            a.push(this._values[m]), s[a.length - 1] = d - n;
                            break
                        }
                    }
                return u.push(a.length), new v({
                    values: a,
                    index: s,
                    ptr: u,
                    size: [o, 1]
                })
            }, v.fromJSON = function (e) {
                return new v(e)
            }, v.diagonal = function (e, t, n, r, i) {
                if (!l(e)) throw new TypeError("Array expected, size parameter");
                if (2 !== e.length) throw new Error("Only two dimensions matrix are supported");
                if (e = e.map(function (e) {
                        if (e && e.isBigNumber === !0 && (e = e.toNumber()), !f(e) || !h(e) || e < 1) throw new Error("Size values must be positive integers");
                        return e
                    }), n) {
                    if (n.isBigNumber === !0 && (n = n.toNumber()), !f(n) || !h(n)) throw new TypeError("The parameter k must be an integer number")
                } else n = 0;
                var o = y,
                    a = 0;
                p(i) && (o = d.find(y, [i, i]) || y, a = d.convert(0, i));
                var s, u = n > 0 ? n : 0,
                    c = n < 0 ? -n : 0,
                    m = e[0],
                    g = e[1],
                    w = Math.min(m - c, g - u);
                if (l(t)) {
                    if (t.length !== w) throw new Error("Invalid value array length");
                    s = function (e) {
                        return t[e]
                    }
                } else if (t && t.isMatrix === !0) {
                    var x = t.size();
                    if (1 !== x.length || x[0] !== w) throw new Error("Invalid matrix length");
                    s = function (e) {
                        return t.get([e])
                    }
                } else s = function () {
                    return t
                };
                for (var b = [], C = [], M = [], T = 0; T < g; T++) {
                    M.push(b.length);
                    var N = T - u;
                    if (N >= 0 && N < w) {
                        var E = s(N);
                        o(E, a) || (C.push(N + c), b.push(E))
                    }
                }
                return M.push(b.length), new v({
                    values: b,
                    index: C,
                    ptr: M,
                    size: [m, g]
                })
            }, v.prototype.swapRows = function (e, t) {
                if (!(f(e) && h(e) && f(t) && h(t))) throw new Error("Row index must be positive integers");
                if (2 !== this._size.length) throw new Error("Only two dimensional matrix is supported");
                return m(e, this._size[0]), m(t, this._size[0]), v._swapRows(e, t, this._size[1], this._values, this._index, this._ptr), this
            }, v._forEachRow = function (e, t, n, r, i) {
                for (var o = r[e], a = r[e + 1], s = o; s < a; s++) i(n[s], t[s])
            }, v._swapRows = function (e, t, n, r, i, o) {
                for (var a = 0; a < n; a++) {
                    var s = o[a],
                        u = o[a + 1],
                        c = M(e, s, u, i),
                        l = M(t, s, u, i);
                    if (c < u && l < u && i[c] === e && i[l] === t) {
                        if (r) {
                            var f = r[c];
                            r[c] = r[l], r[l] = f
                        }
                    } else if (c < u && i[c] === e && (l >= u || i[l] !== t)) {
                        var h = r ? r[c] : void 0;
                        i.splice(l, 0, t), r && r.splice(l, 0, h), i.splice(l <= c ? c + 1 : c, 1), r && r.splice(l <= c ? c + 1 : c, 1)
                    } else if (l < u && i[l] === t && (c >= u || i[c] !== e)) {
                        var p = r ? r[l] : void 0;
                        i.splice(c, 0, e), r && r.splice(c, 0, p), i.splice(c <= l ? l + 1 : l, 1), r && r.splice(c <= l ? l + 1 : l, 1)
                    }
                }
            }, e.Matrix._storage.sparse = v, v
        }
        var i = n(25),
            o = n(9),
            a = i.array,
            s = i.object,
            u = i.string,
            c = i.number,
            l = Array.isArray,
            f = c.isNumber,
            h = c.isInteger,
            p = u.isString,
            m = a.validateIndex;
        t.name = "SparseMatrix", t.path = "type", t.factory = r, t.lazy = !1
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            return r("index", {
                "...number | string | BigNumber | Range | Array | Matrix": function (t) {
                    var n = t.map(function (e) {
                            return e && e.isBigNumber === !0 ? e.toNumber() : e && (Array.isArray(e) || e.isMatrix === !0) ? e.map(function (e) {
                                return e && e.isBigNumber === !0 ? e.toNumber() : e
                            }) : e
                        }),
                        r = new e.Index;
                    return e.Index.apply(r, n), r
                }
            })
        }
        t.name = "index", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = e.SparseMatrix,
                o = r("sparse", {
                    "": function () {
                        return new i([])
                    },
                    string: function (e) {
                        return new i([], e)
                    },
                    "Array | Matrix": function (e) {
                        return new i(e)
                    },
                    "Array | Matrix, string": function (e, t) {
                        return new i(e, t)
                    }
                });
            return o.toTex = {
                0: "\\begin{bsparse}\\end{bsparse}",
                1: "\\left(${args[0]}\\right)"
            }, o
        }
        t.name = "sparse", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(75), n(133), n(492), n(491), n(488), n(489), n(490), n(134), n(493), n(0), n(494)]
    }, function (e, t, n) {
        e.exports = [n(136)]
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var a = r("string", {
                "": function () {
                    return ""
                },
                number: o.format,
                null: function (e) {
                    return "null"
                },
                boolean: function (e) {
                    return e + ""
                },
                string: function (e) {
                    return e
                },
                "Array | Matrix": function (e) {
                    return i(e, a)
                },
                any: function (e) {
                    return String(e)
                }
            });
            return a.toTex = {
                0: '\\mathtt{""}',
                1: "\\mathrm{string}\\left(${args[0]}\\right)"
            }, a
        }
        var i = n(1),
            o = n(2);
        t.name = "string", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = r("createUnit", {
                "Object, Object": function (t, n) {
                    return e.Unit.createUnit(t, n)
                },
                Object: function (t) {
                    return e.Unit.createUnit(t, {})
                },
                "string, Unit | string | Object, Object": function (t, n, r) {
                    var i = {};
                    return i[t] = n, e.Unit.createUnit(i, r)
                },
                "string, Unit | string | Object": function (t, n) {
                    var r = {};
                    return r[t] = n, e.Unit.createUnit(r, {})
                },
                string: function (t) {
                    var n = {};
                    return n[t] = {}, e.Unit.createUnit(n, {})
                }
            });
            return i
        }
        n(1), t.name = "createUnit", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = r("splitUnit", {
                "Unit, Array": function (e, t) {
                    return e.splitUnit(t)
                }
            });
            return i
        }
        n(1), t.name = "splitUnit", t.factory = r
    }, function (e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var o = r("unit", {
                Unit: function (e) {
                    return e.clone()
                },
                string: function (t) {
                    return e.Unit.isValuelessUnit(t) ? new e.Unit(null, t) : e.Unit.parse(t)
                },
                "number | BigNumber | Fraction | Complex, string": function (t, n) {
                    return new e.Unit(t, n)
                },
                "Array | Matrix": function (e) {
                    return i(e, o)
                }
            });
            return o.toTex = {
                1: "\\left(${args[0]}\\right)",
                2: "\\left(\\left(${args[0]}\\right)${args[1]}\\right)"
            }, o
        }
        var i = n(1);
        t.name = "unit", t.factory = r
    }, function (e, t, n) {
        e.exports = [n(137), n(500), n(498), n(499), n(502)]
    }, function (e, t, n) {
        function r(e, t, n, r, o) {
            function a(t) {
                var n = e.Unit.parse(t);
                return n.fixPrefix = !0, n
            }
            i(o, "speedOfLight", function () {
                return a("299792458 m s^-1")
            }), i(o, "gravitationConstant", function () {
                return a("6.6738480e-11 m^3 kg^-1 s^-2")
            }), i(o, "planckConstant", function () {
                return a("6.626069311e-34 J s")
            }), i(o, "reducedPlanckConstant", function () {
                return a("1.05457172647e-34 J s")
            }), i(o, "magneticConstant", function () {
                return a("1.2566370614e-6 N A^-2")
            }), i(o, "electricConstant", function () {
                return a("8.854187817e-12 F m^-1")
            }), i(o, "vacuumImpedance", function () {
                return a("376.730313461 ohm")
            }), i(o, "coulomb", function () {
                return a("8.9875517873681764e9 N m^2 C^-2")
            }), i(o, "elementaryCharge", function () {
                return a("1.60217656535e-19 C")
            }), i(o, "bohrMagneton", function () {
                return a("9.2740096820e-24 J T^-1")
            }), i(o, "conductanceQuantum", function () {
                return a("7.748091734625e-5 S")
            }), i(o, "inverseConductanceQuantum", function () {
                return a("12906.403721742 ohm")
            }), i(o, "magneticFluxQuantum", function () {
                return a("2.06783375846e-15 Wb")
            }), i(o, "nuclearMagneton", function () {
                return a("5.0507835311e-27 J T^-1")
            }), i(o, "klitzing", function () {
                return a("25812.807443484 ohm")
            }), i(o, "bohrRadius", function () {
                return a("5.291772109217e-11 m")
            }), i(o, "classicalElectronRadius", function () {
                return a("2.817940326727e-15 m")
            }), i(o, "electronMass", function () {
                return a("9.1093829140e-31 kg")
            }), i(o, "fermiCoupling", function () {
                return a("1.1663645e-5 GeV^-2")
            }), i(o, "fineStructure", function () {
                return .007297352569824
            }), i(o, "hartreeEnergy", function () {
                return a("4.3597443419e-18 J")
            }), i(o, "protonMass", function () {
                return a("1.67262177774e-27 kg")
            }), i(o, "deuteronMass", function () {
                return a("3.3435830926e-27 kg")
            }), i(o, "neutronMass", function () {
                return a("1.6749271613e-27 kg")
            }), i(o, "quantumOfCirculation", function () {
                return a("3.636947552024e-4 m^2 s^-1")
            }), i(o, "rydberg", function () {
                return a("10973731.56853955 m^-1")
            }), i(o, "thomsonCrossSection", function () {
                return a("6.65245873413e-29 m^2")
            }), i(o, "weakMixingAngle", function () {
                return .222321
            }), i(o, "efimovFactor", function () {
                return 22.7
            }), i(o, "atomicMass", function () {
                return a("1.66053892173e-27 kg")
            }), i(o, "avogadro", function () {
                return a("6.0221412927e23 mol^-1")
            }), i(o, "boltzmann", function () {
                return a("1.380648813e-23 J K^-1")
            }), i(o, "faraday", function () {
                return a("96485.336521 C mol^-1")
            }), i(o, "firstRadiation", function () {
                return a("3.7417715317e-16 W m^2")
            }), i(o, "loschmidt", function () {
                return a("2.686780524e25 m^-3")
            }), i(o, "gasConstant", function () {
                return a("8.314462175 J K^-1 mol^-1")
            }), i(o, "molarPlanckConstant", function () {
                return a("3.990312717628e-10 J s mol^-1")
            }), i(o, "molarVolume", function () {
                return a("2.241396820e-10 m^3 mol^-1")
            }), i(o, "sackurTetrode", function () {
                return -1.164870823
            }), i(o, "secondRadiation", function () {
                return a("1.438777013e-2 m K")
            }), i(o, "stefanBoltzmann", function () {
                return a("5.67037321e-8 W m^-2 K^-4")
            }), i(o, "wienDisplacement", function () {
                return a("2.897772126e-3 m K")
            }), i(o, "molarMass", function () {
                return a("1e-3 kg mol^-1")
            }), i(o, "molarMassC12", function () {
                return a("1.2e-2 kg mol^-1")
            }), i(o, "gravity", function () {
                return a("9.80665 m s^-2")
            }), i(o, "planckLength", function () {
                return a("1.61619997e-35 m")
            }), i(o, "planckMass", function () {
                return a("2.1765113e-8 kg")
            }), i(o, "planckTime", function () {
                return a("5.3910632e-44 s")
            }), i(o, "planckCharge", function () {
                return a("1.87554595641e-18 C")
            }), i(o, "planckTemperature", function () {
                return a("1.41683385e+32 K")
            })
        }

        function i(e, t, n) {
            o(e, t, n), o(e.expression.mathWithTransform, t, n)
        }
        var o = n(5).lazy;
        t.factory = r, t.lazy = !1, t.math = !0
    }, function (e, t, n) {
        var r = n(80);
        e.exports = function (e, t) {
            if (e.isFinite() && !e.isInteger() || t.isFinite() && !t.isInteger()) throw new Error("Integers expected in function bitAnd");
            var n = e.constructor;
            if (e.isNaN() || t.isNaN()) return new n(NaN);
            if (e.isZero() || t.eq(-1) || e.eq(t)) return e;
            if (t.isZero() || e.eq(-1)) return t;
            if (!e.isFinite() || !t.isFinite()) {
                if (!e.isFinite() && !t.isFinite()) return e.isNegative() == t.isNegative() ? e : new n(0);
                if (!e.isFinite()) return t.isNegative() ? e : e.isNegative() ? new n(0) : t;
                if (!t.isFinite()) return e.isNegative() ? t : t.isNegative() ? new n(0) : e
            }
            return r(e, t, function (e, t) {
                return e & t
            })
        }
    }, function (e, t, n) {
        var r = n(80);
        e.exports = function (e, t) {
            if (e.isFinite() && !e.isInteger() || t.isFinite() && !t.isInteger()) throw new Error("Integers expected in function bitOr");
            var n = e.constructor;
            if (e.isNaN() || t.isNaN()) return new n(NaN);
            var i = new n(-1);
            return e.isZero() || t.eq(i) || e.eq(t) ? t : t.isZero() || e.eq(i) ? e : e.isFinite() && t.isFinite() ? r(e, t, function (e, t) {
                return e | t
            }) : !e.isFinite() && !e.isNegative() && t.isNegative() || e.isNegative() && !t.isNegative() && !t.isFinite() ? i : e.isNegative() && t.isNegative() ? e.isFinite() ? e : t : e.isFinite() ? t : e
        }
    }, function (e, t, n) {
        var r = n(80),
            i = n(79);
        e.exports = function (e, t) {
            if (e.isFinite() && !e.isInteger() || t.isFinite() && !t.isInteger()) throw new Error("Integers expected in function bitXor");
            var n = e.constructor;
            if (e.isNaN() || t.isNaN()) return new n(NaN);
            if (e.isZero()) return t;
            if (t.isZero()) return e;
            if (e.eq(t)) return new n(0);
            var o = new n(-1);
            return e.eq(o) ? i(t) : t.eq(o) ? i(e) : e.isFinite() && t.isFinite() ? r(e, t, function (e, t) {
                return e ^ t
            }) : e.isFinite() || t.isFinite() ? new n(e.isNegative() == t.isNegative() ? 1 / 0 : -(1 / 0)) : o
        }
    }, function (e, t) {
        t.format = function (e, n) {
            if ("function" == typeof n) return n(e);
            if (!e.isFinite()) return e.isNaN() ? "NaN" : e.gt(0) ? "Infinity" : "-Infinity";
            var r = "auto",
                i = void 0;
            switch (void 0 !== n && (n.notation && (r = n.notation), "number" == typeof n ? i = n : n.precision && (i = n.precision)), r) {
                case "fixed":
                    return t.toFixed(e, i);
                case "exponential":
                    return t.toExponential(e, i);
                case "auto":
                    var o = .001,
                        a = 1e5;
                    if (n && n.exponential && (void 0 !== n.exponential.lower && (o = n.exponential.lower), void 0 !== n.exponential.upper && (a = n.exponential.upper)), {
                            toExpNeg: e.constructor.toExpNeg,
                            toExpPos: e.constructor.toExpPos
                        }, e.constructor.config({
                            toExpNeg: Math.round(Math.log(o) / Math.LN10),
                            toExpPos: Math.round(Math.log(a) / Math.LN10)
                        }), e.isZero()) return "0";
                    var s, u = e.abs();
                    return s = u.gte(o) && u.lt(a) ? e.toSignificantDigits(i).toFixed() : t.toExponential(e, i), s.replace(/((\.\d*?)(0+))($|e)/, function () {
                        var e = arguments[2],
                            t = arguments[4];
                        return "." !== e ? e + t : t
                    });
                default:
                    throw new Error('Unknown notation "' + r + '". Choose "auto", "exponential", or "fixed".')
            }
        }, t.toExponential = function (e, t) {
            return void 0 !== t ? e.toExponential(t - 1) : e.toExponential()
        }, t.toFixed = function (e, t) {
            return e.toFixed(t || 0)
        }
    }, function (e, t) {
        e.exports = function (e, t) {
            if (e.isFinite() && !e.isInteger() || t.isFinite() && !t.isInteger()) throw new Error("Integers expected in function leftShift");
            var n = e.constructor;
            return e.isNaN() || t.isNaN() || t.isNegative() && !t.isZero() ? new n(NaN) : e.isZero() || t.isZero() ? e : e.isFinite() || t.isFinite() ? t.lt(55) ? e.times(Math.pow(2, t.toNumber()) + "") : e.times(new n(2).pow(t)) : new n(NaN)
        }
    }, function (e, t) {
        e.exports = function (e, t) {
            if (e.isFinite() && !e.isInteger() || t.isFinite() && !t.isInteger()) throw new Error("Integers expected in function rightArithShift");
            var n = e.constructor;
            return e.isNaN() || t.isNaN() || t.isNegative() && !t.isZero() ? new n(NaN) : e.isZero() || t.isZero() ? e : t.isFinite() ? t.lt(55) ? e.div(Math.pow(2, t.toNumber()) + "").floor() : e.div(new n(2).pow(t)).floor() : new n(e.isNegative() ? -1 : e.isFinite() ? 0 : NaN)
        }
    }, function (e, t, n) {
        "use strict";
        t.isBoolean = function (e) {
            return "boolean" == typeof e
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e, t, n, r, i, o, a, s, u, c, l) {
            var f, h, p, m, d = e._values,
                v = e._index,
                g = e._ptr,
                y = a._index;
            if (r)
                for (h = g[t], p = g[t + 1], f = h; f < p; f++) m = v[f], n[m] !== o ? (n[m] = o, y.push(m), c ? (r[m] = u ? s(d[f], l) : s(l, d[f]), i[m] = o) : r[m] = d[f]) : (r[m] = u ? s(d[f], r[m]) : s(r[m], d[f]), i[m] = o);
            else
                for (h = g[t], p = g[t + 1], f = h; f < p; f++) m = v[f], n[m] !== o ? (n[m] = o, y.push(m)) : i[m] = o
        }
    }, function (e, t) {
        e.exports = "3.13.3"
    }, function (e, t, n) {
        var r, i;
        ! function (n) {
            "use strict";

            function o(e, t) {
                var n = Math.abs(e),
                    r = Math.abs(t);
                return 0 === e ? Math.log(r) : 0 === t ? Math.log(n) : n < 3e3 && r < 3e3 ? .5 * Math.log(e * e + t * t) : Math.log(e / Math.cos(Math.atan2(t, e)))
            }

            function a(e, t) {
                return this instanceof a ? (c(e, t), this.re = s.re, void(this.im = s.im)) : new a(e, t)
            }
            var s = {
                re: 0,
                im: 0
            };
            Math.cosh = Math.cosh || function (e) {
                return .5 * (Math.exp(e) + Math.exp(-e))
            }, Math.sinh = Math.sinh || function (e) {
                return .5 * (Math.exp(e) - Math.exp(-e))
            };
            var u = function () {
                    throw SyntaxError("Invalid Param")
                },
                c = function (e, t) {
                    if (void 0 === e || null === e) s.re = s.im = 0;
                    else if (void 0 !== t) s.re = e, s.im = t;
                    else switch (typeof e) {
                        case "object":
                            "im" in e && "re" in e ? (s.re = e.re, s.im = e.im) : "abs" in e && "arg" in e ? (s.re = e.abs * Math.cos(e.arg), s.im = e.abs * Math.sin(e.arg)) : "r" in e && "phi" in e ? (s.re = e.r * Math.cos(e.phi), s.im = e.r * Math.sin(e.phi)) : u();
                            break;
                        case "string":
                            s.im = s.re = 0;
                            var n = e.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g),
                                r = 1,
                                i = 0;
                            null === n && u();
                            for (var o = 0; o < n.length; o++) {
                                var a = n[o];
                                " " === a || "\t" === a || "\n" === a || ("+" === a ? r++ : "-" === a ? i++ : "i" === a || "I" === a ? (r + i === 0 && u(), " " === n[o + 1] || isNaN(n[o + 1]) ? s.im += parseFloat((i % 2 ? "-" : "") + "1") : (s.im += parseFloat((i % 2 ? "-" : "") + n[o + 1]), o++), r = i = 0) : ((r + i === 0 || isNaN(a)) && u(), "i" === n[o + 1] || "I" === n[o + 1] ? (s.im += parseFloat((i % 2 ? "-" : "") + a), o++) : s.re += parseFloat((i % 2 ? "-" : "") + a), r = i = 0))
                            }
                            r + i > 0 && u();
                            break;
                        case "number":
                            s.im = 0, s.re = e;
                            break;
                        default:
                            u()
                    }
                    isNaN(s.re) || isNaN(s.im)
                };
            a.prototype = {
                re: 0,
                im: 0,
                sign: function () {
                    var e = this.abs();
                    return new a(this.re / e, this.im / e)
                },
                add: function (e, t) {
                    return c(e, t), new a(this.re + s.re, this.im + s.im)
                },
                sub: function (e, t) {
                    return c(e, t), new a(this.re - s.re, this.im - s.im)
                },
                mul: function (e, t) {
                    return c(e, t), 0 === s.im && 0 === this.im ? new a(this.re * s.re, 0) : new a(this.re * s.re - this.im * s.im, this.re * s.im + this.im * s.re)
                },
                div: function (e, t) {
                    c(e, t), e = this.re, t = this.im;
                    var n, r, i = s.re,
                        o = s.im;
                    return 0 === i && 0 === o ? new a(0 !== e ? e / 0 : 0, 0 !== t ? t / 0 : 0) : 0 === o ? new a(e / i, t / i) : Math.abs(i) < Math.abs(o) ? (r = i / o, n = i * r + o, new a((e * r + t) / n, (t * r - e) / n)) : (r = o / i, n = o * r + i, new a((e + t * r) / n, (t - e * r) / n))
                },
                pow: function (e, t) {
                    if (c(e, t), e = this.re, t = this.im, 0 === e && 0 === t) return new a(0, 0);
                    var n = Math.atan2(t, e),
                        r = o(e, t);
                    if (0 === s.im) {
                        if (0 === t && e >= 0) return new a(Math.pow(e, s.re), 0);
                        if (0 === e) switch (s.re % 4) {
                            case 0:
                                return new a(Math.pow(t, s.re), 0);
                            case 1:
                                return new a(0, Math.pow(t, s.re));
                            case 2:
                                return new a(-Math.pow(t, s.re), 0);
                            case 3:
                                return new a(0, -Math.pow(t, s.re))
                        }
                    }
                    return e = Math.exp(s.re * r - s.im * n), t = s.im * r + s.re * n, new a(e * Math.cos(t), e * Math.sin(t))
                },
                sqrt: function () {
                    var e, t, n = this.re,
                        r = this.im,
                        i = this.abs();
                    return n >= 0 && 0 === r ? new a(Math.sqrt(n), 0) : (e = n >= 0 ? .5 * Math.sqrt(2 * (i + n)) : Math.abs(r) / Math.sqrt(2 * (i - n)), t = n <= 0 ? .5 * Math.sqrt(2 * (i - n)) : Math.abs(r) / Math.sqrt(2 * (i + n)), new a(e, r >= 0 ? t : -t))
                },
                exp: function () {
                    var e = Math.exp(this.re);
                    return 0 === this.im, new a(e * Math.cos(this.im), e * Math.sin(this.im))
                },
                log: function () {
                    var e = this.re,
                        t = this.im;
                    return new a(o(e, t), Math.atan2(t, e))
                },
                abs: function () {
                    var e = Math.abs(this.re),
                        t = Math.abs(this.im);
                    return e < 3e3 && t < 3e3 ? Math.sqrt(e * e + t * t) : (e < t ? (e = t, t = this.re / this.im) : t = this.im / this.re, e * Math.sqrt(1 + t * t))
                },
                arg: function () {
                    return Math.atan2(this.im, this.re)
                },
                sin: function () {
                    var e = this.re,
                        t = this.im;
                    return new a(Math.sin(e) * Math.cosh(t), Math.cos(e) * Math.sinh(t))
                },
                cos: function () {
                    var e = this.re,
                        t = this.im;
                    return new a(Math.cos(e) * Math.cosh(t), -Math.sin(e) * Math.sinh(t))
                },
                tan: function () {
                    var e = 2 * this.re,
                        t = 2 * this.im,
                        n = Math.cos(e) + Math.cosh(t);
                    return new a(Math.sin(e) / n, Math.sinh(t) / n)
                },
                cot: function () {
                    var e = 2 * this.re,
                        t = 2 * this.im,
                        n = Math.cos(e) - Math.cosh(t);
                    return new a(-Math.sin(e) / n, Math.sinh(t) / n)
                },
                sec: function () {
                    var e = this.re,
                        t = this.im,
                        n = .5 * Math.cosh(2 * t) + .5 * Math.cos(2 * e);
                    return new a(Math.cos(e) * Math.cosh(t) / n, Math.sin(e) * Math.sinh(t) / n)
                },
                csc: function () {
                    var e = this.re,
                        t = this.im,
                        n = .5 * Math.cosh(2 * t) - .5 * Math.cos(2 * e);
                    return new a(Math.sin(e) * Math.cosh(t) / n, -Math.cos(e) * Math.sinh(t) / n)
                },
                asin: function () {
                    var e = this.re,
                        t = this.im,
                        n = new a(t * t - e * e + 1, -2 * e * t).sqrt(),
                        r = new a(n.re - t, n.im + e).log();
                    return new a(r.im, -r.re)
                },
                acos: function () {
                    var e = this.re,
                        t = this.im,
                        n = new a(t * t - e * e + 1, -2 * e * t).sqrt(),
                        r = new a(n.re - t, n.im + e).log();
                    return new a(Math.PI / 2 - r.im, r.re)
                },
                atan: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === e) {
                        if (1 === t) return new a(0, 1 / 0);
                        if (t === -1) return new a(0, -(1 / 0))
                    }
                    var n = e * e + (1 - t) * (1 - t),
                        r = new a((1 - t * t - e * e) / n, -2 * e / n).log();
                    return new a(-.5 * r.im, .5 * r.re)
                },
                acot: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === t) return new a(Math.atan2(1, e), 0);
                    var n = e * e + t * t;
                    return 0 !== n ? new a(e / n, -t / n).atan() : new a(0 !== e ? e / 0 : 0, 0 !== t ? -t / 0 : 0).atan()
                },
                asec: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === e && 0 === t) return new a(0, 1 / 0);
                    var n = e * e + t * t;
                    return 0 !== n ? new a(e / n, -t / n).acos() : new a(0 !== e ? e / 0 : 0, 0 !== t ? -t / 0 : 0).acos()
                },
                acsc: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === e && 0 === t) return new a(Math.PI / 2, 1 / 0);
                    var n = e * e + t * t;
                    return 0 !== n ? new a(e / n, -t / n).asin() : new a(0 !== e ? e / 0 : 0, 0 !== t ? -t / 0 : 0).asin()
                },
                sinh: function () {
                    var e = this.re,
                        t = this.im;
                    return new a(Math.sinh(e) * Math.cos(t), Math.cosh(e) * Math.sin(t))
                },
                cosh: function () {
                    var e = this.re,
                        t = this.im;
                    return new a(Math.cosh(e) * Math.cos(t), Math.sinh(e) * Math.sin(t))
                },
                tanh: function () {
                    var e = 2 * this.re,
                        t = 2 * this.im,
                        n = Math.cosh(e) + Math.cos(t);
                    return new a(Math.sinh(e) / n, Math.sin(t) / n)
                },
                coth: function () {
                    var e = 2 * this.re,
                        t = 2 * this.im,
                        n = Math.cosh(e) - Math.cos(t);
                    return new a(Math.sinh(e) / n, -Math.sin(t) / n)
                },
                csch: function () {
                    var e = this.re,
                        t = this.im,
                        n = Math.cos(2 * t) - Math.cosh(2 * e);
                    return new a(-2 * Math.sinh(e) * Math.cos(t) / n, 2 * Math.cosh(e) * Math.sin(t) / n)
                },
                sech: function () {
                    var e = this.re,
                        t = this.im,
                        n = Math.cos(2 * t) + Math.cosh(2 * e);
                    return new a(2 * Math.cosh(e) * Math.cos(t) / n, -2 * Math.sinh(e) * Math.sin(t) / n)
                },
                asinh: function () {
                    var e = this.im;
                    this.im = -this.re, this.re = e;
                    var t = this.asin();
                    return this.re = -this.im, this.im = e, e = t.re, t.re = -t.im, t.im = e, t
                },
                acosh: function () {
                    var e, t = this.acos();
                    return t.im <= 0 ? (e = t.re, t.re = -t.im, t.im = e) : (e = t.im, t.im = -t.re, t.re = e), t
                },
                atanh: function () {
                    var e = this.re,
                        t = this.im,
                        n = e > 1 && 0 === t,
                        r = 1 - e,
                        i = 1 + e,
                        s = r * r + t * t,
                        u = 0 !== s ? new a((i * r - t * t) / s, (t * r + i * t) / s) : new a(e !== -1 ? e / 0 : 0, 0 !== t ? t / 0 : 0),
                        c = u.re;
                    return u.re = o(u.re, u.im) / 2, u.im = Math.atan2(u.im, c) / 2, n && (u.im = -u.im), u
                },
                acoth: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === e && 0 === t) return new a(0, Math.PI / 2);
                    var n = e * e + t * t;
                    return 0 !== n ? new a(e / n, -t / n).atanh() : new a(0 !== e ? e / 0 : 0, 0 !== t ? -t / 0 : 0).atanh()
                },
                acsch: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === t) return new a(0 !== e ? Math.log(e + Math.sqrt(e * e + 1)) : 1 / 0, 0);
                    var n = e * e + t * t;
                    return 0 !== n ? new a(e / n, -t / n).asinh() : new a(0 !== e ? e / 0 : 0, 0 !== t ? -t / 0 : 0).asinh()
                },
                asech: function () {
                    var e = this.re,
                        t = this.im;
                    if (0 === e && 0 === t) return new a(1 / 0, 0);
                    var n = e * e + t * t;
                    return 0 !== n ? new a(e / n, -t / n).acosh() : new a(0 !== e ? e / 0 : 0, 0 !== t ? -t / 0 : 0).acosh()
                },
                inverse: function () {
                    var e = this.re,
                        t = this.im,
                        n = e * e + t * t;
                    return new a(0 !== e ? e / n : 0, 0 !== t ? -t / n : 0)
                },
                conjugate: function () {
                    return new a(this.re, -this.im)
                },
                neg: function () {
                    return new a(-this.re, -this.im)
                },
                ceil: function (e) {
                    return e = Math.pow(10, e || 0), new a(Math.ceil(this.re * e) / e, Math.ceil(this.im * e) / e)
                },
                floor: function (e) {
                    return e = Math.pow(10, e || 0), new a(Math.floor(this.re * e) / e, Math.floor(this.im * e) / e)
                },
                round: function (e) {
                    return e = Math.pow(10, e || 0), new a(Math.round(this.re * e) / e, Math.round(this.im * e) / e)
                },
                equals: function (e, t) {
                    return c(e, t), Math.abs(s.re - this.re) <= a.EPSILON && Math.abs(s.im - this.im) <= a.EPSILON
                },
                clone: function () {
                    return new a(this.re, this.im)
                },
                toString: function () {
                    var e = this.re,
                        t = this.im,
                        n = "";
                    return isNaN(e) || isNaN(t) ? "NaN" : (0 !== e && (n += e), 0 !== t && (0 !== e ? n += t < 0 ? " - " : " + " : t < 0 && (n += "-"), t = Math.abs(t), 1 !== t && (n += t), n += "i"), n ? n : "0")
                },
                toVector: function () {
                    return [this.re, this.im]
                },
                valueOf: function () {
                    return 0 === this.im ? this.re : null
                },
                isNaN: function () {
                    return isNaN(this.re) || isNaN(this.im)
                }
            }, a.ZERO = new a(0, 0), a.ONE = new a(1, 0), a.I = new a(0, 1), a.PI = new a(Math.PI, 0), a.E = new a(Math.E, 0), a.EPSILON = 1e-16, r = [], i = function () {
                return a
            }.apply(t, r), !(void 0 !== i && (e.exports = i))
        }(this)
    }, function (e, t, n) {
        var r;
        ! function (i) {
            "use strict";

            function o(e) {
                var t, n, r, i = e.length - 1,
                    o = "",
                    a = e[0];
                if (i > 0) {
                    for (o += a, t = 1; t < i; t++) r = e[t] + "", n = ke - r.length, n && (o += v(n)), o += r;
                    a = e[t], r = a + "", n = ke - r.length, n && (o += v(n))
                } else if (0 === a) return "0";
                for (; a % 10 === 0;) a /= 10;
                return o + a
            }

            function a(e, t, n) {
                if (e !== ~~e || e < t || e > n) throw Error(Te + e)
            }

            function s(e, t, n, r) {
                var i, o, a, s;
                for (o = e[0]; o >= 10; o /= 10) --t;
                return --t < 0 ? (t += ke, i = 0) : (i = Math.ceil((t + 1) / ke), t %= ke), o = Se(10, ke - t), s = e[i] % o | 0, null == r ? t < 3 ? (0 == t ? s = s / 100 | 0 : 1 == t && (s = s / 10 | 0), a = n < 4 && 99999 == s || n > 3 && 49999 == s || 5e4 == s || 0 == s) : a = (n < 4 && s + 1 == o || n > 3 && s + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == Se(10, t - 2) - 1 || (s == o / 2 || 0 == s) && 0 == (e[i + 1] / o / 100 | 0) : t < 4 ? (0 == t ? s = s / 1e3 | 0 : 1 == t ? s = s / 100 | 0 : 2 == t && (s = s / 10 | 0), a = (r || n < 4) && 9999 == s || !r && n > 3 && 4999 == s) : a = ((r || n < 4) && s + 1 == o || !r && n > 3 && s + 1 == o / 2) && (e[i + 1] / o / 1e3 | 0) == Se(10, t - 3) - 1, a
            }

            function u(e, t, n) {
                for (var r, i, o = [0], a = 0, s = e.length; a < s;) {
                    for (i = o.length; i--;) o[i] *= t;
                    for (o[0] += ye.indexOf(e.charAt(a++)), r = 0; r < o.length; r++) o[r] > n - 1 && (void 0 === o[r + 1] && (o[r + 1] = 0), o[r + 1] += o[r] / n | 0, o[r] %= n)
                }
                return o.reverse()
            }

            function c(e, t) {
                var n, r, i = t.d.length;
                i < 32 ? (n = Math.ceil(i / 3), r = Math.pow(4, -n).toString()) : (n = 16, r = "2.3283064365386962890625e-10"), e.precision += n, t = E(e, 1, t.times(r), new e(1));
                for (var o = n; o--;) {
                    var a = t.times(t);
                    t = a.times(a).minus(a).times(8).plus(1)
                }
                return e.precision -= n, t
            }

            function l(e, t, n, r) {
                var i, o, a, s, u, c, l, f, h, p = e.constructor;
                e: if (null != t) {
                    if (f = e.d, !f) return e;
                    for (i = 1, s = f[0]; s >= 10; s /= 10) i++;
                    if (o = t - i, o < 0) o += ke, a = t, l = f[h = 0], u = l / Se(10, i - a - 1) % 10 | 0;
                    else if (h = Math.ceil((o + 1) / ke), s = f.length, h >= s) {
                        if (!r) break e;
                        for (; s++ <= h;) f.push(0);
                        l = u = 0, i = 1, o %= ke, a = o - ke + 1
                    } else {
                        for (l = s = f[h], i = 1; s >= 10; s /= 10) i++;
                        o %= ke, a = o - ke + i, u = a < 0 ? 0 : l / Se(10, i - a - 1) % 10 | 0
                    }
                    if (r = r || t < 0 || void 0 !== f[h + 1] || (a < 0 ? l : l % Se(10, i - a - 1)), c = n < 4 ? (u || r) && (0 == n || n == (e.s < 0 ? 3 : 2)) : u > 5 || 5 == u && (4 == n || r || 6 == n && (o > 0 ? a > 0 ? l / Se(10, i - a) : 0 : f[h - 1]) % 10 & 1 || n == (e.s < 0 ? 8 : 7)), t < 1 || !f[0]) return f.length = 0, c ? (t -= e.e + 1, f[0] = Se(10, (ke - t % ke) % ke), e.e = -t || 0) : f[0] = e.e = 0, e;
                    if (0 == o ? (f.length = h, s = 1, h--) : (f.length = h + 1, s = Se(10, ke - o), f[h] = a > 0 ? (l / Se(10, i - a) % Se(10, a) | 0) * s : 0), c)
                        for (;;) {
                            if (0 == h) {
                                for (o = 1, a = f[0]; a >= 10; a /= 10) o++;
                                for (a = f[0] += s, s = 1; a >= 10; a /= 10) s++;
                                o != s && (e.e++, f[0] == Be && (f[0] = 1));
                                break
                            }
                            if (f[h] += s, f[h] != Be) break;
                            f[h--] = 0, s = 1
                        }
                    for (o = f.length; 0 === f[--o];) f.pop()
                }
                return Ce && (e.e > p.maxE ? (e.d = null, e.e = NaN) : e.e < p.minE && (e.e = 0, e.d = [0])), e
            }

            function f(e, t, n) {
                if (!e.isFinite()) return C(e);
                var r, i = e.e,
                    a = o(e.d),
                    s = a.length;
                return t ? (n && (r = n - s) > 0 ? a = a.charAt(0) + "." + a.slice(1) + v(r) : s > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (e.e < 0 ? "e" : "e+") + e.e) : i < 0 ? (a = "0." + v(-i - 1) + a, n && (r = n - s) > 0 && (a += v(r))) : i >= s ? (a += v(i + 1 - s), n && (r = n - i - 1) > 0 && (a = a + "." + v(r))) : ((r = i + 1) < s && (a = a.slice(0, r) + "." + a.slice(r)), n && (r = n - s) > 0 && (i + 1 === s && (a += "."), a += v(r))), a
            }

            function h(e, t) {
                var n = e[0];
                for (t *= ke; n >= 10; n /= 10) t++;
                return t
            }

            function p(e, t, n) {
                if (t > ze) throw Ce = !0, n && (e.precision = n), Error(Ne);
                return l(new e(we), t, 1, !0)
            }

            function m(e, t, n) {
                if (t > Fe) throw Error(Ne);
                return l(new e(xe), t, n, !0)
            }

            function d(e) {
                var t = e.length - 1,
                    n = t * ke + 1;
                if (t = e[t]) {
                    for (; t % 10 == 0; t /= 10) n--;
                    for (t = e[0]; t >= 10; t /= 10) n++
                }
                return n
            }

            function v(e) {
                for (var t = ""; e--;) t += "0";
                return t
            }

            function g(e, t, n, r) {
                var i, o = new e(1),
                    a = Math.ceil(r / ke + 4);
                for (Ce = !1;;) {
                    if (n % 2 && (o = o.times(t), P(o.d, a) && (i = !0)), n = Ae(n / 2), 0 === n) {
                        n = o.d.length - 1, i && 0 === o.d[n] && ++o.d[n];
                        break
                    }
                    t = t.times(t), P(t.d, a)
                }
                return Ce = !0, o
            }

            function y(e) {
                return 1 & e.d[e.d.length - 1]
            }

            function w(e, t, n) {
                for (var r, i = new e(t[0]), o = 0; ++o < t.length;) {
                    if (r = new e(t[o]), !r.s) {
                        i = r;
                        break
                    }
                    i[n](r) && (i = r)
                }
                return i
            }

            function x(e, t) {
                var n, r, i, a, u, c, f, h = 0,
                    p = 0,
                    m = 0,
                    d = e.constructor,
                    v = d.rounding,
                    g = d.precision;
                if (!e.d || !e.d[0] || e.e > 17) return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
                for (null == t ? (Ce = !1, f = g) : f = t, c = new d(.03125); e.e > -2;) e = e.times(c), m += 5;
                for (r = Math.log(Se(2, m)) / Math.LN10 * 2 + 5 | 0, f += r, n = a = u = new d(1), d.precision = f;;) {
                    if (a = l(a.times(e), f, 1), n = n.times(++p), c = u.plus(Re(a, n, f, 1)), o(c.d).slice(0, f) === o(u.d).slice(0, f)) {
                        for (i = m; i--;) u = l(u.times(u), f, 1);
                        if (null != t) return d.precision = g, u;
                        if (!(h < 3 && s(u.d, f - r, v, h))) return l(u, d.precision = g, v, Ce = !0);
                        d.precision = f += 10, n = a = c = new d(1), p = 0, h++
                    }
                    u = c
                }
            }

            function b(e, t) {
                var n, r, i, a, u, c, f, h, m, d, v, g = 1,
                    y = 10,
                    w = e,
                    x = w.d,
                    C = w.constructor,
                    M = C.rounding,
                    T = C.precision;
                if (w.s < 0 || !x || !x[0] || !w.e && 1 == x[0] && 1 == x.length) return new C(x && !x[0] ? -1 / 0 : 1 != w.s ? NaN : x ? 0 : w);
                if (null == t ? (Ce = !1, m = T) : m = t, C.precision = m += y, n = o(x), r = n.charAt(0), !(Math.abs(a = w.e) < 15e14)) return h = p(C, m + 2, T).times(a + ""), w = b(new C(r + "." + n.slice(1)), m - y).plus(h), C.precision = T, null == t ? l(w, T, M, Ce = !0) : w;
                for (; r < 7 && 1 != r || 1 == r && n.charAt(1) > 3;) w = w.times(e), n = o(w.d), r = n.charAt(0), g++;
                for (a = w.e, r > 1 ? (w = new C("0." + n), a++) : w = new C(r + "." + n.slice(1)), d = w, f = u = w = Re(w.minus(1), w.plus(1), m, 1), v = l(w.times(w), m, 1), i = 3;;) {
                    if (u = l(u.times(v), m, 1), h = f.plus(Re(u, new C(i), m, 1)), o(h.d).slice(0, m) === o(f.d).slice(0, m)) {
                        if (f = f.times(2), 0 !== a && (f = f.plus(p(C, m + 2, T).times(a + ""))), f = Re(f, new C(g), m, 1), null != t) return C.precision = T, f;
                        if (!s(f.d, m - y, M, c)) return l(f, C.precision = T, M, Ce = !0);
                        C.precision = m += y, h = u = w = Re(d.minus(1), d.plus(1), m, 1), v = l(w.times(w), m, 1), i = c = 1
                    }
                    f = h, i += 2
                }
            }

            function C(e) {
                return String(e.s * e.s / 0)
            }

            function M(e, t) {
                var n, r, i;
                for ((n = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (r = t.search(/e/i)) > 0 ? (n < 0 && (n = r), n += +t.slice(r + 1), t = t.substring(0, r)) : n < 0 && (n = t.length), r = 0; 48 === t.charCodeAt(r); r++);
                for (i = t.length; 48 === t.charCodeAt(i - 1); --i);
                if (t = t.slice(r, i)) {
                    if (i -= r, e.e = n = n - r - 1, e.d = [], r = (n + 1) % ke, n < 0 && (r += ke), r < i) {
                        for (r && e.d.push(+t.slice(0, r)), i -= ke; r < i;) e.d.push(+t.slice(r, r += ke));
                        t = t.slice(r), r = ke - t.length
                    } else r -= i;
                    for (; r--;) t += "0";
                    e.d.push(+t), Ce && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [0]))
                } else e.e = 0, e.d = [0];
                return e
            }

            function T(e, t) {
                var n, r, i, o, a, s, c, l, f;
                if ("Infinity" === t || "NaN" === t) return +t || (e.s = NaN), e.e = NaN, e.d = null, e;
                if (Oe.test(t)) n = 16, t = t.toLowerCase();
                else if (Pe.test(t)) n = 2;
                else {
                    if (!_e.test(t)) throw Error(Te + t);
                    n = 8
                }
                for (o = t.search(/p/i), o > 0 ? (c = +t.slice(o + 1), t = t.substring(2, o)) : t = t.slice(2), o = t.indexOf("."), a = o >= 0, r = e.constructor, a && (t = t.replace(".", ""), s = t.length, o = s - o, i = g(r, new r(n), o, 2 * o)), l = u(t, n, Be), f = l.length - 1, o = f; 0 === l[o]; --o) l.pop();
                return o < 0 ? new r(0 * e.s) : (e.e = h(l, f), e.d = l, Ce = !1, a && (e = Re(e, i, 4 * s)), c && (e = e.times(Math.abs(c) < 54 ? Math.pow(2, c) : be.pow(2, c))), Ce = !0, e)
            }

            function N(e, t) {
                var n, r = t.d.length;
                if (r < 3) return E(e, 2, t, t);
                n = 1.4 * Math.sqrt(r), n = n > 16 ? 16 : 0 | n, t = t.times(Math.pow(5, -n)), t = E(e, 2, t, t);
                for (var i, o = new e(5), a = new e(16), s = new e(20); n--;) i = t.times(t), t = t.times(o.plus(i.times(a.times(i).minus(s))));
                return t
            }

            function E(e, t, n, r, i) {
                var o, a, s, u, c = 1,
                    l = e.precision,
                    f = Math.ceil(l / ke);
                for (Ce = !1, u = n.times(n), s = new e(r);;) {
                    if (a = Re(s.times(u), new e(t++ * t++), l, 1), s = i ? r.plus(a) : r.minus(a), r = Re(a.times(u), new e(t++ * t++), l, 1), a = s.plus(r), void 0 !== a.d[f]) {
                        for (o = f; a.d[o] === s.d[o] && o--;);
                        if (o == -1) break
                    }
                    o = s, s = r, r = a, a = o, c++
                }
                return Ce = !0, a.d.length = f + 1, a
            }

            function A(e, t) {
                var n, r = t.s < 0,
                    i = m(e, e.precision, 1),
                    o = i.times(.5);
                if (t = t.abs(), t.lte(o)) return de = r ? 4 : 1, t;
                if (n = t.divToInt(i), n.isZero()) de = r ? 3 : 2;
                else {
                    if (t = t.minus(n.times(i)), t.lte(o)) return de = y(n) ? r ? 2 : 3 : r ? 4 : 1, t;
                    de = y(n) ? r ? 1 : 4 : r ? 3 : 2
                }
                return t.minus(i).abs()
            }

            function S(e, t, n, r) {
                var i, o, s, c, l, h, p, m, d, v = e.constructor,
                    g = void 0 !== n;
                if (g ? (a(n, 1, ge), void 0 === r ? r = v.rounding : a(r, 0, 8)) : (n = v.precision, r = v.rounding), e.isFinite()) {
                    for (p = f(e), s = p.indexOf("."), g ? (i = 2, 16 == t ? n = 4 * n - 3 : 8 == t && (n = 3 * n - 2)) : i = t, s >= 0 && (p = p.replace(".", ""), d = new v(1), d.e = p.length - s, d.d = u(f(d), 10, i), d.e = d.d.length), m = u(p, 10, i), o = l = m.length; 0 == m[--l];) m.pop();
                    if (m[0]) {
                        if (s < 0 ? o-- : (e = new v(e), e.d = m, e.e = o, e = Re(e, d, n, r, 0, i), m = e.d, o = e.e, h = me), s = m[n], c = i / 2, h = h || void 0 !== m[n + 1], h = r < 4 ? (void 0 !== s || h) && (0 === r || r === (e.s < 0 ? 3 : 2)) : s > c || s === c && (4 === r || h || 6 === r && 1 & m[n - 1] || r === (e.s < 0 ? 8 : 7)), m.length = n, h)
                            for (; ++m[--n] > i - 1;) m[n] = 0, n || (++o, m.unshift(1));
                        for (l = m.length; !m[l - 1]; --l);
                        for (s = 0, p = ""; s < l; s++) p += ye.charAt(m[s]);
                        if (g) {
                            if (l > 1)
                                if (16 == t || 8 == t) {
                                    for (s = 16 == t ? 4 : 3, --l; l % s; l++) p += "0";
                                    for (m = u(p, i, t), l = m.length; !m[l - 1]; --l);
                                    for (s = 1, p = "1."; s < l; s++) p += ye.charAt(m[s])
                                } else p = p.charAt(0) + "." + p.slice(1);
                            p = p + (o < 0 ? "p" : "p+") + o
                        } else if (o < 0) {
                            for (; ++o;) p = "0" + p;
                            p = "0." + p
                        } else if (++o > l)
                            for (o -= l; o--;) p += "0";
                        else o < l && (p = p.slice(0, o) + "." + p.slice(o))
                    } else p = g ? "0p+0" : "0";
                    p = (16 == t ? "0x" : 2 == t ? "0b" : 8 == t ? "0o" : "") + p
                } else p = C(e);
                return e.s < 0 ? "-" + p : p
            }

            function P(e, t) {
                if (e.length > t) return e.length = t, !0
            }

            function O(e) {
                return new this(e).abs()
            }

            function _(e) {
                return new this(e).acos()
            }

            function I(e) {
                return new this(e).acosh()
            }

            function B(e, t) {
                return new this(e).plus(t)
            }

            function k(e) {
                return new this(e).asin()
            }

            function V(e) {
                return new this(e).asinh()
            }

            function z(e) {
                return new this(e).atan()
            }

            function F(e) {
                return new this(e).atanh()
            }

            function D(e, t) {
                e = new this(e), t = new this(t);
                var n, r = this.precision,
                    i = this.rounding,
                    o = r + 4;
                return e.s && t.s ? e.d || t.d ? !t.d || e.isZero() ? (n = t.s < 0 ? m(this, r, i) : new this(0), n.s = e.s) : !e.d || t.isZero() ? (n = m(this, o, 1).times(.5), n.s = e.s) : t.s < 0 ? (this.precision = o, this.rounding = 1, n = this.atan(Re(e, t, o, 1)), t = m(this, o, 1), this.precision = r, this.rounding = i, n = e.s < 0 ? n.minus(t) : n.plus(t)) : n = this.atan(Re(e, t, o, 1)) : (n = m(this, o, 1).times(t.s > 0 ? .25 : .75), n.s = e.s) : n = new this(NaN), n
            }

            function R(e) {
                return new this(e).cbrt()
            }

            function U(e) {
                return l(e = new this(e), e.e + 1, 2)
            }

            function L(e) {
                if (!e || "object" != typeof e) throw Error(Me + "Object expected");
                var t, n, r, i = ["precision", 1, ge, "rounding", 0, 8, "toExpNeg", -ve, 0, "toExpPos", 0, ve, "maxE", 0, ve, "minE", -ve, 0, "modulo", 0, 9];
                for (t = 0; t < i.length; t += 3)
                    if (void 0 !== (r = e[n = i[t]])) {
                        if (!(Ae(r) === r && r >= i[t + 1] && r <= i[t + 2])) throw Error(Te + n + ": " + r);
                        this[n] = r
                    } if (void 0 !== (r = e[n = "crypto"])) {
                    if (r !== !0 && r !== !1 && 0 !== r && 1 !== r) throw Error(Te + n + ": " + r);
                    if (r) {
                        if ("undefined" == typeof crypto || !crypto || !crypto.getRandomValues && !crypto.randomBytes) throw Error(Ee);
                        this[n] = !0
                    } else this[n] = !1
                }
                return this
            }

            function q(e) {
                return new this(e).cos()
            }

            function j(e) {
                return new this(e).cosh()
            }

            function W(e) {
                function t(e) {
                    var n, r, i, o = this;
                    if (!(o instanceof t)) return new t(e);
                    if (o.constructor = t, e instanceof t) return o.s = e.s, o.e = e.e, void(o.d = (e = e.d) ? e.slice() : e);
                    if (i = typeof e, "number" === i) {
                        if (0 === e) return o.s = 1 / e < 0 ? -1 : 1, o.e = 0, void(o.d = [0]);
                        if (e < 0 ? (e = -e, o.s = -1) : o.s = 1, e === ~~e && e < 1e7) {
                            for (n = 0, r = e; r >= 10; r /= 10) n++;
                            return o.e = n, void(o.d = [e])
                        }
                        return 0 * e !== 0 ? (e || (o.s = NaN), o.e = NaN, void(o.d = null)) : M(o, e.toString())
                    }
                    if ("string" !== i) throw Error(Te + e);
                    return 45 === e.charCodeAt(0) ? (e = e.slice(1), o.s = -1) : o.s = 1, Ie.test(e) ? M(o, e) : T(o, e)
                }
                var n, r, i;
                if (t.prototype = De, t.ROUND_UP = 0, t.ROUND_DOWN = 1, t.ROUND_CEIL = 2, t.ROUND_FLOOR = 3, t.ROUND_HALF_UP = 4, t.ROUND_HALF_DOWN = 5, t.ROUND_HALF_EVEN = 6, t.ROUND_HALF_CEIL = 7, t.ROUND_HALF_FLOOR = 8, t.EUCLID = 9, t.config = t.set = L, t.clone = W, t.abs = O, t.acos = _, t.acosh = I, t.add = B, t.asin = k, t.asinh = V, t.atan = z, t.atanh = F, t.atan2 = D, t.cbrt = R, t.ceil = U, t.cos = q, t.cosh = j, t.div = G, t.exp = H, t.floor = $, t.hypot = Z, t.ln = Y, t.log = X, t.log10 = Q, t.log2 = J, t.max = K, t.min = ee, t.mod = te, t.mul = ne, t.pow = re, t.random = ie, t.round = oe, t.sign = ae, t.sin = se, t.sinh = ue, t.sqrt = ce, t.sub = le, t.tan = fe, t.tanh = he, t.trunc = pe, void 0 === e && (e = {}), e)
                    for (i = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], n = 0; n < i.length;) e.hasOwnProperty(r = i[n++]) || (e[r] = this[r]);
                return t.config(e), t
            }

            function G(e, t) {
                return new this(e).div(t)
            }

            function H(e) {
                return new this(e).exp()
            }

            function $(e) {
                return l(e = new this(e), e.e + 1, 3)
            }

            function Z() {
                var e, t, n = new this(0);
                for (Ce = !1, e = 0; e < arguments.length;)
                    if (t = new this(arguments[e++]), t.d) n.d && (n = n.plus(t.times(t)));
                    else {
                        if (t.s) return Ce = !0, new this(1 / 0);
                        n = t
                    } return Ce = !0, n.sqrt()
            }

            function Y(e) {
                return new this(e).ln()
            }

            function X(e, t) {
                return new this(e).log(t)
            }

            function J(e) {
                return new this(e).log(2)
            }

            function Q(e) {
                return new this(e).log(10)
            }

            function K() {
                return w(this, arguments, "lt")
            }

            function ee() {
                return w(this, arguments, "gt")
            }

            function te(e, t) {
                return new this(e).mod(t)
            }

            function ne(e, t) {
                return new this(e).mul(t)
            }

            function re(e, t) {
                return new this(e).pow(t)
            }

            function ie(e) {
                var t, n, r, i, o = 0,
                    s = new this(1),
                    u = [];
                if (void 0 === e ? e = this.precision : a(e, 1, ge), r = Math.ceil(e / ke), this.crypto)
                    if (crypto.getRandomValues)
                        for (t = crypto.getRandomValues(new Uint32Array(r)); o < r;) i = t[o], i >= 429e7 ? t[o] = crypto.getRandomValues(new Uint32Array(1))[0] : u[o++] = i % 1e7;
                    else {
                        if (!crypto.randomBytes) throw Error(Ee);
                        for (t = crypto.randomBytes(r *= 4); o < r;) i = t[o] + (t[o + 1] << 8) + (t[o + 2] << 16) + ((127 & t[o + 3]) << 24), i >= 214e7 ? crypto.randomBytes(4).copy(t, o) : (u.push(i % 1e7), o += 4);
                        o = r / 4
                    }
                else
                    for (; o < r;) u[o++] = 1e7 * Math.random() | 0;
                for (r = u[--o], e %= ke, r && e && (i = Se(10, ke - e), u[o] = (r / i | 0) * i); 0 === u[o]; o--) u.pop();
                if (o < 0) n = 0, u = [0];
                else {
                    for (n = -1; 0 === u[0]; n -= ke) u.shift();
                    for (r = 1, i = u[0]; i >= 10; i /= 10) r++;
                    r < ke && (n -= ke - r)
                }
                return s.e = n, s.d = u, s
            }

            function oe(e) {
                return l(e = new this(e), e.e + 1, this.rounding)
            }

            function ae(e) {
                return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN
            }

            function se(e) {
                return new this(e).sin()
            }

            function ue(e) {
                return new this(e).sinh()
            }

            function ce(e) {
                return new this(e).sqrt()
            }

            function le(e, t) {
                return new this(e).sub(t)
            }

            function fe(e) {
                return new this(e).tan()
            }

            function he(e) {
                return new this(e).tanh()
            }

            function pe(e) {
                return l(e = new this(e), e.e + 1, 1)
            }
            var me, de, ve = 9e15,
                ge = 1e9,
                ye = "0123456789abcdef",
                we = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058",
                xe = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789",
                be = {
                    precision: 20,
                    rounding: 4,
                    modulo: 1,
                    toExpNeg: -7,
                    toExpPos: 21,
                    minE: -ve,
                    maxE: ve,
                    crypto: !1
                },
                Ce = !0,
                Me = "[DecimalError] ",
                Te = Me + "Invalid argument: ",
                Ne = Me + "Precision limit exceeded",
                Ee = Me + "crypto unavailable",
                Ae = Math.floor,
                Se = Math.pow,
                Pe = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
                Oe = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
                _e = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
                Ie = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
                Be = 1e7,
                ke = 7,
                Ve = 9007199254740991,
                ze = we.length - 1,
                Fe = xe.length - 1,
                De = {};
            De.absoluteValue = De.abs = function () {
                var e = new this.constructor(this);
                return e.s < 0 && (e.s = 1), l(e)
            }, De.ceil = function () {
                return l(new this.constructor(this), this.e + 1, 2)
            }, De.comparedTo = De.cmp = function (e) {
                var t, n, r, i, o = this,
                    a = o.d,
                    s = (e = new o.constructor(e)).d,
                    u = o.s,
                    c = e.s;
                if (!a || !s) return u && c ? u !== c ? u : a === s ? 0 : !a ^ u < 0 ? 1 : -1 : NaN;
                if (!a[0] || !s[0]) return a[0] ? u : s[0] ? -c : 0;
                if (u !== c) return u;
                if (o.e !== e.e) return o.e > e.e ^ u < 0 ? 1 : -1;
                for (r = a.length, i = s.length, t = 0, n = r < i ? r : i; t < n; ++t)
                    if (a[t] !== s[t]) return a[t] > s[t] ^ u < 0 ? 1 : -1;
                return r === i ? 0 : r > i ^ u < 0 ? 1 : -1
            }, De.cosine = De.cos = function () {
                var e, t, n = this,
                    r = n.constructor;
                return n.d ? n.d[0] ? (e = r.precision, t = r.rounding, r.precision = e + Math.max(n.e, n.sd()) + ke, r.rounding = 1, n = c(r, A(r, n)), r.precision = e, r.rounding = t, l(2 == de || 3 == de ? n.neg() : n, e, t, !0)) : new r(1) : new r(NaN)
            }, De.cubeRoot = De.cbrt = function () {
                var e, t, n, r, i, a, s, u, c, f, h = this,
                    p = h.constructor;
                if (!h.isFinite() || h.isZero()) return new p(h);
                for (Ce = !1, a = h.s * Math.pow(h.s * h, 1 / 3), a && Math.abs(a) != 1 / 0 ? r = new p(a.toString()) : (n = o(h.d), e = h.e, (a = (e - n.length + 1) % 3) && (n += 1 == a || a == -2 ? "0" : "00"), a = Math.pow(n, 1 / 3), e = Ae((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), a == 1 / 0 ? n = "5e" + e : (n = a.toExponential(), n = n.slice(0, n.indexOf("e") + 1) + e), r = new p(n), r.s = h.s), s = (e = p.precision) + 3;;)
                    if (u = r, c = u.times(u).times(u), f = c.plus(h), r = Re(f.plus(h).times(u), f.plus(c), s + 2, 1), o(u.d).slice(0, s) === (n = o(r.d)).slice(0, s)) {
                        if (n = n.slice(s - 3, s + 1), "9999" != n && (i || "4999" != n)) {
                            +n && (+n.slice(1) || "5" != n.charAt(0)) || (l(r, e + 1, 1), t = !r.times(r).times(r).eq(h));
                            break
                        }
                        if (!i && (l(u, e + 1, 0), u.times(u).times(u).eq(h))) {
                            r = u;
                            break
                        }
                        s += 4, i = 1
                    } return Ce = !0, l(r, e, p.rounding, t)
            }, De.decimalPlaces = De.dp = function () {
                var e, t = this.d,
                    n = NaN;
                if (t) {
                    if (e = t.length - 1, n = (e - Ae(this.e / ke)) * ke, e = t[e])
                        for (; e % 10 == 0; e /= 10) n--;
                    n < 0 && (n = 0)
                }
                return n
            }, De.dividedBy = De.div = function (e) {
                return Re(this, new this.constructor(e))
            }, De.dividedToIntegerBy = De.divToInt = function (e) {
                var t = this,
                    n = t.constructor;
                return l(Re(t, new n(e), 0, 1, 1), n.precision, n.rounding)
            }, De.equals = De.eq = function (e) {
                return 0 === this.cmp(e)
            }, De.floor = function () {
                return l(new this.constructor(this), this.e + 1, 3)
            }, De.greaterThan = De.gt = function (e) {
                return this.cmp(e) > 0
            }, De.greaterThanOrEqualTo = De.gte = function (e) {
                var t = this.cmp(e);
                return 1 == t || 0 === t
            }, De.hyperbolicCosine = De.cosh = function () {
                var e, t, n, r, i, o = this,
                    a = o.constructor,
                    s = new a(1);
                if (!o.isFinite()) return new a(o.s ? 1 / 0 : NaN);
                if (o.isZero()) return s;
                n = a.precision, r = a.rounding, a.precision = n + Math.max(o.e, o.sd()) + 4, a.rounding = 1, i = o.d.length, i < 32 ? (e = Math.ceil(i / 3), t = Math.pow(4, -e).toString()) : (e = 16, t = "2.3283064365386962890625e-10"), o = E(a, 1, o.times(t), new a(1), !0);
                for (var u, c = e, f = new a(8); c--;) u = o.times(o), o = s.minus(u.times(f.minus(u.times(f))));
                return l(o, a.precision = n, a.rounding = r, !0)
            }, De.hyperbolicSine = De.sinh = function () {
                var e, t, n, r, i = this,
                    o = i.constructor;
                if (!i.isFinite() || i.isZero()) return new o(i);
                if (t = o.precision, n = o.rounding, o.precision = t + Math.max(i.e, i.sd()) + 4, o.rounding = 1, r = i.d.length, r < 3) i = E(o, 2, i, i, !0);
                else {
                    e = 1.4 * Math.sqrt(r), e = e > 16 ? 16 : 0 | e, i = i.times(Math.pow(5, -e)), i = E(o, 2, i, i, !0);
                    for (var a, s = new o(5), u = new o(16), c = new o(20); e--;) a = i.times(i), i = i.times(s.plus(a.times(u.times(a).plus(c))))
                }
                return o.precision = t, o.rounding = n, l(i, t, n, !0)
            }, De.hyperbolicTangent = De.tanh = function () {
                var e, t, n = this,
                    r = n.constructor;
                return n.isFinite() ? n.isZero() ? new r(n) : (e = r.precision, t = r.rounding, r.precision = e + 7, r.rounding = 1, Re(n.sinh(), n.cosh(), r.precision = e, r.rounding = t)) : new r(n.s)
            }, De.inverseCosine = De.acos = function () {
                var e, t = this,
                    n = t.constructor,
                    r = t.abs().cmp(1),
                    i = n.precision,
                    o = n.rounding;
                return r !== -1 ? 0 === r ? t.isNeg() ? m(n, i, o) : new n(0) : new n(NaN) : t.isZero() ? m(n, i + 4, o).times(.5) : (n.precision = i + 6, n.rounding = 1, t = t.asin(), e = m(n, i + 4, o).times(.5), n.precision = i, n.rounding = o, e.minus(t))
            }, De.inverseHyperbolicCosine = De.acosh = function () {
                var e, t, n = this,
                    r = n.constructor;
                return n.lte(1) ? new r(n.eq(1) ? 0 : NaN) : n.isFinite() ? (e = r.precision, t = r.rounding, r.precision = e + Math.max(Math.abs(n.e), n.sd()) + 4, r.rounding = 1, Ce = !1, n = n.times(n).minus(1).sqrt().plus(n), Ce = !0, r.precision = e, r.rounding = t, n.ln()) : new r(n)
            }, De.inverseHyperbolicSine = De.asinh = function () {
                var e, t, n = this,
                    r = n.constructor;
                return !n.isFinite() || n.isZero() ? new r(n) : (e = r.precision, t = r.rounding, r.precision = e + 2 * Math.max(Math.abs(n.e), n.sd()) + 6, r.rounding = 1, Ce = !1, n = n.times(n).plus(1).sqrt().plus(n), Ce = !0, r.precision = e, r.rounding = t, n.ln())
            }, De.inverseHyperbolicTangent = De.atanh = function () {
                var e, t, n, r, i = this,
                    o = i.constructor;
                return i.isFinite() ? i.e >= 0 ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN) : (e = o.precision, t = o.rounding, r = i.sd(), Math.max(r, e) < 2 * -i.e - 1 ? l(new o(i), e, t, !0) : (o.precision = n = r - i.e, i = Re(i.plus(1), new o(1).minus(i), n + e, 1), o.precision = e + 4, o.rounding = 1, i = i.ln(), o.precision = e, o.rounding = t, i.times(.5))) : new o(NaN)
            }, De.inverseSine = De.asin = function () {
                var e, t, n, r, i = this,
                    o = i.constructor;
                return i.isZero() ? new o(i) : (t = i.abs().cmp(1), n = o.precision, r = o.rounding, t !== -1 ? 0 === t ? (e = m(o, n + 4, r).times(.5), e.s = i.s, e) : new o(NaN) : (o.precision = n + 6, o.rounding = 1, i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(), o.precision = n, o.rounding = r, i.times(2)))
            }, De.inverseTangent = De.atan = function () {
                var e, t, n, r, i, o, a, s, u, c = this,
                    f = c.constructor,
                    h = f.precision,
                    p = f.rounding;
                if (c.isFinite()) {
                    if (c.isZero()) return new f(c);
                    if (c.abs().eq(1) && h + 4 <= Fe) return a = m(f, h + 4, p).times(.25), a.s = c.s, a
                } else {
                    if (!c.s) return new f(NaN);
                    if (h + 4 <= Fe) return a = m(f, h + 4, p).times(.5), a.s = c.s, a
                }
                for (f.precision = s = h + 10, f.rounding = 1, n = Math.min(28, s / ke + 2 | 0), e = n; e; --e) c = c.div(c.times(c).plus(1).sqrt().plus(1));
                for (Ce = !1, t = Math.ceil(s / ke), r = 1, u = c.times(c), a = new f(c), i = c; e !== -1;)
                    if (i = i.times(u), o = a.minus(i.div(r += 2)), i = i.times(u), a = o.plus(i.div(r += 2)), void 0 !== a.d[t])
                        for (e = t; a.d[e] === o.d[e] && e--;);
                return n && (a = a.times(2 << n - 1)), Ce = !0, l(a, f.precision = h, f.rounding = p, !0)
            }, De.isFinite = function () {
                return !!this.d
            }, De.isInteger = De.isInt = function () {
                return !!this.d && Ae(this.e / ke) > this.d.length - 2
            }, De.isNaN = function () {
                return !this.s
            }, De.isNegative = De.isNeg = function () {
                return this.s < 0
            }, De.isPositive = De.isPos = function () {
                return this.s > 0
            }, De.isZero = function () {
                return !!this.d && 0 === this.d[0]
            }, De.lessThan = De.lt = function (e) {
                return this.cmp(e) < 0
            }, De.lessThanOrEqualTo = De.lte = function (e) {
                return this.cmp(e) < 1
            }, De.logarithm = De.log = function (e) {
                var t, n, r, i, a, u, c, f, h = this,
                    m = h.constructor,
                    d = m.precision,
                    v = m.rounding,
                    g = 5;
                if (null == e) e = new m(10), t = !0;
                else {
                    if (e = new m(e), n = e.d, e.s < 0 || !n || !n[0] || e.eq(1)) return new m(NaN);
                    t = e.eq(10)
                }
                if (n = h.d, h.s < 0 || !n || !n[0] || h.eq(1)) return new m(n && !n[0] ? -1 / 0 : 1 != h.s ? NaN : n ? 0 : 1 / 0);
                if (t)
                    if (n.length > 1) a = !0;
                    else {
                        for (i = n[0]; i % 10 === 0;) i /= 10;
                        a = 1 !== i
                    } if (Ce = !1, c = d + g, u = b(h, c), r = t ? p(m, c + 10) : b(e, c), f = Re(u, r, c, 1), s(f.d, i = d, v))
                    do
                        if (c += 10, u = b(h, c), r = t ? p(m, c + 10) : b(e, c), f = Re(u, r, c, 1), !a) {
                            +o(f.d).slice(i + 1, i + 15) + 1 == 1e14 && (f = l(f, d + 1, 0));
                            break
                        } while (s(f.d, i += 10, v));
                return Ce = !0, l(f, d, v)
            }, De.minus = De.sub = function (e) {
                var t, n, r, i, o, a, s, u, c, f, p, m, d = this,
                    v = d.constructor;
                if (e = new v(e), !d.d || !e.d) return d.s && e.s ? d.d ? e.s = -e.s : e = new v(e.d || d.s !== e.s ? d : NaN) : e = new v(NaN), e;
                if (d.s != e.s) return e.s = -e.s, d.plus(e);
                if (c = d.d, m = e.d, s = v.precision, u = v.rounding, !c[0] || !m[0]) {
                    if (m[0]) e.s = -e.s;
                    else {
                        if (!c[0]) return new v(3 === u ? -0 : 0);
                        e = new v(d)
                    }
                    return Ce ? l(e, s, u) : e
                }
                if (n = Ae(e.e / ke), f = Ae(d.e / ke), c = c.slice(), o = f - n) {
                    for (p = o < 0, p ? (t = c, o = -o, a = m.length) : (t = m, n = f, a = c.length), r = Math.max(Math.ceil(s / ke), a) + 2, o > r && (o = r, t.length = 1), t.reverse(), r = o; r--;) t.push(0);
                    t.reverse()
                } else {
                    for (r = c.length, a = m.length, p = r < a, p && (a = r), r = 0; r < a; r++)
                        if (c[r] != m[r]) {
                            p = c[r] < m[r];
                            break
                        } o = 0
                }
                for (p && (t = c, c = m, m = t, e.s = -e.s), a = c.length, r = m.length - a; r > 0; --r) c[a++] = 0;
                for (r = m.length; r > o;) {
                    if (c[--r] < m[r]) {
                        for (i = r; i && 0 === c[--i];) c[i] = Be - 1;
                        --c[i], c[r] += Be
                    }
                    c[r] -= m[r]
                }
                for (; 0 === c[--a];) c.pop();
                for (; 0 === c[0]; c.shift()) --n;
                return c[0] ? (e.d = c, e.e = h(c, n), Ce ? l(e, s, u) : e) : new v(3 === u ? -0 : 0)
            }, De.modulo = De.mod = function (e) {
                var t, n = this,
                    r = n.constructor;
                return e = new r(e), !n.d || !e.s || e.d && !e.d[0] ? new r(NaN) : !e.d || n.d && !n.d[0] ? l(new r(n), r.precision, r.rounding) : (Ce = !1, 9 == r.modulo ? (t = Re(n, e.abs(), 0, 3, 1), t.s *= e.s) : t = Re(n, e, 0, r.modulo, 1), t = t.times(e), Ce = !0, n.minus(t))
            }, De.naturalExponential = De.exp = function () {
                return x(this)
            }, De.naturalLogarithm = De.ln = function () {
                return b(this)
            }, De.negated = De.neg = function () {
                var e = new this.constructor(this);
                return e.s = -e.s, l(e)
            }, De.plus = De.add = function (e) {
                var t, n, r, i, o, a, s, u, c, f, p = this,
                    m = p.constructor;
                if (e = new m(e), !p.d || !e.d) return p.s && e.s ? p.d || (e = new m(e.d || p.s === e.s ? p : NaN)) : e = new m(NaN), e;
                if (p.s != e.s) return e.s = -e.s, p.minus(e);
                if (c = p.d, f = e.d, s = m.precision, u = m.rounding, !c[0] || !f[0]) return f[0] || (e = new m(p)), Ce ? l(e, s, u) : e;
                if (o = Ae(p.e / ke), r = Ae(e.e / ke), c = c.slice(), i = o - r) {
                    for (i < 0 ? (n = c, i = -i, a = f.length) : (n = f, r = o, a = c.length), o = Math.ceil(s / ke), a = o > a ? o + 1 : a + 1, i > a && (i = a, n.length = 1), n.reverse(); i--;) n.push(0);
                    n.reverse()
                }
                for (a = c.length, i = f.length, a - i < 0 && (i = a, n = f, f = c, c = n), t = 0; i;) t = (c[--i] = c[i] + f[i] + t) / Be | 0, c[i] %= Be;
                for (t && (c.unshift(t), ++r), a = c.length; 0 == c[--a];) c.pop();
                return e.d = c, e.e = h(c, r), Ce ? l(e, s, u) : e
            }, De.precision = De.sd = function (e) {
                var t, n = this;
                if (void 0 !== e && e !== !!e && 1 !== e && 0 !== e) throw Error(Te + e);
                return n.d ? (t = d(n.d), e && n.e + 1 > t && (t = n.e + 1)) : t = NaN, t
            }, De.round = function () {
                var e = this,
                    t = e.constructor;
                return l(new t(e), e.e + 1, t.rounding)
            }, De.sine = De.sin = function () {
                var e, t, n = this,
                    r = n.constructor;
                return n.isFinite() ? n.isZero() ? new r(n) : (e = r.precision, t = r.rounding, r.precision = e + Math.max(n.e, n.sd()) + ke, r.rounding = 1, n = N(r, A(r, n)), r.precision = e, r.rounding = t, l(de > 2 ? n.neg() : n, e, t, !0)) : new r(NaN)
            }, De.squareRoot = De.sqrt = function () {
                var e, t, n, r, i, a, s = this,
                    u = s.d,
                    c = s.e,
                    f = s.s,
                    h = s.constructor;
                if (1 !== f || !u || !u[0]) return new h(!f || f < 0 && (!u || u[0]) ? NaN : u ? s : 1 / 0);
                for (Ce = !1, f = Math.sqrt(+s), 0 == f || f == 1 / 0 ? (t = o(u), (t.length + c) % 2 == 0 && (t += "0"), f = Math.sqrt(t), c = Ae((c + 1) / 2) - (c < 0 || c % 2), f == 1 / 0 ? t = "1e" + c : (t = f.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + c), r = new h(t)) : r = new h(f.toString()), n = (c = h.precision) + 3;;)
                    if (a = r, r = a.plus(Re(s, a, n + 2, 1)).times(.5), o(a.d).slice(0, n) === (t = o(r.d)).slice(0, n)) {
                        if (t = t.slice(n - 3, n + 1), "9999" != t && (i || "4999" != t)) {
                            +t && (+t.slice(1) || "5" != t.charAt(0)) || (l(r, c + 1, 1), e = !r.times(r).eq(s));
                            break
                        }
                        if (!i && (l(a, c + 1, 0), a.times(a).eq(s))) {
                            r = a;
                            break
                        }
                        n += 4, i = 1
                    } return Ce = !0, l(r, c, h.rounding, e)
            }, De.tangent = De.tan = function () {
                var e, t, n = this,
                    r = n.constructor;
                return n.isFinite() ? n.isZero() ? new r(n) : (e = r.precision, t = r.rounding, r.precision = e + 10, r.rounding = 1, n = n.sin(), n.s = 1, n = Re(n, new r(1).minus(n.times(n)).sqrt(), e + 10, 0), r.precision = e, r.rounding = t, l(2 == de || 4 == de ? n.neg() : n, e, t, !0)) : new r(NaN)
            }, De.times = De.mul = function (e) {
                var t, n, r, i, o, a, s, u, c, f = this,
                    p = f.constructor,
                    m = f.d,
                    d = (e = new p(e)).d;
                if (e.s *= f.s, !(m && m[0] && d && d[0])) return new p(!e.s || m && !m[0] && !d || d && !d[0] && !m ? NaN : m && d ? 0 * e.s : e.s / 0);
                for (n = Ae(f.e / ke) + Ae(e.e / ke), u = m.length, c = d.length, u < c && (o = m, m = d, d = o, a = u, u = c, c = a), o = [], a = u + c, r = a; r--;) o.push(0);
                for (r = c; --r >= 0;) {
                    for (t = 0, i = u + r; i > r;) s = o[i] + d[r] * m[i - r - 1] + t, o[i--] = s % Be | 0, t = s / Be | 0;
                    o[i] = (o[i] + t) % Be | 0
                }
                for (; !o[--a];) o.pop();
                return t ? ++n : o.shift(), e.d = o, e.e = h(o, n), Ce ? l(e, p.precision, p.rounding) : e
            }, De.toBinary = function (e, t) {
                return S(this, 2, e, t)
            }, De.toDecimalPlaces = De.toDP = function (e, t) {
                var n = this,
                    r = n.constructor;
                return n = new r(n), void 0 === e ? n : (a(e, 0, ge), void 0 === t ? t = r.rounding : a(t, 0, 8), l(n, e + n.e + 1, t))
            }, De.toExponential = function (e, t) {
                var n, r = this,
                    i = r.constructor;
                return void 0 === e ? n = f(r, !0) : (a(e, 0, ge), void 0 === t ? t = i.rounding : a(t, 0, 8), r = l(new i(r), e + 1, t), n = f(r, !0, e + 1)), r.isNeg() && !r.isZero() ? "-" + n : n
            }, De.toFixed = function (e, t) {
                var n, r, i = this,
                    o = i.constructor;
                return void 0 === e ? n = f(i) : (a(e, 0, ge), void 0 === t ? t = o.rounding : a(t, 0, 8), r = l(new o(i), e + i.e + 1, t), n = f(r, !1, e + r.e + 1)), i.isNeg() && !i.isZero() ? "-" + n : n
            }, De.toFraction = function (e) {
                var t, n, r, i, a, s, u, c, l, f, h, p, m = this,
                    v = m.d,
                    g = m.constructor;
                if (!v) return new g(m);
                if (l = n = new g(1), r = c = new g(0), t = new g(r), a = t.e = d(v) - m.e - 1, s = a % ke, t.d[0] = Se(10, s < 0 ? ke + s : s), null == e) e = a > 0 ? t : l;
                else {
                    if (u = new g(e), !u.isInt() || u.lt(l)) throw Error(Te + u);
                    e = u.gt(t) ? a > 0 ? t : l : u
                }
                for (Ce = !1, u = new g(o(v)), f = g.precision, g.precision = a = v.length * ke * 2; h = Re(u, t, 0, 1, 1), i = n.plus(h.times(r)), 1 != i.cmp(e);) n = r, r = i, i = l, l = c.plus(h.times(i)), c = i, i = t, t = u.minus(h.times(i)), u = i;
                return i = Re(e.minus(n), r, 0, 1, 1), c = c.plus(i.times(l)), n = n.plus(i.times(r)), c.s = l.s = m.s, p = Re(l, r, a, 1).minus(m).abs().cmp(Re(c, n, a, 1).minus(m).abs()) < 1 ? [l, r] : [c, n], g.precision = f, Ce = !0, p
            }, De.toHexadecimal = De.toHex = function (e, t) {
                return S(this, 16, e, t)
            }, De.toNearest = function (e, t) {
                var n = this,
                    r = n.constructor;
                if (n = new r(n), null == e) {
                    if (!n.d) return n;
                    e = new r(1), t = r.rounding
                } else {
                    if (e = new r(e), void 0 !== t && a(t, 0, 8), !n.d) return e.s ? n : e;
                    if (!e.d) return e.s && (e.s = n.s), e
                }
                return e.d[0] ? (Ce = !1, t < 4 && (t = [4, 5, 7, 8][t]), n = Re(n, e, 0, t, 1).times(e), Ce = !0, l(n)) : (e.s = n.s, n = e), n
            }, De.toNumber = function () {
                return +this
            }, De.toOctal = function (e, t) {
                return S(this, 8, e, t)
            }, De.toPower = De.pow = function (e) {
                var t, n, r, i, a, u, c, f = this,
                    h = f.constructor,
                    p = +(e = new h(e));
                if (!(f.d && e.d && f.d[0] && e.d[0])) return new h(Se(+f, p));
                if (f = new h(f), f.eq(1)) return f;
                if (r = h.precision, a = h.rounding, e.eq(1)) return l(f, r, a);
                if (t = Ae(e.e / ke), n = e.d.length - 1, c = t >= n, u = f.s, c) {
                    if ((n = p < 0 ? -p : p) <= Ve) return i = g(h, f, n, r), e.s < 0 ? new h(1).div(i) : l(i, r, a)
                } else if (u < 0) return new h(NaN);
                return u = u < 0 && 1 & e.d[Math.max(t, n)] ? -1 : 1, n = Se(+f, p), t = 0 != n && isFinite(n) ? new h(n + "").e : Ae(p * (Math.log("0." + o(f.d)) / Math.LN10 + f.e + 1)), t > h.maxE + 1 || t < h.minE - 1 ? new h(t > 0 ? u / 0 : 0) : (Ce = !1, h.rounding = f.s = 1, n = Math.min(12, (t + "").length), i = x(e.times(b(f, r + n)), r), i = l(i, r + 5, 1), s(i.d, r, a) && (t = r + 10, i = l(x(e.times(b(f, t + n)), t), t + 5, 1), +o(i.d).slice(r + 1, r + 15) + 1 == 1e14 && (i = l(i, r + 1, 0))), i.s = u, Ce = !0, h.rounding = a, l(i, r, a))
            }, De.toPrecision = function (e, t) {
                var n, r = this,
                    i = r.constructor;
                return void 0 === e ? n = f(r, r.e <= i.toExpNeg || r.e >= i.toExpPos) : (a(e, 1, ge), void 0 === t ? t = i.rounding : a(t, 0, 8), r = l(new i(r), e, t), n = f(r, e <= r.e || r.e <= i.toExpNeg, e)), r.isNeg() && !r.isZero() ? "-" + n : n
            }, De.toSignificantDigits = De.toSD = function (e, t) {
                var n = this,
                    r = n.constructor;
                return void 0 === e ? (e = r.precision, t = r.rounding) : (a(e, 1, ge), void 0 === t ? t = r.rounding : a(t, 0, 8)), l(new r(n), e, t)
            }, De.toString = function () {
                var e = this,
                    t = e.constructor,
                    n = f(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
                return e.isNeg() && !e.isZero() ? "-" + n : n
            }, De.truncated = De.trunc = function () {
                return l(new this.constructor(this), this.e + 1, 1)
            }, De.valueOf = De.toJSON = function () {
                var e = this,
                    t = e.constructor,
                    n = f(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
                return e.isNeg() ? "-" + n : n
            };
            var Re = function () {
                function e(e, t, n) {
                    var r, i = 0,
                        o = e.length;
                    for (e = e.slice(); o--;) r = e[o] * t + i, e[o] = r % n | 0, i = r / n | 0;
                    return i && e.unshift(i), e
                }

                function t(e, t, n, r) {
                    var i, o;
                    if (n != r) o = n > r ? 1 : -1;
                    else
                        for (i = o = 0; i < n; i++)
                            if (e[i] != t[i]) {
                                o = e[i] > t[i] ? 1 : -1;
                                break
                            } return o
                }

                function n(e, t, n, r) {
                    for (var i = 0; n--;) e[n] -= i, i = e[n] < t[n] ? 1 : 0, e[n] = i * r + e[n] - t[n];
                    for (; !e[0] && e.length > 1;) e.shift()
                }
                return function (r, i, o, a, s, u) {
                    var c, f, h, p, m, d, v, g, y, w, x, b, C, M, T, N, E, A, S, P, O = r.constructor,
                        _ = r.s == i.s ? 1 : -1,
                        I = r.d,
                        B = i.d;
                    if (!(I && I[0] && B && B[0])) return new O(r.s && i.s && (I ? !B || I[0] != B[0] : B) ? I && 0 == I[0] || !B ? 0 * _ : _ / 0 : NaN);
                    for (u ? (m = 1, f = r.e - i.e) : (u = Be, m = ke, f = Ae(r.e / m) - Ae(i.e / m)), S = B.length, E = I.length, y = new O(_), w = y.d = [], h = 0; B[h] == (I[h] || 0); h++);
                    if (B[h] > (I[h] || 0) && f--, null == o ? (M = o = O.precision, a = O.rounding) : M = s ? o + (r.e - i.e) + 1 : o, M < 0) w.push(1), d = !0;
                    else {
                        if (M = M / m + 2 | 0, h = 0, 1 == S) {
                            for (p = 0, B = B[0], M++;
                                (h < E || p) && M--; h++) T = p * u + (I[h] || 0), w[h] = T / B | 0, p = T % B | 0;
                            d = p || h < E
                        } else {
                            for (p = u / (B[0] + 1) | 0, p > 1 && (B = e(B, p, u), I = e(I, p, u), S = B.length, E = I.length), N = S, x = I.slice(0, S), b = x.length; b < S;) x[b++] = 0;
                            P = B.slice(), P.unshift(0), A = B[0], B[1] >= u / 2 && ++A;
                            do p = 0, c = t(B, x, S, b), c < 0 ? (C = x[0], S != b && (C = C * u + (x[1] || 0)), p = C / A | 0, p > 1 ? (p >= u && (p = u - 1), v = e(B, p, u), g = v.length, b = x.length, c = t(v, x, g, b), 1 == c && (p--, n(v, S < g ? P : B, g, u))) : (0 == p && (c = p = 1), v = B.slice()), g = v.length, g < b && v.unshift(0), n(x, v, b, u), c == -1 && (b = x.length, c = t(B, x, S, b), c < 1 && (p++, n(x, S < b ? P : B, b, u))), b = x.length) : 0 === c && (p++, x = [0]), w[h++] = p, c && x[0] ? x[b++] = I[N] || 0 : (x = [I[N]], b = 1); while ((N++ < E || void 0 !== x[0]) && M--);
                            d = void 0 !== x[0]
                        }
                        w[0] || w.shift()
                    }
                    if (1 == m) y.e = f, me = d;
                    else {
                        for (h = 1, p = w[0]; p >= 10; p /= 10) h++;
                        y.e = h + f * m - 1, l(y, s ? o + y.e + 1 : o, a, d)
                    }
                    return y
                }
            }();
            be = W(be), we = new be(we), xe = new be(xe), r = function () {
                return be
            }.call(t, n, t, e), !(void 0 !== r && (e.exports = r))
        }(this)
    }, function (e, t, n) {
        var r, i;
        ! function (n) {
            "use strict";

            function o(e) {
                var t = function () {
                        var t = Error.apply(this, arguments);
                        t.name = this.name = e, this.stack = t.stack, this.message = t.message
                    },
                    n = function () {};
                return n.prototype = Error.prototype, t.prototype = new n, t
            }

            function a(e, t) {
                return isNaN(e = parseInt(e, 10)) && s(), e * t
            }

            function s() {
                throw new h
            }

            function u(e, t) {
                return this instanceof u ? (p(e, t), e = u.REDUCE ? g(l.d, l.n) : 1, this.s = l.s, this.n = l.n / e, void(this.d = l.d / e)) : new u(e, t)
            }
            var c = 2e3,
                l = {
                    s: 1,
                    n: 0,
                    d: 1
                },
                f = u.DivisionByZero = o("DivisionByZero"),
                h = u.InvalidParameter = o("InvalidParameter"),
                p = function (e, t) {
                    var n, r = 0,
                        i = 1,
                        o = 1,
                        u = 0,
                        c = 0,
                        h = 0,
                        p = 1,
                        m = 1,
                        d = 0,
                        v = 1,
                        g = 1,
                        y = 1,
                        w = 1e7;
                    if (void 0 === e || null === e);
                    else if (void 0 !== t) r = e, i = t, o = r * i;
                    else switch (typeof e) {
                        case "object":
                            "d" in e && "n" in e ? (r = e.n, i = e.d, "s" in e && (r *= e.s)) : 0 in e ? (r = e[0], 1 in e && (i = e[1])) : s(), o = r * i;
                            break;
                        case "number":
                            if (e < 0 && (o = e, e = -e), e % 1 === 0) r = e;
                            else if (e > 0) {
                                for (e >= 1 && (m = Math.pow(10, Math.floor(1 + Math.log(e) / Math.LN10)), e /= m); v <= w && y <= w;) {
                                    if (n = (d + g) / (v + y), e === n) {
                                        v + y <= w ? (r = d + g, i = v + y) : y > v ? (r = g, i = y) : (r = d, i = v);
                                        break
                                    }
                                    e > n ? (d += g, v += y) : (g += d, y += v), v > w ? (r = g, i = y) : (r = d, i = v)
                                }
                                r *= m
                            } else(isNaN(e) || isNaN(t)) && (i = r = NaN);
                            break;
                        case "string":
                            if (v = e.match(/\d+|./g), "-" === v[d] ? (o = -1, d++) : "+" === v[d] && d++, v.length === d + 1 ? c = a(v[d++], o) : "." === v[d + 1] || "." === v[d] ? ("." !== v[d] && (u = a(v[d++], o)), d++, (d + 1 === v.length || "(" === v[d + 1] && ")" === v[d + 3] || "'" === v[d + 1] && "'" === v[d + 3]) && (c = a(v[d], o), p = Math.pow(10, v[d].length), d++), ("(" === v[d] && ")" === v[d + 2] || "'" === v[d] && "'" === v[d + 2]) && (h = a(v[d + 1], o), m = Math.pow(10, v[d + 1].length) - 1, d += 3)) : "/" === v[d + 1] || ":" === v[d + 1] ? (c = a(v[d], o), p = a(v[d + 2], 1), d += 3) : "/" === v[d + 3] && " " === v[d + 1] && (u = a(v[d], o), c = a(v[d + 2], o), p = a(v[d + 4], 1), d += 5), v.length <= d) {
                                i = p * m, o = r = h + i * u + m * c;
                                break
                            }
                            default:
                                s()
                    }
                    if (0 === i) throw new f;
                    l.s = o < 0 ? -1 : 1, l.n = Math.abs(r), l.d = Math.abs(i)
                },
                m = function (e, t, n) {
                    for (var r = 1; t > 0; e = e * e % n, t >>= 1) 1 & t && (r = r * e % n);
                    return r
                },
                d = function (e, t) {
                    for (; t % 2 === 0; t /= 2);
                    for (; t % 5 === 0; t /= 5);
                    if (1 === t) return 0;
                    for (var n = 10 % t, r = 1; 1 !== n; r++)
                        if (n = 10 * n % t, r > c) return 0;
                    return r
                },
                v = function (e, t, n) {
                    for (var r = 1, i = m(10, n, t), o = 0; o < 300; o++) {
                        if (r === i) return o;
                        r = 10 * r % t, i = 10 * i % t
                    }
                    return 0
                },
                g = function (e, t) {
                    if (!e) return t;
                    if (!t) return e;
                    for (;;) {
                        if (e %= t, !e) return t;
                        if (t %= e, !t) return e
                    }
                };
            u.REDUCE = 1, u.prototype = {
                s: 1,
                n: 0,
                d: 1,
                abs: function () {
                    return new u(this.n, this.d)
                },
                neg: function () {
                    return new u(-this.s * this.n, this.d)
                },
                add: function (e, t) {
                    return p(e, t), new u(this.s * this.n * l.d + l.s * this.d * l.n, this.d * l.d)
                },
                sub: function (e, t) {
                    return p(e, t), new u(this.s * this.n * l.d - l.s * this.d * l.n, this.d * l.d)
                },
                mul: function (e, t) {
                    return p(e, t), new u(this.s * l.s * this.n * l.n, this.d * l.d)
                },
                div: function (e, t) {
                    return p(e, t), new u(this.s * l.s * this.n * l.d, this.d * l.n)
                },
                clone: function () {
                    return new u(this)
                },
                mod: function (e, t) {
                    return isNaN(this.n) || isNaN(this.d) ? new u(NaN) : void 0 === e ? new u(this.s * this.n % this.d, 1) : (p(e, t), 0 === l.n && 0 === this.d && u(0, 0), new u(this.s * l.d * this.n % (l.n * this.d), l.d * this.d))
                },
                gcd: function (e, t) {
                    return p(e, t), new u(g(l.n, this.n), l.d * this.d / g(l.d, this.d))
                },
                lcm: function (e, t) {
                    return p(e, t), 0 === l.n && 0 === this.n ? new u : new u(l.n * this.n / g(l.n, this.n), g(l.d, this.d))
                },
                ceil: function (e) {
                    return e = Math.pow(10, e || 0), isNaN(this.n) || isNaN(this.d) ? new u(NaN) : new u(Math.ceil(e * this.s * this.n / this.d), e)
                },
                floor: function (e) {
                    return e = Math.pow(10, e || 0), isNaN(this.n) || isNaN(this.d) ? new u(NaN) : new u(Math.floor(e * this.s * this.n / this.d), e)
                },
                round: function (e) {
                    return e = Math.pow(10, e || 0), isNaN(this.n) || isNaN(this.d) ? new u(NaN) : new u(Math.round(e * this.s * this.n / this.d), e)
                },
                inverse: function () {
                    return new u(this.s * this.d, this.n)
                },
                pow: function (e) {
                    return e < 0 ? new u(Math.pow(this.s * this.d, -e), Math.pow(this.n, -e)) : new u(Math.pow(this.s * this.n, e), Math.pow(this.d, e))
                },
                equals: function (e, t) {
                    return p(e, t), this.s * this.n * l.d === l.s * l.n * this.d
                },
                compare: function (e, t) {
                    p(e, t);
                    var n = this.s * this.n * l.d - l.s * l.n * this.d;
                    return (0 < n) - (n < 0)
                },
                divisible: function (e, t) {
                    return p(e, t), !(!(l.n * this.d) || this.n * l.d % (l.n * this.d))
                },
                valueOf: function () {
                    return this.s * this.n / this.d
                },
                toFraction: function (e) {
                    var t, n = "",
                        r = this.n,
                        i = this.d;
                    return this.s < 0 && (n += "-"), 1 === i ? n += r : (e && (t = Math.floor(r / i)) > 0 && (n += t, n += " ", r %= i), n += r, n += "/", n += i), n
                },
                toLatex: function (e) {
                    var t, n = "",
                        r = this.n,
                        i = this.d;
                    return this.s < 0 && (n += "-"), 1 === i ? n += r : (e && (t = Math.floor(r / i)) > 0 && (n += t, r %= i), n += "\\frac{", n += r, n += "}{", n += i, n += "}"), n
                },
                toContinued: function () {
                    var e, t = this.n,
                        n = this.d,
                        r = [];
                    do r.push(Math.floor(t / n)), e = t % n, t = n, n = e; while (1 !== t);
                    return r
                },
                toString: function () {
                    var e, t = this.n,
                        n = this.d;
                    if (isNaN(t) || isNaN(n)) return "NaN";
                    u.REDUCE || (e = g(t, n), t /= e, n /= e);
                    for (var r = String(t).split(""), i = 0, o = [~this.s ? "" : "-", "", ""], a = "", s = d(t, n), c = v(t, n, s), l = -1, f = 1, h = 15 + s + c + r.length, p = 0; p < h; p++, i *= 10) {
                        if (p < r.length ? i += Number(r[p]) : (f = 2, l++), s > 0)
                            if (l === c) o[f] += a + "(", a = "";
                            else if (l === s + c) {
                            o[f] += a + ")";
                            break
                        }
                        i >= n ? (o[f] += a + (i / n | 0), a = "", i %= n) : f > 1 ? a += "0" : o[f] && (o[f] += "0")
                    }
                    return o[0] += o[1] || "0", o[2] ? o[0] + "." + o[2] : o[0]
                }
            }, r = [], i = function () {
                return u
            }.apply(t, r), !(void 0 !== i && (e.exports = i))
        }(this)
    }, function (e, t, n) {
        "use strict";
        (function (t) {
            function n(e) {
                var t, n = e.length,
                    r = this,
                    i = 0,
                    o = r.i = r.j = 0,
                    a = r.S = [];
                for (n || (e = [n++]); i < s;) a[i] = i++;
                for (i = 0; i < s; i++) a[i] = a[o = d & o + e[i % n] + (t = a[i])], a[o] = t;
                (r.g = function (e) {
                    for (var t, n = 0, i = r.i, o = r.j, a = r.S; e--;) t = a[i = d & i + 1], n = n * s + a[d & (a[i] = a[o = d & o + t]) + (a[o] = t)];
                    return r.i = i, r.j = o, n
                })(s)
            }

            function r(e, t) {
                var n, i = [],
                    o = (typeof e)[0];
                if (t && "o" == o)
                    for (n in e) try {
                        i.push(r(e[n], t - 1))
                    } catch (e) {}
                return i.length ? i : "s" == o ? e : e + "\0"
            }

            function i(e, t) {
                for (var n, r = e + "", i = 0; i < r.length;) t[d & i] = d & (n ^= 19 * t[d & i]) + r.charCodeAt(i++);
                return a(t)
            }

            function o(e) {
                try {
                    return f.crypto.getRandomValues(e = new Uint8Array(s)), a(e)
                } catch (e) {
                    return [+new Date, f, f.navigator && f.navigator.plugins, f.screen, a(l)]
                }
            }

            function a(e) {
                return String.fromCharCode.apply(0, e)
            }
            var s = 256,
                u = 6,
                c = 52,
                l = [],
                f = "undefined" == typeof t ? window : t,
                h = Math.pow(s, u),
                p = Math.pow(2, c),
                m = 2 * p,
                d = s - 1,
                v = Math.random;
            e.exports = function (t, c) {
                if (c && c.global === !0) return c.global = !1, Math.random = e.exports(t, c), c.global = !0, Math.random;
                var f = c && c.entropy || !1,
                    d = [],
                    v = (i(r(f ? [t, a(l)] : 0 in arguments ? t : o(), 3), d), new n(d));
                return i(a(v.S), l),
                    function () {
                        for (var e = v.g(u), t = h, n = 0; e < p;) e = (e + n) * s, t *= s, n = v.g(1);
                        for (; e >= m;) e /= 2, t /= 2, n >>>= 1;
                        return (e + n) / t
                    }
            }, e.exports.resetGlobal = function () {
                Math.random = v
            }, i(Math.random(), l)
        }).call(t, n(518))
    }, function (e, t) {
        function n() {}
        n.prototype = {
            on: function (e, t, n) {
                var r = this.e || (this.e = {});
                return (r[e] || (r[e] = [])).push({
                    fn: t,
                    ctx: n
                }), this
            },
            once: function (e, t, n) {
                function r() {
                    i.off(e, r), t.apply(n, arguments)
                }
                var i = this;
                return r._ = t, this.on(e, r, n)
            },
            emit: function (e) {
                var t = [].slice.call(arguments, 1),
                    n = ((this.e || (this.e = {}))[e] || []).slice(),
                    r = 0,
                    i = n.length;
                for (r; r < i; r++) n[r].fn.apply(n[r].ctx, t);
                return this
            },
            off: function (e, t) {
                var n = this.e || (this.e = {}),
                    r = n[e],
                    i = [];
                if (r && t)
                    for (var o = 0, a = r.length; o < a; o++) r[o].fn !== t && r[o].fn._ !== t && i.push(r[o]);
                return i.length ? n[e] = i : delete n[e], this
            }
        }, e.exports = n
    }, function (e, t, n) {
        "use strict";
        var r, i, o;
        ! function (n, a) {
            i = [], r = a, o = "function" == typeof r ? r.apply(t, i) : r, !(void 0 !== o && (e.exports = o))
        }(this, function () {
            function e() {
                function t(e) {
                    for (var t, n = 0; n < T.types.length; n++) {
                        var r = T.types[n];
                        if (r.name === e) {
                            t = r.test;
                            break
                        }
                    }
                    if (!t) {
                        var i;
                        for (n = 0; n < T.types.length; n++)
                            if (r = T.types[n], r.name.toLowerCase() == e.toLowerCase()) {
                                i = r.name;
                                break
                            } throw new Error('Unknown type "' + e + '"' + (i ? '. Did you mean "' + i + '"?' : ""))
                    }
                    return t
                }

                function n(e) {
                    for (var t = "", n = 0; n < e.length; n++) {
                        var r = e[n];
                        if (r.signatures && "" != r.name)
                            if ("" == t) t = r.name;
                            else if (t != r.name) {
                            var i = new Error("Function names do not match (expected: " + t + ", actual: " + r.name + ")");
                            throw i.data = {
                                actual: r.name,
                                expected: t
                            }, i
                        }
                    }
                    return t
                }

                function r(e, t, n, r, i) {
                    var o, a = d(r),
                        s = i ? i.split(",") : null,
                        u = e || "unnamed",
                        c = s && v(s, "any"),
                        l = {
                            fn: e,
                            index: n,
                            actual: r,
                            expected: s
                        };
                    o = s ? t > n && !c ? "Unexpected type of argument in function " + u + " (expected: " + s.join(" or ") + ", actual: " + a + ", index: " + n + ")" : "Too few arguments in function " + u + " (expected: " + s.join(" or ") + ", index: " + n + ")" : "Too many arguments in function " + u + " (expected: " + n + ", actual: " + t + ")";
                    var f = new TypeError(o);
                    return f.data = l, f
                }

                function i(e) {
                    this.name = e || "refs", this.categories = {}
                }

                function o(e, t) {
                    if ("string" == typeof e) {
                        var n = e.trim(),
                            r = "..." === n.substr(0, 3);
                        if (r && (n = n.substr(3)), "" === n) this.types = ["any"];
                        else {
                            this.types = n.split("|");
                            for (var i = 0; i < this.types.length; i++) this.types[i] = this.types[i].trim()
                        }
                    } else {
                        if (!Array.isArray(e)) {
                            if (e instanceof o) return e.clone();
                            throw new Error("String or Array expected")
                        }
                        this.types = e
                    }
                    this.conversions = [], this.varArgs = r || t || !1, this.anyType = this.types.indexOf("any") !== -1
                }

                function a(e, t) {
                    var n;
                    if ("string" == typeof e) n = "" !== e ? e.split(",") : [];
                    else {
                        if (!Array.isArray(e)) throw new Error("string or Array expected");
                        n = e
                    }
                    this.params = new Array(n.length), this.anyType = !1, this.varArgs = !1;
                    for (var r = 0; r < n.length; r++) {
                        var i = new o(n[r]);
                        if (this.params[r] = i, i.anyType && (this.anyType = !0), r === n.length - 1) this.varArgs = i.varArgs;
                        else if (i.varArgs) throw new SyntaxError('Unexpected variable arguments operator "..."')
                    }
                    this.fn = t
                }

                function s(e, t, n, r) {
                    this.path = e || [], this.param = e[e.length - 1] || null, this.signature = t || null, this.childs = n || [], this.fallThrough = r || !1
                }

                function u(e) {
                    var t, n, r = {},
                        i = [];
                    for (var o in e)
                        if (e.hasOwnProperty(o)) {
                            var s = e[o];
                            if (t = new a(o, s), t.ignore()) continue;
                            var u = t.expand();
                            for (n = 0; n < u.length; n++) {
                                var c = u[n],
                                    l = c.toString(),
                                    f = r[l];
                                if (f) {
                                    var h = a.compare(c, f);
                                    if (h < 0) r[l] = c;
                                    else if (0 === h) throw new Error('Signature "' + l + '" is defined twice')
                                } else r[l] = c
                            }
                        } for (l in r) r.hasOwnProperty(l) && i.push(r[l]);
                    for (i.sort(function (e, t) {
                            return a.compare(e, t)
                        }), n = 0; n < i.length; n++)
                        if (t = i[n], t.varArgs)
                            for (var p = t.params.length - 1, m = t.params[p], d = 0; d < m.types.length;) {
                                if (m.conversions[d])
                                    for (var g = m.types[d], y = 0; y < i.length; y++) {
                                        var w = i[y],
                                            x = w.params[p];
                                        if (w !== t && x && v(x.types, g) && !x.conversions[p]) {
                                            m.types.splice(d, 1), m.conversions.splice(d, 1), d--;
                                            break
                                        }
                                    }
                                d++
                            }
                    return i
                }

                function c(e) {
                    for (var t = [], n = 0; n < e.length; n++) e[n].anyType && t.push(e[n]);
                    return t
                }

                function l(e) {
                    for (var t = {}, n = 0; n < e.length; n++) {
                        var r = e[n];
                        if (r.fn && !r.hasConversions()) {
                            var i = r.params.join(",");
                            t[i] = r.fn
                        }
                    }
                    return t
                }

                function f(e, t, n) {
                    var r, i, a, u = t.length,
                        c = [];
                    for (r = 0; r < e.length; r++) i = e[r], i.params.length !== u || a || (a = i), void 0 != i.params[u] && c.push(i);
                    c.sort(function (e, t) {
                        return o.compare(e.params[u], t.params[u])
                    });
                    var l = [];
                    for (r = 0; r < c.length; r++) {
                        i = c[r];
                        var h = i.params[u],
                            p = l.filter(function (e) {
                                return e.param.overlapping(h)
                            })[0];
                        if (p) {
                            if (p.param.varArgs) throw new Error('Conflicting types "' + p.param + '" and "' + h + '"');
                            p.signatures.push(i)
                        } else l.push({
                            param: h,
                            signatures: [i]
                        })
                    }
                    var m = [];
                    for (r = 0; r < n.length; r++) n[r].paramsStartWith(t) && m.push(n[r]);
                    var d = !1;
                    for (r = 0; r < m.length; r++)
                        if (!v(e, m[r])) {
                            d = !0;
                            break
                        } var g = new Array(l.length);
                    for (r = 0; r < l.length; r++) {
                        var y = l[r];
                        g[r] = f(y.signatures, t.concat(y.param), m)
                    }
                    return new s(t, a, g, d)
                }

                function h(e) {
                    for (var t = [], n = 0; n < e; n++) t[n] = "arg" + n;
                    return t
                }

                function p(e, t) {
                    var n = new i,
                        o = u(t);
                    if (0 == o.length) throw new Error("No signatures provided");
                    var a = c(o),
                        s = f(o, [], a),
                        p = [],
                        d = e || "",
                        v = h(m(o));
                    p.push("function " + d + "(" + v.join(", ") + ") {"), p.push('  "use strict";'), p.push("  var name = '" + d + "';"), p.push(s.toCode(n, "  ", !1)), p.push("}");
                    var g = [n.toCode(), "return " + p.join("\n")].join("\n"),
                        y = new Function(n.name, "createError", g),
                        w = y(n, r);
                    return w.signatures = l(o), w
                }

                function m(e) {
                    for (var t = 0, n = 0; n < e.length; n++) {
                        var r = e[n].params.length;
                        r > t && (t = r)
                    }
                    return t
                }

                function d(e) {
                    for (var t, n = 0; n < T.types.length; n++) {
                        var r = T.types[n];
                        if ("Object" === r.name) t = r;
                        else if (r.test(e)) return r.name
                    }
                    return t && t.test(e) ? t.name : "unknown"
                }

                function v(e, t) {
                    return e.indexOf(t) !== -1
                }

                function g(e) {
                    return e[e.length - 1]
                }

                function y(e, t) {
                    if (!e.signatures) throw new TypeError("Function is no typed-function");
                    var n;
                    if ("string" == typeof t) {
                        n = t.split(",");
                        for (var r = 0; r < n.length; r++) n[r] = n[r].trim()
                    } else {
                        if (!Array.isArray(t)) throw new TypeError("String array or a comma separated string expected");
                        n = t
                    }
                    var i = n.join(","),
                        o = e.signatures[i];
                    if (o) return o;
                    throw new TypeError("Signature not found (signature: " + (e.name || "unnamed") + "(" + n.join(", ") + "))")
                }

                function w(e, t) {
                    var n = d(e);
                    if (t === n) return e;
                    for (var r = 0; r < T.conversions.length; r++) {
                        var i = T.conversions[r];
                        if (i.from === n && i.to === t) return i.convert(e)
                    }
                    throw new Error("Cannot convert from " + n + " to " + t)
                }
                i.prototype.add = function (e, t) {
                    var n = t || "fn";
                    this.categories[n] || (this.categories[n] = []);
                    var r = this.categories[n].indexOf(e);
                    return r == -1 && (r = this.categories[n].length, this.categories[n].push(e)), n + r
                }, i.prototype.toCode = function () {
                    var e = [],
                        t = this.name + ".categories",
                        n = this.categories;
                    for (var r in n)
                        if (n.hasOwnProperty(r))
                            for (var i = n[r], o = 0; o < i.length; o++) e.push("var " + r + o + " = " + t + "['" + r + "'][" + o + "];");
                    return e.join("\n")
                }, o.compare = function (e, t) {
                    if (e.anyType) return 1;
                    if (t.anyType) return -1;
                    if (v(e.types, "Object")) return 1;
                    if (v(t.types, "Object")) return -1;
                    if (e.hasConversions()) {
                        if (t.hasConversions()) {
                            var n, r, i;
                            for (n = 0; n < e.conversions.length; n++)
                                if (void 0 !== e.conversions[n]) {
                                    r = e.conversions[n];
                                    break
                                } for (n = 0; n < t.conversions.length; n++)
                                if (void 0 !== t.conversions[n]) {
                                    i = t.conversions[n];
                                    break
                                } return T.conversions.indexOf(r) - T.conversions.indexOf(i)
                        }
                        return 1
                    }
                    if (t.hasConversions()) return -1;
                    var o, a;
                    for (n = 0; n < T.types.length; n++)
                        if (T.types[n].name === e.types[0]) {
                            o = n;
                            break
                        } for (n = 0; n < T.types.length; n++)
                        if (T.types[n].name === t.types[0]) {
                            a = n;
                            break
                        } return o - a
                }, o.prototype.overlapping = function (e) {
                    for (var t = 0; t < this.types.length; t++)
                        if (v(e.types, this.types[t])) return !0;
                    return !1
                }, o.prototype.matches = function (e) {
                    return this.anyType || e.anyType || this.overlapping(e)
                }, o.prototype.clone = function () {
                    var e = new o(this.types.slice(), this.varArgs);
                    return e.conversions = this.conversions.slice(), e
                }, o.prototype.hasConversions = function () {
                    return this.conversions.length > 0
                }, o.prototype.contains = function (e) {
                    for (var t = 0; t < this.types.length; t++)
                        if (e[this.types[t]]) return !0;
                    return !1
                }, o.prototype.toString = function (e) {
                    for (var t = [], n = {}, r = 0; r < this.types.length; r++) {
                        var i = this.conversions[r],
                            o = e && i ? i.to : this.types[r];
                        o in n || (n[o] = !0, t.push(o))
                    }
                    return (this.varArgs ? "..." : "") + t.join("|")
                }, a.prototype.clone = function () {
                    return new a(this.params.slice(), this.fn)
                }, a.prototype.expand = function () {
                    function e(n, r) {
                        if (r.length < n.params.length) {
                            var i, s, u, c = n.params[r.length];
                            if (c.varArgs) {
                                for (s = c.clone(), i = 0; i < T.conversions.length; i++)
                                    if (u = T.conversions[i], !v(c.types, u.from) && v(c.types, u.to)) {
                                        var l = s.types.length;
                                        s.types[l] = u.from, s.conversions[l] = u
                                    } e(n, r.concat(s))
                            } else {
                                for (i = 0; i < c.types.length; i++) e(n, r.concat(new o(c.types[i])));
                                for (i = 0; i < T.conversions.length; i++) u = T.conversions[i], !v(c.types, u.from) && v(c.types, u.to) && (s = new o(u.from), s.conversions[0] = u, e(n, r.concat(s)))
                            }
                        } else t.push(new a(r, n.fn))
                    }
                    var t = [];
                    return e(this, []), t
                }, a.compare = function (e, t) {
                    if (e.params.length > t.params.length) return 1;
                    if (e.params.length < t.params.length) return -1;
                    var n, r = e.params.length,
                        i = 0,
                        a = 0;
                    for (n = 0; n < r; n++) e.params[n].hasConversions() && i++, t.params[n].hasConversions() && a++;
                    if (i > a) return 1;
                    if (i < a) return -1;
                    for (n = 0; n < e.params.length; n++) {
                        var s = o.compare(e.params[n], t.params[n]);
                        if (0 !== s) return s
                    }
                    return 0
                }, a.prototype.hasConversions = function () {
                    for (var e = 0; e < this.params.length; e++)
                        if (this.params[e].hasConversions()) return !0;
                    return !1
                }, a.prototype.ignore = function () {
                    for (var e = {}, t = 0; t < T.ignore.length; t++) e[T.ignore[t]] = !0;
                    for (t = 0; t < this.params.length; t++)
                        if (this.params[t].contains(e)) return !0;
                    return !1
                }, a.prototype.paramsStartWith = function (e) {
                    if (0 === e.length) return !0;
                    for (var t = g(this.params), n = g(e), r = 0; r < e.length; r++) {
                        var i = this.params[r] || (t.varArgs ? t : null),
                            o = e[r] || (n.varArgs ? n : null);
                        if (!i || !o || !i.matches(o)) return !1
                    }
                    return !0
                }, a.prototype.toCode = function (e, t) {
                    for (var n = [], r = new Array(this.params.length), i = 0; i < this.params.length; i++) {
                        var o = this.params[i],
                            a = o.conversions[0];
                        o.varArgs ? r[i] = "varArgs" : a ? r[i] = e.add(a.convert, "convert") + "(arg" + i + ")" : r[i] = "arg" + i
                    }
                    var s = this.fn ? e.add(this.fn, "signature") : void 0;
                    return s ? t + "return " + s + "(" + r.join(", ") + "); // signature: " + this.params.join(", ") : n.join("\n")
                }, a.prototype.toString = function () {
                    return this.params.join(", ")
                }, s.prototype.toCode = function (e, n) {
                    var r = [];
                    if (this.param) {
                        var i = this.path.length - 1,
                            o = this.param.conversions[0],
                            a = "// type: " + (o ? o.from + " (convert to " + o.to + ")" : this.param);
                        if (this.param.varArgs)
                            if (this.param.anyType) r.push(n + "if (arguments.length > " + i + ") {"), r.push(n + "  var varArgs = [];"), r.push(n + "  for (var i = " + i + "; i < arguments.length; i++) {"), r.push(n + "    varArgs.push(arguments[i]);"), r.push(n + "  }"), r.push(this.signature.toCode(e, n + "  ")), r.push(n + "}");
                            else {
                                for (var s = function (n, r) {
                                        for (var i = [], o = 0; o < n.length; o++) i[o] = e.add(t(n[o]), "test") + "(" + r + ")";
                                        return i.join(" || ")
                                    }.bind(this), u = this.param.types, c = [], l = 0; l < u.length; l++) void 0 === this.param.conversions[l] && c.push(u[l]);
                                r.push(n + "if (" + s(u, "arg" + i) + ") { " + a), r.push(n + "  var varArgs = [arg" + i + "];"), r.push(n + "  for (var i = " + (i + 1) + "; i < arguments.length; i++) {"), r.push(n + "    if (" + s(c, "arguments[i]") + ") {"), r.push(n + "      varArgs.push(arguments[i]);");
                                for (var l = 0; l < u.length; l++) {
                                    var f = this.param.conversions[l];
                                    if (f) {
                                        var h = e.add(t(u[l]), "test"),
                                            p = e.add(f.convert, "convert");
                                        r.push(n + "    }"), r.push(n + "    else if (" + h + "(arguments[i])) {"), r.push(n + "      varArgs.push(" + p + "(arguments[i]));")
                                    }
                                }
                                r.push(n + "    } else {"), r.push(n + "      throw createError(name, arguments.length, i, arguments[i], '" + c.join(",") + "');"), r.push(n + "    }"), r.push(n + "  }"), r.push(this.signature.toCode(e, n + "  ")), r.push(n + "}")
                            }
                        else if (this.param.anyType) r.push(n + "// type: any"), r.push(this._innerCode(e, n));
                        else {
                            var m = this.param.types[0],
                                h = "any" !== m ? e.add(t(m), "test") : null;
                            r.push(n + "if (" + h + "(arg" + i + ")) { " + a), r.push(this._innerCode(e, n + "  ")), r.push(n + "}")
                        }
                    } else r.push(this._innerCode(e, n));
                    return r.join("\n")
                }, s.prototype._innerCode = function (e, t) {
                    var n, r = [];
                    for (this.signature && (r.push(t + "if (arguments.length === " + this.path.length + ") {"), r.push(this.signature.toCode(e, t + "  ")), r.push(t + "}")), n = 0; n < this.childs.length; n++) r.push(this.childs[n].toCode(e, t));
                    if (!this.fallThrough || this.param && this.param.anyType) {
                        var i = this._exceptions(e, t);
                        i && r.push(i)
                    }
                    return r.join("\n")
                }, s.prototype._exceptions = function (e, t) {
                    var n = this.path.length;
                    if (0 === this.childs.length) return [t + "if (arguments.length > " + n + ") {", t + "  throw createError(name, arguments.length, " + n + ", arguments[" + n + "]);", t + "}"].join("\n");
                    for (var r = {}, i = [], o = 0; o < this.childs.length; o++) {
                        var a = this.childs[o];
                        if (a.param)
                            for (var s = 0; s < a.param.types.length; s++) {
                                var u = a.param.types[s];
                                u in r || a.param.conversions[s] || (r[u] = !0, i.push(u))
                            }
                    }
                    return t + "throw createError(name, arguments.length, " + n + ", arguments[" + n + "], '" + i.join(",") + "');"
                };
                var x = [{
                        name: "number",
                        test: function (e) {
                            return "number" == typeof e
                        }
                    }, {
                        name: "string",
                        test: function (e) {
                            return "string" == typeof e
                        }
                    }, {
                        name: "boolean",
                        test: function (e) {
                            return "boolean" == typeof e
                        }
                    }, {
                        name: "Function",
                        test: function (e) {
                            return "function" == typeof e
                        }
                    }, {
                        name: "Array",
                        test: Array.isArray
                    }, {
                        name: "Date",
                        test: function (e) {
                            return e instanceof Date
                        }
                    }, {
                        name: "RegExp",
                        test: function (e) {
                            return e instanceof RegExp
                        }
                    }, {
                        name: "Object",
                        test: function (e) {
                            return "object" == typeof e
                        }
                    }, {
                        name: "null",
                        test: function (e) {
                            return null === e
                        }
                    }, {
                        name: "undefined",
                        test: function (e) {
                            return void 0 === e
                        }
                    }],
                    b = {},
                    C = [],
                    M = [],
                    T = {
                        config: b,
                        types: x,
                        conversions: C,
                        ignore: M
                    };
                return T = p("typed", {
                    Object: function (e) {
                        var t = [];
                        for (var r in e) e.hasOwnProperty(r) && t.push(e[r]);
                        var i = n(t);
                        return p(i, e)
                    },
                    "string, Object": p,
                    "...Function": function (e) {
                        for (var t, r = n(e), i = {}, o = 0; o < e.length; o++) {
                            var a = e[o];
                            if ("object" != typeof a.signatures) throw t = new TypeError("Function is no typed-function (index: " + o + ")"), t.data = {
                                index: o
                            }, t;
                            for (var s in a.signatures)
                                if (a.signatures.hasOwnProperty(s))
                                    if (i.hasOwnProperty(s)) {
                                        if (a.signatures[s] !== i[s]) throw t = new Error('Signature "' + s + '" is defined twice'), t.data = {
                                            signature: s
                                        }, t
                                    } else i[s] = a.signatures[s]
                        }
                        return p(r, i)
                    }
                }), T.config = b, T.types = x, T.conversions = C, T.ignore = M, T.create = e, T.find = y, T.convert = w, T.addType = function (e) {
                    if (!e || "string" != typeof e.name || "function" != typeof e.test) throw new TypeError("Object with properties {name: string, test: function} expected");
                    T.types.push(e)
                }, T.addConversion = function (e) {
                    if (!e || "string" != typeof e.from || "string" != typeof e.to || "function" != typeof e.convert) throw new TypeError("Object with properties {from: string, to: string, convert: function} expected");
                    T.conversions.push(e)
                }, T
            }
            return e()
        })
    }, function (e, t) {
        var n;
        n = function () {
            return this
        }();
        try {
            n = n || Function("return this")() || (0, eval)("this")
        } catch (e) {
            "object" == typeof window && (n = window)
        }
        e.exports = n
    }, function (e, t, n) {
        function r(e) {
            var t = i.create(e);
            return t.create = r, t.import(n(141)), t
        }
        var i = n(140);
        e.exports = r()
    }])
})