"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameText = void 0;
const lodash_1 = __importDefault(require("lodash"));
function _normalizeText(str) {
    const strLines = str.split('\n');
    const lines = (0, lodash_1.default)(strLines).map(function (line) {
        return line.trim();
    });
    return lines.join('\n').replace(/\s+/g, ' ').trim();
}
/**
 * Compare two texts are same ignoring the space chars
 * @param {string} str1
 * @param {string} str2
 * @returns {boolean}
 */
function sameText(str1, str2) {
    const nstr1 = _normalizeText(str1);
    const nstr2 = _normalizeText(str2);
    return nstr1 == nstr2;
}
exports.sameText = sameText;
