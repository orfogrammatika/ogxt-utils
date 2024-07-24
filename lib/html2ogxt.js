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
exports.html2ogxt = void 0;
const meta_1 = require("./meta");
const _ = __importStar(require("lodash"));
const utils_1 = require("./utils");
const HtmlParser_1 = require("./HtmlParser");
function html2ogxt(html, withoutMeta) {
    const result = {
        pos: 0,
        startPos: 0,
        text: [],
        meta: [],
    };
    let nocheck = 0;
    const parser = new HtmlParser_1.HtmlParser({
        onopentag: function (name, attrs) {
            function isHidden() {
                return (0, utils_1.isTagHidden)(attrs);
            }
            function isNoCheck() {
                return (0, utils_1.isTagNoCheck)(attrs);
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
                        result.text.push('\n');
                        result.pos += 1;
                        break;
                }
            }
        },
        ontext: function (text) {
            if (nocheck == 0) {
                const txt = _.unescape(text).replace(/&nbsp;/g, '\xa0');
                result.text.push(txt);
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
    parser.parseComplete(html);
    let res = result.text.join('');
    if (!withoutMeta) {
        res = (0, meta_1.metaAdd)(res, result.meta);
    }
    return res;
}
exports.html2ogxt = html2ogxt;
