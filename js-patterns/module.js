var Validation = (function(module) {
    var _isValid = function (value, regexp) {
        return !!value.toString().match(regexp);
    };
    module.isEmail = function (value) {
        return _isValid(value, /^\w[\w\d_\-\.]+@\w[\w\d_\-\.]+\w\.\w+$/);
    };
    module.isUUID = function (value) {
        return _isValid(value, /^[\da-fA-F]{8}-([\da-fA-F]{4}-){3}[\da-fA-F]{12}$/);
    };
    module.isPhone = function (value) {
        return _isValid(value, /^\d{3}(-\d{2}){2}$/);
    };
    module.isURL = function (value) {
        return _isValid(value, /^(http[s]?:\/\/)?\w[\w\d\/\-_\.]+\.\w+$/);
    };
    return module;
})(module || {});

module.exports = {Validation: Validation};
