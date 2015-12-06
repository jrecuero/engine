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
    var that = this;

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
     * Engine state attribute.
     * @type {String}
     */
    this.state = {
        IN_BATTLE: "in battle",
        IN_BATTLE_WAITING_INPUT: "battle waiting input",
        IN_BATTLE_RUN_INPUT: "battle run imput",
        IN_BATTLE_WAITING_AI: "battle waiting ai",
        IN_BATTLE_RUN_AI: "battle run ai",
        IN_BATTLE_END: "battle end",
        WAITING: "waiting",
        NONE: "none",
        value: undefined,
        set: function( val ) {
            this.value = val;
        },
        get: function() {
            return this.value;
        },
        reset: function() {
            this.set( this.NONE );
        },
        next: function() {
            switch ( this.value ) {
                case this.IN_BATTLE:
                    this.set( this.IN_BATTLE_WAITING_INPUT );
                    break;
                case this.IN_BATTLE_WAITING_INPUT:
                    this.set( this.IN_BATTLE_RUN_INPUT );
                    break;
                case this.IN_BATTLE_RUN_INPUT:
                    this.set( this.IN_BATTLE_WAITING_AI );
                    break;
                case this.IN_BATTLE_WAITING_AI:
                    this.set( this.IN_BATTLE_RUN_AI );
                    break;
                case this.IN_BATTLE_RUN_AI:
                    this.set( this.IN_BATTLE_END );
                    break;
                case this.IN_BATTLE_END:
                    this.set( this.NONE );
                    break;
                default:
                    break;
            }
            return this.get();
        }
    };

    /**
     * Battle attributes defining who is the battle originator and who are the
     * targets.
     * @type {Object}
     */
    this.battle = {
        active: false,
        turn: undefined,
        originator: undefined,
        target: undefined,
        actors: undefined,
        userif: {},
        /**
         * Returns Array with actors for the given playable side.
         * @param  {String} playableSide Playable side to select actors
         * @return {Array} Array with actor from given playable side
         */
        getActors: function( playableSide ) {
            var result = [];
            for ( var i in this.actors ) {
                var actor = this.actors[ i ];
                if ( actor.playableSide == playableSide ) {
                    result.push( actor );
                }
            }
            return result;
        },
        /**
         * Returns Array with enemy actors.
         * @return {Array} Array with enemy actors
         */
        enemyActors: function() {
            return this.getActors( ENEMY );
        },
        /**
         * Returns Array with player actors.
         * @return {Array} Array with player actors
         */
        playerActors: function() {
            return this.getActors( PLAYER );
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

    /**
     * Select the next target for the turn.
     * @type {Function}
     */
    this.customSelectNextTarget = undefined;

    /**
     * Selecte the next AI action for the turn
     * @type {Function}
     */
    this.customSelectNextAiAction = undefined;

    /**
     * Custom actions to do after battle has ended.
     * @type {Function}
     */
    this.customAfterBattle = undefined;

    /**
     * Custom action that display all available targets.
     * @type {Function}
     */
    this.customAvailableTarget = undefined;

    /**
     * Standard battle attack.
     * @return {undefined} Nothing
     */
    this.battleAttack = function() {
        this.battle.originator.damage( this.battle.target );
    };

    /**
     * Set the next originator from the battle actors.
     * @return {undefined} Nothing
     */
    this.nextOriginator = function() {
        actor = this.battle.actors.shift();
        actor.turn = true;
        this.battle.originator = actor;
        this.battle.turn = this.battle.originator.playableSide;
    };

    /**
     * Set the next target for the the turn.
     * @return {undefined} Nothing
     */
    this.nextTarget = function() {
        var target = this.customSelectNextTarget();
        this.battle.target = target;
    };

    /**
     * Set engine state based on the battle turn (next originator actor side).
     * @return {undefined} Nothing
     */
    this.setStateByBattleTurnPlayableSide = function() {
        if ( this.battle.turn === PLAYER ) {
            this.state.set( this.state.IN_BATTLE_WAITING_INPUT );
        } else {
            this.state.set( this.state.IN_BATTLE_WAITING_AI );
        }
    };

    /**
     * Initialize the battle engine.
     * @return {undefined} Nothing
     */
    this.initBattle = function() {
        this.battle.actors = [];
        if ( this.actors.length <= 1) {
            NS_UI.error( "Not enough actors for battle: " + this.actors.length );
            return false;
        }
        for ( var i in this.actors ) {
            this.battle.actors.push( this.actors[ i ] );
        }
        this.battle.active = true;
        this.nextOriginator();
        this.customAvailableTarget();
        this.setStateByBattleTurnPlayableSide();
        return true;
    };

    /**
     * Set the next originator for the turn.
     * @return {undefined} Nothing
     */
    this.nextActor = function() {
        this.battle.originator.turn = false;
        this.battle.actors.push( this.battle.originator );
        this.nextOriginator();
        this.setStateByBattleTurnPlayableSide();
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

    /**
     * Console log information with battle action results.
     * @return {undefined} Nothing
     */
    this.logBattleRunResultTurn = function() {
        var originator = this.battle.originator;
        var target = this.battle.target;
        NS_UI.log( originator.name + " attack " + target.name +
                  "[" + target.attributes.life + "]" );
    };

    /**
     * Run turn results.
     * @return {undefined} Nothing
     */
    this.execBattleRunResultTurn = function() {

        // Find all actors that are not alive and delete then form the table
        // of active battlers.
        var toDelete = this.battle.actors.filter( function( x ) {
            return !x.isAlive();
        } );
        NS_Common.deleteWith( this.battle.actors, toDelete );

        if ( this.battle.actors.length > 0 ) {
            this.nextActor();
            this.customAvailableTarget();
        } else {
            var actor = this.battle.originator;
            NS_UI.log( actor.name + " won the battle" );
            this.state.set( this.state.IN_BATTLE_END );
        }
    };

    /**
     * Run battle turn.
     * @return {undefined} Nothing
     */
    this.execBattleRunTurn = function() {
        this.nextTarget();
        this.runActionsTurn();
        this.logBattleRunResultTurn();
        this.execBattleRunResultTurn();
    };

    /**
     * Run battle engine machine.
     * @return {undefined} Nothing
     */
    this.runBattle = function() {
        switch ( this.state.get() ) {
            case this.state.IN_BATTLE:
                break;
            case this.state.IN_BATTLE_WAITING_INPUT:
                break;
            case this.state.IN_BATTLE_RUN_INPUT:
                this.execBattleRunTurn();
                break;
            case this.state.IN_BATTLE_WAITING_AI:
                this.customSelectNextAiAction();
                this.state.next();
                break;
            case this.state.IN_BATTLE_RUN_AI:
                this.execBattleRunTurn();
                break;
            case this.state.IN_BATTLE_END:
                this.customAfterBattle();
                this.battle.active = false;
                break;
            default:
                break;
        }
    };

    /**
     * Run engine every tick
     * @return {undefined} Nothing
     */
    this.runTick = function() {
        if ( this.battle.active ) {
            this.runBattle();
        } else {
            this.runActionsTurn();
        }
    };

    /**
     * Initialize Game Engine
     * @return {Boolean} true if engine was initialized properly, false else
     */
    this.init = function() {
        this.state.reset();
        return true;
    };

    this.start = function() {
        setInterval( function() { that.runTick(); }, 100 );
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

// Set the interval the engine will run again.
// setInterval( function() { NS_GEngine.runTick(); }, 100 );
