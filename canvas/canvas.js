var nbrCars = 4;
var cars = [];
var colors = [ "red", "blue", "green", "cyan", "yellow" ];
var specs = [ { speed_s: 6, speed_c: 1, speed_d: 6 },
              { speed_s: 5, speed_c: 2, speed_d: 2 },
              { speed_s: 6, speed_c: 5, speed_d: 1 },
              { speed_s: 4, speed_c: 6, speed_d: 5 } ];

function createVars( courses ) {
    for ( var i = 0; i < nbrCars; i++ ) {
        cars.push( new Car( courses[ i ],
                   specs[ i ],
                   colors[ i ] ) );
    }
}

function setRaceInfo( msg ) {
    var info = document.getElementById( "info" );
    info.innerHTML = msg;
}

function buildFullCoursePath( ctx ) {
    var offsets = [ 10, 20, 30, 40 ];
    var courses = [];

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
        courses.push( course );
        console.log( course.path );
    }

    createVars( courses );

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
            var car = cars[ i ];
            var pos = car.move();
            car.draw( ctx, pos.x, pos.y );
            msg += "car " + ( i + 1 ) + " [" + cars[ i ].lap + "]\n";
        }
        setRaceInfo( msg );
    }, 200 );
}

window.onload = function() {
    var c = document.getElementById( "canvas" );
    var ctx = c.getContext( "2d" );

    buildFullCoursePath( ctx );
};