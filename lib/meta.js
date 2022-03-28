"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaStrip = exports.metaAdd = void 0;
const lodash_1 = __importDefault(require("lodash"));
const DELIMITER = '\n------------------------------\n';
/**
 * Add meta to OGXT text
 * @param {string} text
 * @param {object} specials
 * @returns {string}
 */
function metaAdd(text, specials) {
    return text + DELIMITER + JSON.stringify(specials);
}
exports.metaAdd = metaAdd;
/**
 * Strip meta from OGXT text
 * @param {string} text
 * @returns {string}
 */
function metaStrip(text) {
    let res = lodash_1.default.split(text, DELIMITER);
    if (lodash_1.default.size(res) > 1) {
        res = lodash_1.default.slice(res, 0, lodash_1.default.size(res) - 1);
    }
    return lodash_1.default.join(res, DELIMITER);
}
exports.metaStrip = metaStrip;
