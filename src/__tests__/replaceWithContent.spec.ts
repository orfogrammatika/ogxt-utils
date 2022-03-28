import { replaceWithContent } from '../replaceWithContent';
import { dom } from './node-dom';

function $div(html: string): Element {
	const result = dom.window.document.createElement('div');
	result.innerHTML = html;
	return result;
}

describe('replaceWithContent', () => {
	it('one level Element', () => {
		const test = $div('<span>some text</span> split <span>with spans</span>');
		replaceWithContent(test, 'span');
		expect(test.innerHTML).toEqual('some text split with spans');
	});
	it('one level Element no selector', () => {
		const test = $div('<span>some text</span> split <span>with spans</span>');
		replaceWithContent(test);
		expect(test.innerHTML).toEqual(
			'<span>some text</span> split <span>with spans</span>'
		);
	});
	it('one level function', () => {
		const test = $div('<span>some text</span> split <span>with spans</span>');
		const func = () => {
			return test.querySelector('span');
		};
		replaceWithContent(func);
		expect(test.innerHTML).toEqual('some text split with spans');
	});
	it('multple levels Element', () => {
		const test = $div(
			'<span>some <span>text</span></span> split <span><span>with<span> </span></span>spans</span>'
		);
		replaceWithContent(test, 'span');
		expect(test.innerHTML).toEqual('some text split with spans');
	});
	it('multple levels Element no selector', () => {
		const test = $div(
			'<span>some <span>text</span></span> split <span><span>with<span> </span></span>spans</span>'
		);
		replaceWithContent(test);
		expect(test.innerHTML).toEqual(
			'<span>some <span>text</span></span> split <span><span>with<span> </span></span>spans</span>'
		);
	});
	it('multiple levels function', () => {
		const test = $div(
			'<span>some <span>text</span></span> split <span><span>with<span> </span></span>spans</span>'
		);
		const func = () => {
			return test.querySelector('span');
		};
		replaceWithContent(func);
		expect(test.innerHTML).toEqual('some text split with spans');
	});
});
