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
exports.metaStrip = exports.metaAdd = void 0;
const _ = __importStar(require("lodash"));
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
    let res = _.split(text, DELIMITER);
    if (_.size(res) > 1) {
        res = _.slice(res, 0, _.size(res) - 1);
    }
    return _.join(res, DELIMITER);
}
exports.metaStrip = metaStrip;
