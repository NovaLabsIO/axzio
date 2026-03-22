import { MODES } from '$lib/config/modes';
import { analyzeModesAnswers } from './analyze';
import type { ModesDraft, ModesSummary } from './types';

function getStatusLabel(draft: ModesDraft) {
	if (!draft.result) {
		return draft.answers.length === 0 ? 'Not Started' : 'In Progress';
	}

	return draft.result.overusedMode ? 'Dominant Pattern' : 'Blended Pattern';
}

function getModeDescription(mode: string) {
	return MODES.find((entry) => entry.value === mode)?.description ?? '';
}

export function buildModesSummary(draft: ModesDraft): ModesSummary {
	const fallbackAnalysis = draft.answers.length > 0 ? analyzeModesAnswers(draft.answers) : null;
	const result = draft.result ?? fallbackAnalysis?.result;
	const recommendation = draft.recommendation ?? fallbackAnalysis?.recommendation;

	return {
		moduleId: draft.moduleId,
		timeframe: draft.timeframe,
		periodKey: draft.periodKey,
		title: 'Modes',
		statusLabel: getStatusLabel(draft),
		primaryValue: result ? result.primaryMode : 'Start assessment',
		secondaryValue: result
			? result.overusedMode
				? `Underused: ${result.underusedMode}`
				: `Secondary: ${result.secondaryMode}`
			: 'No result yet',
		recommendationSummary: recommendation?.summary ?? getModeDescription(result?.primaryMode ?? ''),
		completionState: result ? 'complete' : draft.answers.length > 0 ? 'in-progress' : 'not-started',
		updatedAt: draft.updatedAt,
		primaryMode: result?.primaryMode,
		secondaryMode: result?.secondaryMode
	};
}
