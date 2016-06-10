"use strict";

/**
 * Custom type to handle the parsing of a string of inputs;
 * is kind of like an "input stream", I suppose
 */
function StringInput(theString) { // constructor
  if (!(this instanceof StringInput)) // if caller forgot "new"
    return new StringInput(theString);

  this._stream = theString;
  // this._state = StringInput.states.OK;
}

/**
 * StringInput "static" variables
 */
/*
StringInput.states = {
  OK : 1,
  END : 2,
};
*/

/**
 * StringInput methods
 */
StringInput.prototype = {
  constructor : StringInput,

  _advanceStream : function() {
    this._stream = this._stream.slice(1);
  },

  // getState : function() {
    // return this._state;
  // },

  /**
   * this works because the string slice method returns "" if the slice
   * would be invalid, so the last advance would leave the stream at "",
   * the first char of which is undefined
   */
  isAtEnd : function() {
    return this._stream[0] === undefined;
  },

  /**
   * @returns next char in the "input stream", then advances the stream;
   * returns "" if end reached
   */
  getChar : function() {
    var ch = this._stream[0];

    if (ch === undefined) { // if reached end
      // this._state = StringInput.states.END;
      return "";
    }
    else {
      this._advanceStream();
      return ch;
    }
  },

  /**
   * @returns a string containing all the chars in the stream until
   * charToStopAt is reached
   */
  getCharsUntil : function(charToStopAt) {
    var str = "";
    while (this._stream[0] !== charToStopAt && !this.isAtEnd())
    {
      str += this._stream[0];
      this._advanceStream();
    }
    return str;
  },

  /**
   * advances on the "input stream" until reaches a char that isn't
   * the char-to-ignore
   */
  ignore : function(charToIgnore) {
    while (this._stream[0] === charToIgnore && !this.isAtEnd())
      this._advanceStream();
  },

  /**
   * advances on the "input stream" until reaches a char that is
   * the char to not ignore
   */
  ignoreUntil : function(charToNotIgnore) {
    while (this._stream[0] !== charToNotIgnore && !this.isAtEnd())
      this._advanceStream();
  },
}; // StringInput.prototype