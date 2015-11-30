/**
 * Scene NameSpace function.
 * @return {undefined} Nothing
 */
function _Scene() {
    /**
     * Keep a copy for the object instance.
     * @type {_Scene}
     */
    that = this;

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
     * Layout to be used in scenes.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Layout = function( args ) {
        GObject.apply( this, args );

        return true;
    };
    inheritKlass( GObject, this.Layout );

    /**
     * Objeto to be used in scenes.
     * @param {Array} args Arguments required for the contructor
     * @return {Boolean} Always true
     */
    this.ObjetoScene = function( args ) {
        NS_Objeto.apply( this, args );

        /**
         * Objeto position in the scene layout.
         * @type {Object}
         */
         var __position;

        /**
         * Array of eventos triggered by the scene objeto.
         * @type {Array}
         */
        var __eventos = [];

        this.addEvento = function( evento ) {
            __eventos.push( evento );
            return true;
        };

        this.getAllEventos = function() {
            return __eventos;
        };

        this.getEvento = function( id ) {
            var evento = NS_Common.getForNameFromTable( id, __eventos );
            return evento;
        };

        return true;
    };
    inheritKlass( NS_Objeto.Object, this.ObjetoScene);

    /**
     * Scene class for any scene used in the game
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Scene = function( args ) {
        GObject.apply( this, args );

        /**
         * Array of objetos the actor can own.
         * @type {Array}
         */
        var __objetos = [];

        /**
         * Add new objeto to the scene.
         * @param {Objeto} obj Objeto instance to add
         * @return {Boolean} true if added properly, false else
         */
        this.addObjeto = function( obj ) {
            __objetos.push( obj );
            return true;
        };

        /**
         * Remove objeto from the scene.
         * @param  {Objecto} obj Objecto instance to remove
         * @return {Boolean} true if removed properly, false else
         */
        this.removeObjeto = function( obj ) {
            NS_Common.removeFromArray( __objetos, obj );
            return true;
        };

        /**
         * Get all scene objeto instances.
         * @return {Array} Array with all objetos instances
         */
        this.getObjetos = function() {
            return __objetos;
        };

        return true;
    };
    inheritKlass( GObject, this.Scene );
}

// Create all namespace to be used in the application.
var NS_Scene = new _Scene();
