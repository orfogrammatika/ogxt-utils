var meta = require('../src/meta');

var DELIMITER = '\n------------------------------\n';
var m = {
    data: 'value'
};
var str = 'line1\n' +
    DELIMITER +
    'line2' +
    'line3' +
    DELIMITER;

describe('meta', function () {
    it('add', function () {
        var test = meta.add(str, m);
        test.should.equal(str + DELIMITER + JSON.stringify(m));
    });
    it('split', function () {
        var test = meta.strip(str + DELIMITER + JSON.stringify(m));
        test.should.equal(str);
    });
});