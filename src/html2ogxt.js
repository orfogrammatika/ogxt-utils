var meta = require('./meta');
var htmlparser = require('htmlparser2');
var _ = require('lodash');

/**
 *
 * @param {string} html
 * @param {boolean} withoutMeta
 * @returns {string}
 */
module.exports = function(html, withoutMeta) {
    var result = {
        pos: 0,
        startPos: 0,
        text: '',
        meta: []
    };
    var nocheck = 0;
    var parser = new htmlparser.Parser({
        onopentag: function(name, attrs) {
            function isHidden() {
                return _(attrs).find(function (o) {
                        return o.name.toLowerCase() == 'data-litera5-hidden';
                    }) != undefined;
            }

            function isNoCheck() {
                return _(attrs).find(function (o) {
                        return o.name.toLowerCase() == 'data-litera5-nocheck';
                    }) != undefined;
            }

            if (nocheck > 0 || isHidden() || isNoCheck()) {
                nocheck += 1;
            } else {
                switch (name) {
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                    case 'h6':
                    case 'ul':
                    case 'ol':
                        result.startPos = result.pos;
                        break;
                    case 'br':
                        result.text += '\n';
                        result.pos += 1;
                        break;
                }
            }
        },
        ontext: function(text) {
            if (nocheck == 0) {
                result.text += text;
                result.pos += text.length;
            }
        },
        onclosetag: function(name) {
            if (nocheck > 0) {
                nocheck -= 1;
            } else {
                var meta = null;
                switch (name) {
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                    case 'h6':
                        meta = {
                            kind: 'header'
                        };
                        break;
                    case 'ul':
                    case 'ol':
                        meta = {
                            kind: 'list'
                        };
                        break;
                }
                if (meta != null) {
                    meta.start = result.startPos;
                    meta.end = result.pos;
                    result.meta.push(meta);
                }
            }
        }
    });
    parser.write(html);
    parser.end();
    if (!withoutMeta) {
        result.text = meta.add(result.text, result.meta);
    }
    return result.text;
};