"use strict";

var currentTestedFile = "string-input.js";

QUnit.module(currentTestedFile + ", StringInput.get()");

  QUnit.test("correct return", function(assert) {
    var sin = new StringInput("abcd");
    assert.deepEqual(sin.get(), 'a');
  });

  QUnit.test("advances stream", function(assert) {
    var sin = new StringInput("abcd");
    sin.get();
    assert.deepEqual(sin.get(), 'b');
  });

  QUnit.test("returns empty string if nothing left", function(assert) {
    var sin = new StringInput("ab");
    sin.get();
    sin.get();
    assert.deepEqual(sin.get(), '');
  });

QUnit.module(currentTestedFile + ", StringInput.ignore()");

  QUnit.test("ignores appropriate chars", function(assert) {
    var sin = new StringInput("aaaabaacd");
    sin.ignore('a');
    assert.deepEqual(sin.get(), 'b');
  });

  QUnit.test("can ignore nothing", function(assert) {
    var sin = new StringInput("abcd");
    sin.ignore('b');
    assert.deepEqual(sin.get(), 'a');
  });