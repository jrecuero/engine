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
        objId: undefined,
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
        action.objId = (new GObject()).objId;
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
    this.move = function( steps, log_cb ) {
        var obj = that.createAction();
        obj.name = "move";
        obj.type = "move";
        obj.execCb.args = [ steps ];
        obj.execCb.cb = function( args ) {
                // NS_UI.log( "you moved " + args[ 0 ] );
                log_cb ( "you moved " + args[ 0 ] );
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

    return true;
}

var NS_Action = new _Action();
