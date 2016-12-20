var _ = require('lodash');
var htmlparser = require('htmlparser2');

var htmlwriter = require('./htmlwriter');

var model = {};

/**
 * @typedef {{
 *   start: number,
 *   end: number
 * }}
 */
model.Position;

/**
 * @typedef {{
 *   id: Number,
 *   kind: string,
 *   selection: string,
 *   description: string,
 *   suggestion: string,
 *   suggestionId: Number,
 *   explanation: string,
 *   rule: string,
 *   group: string,
 *   attrs: Array.<string>,
 *   position: Array.<model.Position>
 * }}
 */
model.Annotation;

/**
 * @typedef {{
 *   kinds: Object,
 *   annotations: Array.<model.Annotation>
 * }}
 */
model.Annotations;

var Attrs = {
    Priority: {
        high: 'priority_high'
    },
    Mode: {
        multi: 'multi',
        single: 'single'
    }
};


var Editor = {};

/**
 * @typedef {{
 *     id: number,
 *     idx: number,
 *     kind: string,
 *     group: string,
 *     classes: string,
 *     attr: {
 *         start: boolean,
 *         end: boolean,
 *         large: boolean
 *     }
 * }}
 */
Editor.Annotation;

/**
 * @typedef {{
 *      start: number,
 *      end: number,
 *      annotations: Array.<Editor.Annotation>
 * }}
 */
Editor.Span;

/**
 * @typedef {{
 *      items: Array.<Editor.Span>,
 *      span: (Editor.Span|null)
 * }}
 */
Editor.IntersectResult;

/**
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {number}
 */
function _compareSpans(a, b) {
    var result = (a.start - b.start);
    if (result == 0)
        result = (a.end - b.end);
    return result;
}

/**
 * @param {model.Annotations} annotations
 * @returns {Array.<Editor.Span>}
 */
function _getSpans(annotations) {
    var result = [];

    /**
     * @param {model.Position} position
     * @returns {boolean}
     */
    function isLarge(position) {
        return (position.end - position.start) > 64;
    }

    function attrsClasses(attrs) {
        var result = '';
        if (_.includes(attrs, Attrs.Priority.high))
            result += ' attr_' + Attrs.Priority.high;
        return result;
    }

    _.each(annotations, function (annotation, index) {
        _.each(annotation.position, function (position, idx) {
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
                            large: isLarge(position)
                        }
                    }
                ]
            })
        });
    });
    return result.sort(_compareSpans);

}


function _withoutEnd(annotation) {
    var res = _.cloneDeep(annotation);
    res.attr.end = false;
    return res;
}

function _withoutStart(annotation) {
    var res = _.cloneDeep(annotation);
    res.attr.start = false;
    return res;
}

function _withoutStartEnd(annotation) {
    var res = _.cloneDeep(annotation);
    res.attr.start = false;
    res.attr.end = false;
    return res;
}

/**
 * |---------a---------|
 *                     |---------b---------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _noIntersection(a, b) {
    return {
        items: [a],
        span: b
    };
}

/**
 * |---------a---------|
 * |---------b---------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _intersectAequalsB(a, b) {
    return {
        items: [
            {
                start: a.start,
                end: a.end,
                annotations: [].concat(a.annotations, b.annotations)
            }
        ],
        span: null
    };
}

/**
 * |------a------|
 * |---------b---------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _intersectAinBsameStart(a, b) {
    var s1 = /** @type {Editor.Span} */({
        start: a.start,
        end: a.end,
        annotations: [].concat(a.annotations, _.map(b.annotations, _withoutEnd))
    });
    var s2 = /** @type {Editor.Span} */({
        start: a.end,
        end: b.end,
        annotations: _.map(b.annotations, _withoutStart)
    });
    return {
        items: [s1],
        span: s2
    };
}

/**
 * |-----------a-----------|
 * |---------b---------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _intersectBinAsameStart(a, b) {
    var s1 = /** @type {Editor.Span} */({
        start: a.start,
        end: b.end,
        annotations: [].concat(_.map(a.annotations, _withoutEnd), b.annotations)
    });
    var s2 = /** @type {Editor.Span} */({
        start: b.end,
        end: a.end,
        annotations: _.map(a.annotations, _withoutStart)
    });
    return {
        items: [s1, s2],
        span: null
    };
}

/**
 * |-----------a-----------|
 *     |---------b---------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _intersectBinAsameEnd(a, b) {
    var s1 = /** @type {Editor.Span} */({
        start: a.start,
        end: b.start,
        annotations: _.map(a.annotations, _withoutEnd)
    });
    var s2 = /** @type {Editor.Span} */({
        start: b.start,
        end: a.end,
        annotations: [].concat(_.map(a.annotations, _withoutStart), b.annotations)
    });
    return {
        items: [s1, s2],
        span: null
    };
}

