# Parametrize
Simple js library allowing for adhoc polymorphism with javascript functions
Override functions with the same name using different parameter types, making it evaluate differently based on them (input parameters)

# How to install
Install library through
```sh
npm install parametrize
```
then include with
```js
var Func = require('parametrize')
```
or
```js
import Func from 'parametrize'
```
in your script file.

```parametrize.js``` and ```parametrize.min.js``` also can be included on the client through ```script``` tag, should you choose to use it on the client and without any bundler. 
# How to use
Let's imagine that pointer pointing to library entry point name is ```Func```
Then to create function that will be able to change behavior parametrically we do
```js
var sum = Func.new('sum');
```
Variable ```sum``` now holds function ready to be invoked, but will return ```undefined``` any time.
```js
sum();
=> undefined
```
Because we still haven't added rules: parameters and corresponding functions.
To add parameter types and function, we call ```.parametrize()``` method with first argument as array of types and second argument as function, correspondingly. Like so
```js
sum.parametrize([Number, Number], (a, b) => a + b);
```
Then we can call ```sum``` with two numeric arguments and get their sum
```js
sum(1,2);
=> 3
```
Not quite impressive.
But how about this
```js
sum.parametrize([Array], (a) => a.reduce(a, v) => a + v, 0);
sum([1,2,3,4]);
=> 10
```
Or this
```js
function Vector (x, y) {
  this.x = x;
    this.y = y;
}

sum.parametrize([Vector, Vector], (v1, v2) => new Vector(v1.x + v2.x, v1.y + v2.y))

sum(new Vector(0,2), new Vector(2,3))
=> Vector (2,5)
```
So we use the same function name, but invoke it with different parameter types, and get different results at the end.
This is what adhoc polymorphism is, and what this library is about.

```Func``` object keeps track of all registered functions within itself, and to fetch function already defined in another file, you call ```Func.get()```, like so
```js
file1.js =>
var sum = Func.new('sum');
.......
file2.js =>
var sum = Func.get('sum');
```