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
     * Add an already created element to the proper element table
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
     * Run actions when engine runs.
     * @return {undefined} Nothing
     */
    this.runActions = function() {
        for (var i = 0; i < this.actions.length; i++) {
            action = this.actions[i];
            if (action.active) {
                action.callback.call(action);
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
 * Actor class for any playable or not playable actor in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Actor(args) {
    GObject.apply(this, args);
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

    this.runAllSteps = function() {
        for (var i = 0; i < this.steps.length; i++) {
            /*
            var result = this.steps[i].execute.call(this);
            if (result) {
                this.steps[i].processing.call(this, result);
            }
            */
           var result = this.steps[i].execute().call(this.steps[i]);
           if (result) {
                this.steps[i].processing.call(this, result);
           }
        }
    };
}
inheritKlass(GObject, Evento);

/*
function dialogStep(message) {
    return function() {
        console.log(message);
    };
}

function promptStep(message) {
    return function() {
        return prompt(message);
    };
}
*/

var promptStep = {
    message: undefined,
    execute: function() { return function() { return prompt(this.message); }; },
    processing: function(result) { console.log('result was ' + result); }
};
function setPromptStep(message) {
    var _ = {
        message: undefined,
        execute: function() { return function() { return prompt(this.message); }; },
        processing: function(result) { console.log('result was ' + result); }
    };
    _.message = message;
    return _;
}

/**
 * Action class for any action used in the game.
 * @param {Array} args Arguments required for the constructor
 */
function Action(args) {
    GObject.apply(this, args);
    this.actionType = args[1];
    this.callback = args[2];
    this.active = args.length >= 4 ? args[3] : false;
}
inheritKlass(GObject, Action);

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

setInterval(function () { geng.run(); }, 1000);

function test_on_work() {
    var e1 = new Evento(['first evento']);
    promptStep.message = "What is your name?";
    e1.addStep(setPromptStep("Name?"));
    e1.runAllSteps();
}

