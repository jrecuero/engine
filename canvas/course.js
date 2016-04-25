var SEGMENT_TYPE = { straight: 0, curve: 1, sharp_curve: 2 };
var CURVE = { FULL: 100, HALF: 50, QUARTER: 25 };
var SHARP = { X: 'x', Y: 'y' };
var UNIFIED_LENGTH = 2.0;

/**
 * Rotate a line defined for two points a given angle.
 *
 * @param  {Array} points Array with two points defining the line
 * @param  {int} angle    Angle to rotate the line
 * @return {Array} Array with two points defining the rotated line
 */
function rotate( points, angle ) {
    var startP = points[ 0 ];
    var endP = points[ 1 ];
    var x = endP.x - startP.x;
    var y = endP.y - startP.y;
    var rad = angle * Math.PI / 180;
    var newx = x * Math.cos( rad ) - y * Math.sin( rad );
    var newy = y * Math.cos( rad ) + x * Math.sin( rad );
    newx = parseFloat( newx.toFixed( 2 ) );
    newy = parseFloat( newy.toFixed( 2 ) );
    var result = Point( startP.x + newx, startP.y + newy );
    return [ startP, result ];
}

/**
 * Moves a line from an origin point to a destination point.
 *
 * @param  {Array} points   Array with points defining the line
 * @param  {Point} origin_p Origin point
 * @param  {Point} dest_p   Destination point
 * @return {Array} Array with points defining the moved line
 */
function move( points, origin_p, dest_p ) {
    var movePoints = [];
    for ( var p_i in points ) {
        var point = points[ p_i ];
        var offset = Point( point.x - origin_p.x, point.y - origin_p.y );
        movePoints.push( Point( dest_p.x + offset.x, dest_p.y + offset.y ) );
    }
    return movePoints;
}

/**
 * Number of unified steps for the given length.
 *
 * @param  {int} length Curve length
 * @return {int} Number of unified steps
 */
function getStepsFromLength( length ) {
    var steps = length / UNIFIED_LENGTH;
    return Math.round( steps );
}

/**
 * Return start and end point for a line with a given length and angle.
 *
 * @param  {Point} start_p Start point
 * @param  {Point} end_p   End point
 * @param  {int} length    Line length
 * @param  {int} angle     Line angle
 * @return {Array} Array with start and end points for the result line
 */
function getPointsFromLine( start_p, end_p, length, angle ) {
    if ( !angle ) angle = 0;
    if ( !end_p ) end_p = Point( start_p.x + length, start_p.y );
    var rotatePoints = rotate( [ start_p, end_p ], angle );
    var endP = rotatePoints[ 1 ];
    return [ start_p, endP ];
}

/**
 * Draw a line in the given context
 * @param  {Context} ctx    Context where line will be drawn
 * @param  {Point} start_p  Line start point
 * @param  {Point} end_p    Line end point
 * @param  {int} length     Line length
 * @param  {int} angle      Line angle
 * @param  {int} resolution Resolution line will be drawn
 * @return {Point} Last point for the line
 */
function drawLine( ctx, start_p, end_p, length, angle, resolution ) {
    var points = getPointsFromLine( start_p, end_p, length, angle );
    var startP = points[ 0 ];
    var endP = points[ 1 ];
    ctx.moveTo( startP.x, startP.y );
    drawLineBezier( ctx, startP, endP, resolution );
    return endP;
}

// function drawBox( ctx, start_p, length, angle, wide, resolution ) {
//     if ( !angle ) angle = 0;
//     if ( !wide ) wide = 50;
//     var endP = Point( start_p.x + length, start_p.y );
//     ctx.save();
//     if ( angle ) {
//         ctx.translate( ( start_p.x + length ) / 2,
//                        ( start_p.y + wide ) / 2 );
//         ctx.rotate( angle * Math.PI / 180 );
//         ctx.translate( -( start_p.x + length ) / 2,
//                        -( start_p.y + wide ) / 2 );
//     }
//     ctx.rect( start_p.x, start_p.y, length, wide );
//     ctx.restore();
//     return endP;
// }

/**
 * Return all points (three) for a curve for a given curve percentage.
 *
 * @param  {Point} start_p Start point
 * @param  {Point} ctrl_p  Control point
 * @param  {Point} end_p   End point
 * @param  {int} percent   Percentage of curve to be used
 * @return {Array} Array with all points (three) for the result curve
 */
