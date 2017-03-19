/**
 * Created by alejandro on 19/03/17.
 */

const loop = require('./looper')
const stage = require('./stage')

module.exports = function optionsParser(stages, values, context, callback) {
    const fields = Object.keys(stages);
    loop(fields, function (field, next) {
        let param = normalizeParam(stages[field])
        stage({
            field: field,
            validations: param,
            value: values[field],
            context: context,
            next: next
        })
    }, function (error) {
        stageFilter(error, callback)
    })
};

function stageFilter(error, callback) {
    // TODO Implementar una validación del resultado de los stages.
    callback(error)
}

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
    throw new TypeError('Validation stages must be an array of string, objects or and object with first level key as function validation name.');
}