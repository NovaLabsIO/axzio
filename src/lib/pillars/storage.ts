import {
	PILLARS,
	TIMEFRAMES,
	TARGET_MODES,
	type PillarsDraft,
	type PillarValues,
	type TargetMode,
	type Timeframe
} from './types';
import {
	clampRaw,
	createPillarValues,
	denormalizeScores,
	getTargetScoresForMode,
	normalizeRawValues
} from './normalize';

export const PILLARS_DRAFT_STORAGE_KEY = 'axzio.pillars-draft';

function getPillarsDraftStorageKey(timeframe: Timeframe) {
	return `${PILLARS_DRAFT_STORAGE_KEY}.${timeframe}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object';
}

function parsePillarValues(value: unknown): PillarValues | null {
	if (!isRecord(value)) {
		return null;
	}

	const next = createPillarValues(50);

	for (const pillar of PILLARS) {
		const entry = value[pillar];

		if (typeof entry !== 'number' || Number.isNaN(entry)) {
			return null;
		}

		next[pillar] = clampRaw(entry);
	}

	return next;
}

function isTimeframe(value: unknown): value is Timeframe {
	return typeof value === 'string' && TIMEFRAMES.includes(value as Timeframe);
}

function isTargetMode(value: unknown): value is TargetMode {
	return typeof value === 'string' && TARGET_MODES.includes(value as TargetMode);
}

export function createDefaultPillarsDraft(timeframe: Timeframe = 'today'): PillarsDraft {
	const currentRaw = createPillarValues(50);
	const currentScore = normalizeRawValues(currentRaw);
	const targetMode: TargetMode = 'restore';
	const targetScore = getTargetScoresForMode(currentScore, targetMode);
	const targetRaw = denormalizeScores(targetScore);

	return {
		timeframe,
		targetMode,
		currentRaw,
		targetRaw,
		currentScore,
		targetScore,
		updatedAt: new Date().toISOString()
	};
}

export function savePillarsDraft(draft: PillarsDraft) {
	localStorage.setItem(getPillarsDraftStorageKey(draft.timeframe), JSON.stringify(draft));
}

export function loadPillarsDraft(timeframe: Timeframe): PillarsDraft | null {
	const savedValue = localStorage.getItem(getPillarsDraftStorageKey(timeframe));

	if (!savedValue) {
		return null;
	}

	try {
		const parsed = JSON.parse(savedValue) as Record<string, unknown>;

		if (!isTimeframe(parsed.timeframe) || !isTargetMode(parsed.targetMode)) {
			return null;
		}

		const currentRaw = parsePillarValues(parsed.currentRaw);
		const parsedTargetRaw = parsePillarValues(parsed.targetRaw);

		if (!currentRaw || !parsedTargetRaw) {
			return null;
		}

		const currentScore = normalizeRawValues(currentRaw);
		const targetScore =
			parsed.targetMode === 'custom'
				? normalizeRawValues(parsedTargetRaw)
				: getTargetScoresForMode(currentScore, parsed.targetMode);
		const targetRaw =
			parsed.targetMode === 'custom' ? parsedTargetRaw : denormalizeScores(targetScore);

		return {
			timeframe,
			targetMode: parsed.targetMode,
			currentRaw,
			targetRaw,
			currentScore,
			targetScore,
			updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString()
		};
	} catch {
		return null;
	}
}