function getPointsFromCurve( start_p, ctrl_p, end_p, percent ) {
    if ( percent === undefined ) percent = 100;
    var percentV = percent / 100;
    var mid, midP, endP;
    if ( percentV < 1 ) {
        if ( start_p.y === ctrl_p.y ) {
            mid = start_p.x + ( end_p.x - start_p.x ) * percentV;
            midP = Point( mid, start_p.y );
        } else if ( start_p.x === ctrl_p.x ) {
            mid = start_p.y + ( end_p.y - start_p.y ) * percentV;
            midP = Point( start_p.x, mid );
        } else {
            return undefined;
        }
        endP = getCuadraticBezier( percentV, start_p, ctrl_p, end_p );
    } else {
        midP = ctrl_p;
        endP = end_p;
    }
    return [ start_p, midP, endP ];
}

/**
 * Draw a curve in the given context
 * @param  {Context} ctx    Context where curve will be drawn
 * @param  {Point} start_p  Line start point
 * @param  {Point} ctrl_p   Line control point
 * @param  {Point} end_p    Line end point
 * @param  {int} percent    Percentage of curve to be used
 * @param  {int} resolution Resolution curve will be drawn
 * @return {Point} Last point for the curve
 */
function drawCurve( ctx, start_p, ctrl_p, end_p, percent, resolution ) {
    ctx.moveTo( start_p.x, start_p.y );
    var points = getPointsFromCurve( start_p, ctrl_p, end_p, percent );
    var startP = points[ 0 ];
    var ctrlP = points[ 1 ];
    var endP = points[ 2 ];
    drawCuadraticBezier( ctx, startP, ctrlP, endP, resolution );
    return endP;
}

/**
 * Return all points (three) for a sharp curve for a given sharpness.
 *
 * @param  {Point} start_p Start point
 * @param  {Point} end_p   End point
 * @param  {Side} side     Side to sharp
 * @param  {int} sharpness Curve sharpness
 * @return {Array} Array with all points (three) for the result sharp curve
 */
function getPointsFromSharpCurve( start_p, end_p, side, sharpness ) {
    var mid, midP, endP;
    if ( side === SHARP.X ) {
        if ( !end_p ) {
            mid = start_p.y + ( start_p.x ) / 2;
            endP = Point( start_p.x, start_p.y + start_p.x );
        } else {
            mid = start_p.y + ( end_p.y - start_p.y ) / 2;
            endP = end_p;
        }
        midP = Point( start_p.x + sharpness, mid );
    } else if ( side === SHARP.Y ) {
        if ( !end_p ) {
            mid = start_p.x + ( start_p.y ) / 2;
            endP = Point( start_p.x + start_p.y, start_p.y );
        } else {
            mid = start_p.x + ( end_p.x - start_p.x ) / 2;
            endP = end_p;
        }
        midP = Point( mid, start_p.y + sharpness );
    } else {
        return undefined;
    }
    return [ start_p, midP, endP ];
}

/**
 * Draw a sharp curve in the given context
 * @param  {Context} ctx    Context where curve will be drawn
 * @param  {Point} start_p  Line start point
 * @param  {Point} end_p    Line end point
 * @param  {Side} side      Side to sharp
 * @param  {int} sharpness  Curve sharpness
 * @param  {int} resolution Resolution curve will be drawn
 * @return {Point} Last point for the curve
 */
function drawSharpCurve( ctx, start_p, end_p, side, sharpness, resolution ) {
    ctx.moveTo( start_p.x, start_p.y );
    var points = getPointsFromSharpCurve( start_p, end_p, side, sharpness );
    drawCuadraticBezier( ctx, points[ 0 ], points[ 1 ], points[ 2 ], resolution );
    return points[ 2 ];
}

/**
 * Piece Straight class.
 *
 * @param  {Point} start_p Straight start point
 * @param  {Point} end_p   Straight end point
 * @param  {int} length    Straight length
 * @param  {int} angle     Straight angle
 */
