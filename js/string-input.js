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

  _advanceStream : function() {
    this._stream = this._stream.slice(1);
  },

  /**
   * @returns next char in the "input stream", then advances the stream;
   * returns "" if end reached
   */
  get : function() {
    var ch = this._stream[0];

    if (ch === undefined) // if reached end
      return "";
    else {
      this._advanceStream();
      return ch;
    }
  },

  /**
   * advances on the "input stream" until reaches a char that isn't
   * the char-to-ignore
   */
  ignore : function(charToIgnore) {
    while (this._stream[0] === charToIgnore) // until no more to ignore
      this._advanceStream();
  },

}; // StringInput.prototype