/**
 * Makes node of functions' chain.
 * @param {Function} Callback of function f.
 * @param {Function} Function to call with callback.
 * @return {Function} Returns function for higher caller or execution.
 */
var makeNode = function (callback, f) {
    return function() {
        return f(callback);
    };
};
/**
 * Make chain of functions with callbacks: F1(F2(F3(...Fn)...)).
 * @param {[Function]} Functions to chain in natural order.
 * @return Chained function.
 */
var makeChain = function (functions) {
    if (functions === undefined || functions.length === 0) {
        return function() {};
    } else {
        return functions.reverse().reduce(makeNode);
    }
};
/**
 * Call chain of functions with callbacks: F1(F2(F3(...Fn)...)).
 * @param {[Function]} Functions to chain in natural order.
 * @return Result of calling chained function (chains and executes them).
 */
var callChain = function(functions) {
    return makeChain(functions)();
};

module.exports = {makeChain: makeChain, callChain: callChain};
