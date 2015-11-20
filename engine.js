var PLAYER = "player";
var ENEMY = "enemy";
var NPC = "non playable character";

/**
 * GObject represents any game object in the system.
 */
function GObject() {
    this.name = arguments[ 0 ] ? arguments[ 0 ] : "object";
    this.getNextObjId = function() {
        GObject.ID++;
        return GObject.ID;
    };
    this.objId = this.getNextObjId();
}
GObject.ID = 0;

/**
 * InheritKlass provides inherited functionality.
 *
 * @param  {Class} parent Parent class
 * @param  {Class} child  Derived class
 * @return {undefined} Nothing
 */
function inheritKlass( parent, child ) {
    child.prototype = new parent();
    child.prototype.constructor = child;
}

/**
 * Common NameSpace functions.
 * @return {undefined} Nothing
 */
function _Common() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    this.engine = undefined;

    /**
     * Create actor attributes to be used.
     * @return {Object} Actor attributes
     */
    this.createAttributes = function() {
        var _ = {
            life: arguments[ 0 ],
            attack: arguments[ 1 ],
            defense: arguments[ 2 ],
            damage: function( orig, tgt ) {
                var damage = orig.attributes.attack - tgt.attributes.defense;
                tgt.attributes.life -= damage;
            },
            isAlive: function() {
                return ( this.life > 0 );
            }
        };
        return _;
    };

    /**
     * Delete table based on the second given table.
     * @param  {Array} table    Original table to delete entries
     * @param  {Array} todelete Table with entries to delete
     * @return {undefined} Nothing
     */
    this.deleteWith = function( table, todelete ) {
        if ( todelete.length > 0 ) {
            for ( var i = ( todelete.length - 1 ); i >= 0; i-- ) {
                table.splice( todelete[ i ], 1 );
            }
        }
    };
}

/**
 * User Interface
 * @return {undefined} Nothing
 */
function _UserItf() {
    /**
     * User interface log string.
     * @param  {String} str String to send to log
     * @return {undefined} Nothing
     */
    this.log = function( str ) {
        console.log( str );
    };

    /**
     * User interface debug string.
     * @param  {String} str String to send to debug
     * @return {undefined} Nothing
     */
    this.debug = function( str ) {
        console.log( str );
    };

    /**
     * User interface prompt string
     * @param  {String} str String to prompt
     * @return {string} String entered in the prompt dialog
     */
    this.prompt = function( str ) {
        return prompt( str );
    };
}

/**
 * Action NameSpace function
 * @return {undefined} Nothing
 */
