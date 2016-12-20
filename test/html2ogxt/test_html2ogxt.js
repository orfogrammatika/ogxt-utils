var should = require('chai').should();
var requireText = require('require-text');

var html2ogxt = require('../../src/html2ogxt');
var meta = require('../../src/meta');

function mkTest(name) {
    return function() {
        const src = requireText(`./${name}.html`, require);
        const test = html2ogxt(src);
        test.should.equal(meta.add(
            requireText(`./${name}.txt`, require),
            require(`./${name}.json`)
        ));
    }
}

describe('html2ogxt', function () {
    it('headers', mkTest('headers'));
    it('lists', mkTest('lists'));
    it('brs', mkTest('brs'));
});