/**
 * |-----------a-----------|
 *     |-------------b-------------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _intersectBoverA(a, b) {
    var s1 = /** @type {Editor.Span} */({
        start: a.start,
        end: b.start,
        annotations: _.map(a.annotations, _withoutEnd)
    });
    var s2 = /** @type {Editor.Span} */({
        start: b.start,
        end: a.end,
        annotations: [].concat(_.map(a.annotations, _withoutStart), _.map(b.annotations, _withoutEnd))
    });
    var s3 = /** @type {Editor.Span} */({
        start: a.end,
        end: b.end,
        annotations: _.map(b.annotations, _withoutStart)
    });
    return {
        items: [s1, s2],
        span: s3
    };
}

/**
 * |-----------a-----------------|
 *     |---------b---------|
 * @param {Editor.Span} a
 * @param {Editor.Span} b
 * @returns {Editor.IntersectResult}
 */
function _intersectBinA(a, b) {
    var s1 = /** @type {Editor.Span} */({
        start: a.start,
        end: b.start,
        annotations: _.map(a.annotations, _withoutEnd)
    });
    var s2 = /** @type {Editor.Span} */({
        start: b.start,
        end: b.end,
        annotations: [].concat(_.map(a.annotations, _withoutStartEnd), b.annotations)
    });
    var s3 = /** @type {Editor.Span} */({
        start: b.end,
        end: a.end,
        annotations: _.map(a.annotations, _withoutStart)
    });
    return {
        items: [s1, s2, s3],
        span: null
    };
}

function _intersectSpans(/**Editor.Span*/a, /**Editor.Span*/b) {
    var result;
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

/**
 * @param {Array.<Editor.Span>} spans
 * @param {Editor.Span} span
 * @returns {Array.<Editor.Span>}
 */
function _intersectAllSpans(spans, span) {
    /**
     * @type {Array.<Editor.Span>}
     */
    var result = [];
    if (spans.length == 0 && span != null)
        result.push(span);
    else {
        var res = _intersectSpans(/**  @type {Editor.Span} */(_.head(spans)), span);
        var _tail = /**  @type {Array.<Editor.Span>} */(_.tail(spans));
        if (res.span == null) {
            result = result.concat(res.items, _tail);
        } else {
            result = result.concat(res.items, _intersectAllSpans(_tail, res.span));
        }
    }
    return result;
}

/**
 * @param {Array.<Editor.Span>} spans
 * @returns {Array.<Editor.Span>}
 */
function _splitSpans(spans) {
    /**
     * @type {Array.<Editor.Span>}
     */
    var result = [];
    _.each(spans, function (span) {
        result = _intersectAllSpans(result, span);
    });
    return result;
}


/**
 * Модификация разбиения спанов. Сначала все спаны разбиваются на непересекающиеся группы,
 *  а затем для каждой группы применяется старый (полный) механизм разбиения
 * @param {Array.<Editor.Span>} spans
 * @returns {Array.<Editor.Span>}
 */
function _splitSpansEx(spans) {
    /**
     * @type {Array.<Editor.Span>}
     */
    spans.sort(function (a, b) {
        var result = a.start - b.start;
        if (result == 0)
            result = a.end - b.end;
        return result;
    });
    var groups = [];
    var lastGroup = [];
    var compareIdx = -1;
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].start > compareIdx) {
            if (lastGroup.length > 0)
                groups.push(lastGroup);
            lastGroup = [spans[i]];
            compareIdx = spans[i].end;
        } else {
            lastGroup.push(spans[i]);
            if (compareIdx < spans[i].end)
                compareIdx = spans[i].end;
        }
    }
    if (lastGroup.length > 0)
        groups.push(lastGroup);
    var result = [];
    _.each(groups, function (group) {
        result = result.concat(_splitSpans(group));
    });
    return result;
}

/**
 * @param {string} html
 * @param {Array.<Editor.Span>} spans
 * @returns {string}
 */
