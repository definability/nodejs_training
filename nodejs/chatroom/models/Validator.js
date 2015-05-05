var Validator, defaultValidators;

Validator = (function() {
    var constructor = function (validate) {
        if (validate === undefined) {
            this.validate = function (field) {
                return true;
            };
        } else {
            this.validate = validate;
        }
    }
    self = constructor.prototype;
    return constructor;
})();

defaultValidators = {
    mandatory: new Validator (function(field) {
        return field !== undefined;
    })
};

module.exports = {Validator: Validator, defaultValidators: defaultValidators};
