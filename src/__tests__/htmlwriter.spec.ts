import { IWriter, makeMap, Writer, WriterSettings } from '../htmlwriter';

function mkTest(
	exp: string,
	generator: (w: IWriter) => void,
	settings?: WriterSettings
) {
	return () => {
		const w = Writer(settings);
		generator(w);
		const test = w.getContent();
		expect(test).toEqual(exp);
	};
}

describe('Writer', () => {
	describe('reset', () => {
		it(
			'resets',
			mkTest('', w => {
				w.doctype('html');
				w.start('some');
				w.end('some');
				w.reset();
			})
		);
	});
	describe('no-indent', () => {
		describe('start', () => {
			it(
				'empty without attrs',
				mkTest('<span /><span />', w => {
					w.start('span', {}, true);
					w.start('span', {}, true);
				})
			);
			it(
				'empty with attrs',
				mkTest(
					'<span class="Clazz" id="some-id" /><span class="Clazz" id="other-id" />',
					w => {
						w.start(
							'span',
							{ class: 'Clazz', id: 'some-id' },
							true
						);
						w.start(
							'span',
							{ class: 'Clazz', id: 'other-id' },
							true
						);
					}
				)
			);
			it(
				'non-empty without attrs',
				mkTest('<span /><span>', w => {
					w.start('span', {}, true);
					w.start('span');
				})
			);
			it(
				'non-empty with attrs',
				mkTest('<span /><span class="Clazz" id="some-id">', w => {
					w.start('span', {}, true);
					w.start('span', { class: 'Clazz', id: 'some-id' });
				})
			);
		});
		describe('end', () => {
			it(
				'simple',
				mkTest('</span></span>', w => {
					w.end('span');
					w.end('span');
				})
			);
		});
		describe('text', () => {
			it(
				'some text',
				mkTest('<div>some &gt; text</div>', w => {
					w.start('div');
					w.text('some > text');
					w.end('div');
				})
			);
			it(
				'raw',
				mkTest('<div><span/></div>', w => {
					w.start('div');
					w.text('<span/>', true);
					w.end('div');
				})
			);
		});
		describe('cdata', () => {
			it(
				'first',
				mkTest('<![CDATA[some cdata]]><div>', w => {
					w.cdata('some cdata');
					w.start('div');
				})
			);
			it(
				'last',
				mkTest('</div><![CDATA[some cdata]]>', w => {
					w.end('div');
					w.cdata('some cdata');
				})
			);
		});
		describe('comment', () => {
			it(
				'first',
				mkTest('<!-- some comment --><div>', w => {
					w.comment('some comment');
					w.start('div');
				})
			);
			it(
				'last',
				mkTest('</div><!-- some comment -->', w => {
					w.end('div');
					w.comment('some comment');
				})
			);
		});
		describe('pi', () => {
			it(
				'empty',
				mkTest('<?xml?></div>', w => {
					w.pi('xml', '');
					w.end('div');
				})
			);
			it(
				'first',
				mkTest('<?xml test?></div>', w => {
					w.pi('xml', 'test');
					w.end('div');
				})
			);
			it(
				'last',
				mkTest('</div><?xml test?>', w => {
					w.end('div');
					w.pi('xml', 'test');
				})
			);
		});
		describe('doctype', () => {
			it(
				'first',
				mkTest('<!DOCTYPE html><div>', w => {
					w.doctype('html');
					w.start('div');
				})
			);
			it(
				'last',
				mkTest('</div><!DOCTYPE html>', w => {
					w.end('div');
					w.doctype('html');
				})
			);
		});
	});
	describe('indent', () => {
		const settings = {
			indent: true,
		};
		describe('start', () => {
			it(
				'empty without attrs',
				mkTest(
					'<span /><span />',
					w => {
						w.start('span', {}, true);
						w.start('span', {}, true);
					},
					settings
				)
			);
			it(
				'empty with attrs',
				mkTest(
					'<span class="Clazz" id="some-id" /><span class="Clazz" id="other-id" />',
					w => {
						w.start(
							'span',
							{ class: 'Clazz', id: 'some-id' },
							true
						);
						w.start(
							'span',
							{ class: 'Clazz', id: 'other-id' },
							true
						);
					},
					settings
				)
			);
			it(
				'non-empty without attrs',
				mkTest(
					'<span /><span>',
					w => {
						w.start('span', {}, true);
						w.start('span');
					},
					settings
				)
			);
			it(
				'non-empty with attrs',
				mkTest(
					'<span /><span class="Clazz" id="some-id">',
					w => {
						w.start('span', {}, true);
						w.start('span', { class: 'Clazz', id: 'some-id' });
					},
					settings
				)
			);
		});
		describe('end', () => {
			it(
				'simple',
				mkTest(
					'</span></span>',
					w => {
						w.end('span');
						w.end('span');
					},
					settings
				)
			);
		});
		describe('text', () => {
			it(
				'some text',
				mkTest(
					'<div>some text</div>',
					w => {
						w.start('div');
						w.text('some text');
						w.end('div');
					},
					settings
				)
			);
		});
		describe('cdata', () => {
			it(
				'first',
				mkTest(
					'<![CDATA[some cdata]]><div>',
					w => {
						w.cdata('some cdata');
						w.start('div');
					},
					settings
				)
			);
			it(
				'last',
				mkTest(
					'</div><![CDATA[some cdata]]>',
					w => {
						w.end('div');
						w.cdata('some cdata');
					},
					settings
				)
			);
		});
		describe('comment', () => {
			it(
				'first',
				mkTest(
					'<!-- some comment --><div>',
					w => {
						w.comment('some comment');
						w.start('div');
					},
					settings
				)
			);
			it(
				'last',
				mkTest(
					'</div><!-- some comment -->',
					w => {
						w.end('div');
						w.comment('some comment');
					},
					settings
				)
			);
		});
		describe('pi', () => {
			it(
				'first',
				mkTest(
					'<?xml test?>\n</div>',
					w => {
						w.pi('xml', 'test');
						w.end('div');
					},
					settings
				)
			);
			it(
				'last',
				mkTest(
					'</div><?xml test?>',
					w => {
						w.end('div');
						w.pi('xml', 'test');
					},
					settings
				)
			);
		});
		describe('doctype', () => {
			it(
				'first',
				mkTest(
					'<!DOCTYPE html>\n<div>',
					w => {
						w.doctype('html');
						w.start('div');
					},
					settings
				)
			);
			it(
				'last',
				mkTest(
					'</div><!DOCTYPE html>',
					w => {
						w.end('div');
						w.doctype('html');
					},
					settings
				)
			);
		});
	});
	describe('indent_before', () => {
		const settings = {
			indent: true,
			indent_before: ['span'],
		};
		describe('start', () => {
			it(
				'empty without attrs',
				mkTest(
					'<span />\n<span />',
					w => {
						w.start('span', {}, true);
						w.start('span', {}, true);
					},
					settings
				)
			);
			it(
				'empty with attrs',
				mkTest(
					'<span class="Clazz" id="some-id" />\n<span class="Clazz" id="other-id" />',
					w => {
						w.start(
							'span',
							{ class: 'Clazz', id: 'some-id' },
							true
						);
						w.start(
							'span',
							{ class: 'Clazz', id: 'other-id' },
							true
						);
					},
					settings
				)
			);
			it(
				'non-empty without attrs',
				mkTest(
					'<span />\n<span>',
					w => {
						w.start('span', {}, true);
						w.start('span');
					},
					settings
				)
			);
			it(
				'non-empty with attrs',
				mkTest(
					'<span />\n<span class="Clazz" id="some-id">',
					w => {
						w.start('span', {}, true);
						w.start('span', { class: 'Clazz', id: 'some-id' });
					},
					settings
				)
			);
		});
		describe('end', () => {
			it(
				'simple',
				mkTest(
					'</span></span>',
					w => {
						w.end('span');
						w.end('span');
					},
					settings
				)
			);
		});
	});
	describe('indent_after', () => {
		const settings = {
			indent: true,
			indent_after: ['span'],
		};
		describe('start', () => {
			it(
				'empty without attrs',
				mkTest(
					'<span />\n<span />',
					w => {
						w.start('span', {}, true);
						w.start('span', {}, true);
					},
					settings
				)
			);
			it(
				'empty with attrs',
				mkTest(
					'<span class="Clazz" id="some-id" />\n<span class="Clazz" id="other-id" />',
					w => {
						w.start(
							'span',
							{ class: 'Clazz', id: 'some-id' },
							true
						);
						w.start(
							'span',
							{ class: 'Clazz', id: 'other-id' },
							true
						);
					},
					settings
				)
			);
			it(
				'non-empty without attrs',
				mkTest(
					'<span />\n<span>',
					w => {
						w.start('span', {}, true);
						w.start('span');
					},
					settings
				)
			);
			it(
				'non-empty with attrs',
				mkTest(
					'<span />\n<span class="Clazz" id="some-id">',
					w => {
						w.start('span', {}, true);
						w.start('span', { class: 'Clazz', id: 'some-id' });
					},
					settings
				)
			);
		});
		describe('end', () => {
			it(
				'simple',
				mkTest(
					'</span>\n</span>',
					w => {
						w.end('span');
						w.end('span');
					},
					settings
				)
			);
		});
	});
});

