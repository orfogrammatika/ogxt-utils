import { metaAdd, Meta } from './meta';
import { Parser } from 'htmlparser2';
import _ from 'lodash';

export function html2ogxt(html: string, withoutMeta?: boolean): string {
	const result = {
		pos: 0,
		startPos: 0,
		text: '',
		meta: [] as Meta[],
	};
	let nocheck = 0;
	const parser = new Parser({
		onopentag: function (name: string, attrs) {
			function isHidden() {
				return (
					_.findIndex(
						_.keys(attrs),
						a => a.toLowerCase() === 'data-litera5-hidden'
					) > -1
				);
			}

			function isNoCheck() {
				return (
					_.findIndex(
						_.keys(attrs),
						a => a.toLowerCase() === 'data-litera5-nocheck'
					) > -1
				);
			}

			if (nocheck > 0 || isHidden() || isNoCheck()) {
				nocheck += 1;
			} else {
				switch (name) {
					case 'h1':
					case 'h2':
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6':
					case 'ul':
					case 'ol':
						result.startPos = result.pos;
						break;
					case 'br':
						result.text += '\n';
						result.pos += 1;
						break;
				}
			}
		},
		ontext: function (text) {
			if (nocheck == 0) {
				const txt = _.unescape(text).replace(/&nbsp;/g, '\xa0');
				result.text += txt;
				result.pos += txt.length;
			}
		},
		onclosetag: function (name) {
			if (nocheck > 0) {
				nocheck -= 1;
			} else {
				let meta: Meta | null = null;
				switch (name) {
					case 'h1':
					case 'h2':
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6':
						meta = {
							kind: 'header',
						};
						break;
					case 'ul':
					case 'ol':
						meta = {
							kind: 'list',
						};
						break;
				}
				if (meta != null) {
					meta.start = result.startPos;
					meta.end = result.pos;
					result.meta.push(meta);
				}
			}
		},
	});
	parser.write(html);
	parser.end();
	if (!withoutMeta) {
		result.text = metaAdd(result.text, result.meta);
	}
	return result.text;
}
