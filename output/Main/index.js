"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Console = require("../Control.Monad.Eff.Console");
var Control_Monad_Eff_JQuery = require("../Control.Monad.Eff.JQuery");
var Control_Monad_Eff_Timer = require("../Control.Monad.Eff.Timer");
var Control_Monad_ST = require("../Control.Monad.ST");
var DOM = require("../DOM");
var DOM_HTML = require("../DOM.HTML");
var DOM_HTML_Window = require("../DOM.HTML.Window");
var Data_Array = require("../Data.Array");
var Data_Array_Partial = require("../Data.Array.Partial");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Int = require("../Data.Int");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var $$Math = require("../Math");
var Matrices = require("../Matrices");
var Partial_Unsafe = require("../Partial.Unsafe");
var Prelude = require("../Prelude");
var speedSensitivity = 25;
var rotationScale = 0.4;
var startSpeedometer = function (velocityRef) {
    return function (mousePosRef) {
        return function (runFlagRef) {
            var looper = function (prevPos) {
                return function (velocities) {
                    var speedometer = function __do() {
                        var v = Control_Monad_ST.readSTRef(mousePosRef)();
                        var r = Matrices.rotationVector([ -(prevPos.y - v.y) * rotationScale, (prevPos.x - v.x) * rotationScale, 0.0, 0.0 ]);
                        var newVels = Data_Array.snoc(Data_Array_Partial.tail()(velocities))(r);
                        var v1 = Control_Monad_ST.readSTRef(runFlagRef)();
                        if (v1) {
                            return looper(v)(newVels)();
                        };
                        var v2 = Control_Monad_ST.readSTRef(velocityRef)();
                        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(velocityRef)(Matrices.sum([ Matrices.average(newVels), v2 ])))();
                    };
                    return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Eff_Timer.setTimeout(speedSensitivity)(speedometer));
                };
            };
            return function __do() {
                var v = Control_Monad_ST.readSTRef(mousePosRef)();
                return looper(v)(Data_Array.replicate(5)(Matrices.noRotation))();
            };
        };
    };
};
var rotateCube = function (transformRef) {
    return function (rotation) {
        return function __do() {
            var v = Control_Monad_Eff_JQuery.select(".cube")();
            var v1 = Control_Monad_ST.readSTRef(transformRef)();
            Control_Monad_Eff_JQuery.css({
                transform: "matrix3d" + (Matrices.toString(Matrices.transformMatrixToString)(v1) + (" rotate3d" + Matrices.toString(Matrices.rotationVectorToString)(Matrices.multiply(v1)(rotation))))
            })(v)();
            var v2 = Control_Monad_Eff_JQuery.getCss("transform")(v)();
            return Matrices.toTransformMatrix(v2);
        };
    };
};
var startSpinner = function (transformRef) {
    return function (velocityRef) {
        var spinner = function __do() {
            var v = Control_Monad_ST.readSTRef(velocityRef)();
            (function () {
                var $45 = Matrices.angle(v) !== 0.0;
                if ($45) {
                    return function __do() {
                        var v1 = rotateCube(transformRef)(v)();
                        return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(transformRef)(v1))();
                    };
                };
                return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
            })()();
            var v1 = DOM_HTML.window();
            return Data_Functor["void"](Control_Monad_Eff.functorEff)(DOM_HTML_Window.requestAnimationFrame(spinner)(v1))();
        };
        return spinner;
    };
};
var framesPerSecond = 60;
var drawCube = function __do() {
    var v = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("front_face")(v)();
    Control_Monad_Eff_JQuery.addClass("face")(v)();
    var v1 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("back_face")(v1)();
    Control_Monad_Eff_JQuery.addClass("face")(v1)();
    var v2 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("right_face")(v2)();
    Control_Monad_Eff_JQuery.addClass("face")(v2)();
    var v3 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("left_face")(v3)();
    Control_Monad_Eff_JQuery.addClass("face")(v3)();
    var v4 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("top_face")(v4)();
    Control_Monad_Eff_JQuery.addClass("face")(v4)();
    var v5 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("bottom_face")(v5)();
    Control_Monad_Eff_JQuery.addClass("face")(v5)();
    var v6 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.addClass("cube")(v6)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) translateY(-100px) translateZ(100px)", 
        backgroundColor: "#082090"
    })(v)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) translateY(-100px) translateZ(-100px)", 
        backgroundColor: "#01d6d3"
    })(v1)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateY(-100px) rotateY(90deg)", 
        backgroundColor: "#ef3737"
    })(v2)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateY(-100px) translateX(-200px) rotateY(90deg)", 
        backgroundColor: "#df01a5"
    })(v3)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) translateY(-200px) rotateX(90deg)", 
        backgroundColor: "#fdf900"
    })(v4)();
    Control_Monad_Eff_JQuery.css({
        transform: "translateX(-100px) rotateX(90deg)", 
        backgroundColor: "#00ff00"
    })(v5)();
    Control_Monad_Eff_JQuery.css({
        position: "relative", 
        transformStyle: "preserve-3d"
    })(v6)();
    Control_Monad_Eff_JQuery.append(v)(v6)();
    Control_Monad_Eff_JQuery.append(v1)(v6)();
    Control_Monad_Eff_JQuery.append(v2)(v6)();
    Control_Monad_Eff_JQuery.append(v3)(v6)();
    Control_Monad_Eff_JQuery.append(v4)(v6)();
    Control_Monad_Eff_JQuery.append(v5)(v6)();
    var v7 = Control_Monad_Eff_JQuery.create("<div>")();
    Control_Monad_Eff_JQuery.setAttr("id")("cube-wrapper")(v7)();
    Control_Monad_Eff_JQuery.css({
        position: "absolute", 
        left: "50%", 
        top: "50%", 
        perspective: "1500px"
    })(v7)();
    Control_Monad_Eff_JQuery.append(v6)(v7)();
    var v8 = Control_Monad_Eff_JQuery.body();
    Control_Monad_Eff_JQuery.append(v7)(v8)();
    Control_Monad_Eff_JQuery.css({
        width: "100%", 
        height: "100%"
    })(v8)();
    var v9 = Control_Monad_Eff_JQuery.select(".face")();
    Control_Monad_Eff_JQuery.css({
        position: "absolute", 
        width: "200px", 
        height: "200px"
    })(v9)();
    return Control_Monad_Eff_JQuery.css({
        transform: "rotateX(-45deg)rotateY(45deg)"
    })(v6)();
};
var decelRate = 40.0 / Data_Int.toNumber(framesPerSecond);
var startMouseHandlers = function (transformRef) {
    return function (velocityRef) {
        return function __do() {
            var v = Control_Monad_Eff_JQuery.body();
            var v1 = Control_Monad_ST.newSTRef({
                x: 0.0, 
                y: 0.0
            })();
            var downHandler = function (event) {
                return function (jq) {
                    return function __do() {
                        var v2 = Control_Monad_Eff_JQuery.getPageX(event)();
                        var v3 = Control_Monad_Eff_JQuery.getPageY(event)();
                        Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(v1)({
                            x: v2, 
                            y: v3
                        }))();
                        var v4 = Control_Monad_ST.newSTRef(true)();
                        var moveHandler = function (event$prime) {
                            return function (jq$prime) {
                                return function __do() {
                                    var v5 = Control_Monad_Eff_JQuery.getPageX(event$prime)();
                                    var v6 = Control_Monad_Eff_JQuery.getPageY(event$prime)();
                                    Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(v1)({
                                        x: v5, 
                                        y: v6
                                    }))();
                                    var dx = -(v6 - v3);
                                    var dy = v5 - v2;
                                    var rotation = Matrices.rotationVector([ dx, dy, 0.0, $$Math.sqrt(dx * dx + dy * dy) * rotationScale ]);
                                    return rotateCube(transformRef)(rotation)();
                                };
                            };
                        };
                        var upHandler = function (event$prime) {
                            return function (jq$prime) {
                                return function __do() {
                                    var v5 = Control_Monad_Eff_JQuery.select(".cube")();
                                    Control_Monad_Eff_JQuery.off("mousemove")(v)();
                                    var v6 = Control_Monad_Eff_JQuery.getCss("transform")(v5)();
                                    Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(transformRef)(Matrices.toTransformMatrix(v6)))();
                                    return Control_Monad_ST.writeSTRef(v4)(false)();
                                };
                            };
                        };
                        var decelerator = function __do() {
                            var v5 = Control_Monad_ST.readSTRef(velocityRef)();
                            var v7 = Control_Monad_ST.readSTRef(v4)();
                            var $69 = v7 && Matrices.angle(v5) > 0.0;
                            if ($69) {
                                Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_ST.writeSTRef(velocityRef)((function () {
                                    var $70 = Matrices.angle(v5) - decelRate > 0.0;
                                    if ($70) {
                                        return Matrices.changeSpeed(Matrices.angle(v5) - decelRate)(v5);
                                    };
                                    return Matrices.noRotation;
                                })()))();
                                return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Eff_Timer.setTimeout(1000 / framesPerSecond | 0)(decelerator))();
                            };
                            return Data_Unit.unit;
                        };
                        Control_Monad_Eff_JQuery.on("mousemove")(moveHandler)(v)();
                        Control_Monad_Eff_JQuery.on("mouseup")(upHandler)(v)();
                        decelerator();
                        return startSpeedometer(velocityRef)(v1)(v4)();
                    };
                };
            };
            return Control_Monad_Eff_JQuery.on("mousedown")(downHandler)(v)();
        };
    };
};
var run = function __do() {
    var v = Control_Monad_Eff_JQuery.select(".cube")();
    var v1 = Control_Monad_Eff_JQuery.getCss("transform")(v)();
    var v2 = Control_Monad_ST.newSTRef(Matrices.toTransformMatrix(v1))();
    var v3 = Control_Monad_ST.newSTRef(Matrices.noRotation)();
    startSpinner(v2)(v3)();
    startMouseHandlers(v2)(v3)();
    return Data_Unit.unit;
};
var main = function __do() {
    drawCube();
    return run();
};
module.exports = {
    decelRate: decelRate, 
    drawCube: drawCube, 
    framesPerSecond: framesPerSecond, 
    main: main, 
    rotateCube: rotateCube, 
    rotationScale: rotationScale, 
    run: run, 
    speedSensitivity: speedSensitivity, 
    startMouseHandlers: startMouseHandlers, 
    startSpeedometer: startSpeedometer, 
    startSpinner: startSpinner
};
