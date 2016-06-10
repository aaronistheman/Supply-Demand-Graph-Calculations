"use strict";

/**
 * Custom type to handle the parsing of a string of inputs;
 * is kind of like an "input stream", I suppose
 */
function StringInput(theString) { // constructor
  if (!(this instanceof StringInput)) // if caller forgot "new"
    return new StringInput(theString);

  this._stream = theString;
  this._state = StringInput.states.OK;
}

/**
 * StringInput "static" variables
 */
StringInput.states = {
  OK : 1,
  END : 2,
};

/**
 * StringInput methods
 */
StringInput.prototype = {
  constructor : StringInput,

  _advanceStream : function() {
    this._stream = this._stream.slice(1);
  },

  getState : function() {
    return this._state;
  },

  /**
   * @returns next char in the "input stream", then advances the stream;
   * returns "" if end reached
   */
  getChar : function() {
    var ch = this._stream[0];

    if (ch === undefined) { // if reached end
      this._state = StringInput.states.END;
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
    while (this._stream[0] !== charToStopAt) // while more to add
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
    while (this._stream[0] === charToIgnore) // until no more to ignore
      this._advanceStream();
  },

  /**
   * advances on the "input stream" until reaches a char that is
   * the char to not ignore
   */
  ignoreUntil : function(charToNotIgnore) {
    while (this._stream[0] !== charToNotIgnore) // while more to ignore
      this._advanceStream();
  },
}; // StringInput.prototype