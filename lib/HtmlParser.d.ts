export interface HtmlHandler {
    onopentag(name: string, attribs: Record<string, string>): void;
    ontext(data: string): void;
    onclosetag(name: string): void;
}
export declare class HtmlParser {
    private handler;
    constructor(handler: HtmlHandler);
    private _txt;
    private _flushText;
    private _openTag;
    private _text;
    private _closeTag;
    parseComplete(data: string): void;
}
