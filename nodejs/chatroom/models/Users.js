var MetaModel = require('./Model.js').MetaModel;
var Users;

Users = new MetaModel({
    name: 'users',
    fields: ['name', 'createdOn', 'email', 'address']
});

module.exports = Users;
