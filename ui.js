/**
 * User Interface
 * @return {undefined} Nothing
 */
function _UserItf() {
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
        console.log( str );
    };

    /**
     * User interface prompt string
     * @param  {String} str String to prompt
     * @return {string} String entered in the prompt dialog
     */
    this.prompt = function( str ) {
        return prompt( str );
    };
}

var NS_UI = new _UserItf();
