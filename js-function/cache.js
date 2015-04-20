var Cache = (function() {
    var constructor = function() {
        this.value = {};
    };
    var proto = constructor.prototype;
    
    proto.__check_unique_key = function (key, onError) {
        if (this.value.hasOwnProperty(key)) {
            return onError('must be unique');
        }
        return !this.value.hasOwnProperty(key);
    };
    proto.__check_mandatory = function (value, onError) {
        if (value === undefined) {
            return onError('is mandatory');
        }
        return value !== undefined;
    };

    proto.add = function (key, value) {
        this.__check_mandatory(key, function(message) {
            throw new Error('key ' + message);
        });
        this.__check_mandatory(value, function(message) {
            throw new Error('value ' + message);
        });
        this.__check_unique_key(key, function(message) {
            throw new Error('key ' + message);
        });
        this.value[key] = value;
    };
    proto.update = function (key, value) {
        this.__check_mandatory(key, function(message) {
            throw new Error('key ' + message);
        });
        this.__check_mandatory(value, function(message) {
            throw new Error('value ' + message);
        });
        this.value[key] = value;
    };
    proto.get = function (key) {
        this.__check_mandatory(key, function(message) {
            throw new Error('key ' + message);
        });
        return this.value[key];
    };
    proto.delete = function (key) {
        this.__check_mandatory(key, function(message) {
            throw new Error('key ' + message);
        });
        delete this.value[key];
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
