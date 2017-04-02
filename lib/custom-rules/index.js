/**
 * Created by alejandro on 1/04/17.
 */

let validator = require('validator');
let adapter = {
    required: require('./required')
};

Object.assign(validator, adapter);

module.exports = validator;