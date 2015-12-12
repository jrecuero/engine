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

    return true;
}

var NS_Action = new _Action();

/**
 * Move Action class for movement action.
 * @param {Integer} steps Number of steps to move
 * @return {Boolean} Always true
 */
_Action.prototype.move = function( steps, log_cb ) {
    log_cb = log_cb ? log_cb : NS_GEngine.log;
    var obj = NS_Action.createAction();
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
_Action.prototype.use = function( use_obj, log_cb ) {
    log_cb = log_cb ? log_cb : NS_GEngine.log;
    var obj = NS_Action.createAction();
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
_Action.prototype.take = function( take_obj, log_cb ) {
    log_cb = log_cb ? log_cb : NS_GEngine.log;
    var obj = NS_Action.createAction();
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
_Action.prototype.drop = function( drop_obj, log_cb ) {
    log_cb = log_cb ? log_cb : NS_GEngine.log;
    var obj = NS_Action.createAction();
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
_Action.prototype.attack = function() {
    var obj = NS_Action.createAction();
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
_Action.prototype.battle = function( actors ) {
    var obj = NS_Action.createAction();
    obj.name = "battle";
    obj.type = "battle";
    obj.execCb.args = actors;
    obj.execCb.cb = function( args ) {
        return NS_Battle.initBattle( args );
    };
    return obj;
};

/**
 * Defense Action class for defense action.
 * @return {Boolean} Always true
 */
_Action.prototype.defense = function( log_cb ) {
    log_cb = log_cb ? log_cb : this.log;
    var obj = NS_Action.createAction();
    obj.name = "defense";
    obj.type = "defense";
    obj.execCb.cb = function( args ) {
        log_cb( "you defend" );
        return true;
    };
    return obj;
};

_Action.prototype.checkEnemies = function( at_x, at_y) {
    var obj = NS_Action.createAction();
    obj.name = "check enemies";
    obj.type = "scene";
    obj.execCb.args = [ at_x, at_y ];
    obj.execCb.cb = function( args ) {
        NS_GEngine.log("Checking Scene at " + args[0] + ", " + args[1] );
        return true;
    };
    return obj;
};
