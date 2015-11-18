var PLAYER = "player";
var ENEMY = "enemy";
var NPC = "non playable character";

var ST_IN_BATTLE = "in battle";
var ST_IN_BATTLE_WAITING_INPUT = "battle waiting input";
var ST_IN_BATTLE_RUN_INPUT = "battle run imput";
var ST_IN_BATTLE_WAITING_AI = "battle waiting ai";
var ST_IN_BATTLE_RUN_AI = "battle run ai";
var ST_IN_BATTLE_END = "battle end";
var ST_WAITING = "waiting";
var ST_NONE = "none";


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
 * @return {undefined}    Nothing
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
            damage: function( originator, target ) {
                var damage = originator.attributes.attack - target.attributes.defense;
                target.attributes.life -= damage;
            },
            isAlive: function() {
                return ( this.life > 0 );
            }
        };
        return _;
    };
}


/**
 * Action NameSpace function
 * @return {undefined} Nothing
 */
function _Action() {
    this.engine = undefined;

    /**
     * Action class for any action used in the game.
     * @param {Array} args Arguments required for the constructor
     */
    this.Action = function( args ) {
        GObject.apply( this, args );
        this.actionType = args && args[ 1 ] ? args[ 1 ] : undefined;
        this.callback = args && args[ 2 ] ? args[ 2 ] : undefined;
        this.active = args && args[ 3 ] ? args[ 3 ] : false;
        this.remove = args && args[ 4 ] ? args[ 4 ] : true;
    };
    inheritKlass( GObject, this.Action );

    /**
     * Move Action class for movement action.
     * @param {Integer} steps Number of steps to move
     */
    this.move = function( steps ) {
        this.steps = steps ? steps : 1;
        var args = [];
        args.push( "move" );        // action name
        args.push( "move" );        // action type
        args.push( function() {     // action callback
            console.log( "you moved " + this.steps );
        } );
        args.push( false );         // action active
        args.push( true );         // action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.move );

    /**
     * Attack Action class for attack action.
     * TODO: This method has to give up a lot of functionality to be moved to the
     * engine.
     */
    this.attack = function() {
        var args = [];
        args.push( "attack" );      // action name
        args.push( "battle" );      // actioon type
        args.push( function() {     // action callback
            var targetSelect = document.getElementById( "target" );
            var index = targetSelect.selectedIndex;
            var selection = targetSelect[ index ].theTarget;
            NS_GEngine.battle.target = selection;
        } );
        args.push( false );         // action active
        args.push( true );         // action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.attack );


    /**
     * Defense Action class for defense action.
     */
    this.defense = function() {
        var args = [];
        args.push( "defense" );     // action name
        args.push( "battle" );      // action type
        args.push( function() {     // action callback
            console.log( "you defend" );
        } );
        args.push( false );         // action active
        args.push( true );          // action remove after exec
        NS_Action.Action.call( this, args );
    };
    inheritKlass( this.Action, this.defense );
}


/**
 * Actor NameSpace function.
 * @return {undefined} Nothing
 */
function _Actor() {
    this.engine = undefined;

    /**
     * Actor class for any playable or not playable actor in the game.
     * @param {Array} args Arguments required for the constructor
     */
    this.Actor = function( args ) {
        GObject.apply( this, args );
        this.attributes = args[ 1 ];
        this.playable = args[ 2 ] ? args[ 2 ] : true;
        this.playableSide = args[ 3 ] ? args[ 3 ] : PLAYER;

        /**
         * Actor damage target.
         * @param  {Actor} target Target actor receiving the damage
         * @return {undefined}        Nothing
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
    this.engine = undefined;

    /**
     * Evento class for any event used in the game.
     * @param {Array} args Arguments required for the construtor
     */
    this.Evento = function( args ) {
        GObject.apply( this, args );
        this.steps = [];
        this.conditions = [];

        /**
         * Add step to the event
         * @param {Step} step Event step.
         */
        this.addStep = function( step ) {
            this.steps.push( step );
        };

        // Steps have to be created as a tree, so they can be traversed. In that way
        // it will be possible to have differnt branches. Every event should be
        // added in the proper way.
        // We could have different types of steps:
        // - Sequential step
        // - Decission steps (n number of options)
        // - Loop steps (stablish an start and and point)
        this.runAllSteps = function() {
            for ( var i = 0; i < this.steps.length; i++ ) {
               var result = this.steps[ i ].execute.call( this.steps[ i ] );
               if ( result && this.steps[ i ] ) {
                    this.steps[ i ].processing.call( this, result );
               }
            }
        };
    };
    inheritKlass( GObject, this.Evento );


    /**
     * Set a game event to be used in the game engine.
     * @param {Function} executeCb    Execute the event
     * @param {Function} processingCb Process the event result
    */
    this.setGEvent = function( executeCb, processingCb ) {
        var _ = {
            execute: executeCb,
            processing: processingCb
        };
        return _;
    };

    /**
     * Create a new Prompt Event to be used as a game event.
     * @param {String} message String to be used in the prompt window
     */
    this.setEventPrompt = function( message ) {
        return this.setGEvent( function( msg ) {
            return function() {
                return prompt( msg );
            };
        }( message ), function( result ) {
            console.log( result );
        } );
    };

    /**
     * Create a new Dialog Event to be used as a game event.
     * @param {String} message String to be used in the console dialog
     */
    this.setEventDialog = function( message ) {
        return this.setGEvent( function( msg ) {
            return function() {
                console.log( msg );
            };
        }( message ), undefined );
    };
}


/**
 * Objecto NameSpace function.
 * @return {undefined} Nothing
 */
function _Objeto() {
    this.engine = undefined;

    /**
     * Objecto class for any object (item, usable, equipment, ...) used in the game.
     * @param {Array} args Arguments required for the constructor
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
    this.engine = undefined;

    /**
     * Scene class for any scene used in the game
     * @param {Array} args Arguments required for the constructor
     */
    this.Scene = function( args ) {
        GObject.apply( this, args );
    };
    inheritKlass( GObject, this.Scene );
}


// Create all Namespaces.
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
     * @param  {int} id    Engine ID to look for
     * @param  {Array} table Element table where ID should be look for
     * @return {Boolean}       true if engine ID was found, false else
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
     * Engine status attribute.
     * @type {String}
     */
    this.status = ST_NONE;

    /**
     * Battle attributes defining who is the battle originator and who are the
     * targets.
     * @type {Object}
     */
    this.battle = {
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
     * @return {undefined}       Nothing
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
        actor: { table: this.actors, klass: NS_Actor.Actor, custom: this.customActor },
        scene: { table: this.scenes, klass: NS_Scene.Scene, custom: undefined },
        objeto: { table: this.objetos, klass: NS_Objeto.Objeto, custom: undefined },
        evento: { table: this.eventos, klass: NS_Evento.Evento, custom: undefined },
        action: { table: this.actions, klass: NS_Action.Action, custom: undefined }
    };

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
     * Select the next target for the turn.
     * @type {Function}
     */
    this.selectNextTarget = undefined;

    /**
     * Selecte the next AI action for the turn
     * @type {Function}
     */
    this.selectNextAiAction = undefined;

    /**
     * Set the next target for the the turn.
     * @return {undefined} Nothing
     */
    this.nextTarget = function() {
        var target = this.selectNextTarget();
        this.battle.target = target;
    };

    /**
     * Set engine status based on the battle turn (next originator actor side).
     */
    this.setStatusByNextActor = function() {
        if ( this.battle.turn === PLAYER ) {
            this.status = ST_IN_BATTLE_WAITING_INPUT;
        } else {
            this.status = ST_IN_BATTLE_WAITING_AI;
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
        this.nextOriginator();
        this.nextTarget();
        this.setStatusByNextActor();
    };

    /**
     * Set the next originator for the turn.
     * @return {undefined} Nothing
     */
    this.nextActor = function() {
        this.battle.originator.turn = false;
        this.battle.actors.push( this.battle.originator );
        this.nextOriginator();
        this.setStatusByNextActor();
    };

    /**
     * Run a battle turn action.
     * @param  {Function} turnAction Action to run for the turn
     * @return {undefined}            Nothing
     */
    this.runTurn = function( turnAction ) {
        turnAction.call( this );
    };

    /**
     * Run turn results.
     * @return {undefined} Nothing
     */
    this.runTurnResult = function() {
        var toDelete = [];
        var actor;
        for ( var i = 0; i < this.battle.actors.length; i++ ) {
            if ( this.battle.actors[ i ].isAlive() === false ) {
                toDelete.push( i );
            }
        }
        if ( toDelete.length > 0 ) {
            for ( i = ( toDelete.length - 1 ); i >= 0; i-- ) {
                actor = this.battle.actors[ toDelete[ i ] ];
                console.log( actor.name + " is dead" );
                this.battle.actors.splice( toDelete[ i ], 1 );
            }
        }
        if ( this.battle.actors.length > 0 ) {
            this.nextActor();
            this.nextTarget();
        } else {
            actor = this.battle.originator;
            console.log( actor.name + " won the battle" );
            this.status = ST_IN_BATTLE_END;
        }
    };

    /**
     * Check if the given element is found in an element table.
     * @param  {String}  subject Element table string identifier
     * @param  {GObject}  element Element to check if is already in table
     * @return {Boolean}         true if element is found, false else
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
     * @param  {Array} args    Argumets to pass to the element constructor
     * @return {GObject}         Element instance created
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
     */
    this.addElements = function( subject, elements ) {
        result = [];
        for ( var i = 0; i < elements.length; i++ ) {
            result.push( this.addElement( subject, elements[ i ] ) );
        }
    };

    /**
     * Run actions when engine runs.
     * @return {undefined} Nothing
     */
    this.runActions = function() {
        var toremove = [];
        for ( var i = 0; i < this.actions.length; i++ ) {
            action = this.actions[ i ];
            if ( action.active ) {
                action.callback.call( action );
                action.active = false;
                if (action.remove) {
                    toremove.push( i );
                }
            }
        }
        for ( var r in toremove ) {
            this.actions.splice( r, 1 );
        }
    };

    /**
     * Run engine machine.
     * @return {undefined} Nothing
     */
    this.run = function() {
        if ( this.actions ) {
            this.runActions();
        }
    };

    /**
     * Console log information with battle action results.
     * @return {undefined} Nothing
     */
    this.logBattleActionResults = function() {
        var originator = this.battle.originator;
        var target = this.battle.target;
        console.log( originator.name + " attack " + target.name + "[" + target.attributes.life + "]" );
    };

    /**
     * Run battle turn.
     * @return {undefined} Nothing
     */
    this.runBattleTurn = function() {
        this.run();
        this.runTurn( this.battleAttack );
        this.logBattleActionResults();
        this.runTurnResult();
    };

    /**
     * Run battle engine machine.
     * @return {undefined} Nothing
     */
    this.runBattle = function() {
        switch (this.status) {
            case ST_IN_BATTLE:
                break;
            case ST_IN_BATTLE_WAITING_INPUT:
                break;
            case ST_IN_BATTLE_RUN_INPUT:
                this.runBattleTurn();
                break;
            case ST_IN_BATTLE_WAITING_AI:
                this.selectNextAiAction();
                this.status = ST_IN_BATTLE_RUN_AI;
                break;
            case ST_IN_BATTLE_RUN_AI:
                this.runBattleTurn();
                break;
            case ST_IN_BATTLE_END:
                break;
            default:
                break;
        }
    };
}


// ----------------------------------------------------------------------------
// GAME ENGINE CONFIGURATION
// ----------------------------------------------------------------------------

_Engine.ID = 0;
var NS_GEngine = new _Engine();

NS_Common.engine = NS_GEngine;
NS_Action.engine = NS_GEngine;
NS_Actor.engine = NS_GEngine;
NS_Evento.engine = NS_GEngine;
NS_Objeto.engine = NS_GEngine;
NS_Scene.engine = NS_GEngine;

// Create Basic actions and add them to the engine.
// var move = new MoveAction();
// var attack = new AttackAction();
// var defense = new DefenseAction();
// NS_GEngine.addElements( "action", [ move, attack, defense ] );

// Set the interval the engine will run again.
setInterval( function() { NS_GEngine.runBattle(); }, 100 );
