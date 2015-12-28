/**
 * Game Engine provides all the functionality required for running the Game.
 *
 * Engine keeps all game object to be used and it provides all functionality
 * for running and displaying those.
 *
 */
function _Engine() {
    /**
     * Keep a copy for the object instance.
     * @type {_Engine}
     */
    var __that = this;

    /**
     * Keeps the interval ID returned by setInterval.
     */
    var __tickId;

    /**
     * Generate the next available engine ID.
     * @return {int} Next available engine ID
     */
    var getNextEngId = function() {
        _Engine.ID++;
        return _Engine.ID;
    };

    /**
     * Look for an ID in the given table.
     * @param  {int} id Engine ID to look for
     * @param  {Array} table Element table where ID should be looked for
     * @return {Boolean} true if engine ID was found, false else
     */
    var lookForIn = function( id, table ) {
        if ( id && ( id !== 0 ) ) {
            for ( var i in table ) {
                if ( table[ i ].engId == id ) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    };

    /**
     * Get an element from a given table based on the engine id.
     * @param  {int} id Engine ID to look for
     * @param  {Array} table Element table where ID should be looked for
     * @return {GObject} Element found in the table, null else
     */
    var getFromTable = function( id, table ) {
        if ( id && ( id !== 0 ) ) {
            for ( var i in table ) {
                if ( table[ i ].engId == id ) {
                    return table[ i ];
                }
            }
            return null;
        } else {
            return null;
        }
    };

    /**
     * Remote an element form a given table based on the engine id.
     * @param  {int} id Engine ID to look for
     * @param  {Array} table Element table where ID should be looked for
     * @return {GObject} Element removed from the table, null, else
     */
    var removeFromTable = function( id, table ) {
        var toDelete;
        if ( id && ( id !== 0 ) ) {
            for ( var i in table ) {
                if ( table[ i ].engId == id ) {
                    toDelete = i;
                    break;
                }
            }
            if ( toDelete ) {
                var element = table[ i ];
                table.splice( toDelete, 1 );
                return element;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    /**
     * Attribute that stores the log method to use in the engine.
     * @type {Function}
     */
    this.log = NS_UI.log;

    /**
     * Attribute that stores the error method to use in the engine.
     * @type {Function}
     */
    this.error = NS_UI.error;

    this.debug = NS_UI.debug;

    /**
     * Table with all game actors.
     * @type {Array}
     */
    this.actors = [];

    /**
     * Table with all game scenes.
     * @type {Array}
     */
    this.scenes = [];

    /**
     * Table with all game objetos (objects).
     * @type {Array}
     */
    this.objetos = [];

    /**
     * Table with all game eventos (events).
     * @type {Array}
     */
    this.eventos = [];

    /**
     * Table with all game actions.
     * @type {Array}
     */
    this.actions = [];

    this.actionCallbacks = [];

    this.sceneHandler = undefined;

    this.battleHandler = undefined;

    /**
     * Custom Actor creation method for the engine
     * @param  {Actor} actor Actor being created
     * @return {undefined} Nothing
     */
    this.customActor = function( actor ) {
        actor.turn = false;
    };

    this.Subject = {
        ACTOR: "actor",
        SCENE: "scene",
        OBJETO: "objeto",
        EVENTO: "evento",
        ACTION: "action"
    };

    /**
     * Element table is an object that contains all possible game elements used
     * in the game, stored in different tables.
     * @type {Object}
     */
    this.elementTable = {
        actor: { table: this.actors,
                 klass: NS_Actor.Actor,
                 custom: this.customActor },
        scene: { table: this.scenes,
                 klass: NS_Scene.Scene,
                 custom: undefined },
        objeto: { table: this.objetos,
                  klass: NS_Objeto.Objeto,
                  custom: undefined },
        evento: { table: this.eventos,
                  klass: NS_Evento.Evento,
                  custom: undefined },
        action: { table: this.actions,
                  klass: NS_Action.Action,
                  custom: undefined }
    };

    this.activeActor =  undefined;
    this.playingScene = undefined;
    this.playingSceneId = undefined;

    this.ui = {
        up: { widget: undefined, onclick: undefined, flag: undefined },
        down: { widget: undefined, onclick: undefined, flag: undefined },
        left: { widget: undefined, onclick: undefined, flag: undefined },
        right: { widget: undefined, onclick: undefined, flag: undefined },
        action: { widget: undefined, onclick: undefined, flag: undefined },
        use: { widget: undefined, onclick: undefined, flag: undefined },
        look: { widget: undefined, onclick: undefined, flag: undefined },
        take: { widget: undefined, onclick: undefined, flag: undefined },
        drop: { widget: undefined, onclick: undefined, flag: undefined },
        panels: {}
    };

    var __onMove = function( new_pos ) {
        var scene = __that.playingScene;
        var cell = scene.getCellAt( new_pos.x, new_pos.y );
        var actor = __that.activeActor;
        scene.replaceObjetoInScene( actor.objScene, cell );
        __that.debug( "move to " + new_pos.x + ", " + new_pos.y );
        var actionMove = new NS_Action.move( cell, "player" );
        __that.addElement( __that.Subject.ACTION, actionMove ).active = true;
    };

    var onMoveUp = function() {
        var actor = __that.activeActor;
        var newPos = __that.sceneHandler.move.up( actor.cell.x,
                                                  actor.cell.y );
        __onMove( newPos );
    };

    var onMoveDown = function() {
        var actor = __that.activeActor;
        var newPos = __that.sceneHandler.move.down( actor.cell.x,
                                                    actor.cell.y );
        __onMove( newPos );
    };

    var onMoveLeft = function() {
        var actor = __that.activeActor;
        var newPos = __that.sceneHandler.move.left( actor.cell.x,
                                                    actor.cell.y );
        __onMove( newPos );
    };

    var onMoveRight = function() {
        var actor = __that.activeActor;
        var newPos = __that.sceneHandler.move.right( actor.cell.x,
                                                     actor.cell.y );
        __onMove( newPos );
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
        this.ui.up.onclick = onMoveUp;
        this.ui.up.widget = NS_UI.button( "up", this.ui.up.onclick, "move" );
        this.ui.up.flag = NS_Common.Flag.MOVE;

        this.ui.down.onclick = onMoveDown;
        this.ui.down.widget = NS_UI.button( "down", this.ui.down.onclick, "move" );
        this.ui.down.flag = NS_Common.Flag.MOVE;

        this.ui.left.onclick = onMoveLeft;
        this.ui.left.widget = NS_UI.button( "left", this.ui.left.onclick, "move" );
        this.ui.left.flag = NS_Common.Flag.MOVE;

        this.ui.right.onclick = onMoveRight;
        this.ui.right.widget = NS_UI.button( "right", this.ui.right.onclick, "move" );
        this.ui.right.flag = NS_Common.Flag.MOVE;

        this.ui.panels.move = { enable: true,
                                widgets: [ this.ui.up,
                                           this.ui.down,
                                           this.ui.left,
                                           this.ui.right ] };

        this.ui.action.widget = NS_UI.button( "action", this.ui.action.onclick, "battle" );
        this.ui.action.flag = NS_Common.Flag.ACTION;
        this.ui.panels.battle = { enable: true,
                                  widgets: [ this.ui.action ] };

        this.ui.use.widget = NS_UI.button( "use", this.ui.use.onclick, "action" );
        this.ui.use.flag = NS_Common.Flag.USE;

        this.ui.look.widget = NS_UI.button( "look", this.ui.look.onclick, "action" );
        this.ui.look.flag = NS_Common.Flag.LOOK;

        this.ui.take.widget = NS_UI.button( "take", this.ui.take.onclick, "action" );
        this.ui.take.flag = NS_Common.Flag.TAKE;

        this.ui.drop.widget = NS_UI.button( "drop", this.ui.drop.onclick, "action" );
        this.ui.drop.onclick = undefined;
        this.ui.drop.flag = NS_Common.Flag.DROP;

        this.ui.panels.action = { enable: true,
                                  widgets: [ this.ui.use,
                                             this.ui.look,
                                             this.ui.take,
                                             this.ui.drop ] };

    };

    /**
     * Check if the given element is found in an element table.
     * @param  {String} subject Element table string identifier
     * @param  {GObject} element Element to check if is already in table
     * @return {Boolean} true if element is found, false else
     */
    this.isElement = function( subject, element ) {
        if ( subject in this.elementTable ) {
            elemTable = this.elementTable[ subject ];
            return lookForIn( element.engId, elemTable.table );
        } else {
            return null;
        }
    };

    /**
     * Create a new game element and add it the the proper element table.
     * @param  {String} subject Element table string identifier
     * @param  {Array} args Argumets to pass to the element constructor
     * @return {GObject} Element instance created
     */
    this.newElement = function( subject, args ) {
        elemTable = this.elementTable[ subject ];
        var newElem = new elemTable.klass( args );
        newElem.engId = getNextEngId();
        elemTable.table.push( newElem );
        return newElem;
    };

    /**
     * Add an already created element to the proper element table.
     * @param {String} subject Element table string identifier
     * @param {GObject} element Element instance to be added
     * @return {GObject} Element instance being added
     */
    this.addElement = function( subject, element ) {
        var elemTable = this.elementTable[ subject ];
        if ( this.isElement( element.engId, elemTable.table ) ) {
            return null;
        } else {
            if ( element.engId === undefined ) {
                element.engId = getNextEngId();
            }
            if ( elemTable.custom ) {
                elemTable.custom.call( this, element );
            }
            elemTable.table.push( element );
            return element;
        }
    };

    /**
     * Delete an element from teh given element table.
     * @param  {String} subject Element table string identifier
     * @param  {GObject} element Element instance to be found in the table
     * @return {GObject} Element instance being removed, null else
     */
    this.delElement = function( subject, element ) {
        var elemTable = this.elementTable[ subject ];
        var result = removeFromTable( element.engId, elemTable.table );
        return result;
    };

    /**
     * Add an array of already created elements to the proper element table.
     * @param {String} subject  Element table string identifier
     * @param {Array} elements Array with elements to be added
     * @return {Array} Array of element instances being added
     */
    this.addElements = function( subject, elements ) {
        var result = [];
        for ( var i in elements ) {
            result.push( this.addElement( subject, elements[ i ] ) );
        }
        return result;
    };

    /**
     * Delete an array of already added elements to the proper element table.
     * @param  {String} subject  Element table string identifier
     * @param  {Array} elements Array with elements to be removed
     * @return {Array} Array of element instaces removed
     */
    this.delElements = function( subject, elements ) {
        var result = [];
        for ( var i in elements ) {
            result.push( this.delElement( subject, elements[ i ] ) );
        }
        return result;
    };

    this.registerActionCallback = function( owner, type, cb, cb_args ) {
        var actionCbEntry = {
            id: NS_Common.nextId(),
            type: type,
            owner: owner,
            execCb: { cb: cb, args: cb_args }
        };
        this.actionCallbacks.push( actionCbEntry );
        return actionCbEntry.id;
    };

    this.unregisterActionCallback = function( id ) {
        var index;
        for ( var i in this.actionCallbacks ) {
            if ( this.actionCallbacks[ i ].id === id ) {
                index = i;
                break;
            }
        }
        if ( index !== undefined ) {
            this.actionCallbacks.splice( index, 1 );
            return true;
        } else {
            return false;
        }
    };

    var __callActionCallbacks = function( action ) {
        for ( var i in __that.actionCallbacks ) {
            var entry = __that.actionCallbacks[ i ];
            if ( ( ( entry.owner === action.owner ) &&
                   ( entry.type === action.type ) ) ||
                 ( ( entry.owner === undefined ) &&
                   ( entry.type === action.type ) ) ) {
                entry.execCb.cb( action, entry.execCb.args );
            }
        }
    };

    var __reloadAction = function( action ) {
        return function() {
            __that.addElement( NS_GEngine.Subject.ACTION, action ).active = true;
        };
    };

    /**
     * Execute the given action and required pass or error callbacks.
     * @param  {Action} action Action instance
     * @return {Boolean} action result
     */
    var __execAction = function( action ) {
        var result = action.runExec();
        if ( result ) {
            action.runPass( result );
        } else {
            action.runError( result );
        }
        action.active = false;
        if ( action.periodic !== 0 ) {
            setTimeout( __reloadAction( action ), action.periodic );
        }
        return result;
    };

    /**
     * Run actions when engine runs.
     * @return {undefined} Nothing
     */
    this.runActions = function() {
        var toDelete;
        do {
            toDelete = [];
            var actions = this.actions.slice();
            for ( var i in actions ) {
                var action = actions[ i ];
                if ( action.active ) {
                    __execAction( action );
                    __callActionCallbacks( action );
                    if ( action.remove ) {
                        toDelete.push( i );
                    }
                }
            }
            NS_Common.deleteWith( this.actions, toDelete );
        } while ( toDelete.length > 0 );
    };

    /**
     * Run engine machine turn.
     * @return {undefined} Nothing
     */
    this.runActionsTurn = function() {
        if ( this.actions ) {
            this.runActions();
        }
    };

    this.setScene = function( scene_nbr ) {
        scene_nbr = scene_nbr ? scene_nbr : 0;
        this.playingSceneId = scene_nbr;
        sceneTable = this.elementTable.scene.table;
        sceneLen = sceneTable.length;
        if ( ( sceneLen === 0 ) || ( sceneLen <= scene_nbr ) ) {
            return null;
        } else {
            this.playingScene = sceneTable[ this.playingSceneId ];
        }
        return this.playingScene;
    };

    /**
     * Run engine every tick
     * @return {undefined} Nothing
     */
    this.runTick = function() {
        if ( this.setScene( this.playingSceneId ) === null ) {
            clearInterval( __tickId );
            return;
        }
        if ( NS_Battle.battle.active ) {
            NS_Battle.runBattle();
        } else {
            this.runActionsTurn();
        }
    };

    /**
     * Initialize Game Engine
     * @return {Boolean} true if engine was initialized properly, false else
     */
    this.init = function() {
        NS_Battle.state.reset();
        return true;
    };

    this.start = function() {
        __tickId = setInterval( function() { __that.runTick(); }, 100 );
    };
}

// ----------------------------------------------------------------------------
// GAME ENGINE CONFIGURATION
// ----------------------------------------------------------------------------

_Engine.ID = 0;
var NS_GEngine = new _Engine();
NS_GEngine.init();

function getEngine() {
    return NS_GEngine;
}
