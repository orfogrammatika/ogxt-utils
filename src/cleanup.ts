import _ from 'lodash';
import { replaceWithContent } from './replaceWithContent';

function _cleanupAnnotations($node: Element): void {
	replaceWithContent($node, 'span.annotation');
	replaceWithContent(
		$node,
		'span[data-kind][data-annotation][data-annotation-idx]'
	);
}

function _cleanupScripts($node: Element): void {
	$node.querySelectorAll('script').forEach(e => e.remove());
}

function _cleanupStyles($node: Element): void {
	$node.querySelectorAll('style').forEach(e => e.remove());
}

function _firstEmptySpan($node: Element): Element | null {
	const $spans = $node.querySelectorAll('span');
	return _.find($spans, s => !s.hasAttributes()) || null;
}

function _cleanupEmptySpans($node: Element): void {
	replaceWithContent(() => _firstEmptySpan($node));
}

function _savePreContent($node: Element): string[] {
	return _($node.querySelectorAll('pre'))
		.map(function ($el, idx) {
			$el.setAttribute('data-temp-pre-index', `${idx}`);
			return $el.innerHTML;
		})
		.value();
}

function _restorePreContent($node: Element, pre: string[]) {
	let $pre = $node.querySelector('[data-temp-pre-index]');
	while ($pre) {
		const idx = parseInt($pre.getAttribute('data-temp-pre-index')!);
		$pre.removeAttribute('data-temp-pre-index');
		$pre.innerHTML = pre[idx];
		$pre = $node.querySelector('[data-temp-pre-index]');
	}
}

function _addNlAfterTag(html: string, tag: string): string {
	const expr = new RegExp('<\\s*/\\s*' + tag + '\\s*>', 'ig');
	return html.replace(expr, '</' + tag + '>\n');
}

function _splitLines(html: string): string {
	html = _addNlAfterTag(html, 'pre');
	html = _addNlAfterTag(html, 'h1');
	html = _addNlAfterTag(html, 'h2');
	html = _addNlAfterTag(html, 'h3');
	html = _addNlAfterTag(html, 'h4');
	html = _addNlAfterTag(html, 'h5');
	html = _addNlAfterTag(html, 'h6');
	html = _addNlAfterTag(html, 'div');
	html = _addNlAfterTag(html, 'p');
	html = _addNlAfterTag(html, 'ol');
	html = _addNlAfterTag(html, 'ul');
	html = _addNlAfterTag(html, 'li');
	html = _addNlAfterTag(html, 'article');
	html = _addNlAfterTag(html, 'section');
	html = _addNlAfterTag(html, 'tr');
	html = _addNlAfterTag(html, 'td');
	html = _addNlAfterTag(html, 'th');
	html = _addNlAfterTag(html, 'header');
	html = _addNlAfterTag(html, 'footer');
	return html;
}

function _cleanupLineBreaks($node: Element) {
	const pre = _savePreContent($node);
	let html = $node.innerHTML;
	html = html.replace(/\s+/g, ' ');
	html = _splitLines(html);
	html = html.replace(/\n+/gim, '\n');
	$node.innerHTML = html;
	_restorePreContent($node, pre);
}

/**
 * Cleaning the html removing all styles, empty spans, removing annotations and so on
 */
export function cleanupHtml(
	html: string,
	document: Document,
	removeAnnotations?: boolean
): string {
	const $html = document.createElement('div');
	$html.innerHTML = html;
	if (removeAnnotations) {
		_cleanupAnnotations($html);
	}
	_cleanupStyles($html);
	_cleanupScripts($html);
	_cleanupEmptySpans($html);
	_cleanupLineBreaks($html);
	return $html.innerHTML;
}

/**
 * Remove all Litera5 annotation spans from the text (good for saving document)
 */
export function cleanupAnnotations(html: string, document: Document): string {
	const $html = document.createElement('div');
	$html.innerHTML = html;
	_cleanupAnnotations($html);
	return $html.innerHTML;
}
