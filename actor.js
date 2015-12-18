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

        Object.defineProperty( this, "cell", {
            get: function() {
                if ( this.objScene !== undefined ) {
                    return this.objScene.cell;
                }
                return undefined;
            }
        } );

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
                    getEngine().addElement( NS_GEngine.Subject.ACTION, check ).active = true;
                }
                return result;
            },
            canUp: function() {
                return getEngine().playingScene.move.canUp( __actor.cell.x,
                                                            __actor.cell.y );
            },
            canDown: function() {
                return getEngine().playingScene.move.canDown( __actor.cell.x,
                                                              __actor.cell.y );
            },
            canLeft: function() {
                return getEngine().playingScene.move.canLeft( __actor.cell.x,
                                                              __actor.cell.y );
            },
            canRight: function() {
                return getEngine().playingScene.move.canRight( __actor.cell.x,
                                                               __actor.cell.y );
            },
            up: function() {
                return this.move( getEngine().playingScene.move.up,
                                  __actor.cell.x,
                                  __actor.cell.y );
            },
            down: function() {
                return this.move( getEngine().playingScene.move.down,
                                  __actor.cell.x,
                                  __actor.cell.y );
            },
            left: function() {
                return this.move( getEngine().playingScene.move.left,
                                  __actor.cell.x,
                                  __actor.cell.y );
            },
            right: function() {
                return this.move( getEngine().playingScene.move.right,
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
 * Enemy class.
 * @param {Array} args Arguments required for the constructor
 * @return {Boolean} Always true
 */
_Actor.prototype.Enemy = function( args ) {
    NS_Actor.Actor.apply( this, [ args ] );

    this.playableSide = NS_Common.PlaySide.ENEMY;
    this[ NS_Common.Flag.ENEMY ] = true;
    this[ NS_Common.Flag.TRIGGER ] = true;

    return true;
};
inheritKlass( NS_Actor.Actor, _Actor.prototype.Enemy );

/**
 * Player class.
 * @param {Array} args Arguments required for the constructor
 * @return {Boolean} Always true
 */
_Actor.prototype.Player = function( args ) {
    NS_Actor.Actor.apply( this, [ args ] );

    var __that = this;

    var __uiData = { widget: undefined,
                     onclick: undefined,
                     flag: undefined };

    var __createBattle = function( actors ) {
        var actionBattle = NS_Action.battle( actors );
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
    };

    var __onMove = function( new_pos ) {
        var scene = getEngine().playingScene;
        var cell = scene.getCellAt( new_pos.x, new_pos.y );
        scene.replaceObjetoInScene( __that.objScene, cell );
        getEngine().debug( "move to " + new_pos.x + ", " + new_pos.y );
        var actionMove = new NS_Action.move( "player" );
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionMove ).active = true;

        // Var actors = scene.getActorsAt( new_pos.x, new_pos.y );
        // if ( actors.length > 0 ) {
        //     var actorsNames = [];
        //     for ( var i = 0; i < actors.length; i++ ) {
        //         if ( actors[ i ] !== __that ) {
        //             actorsNames.push( actors[ i ].name );
        //         }
        //     }
        //     if ( actorsNames.length > 0 ) {
        //         getEngine().log( "there are actor at new position: " + actorsNames.join( "," ) );
        //         __that.ui.up.widget.disabled = true;
        //         __that.ui.down.widget.disabled = true;
        //         __that.ui.left.widget.disabled = true;
        //         __that.ui.right.widget.disabled = true;
        //         __createBattle( getEngine().actors );
        //     }
        // }
    };

    var onMoveUp = function() {
        var newPos = getEngine().playingScene.move.up( __that.cell.x,
                                                       __that.cell.y );
        __onMove( newPos );
    };

    var onMoveDown = function() {
        var newPos = getEngine().playingScene.move.down( __that.cell.x,
                                                         __that.cell.y );
        __onMove( newPos );
    };

    var onMoveLeft = function() {
        var newPos = getEngine().playingScene.move.left( __that.cell.x,
                                                         __that.cell.y );
        __onMove( newPos );
    };

    var onMoveRight = function() {
        var newPos = getEngine().playingScene.move.right( __that.cell.x,
                                                          __that.cell.y );
        __onMove( newPos );
    };

    this.ui = {
        move: Object.create( __uiData ),
        up: { widget: undefined,
              onclick: onMoveUp,
              flag: NS_Common.Flag.MOVE },
        down: { widget: undefined,
                onclick: onMoveDown,
                flag: NS_Common.Flag.MOVE },
        left: { widget: undefined,
                onclick: onMoveLeft,
                flag: NS_Common.Flag.MOVE },
        right: { widget: undefined,
                 onclick: onMoveRight,
                 flag: NS_Common.Flag.MOVE },
        action: { widget: undefined,
                  onclick: undefined,
                  flag: NS_Common.Flag.ACTION },
        use: { widget: undefined,
               onclick: undefined,
               flag: NS_Common.Flag.USE },
        look: { widget: undefined,
                onclick: undefined,
                flag: NS_Common.Flag.LOOK },
        take: { widget: undefined,
                onclick: undefined,
                flag: NS_Common.Flag.TAKE },
        drop: { widget: undefined,
                onclick: undefined,
                flag: NS_Common.Flag.DROP },
        panels: {}
    };

    this.setWidgetForFlagTo = function( flag, value ) {
        for ( var prop in this.ui ) {
            if ( ( this.ui[ prop ].hasOwnProperty( "flag" ) ) &&
                 ( this.ui[ prop ][ flag ] === flag ) ) {
                this.ui[ prop ].widget.disabled = !value;
            }
        }
    };

    this.setPanelTo = function( panel_name, enabled ) {
        this.ui.panels[ panel_name ].enable = enabled;
        for ( var i in this.ui.panels[ panel_name ].widgets ) {
            this.ui.panels[ panel_name ].widgets[ i ].widget.disabled = !enabled;
        }
    };

    this.ui.enablePanels = function( panels ) {
        panels = panels === undefined ? [ "move", "battle", "action" ] : panels;
        for ( var i in panels ) {
            this.setPanelTo( panels[ i ], true );
        }
    };

    this.ui.disablePanels = function( panels ) {
        panels = panels === undefined ? [ "move", "battle", "action" ] : panels;
        for ( var i in panels ) {
            this.setPanelTo( panels[ i ], false );
        }
    };

    this.createWidgets = function() {
        this.ui.up.widget = NS_UI.button( "up", this.ui.up.onclick, "move" );
        this.ui.down.widget = NS_UI.button( "down", this.ui.down.onclick, "move" );
        this.ui.left.widget = NS_UI.button( "left", this.ui.left.onclick, "move" );
        this.ui.right.widget = NS_UI.button( "right", this.ui.right.onclick, "move" );
        this.ui.panels.move = { enable: true,
                                widgets: [ __that.ui.up,
                                           __that.ui.down,
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
                                  widgets: [ __that.ui.use,
                                             __that.ui.look,
                                             __that.ui.take,
                                             __that.ui.drop ] };

    };
};
inheritKlass( NS_Actor.Actor, _Actor.prototype.Player );
