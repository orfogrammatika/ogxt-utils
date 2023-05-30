import * as _ from 'lodash';

function _normalizeText(str: string) {
	const strLines: string[] = str.split('\n');
	const lines = _.map(strLines, line => line.trim());
	return lines.join('\n').replace(/\s+/g, ' ').trim();
}

/**
 * Compare two texts are same ignoring the space chars
 * @param {string} str1
 * @param {string} str2
 * @returns {boolean}
 */
export function sameText(str1: string, str2: string): boolean {
	const nstr1 = _normalizeText(str1);
	const nstr2 = _normalizeText(str2);
	return nstr1 == nstr2;
}
