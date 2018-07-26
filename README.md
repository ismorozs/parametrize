# Parametrize
Simple js library allowing for adhoc polymorphism with javascript functions.  
Overload functions with the same name using different parameter types, thus making them evaluate differently depending on their input parameters.

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

```parametrize.js``` and ```parametrize.min.js``` also can be included on the client through ```script``` tag, should you choose to use it without any bundler. 
# How to use
Let's imagine that pointer pointing to library entry point name is ```Func```
Then to create a function that will be able to change behavior parametrically we do
```js
var sum = Func.new('sum');
```
Variable ```sum``` now holds function ready to be invoked but will return ```undefined``` any time.
```js
sum();
=> undefined
```
Because we still haven't added rules: lists of parameter types and corresponding functions.
To add a parameter types list and a function, we call ```.parametrize()``` method with first argument as an array of types and second argument as a function, correspondingly. Like so
```js
sum.parametrize([Number, Number], (a, b) => a + b);
```
Then we can call ```sum``` with two numeric arguments and get their sum
```js
sum(1,2);
=> 3
```
Not quite impressive.
But how about this. Lets overload ```sum``` function a few times with different parameter types
```js
sum.parametrize([Array], (a) => a.reduce(a, v) => a + v, 0);

function Vector (x, y) {
  this.x = x;
  this.y = y;
}

sum.parametrize([Vector, Vector], (v1, v2) => new Vector(v1.x + v2.x, v1.y + v2.y))
```
Then run it with corresponsing parameter types
```js
sum(new Vector(0,2), new Vector(2,3))
=> Vector (2,5)
sum([1,2,3,4]);
=> 10
```
So we use the same function name, but invoke it with different parameter types, and get different results at the end.
This is what adhoc polymorphism is, and what this library is about.  

Mapping each parameters list variant to a function can be cumbersome and simply redundant. Any function returned from ```Func.new``` can be assigned a fallback function, which will be invoked when no function is found for a given list of parameter types.
To setup fallback function, you we this
```js
sum.parametrize(() => console.log("I don't know what to do"));
```
Or, you even could define the fallback function at the very start calling
```js
var sum = Func.new('sum', () => 'Foo Bar!')
```
Each time, there's no suited function for given paramters, function above will be called. Like in this instance
```js
sum('Hello, World!', [1,2,3], { x:1, y:2, z:3 });
=> 'Foo Bar!'
```

Up until now, we used ```.parametrize()``` method on ```sum``` variable to map argument types to functions to call. But you always can avoid creation of variable if you don't need it in a given piece of code. And just call
```js
Func.set('sum', [Number, Number], (a, b) => a + b);
```
the result of function call above will be the same as ```sum.parametrize(...)``` were.

Also, as much as ```'sum'``` is a function name in our instance, it's also a key to the inner store of functions within ```Func``` object. And you can get hold of any function defined by you earlier in the code, by simply calling ```Func.get()```  
Like so
```js
file1.js =>
var sum = Func.new('name:space:sum');
.......
file2.js =>
var sum = Func.get('name:space:sum');
```

# A few technicalities
```Func``` object is provided with 3 keys (```Func.new(), Func.get(), Func.set()```) that point to the same function in the source code (```addFunction```). It's done for readability and understandability reasons, and actually all three functions are  interchangeable. 
Again, depending on input arguments this inner function behaves a little different.

| Signature | Param Types | Result |
|-----------|-------------|--------|
|```addFunction (String funcId)```| ```funcId``` - unique identificator of function within global ```Func``` function store |creates, if it didn't already, and returns parametrized function |
|```addFunction (String funcId, Function func)```| ```funcId``` - see above, ```func``` - function  that will be called when there's no match of input arguments on function call with any of defined overloads | same as ```addFunction (String funcId)```, plus set default function|
|```addFunction(String funcId, Array parameterTypes, Function func)```| ```funcId``` - see above, ```parameterTypes``` - list of constructors, objects of which types will participate in calculation, ```func``` - function to be called when input parameter types on function call match with constructor names from ```parameterTypes``` | same as ```addFunction (String funcId)```, plus overloads function in accordance with parameter types list

Parametrized function also has method ```.overload()``` that is an alias of ```.parametrize()``` method.