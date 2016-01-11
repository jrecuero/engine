var nbrCars = 4;
var paths = [];
var steps = [];
var cars = [];
var colors = [ "red", "blue", "green", "cyan", "yellow" ];
var SEGMENT_TYPE = { straight: 0, curve: 1, sharp_curve: 2 };
var specs = [ { speed_s: 6, speed_c: 1, speed_d: 6 },
              { speed_s: 5, speed_c: 2, speed_d: 2 },
              { speed_s: 6, speed_c: 5, speed_d: 1 },
              { speed_s: 4, speed_c: 6, speed_d: 5 } ];

var LINE_LEN = 100.0;
var CURVE = { FULL: 100, HALF: 50, QUARTER: 25 };
var SHARP = { X: 'x', Y: 'y' };
var UNIFIED_LENGTH = 5.0;

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

function getStepsFromLength( length ) {
    var steps = length / UNIFIED_LENGTH;
    return Math.round( steps );
}

function getPointsFromLine( start_p, end_p, length, angle ) {
    if ( !angle ) angle = 0;
    if ( !end_p ) end_p = Point( start_p.x + length, start_p.y );
    var rotPair = rotate( [ start_p, end_p ], angle );
    return [ start_p, rotPair[ 1 ] ];
}

function drawLine( ctx, start_p, end_p, length, angle, resolution ) {
    var points = getPointsFromLine( start_p, end_p, length, angle );
    var startP = points[ 0 ];
    var endP = points[ 1 ];
    ctx.moveTo( startP.x, startP.y );
    drawLineBezier( ctx, startP, endP, resolution );
    return endP;
}

function drawBox( ctx, start_p, length, angle, wide, resolution ) {
    if ( !angle ) angle = 0;
    if ( !wide ) wide = 50;
    var endP = Point( start_p.x + length, start_p.y );
    ctx.save();
    if ( angle ) {
        ctx.translate( ( start_p.x + length ) / 2,
                       ( start_p.y + wide ) / 2 );
        ctx.rotate( angle * Math.PI / 180 );
        ctx.translate( -( start_p.x + length ) / 2,
                       -( start_p.y + wide ) / 2 );
    }
    ctx.rect( start_p.x, start_p.y, length, wide );
    ctx.restore();
    return endP;
}

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

function drawCurve( ctx, start_p, ctrl_p, end_p, percent, resolution ) {
    ctx.moveTo( start_p.x, start_p.y );
    var points = getPointsFromCurve( start_p, ctrl_p, end_p, percent );
    drawCuadraticBezier( ctx, points[ 0 ], points[ 1 ], points[ 2 ], resolution );
    return points[ 2 ];
}

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

function drawSharpCurve( ctx, start_p, end_p, side, sharpness, resolution ) {
    ctx.moveTo( start_p.x, start_p.y );
    var points = getPointsFromSharpCurve( start_p, end_p, side, sharpness );
    drawCuadraticBezier( ctx, points[ 0 ], points[ 1 ], points[ 2 ], resolution );
    return points[ 2 ];
}

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
        return points[ 2 ];
    };

    this.length = function() {
        var points = getPointsFromCurve( this.startP, this.ctrlP, this.endP, this.percentage );
        return bezierLength( getCuadraticBezier, points );
    };
}

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
        return points[ 2 ];
    };

    this.length = function() {
        var points = getPointsFromSharpCurve( this.startP, this.endP, this.side, this.sharpness );
        return bezierLength( getCuadraticBezier, points );
    };
}

// function st1( ctx, start_p, angle, resolution ) {
//     return drawLine( ctx, start_p, undefined, LINE_LEN, angle, resolution );
// }

// function st2( ctx, start_p, angle, resolution ) {
//     return drawLine( ctx, start_p, undefined, LINE_LEN / 2, angle, resolution );
// }

// function st4( ctx, start_p, angle, resolution ) {
//     return drawLine( ctx, start_p, undefined, LINE_LEN / 4, angle, resolution );
// }

