function _BattleHandler() {
    /**
     * Keep a copy for the object instance.
     * @type {_BattleHandler}
     */
    var __that = this;

    this.State = {
        NONE: "none",
        IN_SET_UP: "battle setup state",
        IN_USER_SET_UP: "battle user setup",
        IN_USER_WAIT_ACTION: "battle user waiting user action",
        IN_USER_SET_UP_ACTION: "battle user setup action",
        IN_USER_RUN_ACTION: "battle user running action",
        IN_USER_ACTION_RESULT: "battle user action results",
        IN_USER_TEAR_DOWN: "battle user tear down",
        IN_AI_SET_UP: "battle ai setup",
        IN_AI_WAIT_ACTION: "battle ai waiting ai action",
        IN_AI_SET_UP_ACTION: "battle ai setup action",
        IN_AI_RUN_ACTION: "battle ai running action",
        IN_AI_ACTION_RESULT: "battle ai action results",
        IN_AI_TEAR_DOWN: "battle ai tear down",
        IN_WAITING: "battle waiting state",
        IN_TEAR_DOWN: "battle tear down",
        IN_END: "battle end",

        __value: undefined,

        set: function( val ) {
            this.__value = val;
            return this.get();
        },

        get: function() {
            return this.__value;
        },

        reset: function() {
            this.set( this.NONE );
        },

        next: function() {
            switch( this.get() ) {
                case this.IN_SET_UP:
                    __that.nextStateByBattleTurnPlayableSide();
                    break;
                case this.IN_USER_SET_UP:
                    this.set( this.IN_USER_WAIT_ACTION );
                    break;
                case this.IN_USER_WAIT_ACTION:
                    this.set( this.IN_USER_SET_UP_ACTION );
                    break;
                case this.IN_USER_SET_UP_ACTION:
                    this.set( this.IN_USER_RUN_ACTION );
                    break;
                case this.IN_USER_RUN_ACTION:
                    this.set( this.IN_USER_ACTION_RESULT );
                    break;
                case this.IN_USER_ACTION_RESULT:
                    this.set( this.IN_USER_TEAR_DOWN );
                    break;
                case this.IN_USER_TEAR_DOWN:
                    this.set( this.IN_AI_SET_UP );
                    break;
                case this.IN_AI_SET_UP:
                    this.set( this.IN_AI_WAIT_ACTION );
                    break;
                case this.IN_AI_WAIT_ACTION:
                    this.set( this.IN_AI_SET_UP_ACTION );
                    break;
                case this.IN_AI_SET_UP_ACTION:
                    this.set( this.IN_AI_RUN_ACTION );
                    break;
                case this.IN_AI_RUN_ACTION:
                    this.set( this.IN_AI_ACTION_RESULT );
                    break;
                case this.IN_AI_ACTION_RESULT:
                    this.set( this.IN_AI_TEAR_DOWN );
                    break;
                case this.IN_AI_TEAR_DOWN:
                    this.set( this.IN_TEAR_DOWN );
                    break;
                case this.IN_TEAR_DOWN:
                    this.set( this.IN_END );
                    break;
                case this.IN_END:
                    this.set( this.NONE );
                    break;
                default:
                    break;
            }
            return this.get();
        },
    };

    this.actors = [];

    this.originator = undefined;

    this.originatorAction = undefined;

    this.target = [];

    this.turnSide = undefined;

    this.turnLimit = undefined;

    this.getActorsForSide = function( playable_side, actors ) {
        actors = actors !== undefined ? actors : this.actors;
        var result = [];
        for ( var i in actors ) {
            var actor = actors[ i ];
            if ( actor.playableSide === playable_side ) {
                result.push( actor );
            }
        }
        return result;
    };

    this.getEnemyActors = function( actors ) {
        return this.getActorsForSide( NS_Common.PlaySide.ENEMY, actors );
    };

    this.getPlayerActors = function( actors ) {
        return this.getActorsForSide( NS_Common.PlaySide.PLAYER, actors );
    };

    this.battleAttack = function() {
        this.originator.damage( this.target );
    };

    this.init = function( actors, turn_limit ) {
        this.turnLimit = turn_limit;
        if ( actors.length <= 1 ) {
            getEngine().error( "Not enough actors for battle: " + actors.length );
            return false;
        }
        this.actors = actors.slice();
        this.State.set( this.State.IN_SET_UP );
        this.stateMachine();
        return true;
    };

    this.findNextOriginator = function() {
        if ( this.actors.length > 1 ) {
            var actor = this.actors.shift();
            actor.turn = true;
            this.originator = actor;
            return true;
        } else {
            this.originator = undefined;
            return false
        }
    };

    this.nextStateByBattleTurnPlayableSide = function() {
        if ( this.originator === undefined ) {
            this.turnLimit = 0;
            this.State.set( this.State.IN_END );
        } else {
            this.turnSide = this.originator.playableSide;
            if ( this.turnSide === NS_Common.PlaySide.PLAYER ) {
                this.State.set( this.State.IN_USER_SET_UP );
            } else {
                this.State.set( this.State.IN_AI_SET_UP );
            }
        }
    };

    this.setUserSetUp = function() {
        this.customUserSetUp();
    };

    this.customUserSetUp = function() {};;

    this.setUserAction = function() {
        this.originatorAction = this.customSetUserAction();
    };

    this.customSetUserAction = undefined;

    this.setUserTarget = function() {
        this.target = this.customSetUserTarget();
    };

    this.customSetUserTarget = undefined;

    this.runOriginatorAction = function() {
        getEngine().addElement( NS_GEngine.Subject.ACTION,
                             this.originatorAction ).active = true;
        // TODO : This should run only battle actions.
        // getEngine().runActionsTurn();
    };

    this.runOriginatorActionResult = function() {
        this.logBattleActionResult();
        var toDelete = this.actors.filter( function( x ) {
            return !x.isAlive();
        } );
        NS_Common.deleteWith( this.actors, toDelete );
    };

    this.logBattleActionResult = function() {
        getEngine().log( "[" + this.originator.attributes.life + "] " +
                      this.originator.name + " attacked " +
                      "[" + this.target.attributes.life + "] " +
                      this.target.name );
    };

    this.nextStateByBattleActorQueue = function() {
        if ( this.actors.length === 0 ) {
            this.State.set( this.State.IN_TEAR_DOWN );
        } else {
            this.State.set( this.State.IN_SET_UP );
        }
    };

    this.pushOriginatorBack = function() {
        this.originator.turn = false;
        this.actors.push( this.originator );
    };

    this.userTearDown = function() {
        this.pushOriginatorBack();
    };

    this.setAiSetUp = function() {
        this.customAiSetUp();
    };

    this.customAiSetUp = function() {};


    this.setAiAction = function() {
        this.originatorAction = this.customSetAiAction();
    };

    this.customSetAiAction = undefined;

    this.setAiTarget = function() {
        this.target = this.customSetAiTarget();
    };

    this.customSetAiTarget = undefined;

    this.aiTearDown = function() {
        this.pushOriginatorBack();
    };

    this.tearDown = function() {
        if ( ( this.turnLimit !== undefined ) && ( this.turnLimit > 0 ) ) {
            this.turnLimit--;
        }
        if ( this.turnLimit === 0 ) {
            this.State.next();
        } else {
            this.State.set( this.State.IN_SET_UP );
        }

        this.customBattleTearDown();
    };

    this.customBattleTearDown = function() {};

    this.battleEnd = function() {
        this.customBattleEnd();
    };

    this.customBattleEnd = function() {};

    this.stateMachine = function() {
        switch( this.State.get() ) {
            case this.State.IN_SET_UP:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.findNextOriginator();
                this.nextStateByBattleTurnPlayableSide( );
                break;
            case this.State.IN_USER_SET_UP:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.setUserSetUp();
                this.State.next();
                break;
            case this.State.IN_USER_WAIT_ACTION:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                // TODO : Provisional, action should be selected by the user.
                this.State.next();
                break;
            case this.State.IN_USER_SET_UP_ACTION:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.setUserAction();
                this.setUserTarget();
                this.State.next();
                break;
            case this.State.IN_USER_RUN_ACTION:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.runOriginatorAction();
                this.State.next();
                break;
            case this.State.IN_USER_ACTION_RESULT:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.runOriginatorActionResult();
                this.State.next();
                break;
            case this.State.IN_USER_TEAR_DOWN:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.userTearDown();
                this.nextStateByBattleActorQueue();
                break;
            case this.State.IN_AI_SET_UP:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.setAiSetUp();
                this.State.next();
                break;
            case this.State.IN_AI_WAIT_ACTION:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.State.next();
                break;
            case this.State.IN_AI_SET_UP_ACTION:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.setAiAction();
                this.setAiTarget();
                this.State.next();
                break;
            case this.State.IN_AI_RUN_ACTION:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.runOriginatorAction();
                this.State.next();
                break;
            case this.State.IN_AI_ACTION_RESULT:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.runOriginatorActionResult();
                this.State.next();
                break;
            case this.State.IN_AI_TEAR_DOWN:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.aiTearDown();
                this.nextStateByBattleActorQueue();
                break;
            case this.State.IN_TEAR_DOWN:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.tearDown();
                this.State.next();
                break;
            case this.State.IN_END:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                this.battleEnd();
                break;
            default:
                getEngine().debug( "BattleHandler state: " + this.State.get() );
                return;
        }
        var restate = NS_Action.createAction();
        restate.name = "re-schedule state machine";
        restate.type = NS_Action.Type.BATTLE;
        restate.execCb.cb = function() {
            __that.stateMachine();
        };
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, restate ).active = true;
    };

    return true;
}

var NS_BattleHandler = new _BattleHandler();