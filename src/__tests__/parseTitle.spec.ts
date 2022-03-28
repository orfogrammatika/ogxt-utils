import { parseTitle } from '../parseTitle';

describe('parseTitle', function () {
	it('single line', function () {
		const test = parseTitle('title');
		expect(test).toEqual('title…');
	});
	it('multi line', function () {
		const test = parseTitle('title\nwith subtitle');
		expect(test).toEqual('title with subtitle…');
	});
});
