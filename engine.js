var PLAYER = "player";
var ENEMY = "enemy";
var NPC = "non playable character";

var ST_IN_BATTLE = "in battle";
var ST_IN_BATTLE_WAITING_INPUT = "battle waiting input";
var ST_IN_BATTLE_RUN_INPUT = "battle run imput";
var ST_IN_BATTLE_WAITING_AI = "battle waiting ai";
var ST_WAITING = "waiting";
var ST_NONE = "none";

/**
 * Game Engine provides all the functionality required for running the Game.
 *
 * Engine keeps all game object to be used and it provides all functionality
 * for running and displaying those.
 *
 */
function Engine() {
    /**
     * Generate the next available engine ID.
     * @return {int} Next available engine ID
     */
    this.getNextEngId = function() {
        Engine.ID++;
        return Engine.ID;
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
        actor: { table: this.actors, klass: Actor, custom: this.customActor },
        scene: { table: this.scenes, klass: Scene, custom: undefined },
        objeto: { table: this.objetos, klass: Objeto, custom: undefined },
        evento: { table: this.eventos, klass: Evento, custom: undefined },
        action: { table: this.actions, klass: Action, custom: undefined }
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
    };

    /**
     * Select the next target for the turn.
     * @type {Function}
     */
    this.selectNextTarget = undefined;

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
        this.battle.turn = this.battle.originator.playableSide;
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
        this.battle.turn = this.battle.originator.playableSide;
        this.setStatusByNextActor();
    };

    /**
     * Run a battle turn.
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
            this.status = ST_WAITING;
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
        for ( var i = 0; i < this.actions.length; i++ ) {
            action = this.actions[ i ];
            if ( action.active ) {
                action.callback.call( action );
                action.active = false;
            }
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
     * Run battle enfien machine.
     * @return {undefined} Nothing
     */
    this.runBattle = function() {
        switch (this.status) {
            case ST_IN_BATTLE:
                break;
            case ST_IN_BATTLE_WAITING_INPUT:
                break;
            case ST_IN_BATTLE_RUN_INPUT:
                this.run();
                this.runTurn( this.battleAttack );
                this.logBattleActionResults();
                this.runTurnResult();
                break;
            case ST_IN_BATTLE_WAITING_AI:
                attack.active = true;
                this.run();
                this.runTurn( this.battleAttack );
                this.logBattleActionResults();
                this.runTurnResult();
                break;
            default:
                break;
        }
    };
}

Engine.ID = 0;
var geng = new Engine();

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
 * Create actor attributes to be used.
 * @return {Object} Actor attributes
 */
function createAttributes() {
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
}

/**
 * Actor class for any playable or not playable actor in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Actor( args ) {
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
}
inheritKlass( GObject, Actor );

/**
 * Scene class for any scene used in the game
 * @param {Array} args Arguments required for the constructor
 */
function Scene( args ) {
    GObject.apply( this, args );
}
inheritKlass( GObject, Scene );

/**
 * Objecto class for any object (item, usable, equipment, ...) used in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Objeto( args ) {
    GObject.apply( this, args );
}
inheritKlass( GObject, Objeto );

/**
 * Evento class for any event used in the game.
 * @param {Array} args Arguments required for the construtor
 */
function Evento( args ) {
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
}
inheritKlass( GObject, Evento );

/**
 * Set a game event to be used in the game engine.
 * @param {Function} executeCb    Execute the event
 * @param {Function} processingCb Process the event result
*/
function setGEvent( executeCb, processingCb ) {
    var _ = {
        execute: executeCb,
        processing: processingCb
    };
    return _;
}

/**
 * Create a new Prompt Event to be used as a game event.
 * @param {String} message String to be used in the prompt window
 */
function setEventPrompt( message ) {
    return setGEvent( function( msg ) {
        return function() {
            return prompt( msg );
        };
    }( message ), function( result ) {
        console.log( result );
    } );
}

/**
 * Create a new Dialog Event to be used as a game event.
 * @param {String} message String to be used in the console dialog
 */
function setEventDialog( message ) {
    return setGEvent( function( msg ) {
        return function() {
            console.log( msg );
        };
    }( message ), undefined );
}

/**
 * Action class for any action used in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Action( args ) {
    GObject.apply( this, args );
    this.actionType = args && args[ 1 ] ? args[ 1 ] : undefined;
    this.callback = args && args[ 2 ] ? args[ 2 ] : undefined;
    this.active = args && args[ 3 ] ? args[ 3 ] : false;
}
inheritKlass( GObject, Action );

/**
 * Move Action class for movement action.
 * @param {Integer} steps Number of steps to move
 */
