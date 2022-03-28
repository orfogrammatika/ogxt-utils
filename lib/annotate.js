"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = void 0;
const lodash_1 = __importDefault(require("lodash"));
const htmlparser2_1 = require("htmlparser2");
const htmlwriter_1 = require("./htmlwriter");
const Attrs = {
    Priority: {
        high: 'priority_high',
    },
    Mode: {
        multi: 'multi',
        single: 'single',
    },
};
function _compareSpans(a, b) {
    let result = a.start - b.start;
    if (result == 0) {
        result = a.end - b.end;
    }
    return result;
}
function _getSpans(annotations) {
    const result = [];
    function isLarge(position) {
        return position.end - position.start > 64;
    }
    function attrsClasses(attrs) {
        let result = '';
        if (lodash_1.default.includes(attrs, Attrs.Priority.high))
            result += ' attr_' + Attrs.Priority.high;
        return result;
    }
    lodash_1.default.each(annotations, function (annotation, index) {
        lodash_1.default.each(annotation.position, function (position, idx) {
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
function _withoutEnd(annotation) {
    const res = lodash_1.default.cloneDeep(annotation);
    res.attr.end = false;
    return res;
}
function _withoutStart(annotation) {
    const res = lodash_1.default.cloneDeep(annotation);
    res.attr.start = false;
    return res;
}
function _withoutStartEnd(annotation) {
    const res = lodash_1.default.cloneDeep(annotation);
    res.attr.start = false;
    res.attr.end = false;
    return res;
}
/**
 * |---------a---------|
 *                     |---------b---------|
 */
function _noIntersection(a, b) {
    return {
        items: [a],
        span: b,
    };
}
/**
 * |---------a---------|
 * |---------b---------|
 */
function _intersectAequalsB(a, b) {
    return {
        items: [
            {
                start: a.start,
                end: a.end,
                annotations: lodash_1.default.concat(a.annotations, b.annotations),
            },
        ],
        span: undefined,
    };
}
/**
 * |------a------|
 * |---------b---------|
 */
function _intersectAinBsameStart(a, b) {
    const s1 = {
        start: a.start,
        end: a.end,
        annotations: lodash_1.default.concat(a.annotations, lodash_1.default.map(b.annotations, _withoutEnd)),
    };
    const s2 = {
        start: a.end,
        end: b.end,
        annotations: lodash_1.default.map(b.annotations, _withoutStart),
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
function _intersectBinAsameStart(a, b) {
    const s1 = {
        start: a.start,
        end: b.end,
        annotations: lodash_1.default.concat(lodash_1.default.map(a.annotations, _withoutEnd), b.annotations),
    };
    const s2 = {
        start: b.end,
        end: a.end,
        annotations: lodash_1.default.map(a.annotations, _withoutStart),
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
function _intersectBinAsameEnd(a, b) {
    const s1 = {
        start: a.start,
        end: b.start,
        annotations: lodash_1.default.map(a.annotations, _withoutEnd),
    };
    const s2 = {
        start: b.start,
        end: a.end,
        annotations: lodash_1.default.concat(lodash_1.default.map(a.annotations, _withoutStart), b.annotations),
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
function _intersectBoverA(a, b) {
    const s1 = {
        start: a.start,
        end: b.start,
        annotations: lodash_1.default.map(a.annotations, _withoutEnd),
    };
    const s2 = {
        start: b.start,
        end: a.end,
        annotations: lodash_1.default.concat(lodash_1.default.map(a.annotations, _withoutStart), lodash_1.default.map(b.annotations, _withoutEnd)),
    };
    const s3 = {
        start: a.end,
        end: b.end,
        annotations: lodash_1.default.map(b.annotations, _withoutStart),
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
function _intersectBinA(a, b) {
    const s1 = {
        start: a.start,
        end: b.start,
        annotations: lodash_1.default.map(a.annotations, _withoutEnd),
    };
    const s2 = {
        start: b.start,
        end: b.end,
        annotations: lodash_1.default.concat(lodash_1.default.map(a.annotations, _withoutStartEnd), b.annotations),
    };
    const s3 = {
        start: b.end,
        end: a.end,
        annotations: lodash_1.default.map(a.annotations, _withoutStart),
    };
    return {
        items: [s1, s2, s3],
        span: undefined,
    };
}
function _intersectSpans(a, b) {
    let result = undefined;
    if (a == b) {
        console.assert(false, 'a should not be the same as b');
    }
    else if (a.end <= b.start) {
        /**
         * |---------a---------|
         *                     |---------b---------|
         */
        result = _noIntersection(a, b);
    }
    else if (a.start == b.start && a.end == b.end) {
        /**
         * |---------a---------|
         * |---------b---------|
         */
        result = _intersectAequalsB(a, b);
    }
    else if (a.start == b.start && a.end < b.end) {
        /**
         * |------a------|
         * |---------b---------|
         */
        result = _intersectAinBsameStart(a, b);
    }
    else if (a.start == b.start && a.end > b.end) {
        /**
         * |-----------a-----------|
         * |---------b---------|
         */
        result = _intersectBinAsameStart(a, b);
    }
    else if (a.start < b.start && a.end == b.end) {
        /**
         * |-----------a-----------|
         *     |---------b---------|
         */
        result = _intersectBinAsameEnd(a, b);
    }
    else if (a.start < b.start && a.end < b.end && b.start < a.end) {
        /**
         * |-----------a-----------|
         *     |-------------b-------------|
         */
        result = _intersectBoverA(a, b);
    }
    else if (a.start < b.start && a.end > b.end && b.start < a.end) {
        /**
         * |-----------a-----------------|
         *     |---------b---------|
         */
        result = _intersectBinA(a, b);
    }
    else if (a.start > b.start && a.end == b.end) {
        /**
         *      |-------a------|
         * |---------b---------|
         */
        console.assert(false, 'b.start should not be less than a.start');
    }
    else if (a.start > b.start && a.end < b.end) {
        /**
         *      |----a----|
         * |---------b---------|
         */
        console.assert(false, 'b.start should not be less than a.start');
    }
    else if (a.start > b.start && a.end > b.end && a.start < b.end) {
        /**
         *      |----------a---------|
         * |---------b---------|
         */
        console.assert(false, 'b.start should not be less than a.start');
    }
    else if (a.start >= b.end) {
        /**
         *                     |----------a---------|
         * |---------b---------|
         */
        console.assert(false, 'b.start should not be less than a.start');
    }
    return result;
}
function _intersectAllSpans(spans, span) {
    let result = [];
    if (spans.length == 0 && span != null)
        result.push(span);
    else {
        const res = _intersectSpans(lodash_1.default.head(spans), span);
        const _tail = lodash_1.default.tail(spans);
        if (res) {
            if (lodash_1.default.isNil(res.span)) {
                result = result.concat(res.items, _tail);
            }
            else {
                result = result.concat(res.items, _intersectAllSpans(_tail, res.span));
            }
        }
    }
    return result;
}
function _splitSpans(spans) {
    let result = [];
    lodash_1.default.each(spans, function (span) {
        result = _intersectAllSpans(result, span);
    });
    return result;
}
/**
 * Модификация разбиения спанов. Сначала все спаны разбиваются на непересекающиеся группы,
 *  а затем для каждой группы применяется старый (полный) механизм разбиения
 */
function _splitSpansEx(spans) {
    spans.sort(function (a, b) {
        let result = a.start - b.start;
        if (result == 0) {
            result = a.end - b.end;
        }
        return result;
    });
    const groups = [];
    let lastGroup = [];
    let compareIdx = -1;
    for (let i = 0; i < spans.length; i++) {
        if (spans[i].start > compareIdx) {
            if (lastGroup.length > 0)
                groups.push(lastGroup);
            lastGroup = [spans[i]];
            compareIdx = spans[i].end;
        }
        else {
            lastGroup.push(spans[i]);
            if (compareIdx < spans[i].end)
                compareIdx = spans[i].end;
        }
    }
    if (lastGroup.length > 0)
        groups.push(lastGroup);
    let result = [];
    lodash_1.default.each(groups, function (group) {
        result = result.concat(_splitSpans(group));
    });
    return result;
}
function _injectAnnotations(html, spans) {
    let pos = 0;
    let wSpans = spans;
    const writer = (0, htmlwriter_1.Writer)({ indent: true });
    function spanClasses(annotation) {
        let result = 'annotation visible ' + annotation.kind + annotation.classes;
        if (annotation.attr.start) {
            result += ' start';
        }
        if (annotation.attr.end) {
            result += ' end';
        }
        if (annotation.attr.large) {
            result += ' large';
        }
        else {
            result += ' small';
        }
        return result;
    }
    function writeStartSpan(span) {
        (0, lodash_1.default)(span.annotations).each(function (annotation) {
            const attrs = {
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
    function writeEndSpan(span) {
        (0, lodash_1.default)(span.annotations).each(() => {
            writer.end('span');
        });
    }
    const stack = [];
    let nocheck = 0;
    const parser = new htmlparser2_1.Parser({
        ontext: function (text) {
            if (nocheck == 0) {
                let txt = text;
                while (txt.length > 0) {
                    let start = pos;
                    let end = pos + txt.length;
                    let span = lodash_1.default.head(wSpans);
                    const writeText = (text) => {
                        writer.text(text);
                        pos += text.length;
                        start = pos;
                        end = pos + txt.length;
                    };
                    if (span) {
                        const splitTxt = (len) => {
                            let result = '';
                            if (len > 0) {
                                result = txt.substring(0, len);
                                txt = txt.substring(len);
                            }
                            return result;
                        };
                        const writeSpan = () => {
                            const _txt = splitTxt(span.end - span.start);
                            const inList = lodash_1.default.last(stack) === 'ul' || lodash_1.default.last(stack) === 'ol';
                            if (inList) {
                                writeText(_txt);
                            }
                            else {
                                writeStartSpan(span);
                                writeText(_txt);
                                writeEndSpan(span);
                            }
                        };
                        const writeTxt = () => {
                            const _txt = splitTxt(span.start - pos);
                            if (_txt.length > 0) {
                                writeText(_txt);
                            }
                        };
                        const splitSpan = () => {
                            const s = span;
                            span = {
                                start: s.start,
                                end: s.start + txt.length,
                                annotations: lodash_1.default.map(s.annotations, _withoutEnd),
                            };
                            wSpans[0] = {
                                start: s.start + txt.length,
                                end: s.end,
                                annotations: lodash_1.default.map(s.annotations, _withoutStart),
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
                        }
                        else if (start == span.start && end == span.end) {
                            /**
                             * |----text----|
                             * |----span----|
                             */
                            writeSpan();
                            wSpans = lodash_1.default.tail(wSpans);
                        }
                        else if (start == span.start && end > span.end) {
                            /**
                             * |----text----|
                             * |--span--|
                             */
                            writeSpan();
                            wSpans = lodash_1.default.tail(wSpans);
                        }
                        else if (start == span.start && end < span.end) {
                            /**
                             * |----text----|
                             * |------span------|
                             */
                            splitSpan();
                            writeSpan();
                        }
                        else if (start < span.start && end > span.end) {
                            /**
                             * |----text----|
                             *   |--span--|
                             */
                            writeTxt();
                            writeSpan();
                            wSpans = lodash_1.default.tail(wSpans);
                        }
                        else if (start < span.start && end == span.end) {
                            /**
                             * |----text----|
                             *     |--span--|
                             */
                            writeTxt();
                            writeSpan();
                            wSpans = lodash_1.default.tail(wSpans);
                        }
                        else if (start < span.start && end < span.end) {
                            /**
                             * |----text----|
                             *     |----span----|
                             */
                            writeTxt();
                            splitSpan();
                            writeSpan();
                        }
                        else {
                            console.assert(false, 'Unexpected situation start:', start, 'end:', end, 'span:', span);
                            break;
                        }
                    }
                    else {
                        writeText(txt);
                        txt = '';
                    }
                }
            }
            else {
                writer.text(text);
            }
        },
        onopentag: function (name, attrs) {
            const isHidden = () => {
                return (lodash_1.default.findIndex(lodash_1.default.keys(attrs), a => a.toLowerCase() === 'data-litera5-hidden') > -1);
            };
            const isNoCheck = () => {
                return (lodash_1.default.findIndex(lodash_1.default.keys(attrs), a => a.toLowerCase() === 'data-litera5-nocheck') > -1);
            };
            writer.start(name, attrs);
            if (nocheck > 0 || isHidden() || isNoCheck()) {
                nocheck += 1;
            }
            else {
                stack.push(name.toLowerCase());
                if ('br' == name.toLowerCase()) {
                    const span = lodash_1.default.head(wSpans);
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
            }
            else {
                if ((0, lodash_1.default)(stack).last() == name.toLowerCase()) {
                    stack.pop();
                }
            }
        },
    });
    parser.parseComplete(html);
    return writer.getContent();
}
function annotate(html, annotations) {
    let spans = _getSpans(annotations.annotations);
    spans = _splitSpansEx(spans);
    return _injectAnnotations(html, spans);
}
exports.annotate = annotate;
