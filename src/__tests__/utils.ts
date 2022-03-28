import fs from 'fs';

export function requireText(name: string, require: NodeRequire): string {
	return fs.readFileSync(require.resolve(name)).toString();
}
