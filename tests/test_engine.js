// ----- TEST METHODS -----

var userSteps = 0;

function test_on_attack() {
    if (NS_GEngine.state.get() === ST_IN_BATTLE_END) {
        NS_UI.log('Battle has ended');
    } else {
        var attack = new NS_Action.attack();
        NS_GEngine.addElement( "action", attack );
        NS_GEngine.state.next();
        attack.active = true;
    }
}

function test_on_move() {
    userSteps++;
    var move = new NS_Action.move(userSteps);
    NS_GEngine.addElement("action", move);
    move.active = true;
    if (userSteps == 5) {
        var actionButton = document.getElementById( "action" );
        var moveButton = document.getElementById( "move" );
        actionButton.disabled = false;
        moveButton.disabled = true;
        NS_GEngine.initBattle();
    }
}

function test_on_use() {
    var use = new NS_Action.use('object');
    NS_GEngine.addElement("action", use);
    use.active = true;
}

function test_on_take() {
    var take = new NS_Action.take('object');
    NS_GEngine.addElement("action", take);
    take.active = true;
}

function test_on_drop() {
    var drop = new NS_Action.drop('object');
    NS_GEngine.addElement("action", drop);
    drop.active = true;
}

function test_on_action() {
    var state = NS_GEngine.state.get();
    switch(state) {
        case NS_GEngine.state.NONE:
            break;
        case NS_GEngine.state.IN_BATTLE_WAITING_INPUT:
            var attack = new NS_Action.attack();
            NS_GEngine.addElement( "action", attack );
            NS_GEngine.state.next();
            attack.active = true;
            break;
        case NS_GEngine.state.IN_BATTLE_END:
            NS_UI.log('Battle has ended');
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
    var jose = new NS_Actor.Actor( [ "jose", NS_Common.createAttributes( 100, 50, 5 ) ] );
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
        var attack = new NS_Action.attack();
        NS_GEngine.addElement( "action", attack );
        attack.active = true;
    };

    NS_GEngine.customAfterBattle = function() {
        var actionButton = document.getElementById( "action" );
        var moveButton = document.getElementById( "move" );
        actionButton.disabled = true;
        moveButton.disabled = false;
    };

    NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
    var actionButton = document.getElementById( "action" );
    actionButton.disabled = true;
}
