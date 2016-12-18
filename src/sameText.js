var _ = require('lodash');

function _normalizeText(/**String*/str) {
    var lines = str.split('\n');
    lines = _(lines).map(function(line){
        return line.trim();
    });
    return lines.join('\n').replace(/\s+/g, ' ').trim();
}

/**
 * Compare two texts are same ignoring the space chars
 * @param {string} str1
 * @param {string} str2
 * @returns {boolean}
 */
module.exports = function sameText(str1, str2) {
    var nstr1 = _normalizeText(str1);
    var nstr2 = _normalizeText(str2);
    return nstr1 == nstr2;
};
