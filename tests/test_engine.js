//
// ----- TEST METHODS -----
//

// /**
//  * Test Battle Handler Module.
//  * - Battle takes only one turn.
//  */
// function test_battle_handler() {
//     var that = this;
//     var jose;
//     var goblin;

//     Var actionButton;
//     var targetSelect;

//     Var createMainScene = function() {
//         var scene = new NS_Scene.Scene( "main-scene", 5, 5 );
//         NS_GEngine.addElement( NS_GEngine.Subject.SCENE, scene );
//     };

//     Var createActors = function() {
//         jose = new NS_Actor.Player( [ "joshua" ] );
//         jose.attributes = new Attrs( 100, 50, 5 );

//         Goblin = new NS_Actor.Actor( [ "goblin" ] );
//         goblin.attributes = new Attrs( 80, 8, 1 );
//         goblin.playableSide = NS_Common.PlaySide.ENEMY;

//         Var actionCreateActors = NS_Action.createAction();
//         actionCreateActors.name = "create actors";
//         actionCreateActors.type = NS_Action.Type.ACTOR;
//         actionCreateActors.execCb.cb = function( args ) {
//             NS_GEngine.addElements( NS_GEngine.Subject.ACTOR, [ jose, goblin ] );
//         };
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                actionCreateActors ).active = true;
//     };

//     Var createButtons = function() {
//         jose.ui.action.onclick = that.on_action;
//         jose.createWidgets();
//         targetSelect = NS_UI.select.create();
//     };

//     This.on_action = function() {
//         var actionBattle = NS_Action.battle( [ jose, goblin ], 1 );
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
//     };

//     Window.onload = function() {
//         createActors();
//         createButtons();
//     };

//     Var removeAllTargets = function() {
//         for ( var i in targetSelect ) {
//             targetSelect.remove( 0 );
//         }
//     };

//     NS_BattleHandler.customUserSetUp = function() {
//         removeAllTargets();
//         var enemies = NS_BattleHandler.getEnemyActors();
//         for ( var i in enemies ) {
//             var enemy = enemies[ i ];
//             NS_UI.select.append( targetSelect, enemy.name, enemy );
//         }
//     };

//     NS_BattleHandler.customSetUserAction = function() {
//         return ( new NS_Action.attack() );
//     };

//     NS_BattleHandler.customSetUserTarget = function() {
//         var index = targetSelect.selectedIndex;
//         return targetSelect[ index ].handler;
//     };

//     NS_BattleHandler.customAiSetUp = function() {
//         removeAllTargets();
//         var players = NS_BattleHandler.getPlayerActors();
//         for ( var i in players ) {
//             var player = players[ i ];
//             NS_UI.select.append( targetSelect, player.name, player );
//         }
//     };

//     NS_BattleHandler.customSetAiAction = function() {
//         return ( new NS_Action.attack() );
//     };

//     NS_BattleHandler.customSetAiTarget = function() {
//         var index = targetSelect.selectedIndex;
//         return targetSelect[ index ].handler;
//     };

//     NS_BattleHandler.customBattleTearDown = function() {
//         removeAllTargets();
//     };

//     CreateMainScene();
//     NS_GEngine.start();
// }

// Var testBattleHandler = new test_battle_handler();

/**
 * Test Battle Scenario with ONE player and NBR of enemies.
 * - Battle takes as many turns as required until one playable side is left.
 * - Battle starts when player meets enemies on the scenario.
 * @param  {Integer} nbr Number of enemies
 */
