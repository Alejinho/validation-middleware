/**
 * Created by alejandro on 5/02/17.
 */
'use strict'

const HttpError = require('standard-http-error')
const validator = require('validator')
const lodash = require('lodash')
const loop = require('./looper')
const template = require('string-template')
const VALIDATE = 'validate'
const SANITIZE = 'sanitize'
let language = require('./lang/es_CO.json')

exports = module.exports = middleware

/**
 *
 * @param {Object} expect
 * @param {String} [src=body]
 * @returns {function(*, *, *=)}
 */
exports.sanitize = sanitize

exports.SANITIZE = SANITIZE

exports.VALIDATE = VALIDATE

/**
 *
 * @param {(String|Object)} newValue
 */
exports.i18n = i18n

/**
 *
 * @param {Object} expect - Items de validación
 * @param {String} [src=body] - Item de donde se toman los valores a validar
 * @param {String} [type=validate] - VALIDATE o SANITIZE
 * @returns {function(*, *, *=)}
 */
function middleware(expect, src = 'body', type = VALIDATE) {
    return (request, response, next) => {
        let itemToValidate = request[src] = request[src] || {}

        removeNotExpected(expect, {value: itemToValidate}, err => {
            if (err) return void next(err)
            loop(expect, (itemExpected, next) => {
                validateItem(itemToValidate, itemExpected, next, type)
            }, err => {
                if (err) {
                    return void next(new HttpError(409, err.join(', ')))
                }
                next(null)
            })
        })
    }
}

function sanitize(expect, src) {
    return middleware(expect, src, SANITIZE)
}

/**
 *
 * @param {String} functionToCustomize
 * @param {*} newValue
 * @returns {boolean}
 */
exports.customizeMessage = function (functionToCustomize, newValue) {
    if ('string' === typeof functionToCustomize && language.hasOwnProperty(functionToCustomize)) {
        language[functionToCustomize] = newValue
        return true
    }
    throw new Error(`Undefined function: ${functionToCustomize}`)
}

/**
 *
 * @param {*} src
 * @param {*} expected
 * @param {Function} next
 * @param {String} type
 */
function validateItem(src, expected, next, type = VALIDATE) {
    const value = (lodash.at(src, expected.key).shift() || '') + ''
    let context = {
        value: value,
        key: expected.key,
        src: src,
        type: type
    }
    if (!Array.isArray(expected.value)) {
        expected.value = [expected.value]
    }
    loop(expected.value, (validation, nextValidation) => {
        execFunction(context, validation, nextValidation)
    }, next)
}

function i18n(newValue) {
    if ('string' === typeof newValue) {
        language = require(`./validator/${newValue}.json`)
    } else if ('object' === typeof newValue) {
        language = newValue
    }
    throw new TypeError('Se espera recibir un string o un objeto con las nuevas reglas.')
}

/**
 *
 * @param {*} context
 * @param {Object} validate
 * @param {*} validate.value - Valor a validar
 * @param {String} validate.key - Nombre del item a validar
 * @param {Object} validate.src
 * @param {String} validate.type - VALIDATE o SANITIZE
 * @param {Function} next
 * @returns {*}
 */
function execFunction(context, validate, next) {
    let value = context.value
    const validateOptions = getValidationObject(validate, context.key)
    if (VALIDATE === context.type) {
        if (!value && validateOptions.required) {
            const alias = validateOptions.as || context.key || ''
            return next(template(language.required, {campo: alias}))
        }
        if (!validateOptions.required && '' === value) {
            return next()
        }
    }
    let params = [value]
    let options = validateOptions.options
    if (options.params) {
        params = params.concat(options.params)
    }
    if (validate.hasOwnProperty('custom')) {
        if (SANITIZE === context.type) {
            params = {value: value}
        }
        params.push(next)
        validateOptions.function.apply(null, params)
    } else {
        let resultado = validateOptions.function.apply(null, params)
        if (VALIDATE === context.type) {
            return resultado ? next() : next(validateOptions.options.message)
        } else if (SANITIZE === context.type) {
            lodash.set(context.src, context.key, resultado)
            context.value = resultado
            return void next()
        }

        throw new TypeError(`Undefined middleware validation, use: validator.SANITIZE o validator.VALIDATE"`)
    }
}

/**
 *
 * @param {(String|Object)} rawValues
 * @param {String} key
 * @returns {{as: string, function: string, options: {params: null, message: string}, required: boolean}}
 */
function getValidationObject(rawValues, key) {
    let options = {
        as: key,
        function: '',
        options: {
            params: null,
            message: ''
        },
        required: true,
    }
    if (typeof rawValues === 'string') {
        validatorExists(rawValues)
        options.function = validator[rawValues]
        options.options.message = template(language[rawValues] || '', {campo: rawValues})
        return options
    }
    if (typeof rawValues === 'object') {
        const firstKey = Object.keys(rawValues).shift()
        if ('custom' === firstKey) {
            if (!rawValues.custom.hasOwnProperty('function')) {
                throw new Error('Custom validation needs an attribute named "function": { item: custom: {function(value, next){}} }')
            }
            options.function = rawValues.custom.function
        } else {
            validatorExists(firstKey)
            options.function = validator[firstKey]
        }
        options.options.params = rawValues[firstKey].params
        options.required = rawValues[firstKey].required
        options.as = rawValues[firstKey].as || key || firstKey
        options.options.message = rawValues[firstKey].message || template(language[firstKey] || '', {campo: options.as})
        return options
    }

    throw new Error('Validation options must be an object or and string(function name)')
}

/**
 *
 * @param {String} name
 */
function validatorExists(name) {
    if (!validator.hasOwnProperty(name)) {
        throw new Error(`Undefined validation function "${name}", see validator.`)
    }
}

/**
 *
 * @param {Object} expected
 * @param {Object} src
 * @param {Function} callback
 */
function removeNotExpected(expected, src, callback) {
    let final = {}
    loop(expected, (item, next) => {
        if ('string' === typeof item) {
            lodash.set(final, item, lodash.at(src.value[item]).shift() || null)
        } else {
            lodash.set(final, item.key, lodash.at(src.value[item.key]).shift() || null)
        }
        next()
    }, err => {
        src.value = final
        callback(err)
    }, 2)
}
