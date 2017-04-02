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

exports = module.exports = middleware

exports.setHttpError = setHttpError

exports.setLang = require('./lib/language-manager')

function middleware(options, src = 'body', context = 'request') {
    return function (request, response, next) {
        // Context of the items to be evaluated
        let source = defineContext(src, request, response);
        // Reference to elements we want to know to make rule customizable
        let data = defineContext(context, request, response);

        begin(options, source, data, function (err) {
            if (err) return void next(genError(err.toString()))
            next()
        })
    }
}

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