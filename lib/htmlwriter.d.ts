export interface Dict<T> {
    [key: string]: T;
}
/**
 * Makes a name/object map out of an array with names.
 *
 * @param items Items to make map out of.
 * @param delim Optional delimiter to split string by.
 * @param map Optional map to add items to.
 * @return Name/value map of items.
 */
export declare function makeMap(items: string | string[], delim?: string, map?: Dict<boolean>): Dict<boolean>;
export declare type WriterSettings = {
    indent?: boolean;
    indent_before?: string[];
    indent_after?: string[];
    element_format?: string;
};
export declare type IWriter = {
    start: (name: string, attrs?: Dict<string>, empty?: boolean) => void;
    end: (name: string) => void;
    text: (text: string, raw?: boolean) => void;
    cdata: (text: string) => void;
    comment: (text: string) => void;
    pi: (name: string, text: string) => void;
    doctype: (text: string) => void;
    reset: () => void;
    getContent: () => string;
};
/**
 * Constructs a new Writer instance.
 *
 * @param {Object} settings Name/value settings object.
 */
export declare function Writer(settings?: WriterSettings): IWriter;
