/**
 * Action NameSpace function
 * @return {Boolean} Always true
 */
function _Action() {
    /**
     * Keep a copy for the object instance.
     * @type {_Action}
     __*/
    var __that = this;

    /**
     * Game engine instance
     * @type {_Engine}
     */
    var __engine;

    /**
     * Log function to be used by default.
     * @type {Function}
     */
    var __log = NS_UI.log;

    /**
     * Set game engine for the attribute variable
     * @param {_Engine} engine Game engine instance
     * @return {Boolean} Always true
     */
    this.setEngine = function( engine ) {
        __engine = engine;
        return true;
    };

    this.setLog = function( log ) {
        __log = log;
        return __log;
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
        }
    };

    this.createAction = function() {
        var action = Object.create( this.Action );
        action.objId = ( new GObject() ).objId;
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
        log_cb = log_cb ? log_cb : __log;
        var obj = __that.createAction();
        obj.name = "move";
        obj.type = "move";
        obj.execCb.args = [ steps ];
        obj.execCb.cb = function( args ) {
                log_cb( "you moved " + args[ 0 ] );
                return true;
        };
        return obj;
    };

    /**
     * Use Action class for action.
     * @param {String} Object to use
     * @return {Boolean} Always true
     */
    this.use = function( use_obj, log_cb ) {
        log_cb = log_cb ? log_cb : __log;
        var obj = __that.createAction();
        obj.name = "use";
        obj.type = "use";
        obj.execCb.args = [ use_obj ];
        obj.execCb.cb = function( args ) {
            log_cb( "you used " + args[ 0 ] );
            return true;
        };
        obj.passCb.args = [ use_obj ];
        obj.passCb.cb = function( args ) {
            log_cb( "used callback with " + args[ 0 ] );
        };
        return obj;
    };

    /**
     * Take Action class for action.
     * @param {String} Object to take
     * @return {Boolean} Always true
     */
    this.take = function( take_obj, log_cb ) {
        log_cb = log_cb ? log_cb : __log;
        var obj = __that.createAction();
        obj.name = "take";
        obj.type = "take";
        obj.execCb.args = [ take_obj ];
        obj.execCb.cb = function( args ) {
            log_cb( "you took " + args[ 0 ] );
            return true;
        };
        return obj;
    };

    /**
     * Drop Action class for action.
     * @param {String} Object to drop
     * @return {Boolean} Always true
     */
    this.drop = function( drop_obj, log_cb ) {
        log_cb = log_cb ? log_cb : __log;
        var obj = __that.createAction();
        obj.name = "drop";
        obj.type = "drop";
        obj.execCb.args = [ drop_obj ];
        obj.execCb.cb = function( args ) {
            log_cb( "you drop " + args[ 0 ] );
            return true;
        };
        return obj;
    };

    /**
     * Attack Action class for attack action.
     * @return {Boolean} Always true
     */
    this.attack = function() {
        var obj = __that.createAction();
        obj.name = "attack";
        obj.type = "attack";
        obj.execCb.cb = function( args ) {
            NS_Battle.battleAttack();
            return true;
        };
        return obj;
    };

    /**
     * Start Battle Action class for battle action.
     * @return {Boolean} Always true
     */
    this.battle = function() {
        var obj = __that.createAction();
        obj.name = "battle";
        obj.type = "battle";
        obj.execCb.cb = function( args ) {
            return NS_Battle.initBattle();
        };
        return obj;
    };

    /**
     * Defense Action class for defense action.
     * @return {Boolean} Always true
     */
    this.defense = function( log_cb ) {
        log_cb = log_cb ? log_cb : this.log;
        var obj = __that.createAction();
        obj.name = "defense";
        obj.type = "defense";
        obj.execCb.cb = function( args ) {
            log_cb( "you defend" );
            return true;
        };
        return obj;
    };

    return true;
}

var NS_Action = new _Action();
