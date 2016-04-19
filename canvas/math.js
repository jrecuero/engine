var RESOLUTION_DEFAULT = 0.01;

/**
 * Two dimmenstional Point.
 *
 * @param {int} x X/Horizontal point coordinate
 * @param {int} y Y/Vertical point coordinate
 * @return {Point} result point instance
 */
function Point( x, y ) {
    if ( !x ) x = 0;
    if ( !y ) y = 0;
    return { x: x, y: y };
}

/**
 * Add two points.
 *
 * @param  {Point} p1 First point to add
 * @param  {Point} p2 Second point to add
 * @return {Point} Point result after addition
 */
function pointAdd( p1, p2 ) {
    var x = p1.x + p2.x;
    var y = p1.x + p2.x;
    return Point( x, y );
}

/**
 * Substract one point from other.
 *
 * @param  {Point} p1 First point to be substracted
 * @param  {Point} p2 Second point to substract
 * @return {Point} Point result after substraction
 */
function pointSub( p1, p2 ) {
    var x = p1.x - p2.x;
    var y = p1.x - p2.x;
    return Point( x, y );
}

/**
 * Distance between two points.
 *
 * @param  {Point} p1 First point to measure the distance
 * @param  {Point} p2 Second point to measure the distance
 * @return {int} Distance between points
 */
function pointDistance( p1, p2 ) {
    var x2 = ( p2.x - p1.x ) * ( p2.x - p1.x );
    var y2 = ( p2.y - p1.y ) * ( p2.y - p1.y );
    var distance = Math.sqrt( x2 + y2 );
    return distance;
}

/**
 * Bezier curce distance.
 *
 * @param  {Bezier} bezier  Bezier curve
 * @param  {Array} points   Array of points for the Bezier curve
 * @param  {int} resolution Resolution for the Bezier curve
 * @return {int} Bezier curve length
 */
function bezierLength( bezier, points, resolution ) {
    if ( !resolution ) resolution = RESOLUTION_DEFAULT;
    var next, prev;
    var length = 0.0;
    var args = points.slice();
    args.unshift( 0 );
    for ( var x = 0.0; x <= 1.00001; x += resolution ) {
        args[ 0 ] = x;
        next = bezier.apply( null, args );
        if ( prev ) {
            length += pointDistance( next, prev );
        }
        prev = next;
    }
    return length;
}

/**
 * Draw a Bezier curve in the given context.
 *
 * @param  {Context} ctx      Context where Bezier curve will be drawn
 * @param  {Bezier} bezier    Bezier curve
 * @param  {Array} points     Array of points for the Bezier curve
 * @param  {int} resolution Resolution for the Bezier curve
 */
function drawBezier( ctx, bezier, points, resolution ) {
    if ( !resolution ) resolution = RESOLUTION_DEFAULT;
    var next;
    var args = points.slice();
    args.unshift( 0 );
    for ( var x = 0.0; x <= 1.00001; x += resolution ) {
        args[ 0 ] = x;
        next = bezier.apply( null, args );
        ctx.lineTo( next.x, next.y );
    }

}

/**
 * Linear Bezier curves.
 * B(t) = C1 + t * (C2 - C1)
 *
 * @param  {int} t percentage of the distance along the curve
 * @param  {Point} c1 first control Point
 * @param  {Point} c2 second control Point
 * @return {Point} result Point in the space
 */
function getLineBezier( t, c1, c2 ) {
    var B1 = function( t ) {
        return ( 1 - t );
    };

    var B2 = function( t ) {
        return t;
    };

    var pos = new Point();
    pos.x = c1.x * B1( t ) + c2.x * B2( t );
    pos.y = c1.y * B1( t ) + c2.y * B2( t );
    return pos;
}

/**
 * Draw a linear Bezier curve.
 *
 * @param  {Context} ctx    Context where linear Bezier curve will be drawn
 * @param  {Point} c1       First linear Bezier curve point
 * @param  {Point} c2       Second linear Bezier curve point
 * @param  {int} resolution Resolution for the linear Bezier curve
 */
