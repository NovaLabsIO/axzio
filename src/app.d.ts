// See https://svelte.dev/docs/kit/types#app.d.ts
declare module 'node:fs/promises' {
	export function mkdir(
		path: string,
		options?: {
			recursive?: boolean;
		}
	): Promise<void>;
	export function appendFile(
		path: string,
		data: string,
		encoding?: string
	): Promise<void>;
}

declare module 'node:path' {
	const path: {
		join: (...paths: string[]) => string;
	};

	export default path;
}

declare global {
	namespace App {}
	const process: {
		cwd: () => string;
	};
}

export {};
