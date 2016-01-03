/**
 * Actor NameSpace function.
 * @return {Boolean} Always true
 */
function _Actor() {
    /**
     * Keep a copy for the object instance.
     * @type {_Actor}
     */
    var __that = this;

    /**
     * Actor class for any playable or not playable actor in the game.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} Always true
     */
    this.Actor = function( args ) {
        GObject.apply( this, args );
        var __actor = this;
        this.attributes = undefined;
        this.playable = true;
        this.playableSide = NS_Common.PlaySide.PLAYER;
        this.objScene = undefined;

        Object.defineProperty( this, "cell", {
            get: function() {
                if ( this.objScene !== undefined ) {
                    return this.objScene.cell;
                }
                return undefined;
            }
        } );

        /**
         * Array of objetos the actor can own.
         * @type {Array}
         */
        var __objetos = [];

        var __eventos = [];

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

/**
 * Enemy class.
 * @param {Array} args Arguments required for the constructor
 * @return {Boolean} Always true
 */
_Actor.prototype.Enemy = function( args ) {
    NS_Actor.Actor.apply( this, [ args ] );

    this.playableSide = NS_Common.PlaySide.ENEMY;
    this[ NS_Common.Flag.ENEMY ] = true;
    this[ NS_Common.Flag.TRIGGER ] = true;

    return true;
};
inheritKlass( NS_Actor.Actor, _Actor.prototype.Enemy );

/**
 * Player class.
 * @param {Array} args Arguments required for the constructor
 * @return {Boolean} Always true
 *
 */
_Actor.prototype.Player = function( args ) {
    NS_Actor.Actor.apply( this, [ args ] );

    var __that = this;

    var __uiData = { widget: undefined,
                     onclick: undefined,
                     flag: undefined };

    var __createBattle = function( actors ) {
        var actionBattle = NS_Action.battle( actors );
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
    };

    return true;
};
inheritKlass( NS_Actor.Actor, _Actor.prototype.Player );