function _Action() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    this.engine = undefined;

    /**
     * Action class for any action used in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Action = function( args ) {
        GObject.apply( this, args );
        this.actionType = args && args[ 1 ] ? args[ 1 ] : undefined;
        this.execute = args && args[ 2 ] ? args[ 2 ] : undefined;
        this.active = args && args[ 3 ] ? args[ 3 ] : false;
        this.remove = args && args[ 4 ] ? args[ 4 ] : true;
        this.callback = args && args[ 5 ] ? args[ 5 ] : undefined;
        this.cbArgs = args && args[ 6 ] ? args[ 6 ] : [];
    };
    inheritKlass( GObject, this.Action );

    /**
     * Move Action class for movement action.
     * @param {Integer} steps Number of steps to move
     * @return {undefined} Nothing
     */
    this.move = function( steps ) {
        this.steps = steps ? steps : 1;
        var args = [];
        args.push( "move" );        // Action name
        args.push( "move" );        // Action type
        args.push( function() {     // Action execute
            NS_UI.log( "you moved " + this.steps );
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.move );

    /**
     * Use Action class for action.
     * @param {String} Object to use
     * @return {undefined} Nothing
     */
    this.use = function( obj ) {
        this.obj = obj ? obj : "";
        var args = [];
        args.push( "use" );     // Action name
        args.push( "use" );     // Action type
        args.push( function() {

        // Action execute
            NS_UI.log( "you used " + this.obj );
        } );
        args.push( false );     // Action active
        args.push( true );      // Action remove after exec
        if ( arguments && arguments[ 1 ] ) {

            // Action callback user defined
            args.push( arguments[ 1 ] );
        } else {

            // Action callback default
            args.push( function( args ) {
                NS_UI.log( "used callback with " + args[ 0 ] );
            } );
        }

        // Action callback argumnets
        args.push( Array.prototype.slice.call( arguments ).slice( 2 ) );
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.use );

    /**
     * Take Action class for action.
     * @param {String} Object to take
     * @return {undefined} Nothing
     */
    this.take = function( obj ) {
        this.obj = obj ? obj : "";
        var args = [];
        args.push( "take" );        // Action name
        args.push( "take" );        // Action type
        args.push( function() {    // Action execute
            NS_UI.log( "you took " + this.obj );
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.take );

    /**
     * Drop Action class for action.
     * @param {String} Object to drop
     * @return {undefined} Nothing
     */
    this.drop = function( obj ) {
        this.obj = obj ? obj : "";
        var args = [];
        args.push( "drop" );        // Action name
        args.push( "drop" );        // Action type
        args.push( function() {    // Action execute
            NS_UI.log( "you dropped " + this.obj );
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.drop );

    /**
     * Attack Action class for attack action.
     * TODO: This method has to give up a lot of functionality to be moved to
     *  the engine.
     * @return {undefined} Nothing
     */
    this.attack = function() {
        var args = [];
        args.push( "attack" );      // Action name
        args.push( "battle" );      // Actioon type
        args.push( function() {     // Action execute
            NS_GEngine.battleAttack();
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.attack );

    /**
     * Start Battle Action class for battle action.
     * @return {undefined} Nothing
     */
    this.battle = function() {
        var args = [];
        args.push( "battle" );      // Action name
        args.push( "battle" );      // Actioon type
        args.push( function() {     // Action execute
            NS_GEngine.initBattle();
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.battle );

    /**
     * Defense Action class for defense action.
     * @return {undefined} Nothing
     */
    this.defense = function() {
        var args = [];
        args.push( "defense" );     // Action name
        args.push( "battle" );      // Action type
        args.push( function() {     // Action execute
            NS_UI.log( "you defend" );
        } );
        args.push( false );         // Action active
        args.push( true );          // Action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.defense );
}

/**
 * Actor NameSpace function.
 * @return {undefined} Nothing
 */
function _Actor() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    this.engine = undefined;

    /**
     * Actor class for any playable or not playable actor in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Actor = function( args ) {
        GObject.apply( this, args );
        this.attributes = args[ 1 ];
        this.playable = args[ 2 ] ? args[ 2 ] : true;
        this.playableSide = args[ 3 ] ? args[ 3 ] : PLAYER;

        /**
         * Actor damage target.
         * @param  {Actor} target Target actor receiving the damage
         * @return {undefined} Nothing
         */
        this.damage = function( target ) {
            this.attributes.damage( this, target );
        };

        /**
         * Returns if the actor is alive.
         * @return {Boolean} true if actor is alive, false else
         */
        this.isAlive = function() {
            return this.attributes.isAlive();
        };
    };
    inheritKlass( GObject, this.Actor );
}

/**
 * Evento NameSpace function.
 * @return {undefined} Nothing
 */
function _Evento() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    this.engine = undefined;

    /**
     * Evento class for any event used in the game.
     * @param {Array} args Arguments required for the construtor
     * @return {undefined} Nothing
     */
    this.Evento = function( args ) {
        GObject.apply( this, args );
        this.actions = [];
        this.conditions = [];
        var __evento = this;

        /**
         * Evento schedule next action in the evento.
         * @type {Action}
         */
        this.actionScheduleNextAction =
            new NS_Action.Action( [ "evento schedule",
                                    "evento",
                                    function() {
                                        setTimeout( function() {
                                            __evento.runAction();
                                        }, 1 );
                                    },
                                    false,
                                    true ] );

        /**
         * Add an action to the event
         * @param {_Action} action Event action.
         * @return {undefined} Nothing
         */
        this.addAction = function( action ) {
            this.actions.push( action );
        };

        /**
         * Run all even actions.
         * @return {undefined} Nothing
         */
        this.runAllActions = function() {
            for ( var i = 0; i < this.actions.length; i++ ) {
               var result = this.actions[ i ].execute.call( this.actions[ i ] );
               if ( result && this.actions[ i ] ) {
                    this.actions[ i ].processing.call( this, result );
               }
            }
        };

        this.runAction = function() {
            if (this.actions.length) {
                var action = this.actions.shift();
                NS_Evento.engine.addElement( "action", action ).active = true;
                NS_Evento.engine.addElement( "action", this.actionScheduleNextAction ).active = true;
            }
        };
    };
    inheritKlass( GObject, this.Evento );
}

/**
 * Objecto NameSpace function.
 * @return {undefined} Nothing
 */
function _Objeto() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    this.engine = undefined;

    /**
     * Objecto class for any object (item, usable, equipment, ...) used in the
     * game.
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Objeto = function( args ) {
        GObject.apply( this, args );
    };
    inheritKlass( GObject, this.Objeto );
}

/**
 * Scene NameSpace function.
 * @return {undefined} Nothing
 */
function _Scene() {
    /**
     * Game engine instance
     * @type {_Engine}
     */
    this.engine = undefined;

    /**
     * Scene class for any scene used in the game
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Scene = function( args ) {
        GObject.apply( this, args );
    };
    inheritKlass( GObject, this.Scene );
}

// Create all namespace to be used in the application.
var NS_UI = new _UserItf();
var NS_Common = new _Common();
var NS_Action = new _Action();
var NS_Actor = new _Actor();
var NS_Evento = new _Evento();
var NS_Objeto = new _Objeto();
var NS_Scene = new _Scene();

/**
 * Game Engine provides all the functionality required for running the Game.
 *
 * Engine keeps all game object to be used and it provides all functionality
 * for running and displaying those.
 *
 */
function _Engine() {
    /**
     * Generate the next available engine ID.
     * @return {int} Next available engine ID
     */
    this.getNextEngId = function() {
        _Engine.ID++;
        return _Engine.ID;
    };

    /**
     * Look for an ID in the given table.
     * @param  {int} id Engine ID to look for
     * @param  {Array} table Element table where ID should be look for
     * @return {Boolean} true if engine ID was found, false else
     */
    var lookForIn = function( id, table ) {
        if ( id && ( id !== 0 ) ) {
            for ( var i = 0; i < table.length; i++ ) {
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
            for ( var i = 0; i < this.actors.length; i++ ) {
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
        for ( var i = 0; i < this.actors.length; i++ ) {
            this.battle.actors.push( this.actors[ i ] );
        }
        this.battle.active = true;
        this.nextOriginator();
        this.customAvailableTarget();
        this.setStateByBattleTurnPlayableSide();
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
        newElem.engId = this.getNextEngId();
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
        elemTable = this.elementTable[ subject ];
        if ( this.isElement( element.engId, elemTable.table ) ) {
            return null;
        } else {
            if ( element.engId === undefined ) {
                element.engId = this.getNextEngId();
            }
            if ( elemTable.custom ) {
                elemTable.custom.call( this, element );
            }
            elemTable.table.push( element );
            return element;
        }
    };

    /**
     * Add an array of already created elements to the proper element table.
     * @param {String} subject  Element table string identifier
     * @param {Array} elements Array with elements to be added
     * @return {Array} Array of element instances being added
     */
    this.addElements = function( subject, elements ) {
        result = [];
        for ( var i = 0; i < elements.length; i++ ) {
            result.push( this.addElement( subject, elements[ i ] ) );
        }
        return result;
    };

    /**
     * Run actions when engine runs.
     * @return {undefined} Nothing
     */
    this.runActions = function() {
        var toDelete = [];
        for ( var i = 0; i < this.actions.length; i++ ) {
            var action = this.actions[ i ];
            if ( action.active ) {
                action.execute.call( action );
                if ( action.callback ) {
                    action.callback.call( action, action.cbArgs );
                }
                action.active = false;
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
}

// ----------------------------------------------------------------------------
// GAME ENGINE CONFIGURATION
// ----------------------------------------------------------------------------

_Engine.ID = 0;
var NS_GEngine = new _Engine();
NS_GEngine.init();

NS_Common.engine = NS_GEngine;
NS_Action.engine = NS_GEngine;
NS_Actor.engine = NS_GEngine;
NS_Evento.engine = NS_GEngine;
NS_Objeto.engine = NS_GEngine;
NS_Scene.engine = NS_GEngine;

// Set the interval the engine will run again.
setInterval( function() { NS_GEngine.runTick(); }, 100 );