// function cv1( ctx, start_p, ctrl_p, end_p, resolution ) {
//     return drawCurve( ctx, start_p, ctrl_p, end_p, 100, resolution );
// }

// function cv2( ctx, start_p, ctrl_p, end_p, resolution ) {
//     return drawCurve( ctx, start_p, ctrl_p, end_p, 50, resolution );
// }

// function cv4( ctx, start_p, ctrl_p, end_p, resolution ) {
//     return drawCurve( ctx, start_p, ctrl_p, end_p, 25, resolution );
// }

// function sh( ctx, start_p, end_p, side, sharpness, resolution ) {
//     return drawSharpCurve( ctx, start_p, end_p, side, sharpness, resolution );
// }

// function sh1( ctx, start_p, end_p, side, sharpness, resolution ) {
//     return drawSharpCurve( ctx, start_p, end_p, side, start_p.x, resolution );
// }

// function sh2( ctx, start_p, end_p, side, sharpness, resolution ) {
//     return drawSharpCurve( ctx, start_p, end_p, side, start_p.x * 2, resolution );
// }

// function sh4( ctx, start_p, end_p, side, sharpness, resolution ) {
//     return drawSharpCurve( ctx, start_p, end_p, side, start_p.x * 4, resolution );
// }

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

function PieceStraight( start_p, end_p, length, angle ) {
    Piece.call( this, new st( start_p, end_p, length, angle ) );
}
PieceStraight.prototype = new Piece();
PieceStraight.prototype.constructor = PieceStraight;

function PieceCurve( start_p, ctrl_p, end_p, percentage ) {
    Piece.call( this, new cv( start_p, ctrl_p, end_p, percentage ) );
}
PieceCurve.prototype = new Piece();
PieceCurve.prototype.constructor = PieceCurve;

function PieceSharpCurve( start_p, end_p, side, sharpness ) {
    Piece.call( this, new sh( start_p, end_p, side, sharpness ) );
}
PieceSharpCurve.prototype = new Piece();
PieceSharpCurve.prototype.constructor = PieceSharpCurve;

function PieceClose( end_p ) {
    Piece.call( this, new st( undefined, end_p ) );
}
PieceClose.prototype = new Piece();
PieceClose.prototype.constructor = PieceClose;


// function PieceSt( piece_f, start_p, angle ) {
//     this.pieceF = piece_f;
//     this.data = { startP: start_p, angle: angle };

//     this.build = function( ctx, start_p, resolution ) {
//         if ( start_p === undefined ) start_p = this.data.startP;
//         return this.pieceF( ctx, start_p, this.data.angle, resolution );
//     };

//     this.getStart = function() {
//         return this.data.startP;
//     };
// }

// function PieceCv( piece_f, start_p, ctrl_p, end_p ) {
//     this.pieceF = piece_f;
//     this.data = { startP: start_p, ctrlP: ctrl_p, endP: end_p };

//     this.build = function( ctx, start_p, resolution ) {
//         var startP;
//         var ctrlP = this.data.ctrlP;
//         var  endP = this.data.endP;
//         if ( start_p === undefined ) {
//             startP = this.data.startP;
//         } else {
//             startP = start_p;
//             var movePoints = move( [ ctrlP, endP ], this.data.startP, start_p );
//             ctrlP = movePoints[ 0 ];
//             endP = movePoints[ 1 ];
//         }
//         return this.pieceF( ctx, startP, ctrlP, endP, resolution );
//     };

//     this.getStart = function() {
//         return this.data.startP;
//     };
// }

// function PieceSh( piece_f, start_p, end_p, side, sharpness ) {
//     this.pieceF = piece_f;
//     this.data = { startP: start_p, endP: end_p, side: side, sharpness: sharpness };

//     this.build = function( ctx, start_p, resolution ) {
//         var startP;
//         var  endP = this.data.endP;
//         if ( start_p === undefined ) {
//             startP = this.data.startP;
//         } else {
//             startP = start_p;
//             var movePoints = move( [ endP ], this.data.startP, start_p );
//             endP = movePoints[ 0 ];
//         }
//         return this.pieceF( ctx, startP, endP, this.data.side, sharpness, resolution );
//     };

