import { sameText } from '../sameText';

const model = 'some text here with spaces';

describe('sameText', () => {
	it('should ignore multiple spaces', () => {
		const test = sameText('  some    text   here    with    spaces    ', model);
		expect(test).toBeTruthy();
	});
	it('should ignore line ends', () => {
		const test = sameText(
			'  some \n\n\n text   here  \n \n \n\n \n with    spaces \n',
			model
		);
		expect(test).toBeTruthy();
	});
	it('should ignore tabs', () => {
		const test = sameText(
			'  some \t\t text   here  \t \t \t\t \t with    spaces \t \t\t',
			model
		);
		expect(test).toBeTruthy();
	});
	it('should ignore caret returns', () => {
		const test = sameText(
			'  some \r\r text   here  \r \r \r\r \r with    spaces \r \r\r',
			model
		);
		expect(test).toBeTruthy();
	});
	it('should ignore all white space chars', () => {
		const test = sameText(
			'  some \t\n text   here  \r \n \n\n \t with    spaces \r \t\n',
			model
		);
		expect(test).toBeTruthy();
	});
});