function st( start_p, end_p, length, angle ) {
    this.startP = start_p;
    if ( end_p ) {
        this.endP = end_p;
    } else {
        this.endP = Point( start_p.x + length, start_p.y );
    }
    this.angle = angle;

    this.resetTo = function( start_p ) {
        if ( start_p  && this.startP ) {
            var movePoints = move( [ this.endP ], this.startP, start_p );
            this.startP = start_p;
            this.endP = movePoints[ 0 ];
        } else if ( start_p ) {
            this.startP = start_p;
        }
    };

    this.draw = function( ctx, resolution ) {
        return drawLine( ctx, this.startP, this.endP, undefined, this.angle, resolution );
    };

    this.path = function() {
        return { f: getLineBezier,
                 args: getPointsFromLine( this.startP, this.endP, undefined, this.angle ),
                 type: SEGMENT_TYPE.straight,
                 steps: getStepsFromLength( this.length() ) };
    };

    this.getStart = function() {
        return this.startP;
    };

    this.getEnd = function() {
         var points = getPointsFromLine( this.startP, this.endP, undefined, this.angle );
         return points[ 1 ];
    };

    this.length = function() {
        var points = getPointsFromLine( this.startP, this.endP, undefined, this.angle );
        return bezierLength( getLineBezier, points );
    };
}

/**
 * Piece Curve class.
 *
 * @param  {Point} start_p    Curve start point
 * @param  {Point} ctrl_p     Curve control point
 * @param  {Point} end_p      Curve end point
 * @param  {int} percentage   Percentage of curve to be used
 */
function cv( start_p, ctrl_p, end_p, percentage ) {
    this.startP = start_p;
    this.ctrlP = ctrl_p;
    this.endP = end_p;
    this.percentage = percentage;

    this.resetTo = function( start_p ) {
        if ( start_p  ) {
            var movePoints = move( [ this.ctrlP, this.endP ], this.startP, start_p );
            this.startP = start_p;
            this.ctrlP = movePoints[ 0 ];
            this.endP = movePoints[ 1 ];
        }
    };

    this.draw = function( ctx, resolution ) {
        return drawCurve( ctx, this.startP, this.ctrlP, this.endP, this.percentage, resolution );
    };

    this.path = function() {
        return { f: getCuadraticBezier,
                 args: getPointsFromCurve( this.startP, this.ctrlP, this.endP, this.percentage ),
                 type: SEGMENT_TYPE.curve,
                 steps: getStepsFromLength( this.length() ) };
    };

    this.getStart = function() {
        return this.startP;
    };

    this.getEnd = function() {
        var points = getPointsFromCurve( this.startP, this.ctrlP, this.endP, this.percentage );
        var endP = points[ 2 ];
        return endP;
    };

    this.length = function() {
        var points = getPointsFromCurve( this.startP, this.ctrlP, this.endP, this.percentage );
        return bezierLength( getCuadraticBezier, points );
    };
}

/**
 * Piece Sharp Curve class.
 *
 * @param  {Point} start_p   Sharp curve start point
 * @param  {Point} end_p     Sharp curve end point
 * @param  {Side} side       Side for the sharp curve
 * @param  {int} sharpness   Curve sharpness
 */
function sh( start_p, end_p, side, sharpness ) {
    this.startP = start_p;
    this.endP = end_p;
    this.side = side;
    this.sharpness = sharpness;

    this.resetTo = function( start_p ) {
        if ( start_p  ) {
            var movePoints = move( [ this.endP ], this.startP, start_p );
            this.startP = start_p;
            this.endP = movePoints[ 0 ];
        }
    };

    this.draw = function( ctx, resolution ) {
        return drawSharpCurve( ctx, this.startP, this.endP, this.side, this.sharpness, resolution );
    };

    this.path = function() {
        return { f: getCuadraticBezier,
                 args: getPointsFromSharpCurve( this.startP, this.endP, this.side, this.sharpness ),
                 type: SEGMENT_TYPE.sharp_curve,
                 steps: getStepsFromLength( this.length() ) };
    };

    this.getStart = function() {
        return this.startP;
    };

    this.getEnd = function() {
        var points = getPointsFromSharpCurve( this.startP, this.endP, this.side, this.sharpness );
        var endP = points[ 2 ];
        return endP;

    };

    this.length = function() {
        var points = getPointsFromSharpCurve( this.startP, this.endP, this.side, this.sharpness );
        return bezierLength( getCuadraticBezier, points );
    };
}

/**
 * Piece class.
 *
 * Piece is a line/curve that is part for a full course.
 *
 * @param {Piece} piece Straight/Curve/Sharp Curve
 */
function Piece( piece ) {
    this.piece = piece;

    this.resetTo = function( start_p ) {
        return this.piece.resetTo( start_p );
    };

    this.build = function( ctx, resolution ) {
        return this.piece.draw( ctx, resolution );
    };

    this.path = function() {
        return this.piece.path();
    };

    this.getStart = function() {
        return this.piece.getStart();
    };

    this.getEnd = function() {
        return this.piece.getEnd();
    };

    this.length = function() {
        return this.piece.length();
    };
}

