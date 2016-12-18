var _ = require('lodash');

var DELIMITER = '\n------------------------------\n';

module.exports = {
    /**
     * Add meta to OGXT text
     * @param {string} text
     * @param {object} specials
     * @returns {string}
     */
    add: function (text, specials) {
        return text + DELIMITER + JSON.stringify(specials);
    },
    /**
     * Strip meta from OGXT text
     * @param {string} text
     * @returns {string}
     */
    strip: function (text) {
        var res = _.split(text, DELIMITER);
        if (_.size(res) > 1) {
            res = _.slice(res, 0, _.size(res) - 1);
        }
        return _.join(res, DELIMITER);
    }
};