import { createPeriodKey, isEntrySource } from '$lib/modules/contract';
import { MODES_QUESTIONS } from './questions';
import { createEmptyModeScoreMap, hydrateModesDraftResult } from './analyze';
import {
	MODULE_ID,
	MODES_VIEW_STATES,
	MODES_TIMEFRAME,
	type ModesAnswer,
	type ModesDraft,
	type ModesViewState
} from './types';
import { MODES, type Mode } from '$lib/config/modes';

export const MODES_DRAFT_STORAGE_KEY = 'axzio.modes-draft';

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object';
}

function isMode(value: unknown): value is Mode {
	return typeof value === 'string' && MODES.some(({ value: mode }) => mode === value);
}

function isViewState(value: unknown): value is ModesViewState {
	return typeof value === 'string' && MODES_VIEW_STATES.includes(value as ModesViewState);
}

function parseAnswers(value: unknown): ModesAnswer[] | null {
	if (!Array.isArray(value)) {
		return null;
	}

	const validQuestionIds = new Set(MODES_QUESTIONS.map((question) => question.id));

	const answers: ModesAnswer[] = [];

	for (const item of value) {
		if (!isRecord(item)) {
			return null;
		}

		if (
			typeof item.questionId !== 'string' ||
			typeof item.optionId !== 'string' ||
			!isMode(item.mode) ||
			!validQuestionIds.has(item.questionId)
		) {
			return null;
		}

		answers.push({
			questionId: item.questionId,
			optionId: item.optionId,
			mode: item.mode
		});
	}

	return answers;
}

export function createDefaultModesDraft(): ModesDraft {
	const now = new Date().toISOString();
	const emptyScores = createEmptyModeScoreMap();

	return {
		moduleId: MODULE_ID,
		timeframe: MODES_TIMEFRAME,
		periodKey: createPeriodKey(MODES_TIMEFRAME),
		currentState: emptyScores,
		targetState: emptyScores,
		viewState: 'intro',
		currentQuestionIndex: 0,
		answers: [],
		entrySource: 'manual',
		createdAt: now,
		updatedAt: now
	};
}

export function synchronizeModesDraft(draft: ModesDraft): ModesDraft {
	return hydrateModesDraftResult({
		...draft,
		moduleId: MODULE_ID,
		timeframe: MODES_TIMEFRAME,
		periodKey: draft.periodKey || createPeriodKey(MODES_TIMEFRAME),
		entrySource: isEntrySource(draft.entrySource) ? draft.entrySource : 'manual'
	});
}

export function saveModesDraft(draft: ModesDraft) {
	localStorage.setItem(MODES_DRAFT_STORAGE_KEY, JSON.stringify(synchronizeModesDraft(draft)));
}

export function loadModesDraft(): ModesDraft | null {
	const savedValue = localStorage.getItem(MODES_DRAFT_STORAGE_KEY);

	if (!savedValue) {
		return null;
	}

	try {
		const parsed = JSON.parse(savedValue) as Record<string, unknown>;
		const answers = parseAnswers(parsed.answers);

		if (!answers || !isViewState(parsed.viewState)) {
			return null;
		}

		return synchronizeModesDraft({
			moduleId: MODULE_ID,
			timeframe: MODES_TIMEFRAME,
			periodKey:
				typeof parsed.periodKey === 'string' && parsed.periodKey.length > 0
					? parsed.periodKey
					: createPeriodKey(MODES_TIMEFRAME),
			currentState: createEmptyModeScoreMap(),
			targetState: createEmptyModeScoreMap(),
			viewState: parsed.viewState,
			currentQuestionIndex:
				typeof parsed.currentQuestionIndex === 'number'
					? Math.max(0, Math.min(MODES_QUESTIONS.length - 1, Math.round(parsed.currentQuestionIndex)))
					: Math.min(answers.length, MODES_QUESTIONS.length - 1),
			answers,
			entrySource: isEntrySource(parsed.entrySource) ? parsed.entrySource : 'manual',
			createdAt:
				typeof parsed.createdAt === 'string' && parsed.createdAt.length > 0
					? parsed.createdAt
					: new Date().toISOString(),
			updatedAt:
				typeof parsed.updatedAt === 'string' && parsed.updatedAt.length > 0
					? parsed.updatedAt
					: new Date().toISOString()
		});
	} catch {
		return null;
	}
}
