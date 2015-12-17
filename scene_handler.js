function _SceneHandler() {
    /**
     * Keep a copy for the object instance.
     * @type {_BattleHandler}
     */
    var __that = this;

    var __scene;

    Object.defineProperty( this, "scene", {
        get: function() {
            return __scene;
        },
        set: function( val ) {
            __scene = val;
            return __scene;
        },
    } );

    this.init = function() {
        getEngine().registerActionCallback( "player", NS_Action.Type.MOVE, __scanScenario );
    };

    var __scanScenario = function() {
        NS_UI.debug("Scene Handler: Scan Scenaraio..." );
    };

    var __isXCell = function( attr, x, y ) {
        var entities = this.scene.getEntitiesAt( NS_Common.EntityType.OBJETO, x, y );
        for ( var i in entities ) {
            if ( entities[ i ][ attr ] ) {
                return true;
            }
        }
        return false;
    };

    this.isSolidCell = function( x, y ) {
        return __isXCell( NS_Common.Flag.SOLID, x, y );
    };

    this.isUseCell = function( x, y ) {
        return __isXCell( NS_Common.Flag.USE, x, y );
    };

    this.isTakeCell = function( x, y ) {
        return __isXCell( NS_Common.Flag.TAKE, x, y );
    };

    this.isDropCell = function( x, y ) {
        return __isXCell( NS_Common.Flag.DROP, x, y );
    };

    this.isTriggerCell = function( x, y ) {
        return __isXCell( NS_Common.Flag.TRIGGER, x, y );
    };

    this.isEnemyCell = function( x, y ) {
        var actors = this.getEntitiesAt( NS_Common.EntityType.ACTOR, x, y );
        for (var i in actors ) {
            if ( actors[ i ].playableSide === NS_Common.PlaySide.ENEMY ) {
                return true;
            }
        }
        return false;
    };

    return true;
}

var NS_SceneHandler = new _SceneHandler();