function test_event_n_goblin_battle( nbr ) {
    var that = this;
    var mplayer;
    var goblins = new Array( nbr );
    var actors;

    var actionButton;
    var targetSelect;
    var logBox;

    var testLog = function( message ) {
        NS_UI.textarea.append( logBox, message );
    };

    var createMainScene = function() {
        var scene = new NS_Scene.Scene( "main-scene", 5, 5 );
        NS_GEngine.addElement( NS_GEngine.Subject.SCENE, scene );
    };

    var createActors = function() {
        mplayer = new NS_Actor.Player( [ "main player" ] );
        mplayer.attributes = new Attrs( 100, 50, 5 );

        actors = [ mplayer ];

        for ( var i = 0; i < nbr; i++ ) {
            goblins[ i ] = new NS_Actor.Actor( [ "goblin" + i ] );
            goblins[ i ].attributes = new Attrs( 80, 8, 1 );
            goblins[ i ].playableSide = NS_Common.PlaySide.ENEMY;
            actors.push( goblins[ i ] );
        }
        NS_GEngine.addElements( NS_GEngine.Subject.ACTOR, actors );
    };

    var createButtons = function() {
        mplayer.ui.action.onclick = that.on_action;
        mplayer.createWidgets();

        actionButton = mplayer.ui.action.widget;
        targetSelect = NS_UI.select.create();
        logBox = NS_UI.textarea.create( 20, 40 );
    };

    this.on_action = function() {
        var actionBattle = NS_Action.battle( actors );
        NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
    };

    window.onload = function() {
        createActors();
        createButtons();
        mplayer.ui.disablePanels.call( mplayer, [ "move", "action" ] );
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

    // Start Engine.
    createMainScene();
    NS_GEngine.start();
    NS_GEngine.log = testLog;
}

// Var testGoblinsBattle = new test_event_n_goblin_battle( 3 );

// /**
//  * Test Battle Sceneario with ONE player and TWO enemies.
//  */
// function test_event_two_goblin_battle() {
//     var that = this;
//     var jose;
//     var goblin1;
//     var goblin2;
//     var STEPS_TO_BATTLE = 3;
//     var userSteps = 0;
//     var MAX_BATTLE_COUNT = 1;
//     var battleCount = 0;
//     var mainScene;

//     Var moveB;
//     var actionB;
//     var useB;
//     var takeB;
//     var dropB;
//     var targetS;
//     var logBox;

//     Var createButtons = function() {

//         Jose = new NS_Actor.Player( [ "jose" ] );

//         // Jose.ui.forward.onclick = that.on_move;
//         jose.ui.action.onclick = that.on_action;
//         jose.ui.use.onclick = that.on_use;
//         jose.ui.take.onclick = that.on_take;
//         jose.ui.drop.onclick = that.on_drop;
//         jose.createWidgets();
//         mainScene.createObjetoInScene( jose,
//                                        mainScene.getCellAt( 2, 4 ),
//                                        NS_Common.EntityType.ACTOR );
//         targetS = NS_UI.select.create();
//         logBox = NS_UI.textarea.create( 20, 40 );

//         MoveB = jose.ui.forward.widget;
//         actionB = jose.ui.action.widget;
//         useB = jose.ui.use.widget;
//         takeB = jose.ui.take.widget;
//         dropB = jose.ui.drop.widget;
//     };

//     Var createMainScene = function() {
//         mainScene = new NS_Scene.Scene( "main-scene", 5, 5 );
//         var keyObj = new NS_Objeto.Objeto( [ "key" ] );
//         mainScene.createObjetoInScene( keyObj,
//                                        mainScene.getCellAt( 1, 1 ),
//                                        NS_Common.EntityType.OBJETO );
//         NS_GEngine.addElement( NS_GEngine.Subject.SCENE, mainScene );
//     };

//     Var testLog = function( message ) {
//         NS_UI.textarea.append( logBox, message );
//     };

//     Var createActors = function() {

//         // Jose = new NS_Actor.Player( [ "jose" ] );
//         jose.attributes = new Attrs( 100, 50, 5 );

//         Goblin1 = new NS_Actor.Actor( [ "goblin1" ] );
//         goblin1.attributes = new Attrs( 80, 8, 1 );
//         goblin1.playableSide = NS_Common.PlaySide.ENEMY;
//         mainScene.createObjetoInScene( goblin1,
//                                        mainScene.getCellAt( 0, 0 ),
//                                        NS_Common.EntityType.ACTOR );

//         Goblin2 = new NS_Actor.Actor( [ "goblin2" ] );
//         goblin2.attributes = new Attrs( 80, 8, 1 );
//         goblin2.playableSide = ENEMY;
//         mainScene.createObjetoInScene( goblin2,
//                                        mainScene.getCellAt( 0, 0 ),
//                                        NS_Common.EntityType.ACTOR );

//         Var eventCreateActors = NS_Action.createAction();
//         eventCreateActors.name = "create actors";
//         eventCreateActors.type = NS_Action.Type.ACTOR;
//         eventCreateActors.execCb.cb =  function( args ) {
//             if ( battleCount === MAX_BATTLE_COUNT ) {
//                 NS_GEngine.addElements( "actor", [ jose ] );
//             } else {
//                 NS_GEngine.addElements( "actor", [ jose, goblin1, goblin2 ] );
//             }
//             return true;
//         };
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION, eventCreateActors ).active = true;
//     };

