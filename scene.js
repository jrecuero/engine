/**
 * Scene NameSpace function.
 * @return {undefined} Nothing
 */
function _Scene() {
    /**
     * Keep a copy for the object instance.
     * @type {_Scene}
     */
    var __that = this;

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

    this.Point = function( x, y ) {
        this.x = x;
        this.y = y;

        this.set = function( x, y ) {
            this.x = x;
            this.y = y;
            return this;
        };

        this.setWithPoint = function( point ) {
            return set( point.x, point.y );
        };

        this.setWithArray = function( array ) {
            return set( array[ 0 ], array[ 1 ] );
        };

        this.getAsArray = function() {
            return [ this.x, this.y ];
        };

        this.equal = function( x, y ) {
            return ( ( this.x === x ) && ( this.y === y ) );
        };

        this.equalAsPoint = function( point ) {
            return equal( point.x, point.y );
        };

        this.equalAsArray = function( array ) {
            return equal( array[ 0 ], array[ 1] );
        };
    };

    /**
     * Cell to be used inside every Layout.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Cell = function( x, y, image ) {
        this.pos = new Point( x, y );
        var __image = image;
        var __container = [];

        Object.defineProperty( this, "x", {
            get: function() {
                return this.pos.x;
            },
            set: function( val ) {
                this.pos.x = val;
            }
        });

        Object.defineProperty( this, "y", {
            get: function() {
                return this.pos.y;
            },
            set: function( val ) {
                this.pos.y = val;
            }
        });

        this.append = function( entity ) {
            this.__container.push( entity );
        };

        this.remove = function( entity ) {
            NS_Common.removeFromArray( this.__container, entity );
        };

        this.getImage = function() {
            return __image;
        }

        this.getContainer = function() {
            return __container;
        };

        return true;
    };

    /**
     * Layout to be used in scenes.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Layout = function( name, xdim, ydim ) {
        GObject.apply( this, [ name ] );

        var __layout = this;
        var __xdim = xdim;
        var __ydim = ydim;
        var __cellMap = new Array( __xdim );

        for ( var i = 0; i < __cellMap.length; i++ ) {
            __cellMap[ i ] = new Array( __ydim );
            for ( var j = 0; j < __cellMap[ i ].length; j++ ) {
                __cellMap[ i ][ j ] = new Cell( i, j , null );
            }
        }

        this.getCellAt = function( x, y ) {
            return __cellMap[ x ][ y ];
        };

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

        this.move = {
            defaultCell: new __that.Cell( 0, 0 ),

            forward: function( x, y ) {
                var result = Object.create( that.Point ).set( x, y );
                if ( __layout.isInside( [ x, y - 1 ] ) ) {
                    result.y--;
                }
                return result;
            },

            backward:  function( x, y ) {
                var result = Object.create( that.Point ).set( x, y );
                if ( __layout.isInside( [ x, y + 1 ] ) ) {
                    result.y++;
                }
                return result;
            },

            left: function( x, y ) {
                var result = Object.create( that.Point ).set( x, y );
                if ( __layout.isInside( [ x - 1, y ] ) ) {
                    result.x--;
                }
                return result;
            },

            right: function( x, y ) {
                var result = Object.create( that.Point ).set( x, y );
                if ( __layout.isInside( [ x + 1, y ] ) ) {
                    result.x++;
                }
                return result;
            },
        };

        this.setAt = function( x, y, entity ) {
            var cell = this.getCellAt( x, y );
            return cell.append( entity );
        };

        this.removeAt = function( x, y, entity ) {
            var cell = this.getCellAt( x, y );
            return cell.remove( entity );
        };

        return true;
    };
    inheritKlass( GObject, this.Layout );

    /**
     * Objeto to be used in scenes.
     * @param {Array} args Arguments required for the contructor
     * @return {Boolean} Always true
     */
    this.ObjetoScene = function( entity ) {
        GObject.apply( this, [ entity.name ] );

        var __entity = entity;

        /**
         * Objeto cell in the scene layout.
         * @type {Object}
         */
         var __cell;

        /**
         * Array of eventos triggered by the scene objeto.
         * @type {Array}
         */
        var __eventos = [];

        Object.defineProperty( this, 'entity', {
            get: function() {
                return __entity;
            },
            set: function( val ) {
                __entity = val;
                __cell = __entity.cell;
                return __entity;
            },
        });

        Object.defineProperty( this, 'cell', {
            get: function() {
                return __cell;
            },
            set: function( val ) {
                __cell = val;
                return __cell;
            },
        });

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
    this.Scene = function( name, xdim, ydim ) {
        GObject.apply( this, [ name ] );

        /**
         * Array of objetos the actor can own.
         * @type {Array}
         */
        var __objetos = [];

        var __xdim = xdim;
        var __ydim = ydim;
        var __layout = new __that.Layout( name + '-layout', __xdim, __ydim );

        /**
         * Get cell at the given position.
         * @param  {Integer} x X-position for the cell
         * @param  {Interger} y Y-position for the cell
         * @return {Cell} Cell at the given position
         */
        this.getCellAt = function( x, y ) {
            return __layout.getCellAt( x, y );
        };

        /**
         * Move class.
         * @type {Object}
         */
        this.move = {
            forward: function( x, y ) {
                return __layout.move.forward( x, y );
            },

            backward:  function( x, y ) {
                return __layout.move.backward( x, y );
            },

            left: function( x, y ) {
                return __layout.move.left( x, y );
            },

            right: function( x, y ) {
                return __layout.move.right( x, y );
            },

            equal: function( pos1, pos2 ) {
                return ( ( pos1[ 0] === pos2[ 0 ] ) && ( pos1[ 1 ] === pos2[ 1 ] ) );
            },

            canForward: function( x, y ) {
                return __layout.isInside( [ x, y - 1 ] );
            },

            canBackward: function( x, y ) {
                return __layout.isInside( [ x, y + 1 ] );
            },

            canLeft: function( x, y ) {
                return __layout.isInside( [ x - 1, y ] );
            },

            canRight: function( x, y ) {
                return __layout.isInside( [ x + 1, y ] );
            },

            setAt: function( x, y, entity ) {
                return __layout.setAt( x, y, entity );
            },

            removeAt: function( x, y, entity ) {
                return __layout.removeAt( x, y, entity );
            },
        };

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
         * Create a new ObjetoScene based on the given entity and place it in
         * the scene.
         * @param  {Object} entity Entity instance for the ObjetoScene
         * @param  {Cell} cell Cell instance where objeto will be placed
         * @return {Boolean} true if objeto was created and placed, false else
         */
        this.createObjetoInScene = function( entity, cell ) {
            if ( __layout.isInside( cell ) ) {
                enity.cell = cell;
                var obj = new ObjetoScene( entity );
                obj.cell = cell;
                this.addObjeto( obj );
                cell.append(obj);
                return true;
            }
            return false;
        };

        /**
         * Place given object in the scene at the given cell.
         * @param  {ObjectoScene} obj  Objeto scene instance
         * @param  {Cell} cell Cell to place the object
         * @return {Boolean} true if objecto placed in cell, false else
         */
        this.placeObjetoInScene = function( obj, cell ) {
            if ( __layout.isInside( cell ) ) {
                obj.cell = cell;
                obj.enity.cell = cell;
                this.addObjeto( obj );
                cell.append(obj);
                return true;
            }
            return false;
        };

        /**
         * Replace given objeto in the scene at the given cell.
         * @param  {ObjetoScene} obj  Objeto scene instance to be replaced
         * @param  {Cell} cell Cell to replace the objeto
         * @return {Boolean} true if objeto was replaces, false else
         */
        this.replaceObjetoInScene = function( obj, cell ) {
            if ( __layout.isInside( cell ) ) {
                obj.cell.remove( obj );
                obj.cell = cell;
                obj.entity.cell = cell;
                obj.cell.append( obj );
                return true;
            }
            return false;
        };

        this.removeObjetoFromScece = function( obj ) {
            obj.cell.remove( obj );
            obj.cell = undefined;
            obj.enity.cell = undefined;
            this.removeObjeto( obj );
        };

        /**
         * Get all scene objeto instances.
         * @return {Array} Array with all objetos instances
         */
        this.getObjetos = function() {
            return __objetos;
        };

        this.getObjetosAtCell = function( cell ) {
            return cell.getContainer();
        };

        /**
         * Return layout dimension for the scene.
         * @return {Array} Array with scene layout dimensions
         */
        this.getDim = function() {
            return __layout.getDim();
        };

        return true;
    };
    inheritKlass( GObject, this.Scene );
}

// Create all namespace to be used in the application.
var NS_Scene = new _Scene();
