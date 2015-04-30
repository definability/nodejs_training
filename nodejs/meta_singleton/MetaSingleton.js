var Singleton = (function() {
    var instances = [];
    /**
     * Returns singleton instance. Creates it on first function call.
     * WARNING: new instance will be created by default constructor,
     * so it can be differ from the previous one:
     * for example, if the class has static counter of instances.
     */
    var constructor = function (RegularClass, reset) {
        if (reset === undefined) {
            reset = false;
        }
        if (RegularClass.hasOwnProperty('__singletonId') && !reset) {
            return instances[RegularClass.__singletonId];
        }
        RegularClass.__singletonId = instances.length;
        var instance = new RegularClass();
        instance.__constProperties = Object.freeze({
            isSingleton: true,
        });
        instances.push(instance);
        return instance;
    }
    return constructor;
})();

var MetaSingleton = (function() {
    var constructor = function (RegularClass) {
        return function(reset) {
            return new Singleton(RegularClass, reset);
        };
    };
    return constructor;
})();

module.exports = MetaSingleton;