function _injectAnnotations(html, spans) {
    var pos = 0;
    /**
     * @type {Array.<Editor.Span>}
     */
    var wSpans = spans;
    var writer = new htmlwriter.Writer({indent: true});

    function spanClasses(/** Editor.Annotation */annotation) {
        var result = 'annotation visible ' + annotation.kind + annotation.classes;
        if (annotation.attr.start)
            result += ' start';
        if (annotation.attr.end)
            result += ' end';
        if (annotation.attr.large)
            result += ' large';
        else
            result += ' small';
        return result;
    }

    /**
     * @param {Editor.Span} span
     */
    function writeStartSpan(span) {
        _(span.annotations).each(function (/** Editor.Annotation */annotation) {
            var attrs = [
                {
                    name: 'data-annotation',
                    value: '' + annotation.id
                },
                {
                    name: 'data-annotation-idx',
                    value: '' + annotation.idx
                },
                {
                    name: 'class',
                    value: spanClasses(annotation)
                },
                {
                    name: 'data-kind',
                    value: annotation.kind
                }
            ];
            if (annotation.group) {
                attrs.push({
                    name: 'data-group',
                    value: annotation.group
                });
            }
            writer.start('span', attrs);
        });
    }

    function writeEndSpan(span) {
        _(span.annotations).each(function (annotation) {
            writer.end('span');
        });
    }

    var stack = [];

    var nocheck = 0;

    var parser = new htmlparser.Parser({
        ontext: function (text) {
            if (nocheck == 0) {
                var txt = text;
                while (txt.length > 0) {
                    var start = pos;
                    var end = pos + txt.length;
                    var span = /** @type {Editor.Span} */(_(wSpans).head());

                    /**
                     * @param {string} text
                     */
                    function writeText(text) {
                        writer.text(text);
                        pos += text.length;
                        start = pos;
                        end = pos + txt.length;
                    }

                    if (span) {
                        function splitTxt(len) {
                            var result = '';
                            if (len > 0) {
                                result = txt.substring(0, len);
                                txt = txt.substring(len);
                            }
                            return result;
                        }

                        function writeSpan() {
                            var txt = splitTxt(span.end - span.start);
                            var inList = _(stack).last() == 'ul' || _(stack).last() == 'ol';
                            if (inList) {
                                writeText(txt);
                            } else {
                                writeStartSpan(span);
                                writeText(txt);
                                writeEndSpan(span);
                            }
                        }

                        function writeTxt() {
                            var txt = splitTxt(span.start - pos);
                            if (txt.length > 0)
                                writeText(txt);
                        }

                        function splitSpan() {
                            var s = /** @type {Editor.Span} */(span);
                            span = /** @type {Editor.Span} */({
                                start: s.start,
                                end: s.start + txt.length,
                                annotations: _(s.annotations).map(withoutEnd)
                            });
                            wSpans[0] = /** @type {Editor.Span} */({
                                start: s.start + txt.length,
                                end: s.end,
                                annotations: _(s.annotations).map(withoutStart)
                            });
                        }

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
                            wSpans = _(/** @type {Array.<Editor.Span>} */(wSpans)).tail();
                        } else if (start == span.start && end > span.end) {
                            /**
                             * |----text----|
                             * |--span--|
                             */
                            writeSpan();
                            wSpans = _(/** @type {Array.<Editor.Span>} */(wSpans)).tail();
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
                            wSpans = _(/** @type {Array.<Editor.Span>} */(wSpans)).tail();
                        } else if (start < span.start && end == span.end) {
                            /**
                             * |----text----|
                             *     |--span--|
                             */
                            writeTxt();
                            writeSpan();
                            wSpans = _(/** @type {Array.<Editor.Span>} */(wSpans)).tail();
                        } else if (start < span.start && end < span.end) {
                            /**
                             * |----text----|
                             *     |----span----|
                             */
                            writeTxt();
                            splitSpan();
                            writeSpan();
                        } else {
                            console.assert(false, 'Unexpected situation start:', start, 'end:', end, 'span:', span);
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
            function isHidden() {
                return _(attrs).find(function (o) {
                        return o.name.toLowerCase() == 'data-litera5-hidden';
                    }) != undefined;
            }

            function isNoCheck() {
                return _(attrs).find(function (o) {
                        return o.name.toLowerCase() == 'data-litera5-nocheck';
                    }) != undefined;
            }

            writer.start(name, attrs);
            if (nocheck > 0 || isHidden() || isNoCheck()) {
                nocheck += 1;
            } else {
                stack.push(name.toLowerCase());
                if ('br' == name.toLowerCase()) {
                    var span = /** @type {Editor.Span} */(_(wSpans).head());
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
        }
    });
    parser.parse(html);
    return writer.getContent();
}

/**
 * @param {string} html
 * @param {model.Annotations} annotations
 * @returns {string} html annotated with Litera5 annotations showing errors found
 */
module.exports = function annotate(html, annotations) {
    var spans = _getSpans(annotations.annotations);
    spans = _splitSpansEx(spans);
    return _injectAnnotations(html, spans);
};