var $ = require('jquery');

/**
 * Parse the text "title" taking first 40 chars of it
 * @param {string} text
 * @returns {string}
 */
module.exports = function parseTitle(text) {
    var arr = $.trim(text).replace(/[\\/:\*\?"<>|\.\r]/g, '').replace(/[\n\t\s]+/g, ' ').split(' ');
    arr = $.grep(arr, function (a) {
        return $.trim(a) != ''
    });
    var res = '';
    for (var i = 0; i < Math.min(5, arr.length); i++) {
        if (i > 0) {
            res += ' ';
        }
        res += arr[i];
    }
    res = res.substring(0, 40) + '…';
    return res;
};

