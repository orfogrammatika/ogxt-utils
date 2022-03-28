export interface Dict<T> {
    [key: string]: T;
}
/**
 * Constructs a new Writer instance.
 *
 * @param {Object} settings Name/value settings object.
 */
export declare function Writer(settings?: any): {
    /**
     * Writes the a start element such as <p id="a">.
     *
     * @method start
     * @param name Name of the element.
     * @param attrs Optional attribute array or undefined if it hasn't any.
     * @param empty Optional empty state if the tag should end like <br />.
     */
    start: (name: string, attrs?: Dict<string> | undefined, empty?: boolean | undefined) => void;
    /**
     * Writes the a end element such as </p>.
     *
     * @method end
     * @param name Name of the element.
     */
    end: (name: string) => void;
    /**
     * Writes a text node.
     *
     * @method text
     * @param text String to write out.
     * @param raw Optional raw state if true the contents wont get encoded.
     */
    text: (text: string, raw?: boolean | undefined) => void;
    /**
     * Writes a cdata node such as <![CDATA[data]]>.
     *
     * @method cdata
     * @param text String to write out inside the cdata.
     */
    cdata: (text: string) => void;
    /**
     * Writes a comment node such as <!-- Comment -->.
     *
     * @method cdata
     * @param text String to write out inside the comment.
     */
    comment: (text: string) => void;
    /**
     * Writes a PI node such as <?xml attr="value" ?>.
     *
     * @param name Name of the pi.
     * @param text String to write out inside the pi.
     */
    pi: (name: string, text: string) => void;
    /**
     * Writes a doctype node such as <!DOCTYPE data>.
     *
     * @method doctype
     * @param text String to write out inside the doctype.
     */
    doctype: (text: string) => void;
    /**
     * Resets the internal buffer if one wants to reuse the writer.
     *
     * @method reset
     */
    reset: () => void;
    /**
     * Returns the contents that got serialized.
     *
     * @method getContent
     * @return HTML contents that got written down.
     */
    getContent: () => string;
};
