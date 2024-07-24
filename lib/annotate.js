"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = void 0;
const _ = __importStar(require("lodash"));
const HtmlParser_1 = require("./HtmlParser");
const htmlwriter_1 = require("./htmlwriter");
const utils_1 = require("./utils");
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
        if (_.includes(attrs, Attrs.Priority.high))
            result += ` attr_${Attrs.Priority.high}`;
        return result;
    }
    _.each(annotations, (annotation, aidx) => {
        _.each(annotation.position, (position, idx) => {
            result.push({
                start: position.start,
                end: position.end + 1,
                annotations: [
                    {
                        id: aidx,
                        idx: idx,
                        kind: annotation.kind,
                        group: annotation.group,
                        intensity: annotation.intensity,
                        tuid: annotation.tuid,
                        alternateId: annotation.alternateId,
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
    const res = _.cloneDeep(annotation);
    res.attr.end = false;
    return res;
}
function _withoutStart(annotation) {
    const res = _.cloneDeep(annotation);
    res.attr.start = false;
    return res;
}
function _withoutStartEnd(annotation) {
    const res = _.cloneDeep(annotation);
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
function _intersectAinBsameStart(a, b) {
    const s1 = {
        start: a.start,
        end: a.end,
        annotations: _.concat(a.annotations, _.map(b.annotations, _withoutEnd)),
    };
    const s2 = {
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
function _intersectBinAsameStart(a, b) {
    const s1 = {
        start: a.start,
        end: b.end,
        annotations: _.concat(_.map(a.annotations, _withoutEnd), b.annotations),
    };
    const s2 = {
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
function _intersectBinAsameEnd(a, b) {
    const s1 = {
        start: a.start,
        end: b.start,
        annotations: _.map(a.annotations, _withoutEnd),
    };
    const s2 = {
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
function _intersectBoverA(a, b) {
    const s1 = {
        start: a.start,
        end: b.start,
        annotations: _.map(a.annotations, _withoutEnd),
    };
    const s2 = {
        start: b.start,
        end: a.end,
        annotations: _.concat(_.map(a.annotations, _withoutStart), _.map(b.annotations, _withoutEnd)),
    };
    const s3 = {
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
function _intersectBinA(a, b) {
    const s1 = {
        start: a.start,
        end: b.start,
        annotations: _.map(a.annotations, _withoutEnd),
    };
    const s2 = {
        start: b.start,
        end: b.end,
        annotations: _.concat(_.map(a.annotations, _withoutStartEnd), b.annotations),
    };
    const s3 = {
        start: b.end,
        end: a.end,
        annotations: _.map(a.annotations, _withoutStart),
    };
    return {
        items: [s1, s2, s3],
        span: undefined,
    };
}
function _intersectSpans(a, b) {
    let result;
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const res = _intersectSpans(_.head(spans), span);
        const _tail = _.tail(spans);
        if (res) {
            if (_.isNil(res.span)) {
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
    _.each(spans, span => {
        result = _intersectAllSpans(result, span);
    });
    return result;
}
/**
 * Модификация разбиения спанов. Сначала все спаны разбиваются на непересекающиеся группы,
 *  а затем для каждой группы применяется старый (полный) механизм разбиения
 */
function _splitSpansEx(spans) {
    spans.sort((a, b) => {
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
    _.each(groups, group => {
        result = result.concat(_splitSpans(group));
    });
    return result;
}
function _spanClassesVisual(annotation) {
    let result = `annotation visible ${annotation.kind}${annotation.classes}`;
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
const voidTags = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true,
};
function _noVoidTag(name) {
    return !voidTags[name.toLowerCase()];
}
function _normalizeIntensity(intensity) {
    return '' + Math.round(parseFloat(intensity) * 20) * 5;
}
function _injectAnnotations(html, spans, spanClasses) {
    let pos = 0;
    let wSpans = spans;
    const writer = (0, htmlwriter_1.Writer)({ indent: true });
    function writeStartSpan(span) {
        _.forEach(span.annotations, (annotation) => {
            const attrs = {
                'data-annotation': `${annotation.id}`,
            };
            if (!_.isNil(annotation.idx)) {
                attrs['data-annotation-idx'] = `${annotation.idx}`;
            }
            attrs['class'] = spanClasses(annotation);
            attrs['data-kind'] = annotation.kind;
            if (!_.isNil(annotation.alternateId)) {
                attrs['data-alternate-annotation'] = `${annotation.alternateId}`;
            }
            if (!_.isNil(annotation.tuid)) {
                attrs['data-tuid'] = annotation.tuid;
            }
            if (!_.isNil(annotation.intensity)) {
                attrs['data-intensity'] = _normalizeIntensity(annotation.intensity);
            }
            if (!_.isNil(annotation.group)) {
                attrs['data-group'] = annotation.group;
            }
            writer.start('span', attrs);
        });
    }
    function writeEndSpan(span) {
        _.forEach(span.annotations, () => {
            writer.end('span');
        });
    }
    const stack = [];
    let nocheck = 0;
    const parser = new HtmlParser_1.HtmlParser({
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        ontext(text) {
            if (nocheck == 0) {
                let txt = text;
                while (txt.length > 0) {
                    let start = pos;
                    let end = pos + txt.length;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    let span = _.head(wSpans);
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
                            const inList = _.last(stack) === 'ul' || _.last(stack) === 'ol';
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
                        }
                        else if (start == span.start && end == span.end) {
                            /**
                             * |----text----|
                             * |----span----|
                             */
                            writeSpan();
                            wSpans = _.tail(wSpans);
                        }
                        else if (start == span.start && end > span.end) {
                            /**
                             * |----text----|
                             * |--span--|
                             */
                            writeSpan();
                            wSpans = _.tail(wSpans);
                        }
                        else if (start == span.start && end < span.end) {
                            /**
                             * |----text----|
                             * |------span------|
                             */
                            console.log('txt:', `"${txt}"`, 'start:', start, 'end:', end, 'span:', span);
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
                            wSpans = _.tail(wSpans);
                        }
                        else if (start < span.start && end == span.end) {
                            /**
                             * |----text----|
                             *     |--span--|
                             */
                            writeTxt();
                            writeSpan();
                            wSpans = _.tail(wSpans);
                        }
                        else if (start < span.start && end < span.end) {
                            /**
                             * |----text----|
                             *     |----span----|
                             */
                            console.log('txt:', `"${txt}"`, 'start:', start, 'end:', end, 'span:', span);
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
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        onopentag(name, attrs) {
            const isHidden = () => {
                return (0, utils_1.isTagHidden)(attrs);
            };
            const isNoCheck = () => {
                return (0, utils_1.isTagNoCheck)(attrs);
            };
            writer.start(name, attrs);
            if (nocheck > 0 || isHidden() || isNoCheck()) {
                nocheck += 1;
            }
            else {
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
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        onclosetag(name) {
            if (_noVoidTag(name)) {
                writer.end(name);
            }
            if (nocheck > 0) {
                nocheck -= 1;
            }
            else if (_.last(stack) == name.toLowerCase()) {
                stack.pop();
            }
        },
    });
    parser.parseComplete(html);
    return writer.getContent();
}
/**
 * Добавляет в `html` аннотации `annotations` в виде span-ов со специфическими стилями для последующей визуализации отчёта
 * @param html
 * @param annotations
 */
function annotate(html, annotations) {
    let spans = _getSpans(annotations.annotations);
    spans = _splitSpansEx(spans);
    return _injectAnnotations(html, spans, _spanClassesVisual);
}
exports.annotate = annotate;
