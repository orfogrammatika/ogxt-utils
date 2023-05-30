import '../node-dom';
import { annotate } from '../../index';
import { Annotations } from '../../model';
import { requireText } from '../utils';

describe('annotate', () => {
	it('should be implemented', () => {
		const src = requireText('./annotate.in.html', require);
		const annotations = require('./annotate.annotated.json');
		const test = annotate(src, annotations);
		expect(test).toEqual(requireText('./annotate.out.html', require));
	});
	describe('should not modify input html', () => {
		const annotations: Annotations = {
			kinds: {},
			annotations: [],
		};

		describe('void elements', () => {
			it('area', () => {
				const src = '<area alt="some alt">';
				const test = annotate(src, annotations);
				expect(test).toEqual(src);
			});
		});
		it('base', () => {
			const src = '<base>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('br', () => {
			const src = '<br>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('col', () => {
			const src = '<col>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('embed', () => {
			const src = '<embed>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('hr', () => {
			const src = '<hr>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('img', () => {
			const src = '<img alt="img" src="img.png">';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('input', () => {
			const src = '<input>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('keygen', () => {
			const src = '<keygen>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('link', () => {
			const src = '<link>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('meta', () => {
			const src = '<meta>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('param', () => {
			const src = '<param name="name" value="value">';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('source', () => {
			const src = '<source>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('track', () => {
			const src = '<track src="http://www.ru">';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
		it('wbr', () => {
			const src = '<wbr>';
			const test = annotate(src, annotations);
			expect(test).toEqual(src);
		});
	});
});
