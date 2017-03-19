/**
 * Created by alejandro on 18/03/17.
 */

const fs = require('fs')
const folder = '../lang'
let currentLanguage = 'en_US'
let language = require(`${folder}/${currentLanguage}`)

exports = module.exports = setLang

exports.getMessage = getMessage

function setLang(newLang, callback) {
    const path = `${folder}/${newLang}`
    fs.stat(path, function (error) {
        if (error) {
            return void notAvailableLanguageError(newLang, callback)
        }
        currentLanguage = newLang
        language = require(path)
        callback(null)
    })
}

function getMessage(functionName) {
    return language[functionName]
}

function notAvailableLanguageError(newLang, callback) {
    availableLanguages(function (available) {
        let message = `Currently we do not support this language (${newLang}), feel free to add it.`
        message += available.join(', ') + '.'
        callback(new Error(message))
    })
}

function availableLanguages(callback) {
    fs.readdirSync(folder, function (err, languages) {
        if (err) throw err
        callback(languages)
    })
}