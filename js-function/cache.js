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
            console.log('Field `key\' is required');
        }
        if (!this.__check_mandatory(value)) {
            success = false;
            console.log('Field `value\' is required');
        }
        if (!this.__check_unique_key(key)) {
            success = false;
            console.log('Key must be unique');
        }
        if (success) {
            this.value[key] = value;
        }
    };
    proto.update = function (key, value) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            console.log('Field `key\' is required');
        }
        if (!this.__check_mandatory(value)) {
            success = false;
            console.log('Field `value\' is required');
        }
        if (success) {
            this.value[key] = value;
        }
    };
    proto.get = function (key) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            console.log('Field `key\' is required');
        }
        if (success) {
            return this.value[key];
        }
    };
    proto.delete = function (key) {
        var success = true;
        if (!this.__check_mandatory(key)) {
            success = false;
            console.log('Field `key\' is required');
        }
        if (success) {
            if (!delete a[key]) {
                console.log("Cannot delete value with key " + key);
            }
        }
    };
    proto.find = function (query) {
        var isSubstring = function (substring) {
            return query.indexOf(substring) > -1;
        };
        return validKeys.map(getPair);
    };
    proto.count = function (key) {
        if (key !== undefined) {
            return this.value[key].toString().length;
        } else {
            var sumCallback = function(sum, cur) {
                return sum + cur;
            };
            var counts = Object.keys(this.value).map(proto.count, this);
            return counts.reduce(sumCallback);
        }
    };
    return constructor;
})();
