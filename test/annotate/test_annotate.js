var should = require('chai').should();
var requireText = require('require-text');
require('test-dom');

var annotate = require('../../src/annotate');

describe('annotate', function () {
    it('should be implemented', function () {
        var src = requireText('./annotate.in.html', require);
        var annotations = require('./annotate.annotated.json');
        var test = annotate(src, annotations);
        test.should.equal(
            requireText('./annotate.out.html', require)
        );
    });
});
