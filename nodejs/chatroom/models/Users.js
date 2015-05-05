var MetaModel = require('./Model.js'),
    defaultValidators = require('./Validator.js').defaultValidators;
var Users;

Users = new MetaModel({
    name: 'users',
    fields: [{
        name: 'name',
        validators: [defaultValidators.mandatory]
    }, {
        name: 'createdOn',
        validators: []
    }, {
        name: 'email',
        validators: []
    }, {
        name: 'address',
        validators: []
    }]
});

module.exports = Users;
