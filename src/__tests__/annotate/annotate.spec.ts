import '../node-dom';
import { annotate } from '../../index';
import { requireText } from '../utils';

describe('annotate', () => {
	it('should be implemented', () => {
		const src = requireText('./annotate.in.html', require);
		const annotations = require('./annotate.annotated.json');
		const test = annotate(src, annotations);
		expect(test).toEqual(requireText('./annotate.out.html', require));
	});
});
