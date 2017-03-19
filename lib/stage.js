/**
 * Created by alejandro on 19/03/17.
 */

const validator = require('validator')
const getMessage = require('./language-manager').getMessage
const loop = require('./looper')
const rule = require('./rule')
const sanitizer = require('./sanitizer')
const normalizeParams = require('./helper').normalizeParams

module.exports = function ({field, validations, value, next, context}) {
    loop(validations, function (validation, nextStage) {
        let params = {value: value}
        let validationName = ''
        if ('string' === typeof validation) {
            validationName = validation
        } else {
            validationName = Object.keys(validation).shift();
            Object.assign(params, validation[validationName])
        }
        let options = setOptions(params, field, validationName)
        validationRoute(options, context, nextStage)
    }, next)
};

function validationRoute(options, context, nextStage) {
    rule(context, options, next);
    function next(error) {
        if (error) return void nextStage(error)
        if (options.sanitize !== false) {
            return void sanitizer(normalizeParams(options), nextStage)
        }
        nextStage()
    }
}

function setOptions(options, fieldName, validationName) {
    let params = {
        function: validator[validationName],
        message: getMessage(validationName),
        as: fieldName
    };
    if ('custom' === validationName) {
        params.custom = true
    }
    return Object.assign(params, options)
}