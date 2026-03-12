import type { ConfigOption } from './types';

export const GROWTH_VECTORS = [
	{
		value: 'Launch',
		label: 'Launch',
		description: 'Begin, initiate, and move into visible action.'
	},
	{
		value: 'Clarify',
		label: 'Clarify',
		description: 'Refine what matters and reduce internal noise.'
	},
	{
		value: 'Connect',
		label: 'Connect',
		description: 'Deepen trust, relationships, and supportive resonance.'
	},
	{
		value: 'Explore',
		label: 'Explore',
		description: 'Test new ground and follow emerging curiosity.'
	},
	{
		value: 'Stabilize',
		label: 'Stabilize',
		description: 'Create steadiness, rhythm, and sustainable footing.'
	},
	{
		value: 'Transform',
		label: 'Transform',
		description: 'Release old patterns and become something truer.'
	}
] as const satisfies readonly ConfigOption<string>[];

export type GrowthVector = (typeof GROWTH_VECTORS)[number]['value'];
