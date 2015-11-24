/**
 * Actor NameSpace function.
 * @return {undefined} Nothing
 */
function _Actor() {
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
     * Actor class for any playable or not playable actor in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {undefined} Nothing
     */
    this.Actor = function( args ) {
        GObject.apply( this, args );
        this.attributes = args[ 1 ];
        this.playable = args[ 2 ] ? args[ 2 ] : true;
        this.playableSide = args[ 3 ] ? args[ 3 ] : PLAYER;

        var __objetos = [];

        /**
         * Actor damage target.
         * @param  {Actor} target Target actor receiving the damage
         * @return {undefined} Nothing
         */
        this.damage = function( target ) {
            return this.attributes.damage( target );
        };

        /**
         * Returns if the actor is alive.
         * @return {Boolean} true if actor is alive, false else
         */
        this.isAlive = function() {
            return this.attributes.isAlive();
        };

        /**
         * Add new objeto to the actor.
         * @param {Objeto} obj Objeto instance to add
         */
        this.addObjeto = function( obj ) {
            __objetos.push( obj );
        };

        /**
         * Remove objeto from the actor
         * @param  {Objecto} obj Objecto instance to remove
         * @return {undefines} Nothing
         */
        this.removeObjeto = function( obj ) {
            NS_Common.removeFromArray( __objetos, obj );
        };
    };
    inheritKlass( GObject, this.Actor );
}

var NS_Actor = new _Actor();
