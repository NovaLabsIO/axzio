import type { ConfigOption } from './types';

export const ARCHETYPES = [
	{
		value: 'Architect',
		label: 'Architect',
		description: 'Designs systems, structure, and long-range direction.'
	},
	{
		value: 'Explorer',
		label: 'Explorer',
		description: 'Seeks possibility, discovery, and movement into the unknown.'
	},
	{
		value: 'Builder',
		label: 'Builder',
		description: 'Turns vision into form through steady creation.'
	},
	{
		value: 'Alchemist',
		label: 'Alchemist',
		description: 'Transforms tension, insight, and experience into growth.'
	},
	{
		value: 'Catalyst',
		label: 'Catalyst',
		description: 'Activates change, momentum, and human response.'
	},
	{
		value: 'Guardian',
		label: 'Guardian',
		description: 'Protects stability, care, and what matters most.'
	}
] as const satisfies readonly ConfigOption<string>[];

export type Archetype = (typeof ARCHETYPES)[number]['value'];
