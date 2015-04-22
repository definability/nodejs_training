var Cache = require("./cache.js").Cache;

if (!module.parent) {
    var results = require("./data.json").results;
    var cache = new Cache();

    for (var key in results) {
        cache.add(key, results[key]);
    }
    var result = cache.count();

    console.log(result, result === ("rabbit"+"python"+"lion").length); // 16 true
} else {
    module.exports = Cache;
}
