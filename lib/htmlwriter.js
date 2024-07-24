"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = exports.makeMap = void 0;
const _ = __importStar(require("lodash"));
const entities_1 = require("entities");
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
        map[aitems[i]] = true;
    }
    return map;
}
exports.makeMap = makeMap;
const attrsCharsRegExp = /[&<>"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
// Raw entities
const baseEntities = {
    '"': '&quot;',
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '\u0160': '&ngsp',
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
    if (attr) {
        return (0, entities_1.escapeAttribute)(text);
    }
    return (0, entities_1.escapeText)(text);
}
/**
 * Constructs a new Writer instance.
 *
 * @param {Object} settings Name/value settings object.
 */
function Writer(settings) {
    var _a, _b;
    settings = settings !== null && settings !== void 0 ? settings : {};
    const html = [];
    const indent = settings.indent;
    const indentBefore = makeMap((_a = settings.indent_before) !== null && _a !== void 0 ? _a : []);
    const indentAfter = makeMap((_b = settings.indent_after) !== null && _b !== void 0 ? _b : []);
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
                _.each(attrs, (value, name) => {
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
            html.push('<!-- ', text, ' -->');
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
            html.push('<!DOCTYPE ', text, '>', indent ? '\n' : '');
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
