import { dom } from '../node-dom';
import { cleanupHtml, cleanupAnnotations } from '../../index';
import { requireText } from '../utils';

describe('cleanup', () => {
	describe('html', () => {
		function mkTest(name: string, annotations?: boolean) {
			return () => {
				const src = requireText(`./html/${name}.in.html`, require);
				const test = cleanupHtml(src, dom.window.document, annotations);
				expect(test).toEqual(requireText(`./html/${name}.out.html`, require));
			};
		}

		it('should cleanup styles', mkTest('styles'));
		it('should cleanup scripts', mkTest('scripts'));
		it('should cleanup empty spans', mkTest('empty-spans'));
		it('should cleanup line breaks', mkTest('line-breaks'));
		it('should cleanup annotations', mkTest('annotations', true));
	});
	describe('annotations', () => {
		it('should be implemented', () => {
			const src = requireText('./annotations/annotations.in.html', require);
			const test = cleanupAnnotations(src, dom.window.document);
			expect(test).toEqual(
				requireText('./annotations/annotations.out.html', require)
			);
		});
	});
});
