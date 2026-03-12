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
				enum: MODES.map(({ value }) => value)
			},
			secondaryMode: {
				type: 'string',
				enum: MODES.map(({ value }) => value)
			},
			archetype: {
				type: 'string',
				enum: ARCHETYPES.map(({ value }) => value)
			},
			corePattern: {
				type: 'string'
			},
			currentChallenge: {
				type: 'string'
			},
			growthVector: {
				type: 'string',
				enum: GROWTH_VECTORS.map(({ value }) => value)
			},
			suggestedNextAction: {
				type: 'string'
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
