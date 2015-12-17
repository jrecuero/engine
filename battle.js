function _Battle() {
    /**
     * Keep a copy for the object instance.
     * @type {_Battle}
     */
    var __that = this;

    /**
     * Engine state attribute.
     * @type {String}
     */
    this.state = {
        IN_BATTLE: "in battle",
        IN_BATTLE_WAITING_INPUT: "battle waiting input",
        IN_BATTLE_RUN_INPUT: "battle run imput",
        IN_BATTLE_WAITING_AI: "battle waiting ai",
        IN_BATTLE_RUN_AI: "battle run ai",
        IN_BATTLE_END: "battle end",
        WAITING: "waiting",
        NONE: "none",

        value: undefined,

        set: function( val ) {
            this.value = val;
        },

        get: function() {
            return this.value;
        },

        reset: function() {
            this.set( this.NONE );
        },

        next: function() {
            switch ( this.value ) {
                case this.IN_BATTLE:
                    this.set( this.IN_BATTLE_WAITING_INPUT );
                    break;
                case this.IN_BATTLE_WAITING_INPUT:
                    this.set( this.IN_BATTLE_RUN_INPUT );
                    break;
                case this.IN_BATTLE_RUN_INPUT:
                    this.set( this.IN_BATTLE_WAITING_AI );
                    break;
                case this.IN_BATTLE_WAITING_AI:
                    this.set( this.IN_BATTLE_RUN_AI );
                    break;
                case this.IN_BATTLE_RUN_AI:
                    this.set( this.IN_BATTLE_END );
                    break;
                case this.IN_BATTLE_END:
                    this.set( this.NONE );
                    break;
                default:
                    break;
            }
            return this.get();
        }
    };

    /**
     * Battle attributes defining who is the battle originator and who are the
     * targets.
     * @type {Object}
     */
    this.battle = {
        active: false,
        turn: undefined,
        originator: undefined,
        target: undefined,
        actors: undefined,
        userif: {},

        /**
         * Returns Array with actors for the given playable side.
         * @param  {Array} actors Array with all actors in battle
         * @param  {String} playableSide Playable side to select actors
         * @return {Array} Array with actor from given playable side
         */
        getActors: function( actors, playableSide ) {
            var result = [];
            for ( var i in actors ) {
                var actor = actors[ i ];
                if ( actor.playableSide == playableSide ) {
                    result.push( actor );
                }
            }
            return result;
        },
        /**
         * Returns Array with enemy actors.
         * @param  {Array} actors Array with all actors in battle
         * @return {Array} Array with enemy actors
         */
        enemyActors: function( actors ) {
            return this.getActors( actors, NS_Common.PlaySide.ENEMY );
        },
        /**
         * Returns Array with player actors.
         * @param  {Array} actors Array with all actors in battle
         * @return {Array} Array with player actors
         */
        playerActors: function( actors ) {
            return this.getActors( actors, NS_Common.PlaySide.PLAYER );
        }
    };

    /**
     * Select the next target for the turn.
     * @type {Function}
     */
    this.customSelectNextTarget = undefined;

    /**
     * Selecte the next AI action for the turn
     * @type {Function}
     */
    this.customSelectNextAiAction = undefined;

    /**
     * Custom actions to do after battle has ended.
     * @type {Function}
     */
    this.customAfterBattle = undefined;

    /**
     * Custom action that display all available targets.
     * @type {Function}
     */
    this.customAvailableTarget = undefined;

   /**
     * Standard battle attack.
     * @return {undefined} Nothing
     */
    this.battleAttack = function() {
        this.battle.originator.damage( this.battle.target );
    };

        /**
     * Set the next originator from the battle actors.
     * @return {undefined} Nothing
     */
    this.nextOriginator = function() {
        actor = this.battle.actors.shift();
        actor.turn = true;
        this.battle.originator = actor;
        this.battle.turn = this.battle.originator.playableSide;
    };

    /**
     * Set the next target for the the turn.
     * @return {undefined} Nothing
     */
    this.nextTarget = function() {
        var target = this.customSelectNextTarget();
        this.battle.target = target;
    };

    /**
     * Set engine state based on the battle turn (next originator actor side).
     * @return {undefined} Nothing
     */
    this.setStateByBattleTurnPlayableSide = function() {
        if ( this.battle.turn === NS_Common.PlaySide.PLAYER ) {
            this.state.set( this.state.IN_BATTLE_WAITING_INPUT );
        } else {
            this.state.set( this.state.IN_BATTLE_WAITING_AI );
        }
    };

    /**
     * Initialize the battle engine.
     * @return {undefined} Nothing
     */
    this.initBattle = function( actors ) {
        this.battle.actors = [];
        if ( actors.length <= 1 ) {
            getEngine().error( "Not enough actors for battle: " + actors.length );
            return false;
        }
        for ( var i in actors ) {
            this.battle.actors.push( actors[ i ] );
        }
        this.battle.active = true;
        this.nextOriginator();
        this.customAvailableTarget();
        this.setStateByBattleTurnPlayableSide();
        return true;
    };

    /**
     * Set the next originator for the turn.
     * @return {undefined} Nothing
     */
    this.nextActor = function() {
        this.battle.originator.turn = false;
        this.battle.actors.push( this.battle.originator );
        this.nextOriginator();
        this.setStateByBattleTurnPlayableSide();
    };

    /**
     * Console log information with battle action results.
     * @return {undefined} Nothing
     */
    this.logBattleRunResultTurn = function() {
        var originator = this.battle.originator;
        var target = this.battle.target;
        getEngine().log( originator.name + " attack " + target.name +
                  "[" + target.attributes.life + "]" );
    };

    /**
     * Run turn results.
     * @return {undefined} Nothing
     */
    this.execBattleRunResultTurn = function() {

        // Find all actors that are not alive and delete then form the table
        // of active battlers.
        var toDelete = this.battle.actors.filter( function( x ) {
            return !x.isAlive();
        } );
        NS_Common.deleteWith( this.battle.actors, toDelete );

        if ( this.battle.actors.length > 0 ) {
            this.nextActor();
            this.customAvailableTarget();
        } else {
            var actor = this.battle.originator;
            getEngine().log( actor.name + " won the battle" );
            this.state.set( this.state.IN_BATTLE_END );
        }
    };

    /**
     * Run battle turn.
     * @return {undefined} Nothing
     */
    this.execBattleRunTurn = function() {
        this.nextTarget();
        getEngine().runActionsTurn();
        this.logBattleRunResultTurn();
        this.execBattleRunResultTurn();
    };

    /**
     * Run battle engine machine.
     * @return {undefined} Nothing
     */
    this.runBattle = function() {
        switch ( this.state.get() ) {
            case this.state.IN_BATTLE:
                break;
            case this.state.IN_BATTLE_WAITING_INPUT:
                break;
            case this.state.IN_BATTLE_RUN_INPUT:
                this.execBattleRunTurn();
                break;
            case this.state.IN_BATTLE_WAITING_AI:
                this.customSelectNextAiAction();
                this.state.next();
                break;
            case this.state.IN_BATTLE_RUN_AI:
                this.execBattleRunTurn();
                break;
            case this.state.IN_BATTLE_END:
                this.customAfterBattle();
                this.battle.active = false;
                break;
            default:
                break;
        }
    };
}

var NS_Battle = new _Battle();
