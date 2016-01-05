var nbrCars = 4;
var paths = [];
var steps = [];
var cars = [];
var colors = [ "red", "blue", "green", "cyan", "yellow" ];
var SEGMENT_TYPE = { straight: 0, curve: 1, deep_curve: 2 };
var specs = [ { speed_s: 6, speed_c: 1, speed_d: 6 },
              { speed_s: 5, speed_c: 2, speed_d: 2 },
              { speed_s: 6, speed_c: 5, speed_d: 1 },
              { speed_s: 4, speed_c: 6, speed_d: 5 } ];

var LINE_LEN = 100.0;

function rotate( points, angle ) {
    var x = points[ 1 ].x - points[ 0 ].x;
    var y = points[ 1 ].y - points[ 0 ].y;
    var rad = angle * Math.PI / 180;
    var newx = x * Math.cos( rad ) - y * Math.sin( rad );
    var newy = y * Math.cos( rad ) + x * Math.sin( rad );
    newx = parseFloat( newx.toFixed( 2 ) );
    newy = parseFloat( newy.toFixed( 2 ) );
    var result = Point( points[ 0 ].x + newx, points[ 0 ].y + newy );
    return [ points[ 0 ], result ];
}

function move( points, origin_p, dest_p ) {
    var movePoints = [];
    for ( var p_i in points ) {
        var point = points[ p_i ];
        var offset = Point( point.x - origin_p.x, point.y - origin_p.y );
        movePoints.push( Point( dest_p.x + offset.x, dest_p.y + offset.y ) );
    }
    return movePoints;
}

function drawLineWithTwoPoints( ctx, start_p, end_p, resolution ) {
    ctx.moveTo( start_p.x, start_p.y );
    drawLineBezier( ctx, start_p, end_p, resolution );
    return end_p;
}

function drawLine( ctx, start_p, length, angle, resolution ) {
    if ( !angle ) angle = 0;
    var endP = Point( start_p.x + length, start_p.y );
    var rotPair = rotate( [ start_p, endP ], angle );
    return drawLineWithTwoPoints( ctx, start_p, rotPair[ 1 ], resolution );
}

function drawCurve( ctx, start_p, ctrl_p, end_p, percent, resolution ) {
    if ( percent === undefined ) percent = 100;
    var percentV = percent / 100;
    var mid, midP;
    if ( start_p.y === ctrl_p.y ) {
        mid = start_p.x + Math.abs( start_p.x - end_p.x ) * percentV;
        midP = Point( mid, start_p.y );
    } else if ( start_p.x === ctrl_p.x ) {
        mid = start_p.y + Math.abs( start_p.y - end_p.y ) * percentV;
        midP = Point( start_p.x, mid );
    } else {
        return undefined;
    }
    var endP = getCuadraticBezier( percentV, start_p, ctrl_p, end_p );
    ctx.moveTo( start_p.x, start_p.y );
    drawCuadraticBezier( ctx, start_p, midP, endP, resolution );
    return endP;
}

function st1( ctx, start_p, angle, resolution ) {
    return drawLine( ctx, start_p, LINE_LEN, angle, resolution );
}

function st2( ctx, start_p, angle, resolution ) {
    return drawLine( ctx, start_p, LINE_LEN/2, angle, resolution );
}

function st4( ctx, start_p, angle, resolution ) {
    return drawLine( ctx, start_p, LINE_LEN/4, angle, resolution );
}

function cv1( ctx, start_p, ctrl_p, end_p, resolution ) {
    return drawCurve( ctx, start_p, ctrl_p, end_p, 100, resolution );
}

function cv2( ctx, start_p, ctrl_p, end_p, resolution ) {
    return drawCurve( ctx, start_p, ctrl_p, end_p, 50, resolution );
}

function cv4( ctx, start_p, ctrl_p, end_p, resolution ) {
    return drawCurve( ctx, start_p, ctrl_p, end_p, 25, resolution );
}

function PieceSt( piece_f, start_p, angle ) {
    this.pieceF = piece_f;
    this.data = { startP: start_p, angle: angle };

    this.build = function( ctx, start_p, resolution ) {
        if ( start_p === undefined ) start_p = this.data.startP;
        return this.pieceF( ctx, start_p, this.data.angle, resolution );
    };
}

