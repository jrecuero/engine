//
// ----- TEST METHODS -----
//

function test_battle_handler() {
    var that = this;
    var jose;
    var goblin;

    var actionButton;
    var targetSelect;

    var createMainScene = function() {
        var scene = new NS_Scene.Scene( "main-scene", 5, 5 );
        NS_GEngine.addElement( NS_GEngine.Subject.SCENE, scene );
    };

    var createActors = function() {
        jose = new NS_Actor.Player( [ "joshua" ] );
        jose.attributes = new Attrs( 100, 50, 5 );

        goblin = new NS_Actor.Actor( [ "goblin" ] );
        goblin.attributes = new Attrs( 80, 8, 1);
        goblin.playableSide = NS_Common.PlaySide.ENEMY;

        var actionCreateActors = NS_Action.createAction();
        actionCreateActors.name = "create actors";
        actionCreateActors.type = NS_Action.Type.ACTOR;
        actionCreateActors.execCb.cb = function( args ) {
            NS_GEngine.addElements( "actor", [ jose, goblin ] );
        };
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                               actionCreateActors ).active = true;
    };

    var createButtons = function() {
        jose.ui.action.onclick = that.on_action;
        jose.createWidgets();
        targetSelect = NS_UI.select.create();
    };

    this.on_action = function() {
        var actionBattle = NS_Action.battle( [ jose, goblin ]);
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
    };

    window.onload = function() {
        createActors();
        createButtons();
    };

    var removeAllTargets = function() {
        for ( var i in targetSelect ) {
            targetSelect.remove( 0 );
        }
    };

    NS_BattleHandler.customUserSetUp = function() {
        removeAllTargets();
        var enemies = NS_BattleHandler.getEnemyActors();
        for ( var i in enemies ) {
            var enemy = enemies[ i ];
            NS_UI.select.append( targetSelect, enemy.name, enemy );
        }
    };

    NS_BattleHandler.customSetUserAction = function() {
        return ( new NS_Action.attack() );
    };

    NS_BattleHandler.customSetUserTarget = function() {
        var index = targetSelect.selectedIndex;
        return targetSelect[ index ].handler;
    };

    NS_BattleHandler.customAiSetUp = function() {
        removeAllTargets();
        var players = NS_BattleHandler.getPlayerActors();
        for ( var i in players ) {
            var player = players[ i ];
            NS_UI.select.append( targetSelect, player.name, player );
        }
    };

    NS_BattleHandler.customSetAiAction = function() {
        return ( new NS_Action.attack() );
    };

    NS_BattleHandler.customSetAiTarget = function() {
        var index = targetSelect.selectedIndex;
        return targetSelect[ index ].handler;
    };

    NS_BattleHandler.customBattleTearDown = function() {
        removeAllTargets();
    };

    createMainScene();
    NS_GEngine.start();
}

var testBattleHandler = new test_battle_handler();

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
                                       NS_Common.EntityType.ACTOR );
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
                                       NS_Common.EntityType.OBJETO );
        NS_GEngine.addElement( NS_GEngine.Subject.SCENE, mainScene );
    };

    var testLog = function( message ) {
        NS_UI.textarea.append( logBox, message );
    };

    var createActors = function() {

        // Jose = new NS_Actor.Player( [ "jose" ] );
        jose.attributes = new Attrs( 100, 50, 5 );

        goblin1 = new NS_Actor.Actor( [ "goblin1" ] );
        goblin1.attributes = new Attrs( 80, 8, 1 );
        goblin1.playableSide = NS_Common.PlaySide.ENEMY;
        mainScene.createObjetoInScene( goblin1,
                                       mainScene.getCellAt( 0, 0 ),
                                       NS_Common.EntityType.ACTOR );

        goblin2 = new NS_Actor.Actor( [ "goblin2" ] );
        goblin2.attributes = new Attrs( 80, 8, 1 );
        goblin2.playableSide = ENEMY;
        mainScene.createObjetoInScene( goblin2,
                                       mainScene.getCellAt( 0, 0 ),
                                       NS_Common.EntityType.ACTOR );

        var eventCreateActors = NS_Action.createAction();
        eventCreateActors.name = "create actors";
        eventCreateActors.type = NS_Action.Type.ACTOR;
        eventCreateActors.execCb.cb =  function( args ) {
            if ( battleCount === MAX_BATTLE_COUNT ) {
                NS_GEngine.addElements( "actor", [ jose ] );
            } else {
                NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
            }
            return true;
        };
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, eventCreateActors ).active = true;
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
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
    };

    var removeAllTargets = function() {
        for ( var i in targetS ) {
            targetS.remove( 0 );
        }
    };

    this.on_move = function() {
        userSteps++;
        if ( userSteps <= STEPS_TO_BATTLE ) {
            NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                                   new NS_Action.move( userSteps ) ).active = true;
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
                NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                                       new NS_Action.attack() ).active = true;
                break;
            case NS_Battle.state.IN_BATTLE_END:
                testLog( "Battle has ended" );
                break;
            default:
                break;
        }
    };

    this.on_use = function() {
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                               new NS_Action.use( "object" ) ).active = true;
    };

    this.on_take = function() {
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                               new NS_Action.take( "object" ) ).active = true;
    };

    this.on_drop = function() {
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                               new NS_Action.drop( "object" ) ).active = true;
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
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
                               new NS_Action.attack() ).active = true;
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
}

// var twoGoblinBattle = new test_event_two_goblin_battle();
