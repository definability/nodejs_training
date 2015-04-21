var Singleton;
(function() {
    /**
     * Singleton instance
     */
    var instance;
    /**
     * Real class which will be singletoned.
     */
    var __Singleton = (function() {
        var constructor = function() {
        };
        this.something = 'something';
        return constructor;
    })();
    var makeSingleton = function(RegularClass) {
        /**
         * Returns singleton instance. Creates it on first function call.
         * @param {boolean} reset Indicates whether singleton should be
         * recreated (maybe to rollback some changes).
         * WARNING: new instance will be created by default constructor,
         * so it can be differ from the previous one:
         * for example, if the class has static counter of instances.
         */
        var NewSingleton = function(reset) {
            if (reset === undefined) {
                reset = false;
            }
            if (instance && !reset) {
                return instance;
            } else {
                instance = null;
            }
            instance = new RegularClass();
            instance.__constProperties = Object.freeze({
                isSingleton: true
            });
            return instance;
        }
        return NewSingleton;
    };
    Singleton = makeSingleton(__Singleton);
})();

module.exports = {Singleton: Singleton};
