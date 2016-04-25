var nbrCars = 4;
var cars = [];
var colors = [ "red", "blue", "green", "cyan", "yellow" ];
var specs = [ new CarSpecs( 6, 1, 6 ),
              new CarSpecs( 5, 2, 2 ),
              new CarSpecs( 6, 5, 1 ),
              new CarSpecs( 4, 6, 5 ) ];

function createVars( course ) {
    var index = 0;
    for ( var i = 0; i < nbrCars; i++ ) {
        cars.push( new Car( specs[ i ], colors[ i ] ) );
        cars[ i ].lane = course.getLaneAt( index );
        index++;
        if ( index >= course.laneNbr ) {
            index = 0;
        }
        cars[ i ].t = 0.1 * i;
    }
}

function setRaceInfo( msg ) {
    var info = document.getElementById( "info" );
    info.innerHTML = msg;
}

function buildFullCoursePath( ctx ) {
    var offsets = [ 10, 20, 30, 40 ];
    // var offsets = [ 10, 20, 30 ];
    var course = new Course( ctx );

    for ( var x = 0; x <  offsets.length; x++ ) {
        var offset = offsets[ x ];
        var lane = new CourseLane( ctx );
        lane.attach( new PieceStraight( Point( 200, offset ), null, 300 ) );
        lane.attach( new PieceSharpCurve( Point( 0, 0 ), Point( 0, 200 - 2*offset ),
                                            SHARP.X, 500 - 1.5*offset ) );
        lane.attach( new PieceCurve( Point( 50, 0 ), Point( 0, 0 ), Point( 0, 50 ), CURVE.HALF ) );
        lane.attach( new PieceStraight( Point( 0, 0 ), null, 100, 135 ) );
        lane.attach( new PieceSharpCurve( Point( 100, 0 ), Point( offset/2, 0 ),
                                            SHARP.Y, 100 ) );
        lane.attach( new PieceCurve( Point( 50, 50 ), Point( 50, 0 ), Point( 0, 0 ) ) );
        lane.attach( new PieceStraight( Point( 0, 0 ), null, 100, 180 ) );
        lane.attach( new PieceSharpCurve( Point( 0, 230 ), Point( 0, 2*offset ),
                                            SHARP.X, -200 + 1.5*offset) );
        lane.closePiece();
        lane.buildPath();
        course.addLane( lane );
    }

    createVars( course );

    course.draw();

    setInterval( function() {
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        for ( var c_i = 0; c_i < course.laneNbr; c_i++ ) {
            var lane = course.getLaneAt( c_i );
            // lane.ctx = ctx;
            lane.buildDraw();
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