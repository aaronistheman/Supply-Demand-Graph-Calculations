"use strict";

/*
  This file includes code that isn't easily assigned to one
  of the other JavaScript files.
*/

/*
  @returns true if currently unit testing (with QUnit), false otherwise
*/
function isUnitTesting() {
  return $("#qunit").length === 1;
}

/*
    @post the message has been used in an alert (if unit tests are
    not occuring) and thrown as an exception
    @param message
*/
function alertAndThrowException(message) {
  message = "Error: " + message;
  if (!isUnitTesting())
    alert(message);
  throw message;
}