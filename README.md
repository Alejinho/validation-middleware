validation-middleware
====================
[![NPM version][npm-badge]](https://www.npmjs.com/package/validation-middleware)
[![NPM downloads][npm-d-badge]](https://www.npmjs.com/package/validation-middleware)
[![Build Status][travis-badge]](https://travis-ci.org/Alejinho/validation-middleware)


Flexible **asynchronous** validation middleware to sanitize and validate parameters
at the same time.
Based on [validator](https://www.npmjs.com/package/validator).

Installing
----------
```sh
npm install validation-middleware
```

Use
----------

Which parameters does it receive? `options, source = 'body', context = 'request'`. 

First param, `options`, this field is an object with the items you want to validate, e.g:

```javascript 
{
    _id: 'isMongoId',
    date: ['required', 'isDate'], // By default the parameters are not required
    website: {
        required: true,
        isUrl: {
            params: {           
                protocols: ['https'],
                require_host: true       
            }
        }
    }
}
```

The second param, `source`, it will tell middleware function where to find 
values to validate, by default it uses `body` key, but here you can find 
the same rules of the next item.

The third param, `context`, it will specify an object useful if you want
to set your custom function and then have multiple options; those string values are allowed:
1. `context` will return an object `{request: ..., response: ..}`
2. `request` or `response`, ___by default we use___ `request`
3. Any key in the request object.

Validators
----------

Those are the available attributes for a validation stage.
```javascript
{
    // Dot notation is allowed
    'field.name': { 
        <validation function name>:{
            // Everything here is optional 
            
            // It will be passes as parameters to the validation
            // function, if it needs more than 1 parameter
            // you should set an array
            params: <params>,
            
            // There's some custom messages, but you can specify it.
            message: "Custom message, {{campo}} reference to the filed name",
                                         ^
                                ----------
            as: "It replace 'campo' value",
            sanitize: {
                // Sanitize stages that will be called if validation passes
                // Same rules of validation are allowed here
            }
        }
    }
}

```

It's flexible because there's different ways to make a validation middleware, you can 
define custom functions too:

```javascript 
{
    email: ['required', 'isEmail'],
    name: 'required',
    'user.name': {
        required: true,                        // First validation stage
        custom: {                              // Second validation stage
            function(value, pattern, next){   
                return value.match(pattern)
            },
            params: /.*/ig
        },
        ...                                   // Other stages
    }
}
```

[This is a list](validation-list) with the allowed validation function names, `required` validation stage is different, 
if it's set to false and the value from the source is empty the next stages are skipped.


Some functions have associated sanitizers functions by default:
1. isBoolean
2. isDate
3. isInt
4. isFloat
5. isMongoId
6. There's other sanitize function that [could be assigned](sanitizer-list)

If you want to avoid this behavior you should specify it, otherwise next middleware functions
will get updated values:

```javascript 
{
    'product._id': {
        required: true,
        isMongoId: {
            sanitize: false
        }
    }
}
```

Error case
----------
You can set your own error constructor, then an instance of this will be passed 
to the next express middleware

```javascript
function ValidationError(message) {
    Error.call(this)
    this.message = message
}

Object.setPrototypeOf(ValidationError.prototype, Error.prototype);

require('validation-middleware').setHttpError({
    constructor: ValidationError
});

middleware = validator({
    email: ['required', 'isEmail']
});

middleware(request, response, err => {
    err.should.be.instanceOf(ValidationError);
    err.should.be.instanceOf(Error);
    err.message.should.match(/The email must be a valid email address\./);
})
```


Example
-------

```javascript
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
    });

// request.body = {
//   user: {
//     uuid: '9'
//   },
//   _id: '51b14c2de8e185801f000006',
//   email: 'EXAMPLE@ACME.COM',
// }
app.get('/', middleware, function(request, response, next){
    // request.body = {
    //   _id: ObjectId('51b14c2de8e185801f000006'),
    //  email: 'example@acme.com' 
    // }
    //
});

```

## TODO

1. Add support for more languages.
+ en_US should have better error messages.
+ See [validator](https://www.npmjs.com/package/validator) and add more error messages for
other functions.
2. Support for custom errors.
3. `process.nextTick` is called every 3 times, it should be customizable.
4. Make it better.

[npm-badge]: https://img.shields.io/npm/v/validation-middleware.svg
[npm-d-badge]: https://img.shields.io/npm/dt/validation-middleware.svg
[travis-badge]: https://img.shields.io/travis/Alejinho/validation-middleware.svg
[sanitizer-list]: https://www.npmjs.com/package/validator#sanitizers
[validation-list]: https://www.npmjs.com/package/validator#validators