//
// ----- TEST METHODS -----
//

var STEPS_TO_BATTLE = 3;
var userSteps = 0;

function test_on_attack() {
    if ( NS_GEngine.state.get() === ST_IN_BATTLE_END ) {
        NS_UI.log( "Battle has ended" );
    } else {
        NS_GEngine.state.next();
        NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
    }
}

function test_on_multiple_actions() {
    var m1 = new NS_Action.move( 2 );
    var m2 = new NS_Action.move();
    var a = new NS_Action.attack();
    var d = new NS_Action.defense();
    NS_GEngine.addElements( "action", [ m1, m2, a, d ] );
    m1.active = true;
    m2.active = true;
    a.active = true;
    d.active = true;
}

function test_on_event() {
    var e = new NS_Evento.Evento( [ "multiple moves evento" ] );
    e.addAction( new NS_Action.move( 1 ) );
    e.addAction( new NS_Action.take( 'radio' ) );
    e.addAction( new NS_Action.move( 2 ) );
    e.addAction( new NS_Action.use( 'radio', undefined, 'fm' ) );
    e.addAction( new NS_Action.move( 3 ) );
    e.addAction( new NS_Action.drop( 'radio' ) );
    e.runAction();
}

function test_event_two_goblin_battle() {
    var jose;
    var goblin1;
    var goblin2;
    var targetSelect;

    var removeAllTargets = function() {
        targetSelect = document.getElementById( "target" );
        for ( var i in targetSelect ) {
            targetSelect.remove( 0 );
        }
    };

    this.on_move = function() {
        userSteps++;
        if ( userSteps <= STEPS_TO_BATTLE ) {
            NS_GEngine.addElement( "action", new NS_Action.move( userSteps ) ).active = true;
        } else {
            NS_UI.log("Battle Start!");
            userSteps = 0;
            document.getElementById( "action" ).disabled = false;
            document.getElementById( "move" ).disabled = true;
            jose = new NS_Actor.Actor( [ "jose", NS_Common.createAttributes( 100, 50, 5 ), true, PLAYER ] );
            goblin1 = new NS_Actor.Actor( [ "goblin1", NS_Common.createAttributes( 80, 8, 1 ), true, ENEMY ] );
            goblin2 = new NS_Actor.Actor( [ "goblin2", NS_Common.createAttributes( 80, 8, 1 ), true, ENEMY ] );
            var eventCreateActors = new NS_Action.Action( [ "create actors",
                                                            "actor",
                                                            function() {
                                                                NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
                                                                return true;
                                                            },
                                                            false,
                                                            true ] );
            // NS_GEngine.addElement( "action", eventCreateActors ).active = true;
            var actionBattle = new NS_Action.battle();
            actionBattle.errorCb = function() {
                NS_UI.log( 'error has been notified' );
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
                targetSelect.appendChild( opt );
            }
        } else {
            var players = NS_GEngine.battle.playerActors();
            for ( i in players ) {
                opt = document.createElement( "option" );
                var player = players[ i ];
                opt.value = player.name;
                opt.innerHTML = player.name;
                opt.theTarget = player;
                targetSelect.appendChild( opt );
            }
        }
    };

    NS_GEngine.customSelectNextTarget = function() {
        var index = targetSelect.selectedIndex;
        return targetSelect[ index ].theTarget;
    };

    NS_GEngine.customSelectNextAiAction = function() {
        NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
    };

    NS_GEngine.customAfterBattle = function() {
        document.getElementById( "action" ).disabled = true;
        document.getElementById( "move" ).disabled = false;
        removeAllTargets();
        NS_GEngine.delElements( "actor", [ jose, goblin1, goblin2 ] );
    };

    window.onload = function() {
        document.getElementById( "action" ).disabled = true;
    };
}


var twoGoblinBattle = new test_event_two_goblin_battle();
