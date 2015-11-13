function Engine() {
    this.ID = 0;
    this.getNextId = function() {
        var newId = this.ID;
        this.ID++;
        return newId;
    };

    var lookForIn = function(name, table) {
        if (name in table) {
            var index = table.indexOf(name);
            return table[index];
        }
        return null;
    };

    this.actors = [];
    this.lookForActor = function(name) {
        return lookForIn(name, this.actors);
    };
    this.newActor = function(name) {
        if (this.lookForActor(name)) {
            return null;
        } else {
            var anActor = new Actor(name);
            this.actors.push(anActor);
            return anActor;
        }
    };

    this.scenes = [];
    this.lookForScene = function(name) {
        return lookForIn(name, this.scenes);
    };
    this.newScene = function(name) {
        if (this.lookForScene(name)) {
            return null;
        } else {
            var aScene = new Scene(name);
            this.scenes.push(aScene);
            return aScene;
        }
    };

    this.objetos = [];
    this.lookForObjeto = function(name) {
        return lookForIn(name, this.objetos);
    };
    this.newObjeto = function(name) {
        if (this.lookForObjeto(name)) {
            return null;
        } else {
            var anObjeto = new Objeto(name);
            this.objetos.push(anObjeto);
            return newObjeto;
        }
    };

    this.eventos = [];
    this.lookForEvento = function(name) {
        return lookForIn(name, this.eventos);
    };
    this.newEvento = function(name) {
        if (this.lookForEvento(name)) {
            return null;
        } else {
            var anEvento = new Evento(name);
            this.eventos.push(anEvento);
            return anEvento;
        }
    };

    this.actions = [];
    this.lookForAction = function(name) {
        return lookForIn(name, this.actions);
    };
    this.newAction = function(name) {
        if (this.lookForAction(name)) {
            return null;
        } else {
            var anAction = new Action(name);
            this.actions.push(anAction);
            return anAction;
        }
    };
}

var geng = new Engine();

function GObject() {
    this.name = arguments[0] ? arguments[0] : 'object';
    this.ID = geng.getNextId();
}

function inheritKlass(parent, child) {
    child.prototype = new parent();
    child.prototype.constructor = child;
}

function Actor() {
    GObject.apply(this, arguments);
}
inheritKlass(GObject, Actor);

function Scene() {
    GObject.apply(this, arguments);
}
inheritKlass(GObject, Scene);

function Objeto() {
    GObject.apply(this, arguments);
}
inheritKlass(GObject, Objeto);

function Evento() {
    GObject.apply(this, arguments);
}
inheritKlass(GObject, Evento);

function Action() {
    GObject.apply(this, arguments);
}
inheritKlass(GObject, Action);

