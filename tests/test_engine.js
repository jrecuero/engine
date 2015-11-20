//
// ----- TEST METHODS -----
//

var userSteps = 0;

function test_on_attack() {
    if ( NS_GEngine.state.get() === ST_IN_BATTLE_END ) {
        NS_UI.log( "Battle has ended" );
    } else {
        NS_GEngine.state.next();
        NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
    }
}

function test_on_move() {
    userSteps++;
    if ( userSteps <= 5 ) {
        NS_GEngine.addElement( "action", new NS_Action.move( userSteps ) ).active = true;
    } else {
        document.getElementById( "action" ).disabled = false;
        document.getElementById( "move" ).disabled = true;
        NS_GEngine.addElement( "action", new NS_Action.battle() ).active = true;
    }
}

function test_on_use() {
    NS_GEngine.addElement( "action", new NS_Action.use( "object", undefined, "yepes!" ) ).active = true;
}

function test_on_take() {
    NS_GEngine.addElement( "action", new NS_Action.take( "object" ) ).active = true;
}

function test_on_drop() {
    NS_GEngine.addElement( "action", new NS_Action.drop( "object" ) ).active = true;
}

function test_on_action() {
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
}

function test_on_defense() {
    defense.active = true;
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
    var e1 = new NS_Evento.Evento( [ "first evento" ] );
    e1.addStep( NS_Evento.setEventPrompt( "Name?" ) );
    e1.addStep( NS_Evento.setEventDialog( "Have a nice day" ) );
    e1.runAllSteps();
}

function test_on_engine() {
    var jose = new NS_Actor.Actor( [ "jose", NS_Common.createAttributes( 100, 50, 5 ), true, PLAYER ] );
    var goblin1 = new NS_Actor.Actor( [ "goblin1", NS_Common.createAttributes( 80, 8, 1 ), true, ENEMY ] );
    var goblin2 = new NS_Actor.Actor( [ "goblin2", NS_Common.createAttributes( 80, 8, 1 ), true, ENEMY ] );

    NS_GEngine.customAvailableTarget = function() {
        var targetSelect = document.getElementById( "target" );
        var targetLength = targetSelect.length;
        for ( var i = 0; i < targetLength; i++ ) {
            targetSelect.remove( 0 );
        }
        var opt;
        if ( jose.turn ) {
            var enemies = NS_GEngine.battle.enemyActors();
            for ( i = 0; i < enemies.length; i++ ) {
                opt = document.createElement( "option" );
                var enemy = enemies[ i ];
                opt.value = enemy.name;
                opt.innerHTML = enemy.name;
                opt.theTarget = enemy;
                targetSelect.appendChild( opt );
            }
        } else {
            var players = NS_GEngine.battle.playerActors();
            for ( i = 0; i < players.length; i++ ) {
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
        var targetSelect = document.getElementById( "target" );
        var index = targetSelect.selectedIndex;
        return targetSelect[ index ].theTarget;
    };

    NS_GEngine.customSelectNextAiAction = function() {
        NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
    };

    NS_GEngine.customAfterBattle = function() {
        document.getElementById( "action" ).disabled = true;
        document.getElementById( "move" ).disabled = false;
    };

    NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
    document.getElementById( "action" ).disabled = true;
}
