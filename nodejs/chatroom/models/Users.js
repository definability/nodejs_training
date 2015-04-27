var createModel = require('./Model.js').createModel;
var Users;

/*
User = (function() {
    constructor = extendModel(Model);
    var proto = constructor.prototype;
    proto.schemaName = 'users';
    proto.schemaFields = ['name', 'creationDate', 'email', 'address'];
    Array.prototype.push.apply(proto.schemaFields, constructor.__super__.schemaFields);
    return constructor;
})();
*/
Users = createModel({
    name: 'users',
    fields: ['name', 'creationDate', 'email', 'address']
});

module.exports = Users;
