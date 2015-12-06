/**
 * @file Contains all Evento related classes.
 * @author Jose Carlos Recuero
 * @version 1.0
 * @copyright Jose Carlos Recuero 2015
 */

/**
 * Evento NameSpace.
 * @namespace
 * @see {@link Action}
 * @requires common.js
 * @requires action.js
 */
function _Evento() {
    /**
     * Keep a copy for the object instance.
     * @access private
     * @type {_Evento}
     */
    var that = this;

    /**
     * Game engine instance
     * @access private
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
     * Evento class for any event used in the game.
     * @class
     * @augments GObject
     * @param {Array} args Arguments required for the construtor
     * @return {Boolean} Always true
     */
    this.Evento = function( args ) {
        GObject.apply( this, args );

        /**
         * Evento instance to be used by any method.
         * @type {_Objeto}
         */
        var that = this;

        /**
         * Page class to be used per evento.
         * @type {Object}
         */
        var Page = { actions: [], conditions: [], enable: true };

        /**
         * Create a new page in the event.
         * @return {Page} New page created
         */
        var __createPage = function() {
            return Object.create( Page );
        };

        /**
         * Evento pages.
         * @type {Array}
         */
        var __pages = [];

        /**
         * Validate page is a valid page inside the __pages array.
         * @param  {Integer} page_i Page number to be validated
         * @return {Integer} Page numnber if valid, undefined else
         */
        var __validatePage = function( page_i ) {
            page_i = page_i !== undefined ? page_i : 0;
            if ( page_i < __pages.length ) {
                return page_i;
            }
            return NaN;
        };

        /**
         * Add a new page to the evento.
         * @function
         * @return {Integer} Index for the new page created
         */
        this.addPage = function() {
            __pages.push( __createPage() );
            return ( __pages.length - 1 );
        };

        /**
         * Enable the given page in the evento.
         * @param  {Integer} page_i Page number to be enabled
         * @return {Boolean} true if page is valid, false else
         */
        this.enablePage = function( page_i ) {
            page_i = __validatePage( page_i );
            if ( !isNaN( page_i ) ) {
                __pages[ page_i ].enable = true;
                return true;
            }
            return false;

        };

        /**
         * Disable the given page in the evento.
         * @param  {Integer} page_i Page number to be disabled
         * @return {Boolean} true if page is valid, false else
         */
        this.disablePage = function( page_i ) {
            page_i = __validatePage( page_i );
            if ( !isNaN( page_i ) ) {
                __pages[ page_i ].enable = false;
                return true;
            }
            return false;
        };

        /**
         * Add new action to an evento page
         * @param {Object} condition Condition instance
         * @param {Integer} page_i Page number for the page to be used
         * @return {Boolean} true if condition was added, false else
         */
        this.addCondition = function( condition, page_i ) {
            page_i = __validatePage( page_i );
            if ( !isNaN( page_i ) ) {
                var page = __pages[ page_i ].conditions;
                page.push( condition );
                return true;
            }
            return false;
        };

        /**
         * Run a particular evento page condition.
         * @param  {Object} condition Condition instance
         * @return {Boolean} true if condition success, false else
         */
        var __runCondition = function( condition ) {
            return true;
        };

        /**
         * Run all evento page conditions for a given page.
         * @param  {Integer} page_i Page number to run all conditions.
         * @return {Boolean} true if all conditions success, false else
         */
        var __runAllConditions = function( page_i ) {
            var result = true;
            var conditions = __pages[ page_i ].conditions;
            for ( var cond in conditions ) {
                result &= __runCondition( conditions[ cond ] );
            }
            return result;
        };

        /**
         * Validate page is a valid page for running.
         * @param  {Integer} page_i Page number to be validated
         * @return {Integer} Page numnber if valid, undefined else
         */
        var __validatePageForRun = function( page_i ) {
            page_i = __validatePage( page_i );
            if ( isNan( page_i ) ) {
                return NaN;
            } else {
                if ( __runAllConditions( page_i ) ) {
                    return page_i;
                }
                return NaN;
            }
        };

        /**
         * Check if page can be run or not.
         * @param  {Integer} page_i Page number to be checked
         * @return {Boolean} true if page can be run, false else
         */
        var __canRunPage = function( page_i ) {
            if ( !isNaN( __validatePage( page_i ) ) ) {
                return __pages[ page_i ].enable;
            }
            return false;
        };

        /**
         * Get all evento pages.
         * @function
         * @return {Array} Array with all pages
         */
        this.getPages = function() {
            return __pages;
        };

        /**
         * Get the page given by the number provided.
         * @param  {Integer} page_i Page number for the page to be retrieved
         * @return {Page} Page instance, undefined if page not found
         */
        this.getPage = function( page_i ) {
            if ( !isNaN( __validatePage( page_i ) ) ) {
                return __pages[ page_i ];
            }
            return undefined;
        };

        /**
         * Add an action to the event
         * @param {_Action} action Event action.
         * @param {Integer} page_i where action will be added (default = 0)
         * @return {Boolean} true if action was added properly, false else
         */
        this.addAction = function( action, page_i ) {
            page_i = __validatePage( page_i );
            if ( isNaN( page_i ) ) {
                return false;
            } else {
                if ( __pages.length === 0 ) {
                    page_i = this.addPage();
                }
                __pages[ page_i ].actions.push( action );
                return true;
            }
        };

        /**
         * Run all even actions.
         * @param {Array} Array of pages where actions will be executed
         * @return {Boolean} true if all actions were added properly, false
         * else
         */
        this.runAllActions = function( pages ) {
            pages = pages ? pages !== undefined : [ 0 ];
            for ( var p in pages ) {
                if ( __canRunPage( p ) ) {
                    var page = __pages[ p ];
                    for ( var i = 0; i < page.actions.length; i++ ) {
                        var action = page.actions[ i ];
                        var result = action.execute.call( action );
                        if ( result && action ) {
                             action.processing.call( this, result );
                        }
                    }
                }
            }
            return true;
        };

        /**
         * Run even single actions.
         * @param {Integer} page_i Page where action will be executed (default = 0)
         * @return {Boolean} Always true
         */
        this.runAction = function( page_i ) {
            if ( __canRunPage( page_i ) && __pages[ page_i ].actions.length ) {
                var action = __pages[ page_i ].actions.shift();
                NS_Evento.engine.addElement( "action", action ).active = true;
                setTimeout( that.runAction, 1 );
            }
            return true;
        };

        return true;
    };
    inheritKlass( GObject, this.Evento );

    return true;
}

var NS_Evento = new _Evento();
