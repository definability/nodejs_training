var createModel = require('./Model.js').createModel;
var Users;

Users = createModel({
    name: 'users',
    fields: ['name', 'creationDate', 'email', 'address']
});

module.exports = Users;
