/**
 * Actor NameSpace function.
 * @return {Boolean} Always true
 */
function _Actor() {
    /**
     * Keep a copy for the object instance.
     * @type {_Actor}
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
     * @return {Boolean} Always true
     */
    this.setEngine = function( engine ) {
        __engine = engine;
        return true;
    };

    /**
     * Actor class for any playable or not playable actor in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Actor = function( args ) {
        GObject.apply( this, args );
        this.attributes = args[ 1 ];
        this.playable = args[ 2 ] ? args[ 2 ] : true;
        this.playableSide = args[ 3 ] ? args[ 3 ] : PLAYER;

        /**
         * Array of objetos the actor can own.
         * @type {Array}
         */
        var __objetos = [];

        /**
         * Actor damage target.
         * @param  {Actor} target Target actor receiving the damage
         * @return {int} Damage value
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
         * @return {Boolean} true if added properly, false else
         */
        this.addObjeto = function( obj ) {
            __objetos.push( obj );
            if ( obj.isUsable() ) {
                this.attributes.addModifier( obj.getAttributes() );
            }
            return true;
        };

        /**
         * Remove objeto from the actor.
         * @param  {Objecto} obj Objecto instance to remove
         * @return {Boolean} true if removed properly, false else
         */
        this.removeObjeto = function( obj ) {
            NS_Common.removeFromArray( __objetos, obj );
            if ( obj.isUsable() ) {
                this.attributes.removeModifier( obj.getAttributes() );
            }
            return true;
        };

        /**
         * Get all actor objeto instances.
         * @return {Array} Array with all objetos instances
         */
        this.getObjetos = function() {
            return __objetos;
        };

        return true;
    };
    inheritKlass( GObject, this.Actor );

    return true;
}

var NS_Actor = new _Actor();
