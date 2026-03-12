import type { ConfigOption } from './types';

export const MODES = [
	{
		value: 'People',
		label: 'People',
		description: 'Connection, care, and relational energy.'
	},
	{
		value: 'Pleasure',
		label: 'Pleasure',
		description: 'Joy, sensation, and what feels deeply alive.'
	},
	{
		value: 'Production',
		label: 'Production',
		description: 'Building, output, and meaningful forward motion.'
	},
	{
		value: 'Reflection',
		label: 'Reflection',
		description: 'Insight, introspection, and inner clarity.'
	}
] as const satisfies readonly ConfigOption<string>[];

export type Mode = (typeof MODES)[number]['value'];
