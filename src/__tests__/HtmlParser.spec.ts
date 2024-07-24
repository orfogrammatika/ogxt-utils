import { HtmlParser } from '../HtmlParser';

describe('HtmlParser', () => {
	it('should work', () => {
		const parser = new HtmlParser({
			onclosetag(name: string) {
				console.log(`closetag name: ${name}`);
			},
			onopentag(name: string, attrs: Record<string, string>) {
				console.log(`opentag name: ${name} attrs:`, attrs);
			},
			ontext(text) {
				console.log(`text: "${text}"`);
			},
		});
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
