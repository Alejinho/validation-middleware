/**
 * Created by alejandro on 18/03/17.
 */

const todoDone = false;
let HttpError = Error;
let errorParams = null;

exports = module.exports = setHttpError;

/**
 * Set the default http error class
 *
 * @todo Parameters should work using some Dependency Injection
 * @param constructor
 * @param params
 */
function setHttpError({constructor, params}) {
    HttpError = constructor;
    errorParams = params
}

exports.genError = function genError(message, context) {
    return new HttpError(buildErrorParams(message, context))
};

// TODO
function buildErrorParams(message, context) {
    if (!errorParams || !todoDone) {
        return message;
    }
}