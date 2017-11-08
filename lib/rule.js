/**
 *
 * @constructor
 * @property {String} message
 */
function Rule() {
    this.message = 'Validator message';
}

/**
 *
 * @param value
 * @returns {Promise.<Boolean>}
 */
Rule.prototype.check = function (value) {
    return Promise.reject(Error('Your stub here.'));
};

module.exports = Rule;