//     Var createBattle = function() {
//         var actionBattle = NS_Action.battle();
//         actionBattle.passCb.cb = function() {
//             battleCount++;
//             return true;
//         };
//         actionBattle.errorCb.cb = function() {
//             testLog( "goblins are already dead." );
//             userStep = 0;
//             removeAllTargets();
//             NS_GEngine.delElements( "actor", [ jose ] );
//             actionB.disabled = true;
//             moveB.disabled = false;
//             return true;
//         };
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION, actionBattle ).active = true;
//     };

//     Var removeAllTargets = function() {
//         for ( var i in targetS ) {
//             targetS.remove( 0 );
//         }
//     };

//     This.on_move = function() {
//         userSteps++;
//         if ( userSteps <= STEPS_TO_BATTLE ) {
//             NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                    new NS_Action.move( userSteps ) ).active = true;
//         } else {
//             testLog( "Battle Start!" );
//             userSteps = 0;
//             actionB.disabled = false;
//             moveB.disabled = true;

//             // CreateActors();
//             createBattle();
//         }
//     };

//     This.on_action = function() {
//         var state = NS_Battle.state.get();
//         switch ( state ) {
//             case NS_Battle.state.NONE:
//                 break;
//             case NS_Battle.state.IN_BATTLE_WAITING_INPUT:
//                 NS_Battle.state.next();
//                 NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                        new NS_Action.attack() ).active = true;
//                 break;
//             case NS_Battle.state.IN_BATTLE_END:
//                 testLog( "Battle has ended" );
//                 break;
//             default:
//                 break;
//         }
//     };

//     This.on_use = function() {
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                new NS_Action.use( "object" ) ).active = true;
//     };

//     This.on_take = function() {
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                new NS_Action.take( "object" ) ).active = true;
//     };

//     This.on_drop = function() {
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                new NS_Action.drop( "object" ) ).active = true;
//     };

//     NS_Battle.customAvailableTarget = function() {
//         removeAllTargets();
//         var i;
//         if ( jose.turn ) {
//             var enemies = NS_Battle.battle.enemyActors( NS_GEngine.actors );
//             for ( i in enemies ) {
//                 var enemy = enemies[ i ];
//                 NS_UI.select.append( targetS, enemy.name, enemy );
//             }
//         } else {
//             var players = NS_Battle.battle.playerActors( NS_GEngine.actors );
//             for ( i in players ) {
//                 var player = players[ i ];
//                 NS_UI.select.append( targetS, player.name, player );
//             }
//         }
//     };

//     NS_Battle.customSelectNextTarget = function() {
//         var index = targetS.selectedIndex;
//         return targetS[ index ].handler;
//     };

//     NS_Battle.customSelectNextAiAction = function() {
//         NS_GEngine.addElement( NS_GEngine.Subject.ACTION,
//                                new NS_Action.attack() ).active = true;
//     };

//     NS_Battle.customAfterBattle = function() {
//         actionB.disabled = true;
//         moveB.disabled = false;
//         removeAllTargets();
//         NS_GEngine.delElements( "actor", [ jose, goblin1, goblin2 ] );
//     };

//     Window.onload = function() {
//         createButtons();
//         createActors();

//         // ActionB.disabled = true;
//     };

//     CreateMainScene();
//     NS_GEngine.start();
//     NS_GEngine.log = testLog;
// }

