/**
 * Created by alejandro on 19/03/17.
 */

const loop = require('./looper')
const stage = require('./stage')
const normalizeParam = require('./helper').normalizeParams

module.exports = function optionsParser(stages, values, context, callback) {
    const fields = Object.keys(stages);
    loop(fields, function (field, next) {
        let param = normalizeParam(stages[field])
        stage({
            field: field,
            validations: param,
            values: values,
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