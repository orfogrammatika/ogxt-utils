var should = require('chai').should();

require('test-dom');

var $ = require('jquery')(global.window);

var replaceWithContent = require('../src/replaceWithContent');

describe('replaceWithContent', function () {
    it('one level jQuery object', function () {
        var test = $('<div>' +
            '<span>some text</span> split <span>with spans</span>' +
            '</div>');
        replaceWithContent(test, 'span');
        test.html().should.equal('some text split with spans')
    });
    it('one level function', function () {
        var test = $('<div>' +
            '<span>some text</span> split <span>with spans</span>' +
            '</div>');
        var func = function(){
            return test.find('span');
        };
        replaceWithContent(func);
        test.html().should.equal('some text split with spans')
    });
    it('multple levels jQuery object', function(){
        var test = $('<div>' +
            '<span>some <span>text</span></span> split <span><span>with<span> </span></span>spans</span>' +
            '</div>');
        replaceWithContent(test, 'span');
        test.html().should.equal('some text split with spans')
    });
    it('multiple levels function', function(){
        var test = $('<div>' +
            '<span>some <span>text</span></span> split <span><span>with<span> </span></span>spans</span>' +
            '</div>');
        var func = function(){
            return test.find('span');
        };
        replaceWithContent(func);
        test.html().should.equal('some text split with spans')
    });
});
