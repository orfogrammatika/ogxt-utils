var cleanupHtml = require('./cleanupHtml');
var sameText = require('./sameText');
var meta = require('./meta');
var html2ogxt = require('./html2ogxt');

module.exports = {
    addMeta: meta.add,
    stripMeta: meta.strip,
    cleanupHtml: cleanupHtml,
    html2ogxt: html2ogxt,
    sameText: sameText
};
