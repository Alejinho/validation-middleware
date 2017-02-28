validation-middleware
====================
[![NPM version][npm-badge]](https://www.npmjs.com/package/validation-middleware)
[![NPM downloads][npm-d-badge]](https://www.npmjs.com/package/validation-middleware)
[![Build Status][travis-badge]](https://travis-ci.org/Alejinho/validation-middleware)


Flexible **asynchronous** validation middleware to sanitize and validate parameters. 
Based on [validator](https://www.npmjs.com/package/validator).

[npm-badge]: https://img.shields.io/npm/v/validation-middleware.svg
[npm-d-badge]: https://img.shields.io/npm/dt/validation-middleware.svg
[travis-badge]: https://img.shields.io/travis/Alejinho/validation-middleware.svg

Installing
----------
```sh
npm i validation-middleware -S
```

General use:
```javascript
const validator = require('validation-middleware')
const sanitize = require('validation-middleware').sanitize
const VALIDATE = require('validation-middleware').VALIDATE
const SANITIZE = require('validation-middleware').SANITIZE

validator(
    {
        itemToValidate: {
            validationFunction: {...}
        }
    },
    'request attribute to evaluate, default to "body"',
    'VALIDATE|SANITIZE default to VALIDATE'
)
```

It removes everything from the target object that is not
specified in the validator options

```javascript
const middleware = validator({email: 'isEmail', password: 'isAlfa'})
// request.body = {state: 'nonActive', email: 'john@acme.co', password: '12'}
app.get('/login', (req, res, next) => {
    // req.body = {email: 'john@acme.co', password: '12'}
})
```

Validation use:

```javascript
const validator = require('validation-middleware')
const i18n = require('validation-middleware').i18n

// TODO Add support, default to es_CO
i18n('en_US')

const middleware = validator({
        _id: 'isMongoId',

        email: {
            isEmail: {
                required: false,
            },
        },

        name: ['isAlpha', {
            contains: {
                params: 'My name is: ',
                
                // If it's not valid error message should be
                // The field otherName is not valid
                as: 'otherName'
            }
        }],

        url: {
            isURL: {
                params: {protocols: 'http', require_protocol: true},
                message: 'La url no es valida.',
            }
        },
    })

// If there is an error, it throwns an Http 409 error (standard-http-error module)    
app.get('/path', middleware, (req, res, next) => {
    // Parameters were valid
})
```
Custom validation function:

```javascript
function validateLimit(value, {maxLimit}, next){
    const result = value > maxLimit 
        ? 'My error message or new Error("Custom error")' 
        : ''
    
    // Trutly values are errors and error.toString() is 
    // shown like error message
    next(result)
}

let middleware = validator({
    limit: {
        custom: {
            function: validateLimit,
            params: {
                maxLimit: 10
            },
            required: false
        }
    }
    
// Evaluating request.params    
}, 'params')
```

Sanitize use:

```javascript
const sanitize = require('validation-middleware').sanitize
const middleware = sanitize({   
    // strict
    stringTrue: ['trim', {toBoolean: {params: true}}]
})

app.use(middleware)

let request = {body: {stringTrue: '   true \n  '}}
// body.stringTrue.should.be.true
```

## TODO

1. Add support for more languages.
2. Support for custom errors.
3. `process.nextTick` is called every 3 times, it should be customizable.
4. Make it better.