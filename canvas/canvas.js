(function() {
    function Pair() {
        this.initialize.apply(this, arguments);
    }

    Pair.prototype.constructor = Pair;

    Pair.prototype.initialize = function(x, y) {
        this.x = x;
        this.y = y;
    };

    function ColorPair() {
        this.initialize.apply(this, arguments);
    }

    ColorPair.prototype = Object.create(Pair.prototype);
    ColorPair.prototype.constructor = ColorPair;

    ColorPair.prototype.initialize = function(x, y, color) {
        Pair.prototype.initialize.call(this, x, y);
        this.color = color;
    };

    function createCars( course ) {
        var index = 0;
        var cars = [];
        var colors = [ "red", "blue", "green", "cyan", "yellow" ];
        var specs = [ new CarSpecs( 6, 1, 6 ),
                      new CarSpecs( 5, 2, 2 ),
                      new CarSpecs( 6, 5, 1 ),
                      new CarSpecs( 4, 6, 5 ) ];
        var nbrCars = specs.length;
        for ( var i = 0; i < nbrCars; i++ ) {
            cars.push( new Car( specs[ i ], colors[ i ] ) );
            cars[ i ].lane = course.getLaneAt( index );
            index++;
            if ( index >= course.laneNbr ) {
                index = 0;
            }
            cars[ i ].t = 0.1 * i;
        }
        return cars;
    }

    function createCourse( ctx ) {
        var course = new Course( ctx );
        var offsets = [ 10, 20, 30, 40 ];

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
        return course;
    }

    function createCourseRound( ctx ) {
        var course = new Course( ctx );
        var offsets = [ 0, 10, 20, 30 ];

        for ( var x = 0; x <  offsets.length; x++ ) {
            var offset = offsets[ x ];
            var lane = new CourseLane( ctx );
            lane.attach( new PieceStraight( Point( 200, 10 + offset ), null, 300 ) );
            lane.attach( new PieceCurve( Point( 0, offset ), Point( 200 - offset, 100 ), Point( 0, 200 - offset ) ) );
            lane.attach( new PieceStraight( Point( 0, 0 ), null, 310, 180 ) );
            lane.attach( new PieceCurve( Point( 0, 200 - offset ), Point( -200 + offset, 100 ), Point( 0, offset ) ) );
            lane.closePiece();
            lane.buildPath();
            course.addLane( lane );
        }
        return course;
    }

    function buildRace( ctx ) {
        // var course = createCourse( ctx );
        var course = createCourseRound( ctx );
        var cars = createCars( course );
        var race = new Race( ctx, course, cars );
        race.start();
    }

    window.onload = function() {
        var c = document.getElementById( "canvas" );
        var ctx = c.getContext( "2d" );

        buildRace( ctx );
    };
})();
