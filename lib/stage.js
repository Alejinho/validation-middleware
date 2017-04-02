/**
 * Created by alejandro on 19/03/17.
 */

const validator = require('./custom-rules')
const getMessage = require('./language-manager').getMessage
const loop = require('./looper')
const rule = require('./rule')
const sanitizer = require('./sanitizer')
const normalizeParams = require('./helper').normalizeParams
const at = require('lodash').at
const END_LOOP = require('./looper').END_LOOP

exports = module.exports = stages;

function stages({field, validations, values, next, context, callback}) {
    if (!callback) {
        callback = validationRoute
    }
    let value = at(values, field).shift()
    loop(validations, function (validation, nextStage) {
        let params = {value: value, values: values}
        let validationName = ''
        if ('string' === typeof validation) {
            validationName = validation
        } else {
            validationName = Object.keys(validation).shift()
            if ('object' === typeof validation[validationName]) {
                Object.assign(params, validation[validationName])
            } else {
                params.params = validation[validationName]
            }
        }
        let options = setOptions(params, field, validationName)
        callback(options, context, nextStage)
    }, next)
}

function validationRoute(options, context, nextStage) {
    rule(context, options, next);
    function next(error) {
        if (error) return void nextStage(error, END_LOOP)
        if (options.sanitize !== false) {
            if (!options.sanitize) {
                options.sanitize = options.validationName
            }
            return void stages({
                field: options.fieldName,
                validations: normalizeParams(options.sanitize),
                values: options.values,
                next: nextStage,
                context: context,
                callback: sanitizer
            })
        }
        nextStage()
    }
}

/**
 * Basic template to stages, it defines the default behavior
 *
 * @param options
 * @param fieldName
 * @param validationName
 * @returns {*}
 */
function setOptions(options, fieldName, validationName) {
    let params = {
        function: validator[validationName],
        message: getMessage(validationName),
        validationName: validationName,
        fieldName: fieldName,
        as: fieldName
    };
    if ('custom' === validationName) {
        params.custom = true
    }
    return Object.assign(params, options)
}