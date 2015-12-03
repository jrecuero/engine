/**
 * Scene NameSpace function.
 * @return {undefined} Nothing
 */
function _Scene() {
    /**
     * Keep a copy for the object instance.
     * @type {_Scene}
     */
    var that = this;

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
     * Cell to be used inside every Layout.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Cell = function( args ) {
        GObject.apply( this, args );

        var __position = args && args[ 1 ] ? args[ 1 ] : undefined;
        var __image = args && args[ 2 ] ? args[ 2 ] : undefined;

        return true;
    };
    inheritKlass( GObject, this.Cell );

    /**
     * Layout to be used in scenes.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Layout = function( args ) {
        GObject.apply( this, args );

        var __xdim = args[ 1 ];
        var __ydim = args[ 2 ];
        var __cellMap = new Array( __xdim );
        var i , j;

        for ( i in __cellMap ) {
            __cellMap[ i ] = new Array( __ydim );
        }

        for ( i in __cellMap ) {
            for ( j in __cellMap[ i ] ) {
                __cellMap[ i ][ j ] = new that.Cell( [ 'cell', [ i, j ], null ] );
            }
        }

        this.getDim = function() {
            return [ __xdim, __ydim ];
        };

        this.isInside = function( position ) {
            var x = position[ 0 ];
            var y = position[ 1 ];
            return ( ( x >= 0 ) && ( x < __xdim ) &&
                     ( y >= 0 ) && ( y < __ydim ) &&
                     ( __cellMap[ x ][ y ] ) );
        };

        return true;
    };
    inheritKlass( GObject, this.Layout );

    /**
     * Objeto to be used in scenes.
     * @param {Array} args Arguments required for the contructor
     * @return {Boolean} Always true
     */
    this.ObjetoScene = function( args ) {
        GObjeto.apply( this, args );

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

        this.setPosition = function( position ) {
            __position = position;
        };

        this.getPosition = function() {
            return __position;
        };

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
    inheritKlass( GObject, this.ObjetoScene );

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

        var __DEFAULT_X_DIM = 3;
        var __DEFAULT_Y_DIM = 3;
        var __xdim = args && args[ 1 ] ? args[ 1 ] : __DEFAULT_X_DIM;
        var __ydim = args && args[ 2 ] ? args[ 2 ] : __DEFAULT_Y_DIM;
        var __layout = new that.Layout( [ 'scene-layout', __xdim, __ydim ] );

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

        this.placeObjetoInScene = function( obj, position ) {
            if ( __layout.isInside( position ) ) {
                obj.setPosition( position );
                this.addObjeto( obj );
                return True;
            }
            return False;
        };

        this.replaceObjetoInScene = function( obj, position ) {
            if ( __layout.isInside( position ) ) {
                obj.setPosition( position );
                return True;
            }
            return False;
        };

        /**
         * Get all scene objeto instances.
         * @return {Array} Array with all objetos instances
         */
        this.getObjetos = function() {
            return __objetos;
        };

        this.getDim = function() {
            return __layout.getDim();
        };

        return true;
    };
    inheritKlass( GObject, this.Scene );
}

// Create all namespace to be used in the application.
var NS_Scene = new _Scene();
