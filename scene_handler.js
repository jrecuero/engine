function _SceneHandler() {
    /**
     * Keep a copy for the object instance.
     * @type {_BattleHandler}
     */
    var __that = this;

    var __scene;
    var __layout;

    Object.defineProperty( this, "scene", {
        get: function() {
            return __scene;
        },
        set: function( scene ) {
            __scene = scene;
            __layout = scene.getLayout();
            return __scene;
        }
    } );

    this.init = function() {
        getEngine().registerActionCallback( "player", NS_Action.Type.MOVE, __scanScenario );
    };

    var __scanForActors = function( x, y ) {
        var actors = __that.scene.getActorsAt( x, y );
        var activeActor = getEngine().activeActor;
        var battleActors = [];
        for ( var i = 0; i < actors.length; i++ ) {
            if ( ( actors[ i ] != activeActor ) &&
                 ( actors[ i ].playableSide != activeActor.playableSide ) ){
                battleActors.push( actors[ i ] );
            }
        }
        // If there are enemy actors, trigger a battle action.
        if ( battleActors.length > 0 ) {
            battleActors.push( activeActor );
            getEngine().ui.up.widget.disabled = true;
            getEngine().ui.down.widget.disabled = true;
            getEngine().ui.left.widget.disabled = true;
            getEngine().ui.right.widget.disabled = true;
            var actionBattle = NS_Action.battle( battleActors );
            NS_UI.debug( "Battle starts!" );
            getEngine().addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
            return true;
        }
        return false;
    };

    var __scanForObjetos = function( x, y ) {
        var objetos = __that.scene.getObjetosAt( x, y );
        if ( objetos.length > 0 ) {
            getEngine().ui.take.widget.disabled = false;
            return true;
        } else {
            getEngine().ui.take.widget.disabled = true;
            return false;
        }
    };

    var __scanScenario = function( args ) {
        var cell = args.cell;
        NS_UI.debug( "Scene Handler: Scan at " + cell.x + ", " + cell.y + " ..." );
        __scanForObjetos( cell.x, cell.y );
        __scanForActors( cell.x, cell.y );
    };

    var __isXCell = function( attr, x, y ) {
        var entities = __that.scene.getEntitiesAt( NS_Common.EntityType.OBJETO, x, y );
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
        for ( var i in actors ) {
            if ( actors[ i ].playableSide === NS_Common.PlaySide.ENEMY ) {
                return true;
            }
        }
        return false;
    };

    /**
     * Move class.
     * @type {Object}
     */
    this.move = {
        up: function( x, y ) {
            if ( this.canUp( x, y ) ) {
                return __layout.move.up( x, y );
            }
            return false;
        },

        down:  function( x, y ) {
            if ( this.canDown( x, y ) ) {
                return __layout.move.down( x, y );
            }
            return false;
        },

        left: function( x, y ) {
            if ( this.canLeft( x, y ) ) {
                return __layout.move.left( x, y );
            }
            return false;
        },

        right: function( x, y ) {
            if ( this.canRight( x, y) ) {
                return __layout.move.right( x, y );
            }
            return false;
        },

        equal: function( pos1, pos2 ) {
            return ( ( pos1[ 0 ] === pos2[ 0 ] ) && ( pos1[ 1 ] === pos2[ 1 ] ) );
        },

        canUp: function( x, y ) {
            return ( __layout.isInside( [ x, y - 1 ] ) && !__that.isSolidCell( x, y ) );
        },

        canDown: function( x, y ) {
            return ( __layout.isInside( [ x, y + 1 ] ) && !__that.isSolidCell( x, y ) );
        },

        canLeft: function( x, y ) {
            return ( __layout.isInside( [ x - 1, y ] ) && !__that.isSolidCell( x, y ) );
        },

        canRight: function( x, y ) {
            return ( __layout.isInside( [ x + 1, y ] ) && !__that.isSolidCell( x, y ) );
        },

        setAt: function( x, y, entity ) {
            return __layout.setAt( x, y, entity );
        },

        removeAt: function( x, y, entity ) {
            return __layout.removeAt( x, y, entity );
        }
    };

    return true;
}

var NS_SceneHandler = new _SceneHandler();
