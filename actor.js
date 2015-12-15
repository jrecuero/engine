/**
 * Actor NameSpace function.
 * @return {Boolean} Always true
 */
function _Actor() {
    /**
     * Keep a copy for the object instance.
     * @type {_Actor}
     */
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
     * Actor class for any playable or not playable actor in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Actor = function( args ) {
        GObject.apply( this, args );
        var __actor = this;
        this.attributes = undefined;
        this.playable = true;
        this.playableSide = NS_Common.PlaySide.PLAYER;
        this.objScene = undefined;

        Object.defineProperty( this, 'cell', {
            get: function() {
                if ( this.objScene !== undefined ) {
                    return this.objScene.cell;
                }
                return undefined;
            },
        });

        /**
         * Array of objetos the actor can own.
         * @type {Array}
         */
        var __objetos = [];

        var __eventos = [];

        this.move = {
            move: function( move_cb, x, y ) {
                var result = move_cb( x, y );
                if ( result ) {
                    var check = NS_Action.checkEnemies( x, y );
                    __engine.addElement( NS_GEngine.Subject.ACTION, check ).active = true;
                }
                return result;
            },
            canForward: function() {
                return __engine.playingScene.move.canForward( __actor.cell.x,
                                                              __actor.cell.y );
            },
            canBackward: function() {
                return __engine.playingScene.move.canBackward( __actor.cell.x,
                                                               __actor.cell.y );
            },
            canLeft: function() {
                return __engine.playingScene.move.canLeft( __actor.cell.x,
                                                           __actor.cell.y );
            },
            canRight: function() {
                return __engine.playingScene.move.canRight( __actor.cell.x,
                                                            __actor.cell.y );
            },
            forward: function() {
                return this.move( __engine.playingScene.move.forward,
                                  __actor.cell.x,
                                  __actor.cell.y );
            },
            backward: function() {
                return this.move( __engine.playingScene.move.backward,
                                  __actor.cell.x,
                                  __actor.cell.y );
            },
            left: function() {
                return this.move( __engine.playingScene.move.left,
                                  __actor.cell.x,
                                  __actor.cell.y );
            },
            right: function() {
                return this.move( __engine.playingScene.move.right,
                                  __actor.cell.x,
                                  __actor.cell.y );
            }
        };

        /**
         * Actor damage target.
         * @param  {Actor} target Target actor receiving the damage
         * @return {int} Damage value
         */
        this.damage = function( target ) {
            return this.attributes.damage( target );
        };

        /**
         * Returns if the actor is alive.
         * @return {Boolean} true if actor is alive, false else
         */
        this.isAlive = function() {
            return this.attributes.isAlive();
        };

        /**
         * Add new objeto to the actor.
         * @param {Objeto} obj Objeto instance to add
         * @return {Boolean} true if added properly, false else
         */
        this.addObjeto = function( obj ) {
            __objetos.push( obj );
            if ( obj.isUsable() ) {
                this.attributes.addModifier( obj.getAttributes() );
            }
            return true;
        };

        /**
         * Remove objeto from the actor.
         * @param  {Objecto} obj Objecto instance to remove
         * @return {Boolean} true if removed properly, false else
         */
        this.removeObjeto = function( obj ) {
            NS_Common.removeFromArray( __objetos, obj );
            if ( obj.isUsable() ) {
                this.attributes.removeModifier( obj.getAttributes() );
            }
            return true;
        };

        /**
         * Get all actor objeto instances.
         * @return {Array} Array with all objetos instances
         */
        this.getObjetos = function() {
            return __objetos;
        };

        return true;
    };
    inheritKlass( GObject, this.Actor );

    return true;
}

var NS_Actor = new _Actor();

/**
 * Player class
 * @param {Array} args Arguments required for the constructor
 * @return {Boolean} Always true
 */
