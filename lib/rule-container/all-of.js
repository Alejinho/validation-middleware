const Container = require('./rule-container');
const looper = require('../looper');

/**
 *
 * @constructor
 */
function AllOf() {
    this.super_.apply(this, []);
}

AllOf.super_ = Container;
Object.setPrototypeOf(AllOf.prototype, Container.prototype);

/**
 *
 * @param value
 * @param everyRule
 * @param {Function} callback
 * @returns {Promise.<Array.<Error>|null>}
 */
AllOf.prototype.check = function (value, {everyRule, callback}) {
    try {
        this._checkRules();
    } catch (error) {
        return Promise.reject(error);
    }

    looper(this._rules, (rule, next) => {
        let [callback, options] = rule;
        const ruleExecutable = new callback(...options);
        const result = ruleExecutable.check(value);

        Promise
            .resolve(result)
            .then(result => {
                next(result ? null : ruleExecutable.message, everyRule ? null : looper.END_LOOP)
            })
            .catch(error => {
                next(error, everyRule ? null : looper.END_LOOP)
            })

    }, callback | returlErrors);
};

/**
 *
 * @param {Array.<Error>} errors
 */
function returlErrors(errors) {
    return errors;
}

module.exports = AllOf;
