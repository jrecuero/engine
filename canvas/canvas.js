var nbrCars = 4;
var paths = [];
var steps = [];
var cars = [];
var colors = [ "red", "blue", "green", "cyan", "yellow" ];
var specs = [ { speed: 6 }, { speed: 5 }, { speed: 6 }, { speed: 4 } ];

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
    paths[ p ].push( { f: getLineBezier, args: [ C1, C2 ] } );
    steps.push( 0.02 );

    // Steps.push(0.01);

    C1 = Point( 200, 10 + diff );
    C2 = Point( 350 - diff, 0 + diff );
    C3 = Point( 450 - diff, 200 - diff );
    C4 = Point( 300, 200 - diff );
    paths[ p ].push( { f: getCubicBezier, args: [ C1, C2, C3, C4 ] } );
    steps.push( 0.005 );

    // Steps.push(0.01);

    C1 = Point( 300, 200 - diff );
    C2 = Point( 100, 200 - diff );
    C3 = Point( 100, 400 - diff );
    C4 = Point( 50 + diff, 100 );
    paths[ p ].push( { f: getCubicBezier, args: [ C1, C2, C3, C4 ] } );
    steps.push( 0.005 );

    // Steps.push(0.01);

    C1 = Point( 50 + diff, 100 );
    C2 = Point( 50 + diff, 100 );
    C3 = Point( 30 + diff, 10 + diff );
    C4 = Point( 102, 10 + diff );
    paths[ p ].push( { f: getCubicBezier, args: [ C1, C2, C3, C4 ] } );
    steps.push( 0.02 );

    // Steps.push(0.01);
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

window.onload = function() {
    createVars();
    var c = document.getElementById( "canvas" );
    var ctx = c.getContext( "2d" );
    for ( var i = 0; i < nbrCars; i++ ) {
        createPath( i );
    }
    drawPaths( ctx );
};

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

var moveCar = function( ctx, carIdx ) {
    var speed = Math.floor( Math.random() * cars[ carIdx ].spec.speed ) + 1;
    var step = steps[ cars[ carIdx ].segment ];
    var nbrSegments = steps.length;
    cars[ carIdx ].t += step * speed;
    if ( cars[ carIdx ].t > 1 ) {
        cars[ carIdx ].segment++;
        if ( cars[ carIdx ].segment === nbrSegments ) {
            cars[ carIdx ].segment = 0;
            cars[ carIdx ].lap++;
        }
        cars[ carIdx ].t -= 1.0;

        // Cars[carIdx].t = 0;
    }
    var pos = getPositionInPath( paths[ carIdx ], cars[ carIdx ].segment, cars[ carIdx ].t );
    drawCarAt( ctx, cars[ carIdx ], pos.x, pos.y );
};

setInterval( move_cars, 200 );