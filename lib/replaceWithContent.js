"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceWithContent = void 0;
const lodash_1 = __importDefault(require("lodash"));
function replaceWithContent($node, selector) {
    const getNode = () => {
        if (lodash_1.default.isFunction($node)) {
            return $node();
        }
        else if (selector) {
            return $node.querySelector(selector);
        }
        else {
            return null;
        }
    };
    let $n = getNode();
    while ($n) {
        $n.outerHTML = $n.innerHTML;
        $n = getNode();
    }
}
exports.replaceWithContent = replaceWithContent;
