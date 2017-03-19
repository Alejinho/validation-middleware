/**
 * Created by alejandro on 19/03/17.
 */

'use strict';

const mongoId = require('mongoid')

module.exports = function (value) {
    return mongoId(value)
};