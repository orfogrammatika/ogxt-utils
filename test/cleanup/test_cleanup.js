var should = require('chai').should();
var requireText = require('require-text');
require('test-dom');

var cleanup = require('../../src/cleanup');

describe('cleanup', function () {
    describe('html', function(){

        function mkTest(name, annotations) {
            return function() {
                const src = requireText('./html/' + name + '.in.html', require);
                const test = cleanup.html(src, annotations);
                test.should.equal(
                    requireText('./html/' + name +'.out.html', require)
                );
            }
        }

        it('should cleanup styles', mkTest('styles'));
        it('should cleanup scripts', mkTest('scripts'));
        it('should cleanup empty spans', mkTest('empty-spans'));
        it('should cleanup line breaks', mkTest('line-breaks'));
        it('should cleanup annotations', mkTest('annotations', true));
    });
    describe('annotations', function(){
        it('should be implemented', function () {
            const src = requireText('./annotations/annotations.in.html', require);
            const test = cleanup.annotations(src);
            test.should.equal(
                requireText('./annotations/annotations.out.html', require)
            );
        });
    });
});