function MoveAction( steps ) {
    this.steps = steps ? steps : 1;
    var args = [];
    args.push( "move" );
    args.push( "move" );
    args.push( function() {
        console.log( "you moved " + this.steps );
    } );
    args.push( false );
    Action.call( this, args );
}
inheritKlass( Action, MoveAction );

/**
 * Attack Action class for attack action.
 * TODO: This method has to give up a lot of functionality to be moved to the
 * engine.
 */
function AttackAction() {
    var args = [];
    args.push( "attack" );
    args.push( "battle" );
    args.push( function() {
        var targetSelect = document.getElementById( "target" );
        var index = targetSelect.selectedIndex;
        var selection = targetSelect[ index ].theTarget;
        geng.battle.target = selection;
    } );
    args.push( false );
    Action.call( this, args );
}
inheritKlass( Action, AttackAction );

/**
 * Defense Action class for defense action.
 */
function DefenseAction() {
    var args = [];
    args.push( "defense" );
    args.push( "battle" );
    args.push( function() {
        console.log( "you defend" );
    } );
    args.push( false );
    Action.call( this, args );
}
inheritKlass( Action, DefenseAction );

/**
 * Run particular action which enable the action
 * @return {undefined} Nothing
 */
function runEnableAction() {
    console.log( "enable-action call for " + this.name + " action" );
    this.active = true;
}

/**
 * Run particular action which disable the action.
 * @return {Action} Action instance
 */
function runDisableAction() {
    console.log( "action " + this.name + " has run" );
    this.active = false;
    setTimeout( runEnableAction.call( this ), Math.floor( Math.random() * 10 ) );
}

// Create Basic actions and add them to the engine.
var move = new MoveAction();
var attack = new AttackAction();
var defense = new DefenseAction();
geng.addElements( "action", [ move, attack, defense ] );

// Set the interval the engine will run again.
setInterval( function() { geng.runBattle(); }, 100 );

// ----- TEST METHODS -----

function test_on_move() {
    move.active = true;
}

function test_on_attack() {
    geng.status = ST_IN_BATTLE_RUN_INPUT;
    attack.active = true;
}

function test_on_defense() {
    defense.active = true;
}

function test_on_action() {
    var m1 = new MoveAction( 2 );
    var m2 = new MoveAction();
    var a = new AttackAction();
    var d = new DefenseAction();
    geng.addElements( "action", [ m1, m2, a, d ] );
    m1.active = true;
    m2.active = true;
    a.active = true;
    d.active = true;
}

function test_on_event() {
    var e1 = new Evento( [ "first evento" ] );
    e1.addStep( setEventPrompt( "Name?" ) );
    e1.addStep( setEventDialog( "Have a nice day" ) );
    e1.runAllSteps();
}

function test_on_actor() {
    var jose = new Actor( [ "jose", createAttributes( 100, 50, 5 ) ] );
    var goblin1 = new Actor( [ "goblin1", createAttributes( 80, 8, 1 ), true, ENEMY ] );
    var goblin2 = new Actor( [ "goblin2", createAttributes( 80, 8, 1 ), true, ENEMY ] );
    geng.selectNextTarget = function() {
        var targetSelect = document.getElementById( "target" );
        var targetLength = targetSelect.length;
        for ( var i = 0; i < targetLength; i++ ) {
            targetSelect.remove( 0 );
        }
        var opt;
        if ( jose.turn ) {
            var enemies = geng.battle.enemyActors();
            for ( i = 0; i < enemies.length; i++ ) {
                opt = document.createElement( "option" );
                var enemy = enemies[ i ];
                opt.value = enemy.name;
                opt.innerHTML = enemy.name;
                opt.theTarget = enemy;
                targetSelect.appendChild( opt );
            }
        } else {
            var players = geng.battle.playerActors();
            for ( i = 0; i < players.length; i++ ) {
                opt = document.createElement( "option" );
                var player = players[ i ];
                opt.value = player.name;
                opt.innerHTML = player.name;
                opt.theTarget = player;
                targetSelect.appendChild( opt );
            }
        }
        return undefined;
    };
    geng.addElements( "actor", [ jose, goblin1, goblin2 ] );
    geng.initBattle();
}
