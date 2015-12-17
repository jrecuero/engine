
/**
 * GObject represents any game object in the system.
 * @return {Boolean} Always true
 */
function GObject() {
    this.name = arguments[ 0 ] ? arguments[ 0 ] : "object";
    this.objId = NS_Common.nextId();
    this.log = undefined;
    return true;
}

/**
 * InheritKlass provides inherited functionality.
 *
 * @param  {Class} parent Parent class
 * @param  {Class} child  Derived class
 * @return {Object} Derive class instance
 */
function inheritKlass( parent, child ) {
    child.prototype = new parent();
    child.prototype.constructor = child;
    return child;
}

/**
 * Game attributes object.
 * @return {Boolean} Always true
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
     * Reset all attributes to the base value
     * @return {Boolean} Always true
     */
    var __reset = function() {
        that.life = __life;
        that.attack = __attack;
        that.defense = __defense;
        return true;
    };

    /**
     * Update all attributes with modifiers values.
     * @return {Boolean} Always true
     */
    var __update = function() {
        __reset();
        for ( var i in __modifiers ) {
            that.life += __modifiers[ i ].life;
            that.attack += __modifiers[ i ].attack;
            that.defense += __modifiers[ i ].defense;
        }
        return true;
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
     * @return {Boolean} true if added properly, false else
     */
    this.addModifier = function( modifier ) {
        __modifiers.push( modifier );
        __update();
        return true;
    };

    /**
     * Remote modifier from the argument.
     * @param  {Object} modifier Modifier instance
     * @return {Boolean} true if removed properly, false else
     */
    this.removeModifier = function( modifier ) {
        NS_Common.removeFromArray( __modifiers, modifier );
        __update();
        return true
    };

    /**
     * Return all attribute modifiers.
     * @return {Array} Array with all attribute modifiers
     */
    this.getModifiers = function() {
        return __modifiers;
    };

    return true;
}

/**
 * Common NameSpace functions.
 * @return {undefined} Nothing
 */
function _Common() {
    /**
     * Remove value from array.
     * @param {Array} array Array where value should be removed
     * @param {Object} value Value to be removed from the array
     * @return {Boolean} true if value was removed, false else
     */
    this.removeFromArray = function( array, value ) {
        var index = array.indexOf( value );
        array.splice( index, 1 );
        return true;
    };

    /**
     * Delete table based on the second given table.
     * @param  {Array} table    Original table to delete entries
     * @param  {Array} to_delete Table with entries to delete
     * @return {Boolean} true if value was deleted, false else
     */
    this.deleteWith = function( table, to_delete ) {
        if ( to_delete.length > 0 ) {
            for ( var i = ( to_delete.length - 1 ); i >= 0; i-- ) {
                table.splice( to_delete[ i ], 1 );
            }
        }
        return true;
    };

    /**
     * Get an element from a given table based on the object id.
     * @param  {int} id Object ID to look for
     * @param  {Array} table Element table where ID should be looked for
     * @return {GObject} Element found in the table, null else
     */
    var getForIdFromTable = function( id, table ) {
        if ( id && ( id !== 0 ) ) {
            for ( var i in table ) {
                if ( table[ i ].objId == id ) {
                    return table[ i ];
                }
            }
            return null;
        } else {
            return null;
        }
    };

    /**
     * Get an element from a given table based on the name.
     * @param  {String} Name to look for
     * @param  {Array} table Element table where ID should be looked for
     * @return {GObject} Element found in the table, null else
     */
    var getForNameFromTable = function( name, table ) {
        if ( name ) {
            for ( var i in table ) {
                if ( table[ i ].name == name ) {
                    return table[ i ];
                }
            }
            return null;
        } else {
            return null;
        }
    };

    this.EntityType = {
        ACTOR: "ACTOR",
        OBJETO: "OBJETO",
    };

    this.PlaySide = {
        PLAYER: "player",
        ENEMY: "enemy",
        NPC: "non playable character",
    };

    this.Flag = {
        ACTION: 'isAction',
        MOVE: 'isMove',
        USE: "isUse",
        TAKE: "isTake",
        DROP: "isDrop",
        HIDEN: "isHiden",
        SOLID: "isSolid",
        TRIGGER: 'isTrigger',
        LOOK: 'isLook',
    };

    var __uniqueId = 0;

    this.nextId = function() {
        __uniqueId++;
        return __uniqueId;
    };

    return true;
}

var NS_Common = new _Common();
