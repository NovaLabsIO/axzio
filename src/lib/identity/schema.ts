import { ARCHETYPES, type Archetype } from '$lib/config/archetypes';
import { GROWTH_VECTORS, type GrowthVector } from '$lib/config/growth-vectors';
import { MODES, type Mode } from '$lib/config/modes';

export type IdentityReading = {
	primaryMode: Mode;
	secondaryMode: Mode;
	archetype: Archetype;
	corePattern: string;
	currentChallenge: string;
	growthVector: GrowthVector;
	suggestedNextAction: string;
};

export const IDENTITY_RESULT_STORAGE_KEY = 'axzio.identity-reading';

const allowedModes = new Set<string>(MODES.map(({ value }) => value));
const allowedArchetypes = new Set<string>(ARCHETYPES.map(({ value }) => value));
const allowedGrowthVectors = new Set<string>(GROWTH_VECTORS.map(({ value }) => value));

export const identityReadingJsonSchema = {
	name: 'axzio_identity_reading',
	description: 'A concise identity reading generated from reflection responses.',
	strict: true,
	schema: {
		type: 'object',
		additionalProperties: false,
		properties: {
			primaryMode: {
				type: 'string',
				description:
					'The dominant AXZIO mode visible in the reflections. Must be one of the allowed enum values.',
				enum: MODES.map(({ value }) => value)
			},
			secondaryMode: {
				type: 'string',
				description:
					'The secondary AXZIO mode that supports or modulates the dominant mode.',
				enum: MODES.map(({ value }) => value)
			},
			archetype: {
				type: 'string',
				description:
					'The single best-fit AXZIO archetype. Choose the most recognizable operational pattern, not the most flattering label.',
				enum: ARCHETYPES.map(({ value }) => value)
			},
			corePattern: {
				type: 'string',
				description:
					'Two concise sentences describing the user\'s underlying behavioral pattern, motivation, and emotional logic.'
			},
			currentChallenge: {
				type: 'string',
				description:
					'One concise sentence naming the user\'s current tension, trade-off, or point of friction.'
			},
			growthVector: {
				type: 'string',
				description:
					'The most constructive AXZIO growth direction for the user right now.',
				enum: GROWTH_VECTORS.map(({ value }) => value)
			},
			suggestedNextAction: {
				type: 'string',
				description:
					'One practical sentence suggesting a small but meaningful action the user can take in the next few days.'
			}
		},
		required: [
			'primaryMode',
			'secondaryMode',
			'archetype',
			'corePattern',
			'currentChallenge',
			'growthVector',
			'suggestedNextAction'
		]
	}
} as const;

function hasText(value: unknown) {
	return typeof value === 'string' && value.trim().length > 0;
}

export function isIdentityReading(value: unknown): value is IdentityReading {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return (
		allowedModes.has(String(candidate.primaryMode)) &&
		allowedModes.has(String(candidate.secondaryMode)) &&
		allowedArchetypes.has(String(candidate.archetype)) &&
		hasText(candidate.corePattern) &&
		hasText(candidate.currentChallenge) &&
		allowedGrowthVectors.has(String(candidate.growthVector)) &&
		hasText(candidate.suggestedNextAction)
	);
}

export function parseIdentityReading(value: unknown): IdentityReading | null {
	if (!isIdentityReading(value)) {
		return null;
	}

	return {
		primaryMode: value.primaryMode,
		secondaryMode: value.secondaryMode,
		archetype: value.archetype,
		corePattern: value.corePattern.trim(),
		currentChallenge: value.currentChallenge.trim(),
		growthVector: value.growthVector,
		suggestedNextAction: value.suggestedNextAction.trim()
	};
}
