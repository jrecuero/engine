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

    var createButtons = function() {
        moveB = document.createElement( "input" );
        moveB.type = "button";
        moveB.value = "move";
        moveB.onclick = that.on_move;
        document.body.appendChild( moveB );

        actionB = document.createElement( "input" );
        actionB.type = "button";
        actionB.value = "action";
        actionB.onclick = that.on_action;
        document.body.appendChild( actionB );

        useB = document.createElement( "input" );
        useB.type = "button";
        useB.value = "use";
        useB.onclick = that.on_use;
        document.body.appendChild( useB );

        takeB = document.createElement( "input" );
        takeB.type = "button";
        takeB.value = "take";
        takeB.onclick = that.on_take;
        document.body.appendChild( takeB );

        dropB = document.createElement( "input" );
        dropB.type = "button";
        dropB.value = "drop";
        dropB.onclick = that.on_drop;
        document.body.appendChild( dropB );

        targetS = document.createElement( "select" );
        document.body.appendChild( targetS );
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
            NS_UI.log( "Battle Start!" );
            userSteps = 0;
            actionB.disabled = false;
            moveB.disabled = true;
            jose = new NS_Actor.Actor( [ "jose", new Attrs( 100, 50, 5 ), true, PLAYER ] );
            goblin1 = new NS_Actor.Actor( [ "goblin1", new Attrs( 80, 8, 1 ), true, ENEMY ] );
            goblin2 = new NS_Actor.Actor( [ "goblin2", new Attrs( 80, 8, 1 ), true, ENEMY ] );

            var eventCreateActors = NS_Action.createAction();
            eventCreateActors.name = "create actors";
            eventCreateActors.type = "actor";
            eventCreateActors.execCb.args = [ "jose", "goblins" ];
            eventCreateActors.execCb.cb =  function( args ) {
                if ( battleCount === MAX_BATTLE_COUNT ) {
                    NS_GEngine.addElements( "actor", [ jose ] );
                } else {
                    NS_UI.log( "Create " + args[ 0 ] + ", " + args[ 1 ] );
                    NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
                }
                return true;
            };

            NS_GEngine.addElement( "action", eventCreateActors ).active = true;
            var actionBattle = NS_Action.battle();
            actionBattle.passCb.cb = function() {
                battleCount++;
                return true;
            };
            actionBattle.errorCb.cb = function() {
                NS_UI.log( "goblins are already dead." );
                userStep = 0;
                removeAllTargets();
                NS_GEngine.delElements( "actor", [ jose ] );
                actionB.disabled = true;
                moveB
       .disabled = false;
                return true;
            };
            NS_GEngine.addElement( "action", actionBattle ).active = true;
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
                NS_UI.log( "Battle has ended" );
                break;
            default:
                break;
        }
    };

    this.on_use = function() {
        NS_GEngine.addElement( "action", new NS_Action.use( "object", undefined, "yepes!" ) ).active = true;
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
}

var twoGoblinBattle = new test_event_two_goblin_battle();

