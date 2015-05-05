var Singleton = (function() {
    /**
     * Returns singleton instance. Creates it on first function call.
     * WARNING: new instance will be created by default constructor,
     * so it can be differ from the previous one:
     * for example, if the class has static counter of instances.
     */
    var constructor = function (RegularClass, reset) {
        if (RegularClass.__singleton_instance__ === undefined || reset) {
            RegularClass.__singleton_instance__ = new RegularClass();
        }
        var instance = RegularClass.__singleton_instance__;
        instance.__constProperties = Object.freeze({
            isSingleton: true,
        });
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
