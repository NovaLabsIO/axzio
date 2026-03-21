import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	isPillarsFeedbackSentiment,
	type PillarsFeedbackSubmission
} from '$lib/pillars/feedback';
import { PILLARS, TARGET_MODES, TIMEFRAMES, type PillarValues } from '$lib/pillars/types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {
	appendPillarsFeedbackRecord,
	PillarsFeedbackStoreError
} from '$lib/server/pillars-feedback-store';

type LoggedError = {
	stage?: string;
	code?: string;
	message?: string;
};

function isTimeframe(value: unknown): value is PillarsFeedbackSubmission['timeframe'] {
	return typeof value === 'string' && TIMEFRAMES.includes(value as PillarsFeedbackSubmission['timeframe']);
}

function isTargetMode(value: unknown): value is PillarsFeedbackSubmission['targetMode'] {
	return typeof value === 'string' && TARGET_MODES.includes(value as PillarsFeedbackSubmission['targetMode']);
}

function isPillarValues(value: unknown): value is PillarValues {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return PILLARS.every((pillar) => {
		const entry = candidate[pillar];
		return typeof entry === 'number' && Number.isFinite(entry);
	});
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parsePillarsFeedbackPayload(body: unknown): PillarsFeedbackSubmission | null {
	if (!body || typeof body !== 'object') {
		return null;
	}

	const candidate = body as Record<string, unknown>;
	const notes = typeof candidate.notes === 'string' ? candidate.notes.trim() : '';
	const email = typeof candidate.email === 'string' ? candidate.email.trim().toLowerCase() : '';

	if (!isPillarsFeedbackSentiment(candidate.sentiment)) {
		return null;
	}

	if (!isTimeframe(candidate.timeframe) || !isTargetMode(candidate.targetMode)) {
		return null;
	}

	if (!isPillarValues(candidate.currentScore) || !isPillarValues(candidate.targetScore)) {
		return null;
	}

	if (email && !isValidEmail(email)) {
		return null;
	}

	return {
		sentiment: candidate.sentiment,
		notes,
		email,
		timeframe: candidate.timeframe,
		targetMode: candidate.targetMode,
		currentScore: candidate.currentScore,
		targetScore: candidate.targetScore
	};
}

function maskEmail(email: string) {
	if (!email) {
		return '';
	}

	const [localPart = '', domain = ''] = email.split('@');
	const localPreview = localPart.length <= 2 ? `${localPart.slice(0, 1)}*` : `${localPart.slice(0, 2)}***`;
	const domainParts = domain.split('.');
	const domainName = domainParts[0] ?? '';
	const domainTld = domainParts.slice(1).join('.');
	const domainPreview =
		domainName.length <= 1 ? '*' : `${domainName.slice(0, 1)}***${domainTld ? `.${domainTld}` : ''}`;

	return `${localPreview}@${domainPreview}`;
}

function logPillarsFeedbackRoute(stage: string, details: Record<string, unknown>) {
	const parts = Object.entries(details)
		.filter(([, value]) => value !== undefined && value !== '')
		.map(([key, value]) => `${key}=${String(value)}`);

	console.info(`[pillars_feedback] ${stage}${parts.length > 0 ? ` ${parts.join(' ')}` : ''}`);
}

function getLoggedError(error: unknown) {
	const candidate = error as LoggedError | null;

	return {
		stage: candidate?.stage ?? 'unknown',
		code: candidate?.code ?? 'unknown',
		message: (candidate?.message ?? 'Unknown error').replace(/\s+/g, ' ').trim().slice(0, 240)
	};
}

function isPreviewDeployment() {
	return privateEnv.VERCEL_ENV === 'preview';
}

export const POST: RequestHandler = async ({ request }) => {
	logPillarsFeedbackRoute('env_presence_check', {
		hasPublicSupabaseUrl: Boolean(publicEnv.PUBLIC_SUPABASE_URL),
		hasSupabaseServiceRoleKey: Boolean(privateEnv.SUPABASE_SERVICE_ROLE_KEY)
	});

	let requestBody: unknown;

	try {
		requestBody = await request.json();
	} catch {
		return json({ error: 'Request body must be valid JSON.' }, { status: 400 });
	}

	const payload = parsePillarsFeedbackPayload(requestBody);

	if (!payload) {
		return json({ error: 'Invalid pillars feedback payload.' }, { status: 400 });
	}

	logPillarsFeedbackRoute('request_received', {
		timeframe: payload.timeframe,
		targetMode: payload.targetMode,
		sentiment: payload.sentiment,
		emailPreview: maskEmail(payload.email),
		hasNotes: payload.notes.length > 0
	});

	try {
		await appendPillarsFeedbackRecord({
			...payload,
			userAgent: request.headers.get('user-agent') ?? ''
		});
	} catch (error) {
		const loggedError = getLoggedError(error);

		logPillarsFeedbackRoute('insert_failed', {
			stage: loggedError.stage,
			code: loggedError.code,
			message: loggedError.message
		});

		if (isPreviewDeployment()) {
			return json(
				{
					error: 'Unable to store pillars feedback.',
					debug: {
						stage: loggedError.stage,
						code: loggedError.code,
						message: loggedError.message
					}
				},
				{ status: 500 }
			);
		}

		return json({ error: 'Unable to store pillars feedback.' }, { status: 500 });
	}

	logPillarsFeedbackRoute('insert_succeeded', {
		timeframe: payload.timeframe,
		targetMode: payload.targetMode
	});

	return json({ ok: true });
};
