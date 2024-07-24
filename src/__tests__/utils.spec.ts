import { isTagHidden, isTagNoCheck } from '../utils';

describe('isTagHidden', () => {
	describe('true', () => {
		it('data-litera5-hidden', () => {
			const test = isTagHidden({
				'data-litera5-hidden': 'true',
				'data-some': 'another',
			});
			expect(test).toBeTruthy();
		});
		it('data-og-hidden', () => {
			const test = isTagHidden({
				'data-og-hidden': 'false',
				'data-some': 'another',
			});
			expect(test).toBeTruthy();
		});
	});
	describe('false', () => {
		it('data-litera5-hidden', () => {
			const test = isTagHidden({
				'datas-litera5-hidden': 'true',
				'data-some': 'another',
			});
			expect(test).toBeFalsy();
		});
		it('data-og-hidden', () => {
			const test = isTagHidden({
				'datas-og-hidden': 'false',
				'data-some': 'another',
			});
			expect(test).toBeFalsy();
		});
	});
});

describe('isTagNoCheck', () => {
	describe('true', () => {
		it('data-litera5-nocheck', () => {
			const test = isTagNoCheck({
				'data-litera5-nocheck': 'true',
				'data-some': 'another',
			});
			expect(test).toBeTruthy();
		});
		it('data-og-nocheck', () => {
			const test = isTagNoCheck({
				'data-og-nocheck': 'false',
				'data-some': 'another',
			});
			expect(test).toBeTruthy();
		});
	});
	describe('false', () => {
		it('data-litera5-nocheck', () => {
			const test = isTagNoCheck({
				'datas-litera5-nocheck': 'true',
				'data-some': 'another',
			});
			expect(test).toBeFalsy();
		});
		it('data-og-hidden', () => {
			const test = isTagNoCheck({
				'datas-og-nocheck': 'false',
				'data-some': 'another',
			});
			expect(test).toBeFalsy();
		});
	});
});
