/**
 * Objecto NameSpace function.
 * @return {Boolean} Always true
 */
function _Objeto() {
    /**
     * Objeto instance to be used by any method.
     * @type {_Objeto}
     */
    var that = this;

    /**
     * Objecto class for any object (item, usable, equipment, ...) used in the
     * game.
     * @param {Array} args Arguments required for the constructor
     * @return {Boolean} true if object was created properly, false else
     */
    this.Objeto = function( args ) {
        GObject.apply( this, args );

        /**
         * Objeto is active when it is equipped.
         * @type {Boolean}
         */
        this.active = false;

        /**
         * Objeto is enable.
         * @type {Boolean}
         */
        this.enable = false;

        for ( var flag in NS_Common.Flag ) {}
            this[ flag ] = false;

        /**
         * Set objeto as usable.
         * @return {Boolean} Always true
         */
        this.usable = function() {
            this.active = true;
            this.enable = true;
            return true;
        };

        /**
         * Set objeto as not usable.
         * @return {Boolean} Always true
         */
        this.noUsable = function() {
            this.active = false;
            this.enable = false;
            return true;
        };

        /**
         * Check if objeto is usable or not.
         * @return {Boolean} true if usable, false else
         */
        this.isUsable = function() {
            return this.active && this.enable;
        };

        /**
         * Private attribute storing objeto attributes.
         */
        var __attributes;

        /**
         * Set objeto attributes
         * @param {Object} attrs Objeto attribute instance
         * @return {Object} Attributes instance
         */
        this.setAttributes = function( attrs ) {
            __attributes = attrs;
            return attrs;
        };

        /**
         * Return objeto attributes.
         * @return {Object} Objeto attribute instance
         */
        this.getAttributes = function() {
            return __attributes;
        };

        /**
         * Set value for one give attribute.
         * @param {String} attr  Attribute name
         * @param {Object} value New attribute value
         * @return {Boolean} true if value was set properly, false else
         */
        this.setAttr = function( attr, value ) {
            __attributes[ attr ] = value;
            return true;
        };

        /**
         * Get value for one given attribute.
         * @param  {String} attr Attribute name
         * @return {Object} Attribute value
         */
        this.getAttr = function( attr ) {
            return __attributes[ attr ];
        };

        return true;
    };
    inheritKlass( GObject, this.Objeto );

    return true;
}

var NS_Objeto = new _Objeto();

/**
 * Key objeto.
 * @param {Array} args Key objeto arguments
 * @return {Boolean} Always true
 */
_Objeto.prototype.Key = function( args ) {
    NS_Objeto.Objeto.call( this, args );
    this[ NS_Common.Flag.USE ] = true;
    this[ NS_Common.Flag.TAKE ] = true;
    this[ NS_Common.Flag.DROP ] = true;
};
inheritKlass( NS_Objeto.Objeto, _Objeto.prototype.Key );

_Objeto.prototype.Wall = function( args ) {
    NS_Objeto.Objeto.call( this, args );
    this[ NS_Common.Flag.SOLID ] = true;
};
inheritKlass( NS_Objeto.Objeto, _Objeto.prototype.Wall );
