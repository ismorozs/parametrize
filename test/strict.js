var assert = require('assert');
var Func = require('../parametrize')

describe('Func in strict mode', function () {

  beforeEach(function () {
    Func.strict(true);
  });

  var sum = Func.new('sum');

  it('should throw error on calling function without matching defined signatures', function () {
  
    try {

      sum();

    } catch (e) {

      assert(e.message, "Calling 'sum' with argument types [] doesn't match any defined signature.")

    }

  });

  afterEach(function () {
    Func.strict(false);
  });

});
