var $ = require('jquery');
var _ = require('lodash');

var replaceWithContent = require('./replaceWithContent');

function _cleanupAnnotations(/**jQuery*/$node) {
    replaceWithContent($node, 'span.annotation');
    replaceWithContent($node, 'span[data-kind][data-annotation][data-annotation-idx]');
}

function _cleanupScripts(/**jQuery*/$node) {
    $node.find('script').remove();
}

function _cleanupStyles(/**jQuery*/$node) {
    $node.find('style').remove();
}

function _firstEmptySpan($node) {
    var $spans = $node.find('span');
    for (var i = 0; i < $spans.length; i++) {
        if (!$spans[i].hasAttributes())
            return $node.find($spans[i]);
    }
    return [];
}

function _cleanupEmptySpans(/**jQuery*/$node) {
    replaceWithContent(function () {
        return _firstEmptySpan($node);
    });
}

function _savePreContent(/**jQuery*/$node) /**Array.<string>*/ {
    return _($node.find('pre')).map(function (el, idx) {
        var $el = $(el);
        $el.attr('data-temp-pre-index', idx);
        return $el.html();
    }).value();
}

function _restorePreContent(/**jQuery*/$node, /**Array.<String>*/pre) {
    while ($node.find('[data-temp-pre-index]').length > 0) {
        var $pre = $($node.find('[data-temp-pre-index]')[0]);
        var idx = $pre.data('temp-pre-index');
        $pre.removeAttr('data-temp-pre-index');
        $pre.html(pre[idx]);
    }
}

function _addNlAfterTag(/**String*/html, /**String*/tag) /**String*/ {
    var expr = new RegExp('<\\s*/\\s*' + tag + '\\s*>', 'ig');
    return html.replace(expr, '</' + tag + '>\n');
}

function _splitLines(/**String*/html) /**String*/ {
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

function _cleanupLineBreaks(/**jQuery*/$node) {
    var pre = _savePreContent($node);
    var html = $node.html();
    html = html.replace(/\s+/g, ' ');
    html = _splitLines(html);
    html = html.replace(/\n+/gim, '\n');
    $node.html(html);
    _restorePreContent($node, pre);
}

module.exports = {
    /**
     * Cleaning the html removing all styles, empty spans, removing annotations and so on
     * @param {string} html
     * @param {boolean} removeAnnotations
     * @returns {string}
     */
    html: function (html, removeAnnotations) {
        var $html = $('<div></div>');
        $html.html(html);
        if (removeAnnotations)
            _cleanupAnnotations($html);
        _cleanupStyles($html);
        _cleanupScripts($html);
        _cleanupEmptySpans($html);
        _cleanupLineBreaks($html);
        return $html.html();
    },
    /**
     * Remove all Litera5 annotation spans from the text (good for saving document)
     *
     * @param {string} html
     * @returns {string}
     */
    annotations: function (html) {
        var $html = $('<div></div>');
        $html.html(html);
        _cleanupAnnotations($html);
        return $html.html();
    }
};