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

    this.Type = {
        NONE: "none action",
        ACTOR: "actor action",
        BATTLE: "battle action",
        OBJETO: "objeto action",
        SCENE: "scene action",
        MOVE: "movement action",
        ACTION: "interaction action",
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
        owner: undefined,

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

    this.createAction = function( owner ) {
        var action = Object.create( this.Action );
        action.objId = ( new GObject() ).objId;
        action.owner = owner;
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
_Action.prototype.move = function( new_cell, owner ) {
    var obj = NS_Action.createAction();
    obj.owner = owner;
    obj.name = "move";
    obj.type = NS_Action.Type.MOVE;
    obj.cell = new_cell;
    obj.execCb.cb = function( args ) {
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
    obj.type = NS_Action.Type.ACTION;
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
    obj.type = NS_Action.Type.ACTION;
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
    obj.type = NS_Action.Type.ACTION;
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
    obj.type = NS_Action.Type.BATTLE;
    obj.execCb.cb = function( args ) {
        NS_BattleHandler.battleAttack();
        return true;
    };
    return obj;
};

/**
 * Start Battle Action class for battle action.
 * @return {Boolean} Always true
 */
_Action.prototype.battle = function( actors, turn_limit ) {
    var obj = NS_Action.createAction();
    obj.name = "battle";
    obj.type = NS_Action.Type.BATTLE;
    obj.execCb.args = [ actors, turn_limit ];
    obj.execCb.cb = function( args ) {
        return NS_BattleHandler.init( args[0], args[1] );
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
    obj.type = NS_Action.Type.BATTLE;
    obj.execCb.cb = function( args ) {
        log_cb( "you defend" );
        return true;
    };
    return obj;
};

_Action.prototype.checkEnemies = function( at_x, at_y) {
    var obj = NS_Action.createAction();
    obj.name = "check enemies";
    obj.type = NS_Action.Type.SCENE;
    obj.execCb.args = [ at_x, at_y ];
    obj.execCb.cb = function( args ) {
        NS_GEngine.log("Checking Scene at " + args[0] + ", " + args[1] );
        return true;
    };
    return obj;
};
