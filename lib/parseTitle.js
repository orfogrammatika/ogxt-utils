"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTitle = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 * Parse the text "title" taking first 5 words of text cut it to 40 chars if needed
 * @param {string} text
 * @returns {string}
 */
function parseTitle(text) {
    let arr = text
        .trim()
        .replace(/[\\/:*?"<>|.\r]/g, '')
        .replace(/[\n\t\s]+/g, ' ')
        .split(' ');
    arr = lodash_1.default.filter(arr, a => !lodash_1.default.isEmpty(a.trim()));
    let res = '';
    for (let i = 0; i < Math.min(5, arr.length); i++) {
        if (i > 0) {
            res += ' ';
        }
        res += arr[i];
    }
    res = res.substring(0, 40) + '…';
    return res;
}
exports.parseTitle = parseTitle;
