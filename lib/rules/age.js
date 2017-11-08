const Validator = require('../rule');

/**
 *
 * @param {number} min
 * @param {number} max
 * @constructor
 */
function Age(min, max) {
    Age.super_.call(this, {
        min: min,
        max: max
    });
}

Age.super_ = Validator;
Object.setPrototypeOf(Age.prototype, Validator.prototype);

Age.prototype.check = function (value) {
    value = parseInt(value);
    if (this.options.min && this.options.max) {
        return value >= this.options.min && this.options.max >= value;
    }

    if (this.options.min) {
        return value >= this.options.min;
    }

    if (this.options.max) {
        return this.options.max >= value;
    }

    throw new Error('Parameters "min" or "max" must be set.');
};