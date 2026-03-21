export const PILLARS_FEEDBACK_STORAGE_KEY = 'axzio.pillars-feedback';

export const PILLARS_FEEDBACK_OPTIONS = [
	'Helpful',
	'Somewhat Helpful',
	'Not Helpful'
] as const;

export type PillarsFeedbackSentiment = (typeof PILLARS_FEEDBACK_OPTIONS)[number];

export type PillarsFeedback = {
	sentiment: PillarsFeedbackSentiment | null;
	notes: string;
	email: string;
	submittedAt: string;
};

export type PillarsFeedbackSubmission = {
	sentiment: PillarsFeedbackSentiment;
	notes: string;
	email: string;
	timeframe: import('./types').Timeframe;
	targetMode: import('./types').TargetMode;
	currentScore: import('./types').PillarValues;
	targetScore: import('./types').PillarValues;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object';
}

export function isPillarsFeedbackSentiment(value: unknown): value is PillarsFeedbackSentiment {
	return typeof value === 'string' && PILLARS_FEEDBACK_OPTIONS.includes(value as PillarsFeedbackSentiment);
}

export function createDefaultPillarsFeedback(): PillarsFeedback {
	return {
		sentiment: null,
		notes: '',
		email: '',
		submittedAt: ''
	};
}

export function loadPillarsFeedback(): PillarsFeedback | null {
	const savedValue = localStorage.getItem(PILLARS_FEEDBACK_STORAGE_KEY);

	if (!savedValue) {
		return null;
	}

	try {
		const parsed = JSON.parse(savedValue);

		if (!isRecord(parsed)) {
			return null;
		}

		return {
			sentiment: isPillarsFeedbackSentiment(parsed.sentiment) ? parsed.sentiment : null,
			notes: typeof parsed.notes === 'string' ? parsed.notes : '',
			email: typeof parsed.email === 'string' ? parsed.email : '',
			submittedAt: typeof parsed.submittedAt === 'string' ? parsed.submittedAt : ''
		};
	} catch {
		return null;
	}
}

export function savePillarsFeedback(feedback: PillarsFeedback) {
	localStorage.setItem(PILLARS_FEEDBACK_STORAGE_KEY, JSON.stringify(feedback));
}

export function hasFeedbackContent(feedback: Pick<PillarsFeedback, 'sentiment' | 'notes' | 'email'>) {
	return Boolean(feedback.sentiment) || feedback.notes.trim().length > 0 || feedback.email.trim().length > 0;
}
