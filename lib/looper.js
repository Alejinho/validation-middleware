/**
 * Created by Alejandro Rivera on 20/02/17.
 */

'use strict';

exports = module.exports = function (array, callback, finish, repeticiones = 3) {
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

        if (counter < repeticiones) {
            callback(item, next)
        } else {
            process.nextTick(function () {
                callback(item, next)
            })
        }

        function next(error, endLoop) {
            if (error) {
                errors = errors || []
                errors.push(error.toString())
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

exports.END_LOOP = Symbol('endLoop')