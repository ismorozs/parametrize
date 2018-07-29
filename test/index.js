var assert = require('assert');
var Func = require('../parametrize')

describe('Func', function () {

  var sum;

  it('should create "sum" function', function () {
    sum = Func.new('sum');
    assert(sum instanceof Function);
  });

  it('"sum" function initially returns undefined', function () {
    assert(typeof sum() === 'undefined')
  });

  it('should override "sum" function to return sum of two numbers when receiving numeric parameters', function () {
    sum.parametrize([Number, Number], (a, b) => a + b);

    assert(sum(1, 2) === 3);
  });

  it('should override "sum" function to return sum of array elements when receiving array parameter', function () {
    sum.parametrize([Array], (a1) => a1.reduce((a, v) => v + a, 0));

    assert(sum([1, 2, 3, 4]) === 10);
  });

  it("previous definitions shuldn't be overriden", function () {
    assert( sum([ sum(1, 2), sum(3, 4) ]) === 10);
  });

  it('should override "sum" function through generic Func.new/set/get', function () {
    Func.set('sum', [Array, String], (a, s) => a.push(s) && a);

    assert.deepEqual( sum(['Hello, '], 'World!') , ['Hello, ', 'World!'] );
  });

  it('should override "sum" function to handle user data structures', function () {

    function Horse () {
      this.power = 1;
    }

    sum.parametrize([Horse, Horse], (h1, h2) => 'Sum of powers of two horses is ' + (h1.power + h2.power));

    assert( sum(new Horse, new Horse), 'Sum of powers of two horses is 2');
  })

});
