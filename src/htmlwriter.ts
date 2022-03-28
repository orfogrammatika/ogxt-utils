import _ from 'lodash';

/**
 * Makes a name/object map out of an array with names.
 *
 * @param items Items to make map out of.
 * @param delim Optional delimiter to split string by.
 * @param map Optional map to add items to.
 * @return Name/value map of items.
 */
function makeMap(
	items: string | string[],
	delim?: string,
	map?: Dict<any>
): Dict<any> {
	let i: number;

	let aitems: string[] = [];

	items = items || [];
	delim = delim || ',';

	if (typeof items === 'string') {
		aitems = items.split(delim);
	} else {
		aitems = items;
	}

	map = map || {};

	i = aitems.length;
	while (i--) {
		map[aitems[i]] = {};
	}

	return map;
}

const attrsCharsRegExp =
	/[&<>"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const textCharsRegExp =
	/[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

export interface Dict<T> {
	[key: string]: T;
}

// Raw entities
const baseEntities: Dict<string> = {
	'"': '&quot;', // Needs to be escaped since the YUI compressor would otherwise break the code
	"'": '&#39;',
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'\u0060': '&#96;',
};

/**
 * Encodes the specified string using raw entities. This means only the required XML base entities will be encoded.
 *
 * @param text Text to encode.
 * @param attr Optional flag to specify if the text is attribute contents.
 * @return Entity encoded text.
 */
function encode(text: string, attr?: boolean): string {
	return text.replace(
		attr ? attrsCharsRegExp : textCharsRegExp,
		function (chr) {
			return baseEntities[chr] ?? chr;
		}
	);
}

/**
 * Constructs a new Writer instance.
 *
 * @param {Object} settings Name/value settings object.
 */
export function Writer(settings?: any) {
	settings = settings ?? {};

	const html: string[] = [];
	const indent: string = settings.indent;
	const indentBefore = makeMap(settings.indent_before || '');
	const indentAfter = makeMap(settings.indent_after || '');
	const htmlOutput = settings.element_format === 'html';

	return {
		/**
		 * Writes the a start element such as <p id="a">.
		 *
		 * @method start
		 * @param name Name of the element.
		 * @param attrs Optional attribute array or undefined if it hasn't any.
		 * @param empty Optional empty state if the tag should end like <br />.
		 */
		start: function (
			name: string,
			attrs?: Dict<string>,
			empty?: boolean
		): void {
			let value: string;

			if (indent && indentBefore[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n') {
					html.push('\n');
				}
			}

			html.push('<', name);

			if (attrs) {
				_.each(attrs, (value, name) => {
					html.push(` ${name}="${encode(value, true)}"`);
				});
			}

			if (!empty || htmlOutput) {
				html[html.length] = '>';
			} else {
				html[html.length] = ' />';
			}

			if (empty && indent && indentAfter[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n') {
					html.push('\n');
				}
			}
		},

		/**
		 * Writes the a end element such as </p>.
		 *
		 * @method end
		 * @param name Name of the element.
		 */
		end: function (name: string): void {
			let value;

			html.push('</', name, '>');

			if (indent && indentAfter[name] && html.length > 0) {
				value = html[html.length - 1];

				if (value.length > 0 && value !== '\n') {
					html.push('\n');
				}
			}
		},

		/**
		 * Writes a text node.
		 *
		 * @method text
		 * @param text String to write out.
		 * @param raw Optional raw state if true the contents wont get encoded.
		 */
		text: function (text: string, raw?: boolean): void {
			if (text.length > 0) {
				html[html.length] = raw ? text : encode(text);
			}
		},

		/**
		 * Writes a cdata node such as <![CDATA[data]]>.
		 *
		 * @method cdata
		 * @param text String to write out inside the cdata.
		 */
		cdata: function (text: string): void {
			html.push('<![CDATA[', text, ']]>');
		},

		/**
		 * Writes a comment node such as <!-- Comment -->.
		 *
		 * @method cdata
		 * @param text String to write out inside the comment.
		 */
		comment: function (text: string): void {
			html.push('<!--', text, '-->');
		},

		/**
		 * Writes a PI node such as <?xml attr="value" ?>.
		 *
		 * @param name Name of the pi.
		 * @param text String to write out inside the pi.
		 */
		pi: function (name: string, text: string) {
			if (text) {
				html.push('<?', name, ' ', encode(text), '?>');
			} else {
				html.push('<?', name, '?>');
			}

			if (indent) {
				html.push('\n');
			}
		},

		/**
		 * Writes a doctype node such as <!DOCTYPE data>.
		 *
		 * @method doctype
		 * @param text String to write out inside the doctype.
		 */
		doctype: function (text: string): void {
			html.push('<!DOCTYPE', text, '>', indent ? '\n' : '');
		},

		/**
		 * Resets the internal buffer if one wants to reuse the writer.
		 *
		 * @method reset
		 */
		reset: function (): void {
			html.length = 0;
		},

		/**
		 * Returns the contents that got serialized.
		 *
		 * @method getContent
		 * @return HTML contents that got written down.
		 */
		getContent: function (): string {
			return html.join('').replace(/\n$/, '');
		},
	};
}
