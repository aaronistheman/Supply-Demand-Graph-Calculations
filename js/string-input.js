"use strict";

/**
 * Custom type to handle the parsing of a string of inputs;
 * is kind of like an "input stream", I suppose
 */
function StringInput(theString) {
  if (!(this instanceof StringInput)) // if caller forgot "new"
    return new StringInput(theString);

  this._stream = theString;
}

StringInput.prototype = {
  constructor : StringInput,

  /**
   * @returns next char in the "input stream", then advances the stream;
   * returns "" if end reached
   */
  get : function() {
    var ch = this._stream[0];
    this._stream = this._stream.slice(1);
    return ch;
  },

  /**
   * advances on the "input stream" until reaches a char that isn't
   * the char-to-ignore
   */
  ignore : function(charToIgnore) {

  },


}; // StringInput.prototype