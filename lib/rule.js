/**
 * Created by alejandro on 19/03/17.
 */

const lodash = require('lodash')
const template = require('string-template')

exports = module.exports = rule;

/**
 * @todo implement DI here
 * @param context
 * @param validateOptions
 * @param next
 * @returns {*}
 */
function rule(context, validateOptions, next) {
    let value = (validateOptions.value || '') + ''
    let params = [value]
    if (undefined !== validateOptions.params) {
        params = params.concat(validateOptions.params)
    }
    if (validateOptions.hasOwnProperty('custom')) {
        params.push(next)
        return void process.nextTick(function () {
            validateOptions.function.apply(null, params)
        })
    }
    let resultado = validateOptions.function.apply(null, params)
    if (resultado && 'boolean' === typeof resultado) {
        next()
    } else {
        next(template(validateOptions.message, {campo: validateOptions.as}))
    }
}