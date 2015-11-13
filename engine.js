function Engine() {
    this.getNextEngId = function() {
        Engine.ID++;
        return Engine.ID;
    };

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

    this.actors = [];
    this.scenes = [];
    this.objetos = [];
    this.eventos = [];
    this.actions = [];

    this.elementTable = {
        actor: {table: this.actors, klass: Actor},
        scene: {table: this.scenes, klass: Scene},
        objeto: {table: this.objetos, klass: Objeto},
        evento: {table: this.eventos, klass: Evento},
        action: {table: this.actions, klass: Action}
    };

    this.isElement = function (subject, element) {
        if (subject in this.elementTable) {
            elemTable = this.elementTable[subject];
            return lookForIn(element.engId, elemTable.table);
        } else {
            return null;
        }
    };

    this.newElement = function (subject, args) {
        elemTable = this.elementTable[subject];
        var newElem = new elemTable.klass(args);
        newElem.engId = this.getNextEngId();
        elemTable.table.push(newElem);
        return newElem;
    };

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
}
Engine.ID = 0;
var geng = new Engine();

function GObject() {
    this.name = arguments[0] ? arguments[0] : 'object';
    this.getNextObjId = function() {
        GObject.ID++;
        return GObject.ID;
    };
    this.objId = this.getNextObjId();
}
GObject.ID = 0;

function inheritKlass(parent, child) {
    child.prototype = new parent();
    child.prototype.constructor = child;
}

function Actor(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Actor);

function Scene(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Scene);

function Objeto(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Objeto);

function Evento(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Evento);

function Action(args) {
    GObject.apply(this, args);
}
inheritKlass(GObject, Action);

