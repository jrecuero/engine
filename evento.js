/**
 * Evento NameSpace function.
 * @return {Boolean} Always true
 */
function _Evento() {
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
     * Evento class for any event used in the game.
     * @param {Array} args Arguments required for the construtor
     * @return {Boolean} Always true
     */
    this.Evento = function( args ) {
        GObject.apply( this, args );
        this.actions = [];
        this.conditions = [];
        var __evento = this;

        /**
         * Evento schedule next action in the evento.
         * @type {Action}
         */
        this.actionScheduleNextAction =
            new NS_Action.Action( [ "evento schedule",
                                    "evento",
                                    function() {
                                        setTimeout( function() {
                                            __evento.runAction();
                                        }, 1 );
                                        return true;
                                    },
                                    undefined,
                                    false,
                                    true ] );

        /**
         * Add an action to the event
         * @param {_Action} action Event action.
         * @return {Boolean} true if action was added properly, false else
         */
        this.addAction = function( action ) {
            this.actions.push( action );
            return true;
        };

        /**
         * Run all even actions.
         * @return {Boolean} true if all actions were added properly, false
         * else
         */
        this.runAllActions = function() {
            for ( var i = 0; i < this.actions.length; i++ ) {
               var result = this.actions[ i ].execute.call( this.actions[ i ] );
               if ( result && this.actions[ i ] ) {
                    this.actions[ i ].processing.call( this, result );
               }
            }
            return true;
        };


        /**
         * Run even single actions.
         * @return {Boolean} Always true
         */
        this.runAction = function() {
            if (this.actions.length) {
                var action = this.actions.shift();
                NS_Evento.engine.addElement( "action", action ).active = true;
                NS_Evento.engine.addElement( "action", this.actionScheduleNextAction ).active = true;
            }
            return true;
        };

        return true;
    };
    inheritKlass( GObject, this.Evento );

    return true;
}

var NS_Evento = new _Evento();