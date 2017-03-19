/**
 * Created by Alejandro Rivera on 5/02/17.
 */
'use strict'

const validator = require('validator')
const lodash = require('lodash')
const setHttpError = require('./lib/http-error')
const template = require('string-template')
const begin = require('./lib/options-parser')

exports = module.exports = middleware

exports.setHttpError = setHttpError

exports.setLang = require('./lib/language-manager')

function middleware(options, src = 'body', context = 'request') {
    return function (request, response, next) {
        let source = defineContext(src, request, response);
        let data = defineContext(context, request, response);

        begin(options, source, data, function (err) {
            next(err)
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