function PieceCv( piece_f, start_p, ctrl_p, end_p ) {
    this.pieceF = piece_f;
    this.data = { startP: start_p, ctrlP: ctrl_p, endP: end_p };

    this.build = function( ctx, start_p, resolution ) {
        var startP;
        var ctrlP = this.data.ctrlP;
        var  endP = this.data.endP;
        if ( start_p === undefined ) {
            startP = this.data.startP;
        } else {
            startP = start_p;
            var movePoints = move( [ ctrlP, endP ], this.data.startP, start_p );
            ctrlP = movePoints[ 0 ];
            endP = movePoints[ 1 ];
        }
        return this.pieceF( ctx, startP, ctrlP, endP, resolution );
    };
}

function Composition( ctx, resolution ) {
    this.ctx = ctx;
    this.resolution = resolution;
    this.attachP = undefined;
    this.pieces = [];

    this.attach = function( next_piece ) {
        this.pieces.push( next_piece );
    };

    this.dettach = function() {
        return this.pieces.pop();
    };

    this.build = function() {
        for ( var p_i in this.pieces ) {
            var piece = this.pieces[ p_i ];
            this.attachP = piece.build( this.ctx, this.attachP, this.resolution );
        }
    };
}


function fullCurve( ctx, points, resolution ) {
    drawCuadraticBezier( ctx, points[ 0 ], points[ 1 ], points[ 2 ], resolution );
    return points[ 2 ];
}

function halfCurve( ctx, points, resolution ) {
    var mid = points[ 0 ].x + Math.abs( points[ 0 ].x - points[ 1 ].x ) / 2;
    var midP = Point( mid, points[ 0 ].y );
    var endP = getCuadraticBezier( 0.5, points[ 0 ], points[ 1 ], points[ 2 ] );
    return fullCurve( ctx, [ points[ 0 ], midP, endP ], resolution );
}

function getSegmentSpeed( segment_type, spec ) {
    var segmentSpeed = 0;
    if ( segment_type === SEGMENT_TYPE.straight ) {
        segmentSpeed = spec.speed_s;
    } else if ( segment_type === SEGMENT_TYPE.curve ) {
        segmentSpeed = spec.speed_c;
    } else {
        segmentSpeed = spec.speed_d;
    }
    return segmentSpeed;
}

function getPositionInPath( path, segment, t ) {
    var f = path[ segment ].f;
    var args = path[ segment ].args.slice();
    args.unshift( t );
    var result = f.apply( null, args );
    return result;
}

function createVars() {
    for ( var i = 0; i < nbrCars; i++ ) {
        paths.push( [] );
        cars.push( { segment: 0,
                     t: 0.0,
                     color: colors[ i ],
                     lap: 0,
                     spec: specs[ i ] } );
    }
}

function createPath( p ) {
    var origin, next, x;
    var C1, C2, C3, C4;
    var diff = 10 * p;
    steps = [];

    C1 = Point( 100, 10 + diff );
    C2 = Point( 200, 10 + diff );
    paths[ p ].push( { f: getLineBezier,
                       args: [ C1, C2 ],
                       type: SEGMENT_TYPE.straight } );
    steps.push( 0.02 );

    C1 = Point( 200, 10 + diff );
    C2 = Point( 350 - diff, 0 + diff );
    C3 = Point( 450 - diff, 200 - diff );
    C4 = Point( 300, 200 - diff );
    paths[ p ].push( { f: getCubicBezier,
                       args: [ C1, C2, C3, C4 ],
                       type: SEGMENT_TYPE.curve } );
    steps.push( 0.005 );

    C1 = Point( 300, 200 - diff );
    C2 = Point( 100, 200 - diff );
    C3 = Point( 100, 400 - diff );
    C4 = Point( 50 + diff, 100 );
    paths[ p ].push( { f: getCubicBezier,
                       args: [ C1, C2, C3, C4 ],
                       type: SEGMENT_TYPE.deep_curve } );
    steps.push( 0.005 );

    C1 = Point( 50 + diff, 100 );
    C2 = Point( 50 + diff, 100 );
    C3 = Point( 30 + diff, 10 + diff );
    C4 = Point( 102, 10 + diff );
    paths[ p ].push( { f: getCubicBezier,
                       args: [ C1, C2, C3, C4 ],
                       type: SEGMENT_TYPE.curve } );
    steps.push( 0.02 );
}

