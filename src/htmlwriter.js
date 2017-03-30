/**
 * Makes a name/object map out of an array with names.
 *
 * @method makeMap
 * @param {Array/String} items Items to make map out of.
 * @param {String} delim Optional delimiter to split string by.
 * @param {Object} map Optional map to add items to.
 * @return {Object} Name/value map of items.
 */
function makeMap(items, delim, map) {
    var i;

    items = items || [];
    delim = delim || ',';

    if (typeof items == "string") {
        items = items.split(delim);
    }

    map = map || {};

    i = items.length;
    while (i--) {
        map[items[i]] = {};
    }

    return map;
}

var attrsCharsRegExp = /[&<>\"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

// Raw entities
var baseEntities = {
    '\"': '&quot;', // Needs to be escaped since the YUI compressor would otherwise break the code
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '\u0060': '&#96;'
};

/**
 * Encodes the specified string using raw entities. This means only the required XML base entities will be encoded.
 *
 * @method encodeRaw
 * @param {String} text Text to encode.
 * @param {Boolean} attr Optional flag to specify if the text is attribute contents.
 * @return {String} Entity encoded text.
 */
function encode(text, attr) {
    return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {
        return baseEntities[chr] || chr;
    });
}

module.exports = {
    /**
     * Constructs a new Writer instance.
     *
     * @constructor
     * @method Writer
     * @param {Object} settings Name/value settings object.
     */
    Writer: function(settings) {
        var html = [], indent, indentBefore, indentAfter, htmlOutput;

        settings = settings || {};
        indent = settings.indent;
        indentBefore = makeMap(settings.indent_before || '');
        indentAfter = makeMap(settings.indent_after || '');
        htmlOutput = settings.element_format == "html";

        return {
            /**
             * Writes the a start element such as <p id="a">.
             *
             * @method start
             * @param {String} name Name of the element.
             * @param {Array} attrs Optional attribute array or undefined if it hasn't any.
             * @param {Boolean} empty Optional empty state if the tag should end like <br />.
             */
            start: function(name, attrs, empty) {
                var i, l, attr, value;

                if (indent && indentBefore[name] && html.length > 0) {
                    value = html[html.length - 1];

                    if (value.length > 0 && value !== '\n') {
                        html.push('\n');
                    }
                }

                html.push('<', name);

                if (attrs) {
                    for (i = 0, l = attrs.length; i < l; i++) {
                        attr = attrs[i];
                        html.push(' ', attr.name, '="', encode(attr.value, true), '"');
                    }
                }

                if (!empty || htmlOutput) {
                    html[html.length] = '>';
                } else {
                    html[html.length] = ' />';
                }

                if (empty && indent && indentAfter[name] && html.length > 0) {
                    value = html[html.length - 1];

                    if (value.length > 0 && value !== '\n') {
                        html.push('\n');
                    }
                }
            },

            /**
             * Writes the a end element such as </p>.
             *
             * @method end
             * @param {String} name Name of the element.
             */
            end: function(name) {
                var value;

                /*if (indent && indentBefore[name] && html.length > 0) {
                 value = html[html.length - 1];

                 if (value.length > 0 && value !== '\n')
                 html.push('\n');
                 }*/

                html.push('</', name, '>');

                if (indent && indentAfter[name] && html.length > 0) {
                    value = html[html.length - 1];

                    if (value.length > 0 && value !== '\n') {
                        html.push('\n');
                    }
                }
            },

            /**
             * Writes a text node.
             *
             * @method text
             * @param {String} text String to write out.
             * @param {Boolean} raw Optional raw state if true the contents wont get encoded.
             */
            text: function(text, raw) {
                if (text.length > 0) {
                    html[html.length] = raw ? text : encode(text);
                }
            },

            /**
             * Writes a cdata node such as <![CDATA[data]]>.
             *
             * @method cdata
             * @param {String} text String to write out inside the cdata.
             */
            cdata: function(text) {
                html.push('<![CDATA[', text, ']]>');
            },

            /**
             * Writes a comment node such as <!-- Comment -->.
             *
             * @method cdata
             * @param {String} text String to write out inside the comment.
             */
            comment: function(text) {
                html.push('<!--', text, '-->');
            },

            /**
             * Writes a PI node such as <?xml attr="value" ?>.
             *
             * @method pi
             * @param {String} name Name of the pi.
             * @param {String} text String to write out inside the pi.
             */
            pi: function(name, text) {
                if (text) {
                    html.push('<?', name, ' ', encode(text), '?>');
                } else {
                    html.push('<?', name, '?>');
                }

                if (indent) {
                    html.push('\n');
                }
            },

            /**
             * Writes a doctype node such as <!DOCTYPE data>.
             *
             * @method doctype
             * @param {String} text String to write out inside the doctype.
             */
            doctype: function(text) {
                html.push('<!DOCTYPE', text, '>', indent ? '\n' : '');
            },

            /**
             * Resets the internal buffer if one wants to reuse the writer.
             *
             * @method reset
             */
            reset: function() {
                html.length = 0;
            },

            /**
             * Returns the contents that got serialized.
             *
             * @method getContent
             * @return {String} HTML contents that got written down.
             */
            getContent: function() {
                return html.join('').replace(/\n$/, '');
            }
        };
    }
};