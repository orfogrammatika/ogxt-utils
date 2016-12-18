var meta = require('./meta');

module.exports = function(/**string*/html, /**boolean*/withMeta) /**string*/ {
    var result = {
        pos: 0,
        startPos: 0,
        text: '',
        meta: []
    };
    var nocheck = 0;
    var parser = new tinymce.html.SaxParser({
        validate: true,

        comment: function (text) {
        },

        cdata: function (text) {
        },

        text: function (text, raw) {
            if (nocheck == 0) {
                result.text += text;
                result.pos += text.length;
            }
        },

        start: function (name, attrs, empty) {
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

        end: function (name) {
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
        },

        pi: function (name, text) {
        },

        doctype: function (text) {
        }
    }, new tinymce.html.Schema());
    parser.parse(html);

    if (withMeta) {
        result.text = meta.add(result.text, result.meta);
    }
    return result.text;
};