//     this.getStart = function() {
//         return this.data.startP;
//     };
// }

// function PieceClose( end_p ) {
//     this.data = { endP: end_p };

//     this.build = function ( ctx, start_p, resolution ) {
//         drawLine( ctx, start_p, this.data.endP, undefined, undefined, resolution );
//     };
// }

function Composition( ctx, resolution ) {
    this.ctx = ctx;
    this.resolution = resolution;
    this.startP = undefined;
    this.attachP = undefined;
    this.pieces = [];
    this.path = [];

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

// function fullCurve( ctx, points, resolution ) {
//     drawCuadraticBezier( ctx, points[ 0 ], points[ 1 ], points[ 2 ], resolution );
//     return points[ 2 ];
// }

// function halfCurve( ctx, points, resolution ) {
//     var mid = points[ 0 ].x + Math.abs( points[ 0 ].x - points[ 1 ].x ) / 2;
//     var midP = Point( mid, points[ 0 ].y );
//     var endP = getCuadraticBezier( 0.5, points[ 0 ], points[ 1 ], points[ 2 ] );
//     return fullCurve( ctx, [ points[ 0 ], midP, endP ], resolution );
// }

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
                       type: SEGMENT_TYPE.sharp_curve } );
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

function moveCarInCourse( ctx, car, course ) {
    var segmentType = car.segment;
    var segmentSpeed = getSegmentSpeed( segmentType, car.spec );
    var speed = Math.floor( Math.random() * segmentSpeed ) + 1;
    var steps = course.path[ car.segment ].steps;
    car.t += speed / steps;
    if ( car.t > 1.0 ) {
        car.segment++;
        if ( car.segment === course.path.length ) {
            car.segment = 0;
            car.lap++;
        }
        car.t -= 1.0;
    }
    var pos = getPositionInPath( course.path, car.segment, car.t );
    drawCarAt( ctx, car, pos.x, pos.y );
}

function simpleCourse( ctx ) {
    createVars();
    for ( var i = 0; i < nbrCars; i++ ) {
        createPath( i );
    }
    drawPaths( ctx );

    setInterval( move_cars, 200 );
}

function buildWithApi( ctx ) {
    drawLine( ctx, Point( 0, 0 ), undefined, 50 );
    drawCurve( ctx, Point( 50, 0 ), Point( 100, 0 ), Point( 100, 50 ), 50 );
}

function buildWithPieces( ctx ) {
    var course = new Composition( ctx );
    course.attach( new PieceSt( st2, Point( 0, 0 ) ) );
    course.attach( new PieceCv( cv1, Point( 0, 0 ), Point( 50, 0 ), Point( 50, 50 ) ) );
    course.attach( new PieceCv( cv2, Point( 50, 0 ), Point( 50, 50 ), Point( 0, 50 ) ) );
    course.attach( new PieceSt( st4, undefined, 135 ) );
    course.build();
}

function buildWithBlocks( ctx ) {
    drawBox( ctx, Point( 50, 50 ), 50 );

    drawBox( ctx, Point( 100, 50 ), 50, 15 );
    drawBox( ctx, Point( 150, 50 ), 50, 30 );
    drawBox( ctx, Point( 200, 50 ), 50, 45 );
    drawBox( ctx, Point( 250, 50 ), 50, 60 );
    drawBox( ctx, Point( 300, 50 ), 50, 75 );
    drawBox( ctx, Point( 350, 50 ), 50, 90 );
}

function buildSharpCurve( ctx ) {
    // DrawSharpCurve( ctx, Point( 100, 0 ), 'x', 50 );
    sh1( ctx, Point( 150, 50 ), "x" );
    sh2( ctx, Point( 150, 50 ), "x" );
    sh4( ctx, Point( 150, 50 ), "x" );
}

