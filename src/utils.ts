import * as _ from 'lodash';

function hasKeys(attrs: Record<string, any>, ...values: string[]): boolean {
	const keys = _.map(_.keys(attrs), a => _.toLower(a));
	const common = _.intersection(keys, values);
	return _.size(common) > 0;
}

export function isTagHidden(attrs: Record<string, any>): boolean {
	return hasKeys(attrs, 'data-litera5-hidden', 'data-og-hidden');
}

export function isTagNoCheck(attrs: Record<string, any>): boolean {
	return hasKeys(attrs, 'data-litera5-nocheck', 'data-og-nocheck');
}
