import { Parser } from 'htmlparser2';
import Logger from 'js-logger';
import _ from 'lodash';

const log = Logger.get('HtmlParser');

export interface HtmlHandler {
	onopentag(name: string, attribs: Record<string, string>): void;
	ontext(data: string): void;
	onclosetag(name: string): void;
}

export class HtmlParser {
	constructor(private handler: HtmlHandler) {}

	private _txt: string[] = [];

	private _flushText = () => {
		const txt = this._txt.join('');
		this._txt = [];
		if (!_.isEmpty(txt)) {
			this.handler.ontext(txt);
		}
	};

	private _openTag = (name: string, attrs: Record<string, string>): void => {
		this._flushText();
		this.handler.onopentag(name, attrs);
	};

	private _text = (data: string): void => {
		this._txt.push(data);
	};

	private _closeTag = (name: string): void => {
		this._flushText();
		this.handler.onclosetag(name);
	};

	parseComplete(data: string): void {
		const parser = new Parser(
			{
				onparserinit: undefined,
				onreset: undefined,
				onend: undefined,
				onerror(error: Error) {
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
			},
			{
				decodeEntities: true,
				recognizeSelfClosing: true,
				lowerCaseTags: true,
				xmlMode: false,
				lowerCaseAttributeNames: true,
			}
		);
		parser.parseComplete(data);
		this._flushText();
	}
}
