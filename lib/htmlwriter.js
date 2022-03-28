"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 * Makes a name/object map out of an array with names.
 *
 * @param items Items to make map out of.
 * @param delim Optional delimiter to split string by.
 * @param map Optional map to add items to.
 * @return Name/value map of items.
 */
function makeMap(items, delim, map) {
    let i;
    let aitems = [];
    items = items || [];
    delim = delim || ',';
    if (typeof items === 'string') {
        aitems = items.split(delim);
    }
    else {
        aitems = items;
    }
    map = map || {};
    i = aitems.length;
    while (i--) {
        map[aitems[i]] = {};
    }
    return map;
}
const attrsCharsRegExp = /[&<>"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
// Raw entities
const baseEntities = {
    '"': '&quot;',
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '\u0060': '&#96;',
};
/**
 * Encodes the specified string using raw entities. This means only the required XML base entities will be encoded.
 *
 * @param text Text to encode.
 * @param attr Optional flag to specify if the text is attribute contents.
 * @return Entity encoded text.
 */
function encode(text, attr) {
    return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        var _a;
        return (_a = baseEntities[chr]) !== null && _a !== void 0 ? _a : chr;
    });
}
/**
 * Constructs a new Writer instance.
 *
 * @param {Object} settings Name/value settings object.
 */
function Writer(settings) {
    settings = settings !== null && settings !== void 0 ? settings : {};
    const html = [];
    const indent = settings.indent;
    const indentBefore = makeMap(settings.indent_before || '');
    const indentAfter = makeMap(settings.indent_after || '');
    const htmlOutput = settings.element_format === 'html';
    return {
        /**
         * Writes the a start element such as <p id="a">.
         *
         * @method start
         * @param name Name of the element.
         * @param attrs Optional attribute array or undefined if it hasn't any.
         * @param empty Optional empty state if the tag should end like <br />.
         */
        start: function (name, attrs, empty) {
            let value;
            if (indent && indentBefore[name] && html.length > 0) {
                value = html[html.length - 1];
                if (value.length > 0 && value !== '\n') {
                    html.push('\n');
                }
            }
            html.push('<', name);
            if (attrs) {
                lodash_1.default.each(attrs, (value, name) => {
                    html.push(` ${name}="${encode(value, true)}"`);
                });
            }
            if (!empty || htmlOutput) {
                html[html.length] = '>';
            }
            else {
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
         * @param name Name of the element.
         */
        end: function (name) {
            let value;
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
         * @param text String to write out.
         * @param raw Optional raw state if true the contents wont get encoded.
         */
        text: function (text, raw) {
            if (text.length > 0) {
                html[html.length] = raw ? text : encode(text);
            }
        },
        /**
         * Writes a cdata node such as <![CDATA[data]]>.
         *
         * @method cdata
         * @param text String to write out inside the cdata.
         */
        cdata: function (text) {
            html.push('<![CDATA[', text, ']]>');
        },
        /**
         * Writes a comment node such as <!-- Comment -->.
         *
         * @method cdata
         * @param text String to write out inside the comment.
         */
        comment: function (text) {
            html.push('<!--', text, '-->');
        },
        /**
         * Writes a PI node such as <?xml attr="value" ?>.
         *
         * @param name Name of the pi.
         * @param text String to write out inside the pi.
         */
        pi: function (name, text) {
            if (text) {
                html.push('<?', name, ' ', encode(text), '?>');
            }
            else {
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
         * @param text String to write out inside the doctype.
         */
        doctype: function (text) {
            html.push('<!DOCTYPE', text, '>', indent ? '\n' : '');
        },
        /**
         * Resets the internal buffer if one wants to reuse the writer.
         *
         * @method reset
         */
        reset: function () {
            html.length = 0;
        },
        /**
         * Returns the contents that got serialized.
         *
         * @method getContent
         * @return HTML contents that got written down.
         */
        getContent: function () {
            return html.join('').replace(/\n$/, '');
        },
    };
}
exports.Writer = Writer;
