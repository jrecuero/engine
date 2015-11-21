/**
 * Action NameSpace function
 * @return {undefined} Nothing
 */
function _Action() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    var __engine;

    /**
     * Set game engine for the attribute variable
     * @param {_Engine} engine Game engine instance
     */
    this.setEngine = function( engine ) {
        __engine = engine;
    };

    /**
     * Action class for any action used in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Action = function( args ) {
        GObject.apply( this, args );
        this.actionType = args && args[ 1 ] ? args[ 1 ] : undefined;
        this.execute = args && args[ 2 ] ? args[ 2 ] : undefined;
        this.active = args && args[ 3 ] ? args[ 3 ] : false;
        this.remove = args && args[ 4 ] ? args[ 4 ] : true;
        this.callback = args && args[ 5 ] ? args[ 5 ] : undefined;
        this.cbArgs = args && args[ 6 ] ? args[ 6 ] : [];
        this.errorCb = args && args[ 7 ] ? args[ 7 ] : undefined;
        this.errorCbArgs = args && args[ 8 ] ? args[ 8 ] : [];
    };
    inheritKlass( GObject, this.Action );

    /**
     * Move Action class for movement action.
     * @param {Integer} steps Number of steps to move
     * @return {undefined} Nothing
     */
    this.move = function( steps ) {
        this.steps = steps ? steps : 1;
        var args = [];
        args.push( "move" );        // Action name
        args.push( "move" );        // Action type
        args.push( function() {     // Action execute
            NS_UI.log( "you moved " + this.steps );
            return true;
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.move );

    /**
     * Use Action class for action.
     * @param {String} Object to use
     * @return {undefined} Nothing
     */
    this.use = function( obj ) {
        this.obj = obj ? obj : "";
        var args = [];
        args.push( "use" );     // Action name
        args.push( "use" );     // Action type
        args.push( function() {
        // Action execute
            NS_UI.log( "you used " + this.obj );
            return true;
        } );
        args.push( false );     // Action active
        args.push( true );      // Action remove after exec
        if ( arguments && arguments[ 1 ] ) {
            // Action callback user defined
            args.push( arguments[ 1 ] );
        } else {
            // Action callback default
            args.push( function( args ) {
                NS_UI.log( "used callback with " + args[ 0 ] );
            } );
        }

        // Action callback argumnets
        args.push( Array.prototype.slice.call( arguments ).slice( 2 ) );
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.use );

    /**
     * Take Action class for action.
     * @param {String} Object to take
     * @return {undefined} Nothing
     */
    this.take = function( obj ) {
        this.obj = obj ? obj : "";
        var args = [];
        args.push( "take" );        // Action name
        args.push( "take" );        // Action type
        args.push( function() {    // Action execute
            NS_UI.log( "you took " + this.obj );
            return true;
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.take );

    /**
     * Drop Action class for action.
     * @param {String} Object to drop
     * @return {undefined} Nothing
     */
    this.drop = function( obj ) {
        this.obj = obj ? obj : "";
        var args = [];
        args.push( "drop" );        // Action name
        args.push( "drop" );        // Action type
        args.push( function() {    // Action execute
            NS_UI.log( "you dropped " + this.obj );
            return true;
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.drop );

    /**
     * Attack Action class for attack action.
     * TODO: This method has to give up a lot of functionality to be moved to
     *  the engine.
     * @return {undefined} Nothing
     */
    this.attack = function() {
        var args = [];
        args.push( "attack" );      // Action name
        args.push( "battle" );      // Actioon type
        args.push( function() {     // Action execute
            NS_GEngine.battleAttack();
            return true;
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.attack );

    /**
     * Start Battle Action class for battle action.
     * @return {undefined} Nothing
     */
    this.battle = function() {
        var args = [];
        args.push( "battle" );      // Action name
        args.push( "battle" );      // Actioon type
        args.push( function() {     // Action execute
            return NS_GEngine.initBattle();
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.battle );

    /**
     * Defense Action class for defense action.
     * @return {undefined} Nothing
     */
    this.defense = function() {
        var args = [];
        args.push( "defense" );     // Action name
        args.push( "battle" );      // Action type
        args.push( function() {     // Action execute
            NS_UI.log( "you defend" );
            return true;
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.defense );
}

var NS_Action = new _Action();
