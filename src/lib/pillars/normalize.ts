import { PILLARS, type PillarValues, type TargetMode } from './types';

export const RAW_MIN = 0;
export const RAW_MAX = 100;
export const SCORE_MIN = 1;
export const SCORE_MAX = 10;

export function createPillarValues(value: number): PillarValues {
	return {
		body: value,
		mind: value,
		heart: value,
		spirit: value
	};
}

export function clampRaw(value: number) {
	return Math.min(RAW_MAX, Math.max(RAW_MIN, Math.round(value)));
}

export function clampScore(value: number) {
	return Math.min(SCORE_MAX, Math.max(SCORE_MIN, Math.round(value)));
}

export function rawToScore(raw: number) {
	const clamped = clampRaw(raw);
	const scaled = SCORE_MIN + (clamped / RAW_MAX) * (SCORE_MAX - SCORE_MIN);
	return clampScore(scaled);
}

export function scoreToRaw(score: number) {
	const clamped = clampScore(score);
	const scaled = ((clamped - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * RAW_MAX;
	return clampRaw(scaled);
}

export function normalizeRawValues(values: PillarValues): PillarValues {
	return {
		body: rawToScore(values.body),
		mind: rawToScore(values.mind),
		heart: rawToScore(values.heart),
		spirit: rawToScore(values.spirit)
	};
}

export function denormalizeScores(values: PillarValues): PillarValues {
	return {
		body: scoreToRaw(values.body),
		mind: scoreToRaw(values.mind),
		heart: scoreToRaw(values.heart),
		spirit: scoreToRaw(values.spirit)
	};
}

function getAverage(values: PillarValues) {
	const total = PILLARS.reduce((sum, pillar) => sum + values[pillar], 0);
	return total / PILLARS.length;
}

export function getTargetScoresForMode(current: PillarValues, mode: TargetMode): PillarValues {
	if (mode === 'maintain') {
		return { ...current };
	}

	if (mode === 'restore') {
		const center = clampScore(Math.max(6, Math.round(getAverage(current))));

		return {
			body: clampScore((current.body + center) / 2),
			mind: clampScore((current.mind + center) / 2),
			heart: clampScore((current.heart + center) / 2),
			spirit: clampScore((current.spirit + center) / 2)
		};
	}

	if (mode === 'growth') {
		const sorted = [...PILLARS].sort((left, right) => current[left] - current[right]);
		const boosts = new Map([
			[sorted[0], 3],
			[sorted[1], 2],
			[sorted[2], 1],
			[sorted[3], 1]
		]);

		return {
			body: clampScore(current.body + (boosts.get('body') ?? 1)),
			mind: clampScore(current.mind + (boosts.get('mind') ?? 1)),
			heart: clampScore(current.heart + (boosts.get('heart') ?? 1)),
			spirit: clampScore(current.spirit + (boosts.get('spirit') ?? 1))
		};
	}

	return { ...current };
}
