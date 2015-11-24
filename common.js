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
 * Game attributes object.
 * @return {Object} Actor attributes
 */
function Attrs() {
    /**
     * Objeto instance to be used by any method.
     * @type {_Objeto}
     */
    var that = this;

    /**
     * Life attribute.
     * @type {int}
     */
    this.life =  arguments[ 0 ];
    var __life = this.life;
    this.getLifeAndMod = function() {
        return [ __life, this.life ];
    };

    /**
     * Attack attribute.
     * @type {int}
     */
    this.attack = arguments[ 1 ];
    var __attack = this.attack;
    this.getAttackAndMod = function() {
        return [ __attack, this.attack ];
    };

    /**
     * Defense attribute.
     * @type {int}
     */
    this.defense = arguments[ 2 ];
    var __defense = this.defense;
    this.getDefenseAndMod = function() {
        return [ __defense, this.defense ];
    };

    /**
     * Attributes mofidiers list.
     * @type {Array}
     */
    var __modifiers = [];

    /**
     * Reset all attributes to the base value.
     * @return {undefined} Nothing
     */
    var __reset = function() {
        that.life = __life;
        that.attack = __attack;
        that.defense = __defense;
    };

    /**
     * Update all attributes with modifiers values.
     * @return {undefined} Nothing
     */
    var __update = function() {
        __reset();
        for ( var i in __modifiers ) {
            that.life += __modifiers[ i ].life;
            that.attack += __modifiers[ i ].attack;
            that.defense += __modifiers[ i ].defense;
        }
    };

    /**
     * Attribute damage result.
     * @param  {Object} tgt Target instannce
     * @return {int} Total damage
     */
    this.damage = function( tgt ) {
        var damage = this.attack - tgt.attributes.defense;
        tgt.attributes.life -= damage;
        return damage;
    };

    /**
     * Return is instance life is greater than zero.
     * @return {Boolean} Instance life is greater than zero
     */
    this.isAlive = function() {
        return ( this.life > 0 );
    };

    /**
     * Add modifier to attributes.
     * @param {Object} modifier Modifier instance
     */
    this.addModifier = function( modifier ) {
        __modifiers.push( modifier );
        __update();
    };

    /**
     * Remote modifier from the argument.
     * @param  {Object} modifier Modifier instance
     * @return {undefined} Nothing
     */
    this.removeModifier = function( modifier ) {
        NS_Common.removeFromArray( __modifiers, modifier );
        __update();
    };

    /**
     * Return all attribute modifiers.
     * @return {Array} Array with all attribute modifiers
     */
    this.getModifiers = function() {
        return __modifiers;
    };
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
    var __engine;

    /**
     * Set game engine for the attribute variable
     * @param {_Engine} engine Game engine instance
     */
    this.setEngine = function( engine ) {
        __engine = engine;
    };

    this.removeFromArray = function( array, value ) {
        var index = array.indexOf( value );
        array.splice( index, 1 );
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

var NS_Common = new _Common();
