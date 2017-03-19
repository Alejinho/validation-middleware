/**
 * Created by alejandro on 18/03/17.
 */

let HttpError = Error;
let errorParams = null;

exports = module.exports = function setHttpError({constructor, params}) {
    HttpError = constructor;
    errorParams = params
};

exports.genError = function genError(message, context) {
    return new HttpError(buildErrorParams(message, context))
};

function buildErrorParams(message, context) {
    if (!errorParams) {
        return message;
    }
    // TODO contruir un mensaje personalizado.
}