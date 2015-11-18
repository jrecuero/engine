// ----- TEST METHODS -----

function test_on_move() {
    move.active = true;
}

function test_on_attack() {
    if (NS_GEngine.status === ST_IN_BATTLE_END) {
        console.log('Battle has ended');
    } else {
        var attack = new NS_Action.attack();
        NS_GEngine.addElement( "action", attack );
        NS_GEngine.status = ST_IN_BATTLE_RUN_INPUT;
        attack.active = true;
    }
}

function test_on_defense() {
    defense.active = true;
}

function test_on_action() {
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

function test_on_actor() {
    var jose = new NS_Actor.Actor( [ "jose", NS_Common.createAttributes( 100, 50, 5 ) ] );
    var goblin1 = new NS_Actor.Actor( [ "goblin1", NS_Common.createAttributes( 80, 8, 1 ), true, ENEMY ] );
    var goblin2 = new NS_Actor.Actor( [ "goblin2", NS_Common.createAttributes( 80, 8, 1 ), true, ENEMY ] );
    NS_GEngine.selectNextTarget = function() {
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
        return undefined;
    };
    NS_GEngine.selectNextAiAction = function() {
        var attack = new NS_Action.attack();
        NS_GEngine.addElement( "action", attack );
        attack.active = true;
    };
    NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
    NS_GEngine.initBattle();
}
