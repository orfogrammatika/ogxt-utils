"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupAnnotations = exports.cleanupHtml = void 0;
const lodash_1 = __importDefault(require("lodash"));
const replaceWithContent_1 = require("./replaceWithContent");
function _cleanupAnnotations($node) {
    (0, replaceWithContent_1.replaceWithContent)($node, 'span.annotation');
    (0, replaceWithContent_1.replaceWithContent)($node, 'span[data-kind][data-annotation][data-annotation-idx]');
}
function _cleanupScripts($node) {
    $node.querySelectorAll('script').forEach(e => e.remove());
}
function _cleanupStyles($node) {
    $node.querySelectorAll('style').forEach(e => e.remove());
}
function _firstEmptySpan($node) {
    const $spans = $node.querySelectorAll('span');
    return lodash_1.default.find($spans, s => !s.hasAttributes()) || null;
}
function _cleanupEmptySpans($node) {
    (0, replaceWithContent_1.replaceWithContent)(() => _firstEmptySpan($node));
}
function _savePreContent($node) {
    return (0, lodash_1.default)($node.querySelectorAll('pre'))
        .map(function ($el, idx) {
        $el.setAttribute('data-temp-pre-index', `${idx}`);
        return $el.innerHTML;
    })
        .value();
}
function _restorePreContent($node, pre) {
    let $pre = $node.querySelector('[data-temp-pre-index]');
    while ($pre) {
        const idx = parseInt($pre.getAttribute('data-temp-pre-index'));
        $pre.removeAttribute('data-temp-pre-index');
        $pre.innerHTML = pre[idx];
        $pre = $node.querySelector('[data-temp-pre-index]');
    }
}
function _addNlAfterTag(html, tag) {
    const expr = new RegExp('<\\s*/\\s*' + tag + '\\s*>', 'ig');
    return html.replace(expr, '</' + tag + '>\n');
}
function _splitLines(html) {
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
function _cleanupLineBreaks($node) {
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
function cleanupHtml(html, document, removeAnnotations) {
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
exports.cleanupHtml = cleanupHtml;
/**
 * Remove all Litera5 annotation spans from the text (good for saving document)
 */
function cleanupAnnotations(html, document) {
    const $html = document.createElement('div');
    $html.innerHTML = html;
    _cleanupAnnotations($html);
    return $html.innerHTML;
}
exports.cleanupAnnotations = cleanupAnnotations;