describe('makeMap', () => {
	describe('no-map', () => {
		describe('items string', () => {
			it('default delim', () => {
				const test = makeMap('span,div');
				expect(test).toEqual({ span: true, div: true });
			});
			it('custom delim', () => {
				const test = makeMap('span div', ' ');
				expect(test).toEqual({ span: true, div: true });
			});
		});
		describe('items list', () => {
			it('default delim', () => {
				const test = makeMap(['span', 'div']);
				expect(test).toEqual({ span: true, div: true });
			});
			it('custom delim', () => {
				const test = makeMap(['span', 'div'], ' ');
				expect(test).toEqual({ span: true, div: true });
			});
		});
	});
	describe('with-map', () => {
		describe('items string', () => {
			it('default delim', () => {
				const test = makeMap('span,div', undefined, {
					section: true,
					div: false,
				});
				expect(test).toEqual({ section: true, span: true, div: true });
			});
			it('custom delim', () => {
				const test = makeMap('span div', ' ', {
					section: true,
					div: false,
				});
				expect(test).toEqual({ section: true, span: true, div: true });
			});
		});
		describe('items list', () => {
			it('default delim', () => {
				const test = makeMap(['span', 'div'], undefined, {
					section: true,
					div: false,
				});
				expect(test).toEqual({ section: true, span: true, div: true });
			});
			it('custom delim', () => {
				const test = makeMap(['span', 'div'], ' ', {
					section: true,
					div: false,
				});
				expect(test).toEqual({ section: true, span: true, div: true });
			});
		});
	});
});