/**
 * Straight piece with a given length and angle.
 *
 * @param {Point} start_p Straight start point
 * @param {Point} end_p   Straight end point
 * @param {int} length    Straight length
 * @param {int} angle     Straight angle
 */
function PieceStraight( start_p, end_p, length, angle ) {
    Piece.call( this, new st( start_p, end_p, length, angle ) );
}
PieceStraight.prototype = new Piece();
PieceStraight.prototype.constructor = PieceStraight;

/**
 * Curve piece with a given percentage.
 *
 * @param {Point} start_p    Curve start point
 * @param {Point} ctrl_p     Curve control point
 * @param {Point} end_p      Curve end point
 * @param {int} percentage   Percentage of curve to be used
 */
function PieceCurve( start_p, ctrl_p, end_p, percentage ) {
    Piece.call( this, new cv( start_p, ctrl_p, end_p, percentage ) );
}
PieceCurve.prototype = new Piece();
PieceCurve.prototype.constructor = PieceCurve;

/**
 * Sharp Curve piece with a given percentage.
 *
 * @param {Point} start_p    Sharp curve start point
 * @param {Point} end_p      Sharp curve end point
 * @param {Side} side        Side for the sharp curve
 * @param {int} sharpness    Sharpness for the sharp curve
 */

function PieceSharpCurve( start_p, end_p, side, sharpness ) {
    Piece.call( this, new sh( start_p, end_p, side, sharpness ) );
}
PieceSharpCurve.prototype = new Piece();
PieceSharpCurve.prototype.constructor = PieceSharpCurve;

/**
 * Close a figure for the given end point.
 *
 * @param {Point} end_p End point to close
 */
function PieceClose( end_p ) {
    Piece.call( this, new st( undefined, end_p ) );
}
PieceClose.prototype = new Piece();
PieceClose.prototype.constructor = PieceClose;

/**
 * Course Lane class.
 *
 * @param {Context} ctx    Context where course lane will be drawn
 * @param {int} resolution Resolution for the course
 */
function CourseLane( ctx, resolution ) {
    this.ctx = ctx;
    this.resolution = resolution;
    this.startP = undefined;
    this.attachP = undefined;
    this.pieces = [];
    this.path = [];
    this.__car = undefined;

    this.setCar = function( car ) {
        this.__car = car;
    };

    Object.defineProperty( this, "car", {
        get: function() { return this.__car; },
        set: function( val) {
            this.__car = val;
            this.__car.setLane( this );
        }
    } );

    this.attach = function( next_piece ) {
        if ( !this.startP ) this.startP = next_piece.getStart();
        this.pieces.push( next_piece );
    };

    this.dettach = function() {
        return this.pieces.pop();
    };

    this.closePiece = function() {
        this.attach ( new PieceClose( this.startP ) );
    };

    this.buildPath = function() {
        for ( var p_i in this.pieces ) {
            var piece = this.pieces[ p_i ];
            piece.resetTo( this.attachP );
            this.attachP = piece.getEnd();
            this.path.push( piece.path() );
        }
    };

    this.buildDraw = function() {
        this.ctx.beginPath();
        ctx.strokeStyle = "black";
        for ( var p_i in this.pieces ) {
            var piece = this.pieces[ p_i ];
            this.attachP = piece.build( this.ctx, this.resolution );
        }
        this.ctx.stroke();
    };
}

/**
 * Course class.
 *
 * @param {Context} ctx Context where course will be drawn
 */
function Course( ctx ) {
    this.ctx = ctx;
    this.lanes = [];

    Object.defineProperty(this, "laneNbr", {
        get: function() { return this.lanes.length; }
    } );

    this.addLane = function( lane ) {
        this.lanes.push( lane );
        return ( this.laneNbr - 1 );
    };

    this.getLaneAt = function( index ) {
        if ( index < this.laneNbr ) {
            return this.lanes[ index ];
        }
        return undefined;
    };

    this.clear = function() {
        this.ctx.clearRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height );
    };

    this.draw = function() {
        for (var lane_i = 0; lane_i < this.laneNbr; lane_i++ ) {
            this.lanes[ lane_i ].buildDraw();
        }
    };
}

/**
 * Car specifications class.
 */
