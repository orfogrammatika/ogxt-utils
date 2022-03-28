import _ from 'lodash';
import { Parser } from 'htmlparser2';
import { Writer, Dict } from './htmlwriter';

interface Position {
	start: number;
	end: number;
}

interface Annotation {
	id: number;
	kind: string;
	selection: string;
	description: string;
	suggestion: string;
	suggestionId: number;
	explanation: string;
	rule: string;
	group: string;
	attrs: string[];
	position: Position[];
}

interface Annotations {
	kinds: {
		[key: string]: string;
	};
	annotations: Annotation[];
}

const Attrs = {
	Priority: {
		high: 'priority_high',
	},
	Mode: {
		multi: 'multi',
		single: 'single',
	},
};

interface EditorAnnotation {
	id: number;
	idx: number;
	kind: string;
	group: string;
	classes: string;
	attr: {
		start: boolean;
		end: boolean;
		large: boolean;
	};
}

interface EditorSpan {
	start: number;
	end: number;
	annotations: EditorAnnotation[];
}

interface EditorIntersectResult {
	items: EditorSpan[];
	span?: EditorSpan;
}

function _compareSpans(a: EditorSpan, b: EditorSpan): number {
	let result = a.start - b.start;
	if (result == 0) {
		result = a.end - b.end;
	}
	return result;
}

function _getSpans(annotations: Annotation[]): EditorSpan[] {
	const result: EditorSpan[] = [];

	function isLarge(position: Position): boolean {
		return position.end - position.start > 64;
	}

	function attrsClasses(attrs: string[]): string {
		let result = '';
		if (_.includes(attrs, Attrs.Priority.high))
			result += ' attr_' + Attrs.Priority.high;
		return result;
	}

	_.each(annotations, function (annotation: Annotation, index: number) {
		_.each(annotation.position, function (position: Position, idx: number) {
			result.push({
				start: position.start,
				end: position.end + 1,
				annotations: [
					{
						id: index,
						idx: idx,
						kind: annotation.kind,
						group: annotation.group,
						classes: attrsClasses(annotation.attrs),
						attr: {
							start: true,
							end: true,
							large: isLarge(position),
						},
					},
				],
			});
		});
	});
	return result.sort(_compareSpans);
}

function _withoutEnd(annotation: EditorAnnotation): EditorAnnotation {
	const res = _.cloneDeep(annotation);
	res.attr.end = false;
	return res;
}

function _withoutStart(annotation: EditorAnnotation): EditorAnnotation {
	const res = _.cloneDeep(annotation);
	res.attr.start = false;
	return res;
}

function _withoutStartEnd(annotation: EditorAnnotation): EditorAnnotation {
	const res = _.cloneDeep(annotation);
	res.attr.start = false;
	res.attr.end = false;
	return res;
}

/**
 * |---------a---------|
 *                     |---------b---------|
 */
function _noIntersection(a: EditorSpan, b: EditorSpan): EditorIntersectResult {
	return {
		items: [a],
		span: b,
	};
}

/**
 * |---------a---------|
 * |---------b---------|
 */
function _intersectAequalsB(
	a: EditorSpan,
	b: EditorSpan
): EditorIntersectResult {
	return {
		items: [
			{
				start: a.start,
				end: a.end,
				annotations: _.concat(a.annotations, b.annotations),
			},
		],
		span: undefined,
	};
}

/**
 * |------a------|
 * |---------b---------|
 */
function _intersectAinBsameStart(
	a: EditorSpan,
	b: EditorSpan
): EditorIntersectResult {
	const s1: EditorSpan = {
		start: a.start,
		end: a.end,
		annotations: _.concat(a.annotations, _.map(b.annotations, _withoutEnd)),
	};
	const s2: EditorSpan = {
		start: a.end,
		end: b.end,
		annotations: _.map(b.annotations, _withoutStart),
	};
	return {
		items: [s1],
		span: s2,
	};
}

/**
 * |-----------a-----------|
 * |---------b---------|
 */