function drawLineBezier( ctx, c1, c2, resolution ) {
    return drawBezier( ctx, getLineBezier, [ c1, c2 ], resolution );
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
function getCuadraticBezier( t, c1, c2, c3 ) {
    var B1 = function( t ) {
        var result = ( 1 - t ) * ( 1 - t );
        return result;
    };

    var B2 = function( t ) {
        var result = 2 * t * ( 1 - t );
        return result;
    };

    var B3 = function( t ) {
        var result = t * t;
        return result;
    };

    var pos = new Point();
    pos.x = c1.x * B1( t ) + c2.x * B2( t ) + c3.x * B3( t );
    pos.y = c1.y * B1( t ) + c2.y * B2( t ) + c3.y * B3( t );
    return pos;
}

/**
 * Draw a cuadratic Bezier curve.
 *
 * @param  {Context} ctx    Context where cuadratic Bezier curve will be drawn
 * @param  {Point} c1       First cuadratic Bezier curve point
 * @param  {Point} c2       Second cuadratic Bezier curve point
 * @param  {Point} c3       Third cuadratic Bezier curve point
 * @param  {int} resolution Resolution for the cuadratic Bezier curve
 */
function drawCuadraticBezier( ctx, c1, c2, c3, resolution ) {
    return drawBezier( ctx, getCuadraticBezier, [ c1, c2, c3 ], resolution );
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
function getCubicBezier( t, c1, c2, c3, c4 ) {
    var B1 = function( t ) {
        return ( 1 - t ) * ( 1 - t ) * ( 1 - t );
    };

    var B2 = function( t ) {
        return 3 * t * ( 1 - t ) * ( 1 - t );
    };

    var B3 = function( t ) {
        return 3 * t * t * ( 1 - t );
    };

    var B4 = function( t ) {
        return t * t * t;
    };

    var pos = new Point();
    pos.x = c1.x * B1( t ) + c2.x * B2( t ) + c3.x * B3( t ) + c4.x * B4( t );
    pos.y = c1.y * B1( t ) + c2.y * B2( t ) + c3.y * B3( t ) + c4.y * B4( t );
    return pos;
}

/**
 * Draw a cubic Bezier curve.
 *
 * @param  {Context} ctx    Context where cubic Bezier curve will be drawn
 * @param  {Point} c1       First cubic Bezier curve point
 * @param  {Point} c2       Second cubic Bezier curve point
 * @param  {Point} c3       Third cubic Bezier curve point
 * @param  {Point} c4       Fourth cubic Bezier curve point
 * @param  {int} resolution Resolution for the cubic Bezier curve
 */
function drawCubicBezier( ctx, c1, c2, c3, c4, resolution ) {
    return drawBezier( ctx, getCubicBezier, [ c1, c2, c3, c4 ], resolution );
}

/**
 * Hyperubic Bezier curves.
 *
 * @param  {int} t  percentage of the distance along the curve
 * @param  {Point} c1 first control Point
 * @param  {Point} c2 second control Point
 * @param  {Point} c3 third control Point
 * @param  {Point} c4 fourth control Point
 * @param  {Point} c5 fifth control Point
 */
function getHypercubicBezier( t, c1, c2, c3, c4, c5 ) {
    var B1 = function( t ) {
        return ( 1 - t ) * ( 1 - t ) * ( 1 - t ) * ( 1 - t );
    };

    var B2 = function( t ) {
        return 4 * t * ( 1 - t ) * ( 1 - t ) * ( 1 - t );
    };

    var B3 = function( t ) {
        return 6 * t * t * ( 1 - t ) * ( 1- t );
    };

    var B4 = function( t ) {
        return 4 * t * t * t * ( 1 - t);
    };

    var B5 = function( t ) {
        return t * t * t * t;
    };

    var pos = new Point();
    pos.x = c1.x * B1( t ) + c2.x * B2( t ) + c3.x * B3( t ) + c4.x * B4( t ) + c5.x * B5( t );
    pos.y = c1.y * B1( t ) + c2.y * B2( t ) + c3.y * B3( t ) + c4.y * B4( t ) + c5.y * B5( t );
    return pos;
}

/**
 * Draw a hypercubic Bezier curve.
 *
 * @param  {Context} ctx    Context where hypercubic Bezier curve will be drawn
 * @param  {Point} c1       First hypercubic Bezier curve point
 * @param  {Point} c2       Second hypercubic Bezier curve point
 * @param  {Point} c3       Third hypercubic Bezier curve point
 * @param  {Point} c4       Fourth hypercubic Bezier curve point
 * @param  {Point} c4       Fifth hypercubic Bezier curve point
 * @param  {int} resolution Resolution for the hypercubic Bezier curve
 */
function drawHypercubicBezier( ctx, c1, c2, c3, c4, c5, resolution ) {
    return drawBezier( ctx, getHypercubicBezier, [ c1, c2, c3, c4, c5 ], resolution );
}
