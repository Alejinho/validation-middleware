/**
 * Created by alejandro on 19/03/17.
 */

'use strict';

const validator = require('validator')

module.exports = function (value) {
    return validator.toBoolean(
        validator.trim(value), true
    )
};