function _intersectBinAsameStart(
	a: EditorSpan,
	b: EditorSpan
): EditorIntersectResult {
	const s1: EditorSpan = {
		start: a.start,
		end: b.end,
		annotations: _.concat(_.map(a.annotations, _withoutEnd), b.annotations),
	};
	const s2: EditorSpan = {
		start: b.end,
		end: a.end,
		annotations: _.map(a.annotations, _withoutStart),
	};
	return {
		items: [s1, s2],
		span: undefined,
	};
}

/**
 * |-----------a-----------|
 *     |---------b---------|
 */
function _intersectBinAsameEnd(
	a: EditorSpan,
	b: EditorSpan
): EditorIntersectResult {
	const s1: EditorSpan = {
		start: a.start,
		end: b.start,
		annotations: _.map(a.annotations, _withoutEnd),
	};
	const s2: EditorSpan = {
		start: b.start,
		end: a.end,
		annotations: _.concat(_.map(a.annotations, _withoutStart), b.annotations),
	};
	return {
		items: [s1, s2],
		span: undefined,
	};
}

/**
 * |-----------a-----------|
 *     |-------------b-------------|
 */
function _intersectBoverA(a: EditorSpan, b: EditorSpan): EditorIntersectResult {
	const s1: EditorSpan = {
		start: a.start,
		end: b.start,
		annotations: _.map(a.annotations, _withoutEnd),
	};
	const s2: EditorSpan = {
		start: b.start,
		end: a.end,
		annotations: _.concat(
			_.map(a.annotations, _withoutStart),
			_.map(b.annotations, _withoutEnd)
		),
	};
	const s3: EditorSpan = {
		start: a.end,
		end: b.end,
		annotations: _.map(b.annotations, _withoutStart),
	};
	return {
		items: [s1, s2],
		span: s3,
	};
}

/**
 * |-----------a-----------------|
 *     |---------b---------|
 */
function _intersectBinA(a: EditorSpan, b: EditorSpan): EditorIntersectResult {
	const s1: EditorSpan = {
		start: a.start,
		end: b.start,
		annotations: _.map(a.annotations, _withoutEnd),
	};
	const s2: EditorSpan = {
		start: b.start,
		end: b.end,
		annotations: _.concat(
			_.map(a.annotations, _withoutStartEnd),
			b.annotations
		),
	};
	const s3: EditorSpan = {
		start: b.end,
		end: a.end,
		annotations: _.map(a.annotations, _withoutStart),
	};
	return {
		items: [s1, s2, s3],
		span: undefined,
	};
}

function _intersectSpans(
	a: EditorSpan,
	b: EditorSpan
): EditorIntersectResult | undefined {
	let result: EditorIntersectResult | undefined = undefined;
	if (a == b) {
		console.assert(false, 'a should not be the same as b');
	} else if (a.end <= b.start) {
		/**
		 * |---------a---------|
		 *                     |---------b---------|
		 */
		result = _noIntersection(a, b);
	} else if (a.start == b.start && a.end == b.end) {
		/**
		 * |---------a---------|
		 * |---------b---------|
		 */
		result = _intersectAequalsB(a, b);
	} else if (a.start == b.start && a.end < b.end) {
		/**
		 * |------a------|
		 * |---------b---------|
		 */
		result = _intersectAinBsameStart(a, b);
	} else if (a.start == b.start && a.end > b.end) {
		/**
		 * |-----------a-----------|
		 * |---------b---------|
		 */
		result = _intersectBinAsameStart(a, b);
	} else if (a.start < b.start && a.end == b.end) {
		/**
		 * |-----------a-----------|
		 *     |---------b---------|
		 */
		result = _intersectBinAsameEnd(a, b);
	} else if (a.start < b.start && a.end < b.end && b.start < a.end) {
		/**
		 * |-----------a-----------|
		 *     |-------------b-------------|
		 */
		result = _intersectBoverA(a, b);
	} else if (a.start < b.start && a.end > b.end && b.start < a.end) {
		/**
		 * |-----------a-----------------|
		 *     |---------b---------|
		 */
		result = _intersectBinA(a, b);
	} else if (a.start > b.start && a.end == b.end) {
		/**
		 *      |-------a------|
		 * |---------b---------|
		 */
		console.assert(false, 'b.start should not be less than a.start');
	} else if (a.start > b.start && a.end < b.end) {
		/**
		 *      |----a----|
		 * |---------b---------|
		 */
		console.assert(false, 'b.start should not be less than a.start');
	} else if (a.start > b.start && a.end > b.end && a.start < b.end) {
		/**
		 *      |----------a---------|
		 * |---------b---------|
		 */
		console.assert(false, 'b.start should not be less than a.start');
	} else if (a.start >= b.end) {
		/**
		 *                     |----------a---------|
		 * |---------b---------|
		 */
		console.assert(false, 'b.start should not be less than a.start');
	}
	return result;
}

