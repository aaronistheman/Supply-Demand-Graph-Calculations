var currentTestedFile = "model/string-input.js";

QUnit.module(currentTestedFile + ", StringInput.prototype.getChar()");

  QUnit.test("correct return", function(assert) {
    var sin = new StringInput("abcd");
    assert.deepEqual(sin.getChar(), 'a');
  });

  QUnit.test("advances stream", function(assert) {
    var sin = new StringInput("abcd");
    sin.getChar();
    assert.deepEqual(sin.getChar(), 'b');
  });

  QUnit.test("returns empty string if nothing left", function(assert) {
    var sin = new StringInput("ab");
    sin.getChar();
    sin.getChar();
    assert.deepEqual(sin.getChar(), '');
  });

QUnit.module(currentTestedFile +
  ", StringInput.prototype.getCharsUntil()");

  QUnit.test("gets chars until reaches stopper", function(assert) {
    var sin = new StringInput("abcdefgh");
    var str = sin.getCharsUntil('e');
    assert.deepEqual(str, "abcd", "Correct string returned");
    assert.deepEqual(sin.getChar(), 'e', "Advanced appropriately");
  });

QUnit.module(currentTestedFile +
  ", StringInput.prototype.ignore()");

  QUnit.test("ignores appropriate chars", function(assert) {
    var sin = new StringInput("aaaabaacd");
    sin.ignore('a');
    assert.deepEqual(sin.getChar(), 'b');
  });

  QUnit.test("can ignore nothing", function(assert) {
    var sin = new StringInput("abcd");
    sin.ignore('b');
    assert.deepEqual(sin.getChar(), 'a');
  });

QUnit.module(currentTestedFile + ", StringInput.prototype.ignoreUntil()");

  QUnit.test("ignores until appropriate char", function(assert) {
    var sin = new StringInput("abcdef");
    sin.ignoreUntil('d');
    assert.deepEqual(sin.getChar(), 'd');
  });

QUnit.module(currentTestedFile + ", StringInput.prototype.isAtEnd()");

  QUnit.test("knows when end's reached", function(assert) {
    var sin = new StringInput("abc");
    sin.ignoreUntil('d');
    assert.ok(sin.isAtEnd());
  });