function drawPath( ctx, path ) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo( path[ 0 ].args[ 0 ].x, path[ 0 ].args[ 1 ].y );
    drawBezier( ctx, getLineBezier, path[ 0 ].args );
    drawBezier( ctx, getCubicBezier, path[ 1 ].args );
    drawBezier( ctx, getCubicBezier, path[ 2 ].args );
    drawBezier( ctx, getCubicBezier, path[ 3 ].args );
    ctx.stroke();
}

function setRaceInfo( msg ) {
    var info = document.getElementById( "info" );
    info.innerHTML = msg;
}

function drawPaths( ctx ) {
    for ( var i = 0; i < nbrCars; i++ ) {
        drawPath( ctx, paths[ i ] );
    }
}

var move_cars = function() {
    var c = document.getElementById( "canvas" );
    var ctx = c.getContext( "2d" );
    ctx.clearRect( 0, 0, c.width, c.height );
    drawPaths( ctx );
    var msg = "";
    for ( var i = 0; i < nbrCars; i++ ) {
        moveCar( ctx, i );
        msg += "car " + ( i + 1 ) + " [" + cars[ i ].lap + "]\n";
    }
    setRaceInfo( msg );
};

var drawCarAt = function( ctx, car, x, y ) {
    ctx.beginPath();
    ctx.strokeStyle = car.color;
    ctx.moveTo( x, y );
    ctx.arc( x, y, 3, 0, 2 * Math.PI );
    ctx.stroke();
};

var moveCar = function( ctx, car_idx ) {
    var car = cars[ car_idx ];
    var segmentType = car.segment;
    var segmentSpeed = getSegmentSpeed( segmentType, car.spec );
    var speed = Math.floor( Math.random() *  segmentSpeed ) + 1;
    var step = steps[ car.segment ];
    var nbrSegments = steps.length;
    car.t += step * speed;
    if ( car.t > 1.0 ) {
        car.segment++;
        if ( car.segment === nbrSegments ) {
            car.segment = 0;
            car.lap++;
        }
        car.t -= 1.0;
    }
    var pos = getPositionInPath( paths[ car_idx ], car.segment, car.t );
    drawCarAt( ctx, car, pos.x, pos.y );
};

function simpleCourse( ctx ) {
    createVars();
    for ( var i = 0; i < nbrCars; i++ ) {
        createPath( i );
    }
    drawPaths( ctx );

    setInterval( move_cars, 200 );
}

function buildWithApi( ctx ) {

    // Full_line(ctx, [Point(0, 0), Point(50, 0)]);
    // fullCurve(ctx, [Point(50, 0), Point(100, 0), Point(100, 50)]);
    // fullCurve(ctx, [Point(100, 50), Point(100, 100), Point(150, 100)]);
    // fullCurve(ctx, [Point(150, 100), Point(200, 100), Point(200, 50)]);
    // ctx.moveTo(50, 0);
    // var p = getCuadraticBezier(0.5, Point(50, 0), Point(100, 0), Point(100, 50));
    // fullCurve(ctx, [Point(50, 0), Point(75, 0), p]);

    // var nextP = halfCurve(ctx, [Point(50, 0), Point(100, 0), Point(100, 50)]);
    // var endP = Point(nextP.x + 50, nextP.y);
    // var result = rotate([nextP, endP], 45);
    // nextP = drawLineWithTwoPoints(ctx, result[0], result[1]);
    // endP = Point(nextP.x + 50, nextP.y);
    // result = rotate([nextP, endP], 90);
    // nextP = drawLineWithTwoPoints(ctx, result[0], result[1]);

    // drawLine( ctx, Point( 0, 0 ), 100, 45 );
    drawLine( ctx, Point( 0, 0 ), 50 );
    drawCurve( ctx, Point( 50, 0 ), Point( 100, 0 ), Point( 100, 50 ), 50 );
}

function buildWithPieces( ctx ) {
    var course = new Composition( ctx );
    course.attach( new PieceSt ( st2, Point( 0, 0 ) ) );
    course.attach( new PieceCv ( cv1, Point( 0, 0 ), Point( 50, 0 ), Point( 50, 50 ) ) );
    course.attach( new PieceCv ( cv2, Point( 50, 0 ), Point( 50, 50 ), Point(0 , 50 ) ) );
    course.attach( new PieceSt ( st4, undefined, 135 ) );
    course.build();
}

window.onload = function() {

    var c = document.getElementById( "canvas" );
    var ctx = c.getContext( "2d" );

    // simpleCourse( ctx );

    // buildWithApi( ctx );

    buildWithPieces( ctx );

    ctx.stroke();
};
