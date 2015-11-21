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
    var __engine;

    /**
     * Set game engine for the attribute variable
     * @param {_Engine} engine Game engine instance
     */
    this.setEngine = function( engine ) {
        __engine = engine;
    };

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

var NS_Common = new _Common();
