import _ from 'lodash';

/**
 * Parse the text "title" taking first 5 words of text cut it to 40 chars if needed
 * @param {string} text
 * @returns {string}
 */
export function parseTitle(text: string): string {
	let arr = text
		.trim()
		.replace(/[\\/:*?"<>|.\r]/g, '')
		.replace(/[\n\t\s]+/g, ' ')
		.split(' ');
	arr = _.filter(arr, a => !_.isEmpty(a.trim()));
	let res = '';
	for (let i = 0; i < Math.min(5, arr.length); i++) {
		if (i > 0) {
			res += ' ';
		}
		res += arr[i];
	}
	res = res.substring(0, 40) + '…';
	return res;
}
