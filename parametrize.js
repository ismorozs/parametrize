'use strict';

(function (globalObj, isModuleGlobal) {

  var noArguments = '\\';

  var argsTree = {};
  var funcs = {};
  var Func = {
    new: addFunction,
    get: addFunction,
    set: addFunction,
    strict: function (bool) {
      strict = bool;
      console.warn('parametrize strict mode is set to ' + strict);
    }
  };

  var strict = false;

  if (isModuleGlobal) {
    globalObj.exports = Func;
  } else {
    globalObj.Func = Func;
  }

  function addFunction(name, params, func) {
    switch (arguments.length) {

    }

    if (!funcs[name]) {
      var newFunc = setupNewFunction(name);
      var initialFunction = (strict) ? errorFunction.bind(null, name) : function () {};
      setThroughPath(argsTree, [name, noArguments], initialFunction);
      newFunc.parametrize = newFunc.overload = function (params, func) {
        return addFunction(name, params, func);
      };
      funcs[name] = newFunc;
    }

    if (!func) {
      if (params) {
        setThroughPath(argsTree, [name, noArguments], params);
      }
      return funcs[name];
    }

    var constructorsNames = getConstructorNames(params);
    setThroughPath(argsTree, [name].concat(constructorsNames), func);

    return funcs[name];
  };

  function setupNewFunction(funcName) {
    return function () {
      var func = getFunctonBasedOnArguments(funcName, arguments);
      return func.apply(this, arguments);
    };
  };

  function getFunctonBasedOnArguments(funcName, args) {
    var argsTypes = [].map.call(args, function (arg) {
      return arg.constructor.name;
    });

    var func = void 0;
    try {

      if (!argsTypes.length) {
        return argsTree[funcName][noArguments];
      }

      func = getThroughPath(argsTree, [funcName].concat(argsTypes));

    } catch (e) {
      if (strict) {
        throw TypeError (
          "Calling '" + funcName + "' with argument types [" + argsTypes.join(', ') + "] doesn't match any defined signature."
        );
      }

      func = argsTree[funcName][noArguments];
    }
    return func;
  }

  function getConstructorNames(constructorsArr) {
    return constructorsArr.map(function (c) {
      return c.name;
    });
  }

  function getThroughPath(obj, path) {
    var value = obj;
    for (var i = 0; i < path.length; i++) {
      value = value[path[i]];
    }
    return value;
  }

  function setThroughPath(obj, path, value) {
    var dest = obj;
    for (var i = 0; i < path.length - 1; i++) {
      if (!dest[path[i]]) {
        dest = dest[path[i]] = {};
      } else {
        dest = dest[path[i]];
      }
    }

    if (isObject(value)) {
      dest[path[i]] = dest[path[i]] || {};
      Object.assign(dest[path[i]], value);
    } else {
      dest[path[i]] = value;
    }

    return obj;
  }

  function errorFunction (name) {
    throw TypeError ("Calling '" + name + "' with argument types [] doesn't match any defined signature.");
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

})(typeof module !== 'undefined' ? module : window, typeof module !== 'undefined');
