var cleanup = require('./cleanup');
var html2ogxt = require('./html2ogxt');
var annotate = require('./annotate');
var parseTitle = require('./parseTitle');

module.exports = {
    /**
     * Remove all Litera5 annotation spans from the text (good for saving document)
     *
     * @param {string} html
     * @returns {string}
     */
    cleanupAnnotations: cleanup.annotations,
    /**
     * Cleaning the html removing all styles, empty spans, removing annotations and so on
     *
     * @param {string} html
     * @param {boolean} removeAnnotations if `true` cleanup annotations also
     * @returns {string}
     */
    cleanupHtml: cleanup.html,
    /**
     * Parse text from html for check with Litera5 API
     *
     * @param {string} html
     * @returns {string} text with metadata in OGXT format
     */
    html2ogxt: html2ogxt,
    /**
     * Add Litera5 annotations spans to the checked html
     *
     * @param {string} html
     * @param {object} annotations
     * @returns {string} html annotated with Litera5 annotations showing errors found
     */
    annotate: annotate,
    /**
     * Parse the text "title" taking first 5 words of text cut it to 40 chars if needed
     *
     * @param {string} text
     * @returns {string}
     */
    parseTitle: parseTitle
};
