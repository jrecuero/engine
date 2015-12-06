/**
 * Action NameSpace function
 * @return {Boolean} Always true
 */
function _Action() {
    /**
     * Keep a copy for the object instance.
     * @type {_Action}
     */
    var that = this;

    /**
     * Game engine instance
     * @type {_Engine}
     */
    var __engine;

    /**
     * Set game engine for the attribute variable
     * @param {_Engine} engine Game engine instance
     * @return {Boolean} Always true
     */
    this.setEngine = function( engine ) {
        __engine = engine;
        return true;
    };

    /**
     * Action class for any action used in the game.
     * @class
     */
    this.Action = {
        name: undefined,
        type: undefined,
        execCb: { cb: undefined, args: [] },
        passCb: { cb: undefined, args: [] },
        errorCb: { cb: undefined, args: [] },
        active: false,
        periodic: 0,
        remove: true,
        runExec: function() {
            return this.execCb.cb( this.execCb.args );
        },
        runPass: function( result ) {
            if ( this.passCb.cb ) {
                return this.passCb.cb( result, this.passCb.args );
            }
            return false;
        },
        runError: function( result ) {
            if ( this.errorCb.cb ) {
                return this.errorCb.cb( result, this.errorCb.args );
            }
            return false;
        },
    };

    this.createAction = function() {
        var action = Object.create( this.Action );
        action.execCb = { cb: undefined, args: [] };
        action.passCb = { cb: undefined, args: [] };
        action.errorCb = { cb: undefined, args: [] };
        return action;
    };

    /**
     * Move Action class for movement action.
     * @param {Integer} steps Number of steps to move
     * @return {Boolean} Always true
     */
    this.move = function( steps ) {
        var obj = that.createAction();
        obj.name = "move";
        obj.type = "move";
        obj.execCb.args = [ steps ];
        obj.execCb.cb = function( args ) {
                NS_UI.log( "you moved " + args[ 0 ] );
                return true;
        };
        return obj;
    };

    /**
     * Use Action class for action.
     * @param {String} Object to use
     * @return {Boolean} Always true
     */
    this.use = function( use_obj ) {
        var obj = that.createAction();
        obj.name = "use";
        obj.type = "use";
        obj.execCb.args = [ use_obj ];
        obj.execCb.cb = function( args ) {
            NS_UI.log( "you used " + args[ 0 ] );
            return true;
        };
        obj.passCb.args = [ use_obj ];
        obj.passCb.cb = function ( args ) {
            NS_UI.log( "used callback with " + args[ 0 ] );
        };
        return obj;
    };

    /**
     * Take Action class for action.
     * @param {String} Object to take
     * @return {Boolean} Always true
     */
    this.take = function( take_obj ) {
        var obj = that.createAction();
        obj.name = "take";
        obj.type = "take";
        obj.execCb.args = [ take_obj ];
        obj.execCb.cb = function( args ) {
            NS_UI.log( "you took " + args[ 0 ] );
            return true;
        };
        return obj;
    };

    /**
     * Drop Action class for action.
     * @param {String} Object to drop
     * @return {Boolean} Always true
     */
    this.drop = function( drop_obj ) {
        var obj = that.createAction();
        obj.name = "drop";
        obj.type = "drop";
        obj.execCb.args = [ drop_obj ];
        obj.execCb.cb = function( args ) {
            NS_UI.log( "you drop " + args[ 0 ] );
            return true;
        };
        return obj;
    };

    /**
     * Attack Action class for attack action.
     * @return {Boolean} Always true
     */
    this.attack = function() {
        var obj = that.createAction();
        obj.name = "attack";
        obj.type = "attack";
        obj.execCb.cb = function( args ) {
            NS_GEngine.battleAttack();
            return true;
        };
        return obj;
    };


    /**
     * Start Battle Action class for battle action.
     * @return {Boolean} Always true
     */
    this.battle = function() {
        var obj = that.createAction();
        obj.name = "battle";
        obj.type = "battle";
        obj.execCb.cb = function( args ) {
            return NS_GEngine.initBattle();
        };
        return obj;
    };

    /**
     * Defense Action class for defense action.
     * @return {Boolean} Always true
     */
    this.defense = function() {
        var obj = that.createAction();
        obj.name = "defense";
        obj.type = "defense";
        obj.execCb.cb = function( args ) {
            NS_UI.log( "you defend" );
            return true;
        };
        return obj;
    };

    // /**
    //  * Action class for any action used in the game.
    //  * @param {Array} args Arguments required for the constructor
    //  * @return {Boolean} Always true
    //  */
    // this.Action = function( args ) {
    //     GObject.apply( this, args );
    //     this.actionType = args && args[ 1 ] ? args[ 1 ] : undefined;
    //     this.execute = args && args[ 2 ] ? args[ 2 ] : undefined;
    //     this.execArgs = args && args[ 3 ] ? args[ 3 ] : [];
    //     this.active = args && args[ 4 ] !== undefined ? args[ 4 ] : false;
    //     this.remove = args && args[ 5 ] !== undefined ? args[ 5 ] : true;
    //     this.callback = args && args[ 6 ] ? args[ 6 ] : undefined;
    //     this.cbArgs = args && args[ 7 ] ? args[ 7 ] : [];
    //     this.errorCb = args && args[ 8 ] ? args[ 8 ] : undefined;
    //     this.errorCbArgs = args && args[ 9 ] ? args[ 9 ] : [];
    //     return true;
    // };
    // inheritKlass( GObject, this.Action );

    // /**
    //  * Move Action class for movement action.
    //  * @param {Integer} steps Number of steps to move
    //  * @return {Boolean} Always true
    //  */
    // this.move = function( steps ) {
    //     this.steps = steps ? steps : 1;
    //     var args = [];
    //     args.push( "move" );        // Action name
    //     args.push( "move" );        // Action type
    //     args.push( function() {     // Action execute
    //         NS_UI.log( "you moved " + this.steps );
    //         return true;
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );         // Action active
    //     args.push( true );          // Action remove after exec
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.move );

    // /**
    //  * Use Action class for action.
    //  * @param {String} Object to use
    //  * @return {Boolean} Always true
    //  */
    // this.use = function( obj ) {
    //     this.obj = obj ? obj : "";
    //     var args = [];
    //     args.push( "use" );     // Action name
    //     args.push( "use" );     // Action type
    //     args.push( function() {
    //     // Action execute
    //         NS_UI.log( "you used " + this.obj );
    //         return true;
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );     // Action active
    //     args.push( true );      // Action remove after exec
    //     if ( arguments && arguments[ 1 ] ) {
    //         // Action callback user defined
    //         args.push( arguments[ 1 ] );
    //     } else {
    //         // Action callback default
    //         args.push( function( args ) {
    //             NS_UI.log( "used callback with " + args[ 0 ] );
    //         } );
    //     }

    //     // Action callback argumnets
    //     args.push( Array.prototype.slice.call( arguments ).slice( 2 ) );
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.use );

    // /**
    //  * Take Action class for action.
    //  * @param {String} Object to take
    //  * @return {Boolean} Always true
    //  */
    // this.take = function( obj ) {
    //     this.obj = obj ? obj : "";
    //     var args = [];
    //     args.push( "take" );        // Action name
    //     args.push( "take" );        // Action type
    //     args.push( function() {    // Action execute
    //         NS_UI.log( "you took " + this.obj );
    //         return true;
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );         // Action active
    //     args.push( true );          // Action remove after exec
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.take );

    // /**
    //  * Drop Action class for action.
    //  * @param {String} Object to drop
    //  * @return {Boolean} Always true
    //  */
    // this.drop = function( obj ) {
    //     this.obj = obj ? obj : "";
    //     var args = [];
    //     args.push( "drop" );        // Action name
    //     args.push( "drop" );        // Action type
    //     args.push( function() {    // Action execute
    //         NS_UI.log( "you dropped " + this.obj );
    //         return true;
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );         // Action active
    //     args.push( true );          // Action remove after exec
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.drop );

    // /**
    //  * Attack Action class for attack action.
    //  * TODO: This method has to give up a lot of functionality to be moved to
    //  *  the engine.
    //  * @return {Boolean} Always true
    //  */
    // this.attack = function() {
    //     var args = [];
    //     args.push( "attack" );      // Action name
    //     args.push( "battle" );      // Actioon type
    //     args.push( function() {     // Action execute
    //         NS_GEngine.battleAttack();
    //         return true;
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );         // Action active
    //     args.push( true );          // Action remove after exec
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.attack );

    // /**
    //  * Start Battle Action class for battle action.
    //  * @return {Boolean} Always true
    //  */
    // this.battle = function() {
    //     var args = [];
    //     args.push( "battle" );      // Action name
    //     args.push( "battle" );      // Actioon type
    //     args.push( function() {     // Action execute
    //         return NS_GEngine.initBattle();
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );         // Action active
    //     args.push( true );          // Action remove after exec
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.battle );

    // /**
    //  * Defense Action class for defense action.
    //  * @return {Boolean} Always true
    //  */
    // this.defense = function() {
    //     var args = [];
    //     args.push( "defense" );     // Action name
    //     args.push( "battle" );      // Action type
    //     args.push( function() {     // Action execute
    //         NS_UI.log( "you defend" );
    //         return true;
    //     } );
    //     args.push( undefined );     // Action execute argument
    //     args.push( false );         // Action active
    //     args.push( true );          // Action remove after exec
    //     that.Action.call( this, args );
    //     return true;
    // };
    // inheritKlass( this.Action, this.defense );

    return true;
}

var NS_Action = new _Action();
