import { requireText } from '../utils';
import { html2ogxt } from '../../index';
import { metaAdd } from '../../meta';

function mkTest(name: string) {
	return () => {
		const src = requireText(`./${name}/${name}.html`, require);
		const test = html2ogxt(src);
		expect(test).toEqual(
			metaAdd(
				requireText(`./${name}/${name}.txt`, require),
				require(`./${name}/${name}.json`)
			)
		);
	};
}

describe('html2ogxt', () => {
	it('headers', mkTest('headers'));
	it('lists', mkTest('lists'));
	it('brs', mkTest('brs'));
	it('nbsps', mkTest('nbsps'));
	it('complex', mkTest('complex'));
	it('nocheck', mkTest('nocheck'));
	it('hidden', mkTest('hidden'));
});
