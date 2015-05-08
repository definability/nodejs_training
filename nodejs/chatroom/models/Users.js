var MetaModel = require('./MetaModel.js'),
    defaultValidators = require('./Validator.js').defaultValidators,
    faker = require('faker');
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
}, {
    generateRandomModel: function() {
        return {name: faker.name.findName(), createdOn: Date.now(), email: faker.internet.email(),
                address: faker.address.streetAddress()};
    }
});

module.exports = Users;
