var should = require('chai').should();

var parseTitle = require('../src/parseTitle');

describe('parseTitle', function () {
    it('should be implemented', function () {
        var test = parseTitle('title');
        test.should.equal('title…');
    });
});
