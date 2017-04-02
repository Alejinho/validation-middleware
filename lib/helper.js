/**
 * Created by alejandro on 19/03/17.
 */

'use strict';

exports.normalizeParams = normalizeParam;

/**
 * It makes possible to use different type of input values, example:
 *
 * {
 *   'htmlCode.text': 'isMongoId',
 *   htmlCode: ['required', 'isDate'],
 *   htmlCode: {
 *     required: true,
 *     isMongoId: {},
 *     isDate: {}
 *   },
 *   htmlCode: [{required: true}, 'isDate'],
 * }
 *
 * @param item
 * @returns {*}
 */
function normalizeParam(item) {
    if (Array.isArray(item)) {
        return item
    }
    if ('string' === typeof item) {
        return [item]
    }
    if ('object' === typeof item) {
        let result = [];
        for (let index in item) {
            if (item.hasOwnProperty(index)) {
                result.push({[index]: item[index]})
            }
        }
        return result;
    }
    throw new TypeError('Stages must be an array of string, objects or and object with first level key as function validation name.');
}