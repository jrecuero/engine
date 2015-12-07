//
// ----- TEST METHODS -----
//

function test_event_two_goblin_battle() {
    var that = this;
    var jose;
    var goblin1;
    var goblin2;
    var STEPS_TO_BATTLE = 3;
    var userSteps = 0;
    var MAX_BATTLE_COUNT = 1;
    var battleCount = 0;

    var moveB;
    var actionB;
    var useB;
    var takeB;
    var dropB;
    var targetS;
    var logBox;

    var createButtons = function() {
        moveB  = NS_UI.button( "move", that.on_move );
        actionB = NS_UI.button( "action", that.on_action );
        useB = NS_UI.button( "use", that.on_use );
        takeB = NS_UI.button( "take", that.on_take );
        dropB = NS_UI.button( "drop", that.on_drop );
        targetS = NS_UI.select();
        logBox = NS_UI.textarea.create( 20, 40 );
    };

    var testLog = function( message ) {
        NS_UI.textarea.append( logBox, message );
    };

    var createActors = function() {
        jose = new NS_Actor.Actor( [ "jose" ] );
        jose.attributes = new Attrs( 100, 50, 5 );

        goblin1 = new NS_Actor.Actor( [ "goblin1" ] );
        goblin1.attributes = new Attrs( 80, 8, 1 );
        goblin1.playableSide = ENEMY;

        goblin2 = new NS_Actor.Actor( [ "goblin2" ] );
        goblin2.attributes = new Attrs( 80, 8, 1 );
        goblin2.playableSide = ENEMY;

        var eventCreateActors = NS_Action.createAction();
        eventCreateActors.name = "create actors";
        eventCreateActors.type = "actor";
        eventCreateActors.execCb.cb =  function( args ) {
            if ( battleCount === MAX_BATTLE_COUNT ) {
                NS_GEngine.addElements( "actor", [ jose ] );
            } else {
                NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
            }
            return true;
        };
        NS_GEngine.addElement( "action", eventCreateActors ).active = true;
    };

    var createBattle = function() {
        var actionBattle = NS_Action.battle();
        actionBattle.passCb.cb = function() {
            battleCount++;
            return true;
        };
        actionBattle.errorCb.cb = function() {
            testLog( "goblins are already dead." );
            userStep = 0;
            removeAllTargets();
            NS_GEngine.delElements( "actor", [ jose ] );
            actionB.disabled = true;
            moveB.disabled = false;
            return true;
        };
        NS_GEngine.addElement( "action", actionBattle ).active = true;
    };

    var removeAllTargets = function() {
        for ( var i in targetS ) {
            targetS.remove( 0 );
        }
    };

    this.on_move = function() {
        userSteps++;
        if ( userSteps <= STEPS_TO_BATTLE ) {
            NS_GEngine.addElement( "action", new NS_Action.move( userSteps ) ).active = true;
        } else {
            testLog( "Battle Start!" );
            userSteps = 0;
            actionB.disabled = false;
            moveB.disabled = true;
            createActors();
            createBattle();
        }
    };

    this.on_action = function() {
        var state = NS_GEngine.state.get();
        switch ( state ) {
            case NS_GEngine.state.NONE:
                break;
            case NS_GEngine.state.IN_BATTLE_WAITING_INPUT:
                NS_GEngine.state.next();
                NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
                break;
            case NS_GEngine.state.IN_BATTLE_END:
                testLog( "Battle has ended" );
                break;
            default:
                break;
        }
    };

    this.on_use = function() {
        NS_GEngine.addElement( "action", new NS_Action.use( "object" ) ).active = true;
    };

    this.on_take = function() {
        NS_GEngine.addElement( "action", new NS_Action.take( "object" ) ).active = true;
    };

    this.on_drop = function() {
        NS_GEngine.addElement( "action", new NS_Action.drop( "object" ) ).active = true;
    };

    NS_GEngine.customAvailableTarget = function() {
        removeAllTargets();
        var opt;
        var i;
        if ( jose.turn ) {
            var enemies = NS_GEngine.battle.enemyActors();
            for ( i in enemies ) {
                opt = document.createElement( "option" );
                var enemy = enemies[ i ];
                opt.value = enemy.name;
                opt.innerHTML = enemy.name;
                opt.theTarget = enemy;
                targetS.appendChild( opt );
            }
        } else {
            var players = NS_GEngine.battle.playerActors();
            for ( i in players ) {
                opt = document.createElement( "option" );
                var player = players[ i ];
                opt.value = player.name;
                opt.innerHTML = player.name;
                opt.theTarget = player;
                targetS.appendChild( opt );
            }
        }
    };

    NS_GEngine.customSelectNextTarget = function() {
        var index = targetS.selectedIndex;
        return targetS[ index ].theTarget;
    };

    NS_GEngine.customSelectNextAiAction = function() {
        NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
    };

    NS_GEngine.customAfterBattle = function() {
        actionB.disabled = true;
        moveB.disabled = false;
        removeAllTargets();
        NS_GEngine.delElements( "actor", [ jose, goblin1, goblin2 ] );
    };

    window.onload = function() {
        createButtons();
        actionB.disabled = true;
    };

    NS_GEngine.start();
    NS_GEngine.log = testLog;
    NS_Action.log = testLog;
}

var twoGoblinBattle = new test_event_two_goblin_battle();

