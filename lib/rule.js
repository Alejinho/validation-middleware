/**
 * Created by alejandro on 19/03/17.
 */

const lodash = require('lodash')
const template = require('string-template')
const getMessage = require('./language-manager').getMessage

module.exports = function rule(context, validateOptions, next) {
    let value = (validateOptions.value || '') + ''
    if (!value && validateOptions.required) {
        const alias = validateOptions.as
        return next(template(getMessage('required'), {campo: alias}))
    }
    if (!validateOptions.required && '' === value) {
        return next()
    }
    let params = [value]
    if (validateOptions.params) {
        params = params.concat(validateOptions.params)
    }
    if (validateOptions.hasOwnProperty('custom')) {
        params.push(next)
        return void process.nextTick(function () {
            validateOptions.function.apply(null, params)
        })
    }
    let resultado = validateOptions.function.apply(null, params)
    return resultado ? next() : next(template(validateOptions.message, {campo: validateOptions.as}))
};