// // Var twoGoblinBattle = new test_event_two_goblin_battle();

function test_small_game_proto() {
    var that = this;
    var mplayer;
    var NBR_ENEMIES = 5;
    var enemies = new Array( NBR_ENEMIES );
    var NBR_OBJETOS = 5;
    var objetos = new Array( NBR_OBJETOS );
    var allActors;

    var mainScene;

    var targetSelect;
    var logBox;

    var testLog = function( message ) {
        NS_UI.textarea.append( logBox, message );
    };

    var createMainScene = function() {
        var scene = new NS_Scene.Scene( "main-scene", 10, 10 );
        getEngine().addElement( getEngine().Subject.SCENE, scene );
        getEngine().setScene( 0 );
    };

    var createActors = function() {
        mplayer = new NS_Actor.Player( [ "main player" ] );
        mplayer.attributes = new Attrs( 100, 50, 5 );
        allActors = [ mplayer ];

        for ( var i = 0; i < NBR_ENEMIES; i++ ) {
            enemies[ i ] = new NS_Actor.Enemy( [ "enemy" + i ] );
            enemies[ i ].attributes = new Attrs( 80, 8, 1 );
            allActors.push( enemies[ i ] );
        }
        getEngine().addElements( getEngine().Subject.ACTOR, allActors );
    };

    var createButtons = function() {
        getEngine().ui.action.onclick = that.on_action;
        getEngine().ui.createWidgets();
        targetSelect = NS_UI.select.create();
    };

    var createObjetos = function() {
        objetos[ 0 ] = new NS_Objeto.Key( [ "golden key" ] );
        for ( var i = 1; i < NBR_OBJETOS; i++ ) {
            objetos[ i ] = new NS_Objeto.Wall( [ "wall" + i ] );
        }
    };

    var placeObjetosInScenario = function() {
        var scene = getEngine().sceneHandler.scene;
        for ( var o in objetos ) {
            scene.createObjetoInScene( objetos[ o ],
                                        scene.getCellAt( 2, o ),
                                        NS_Common.EntityType.OBJETO );
        }
    };

    var placeActorsInScenario = function() {
        var scene = getEngine().sceneHandler.scene;
        scene.createObjetoInScene( mplayer,
                                   scene.getCellAt( 0, 0 ),
                                   NS_Common.EntityType.ACTOR );

        for ( var e in enemies ) {
            scene.createObjetoInScene( enemies[ e ],
                                       scene.getCellAt( 1, e ),
                                       NS_Common.EntityType.ACTOR );
        }
    };

    var removeAllTargets = function() {
        for ( var i in targetSelect ) {
            targetSelect.remove( 0 );
        }
    };

    var setupBattleHandler = function() {
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

        NS_BattleHandler.customUserTearDown = function() {
            getEngine().ui.action.widget.disabled = true;
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

        NS_BattleHandler.customAiTearDown = function() {
            getEngine().ui.action.widget.disabled = false;
        };

        NS_BattleHandler.customBattleTearDown = function() {
            removeAllTargets();
        };

        NS_BattleHandler.customBattleEnd = function() {
            getEngine().ui.up.widget.disabled = false;
            getEngine().ui.down.widget.disabled = false;
            getEngine().ui.left.widget.disabled = false;
            getEngine().ui.right.widget.disabled = false;
        };
    };

    this.on_action = function() {
        getEngine().battleHandler.State.next();
        getEngine().battleHandler.next();
    };

    window.onload = function() {
        that.start();
    };

    this.start = function() {
        createMainScene();
        createActors();
        createButtons();
        createObjetos();

        // Engine Setup
        // getEngine().log = testLog;
        NS_SceneHandler.init();
        NS_SceneHandler.scene = getEngine().playingScene;
        getEngine().sceneHandler = NS_SceneHandler;
        getEngine().battleHandler = NS_BattleHandler;
        getEngine().activeActor = mplayer;

        placeObjetosInScenario();
        placeActorsInScenario();

        setupBattleHandler();

        getEngine().ui.action.widget.disabled = true;

        getEngine().start();
    };
}

var testSmallGameProto = new test_small_game_proto();
