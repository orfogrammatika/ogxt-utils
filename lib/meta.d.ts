export interface Meta {
    kind: string;
    start?: number;
    end?: number;
}
/**
 * Add meta to OGXT text
 * @param {string} text
 * @param {object} specials
 * @returns {string}
 */
export declare function metaAdd(text: string, specials: Meta[]): string;
/**
 * Strip meta from OGXT text
 * @param {string} text
 * @returns {string}
 */
export declare function metaStrip(text: string): string;
