var Cache = (function() {
    var constructor = function() {
        this.value = {};
    };
    var proto = constructor.prototype;
    
    proto.__check_unique_key = function (key) {
        return !this.value.hasOwnProperty(key);
    };
    proto.__check_mandatory = function (value) {
        return value !== undefined;
    };

    proto.add = function (key, value) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            throw new Error('Field `key\' is required');
        }
        if (!this.__check_mandatory(value)) {
            success = false;
            throw new Error('Field `value\' is required');
        }
        if (!this.__check_unique_key(key)) {
            success = false;
            throw new Error('Field `key\' must be unique');
        }
        if (success) {
            this.value[key] = value;
        }
    };
    proto.update = function (key, value) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            throw new Error('Field `key\' is required');
        }
        if (!this.__check_mandatory(value)) {
            success = false;
            throw new Error('Field `value\' is required');
        }
        if (success) {
            this.value[key] = value;
        }
    };
    proto.get = function (key) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            throw new Error('Field `key\' is required');
        }
        if (success) {
            return this.value[key];
        }
    };
    proto.delete = function (key) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            throw new Error('Field `key\' is required');
        }
        if (success) {
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
