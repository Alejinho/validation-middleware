/**
 * Created by alejandro on 1/04/17.
 */

const END_LOOP = require('../looper').END_LOOP

module.exports = function required(value, isRequired = true, context, callback) {
    if (!isRequired && !value) {
        return END_LOOP;
    }
    if (!callback || 'function' !== typeof callback) {
        callback = defaultValidation
    }
    return callback(value, context)
};

function defaultValidation(value) {
    return '' !== value
}