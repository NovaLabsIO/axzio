export const UNIVERSAL_TIMEFRAMES = ['day', 'week', 'month', 'quarter', 'year'] as const;
export const ENTRY_SOURCES = ['morning', 'evening', 'manual', 'system'] as const;
export const CONFIDENCE_LEVELS = ['clear', 'mixed', 'uncertain'] as const;
export const COMPLETION_STATES = ['not-started', 'in-progress', 'complete'] as const;

export type Timeframe = (typeof UNIVERSAL_TIMEFRAMES)[number];
export type EntrySource = (typeof ENTRY_SOURCES)[number];
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
export type CompletionState = (typeof COMPLETION_STATES)[number];

export type RecommendationPayload = {
	title: string;
	summary: string;
	suggestedAction?: string;
	rationale?: string;
	confidence?: ConfidenceLevel;
};

export type LockedSelection = {
	primary?: string;
	secondary?: string;
	lockedAt?: string;
};

export type UniversalModuleEntry<TState = Record<string, number>> = {
	moduleId: string;
	timeframe: Timeframe;
	periodKey: string;
	currentState: TState;
	targetState: TState;
	lockedSelection?: LockedSelection;
	recommendation?: RecommendationPayload;
	entrySource: EntrySource;
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export type UniversalModuleSummary = {
	moduleId: string;
	timeframe: Timeframe;
	periodKey: string;
	title: string;
	statusLabel?: string;
	primaryValue?: string;
	secondaryValue?: string;
	recommendationSummary?: string;
	completionState?: CompletionState;
	updatedAt: string;
};

export function isTimeframe(value: unknown): value is Timeframe {
	return typeof value === 'string' && UNIVERSAL_TIMEFRAMES.includes(value as Timeframe);
}

export function isEntrySource(value: unknown): value is EntrySource {
	return typeof value === 'string' && ENTRY_SOURCES.includes(value as EntrySource);
}

function pad(value: number) {
	return String(value).padStart(2, '0');
}

function getIsoWeekParts(date: Date) {
	const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const day = copy.getUTCDay() || 7;
	copy.setUTCDate(copy.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((copy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

	return {
		year: copy.getUTCFullYear(),
		week
	};
}

export function createPeriodKey(timeframe: Timeframe, date = new Date()) {
	if (timeframe === 'day') {
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	if (timeframe === 'week') {
		const weekParts = getIsoWeekParts(date);
		return `${weekParts.year}-W${pad(weekParts.week)}`;
	}

	if (timeframe === 'month') {
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
	}

	if (timeframe === 'quarter') {
		return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
	}

	return String(date.getFullYear());
}
