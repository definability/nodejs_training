var Cache = (function() {
    var constructor = function() {
        this.value = {};
    };
    var proto = constructor.prototype;
    
    proto.__validate = function (validator, values) {
        var disjunction = function (a, b) {
            return a & b;
        };
        return values.map(validator, this).reduce(disjunction);
    };
    proto.__check_unique_key = function (key) {
        return !this.value.hasOwnProperty(key);
    };
    proto.__check_mandatory = function (value) {
        if (!Array.isArray(value)) {
            return value !== undefined;
        } else {
            return this.__validate(this.__check_mandatory, value);
        }
    };

    proto.add = function (key, value) {
        if (!this.__check_mandatory([key, value])) {
            throw new Error('Fields `key\' and `value\' are mandatory');
        } else if (!this.__check_unique_key(key)) {
            throw new Error('Field `key\' must be unique');
        } else {
            this.value[key] = value;
        }
    };
    proto.update = function (key, value) {
        if (!this.__check_mandatory([key, value])) {
            throw new Error('Fields `key\' and `value\' are mandatory');
        } else {
            this.value[key] = value;
        }
    };
    proto.get = function (key) {
        if (!this.__check_mandatory(key)) {
            throw new Error('Field `key\' is mandatory');
        } else {
            return this.value[key];
        }
    };
    proto.delete = function (key) {
        if (!this.__check_mandatory(key)) {
            throw new Error('Field `key\' is mandatory');
        } else {
            delete this.value[key];
        }
    };
    proto.find = function (query) {
        var isSubstring = function (substring) {
            return substring.toString().indexOf(query.toString()) > -1;
        };
        validKeys = [];
        for (var k in this.value) {
            if (isSubstring(this.value[k])) {
                var cur = {};
                cur[k] = this.value[k];
                validKeys.push(cur);
            }
        }
        return validKeys;
    };
    proto.count = function (key) {
        if (key !== undefined) {
            if (this.value[key] !== undefined) {
                return new String(this.value[key]).length;
            } else {
                return 0;
            }
        } else {
            var sumCallback = function(sum, cur) {
                return sum + cur;
            };
            var counts = Object.keys(this.value).map(proto.count, this);
            return counts.reduce(sumCallback, 0);
        }
    };
    return constructor;
})();

module.exports = {Cache: Cache};