function buildLane( ctx, start_p, offset ) {
    var course = new Composition( ctx );
    course.attach( new PieceSt( st1, start_p ) );
    course.attach( new PieceSt( st1, Point( 100, 0 ) ) );
    course.attach( new PieceSt( st1, Point( 100, 0 ) ) );
    course.attach( new PieceSh( sh, Point( 0, 0 ),
                                Point( 0, 200 - 2*offset ), "x", 500 - 1.5*offset ) );
    course.attach( new PieceCv( cv2, Point( 50, 0 ), Point( 0, 0 ), Point( 0, 50 ) ) );
    course.attach( new PieceSt( st1, Point( 100, 0 ), 135 ) );
    course.attach( new PieceSh( sh, Point( 100, 0 ),
                                Point( offset/2, 0 ), "y", 100 ) );
    course.attach( new PieceCv( cv1, Point( 50, 50 ), Point( 50, 0 ), Point( 0, 0 ) ) );
    course.attach( new PieceSt( st1, Point( 100, 0 ), 180 ) );
    course.attach( new PieceSh( sh, Point( 0, 230 ),
                                Point( 0, 2*offset ), "x", -200 + 1.5*offset) );
    course.closePiece();
    course.build();
}

function buildFullCourse( ctx ) {
    var offsets = [ 0, 10, 20, 30 ];
    for ( var x = 0; x <  offsets.length; x++ ) {
        buildLane(ctx, Point( 200, offsets[ x ] ), offsets[ x ] );
    }
}

function buildFullCoursePath( ctx ) {
    var offsets = [ 10, 20, 30, 40 ];
    var courses = [];

    for ( var i = 0; i < nbrCars; i++ ) {
        cars.push( { segment: 0,
                     t: 0.0,
                     color: colors[ i ],
                     lap: 0,
                     spec: specs[ i ] } );
    }

    for ( var x = 0; x <  offsets.length; x++ ) {
        var offset = offsets[ x ];
        var course = new Composition( ctx );
        course.attach( new PieceStraight( Point( 200, offset ), null, 300 ) );
        course.attach( new PieceSharpCurve( Point( 0, 0 ), Point( 0, 200 - 2*offset ),
                                            SHARP.X, 500 - 1.5*offset ) );
        course.attach( new PieceCurve( Point( 50, 0 ), Point( 0, 0 ), Point( 0, 50 ), CURVE.HALF ) );
        course.attach( new PieceStraight( Point( 0, 0 ), null, 100, 135 ) );
        course.attach( new PieceSharpCurve( Point( 100, 0 ), Point( offset/2, 0 ),
                                            SHARP.Y, 100 ) );
        course.attach( new PieceCurve( Point( 50, 50 ), Point( 50, 0 ), Point( 0, 0 ) ) );
        course.attach( new PieceStraight( Point( 0, 0 ), null, 100, 180 ) );
        course.attach( new PieceSharpCurve( Point( 0, 230 ), Point( 0, 2*offset ),
                                            SHARP.X, -200 + 1.5*offset) );
        course.closePiece();
        course.buildPath();
        // course.buildDraw();
        courses.push( course );
        console.log( course.path );
    }

    for ( var c in courses ) {
        courses[ c ].buildDraw();
    }

    setInterval( function() {
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        for ( var c_i in courses ) {
            var course = courses[ c_i ];
            course.ctx = ctx;
            course.buildDraw();
        }
        var msg = "";
        for ( var i = 0; i < nbrCars; i++ ) {
            moveCarInCourse( ctx, cars[ i ], courses[ i ] );
            msg += "car " + ( i + 1 ) + " [" + cars[ i ].lap + "]\n";
        }
        setRaceInfo( msg );
    }, 200 );
}

window.onload = function() {
    var c = document.getElementById( "canvas" );
    var ctx = c.getContext( "2d" );

    // simpleCourse( ctx );

    // buildWithApi( ctx );

    // buildWithPieces( ctx );

    // buildWithBlocks( ctx );

    // buildSharpCurve( ctx );

    // buildFullCourse( ctx );

    buildFullCoursePath( ctx );

    ctx.stroke();
};