import _ from 'lodash';

const DELIMITER = '\n------------------------------\n';

export interface Meta {
	kind: string;
	start?: number;
	end?: number;
}

/**
 * Add meta to OGXT text
 * @param {string} text
 * @param {object} specials
 * @returns {string}
 */
export function metaAdd(text: string, specials: Meta[]): string {
	return text + DELIMITER + JSON.stringify(specials);
}

/**
 * Strip meta from OGXT text
 * @param {string} text
 * @returns {string}
 */
export function metaStrip(text: string): string {
	let res = _.split(text, DELIMITER);
	if (_.size(res) > 1) {
		res = _.slice(res, 0, _.size(res) - 1);
	}
	return _.join(res, DELIMITER);
}
