"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlParser = void 0;
const htmlparser2_1 = require("htmlparser2");
const js_logger_1 = __importDefault(require("js-logger"));
const lodash_1 = __importDefault(require("lodash"));
const log = js_logger_1.default.get('HtmlParser');
class HtmlParser {
    constructor(handler) {
        this.handler = handler;
        this._txt = [];
        this._flushText = () => {
            const txt = this._txt.join('');
            this._txt = [];
            if (!lodash_1.default.isEmpty(txt)) {
                this.handler.ontext(txt);
            }
        };
        this._openTag = (name, attrs) => {
            this._flushText();
            this.handler.onopentag(name, attrs);
        };
        this._text = (data) => {
            this._txt.push(data);
        };
        this._closeTag = (name) => {
            this._flushText();
            this.handler.onclosetag(name);
        };
    }
    parseComplete(data) {
        const parser = new htmlparser2_1.Parser({
            onparserinit: undefined,
            onreset: undefined,
            onend: undefined,
            onerror(error) {
                log.error(error);
            },
            onclosetag: this._closeTag,
            onopentagname: undefined,
            onattribute: undefined,
            onopentag: this._openTag,
            ontext: this._text,
            oncomment: undefined,
            oncdatastart: undefined,
            oncdataend: undefined,
            oncommentend: undefined,
            onprocessinginstruction: undefined,
        }, {
            decodeEntities: true,
            recognizeSelfClosing: true,
            lowerCaseTags: true,
            xmlMode: false,
            lowerCaseAttributeNames: true,
        });
        parser.parseComplete(data);
        this._flushText();
    }
}
exports.HtmlParser = HtmlParser;
