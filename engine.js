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
     * Attribute that stores the log method to use in the engine.
     * @type {Function}
     */
    var __log = NS_UI.log;

    /**
     * Attribute that stores the error method to use in the engine.
     * @type {Function}
     */
    var __error = NS_UI.error;

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

    this.setLog = function( log ) {
        __log = log;
        return __log;
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

    /**
     * Custom Actor creation method for the engine
     * @param  {Actor} actor Actor being created
     * @return {undefined} Nothing
     */
    this.customActor = function( actor ) {
        actor.turn = false;
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

    this.playingScene = undefined;
    this.playingSceneId = undefined;

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
    this.delElement = function (subject, element ) {
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

    var __reloadAction = function( action ) {
        return function() {
            that.addElement( "action", action ).active = true;
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
        var toDelete = [];
        for ( var i in this.actions ) {
            var action = this.actions[ i ];
            if ( action.active ) {
                __execAction( action );
                if ( action.remove ) {
                    toDelete.push( i );
                }
            }
        }
        NS_Common.deleteWith( this.actions, toDelete );
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

NS_Common.setEngine(NS_GEngine);
NS_Action.setEngine(NS_GEngine);
NS_Actor.setEngine(NS_GEngine);
NS_Evento.setEngine(NS_GEngine);
NS_Objeto.setEngine(NS_GEngine);
NS_Scene.setEngine(NS_GEngine);
NS_Battle.setEngine(NS_GEngine);
