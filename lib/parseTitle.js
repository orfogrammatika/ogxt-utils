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
exports.parseTitle = void 0;
const _ = __importStar(require("lodash"));
const runes = __importStar(require("runes"));
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
    arr = _.filter(arr, a => !_.isEmpty(a.trim()));
    const res = arr.slice(0, 5).join(' ');
    return runes.substr(res, 0, 40) + '…';
}
exports.parseTitle = parseTitle;
