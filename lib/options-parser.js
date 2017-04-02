/**
 * Created by alejandro on 19/03/17.
 */

const loop = require('./looper')
const stage = require('./stage')
const httpError = require('./http-error').genError
const normalizeParam = require('./helper').normalizeParams

/**
 *
 * @type {optionsParser}
 */
module.exports = optionsParser;

/**
 * It iterates over all the fields and initialize the stages loop, example
 * {
 *   _id: {...} <-- First validation item
 *   htmlCode: {...}, <-- Second validation item
 * }
 *
 * Then if error is a thuthly value it will pass a error to then next express middleware
 *
 * @param stages
 * @param values
 * @param context
 * @param callback
 */
function optionsParser(stages, values, context, callback) {
    const fields = Object.keys(stages);
    loop(fields, function (field, next) {
        let param = normalizeParam(stages[field])
        stage({
            field: field,
            validations: param,
            values: values,
            context: context,
            next: next
        })
    }, function (error) {
        stageFilter(error, callback)
    })
}

/**
 *
 * @param error
 * @param callback
 */
function stageFilter(error, callback) {
    callback(httpError(error))
}