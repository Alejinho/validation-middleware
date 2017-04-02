/**
 * Created by Alejandro Rivera on 5/02/17.
 */
'use strict'

const validator = require('validator')
const lodash = require('lodash')
const setHttpError = require('./lib/http-error')
const genError = require('./lib/http-error').genError
const template = require('string-template')
const begin = require('./lib/options-parser')

/**
 *
 * @type {middleware}
 */
exports = module.exports = middleware

/**
 * Set the class of the error that will be thrown in a error case
 */
exports.setHttpError = setHttpError

/**
 * Useful for internationalisation
 *
 * @type {setLang}
 */
exports.setLang = require('./lib/language-manager')

/**
 * Executes validations for each stages from the list. Example
 * {
 *   htmlCode: {
 *     required: {  <-- First stage
 *       params: true,
 *       sanitize: 'escape'
 *     },
 *     <validation function>: '' <-- Second stage
 *   }
 * }
 *
 * Fist, it will execute que 'required' validation, if parameter exists
 * then it will execute the 'escape' sanitize function, what does it means?
 *
 * 1- Validation function exists
 *   - Y. Execute
 *   - N. Throws an error
 * 2- Validation passes
 *   - Y. Look for sanitize field
 *     - Y. If it's false
 *       - Y. Next stage
 *       - N. Look for a sanitize function named like validation "isBoolean", "isInt"
 *     - Y. Accepts an object similar to the validation item
 *     - If sanitize function doesn't exists, go to the next stage
 *   - N. Look for a sanitize function named like validation "isBoolean", "isInt"
 *
 * @param options
 * @param src - Context of the items to be evaluated
 * @param context - Reference to elements we want to know to make rule customizable
 * @returns {Function}
 */
function middleware(options, src = 'body', context = 'request') {
    return function (request, response, next) {
        let source = defineContext(src, request, response);
        let data = defineContext(context, request, response);

        begin(options, source, data, function (err) {
            if (err) return void next(genError(err.toString()))
            next()
        })
    }
}

/**
 * Depending of the context name it choose a variable as a source
 *
 * @param context
 * @param request
 * @param response
 * @returns {*}
 */
function defineContext(context, request, response) {
    if (context === 'context') {
        return {
            request: request,
            response: response
        }
    }
    if (context === 'request') {
        return request
    }
    if (context === 'response') {
        return response
    }

    return request[context];
}