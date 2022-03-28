import { metaAdd, metaStrip, Meta } from '../meta';

const DELIMITER = '\n------------------------------\n';
const m: Meta[] = [
	{
		kind: 'h',
		start: 10,
		end: 20,
	},
];
const str = 'line1\n' + DELIMITER + 'line2' + 'line3' + DELIMITER;

describe('meta', () => {
	it('metaAdd', () => {
		const test = metaAdd(str, m);
		expect(test).toEqual(str + DELIMITER + JSON.stringify(m));
	});
	it('metaSplit', () => {
		const test = metaStrip(str + DELIMITER + JSON.stringify(m));
		expect(test).toEqual(str);
	});
});
