'use strict';

var crypto = require('crypto');

var DEFAULTS = {
    charSet: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ],
    maxLength: 128,
    right: false
};

var config = {
    charSet: DEFAULTS.charSet,
    maxLength: DEFAULTS.maxLength,
    right: DEFAULTS.right
};

function add (x, y, base) {
    var value, digit, carry;
    var output = [];
    var length = Math.max(x.length, y.length);

    for (var i = 0; i < length; i++) {
        value = (x[i] || 0) + (y[i] || 0) + (carry || 0);
        digit = value % base;
        carry = (value - digit) / base;
        output.push(digit);
    }

    return (carry > 0) ? output.concat(carry) : output;
}

function multiply (x, y, base) {
    var value, digit, carry, offset, summand;

    return x.reduce(function (sum, currentX, lengthX) {
        offset = Array.apply(null, new Array(lengthX)).map(function () { return 0; });

        summand = y.reduce(function (previous, currentY, lengthY) {
            value = currentX * currentY + previous.carry;
            digit = value % base;
            carry = (value - digit) / base;

            if (lengthY === y.length - 1 && carry > 0) {
                return { output: previous.output.concat(digit, carry), carry: carry };
            } else {
                return { output: previous.output.concat(digit), carry: carry };
            }
        }, { output: offset, carry: 0 }).output;

        return add(sum, summand, base);
    }, []);
}

function numberInBase (value, base) {
    var output = [];

    while (value > 0) {
        var digit = value % base;
        output.push(digit);
        value = (value - digit) / base;
    }

    return output;
}

function configure (options) {
    config = {
        charSet: DEFAULTS.charSet,
        maxLength: DEFAULTS.maxLength,
        right: DEFAULTS.right
    };

    if (options && options.charSet && Array.isArray(options.charSet)) {
        config.charSet = options.charSet;
    }
    if (options && typeof options.maxLength === 'number') {
        config.maxLength = options.maxLength;
    }
    if (options && typeof options.right === 'boolean') {
        config.right = options.right;
    }
}

function digest (input) {
    if (config.maxLength < 1 || config.charSet.length < 2) {
        return Array.apply(null, new Array(Math.max(config.maxLength, 0)))
            .map(function () { return config.charSet[0] || ''; })
            .join('');
    }

    var md5 = crypto.createHash('md5').update(input).digest('hex')
        .split('')
        .map(function (digit) { return parseInt(digit, 16); });

    var base = config.charSet.length;
    var sixteen = numberInBase(16, base);

    var output = md5.reduce(function (value, current) {
        return add(multiply(value, sixteen, base), numberInBase(current, base), base);
    }, []).map(function (digit) {
        return config.charSet[digit];
    }).reverse().join('');

    if (config.maxLength >= output.length) {
        return output;
    }

    return config.right ? output.substr(-config.maxLength) : output.substr(0, config.maxLength);
}

module.exports = {
    configure: configure,
    digest: digest
};
