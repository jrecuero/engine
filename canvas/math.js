Point = function(x, y) {
    if (!x) x = 0;
    if (!y) y = 0;
    return {x: x, y: y};
};

/**
 * Linear Bezier curves.
 * B(t) = C1 + t * (C2 - C1)
 *
 * @param  {int} t percentage of the distance along the curve
 * @param  {Point} c1 first control Point
 * @param  {Point} c2 second control Point
 * @return {Point} result Point in the space
 */
function getLineBezier(t, c1, c2) {
    var B1 = function(t) {
        return (1 - t);
    };

    var B2 = function(t) {
        return t;
    };

    var pos = new Point();
    pos.x = c1.x * B1(t) + c2.x * B2(t);
    pos.y = c1.y * B1(t) + c2.y * B2(t);
    return pos;
}

function drawLineBezier(ctx, c1, c2, resolution) {
    if (!resolution) resolution = 0.01;
    for ( var x = 0.0; x <= 1.0; x += resolution ) {
        var next = getLineBezier(x, c1, c2);
        ctx.lineTo(next.x, next.y);
    }
}

/**
 * Cuadratic Bezier curves.
 * B(t) = C1 * (1- t)^2 + C2 * 2 * t * (1 - t) + C3 * t^2
 *
 * @param  {int} t  percentage of the distance along the curve
 * @param  {Point} c1 first control Point
 * @param  {Point} c2 second control Point
 * @param  {Point} c3 third control Point
 * @return {Point} result Point in the space
 */
function getCuadraticBezier(t, c1, c2, c3) {
    var B1 = function(t) {
        var result = (1-t)*(1-t);
        return result;
    };

    var B2 = function(t) {
        var result = 2*t*(1-t);
        return result;
    };

    var B3 = function(t) {
        var result = t*t;
        return result;
    };

    var pos = new Point();
    pos.x = c1.x * B1(t) + c2.x * B2(t) + c3.x * B3(t);
    pos.y = c1.y * B1(t) + c2.y * B2(t) + c3.y * B3(t);
    return pos;
}

function drawCuadraticBezier(ctx, c1, c2, c3, resolution) {
    if (!resolution) resolution = 0.01;
    for ( var x = 0.0; x <= 1.0; x += resolution ) {
        var next = getCuadraticBezier(x, c1, c2, c3);
        ctx.lineTo(next.x, next.y);
    }
}

/**
 * Cubic Bezier curves.
 * B(t) = C1 * (1 - t)^3 + C2 * 3 * (1 - t)^2 * t + C3 * (1 -t) * t^2 + C3 * t^3
 *
 * @param  {int} t  percentage of the distance along the curve
 * @param  {Point} c1 first control Point
 * @param  {Point} c2 second control Point
 * @param  {Point} c3 third control Point
 * @param  {Point} c4 fourth control Point
 * @return {Point} result Point in the space
 */
function getCubicBezier(t, c1, c2, c3, c4) {
    var B1 = function(t) {
        return (1-t)*(1-t)*(1-t);
    };

    var B2 = function(t) {
        return 3*t*(1-t)*(1-t);
    };

    var B3 = function(t) {
        return 3*t*t*(1-t);
    };

    var B4 = function(t) {
        return t*t*t;
    };

    var pos = new Point();
    pos.x = c1.x * B1(t) + c2.x * B2(t) + c3.x * B3(t) + c4.x * B4(t);
    pos.y = c1.y * B1(t) + c2.y * B2(t) + c3.y * B3(t) + c4.y * B4(t);
    return pos;
}

function drawCubicBezier(ctx, c1, c2, c3, c4, resolution) {
    if (!resolution) resolution = 0.01;
    for ( var x = 0.0; x <= 1.0; x += resolution ) {
        var next = getCubicBezier(x, c1, c2, c3, c4);
        ctx.lineTo(next.x, next.y);
    }
}

// window.onload = function() {
//     var origin, next, x;
//     var C1 = Point(50, 100);
//     var C2 = Point(-50, 200);
//     var C3 = Point(150, 400);
//     var C4 = Point(500, 300);

//     var c = document.getElementById("canvas");
//     var ctx = c.getContext("2d");
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     drawLineBezier(ctx, Point(0, 0), Point(500, 0));
//     // for ( x = 0.01; x <= 1; x += 0.01 ) {
//     //     next = getLineBezier(x, Point(0, 0), Point(500, 0));
//     //     ctx.lineTo(next.x, next.y);
//     // }

//     origin = getCuadraticBezier(0, C1, C2, C3);
//     ctx.moveTo(origin.x, origin.y);
//     drawCuadraticBezier(ctx, C1, C2, C3);
//     // for ( x = 0.01; x <= 1; x += 0.01 ) {
//     //     next = getCuadraticBezier(x, C1, C2, C3);
//     //     ctx.lineTo(next.x, next.y);
//     // }

//     origin = getCubicBezier(0, C1, C2, C3, C4);
//     ctx.moveTo(origin.x, origin.y);
//     drawCubicBezier(ctx, C1, C2, C3, C4);
//     // for ( x = 0.01; x <= 1; x += 0.01 ) {
//     //     next = getCubicBezier(x, C1, C2, C3, C4);
//     //     ctx.lineTo(next.x, next.y);
//     // }
//     ctx.stroke();
// };