function _intersectAllSpans(
	spans: EditorSpan[],
	span: EditorSpan
): EditorSpan[] {
	let result: EditorSpan[] = [];
	if (spans.length == 0 && span != null) result.push(span);
	else {
		const res = _intersectSpans(_.head(spans)!, span);
		const _tail = _.tail(spans);
		if (res) {
			if (_.isNil(res.span)) {
				result = result.concat(res.items, _tail);
			} else {
				result = result.concat(res.items, _intersectAllSpans(_tail, res.span));
			}
		}
	}
	return result;
}

function _splitSpans(spans: EditorSpan[]): EditorSpan[] {
	let result: EditorSpan[] = [];
	_.each(spans, function (span) {
		result = _intersectAllSpans(result, span);
	});
	return result;
}

/**
 * Модификация разбиения спанов. Сначала все спаны разбиваются на непересекающиеся группы,
 *  а затем для каждой группы применяется старый (полный) механизм разбиения
 */
function _splitSpansEx(spans: EditorSpan[]): EditorSpan[] {
	spans.sort(function (a, b) {
		let result = a.start - b.start;
		if (result == 0) {
			result = a.end - b.end;
		}
		return result;
	});
	const groups: EditorSpan[][] = [];
	let lastGroup: EditorSpan[] = [];
	let compareIdx = -1;
	for (let i = 0; i < spans.length; i++) {
		if (spans[i].start > compareIdx) {
			if (lastGroup.length > 0) groups.push(lastGroup);
			lastGroup = [spans[i]];
			compareIdx = spans[i].end;
		} else {
			lastGroup.push(spans[i]);
			if (compareIdx < spans[i].end) compareIdx = spans[i].end;
		}
	}
	if (lastGroup.length > 0) groups.push(lastGroup);
	let result: EditorSpan[] = [];
	_.each(groups, function (group) {
		result = result.concat(_splitSpans(group));
	});
	return result;
}

