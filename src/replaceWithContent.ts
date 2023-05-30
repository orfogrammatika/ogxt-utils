import * as _ from 'lodash';

export type ElementFunction = () => Element | null;

export type ElementOrFunction = Element | ElementFunction;

export function replaceWithContent(
	$node: ElementOrFunction,
	selector?: string
): void {
	const getNode = () => {
		if (_.isFunction($node)) {
			return $node();
		} else if (selector) {
			return $node.querySelector(selector);
		} else {
			return null;
		}
	};

	let $n = getNode();

	while ($n) {
		$n.outerHTML = $n.innerHTML;
		$n = getNode();
	}
}
