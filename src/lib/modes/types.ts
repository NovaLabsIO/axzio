import type {
	CompletionState,
	RecommendationPayload,
	Timeframe,
	UniversalModuleEntry,
	UniversalModuleSummary
} from '$lib/modules/contract';
import type { Mode } from '$lib/config/modes';

export const MODULE_ID = 'modes' as const;
export const MODES_TIMEFRAME: Timeframe = 'day';
export const MODES_VIEW_STATES = ['intro', 'assessment', 'result'] as const;

export type ModesViewState = (typeof MODES_VIEW_STATES)[number];
export type ModeScoreMap = Record<Mode, number>;

export type ModesAnswer = {
	questionId: string;
	optionId: string;
	mode: Mode;
};

export type ModesQuestionOption = {
	id: string;
	mode: Mode;
	label: string;
	description: string;
};

export type ModesQuestion = {
	id: string;
	prompt: string;
	options: readonly ModesQuestionOption[];
};

export type ModesResult = {
	primaryMode: Mode;
	secondaryMode: Mode;
	overusedMode?: Mode;
	underusedMode: Mode;
	scoreMap: ModeScoreMap;
	dominantGap: number;
	completionState: CompletionState;
};

export type ModesDraft = UniversalModuleEntry<ModeScoreMap> & {
	moduleId: typeof MODULE_ID;
	viewState: ModesViewState;
	currentQuestionIndex: number;
	answers: ModesAnswer[];
	result?: ModesResult;
	recommendation?: RecommendationPayload;
};

export type ModesSummary = UniversalModuleSummary & {
	moduleId: typeof MODULE_ID;
	primaryMode?: Mode;
	secondaryMode?: Mode;
};
