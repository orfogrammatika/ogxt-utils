import * as _ from 'lodash';
import * as runes from 'runes';

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
	const res = arr.slice(0, 5).join(' ');
	return runes.substr(res, 0, 40) + '…';
}
