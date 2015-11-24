/**
 * Objecto NameSpace function.
 * @return {undefined} Nothing
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
         * @return {undefined} Nothing
         */
        this.usable = function() {
            this.active = true;
            this.enable = true;
        };

        /**
         * Set objeto as not usable.
         * @return {undefined} Nothing
         */
        this.noUsable = function() {
            this.active = false;
            this.enable = false;
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
         */
        this.setAttributes = function( attrs ) {
            __attributes = attrs;
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
         */
        this.setAttr = function( attr, value ) {
            __attributes[attr] = value;
        };

        /**
         * Get value for one given attribute.
         * @param  {String} attr Attribute name
         * @return {Object} Attribute value
         */
        this.getAttr = function ( attr ) {
            return __attributes[attr];
        };
    };
    inheritKlass( GObject, this.Objeto );

}

var NS_Objeto = new _Objeto();
