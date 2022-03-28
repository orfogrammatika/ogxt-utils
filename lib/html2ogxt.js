"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.html2ogxt = void 0;
const meta_1 = require("./meta");
const htmlparser2_1 = require("htmlparser2");
const lodash_1 = __importDefault(require("lodash"));
function html2ogxt(html, withoutMeta) {
    const result = {
        pos: 0,
        startPos: 0,
        text: '',
        meta: [],
    };
    let nocheck = 0;
    const parser = new htmlparser2_1.Parser({
        onopentag: function (name, attrs) {
            function isHidden() {
                return (lodash_1.default.findIndex(lodash_1.default.keys(attrs), a => a.toLowerCase() === 'data-litera5-hidden') > -1);
            }
            function isNoCheck() {
                return (lodash_1.default.findIndex(lodash_1.default.keys(attrs), a => a.toLowerCase() === 'data-litera5-nocheck') > -1);
            }
            if (nocheck > 0 || isHidden() || isNoCheck()) {
                nocheck += 1;
            }
            else {
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
        ontext: function (text) {
            if (nocheck == 0) {
                const txt = lodash_1.default.unescape(text).replace(/&nbsp;/g, '\xa0');
                result.text += txt;
                result.pos += txt.length;
            }
        },
        onclosetag: function (name) {
            if (nocheck > 0) {
                nocheck -= 1;
            }
            else {
                let meta = null;
                switch (name) {
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                    case 'h6':
                        meta = {
                            kind: 'header',
                        };
                        break;
                    case 'ul':
                    case 'ol':
                        meta = {
                            kind: 'list',
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
    });
    parser.write(html);
    parser.end();
    if (!withoutMeta) {
        result.text = (0, meta_1.metaAdd)(result.text, result.meta);
    }
    return result.text;
}
exports.html2ogxt = html2ogxt;
