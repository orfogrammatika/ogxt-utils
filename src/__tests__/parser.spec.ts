import { Parser } from 'htmlparser2';

describe('Parser', () => {
	it('parse &nbsp; as single text', () => {
		const parser = new Parser(
			{
				onparserinit() {
					console.log('parserinit');
				},
				onreset() {
					console.log('reset');
				},
				onend() {
					console.log('end');
				},
				onerror(error: Error) {
					console.log('error', error);
				},
				onclosetag(name: string, isImplied: boolean) {
					console.log(
						`closetag name: ${name} isImplied: ${isImplied}`
					);
				},
				onopentagname(name: string) {
					console.log(`opentagname name: ${name}`);
				},
				onattribute(
					name: string,
					value: string,
					quote?: string | null
				) {
					console.log(
						`attribute name: ${name} value: "${value}" quote: ${quote}`
					);
				},
				onopentag(
					name: string,
					attrs: Record<string, string>,
					isImplied: boolean
				) {
					console.log(
						`opentag name: ${name} isImplied: ${isImplied} attrs:`,
						attrs
					);
				},
				ontext(text) {
					console.log(`text: "${text}"`);
				},
				oncomment(data: string) {
					console.log(`comment: "${data}"`);
				},
				oncdatastart() {
					console.log('cdatastart');
				},
				oncdataend() {
					console.log('cdataend');
				},
				oncommentend() {
					console.log('commentend');
				},
				onprocessinginstruction(name: string, data: string) {
					console.log(`instruction name: ${name} data: "${data}"`);
				},
			},
			{
				recognizeCDATA: true,
				recognizeSelfClosing: true,
			}
		);
		parser.parseComplete(`
<!doctype html>
<p id="first">Один&nbsp; &gt; &laquo;раз</p>
<br>
<!--
some comment here
-->
<div id="second" data-some/>
<span id="third" data-other>more</span>
<![CDATA[
some data here
]]>
<image src="some">
`);
	});
});