function CarSpecs(st, cv, sh) {
    this.speed = { straight: st, curve: cv, sharp: sh };

    this.setStraight = function( value ) {
        this.speed.straight = value;
    };

    this.setCurve = function( value ) {
        this.speed.curve = value;
    };

    this.setSharp = function( value ) {
        this.speed.sharp = value;
    };

    this.getStraight = function() {
        return this.speed.straight;
    };

    this.getCurve = function() {
        return this.speed.curve;
    };

    this.getSharp = function() {
        return this.speed.sharp;
    };

    this.set = function( straight, curve, sharp ) {
        this.setStraight( straight );
        this.setCurve( curve );
        this.setSharp( sharp );
    };

    this.get = function() {
        return this.speed;
    };

    this.getSpeed = function( segment_type ) {
        var segmentSpeed = 0;
        if ( segment_type === SEGMENT_TYPE.straight ) {
            segmentSpeed = this.getStraight();
        } else if ( segment_type === SEGMENT_TYPE.curve ) {
            segmentSpeed = this.getCurve();
        } else if ( segment_type === SEGMENT_TYPE.curve_sharp ) {
            segmentSpeed = this.getSharp();
        }
        return segmentSpeed;
    };

    this.clear = function() {
        this.setStraight( 0 );
        this.setCurve( 0 );
        this.setSharp( 0 );
    };
}

/**
 * Car class.
 *
 * @param {CarSpecs} specs Car specifications
 * @param {String} color Car color
 */
function Car( specs, color ) {
    this.__lane = undefined;
    this.segment = 0;
    this.t = 0.0;
    this.color = color ? color : "black";
    this.lap = 0;
    this.specs = specs;

    this.setLane = function( lane ) {
        this.__lane = lane;
    };

    Object.defineProperty(this, "lane", {
        get: function() { return this.__lane; },
        set: function( val ) {
            this.__lane = val;
            this.__lane.setCar( this );
        }
    } );

    this.draw = function( ctx, x, y ) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo( x, y );
        ctx.arc( x, y, 3, 0, 2 * Math.PI );
        ctx.stroke();
    };

    this.speed = function() {
        var segmentType = this.lane.path[ this.segment ].type;
        return this.specs.getSpeed( segmentType );
    };

    this.newpos = function() {
        var f = this.lane.path[ this.segment ].f;
        var args = this.lane.path[ this.segment ].args.slice();
        args.unshift( this.t );
        var pos = f.apply( null, args );
        return pos;
    };

    this.move = function() {
        var segmentType = this.lane.path[ this.segment ].type;
        var segmentSpeed = this.speed();
        var speed = Math.floor( Math.random() * segmentSpeed ) + 1;
        var steps = this.lane.path[ this.segment ].steps;
        this.t += speed / steps;
        if ( this.t > 1.0 ) {
            this.segment++;
            if ( this.segment === this.lane.path.length ) {
                this.segment = 0;
                this.lap++;
            }
            this.t -= 1.0;
        }
        return this.newpos();
    };
}

/**
 * Race class.
 *
 * @param {Context} ctx   Context where race course will be drawn
 * @param {Course} course Course for the race
 * @param {Array} cars    Array with all cars for the race
 */
function Race( ctx, course, cars ) {
    var that = this;
    var DEFAULT_TIMEOUT = 200;
    this.ctx = ctx;
    this.course = course;
    this.cars = cars === undefined ? [] : cars;
    this.timer = undefined;

    this.addCar = function( car ) {
        this.cars.push( car );
    };

    this.placeCarAt = function( car, lane_nbr ) {
        car.lane = this.course.getLaneAt( lane_nbr );
    };

    this.validate = function() {
        return ( this.course && this.cars );
    };

    this.setup = function() {
        if ( this.validate() ) {
            this.course.draw();
        }
    };

    this.moveCars= function() {
        for ( var c_i = 0; c_i < this.cars.length; c_i++ ) {
            var car = this.cars[ c_i ];
            var pos = car.move();
            car.draw( this.ctx, pos.x, pos.y );
        }
    };

    this.start = function( time ) {
        that.course.draw();
        if ( this.validate() ) {
            this.timer = setInterval( function() {
                that.course.clear();
                that.course.draw();
                that.moveCars();
            }, time === undefined ? DEFAULT_TIMEOUT : time );
        }
    };

    this.stop = function() {
        if ( this.timer ) {
            clearInterval( this.timer );
        }
    };
}