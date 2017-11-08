/**
 * Created by Alejandro Rivera on 20/02/17.
 */

'use strict';

exports = module.exports = loopAsync

/**
 * Iterates over an object or an array asyncronously
 *
 * @param {Array} array - Items to iterate
 * @param {loopAsync~nextCallback} callback
 * @param {loopAsync~finishCallback} finish
 * @param {Number} [maxTick=3] - Times functions are called without nextTick
 * @returns {void}
 */
function loopAsync(array, callback, finish, maxTick = 3) {
    let source = array
    const isArray = Array.isArray(array)
    const isObject = typeof array === 'object'
    let counter = 0
    if (!isArray && !isObject) {
        throw new TypeError('Debe suministrar un arreglo o un objeto')
    }
    const keys = Object.keys(source)
    let errors = null
    return loop(source)

    /**
     * Initialize the iteration, if out internal counter is bigger than
     * the default value it will be processed in the next tick
     *
     * @param source
     * @param index
     */
    function loop(source, index = 0) {
        counter++
        let item = null
        if (isArray) {
            item = source[keys[index]]
        } else {
            item = {
                value: source[keys[index]],
                key: keys[index]
            }
        }

        if (counter < maxTick) {
            callback(item, next)
        } else {
            process.nextTick(function () {
                callback(item, next)
            })
        }

        /**
         * @type {loopAsync~callNext}
         */
        function next(error, endLoop) {
            if (error) {
                errors = errors || [];
                errors.push(error)
            }
            if (exports.END_LOOP === endLoop) {
                return void process.nextTick(function () {
                    finish(errors)
                })
            }
            if (!keys[index + 1]) {
                process.nextTick(function () {
                    finish(errors)
                })
            } else {
                loop(source, index + 1)
            }
        }
    }
}

/**
 * @callback loopAsync~nextCallback
 * @param {Object} item
 * @param {loopAsync~callNext} next - Go next item
 */

/**
 * @callback loopAsync~finishCallback
 * @param {null|Array.<Error>} errors
 */

/**
 * Function that trigger next item in the stack, if
 * first parameters is a trutly value it will be added to the error list
 *
 * @callback loopAsync~callNext
 * @param {Array.<Error>|null} errors - Error information
 * @returns {void}
 */

/**
 * Used to trigger the finish callback earlier.
 *
 * @type {Symbol}
 */
exports.END_LOOP = Symbol('endLoop')