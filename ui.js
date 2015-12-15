/**
 * User Interface
 * @return {undefined} Nothing
 */
function _UserItf() {
    /**
     * Keep a copy for the object instance.
     * @type {_UserIf}
     */
    var __that = this;

    /**
     * User interface log string.
     * @param  {String} str String to send to log
     * @return {undefined} Nothing
     */
    this.log = function( str ) {
        console.log( str );
    };

    /**
     * User interface debug string.
     * @param  {String} str String to send to debug
     * @return {undefined} Nothing
     */
    this.debug = function( str ) {
        console.log( str );
    };

    /**
     * User interface error string.
     * @param  {String} str String to send to error
     * @return {undefined} Nothing
     */
    this.error = function( str ) {
        console.log( 'ERROR: ' + str );
    };

    /**
     * User interface prompt string
     * @param  {String} str String to prompt
     * @return {string} String entered in the prompt dialog
     */
    this.prompt = function( str ) {
        return prompt( str );
    };

    this.button = function( name, handler, group ) {
        var panel;
        if ( group !== undefined ) {
            panel = document.getElementById( group );
        }
        var button = document.createElement( "input" );
        button.type = "button";
        button.value = name;
        button.onclick = handler;
        if ( panel !== undefined ) {
            panel.appendChild( button );
        } else {
            document.body.appendChild( button );
        }
        return button;
    };

    this.select = {
        create: function( group ) {
            var selection = document.createElement( "select" );
            document.body.appendChild( selection );
            return selection;
        },

        append: function( selection, message, handler, group ) {
            var opt = document.createElement( "option" );
            opt.value = message;
            opt.innerHTML = message;
            opt.handler = handler;
            selection.appendChild( opt );
            return selection;
        },
    };

    this.textarea = {
        create: function( rows, cols, group ) {
            var textarea = document.createElement( "textarea" );
            textarea.rows = rows;
            textarea.cols = cols;
            document.body.appendChild( textarea );
            return textarea;
        },

        append: function( text_area, message ) {
            var textArray = text_area.value.split( "\n" );
            textArray.push( message );
            text_area.value = textArray.join( "\n" );
            return text_area;
        }
    };
}

var NS_UI = new _UserItf();
