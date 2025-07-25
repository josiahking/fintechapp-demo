const knex = require('../../knex');

exports.getUserByEmail = (email) => {
    return knex('users').where({ email }).first();
};

exports.createUser = (user) => {
    return knex('users').insert(user);
};
