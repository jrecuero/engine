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
    var mainScene;

    var moveB;
    var actionB;
    var useB;
    var takeB;
    var dropB;
    var targetS;
    var logBox;

    var createButtons = function() {

        jose = new NS_Actor.Player( [ "jose" ] );
        // jose.ui.forward.onclick = that.on_move;
        jose.ui.action.onclick = that.on_action;
        jose.ui.use.onclick = that.on_use;
        jose.ui.take.onclick = that.on_take;
        jose.ui.drop.onclick = that.on_drop;
        jose.createWidgets();
        mainScene.createObjetoInScene( jose,
                                       mainScene.getCellAt( 2, 4 ),
                                       NS_Common.entityType.ACTOR );
        targetS = NS_UI.select.create();
        logBox = NS_UI.textarea.create( 20, 40 );

        moveB = jose.ui.forward.widget;
        actionB = jose.ui.action.widget;
        useB = jose.ui.use.widget;
        takeB = jose.ui.take.widget;
        dropB = jose.ui.drop.widget;
    };

    var createMainScene = function() {
        mainScene = new NS_Scene.Scene( "main-scene", 5, 5 );
        var keyObj = new NS_Objeto.Objeto( [ 'key'] );
        mainScene.createObjetoInScene( keyObj,
                                       mainScene.getCellAt( 1, 1 ),
                                       NS_Common.entityType.OBJETO );
        NS_GEngine.addElement( "scene", mainScene );
    };

    var testLog = function( message ) {
        NS_UI.textarea.append( logBox, message );
    };

    var createActors = function() {

        // Jose = new NS_Actor.Player( [ "jose" ] );
        jose.attributes = new Attrs( 100, 50, 5 );

        goblin1 = new NS_Actor.Actor( [ "goblin1" ] );
        goblin1.attributes = new Attrs( 80, 8, 1 );
        goblin1.playableSide = ENEMY;
        mainScene.createObjetoInScene( goblin1,
                                       mainScene.getCellAt( 0, 0 ),
                                       NS_Common.entityType.ACTOR );

        goblin2 = new NS_Actor.Actor( [ "goblin2" ] );
        goblin2.attributes = new Attrs( 80, 8, 1 );
        goblin2.playableSide = ENEMY;
        mainScene.createObjetoInScene( goblin2,
                                       mainScene.getCellAt( 0, 0 ),
                                       NS_Common.entityType.ACTOR );

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
            // createActors();
            createBattle();
        }
    };

    this.on_action = function() {
        var state = NS_Battle.state.get();
        switch ( state ) {
            case NS_Battle.state.NONE:
                break;
            case NS_Battle.state.IN_BATTLE_WAITING_INPUT:
                NS_Battle.state.next();
                NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
                break;
            case NS_Battle.state.IN_BATTLE_END:
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

    NS_Battle.customAvailableTarget = function() {
        removeAllTargets();
        var i;
        if ( jose.turn ) {
            var enemies = NS_Battle.battle.enemyActors( NS_GEngine.actors );
            for ( i in enemies ) {
                var enemy = enemies[ i ];
                NS_UI.select.append( targetS, enemy.name, enemy );
            }
        } else {
            var players = NS_Battle.battle.playerActors( NS_GEngine.actors );
            for ( i in players ) {
                var player = players[ i ];
                NS_UI.select.append( targetS, player.name, player );
            }
        }
    };

    NS_Battle.customSelectNextTarget = function() {
        var index = targetS.selectedIndex;
        return targetS[ index ].handler;
    };

    NS_Battle.customSelectNextAiAction = function() {
        NS_GEngine.addElement( "action", new NS_Action.attack() ).active = true;
    };

    NS_Battle.customAfterBattle = function() {
        actionB.disabled = true;
        moveB.disabled = false;
        removeAllTargets();
        NS_GEngine.delElements( "actor", [ jose, goblin1, goblin2 ] );
    };

    window.onload = function() {
        createButtons();
        createActors();
        // actionB.disabled = true;
    };

    createMainScene();
    NS_GEngine.start();
    NS_GEngine.log = testLog;
    NS_Actor.setLog( testLog );
}

var twoGoblinBattle = new test_event_two_goblin_battle();
