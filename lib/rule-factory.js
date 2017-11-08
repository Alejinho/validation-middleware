const Rule = require('./rule');
const rules = require('./rules');
const containers = require('./rule-container/');

/**
 *
 * @constructor
 * @property {AllOf} _container
 * @property {Object} _value
 */
function RuleFactory() {
    this._container = new containers.allOf();
    this._value = null;
    this._mapRules();
    this._mapContainers();
}

RuleFactory.prototype = {

    /**
     * @todo validar las reglas agregadas
     */
    val() {

    },

    /**
     *
     * @private
     */
    _mapRules() {
        const rulesKeys = Object.keys(rules);
        for (let rule of rulesKeys) {
            if (RuleFactory.prototype.hasOwnProperty(rule)) {
                console.warn('Overwriting: ' + rule);
            }

            RuleFactory.prototype[rule] = this._anyRule;
        }
    },

    /**
     *
     * @private
     */
    _mapContainers() {
        const containersKeys = Object.keys(containers);
        for (let container of containersKeys) {
            if (RuleFactory.prototype.hasOwnProperty(container)) {
                console.warn('Overwriting: ' + container);
            }

            RuleFactory.prototype[container] = this._anyContainer;
        }
    },

    /**
     *
     * @param options
     * @private
     */
    _anyRule(...options) {
        this._container.addRule([arguments.callee, options]);
    },

    /**
     *
     * @param arg
     * @private
     */
    _anyContainer(...arg) {
        let options = [];

        if (container.prototype.check.length < arg.length) {
            const difference = arg.length - container.check.length;
            for (let i = 0; i < difference; i++) {
                options.push(arg.pop());
            }
        }

        const container = new containers[arguments.callee](...options);
        const rules = this._popRules(arg.length);
        const rulesLength = rules.length;

        for (let i = 0; i < rulesLength; i++) {
            container.addRule(rules.pop());
        }

        this._container.addRule([container, rules]);
    },

    /**
     *
     * @param number
     * @returns {Array.<Rule>}
     * @private
     */
    _popRules(number) {
        let rules = [];
        for (let i = 0; i < number; i++) {
            rules.push(this._container.popRule());
        }

        return rules;
    }

};