var MetaModel = require('./Model.js').MetaModel;
    //MetaSingleton = require('../singleton/MetaSingleton.js').MetaSingleton;
    MetaSingleton = require('MetaSingleton');
var Users;

Users = new MetaModel({
    name: 'users',
    fields: ['name', 'createdOn', 'email', 'address']
});

module.exports = Users;
