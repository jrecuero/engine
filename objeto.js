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
            __attributes[attr] = value;
            return true;
        };

        /**
         * Get value for one given attribute.
         * @param  {String} attr Attribute name
         * @return {Object} Attribute value
         */
        this.getAttr = function ( attr ) {
            return __attributes[attr];
        };

        return true;
    };
    inheritKlass( GObject, this.Objeto );

    /**
     * Key objeto.
     * @param {Array} args Key objeto arguments
     * @return {Boolean} Always true
     */
    this.Key = function( args ) {
        that.Objeto.call( this, args );
        return true;
    };
    inheritKlass( this.Objeto, this.Key );

    return true;
}

var NS_Objeto = new _Objeto();
