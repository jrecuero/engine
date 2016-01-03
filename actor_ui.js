function _Actor_UI() {

    var __that = this;

    this.up = { widget: undefined, onclick: undefined, flag: undefined };
    this.down = { widget: undefined, onclick: undefined, flag: undefined };
    this.left = { widget: undefined, onclick: undefined, flag: undefined };
    this.right = { widget: undefined, onclick: undefined, flag: undefined };
    this.action = { widget: undefined, onclick: undefined, flag: undefined };
    this.use = { widget: undefined, onclick: undefined, flag: undefined };
    this.look = { widget: undefined, onclick: undefined, flag: undefined };
    this.take = { widget: undefined, onclick: undefined, flag: undefined };
    this.drop = { widget: undefined, onclick: undefined, flag: undefined };
    this.inventory = { widget: undefined, onclick: undefined, flag: undefined };

    this.panels = {};

    var __onMove = function( new_pos ) {
        var scene = getEngine().playingScene;
        var cell = scene.getCellAt( new_pos.x, new_pos.y );
        var actor = getEngine().activeActor;
        scene.replaceObjetoInScene( actor.objScene, cell );
        getEngine().debug( "move to " + new_pos.x + ", " + new_pos.y );
        var actionMove = new NS_Action.move( cell, "player" );
        getEngine().addElement( getEngine().Subject.ACTION, actionMove ).active = true;
    };

    var onMoveUp = function() {
        var actor = getEngine().activeActor;
        var newPos = getEngine().sceneHandler.move.up( actor.cell.x,
                                                       actor.cell.y );
        __onMove( newPos );
    };

    var onMoveDown = function() {
        var actor = getEngine().activeActor;
        var newPos = getEngine().sceneHandler.move.down( actor.cell.x,
                                                         actor.cell.y );
        __onMove( newPos );
    };

    var onMoveLeft = function() {
        var actor = getEngine().activeActor;
        var newPos = getEngine().sceneHandler.move.left( actor.cell.x,
                                                         actor.cell.y );
        __onMove( newPos );
    };

    var onMoveRight = function() {
        var actor = getEngine().activeActor;
        var newPos = getEngine().sceneHandler.move.right( actor.cell.x,
                                                          actor.cell.y );
        __onMove( newPos );
    };

    this.setWidgetForFlagTo = function( flag, value ) {
        for ( var prop in this ) {
            if ( ( this[ prop ].hasOwnProperty( "flag" ) ) &&
                 ( this[ prop ][ flag ] === flag ) ) {
                this[ prop ].widget.disabled = !value;
            }
        }
    };

    this.setPanelTo = function( panel_name, enabled ) {
        this.panels[ panel_name ].enable = enabled;
        for ( var i in this.panels[ panel_name ].widgets ) {
            this.panels[ panel_name ].widgets[ i ].widget.disabled = !enabled;
        }
    };

    this.enablePanels = function( panels ) {
        panels = panels === undefined ? [ "move", "battle", "action" ] : panels;
        for ( var i in panels ) {
            this.setPanelTo( panels[ i ], true );
        }
    };

    this.disablePanels = function( panels ) {
        panels = panels === undefined ? [ "move", "battle", "action" ] : panels;
        for ( var i in panels ) {
            this.setPanelTo( panels[ i ], false );
        }
    };

    this.createWidgets = function() {
        this.up.onclick = onMoveUp;
        this.up.widget = NS_UI.button( "up", this.up.onclick, "move" );
        this.up.flag = NS_Common.Flag.MOVE;

        this.down.onclick = onMoveDown;
        this.down.widget = NS_UI.button( "down", this.down.onclick, "move" );
        this.down.flag = NS_Common.Flag.MOVE;

        this.left.onclick = onMoveLeft;
        this.left.widget = NS_UI.button( "left", this.left.onclick, "move" );
        this.left.flag = NS_Common.Flag.MOVE;

        this.right.onclick = onMoveRight;
        this.right.widget = NS_UI.button( "right", this.right.onclick, "move" );
        this.right.flag = NS_Common.Flag.MOVE;

        this.panels.move = { enable: true,
                             widgets: [ this.up,
                                        this.down,
                                        this.left,
                                        this.right ] };

        this.action.widget = NS_UI.button( "action", this.action.onclick, "battle" );
        this.action.flag = NS_Common.Flag.ACTION;
        this.panels.battle = { enable: true,
                               widgets: [ this.action ] };

        this.use.widget = NS_UI.button( "use", this.use.onclick, "action" );
        this.use.flag = NS_Common.Flag.USE;

        this.look.widget = NS_UI.button( "look", this.look.onclick, "action" );
        this.look.flag = NS_Common.Flag.LOOK;

        this.take.widget = NS_UI.button( "take", this.take.onclick, "action" );
        this.take.flag = NS_Common.Flag.TAKE;

        this.drop.onclick = undefined;
        this.drop.widget = NS_UI.button( "drop", this.drop.onclick, "action" );
        this.drop.flag = NS_Common.Flag.DROP;

        this.inventory.onclick = function() {};
        this.inventory.widget = NS_UI.select.create( "action" );
        this.inventory.flag = NS_Common.Flag.ACTION;

        this.panels.action = { enable: true,
                               widgets: [ this.use,
                                          this.look,
                                          this.take,
                                          this.drop,
                                          this.inventory ] };

    };
}

var NS_Actor_UI = new _Actor_UI();