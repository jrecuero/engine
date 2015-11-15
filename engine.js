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
    var lookForIn = function(id, table) {
        if (id && (id !== 0)) {
            for (var i = 0; i < table.length; i++) {
                if (table[i].engId == id) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    };

    /**
     * Battle attributes defining who is the battle originator and who are the
     * targets.
     * @type {Object}
     */
    this.battle = {
        originator: undefined,
        target: undefined
    };

    /**
     * Standard battle attack.
     * @return {undefined} Nothing
     */
    this.battleAttack = function() {
        var originator = this.battle.originator;
        var target = this.battle.target;
        var damage = originator.attributes.attack = target.attributes.defense;
        target.attributes.life -= damage;
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
     * Element table is an object that contains all possible game elements used
     * in the game, stored in different tables.
     * @type {Object}
     */
    this.elementTable = {
        actor: {table: this.actors, klass: Actor, custom: undefined},
        scene: {table: this.scenes, klass: Scene, custom: undefined},
        objeto: {table: this.objetos, klass: Objeto, custom: undefined},
        evento: {table: this.eventos, klass: Evento, custom: undefined},
        action: {table: this.actions, klass: Action, custom: undefined}
    };

    /**
     * Check if the given element is found in an element table.
     * @param  {String}  subject Element table string identifier
     * @param  {GObject}  element Element to check if is already in table
     * @return {Boolean}         true if element is found, false else
     */
    this.isElement = function (subject, element) {
        if (subject in this.elementTable) {
            elemTable = this.elementTable[subject];
            return lookForIn(element.engId, elemTable.table);
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
    this.newElement = function (subject, args) {
        elemTable = this.elementTable[subject];
        var newElem = new elemTable.klass(args);
        newElem.engId = this.getNextEngId();
        elemTable.table.push(newElem);
        return newElem;
    };

    /**
     * Add an already created element to the proper element table.
     * @param {String} subject Element table string identifier
     * @param {GObject} element Element instance to be added
     */
    this.addElement = function(subject, element) {
        elemTable = this.elementTable[subject];
        if (this.isElement(element.engId, elemTable.table)) {
            return null;
        } else {
            if (element.engId === undefined) {
                element.engId = this.getNextEngId();
            }
            elemTable.table.push(element);
            return element;
        }
    };

    /**
     * Add an array of already created elements to the proper element table.
     * @param {String} subject  Element table string identifier
     * @param {Array} elements Array with elements to be added
     */
    this.addElements = function(subject, elements) {
        result = [];
        for (var i = 0; i < elements.length; i++) {
            result.push(this.addElement(subject, elements[i]));
        }
    };

    /**
     * Run actions when engine runs.
     * @return {undefined} Nothing
     */
    this.runActions = function() {
        for (var i = 0; i < this.actions.length; i++) {
            action = this.actions[i];
            if (action.active) {
                action.callback.call(action);
                action.active = false;
            }
        }
    };

    /**
     * Run engine machine.
     * @return {undefined} Nothing
     */
    this.run = function() {
        if (this.actions) {
            this.runActions();
        }
    };
}

Engine.ID = 0;
var geng = new Engine();

/**
 * GObject represents any game object in the system.
 */
function GObject() {
    this.name = arguments[0] ? arguments[0] : 'object';
    this.getNextObjId = function() {
        GObject.ID++;
        return GObject.ID;
    };
    this.objId = this.getNextObjId();
}
GObject.ID = 0;

/**
 * inheritKlass provides inherited functionality.
 *
 * @param  {Class} parent Parent class
 * @param  {Class} child  Derived class
 * @return {undefined}    Nothing
 */
function inheritKlass(parent, child) {
    child.prototype = new parent();
    child.prototype.constructor = child;
}

/**
 * Create actor attributes to be used.
 * @return {Object} Actor attributes
 */
function createAttributes() {
    var _ = {
        life: arguments[0],
        attack: arguments[1],
        defense: arguments[2]
    };
    return _;
}

/**
 * Actor class for any playable or not playable actor in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Actor(args) {
    GObject.apply(this, args);
    this.attributes = args[1];
}
inheritKlass(GObject, Actor);

/**
 * Scene class for any scene used in the game
 * @param {Array} args Arguments required for the constructor
 */
function Scene(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Scene);

/**
 * Objecto class for any object (item, usable, equipment, ...) used in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Objeto(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Objeto);

/**
 * Evento class for any event used in the game.
 * @param {Array} args Arguments required for the construtor
 */
function Evento(args) {
    GObject.apply(this, args);
    this.steps = [];
    this.conditions = [];

    this.addStep = function(step) {
        this.steps.push(step);
    };

    // Steps have to be created as a tree, so they can be traversed. In that way
    // it will be possible to have differnt branches. Every event should be
    // added in the proper way.
    // We could have different types of steps:
    // - Sequential step
    // - Decission steps (n number of options)
    // - Loop steps (stablish an start and and point)
    this.runAllSteps = function() {
        for (var i = 0; i < this.steps.length; i++) {
           var result = this.steps[i].execute.call(this.steps[i]);
           if (result && this.steps[i]) {
                this.steps[i].processing.call(this, result);
           }
        }
    };
}
inheritKlass(GObject, Evento);

/**
 * Set a game event to be used in the game engine.
 * @param {Function} executeCb    Execute the event
 * @param {Function} processingCb Process the event result
*/
function setGEvent(executeCb, processingCb) {
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
function setEventPrompt(message) {
    return setGEvent(function(msg) {
        return function() {
            return prompt(msg);
        };
    }(message), function(result) {
        console.log(result);
    });
}

/**
 * Create a new Dialog Event to be used as a game event.
 * @param {String} message String to be used in the console dialog
 */
function setEventDialog(message) {
    return setGEvent(function(msg) {
        return function() {
            console.log(msg);
        };
    }(message), undefined);
}

/**
 * Action class for any action used in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Action(args) {
    GObject.apply(this, args);
    this.actionType = args && args[1] ? args[1] : undefined;
    this.callback = args && args[2] ? args[2] : undefined;
    this.active = args && args[3] ? args[3] : false;
}
inheritKlass(GObject, Action);

/**
 * Move Action class for movement action.
 * @param {Integer} steps Number of steps to move
 */
function MoveAction(steps) {
    this.steps = steps ? steps : 1;
    var args = [];
    args.push('move');
    args.push('move');
    args.push(function() {
        console.log('you moved ' + this.steps);
    });
    args.push(false);
    Action.call(this, args);
}
inheritKlass(Action, MoveAction);

/**
 * Attack Action class for attack action.
 */
function AttackAction() {
    var args = [];
    args.push('attack');
    args.push('battle');
    args.push(function() {
        var originator = geng.battle.originator;
        var target = geng.battle.target;
        geng.battleAttack();
        console.log(originator.name + " attack " + target.name + "[" + target.attributes.life + "]");
    });
    args.push(false);
    Action.call(this, args);
}
inheritKlass(Action, AttackAction);

/**
 * Defense Action class for defense action.
 */
function DefenseAction() {
    var args = [];
    args.push('defense');
    args.push('battle');
    args.push(function() {
        console.log("you defend");
    });
    args.push(false);
    Action.call(this, args);
}
inheritKlass(Action, DefenseAction);

/**
 * Run particular action which enable the action
 * @return {undefined} Nothing
 */
function runEnableAction() {
    console.log('enable-action call for ' + this.name + ' action');
    this.active = true;
}

/**
 * Run particular action which disable the action.
 * @return {Action} Action instance
 */
function runDisableAction() {
    console.log('action ' + this.name + ' has run');
    this.active = false;
    setTimeout(runEnableAction.call(this), Math.floor(Math.random() * 10));
}

// Create Basic actions and add them to the engine.
var move = new MoveAction();
var attack = new AttackAction();
var defense = new DefenseAction();
geng.addElements('action', [move, attack, defense]);

// Set the interval the engine will run again.
setInterval(function () { geng.run(); }, 100);

// ----- TEST METHODS -----

function test_on_move() {
    move.active = true;
}

function test_on_attack() {
    attack.active = true;
}

function test_on_defense() {
    defense.active = true;
}

function test_on_action() {
    var m1 = new MoveAction(2);
    var m2 = new MoveAction();
    var a = new AttackAction();
    var d = new DefenseAction();
    geng.addElements('action', [m1, m2, a, d]);
    m1.active = true;
    m2.active = true;
    a.active = true;
    d.active = true;
}

function test_on_event() {
    var e1 = new Evento(['first evento']);
    e1.addStep(setEventPrompt("Name?"));
    e1.addStep(setEventDialog('Have a nice day'));
    e1.runAllSteps();
}

function test_on_actor() {
    var attrs = createAttributes(100, 10, 5);
    var jose = new Actor(['jose', attrs]);
    var goblin = new Actor(['goblin', attrs]);
    geng.addElements('actor', [jose, goblin]);
    geng.battle.originator = jose;
    geng.battle.target = goblin;
}