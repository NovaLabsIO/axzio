import { PILLARS, PILLAR_LABELS, TIMEFRAME_LABELS, type Pillar, type PillarsDraft } from './types';

export type PillarsGuidance = {
	summary: string;
	focusPillar: Pillar;
	nextAction: string;
};

function getAverage(values: PillarsDraft['currentScore']) {
	const total = PILLARS.reduce((sum, pillar) => sum + values[pillar], 0);
	return total / PILLARS.length;
}

function getSpread(values: PillarsDraft['currentScore']) {
	const scores = PILLARS.map((pillar) => values[pillar]);
	return Math.max(...scores) - Math.min(...scores);
}

function getFocusPillar(draft: PillarsDraft): Pillar {
	const targetGapSorted = [...PILLARS].sort((left, right) => {
		const rightGap = draft.targetScore[right] - draft.currentScore[right];
		const leftGap = draft.targetScore[left] - draft.currentScore[left];

		return rightGap - leftGap;
	});

	const largestGapPillar = targetGapSorted[0];
	const largestGap = draft.targetScore[largestGapPillar] - draft.currentScore[largestGapPillar];

	if (largestGap > 0) {
		return largestGapPillar;
	}

	return [...PILLARS].sort((left, right) => draft.currentScore[left] - draft.currentScore[right])[0];
}

function getSummary(draft: PillarsDraft, focusPillar: Pillar) {
	const average = getAverage(draft.currentScore);
	const spread = getSpread(draft.currentScore);
	const focusLabel = PILLAR_LABELS[focusPillar];
	const timeframeLabel = TIMEFRAME_LABELS[draft.timeframe].toLowerCase();
	const strongestPillar = [...PILLARS].sort(
		(left, right) => draft.currentScore[right] - draft.currentScore[left]
	)[0];

	if (average <= 4.5) {
		return `For ${timeframeLabel}, your overall baseline looks depleted. ${focusLabel} needs the fastest support before you try to push everything else higher.`;
	}

	if (spread >= 4) {
		return `For ${timeframeLabel}, your balance looks uneven. ${PILLAR_LABELS[strongestPillar]} is carrying more of the load, while ${focusLabel} is the clearest gap to close next.`;
	}

	if (draft.targetMode === 'maintain') {
		return `For ${timeframeLabel}, your current and target balance are already close. The goal is to protect consistency and keep ${focusLabel} from slipping.`;
	}

	return `For ${timeframeLabel}, your balance is workable but not fully aligned. ${focusLabel} is the most useful place to focus if you want your current state to move closer to your target.`;
}

function getNextAction(draft: PillarsDraft, focusPillar: Pillar) {
	const modeTag =
		draft.targetMode === 'restore'
			? 'Aim to reduce extremes rather than improve everything at once.'
			: draft.targetMode === 'maintain'
				? 'Keep the stable parts steady while reinforcing the weakest one.'
				: draft.targetMode === 'growth'
					? 'Choose a stretch that raises this pillar without draining the others.'
					: 'Use your target as a practical boundary for what enough looks like.';

	const actions: Record<Pillar, string> = {
		body: 'Protect one block for movement, food, rest, or physical recovery before adding more demands.',
		mind: 'Reduce input for one block and choose one concrete priority to finish cleanly.',
		heart: 'Make one honest emotional check-in or supportive reach-out instead of carrying the tension silently.',
		spirit: 'Take ten quiet minutes to reconnect with meaning, direction, or why this period matters.'
	};

	return `${actions[focusPillar]} ${modeTag}`;
}

export function buildPillarsGuidance(draft: PillarsDraft): PillarsGuidance {
	const focusPillar = getFocusPillar(draft);

	return {
		summary: getSummary(draft, focusPillar),
		focusPillar,
		nextAction: getNextAction(draft, focusPillar)
	};
}