_Actor.prototype.Player = function( args ) {
    NS_Actor.Actor.apply( this, [ args ] );

    var __that = this;

    var __uiData = { widget: undefined, onclick: undefined };


    var __createBattle = function( actors ) {
        var actionBattle = NS_Action.battle( actors );
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
    };

    var __onMove = function( new_pos ) {
        var scene = __engine.playingScene;
        var cell = scene.getCellAt( new_pos.x, new_pos.y );
        scene.replaceObjetoInScene( __that.objScene, cell );
        __engine.log( "move to " + new_pos.x + ", " + new_pos.y );
        var actors = scene.getActorsAt( new_pos.x, new_pos.y );
        if ( actors.length > 0 ) {
            var actorsNames = [];
            for ( var i = 0; i < actors.length; i++ ) {
                if ( actors[ i ] !== __that ) {
                    actorsNames.push( actors[ i ].name );
                }
            }
            if ( actorsNames.length > 0 ) {
                __engine.log("there are actor at new position: " + actorsNames.join(","));
                __that.ui.forward.widget.disabled = true;
                __that.ui.backward.widget.disabled = true;
                __that.ui.left.widget.disabled = true;
                __that.ui.right.widget.disabled = true;
                __createBattle( __engine.actors );
            }
        }
    };

    var onMoveForward = function() {
        var newPos = __engine.playingScene.move.forward( __that.cell.x,
                                                          __that.cell.y );
        __onMove( newPos );
    };

    var onMoveBackward = function() {
        var newPos = __engine.playingScene.move.backward( __that.cell.x,
                                                          __that.cell.y );
        __onMove( newPos );
    };

    var onMoveLeft = function() {
        var newPos = __engine.playingScene.move.left( __that.cell.x ,
                                                      __that.cell.y );
        __onMove( newPos );
    };

    var onMoveRight = function() {
        var newPos = __engine.playingScene.move.right( __that.cell.x,
                                                       __that.cell.y );
        __onMove( newPos );
    };

    this.ui = {
        move: Object.create( __uiData ),
        forward: { widget: undefined, onclick: onMoveForward },
        backward: { widget: undefined, onclick: onMoveBackward },
        left: { widget: undefined, onclick: onMoveLeft },
        right: { widget: undefined, onclick: onMoveRight },
        action: Object.create( __uiData ),
        use: Object.create( __uiData ),
        look: Object.create( __uiData ),
        take: Object.create( __uiData ),
        drop: Object.create( __uiData ),
        panels: {},
    };

    this.setPanelTo = function( panel_name, enabled ) {
        this.ui.panels[ panel_name ].enable = enabled;
        for ( var i in this.ui.panels[ panel_name ].widgets ) {
            this.ui.panels[ panel_name ].widgets[ i ].widget.disabled = !enabled;
        }
    };

    this.ui.enablePanels = function( panels ) {
        panels = panels === undefined ? [ "move", "battle", "action"] : panels;
        for ( var i in panels ) {
            this.setPanelTo( panels[ i ], true );
        }
    };

    this.ui.disablePanels = function( panels ) {
        panels = panels === undefined ? [ "move", "battle", "action"] : panels;
        for ( var i in panels ) {
            this.setPanelTo( panels[ i ], false );
        }
    };

    this.createWidgets = function() {
        this.ui.forward.widget = NS_UI.button( "forward", this.ui.forward.onclick, "move" );
        this.ui.backward.widget = NS_UI.button( "backward", this.ui.backward.onclick, "move" );
        this.ui.left.widget = NS_UI.button( "left", this.ui.left.onclick, "move" );
        this.ui.right.widget = NS_UI.button( "right", this.ui.right.onclick, "move" );
        this.ui.panels.move = { enable: true,
                                widgets: [ __that.ui.forward ,
                                           __that.ui.backward,
                                           __that.ui.left,
                                           __that.ui.right ] };

        this.ui.action.widget = NS_UI.button( "action", this.ui.action.onclick, "battle" );
        this.ui.panels.battle = { enable: true,
                                  widgets: [ __that.ui.action ] };

        this.ui.panels.action = true;
        this.ui.use.widget = NS_UI.button( "use", this.ui.use.onclick, "action" );
        this.ui.look.widget = NS_UI.button( "look", this.ui.look.onclick, "action" );
        this.ui.take.widget = NS_UI.button( "take", this.ui.take.onclick, "action" );
        this.ui.drop.widget = NS_UI.button( "drop", this.ui.drop.onclick, "action" );
        this.ui.panels.action = { enable: true,
                                  widgets: [ __that.ui.use ,
                                             __that.ui.look,
                                             __that.ui.take,
                                             __that.ui.drop ] };

    };
};
inheritKlass( NS_Actor.Actor, _Actor.prototype.Player );
