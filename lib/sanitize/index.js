/**
 * Created by alejandro on 19/03/17.
 */

const validator = require('validator')

module.exports = {
    'isBoolean': require('./is-boolean'),
    'isDate': require('./is-date'),
    'isInt': require('./is-int'),
    'isFloat': require('./is-float'),
    'isMongoId': require('./is-mongo-id'),
    'blacklist': validator.blacklist,
    'escape': validator.escape,
    'unescape': validator.unescape,
    'ltrim': validator.ltrim,
    'normalizeEmail': validator.normalizeEmail,
    'rtrim': validator.rtrim,
    'stripLow': validator.stripLow,
    'trim': validator.trim,
    'whitelist': validator.whitelist,
}