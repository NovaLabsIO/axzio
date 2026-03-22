import { MODES, type Mode } from '$lib/config/modes';
import type { ConfidenceLevel } from '$lib/modules/contract';
import type { ModesAnswer, ModesDraft, ModesResult, ModeScoreMap } from './types';

const MODE_ORDER = MODES.map(({ value }) => value);

const MODE_SUMMARIES: Record<Mode, string> = {
	People: 'You orient first through relationship, care, and human context.',
	Pleasure: 'You orient first through aliveness, feeling, and what restores vitality.',
	Production: 'You orient first through movement, usefulness, and getting traction.',
	Reflection: 'You orient first through meaning, pattern recognition, and inner clarity.'
};

const MODE_ACTIONS: Record<Mode, string> = {
	People: 'Choose one honest reach-out or relational repair instead of staying self-contained.',
	Pleasure: 'Protect one small window for enjoyment or relief that actually replenishes you.',
	Production: 'Pick one concrete move and finish it cleanly before adding more noise.',
	Reflection: 'Create ten quiet minutes to step back and name what is really driving this period.'
};

function sortModesByScore(scoreMap: ModeScoreMap) {
	return [...MODE_ORDER].sort((left, right) => {
		const difference = scoreMap[right] - scoreMap[left];
		return difference !== 0 ? difference : MODE_ORDER.indexOf(left) - MODE_ORDER.indexOf(right);
	});
}

function getConfidence(dominantGap: number, scoreMap: ModeScoreMap): ConfidenceLevel {
	const values = Object.values(scoreMap);
	const spread = Math.max(...values) - Math.min(...values);

	if (dominantGap >= 2 && spread >= 2) {
		return 'clear';
	}

	if (dominantGap <= 0 || spread <= 1) {
		return 'uncertain';
	}

	return 'mixed';
}

export function createEmptyModeScoreMap(): ModeScoreMap {
	return {
		People: 0,
		Pleasure: 0,
		Production: 0,
		Reflection: 0
	};
}

export function analyzeModesAnswers(answers: ModesAnswer[]) {
	const scoreMap = createEmptyModeScoreMap();

	for (const answer of answers) {
		scoreMap[answer.mode] += 1;
	}

	const sortedModes = sortModesByScore(scoreMap);
	const primaryMode = sortedModes[0];
	const secondaryMode = sortedModes[1];
	const underusedMode = sortedModes[sortedModes.length - 1];
	const dominantGap = scoreMap[primaryMode] - scoreMap[secondaryMode];
	const overusedMode = dominantGap >= 2 ? primaryMode : undefined;

	const result: ModesResult = {
		primaryMode,
		secondaryMode,
		overusedMode,
		underusedMode,
		scoreMap,
		dominantGap,
		completionState: answers.length > 0 ? 'complete' : 'not-started'
	};

	const recommendation = {
		title: `${primaryMode} is leading your current pattern`,
		summary: overusedMode
			? `${MODE_SUMMARIES[primaryMode]} Right now it appears strong enough to shape too much of your operating pattern, while ${underusedMode.toLowerCase()} is receiving the least support.`
			: `${MODE_SUMMARIES[primaryMode]} ${secondaryMode} is close behind, which suggests a more blended operating style than a single hard dominant pattern.`,
		suggestedAction: MODE_ACTIONS[underusedMode],
		rationale: overusedMode
			? `${primaryMode} is clearly ahead of the other modes, while ${underusedMode} is lowest in the current score map.`
			: `${primaryMode} and ${secondaryMode} are both active, but ${underusedMode} is the least represented mode in the current score map.`,
		confidence: getConfidence(dominantGap, scoreMap)
	};

	return {
		scoreMap,
		result,
		recommendation
	};
}

export function hydrateModesDraftResult(draft: ModesDraft): ModesDraft {
	if (draft.answers.length === 0) {
		return {
			...draft,
			currentState: createEmptyModeScoreMap(),
			targetState: createEmptyModeScoreMap(),
			result: undefined,
			recommendation: undefined
		};
	}

	const analysis = analyzeModesAnswers(draft.answers);

	return {
		...draft,
		currentState: analysis.scoreMap,
		targetState: analysis.scoreMap,
		lockedSelection: {
			primary: analysis.result.primaryMode,
			secondary: analysis.result.secondaryMode,
			lockedAt: draft.updatedAt
		},
		result: analysis.result,
		recommendation: analysis.recommendation
	};
}
