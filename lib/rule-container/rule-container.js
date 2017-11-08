const Rule = require('../rule');

/**
 *
 * @constructor
 * @property {Array.<Array.<Function, Object>>} _rules
 */
function RuleContainer() {
    this._rules = [];
}

RuleContainer.super_ = Rule;
Object.setPrototypeOf(RuleContainer.prototype, Rule.prototype);

/**
 *
 * @param {Function} callback
 * @param {Object} options
 */
RuleContainer.prototype.addRule = function (callback, options) {
    this._rules.push([callback, options]);
};

/**
 *
 * @returns {Array.<Function, Object>}
 */
RuleContainer.prototype.popRule = function () {
    return this._rules.pop();
};

/**
 *
 * @private
 * @throws {Error} If there's no rule on the container
 */
RuleContainer.prototype._checkRules = function () {
    if (!this._rules.length) {
        throw new Error('RuleContainer mush have at least one function.');
    }
};

module.exports = RuleContainer;
