/**
 * Created by alejandro on 20/02/17.
 */
'use strict';

const validator = require('../index');
const should = require('chai').should();

describe('Deberia obtener...', function () {
    let middleware = validator({
        'user.uuid': {
            required: false,
            custom: {
                function(value, options, next){
                    setTimeout(function () {
                        const maxLimit = options.maxLimit
                        next(value < maxLimit ? new Error('Range error') : '')
                    }, 1)
                },
                params: {
                    maxLimit: 10
                },
                required: false
            }
        },
        _id: 'isMongoId',
        email: {
            required: true,
            isEmail: {
                sanitize: {
                    normalizeEmail: {}
                }
            },
        },
        nombre: 'isAlpha',
        url: {
            isURL: {
                params: {protocols: 'http', require_protocol: true},
                message: 'La url no es valida.',
            }
        },
    });

    it('Deberia indicar que el una url con el protocolo https no es valida', function (done) {
        middleware({body: {url: 'https://www.npmjs.com', cedula: '123456'}}, {}, err => {
            err.should.be.instanceOf(Error);
            err.message.should.match(/La url no es valida\./);
            done();
        })
    });

    it('Deberia indicar que el una url con el protocolo http es valida', function (done) {
        middleware({body: {url: 'http://www.npmjs.com'}}, {}, err => {
            err.should.be.instanceOf(Error);
            err.message.should.not.match(/La url no es valida\./);
            done();
        })
    });

    it('Deberia indicar que el Id de mongo suministrado no es valido', function (done) {
        middleware({body: {_id: '507f191ez10c19729de860ea'}}, {}, err => {
            err.should.be.instanceOf(Error);
            err.message.should.match(/The _id must be a mongo id\./);
            done();
        })
    });

    it('Deberia mostrar que el campo suministrado email no es valido', function (done) {
        middleware({body: {email: 'No es un email'}}, {}, err => {
            err.should.be.instanceOf(Error);
            err.message.should.match(/The email must be a valid email address\./);
            done();
        })
    });

    it('Deberia convertir "true" en un booleano', function (done) {
        middleware = validator({
            verdadero: 'isBoolean'
        });
        let request = {body: {verdadero: 'true'}};
        middleware(request, {}, err => {
            request.body.verdadero.should.be.true;
            done(err);
        })
    });

    it('Deberia eliminar los tags html', function (done) {
        middleware = validator({
            htmlCode: {
                required: {
                    params: true,
                    sanitize: 'escape'
                }
            }
        });
        let request = {body: {htmlCode: '<a href="/url?sa=t&amp;rct=j&amp;q=&amp;esrc=s&amp;source=web&amp;cd=2&amp;cad=rja&amp;uact=8&amp;ved=0ahUKEwie8Yfv0a7SAhUD7iYKHdf4D6YQFggnMAE&amp;url=https%3A%2F%2Fwww.troyhunt.com%2Funderstanding-xss-input-sanitisation%2F&amp;usg=AFQjCNEQyocfHRboh5iMfViHnaBmHUBgJg&amp;sig2=MW7iOQh65diz1gZLQd2_Bw" onmousedown="return rwt(this,\'\',\'\',\'\',\'2\',\'AFQjCNEQyocfHRboh5iMfViHnaBmHUBgJg\',\'MW7iOQh65diz1gZLQd2_Bw\',\'0ahUKEwie8Yfv0a7SAhUD7iYKHdf4D6YQFggnMAE\',\'\',\'\',event)" data-href="https://www.troyhunt.com/understanding-xss-input-sanitisation/">Troy Hunt: Understanding XSS – input sanitisation semantics and ...</a>'}};
        middleware(request, {}, err => {
            request.body.htmlCode.should.not.match(/(<|>)/);
            done(err);
        })
    })
});