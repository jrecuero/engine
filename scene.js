/**
 * Scene NameSpace function.
 * @return {undefined} Nothing
 */
function _Scene() {
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
     * Scene class for any scene used in the game
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Scene = function( args ) {
        GObject.apply( this, args );
    };
    inheritKlass( GObject, this.Scene );
}

// Create all namespace to be used in the application.
var NS_Scene = new _Scene();