function _injectAnnotations(html: string, spans: EditorSpan[]): string {
	let pos = 0;
	let wSpans = spans;
	const writer = Writer({ indent: true });

	function spanClasses(annotation: EditorAnnotation) {
		let result = 'annotation visible ' + annotation.kind + annotation.classes;
		if (annotation.attr.start) {
			result += ' start';
		}
		if (annotation.attr.end) {
			result += ' end';
		}
		if (annotation.attr.large) {
			result += ' large';
		} else {
			result += ' small';
		}
		return result;
	}

	function writeStartSpan(span: EditorSpan): void {
		_(span.annotations).each(function (annotation) {
			const attrs: Dict<string> = {
				'data-annotation': `${annotation.id}`,
				'data-annotation-idx': `${annotation.idx}`,
				class: spanClasses(annotation),
				'data-kind': annotation.kind,
			};
			if (annotation.group) {
				attrs['data-group'] = annotation.group;
			}
			writer.start('span', attrs);
		});
	}

	function writeEndSpan(span: EditorSpan): void {
		_(span.annotations).each(() => {
			writer.end('span');
		});
	}

	const stack: string[] = [];

	let nocheck = 0;

	const parser = new Parser({
		ontext: function (text) {
			if (nocheck == 0) {
				let txt = text;
				while (txt.length > 0) {
					let start = pos;
					let end = pos + txt.length;
					let span: EditorSpan = _.head(wSpans)!;

					const writeText = (text: string): void => {
						writer.text(text);
						pos += text.length;
						start = pos;
						end = pos + txt.length;
					};

					if (span) {
						const splitTxt = (len: number): string => {
							let result = '';
							if (len > 0) {
								result = txt.substring(0, len);
								txt = txt.substring(len);
							}
							return result;
						};

						const writeSpan = (): void => {
							const _txt = splitTxt(span.end - span.start);
							const inList = _.last(stack) === 'ul' || _.last(stack) === 'ol';
							if (inList) {
								writeText(_txt);
							} else {
								writeStartSpan(span);
								writeText(_txt);
								writeEndSpan(span);
							}
						};

						const writeTxt = (): void => {
							const _txt = splitTxt(span.start - pos);
							if (_txt.length > 0) {
								writeText(_txt);
							}
						};

						const splitSpan = (): void => {
							const s: EditorSpan = span;
							span = {
								start: s.start,
								end: s.start + txt.length,
								annotations: _.map(s.annotations, _withoutEnd),
							};
							wSpans[0] = {
								start: s.start + txt.length,
								end: s.end,
								annotations: _.map(s.annotations, _withoutStart),
							};
						};

						if (span.start >= end) {
							/**
							 * |----text----|
							 *              |----span----|
							 *
							 * |----text----|
							 *                 |----span----|
							 */
							writeTxt();
						} else if (start == span.start && end == span.end) {
							/**
							 * |----text----|
							 * |----span----|
							 */
							writeSpan();
							wSpans = _.tail(wSpans);
						} else if (start == span.start && end > span.end) {
							/**
							 * |----text----|
							 * |--span--|
							 */
							writeSpan();
							wSpans = _.tail(wSpans);
						} else if (start == span.start && end < span.end) {
							/**
							 * |----text----|
							 * |------span------|
							 */
							splitSpan();
							writeSpan();
						} else if (start < span.start && end > span.end) {
							/**
							 * |----text----|
							 *   |--span--|
							 */
							writeTxt();
							writeSpan();
							wSpans = _.tail(wSpans);
						} else if (start < span.start && end == span.end) {
							/**
							 * |----text----|
							 *     |--span--|
							 */
							writeTxt();
							writeSpan();
							wSpans = _.tail(wSpans);
						} else if (start < span.start && end < span.end) {
							/**
							 * |----text----|
							 *     |----span----|
							 */
							writeTxt();
							splitSpan();
							writeSpan();
						} else {
							console.assert(
								false,
								'Unexpected situation start:',
								start,
								'end:',
								end,
								'span:',
								span
							);
							break;
						}
					} else {
						writeText(txt);
						txt = '';
					}
				}
			} else {
				writer.text(text);
			}
		},
		onopentag: function (name, attrs) {
			const isHidden = (): boolean => {
				return (
					_.findIndex(
						_.keys(attrs),
						a => a.toLowerCase() === 'data-litera5-hidden'
					) > -1
				);
			};

			const isNoCheck = (): boolean => {
				return (
					_.findIndex(
						_.keys(attrs),
						a => a.toLowerCase() === 'data-litera5-nocheck'
					) > -1
				);
			};

			writer.start(name, attrs);
			if (nocheck > 0 || isHidden() || isNoCheck()) {
				nocheck += 1;
			} else {
				stack.push(name.toLowerCase());
				if ('br' == name.toLowerCase()) {
					const span = _.head(wSpans);
					if (span && span.start == pos) {
						span.start = pos + 1;
					}
					pos += 1;
				}
			}
		},
		onclosetag: function (name) {
			writer.end(name);
			if (nocheck > 0) {
				nocheck -= 1;
			} else {
				if (_(stack).last() == name.toLowerCase()) {
					stack.pop();
				}
			}
		},
	});
	parser.parseComplete(html);
	return writer.getContent();
}

export function annotate(html: string, annotations: Annotations): string {
	let spans = _getSpans(annotations.annotations);
	spans = _splitSpansEx(spans);
	return _injectAnnotations(html, spans);
}