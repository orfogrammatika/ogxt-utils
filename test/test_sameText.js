var should = require('chai').should();

var sameText = require('../src/sameText');

const model = 'some text here with spaces';

describe('sameText', function () {
    it('should ignore multiple spaces', function () {
        const test = sameText('  some    text   here    with    spaces    ', model);
        test.should.equal(true);
    });
    it('should ignore line ends', function () {
        const test = sameText('  some \n\n\n text   here  \n \n \n\n \n with    spaces \n', model);
        test.should.equal(true);
    });
    it('should ignore tabs', function () {
        var test = sameText('  some \t\t text   here  \t \t \t\t \t with    spaces \t \t\t', model);
        test.should.equal(true);
    });
    it('should ignore caret returns', function () {
        var test = sameText('  some \r\r text   here  \r \r \r\r \r with    spaces \r \r\r', model);
        test.should.equal(true);
    });
    it('should ignore all white space chars', function () {
        var test = sameText('  some \t\n text   here  \r \n \n\n \t with    spaces \r \t\n', model);
        test.should.equal(true);
    });
});

