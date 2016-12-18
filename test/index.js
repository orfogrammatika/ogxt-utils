var should = require('chai').should(),
    ogxt = require('../src/index');

describe('test', function() {
    it('works', function() {
        const five = 5;
        five.should.equal(5);
    });
});

// function _htmlText(html) {
//     var $div = $('<div></div>');
//     $div.html(html);
//     return $div.text();
// }
//
// function _testCleanup(src, test) {
//     var result = cleanupHtml(src, true);
//     var srcText = _htmlText(src);
//     var resultText = _htmlText(result);
//     if (!sameText(test, result)) {
//         console.debug('testCleanupHtml FAILED!');
//         console.debug('expected: <code>', test, '</code>');
//         console.debug('received: <code>', result, '</code>');
//     } else if (!sameText(srcText, resultText)) {
//         console.debug('testCleanupHtml FAILED!');
//         console.debug('input: <code>', srcText, '</code>');
//         console.debug('output: <code>', resultText, '</code>');
//     } else {
//         console.debug('testCleanupHtml SUCCESS!');
//     }
// }
//
// function testCleanupHtml() {
//     var src = '<p style="padding-left: 30px;"><em>В&nbsp;<span class="annotation mkYo start end small" data-annotation-idx="0" data-annotation="80" data-kind="mkYo">Соединенных</span> Штатах S&amp;P<span class="annotation mkTypography start end small" data-annotation-idx="0" data-annotation="85" data-kind="mkTypography"></span>), большинство в&nbsp;<span class="annotation mkYo start end small" data-annotation-idx="0" data-annotation="87" data-kind="mkYo">Соединенных</span> Штатах приблизительно 5%<span class="annotation mkTypography start end small active" data-annotation-idx="0" data-annotation="88" data-kind="mkTypography"></span>.</em></p>';
//     var test = '<p style="padding-left: 30px;"><em>В&nbsp;Соединенных Штатах S&amp;P), большинство в&nbsp;Соединенных Штатах приблизительно 5%.</em></p>';
//     _testCleanup(src, test);
//     src = '<p>привет</p>\n' +
//         '<p>пока</p>\n' +
//         '<p>&nbsp;</p>';
//     test = '<p>привет</p>\n' +
//         '<p>пока</p>\n' +
//         '<p>&nbsp;</p>';
//     _testCleanup(src, test);
// }
//
// function testNormalizeText() {
//     var src = '  some \n\n\n text   here  \n \n \n\n \n with    spaces \t \r\n';
//     var test = 'some text here with spaces';
//     var result = _normalizeText(src);
//     if (test != result) {
//         console.debug('testNormalizeText FAILED!');
//         console.debug('expected: <code>', test.trim(), '</code>');
//         console.debug('received: <code>', result.trim(), '</code>');
//     } else {
//         console.debug('testCleanupHtml SUCCESS!');
//     }
// }
//
