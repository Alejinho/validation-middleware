/**
 * Created by alejandro on 19/03/17.
 */

const set = require('lodash').set
const sanitizers = require('./sanitize')

module.exports = function (options, next) {
    let value = options.value
    let params = [value]
    if (options.params) {
        params = params.concat(options.params)
    }
    if (options.hasOwnProperty('custom')) {
        params = {value: value}
        params.push(next)
        return void options.function.apply(null, params)
    }
    let resultado = options.function.apply(null, params)
    set(context.src, context.key, resultado)
    options.value = resultado
    next()
};

function stages(sanitizes) {

}