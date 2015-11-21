/**
 * Objecto NameSpace function.
 * @return {undefined} Nothing
 */
function _Objeto() {
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

var NS_Objeto = new _Objeto();
