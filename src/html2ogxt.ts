import { metaAdd, Meta } from './meta';
import * as _ from 'lodash';
import { isTagHidden, isTagNoCheck } from './utils';
import { HtmlParser } from './HtmlParser';

export function html2ogxt(html: string, withoutMeta?: boolean): string {
	const result = {
		pos: 0,
		startPos: 0,
		text: [] as string[],
		meta: [] as Meta[],
	};
	let nocheck = 0;
	const parser = new HtmlParser({
		onopentag: function (name: string, attrs) {
			function isHidden() {
				return isTagHidden(attrs);
			}

			function isNoCheck() {
				return isTagNoCheck(attrs);
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
						result.text.push('\n');
						result.pos += 1;
						break;
				}
			}
		},
		ontext: function (text) {
			if (nocheck == 0) {
				const txt = _.unescape(text).replace(/&nbsp;/g, '\xa0');
				result.text.push(txt);
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
	parser.parseComplete(html);
	let res = result.text.join('');
	if (!withoutMeta) {
		res = metaAdd(res, result.meta);
	}
	return res;
}
