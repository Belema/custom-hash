'use strict';

var hash = require('../lib/custom-hash');

describe('custom-hash', function () {
    beforeEach(function () {
        hash.configure();
    });

    it('should return full MD5 by default', function () {
        var output = hash.digest('Hello World!');

        output.should.equal('ed076287532e86365e841e92bfc50d8c');
    });

    describe('charSet config option', function () {
        it('allows to define the characters used in the output', function () {
            hash.configure({ charSet: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'u', 'v', 'w', 'x', 'y', 'z' ] });

            var output = hash.digest('Hello World!');

            output.should.equal('yx076287532y86365y841y92vzw50x8w');
        });

        it('allows to change the base of the output (base 4)', function () {
            hash.configure({ charSet: [ '0', '1', '2', '3' ] });

            var output = hash.digest('Hello World!');

            output.should.equal('3231001312022013110302322012031211322010013221022333301100312030');
        });

        it('allows to change the base of the output (base 10)', function () {
            hash.configure({ charSet: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ] });

            var output = hash.digest('Hello World!');

            output.should.equal('315065379476721403163906509030895717772');
        });

        it('should return empty string when set to empty', function () {
            hash.configure({ charSet: [] });

            var output = hash.digest('Hello World!');

            output.should.equal('');
        });

        it('allows for characters to represent several values', function () {
            hash.configure({ charSet: [ 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'm', 'm', 'm', 'm', 'm', 'm' ] });

            var output = hash.digest('Hello World!');

            output.should.equal('mmdddddddddmdddddmdddmddmmmddmdm');
        });
    });

    describe('maxLength config option', function () {
        it('should be set to 128 by default', function () {
            hash.configure({ charSet: [ 'x' ] });

            var output = hash.digest('Hello World!');

            output.should.equal('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        });

        it('should return empty string when set to zero', function () {
            hash.configure({ charSet: [ 'x' ], maxLength: 0 });

            var output = hash.digest('Hello World!');

            output.should.equal('');
        });

        it('should return empty string when set to a negative value', function () {
            hash.configure({ charSet: [ 'x' ], maxLength: -10 });

            var output = hash.digest('Hello World!');

            output.should.equal('');
        });
    });

    describe('right config option', function () {
        it('should be false by default', function () {
            hash.configure({ maxLength: 10 });

            var output = hash.digest('Hello World!');

            output.should.equal('ed07628753');
        });

        it('should return first numbers when set to false', function () {
            hash.configure({ maxLength: 10, right: false });

            var output = hash.digest('Hello World!');

            output.should.equal('ed07628753');
        });

        it('should return last numbers when set to true', function () {
            hash.configure({ maxLength: 10, right: true });

            var output = hash.digest('Hello World!');

            output.should.equal('92bfc50d8c');
        });
    });
});
