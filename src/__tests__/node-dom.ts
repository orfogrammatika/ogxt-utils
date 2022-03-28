import { JSDOM } from 'jsdom';

export const dom = new JSDOM(
	'<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>'
);
