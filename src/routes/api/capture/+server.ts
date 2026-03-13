import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseIdentityReading, type IdentityReading } from '$lib/identity/schema';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {
	CaptureStoreError,
	appendCaptureRecord,
	createResultCaptureSnapshot,
	type FeedbackValue
} from '$lib/server/capture-store';

type EmailCapturePayload = {
	kind: 'email';
	email: string;
	reading: IdentityReading;
};

type FeedbackCapturePayload = {
	kind: 'feedback';
	feedback: FeedbackValue;
	feedbackText: string;
	reading: IdentityReading;
};

type CapturePayload = EmailCapturePayload | FeedbackCapturePayload;

type LoggedError = {
	stage?: string;
	code?: string;
	message?: string;
};

function isFeedbackValue(value: unknown): value is FeedbackValue {
	return value === 'Yes' || value === 'Somewhat' || value === 'No';
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function maskEmail(email: string) {
	const [localPart = '', domain = ''] = email.split('@');
	const localPreview = localPart.length <= 2 ? `${localPart.slice(0, 1)}*` : `${localPart.slice(0, 2)}***`;
	const domainParts = domain.split('.');
	const domainName = domainParts[0] ?? '';
	const domainTld = domainParts.slice(1).join('.');
	const domainPreview =
		domainName.length <= 1 ? '*' : `${domainName.slice(0, 1)}***${domainTld ? `.${domainTld}` : ''}`;

	return `${localPreview}@${domainPreview}`;
}

function logCaptureRoute(stage: string, details: Record<string, unknown>) {
	const parts = Object.entries(details)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${String(value)}`);

	console.info(`[capture] ${stage}${parts.length > 0 ? ` ${parts.join(' ')}` : ''}`);
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

function parseCapturePayload(body: unknown): CapturePayload | null {
	if (!body || typeof body !== 'object') {
		return null;
	}

	const candidate = body as Record<string, unknown>;
	const kind = candidate.kind;

	if (kind !== 'email' && kind !== 'feedback') {
		return null;
	}

	const reading = candidate.reading ? parseIdentityReading(candidate.reading) : null;

	if (!reading) {
		return null;
	}

	if (kind === 'email') {
		const email = typeof candidate.email === 'string' ? candidate.email.trim().toLowerCase() : '';

		if (!email || !isValidEmail(email)) {
			return null;
		}

		return { kind, email, reading };
	}

	if (!isFeedbackValue(candidate.feedback)) {
		return null;
	}

	const feedbackText =
		typeof candidate.feedbackText === 'string' ? candidate.feedbackText.trim() : '';

	return { kind, feedback: candidate.feedback, feedbackText, reading };
}

export const POST: RequestHandler = async ({ request }) => {
	logCaptureRoute('env_presence_check', {
		hasPublicSupabaseUrl: Boolean(publicEnv.PUBLIC_SUPABASE_URL),
		hasSupabaseServiceRoleKey: Boolean(privateEnv.SUPABASE_SERVICE_ROLE_KEY)
	});

	let requestBody: unknown;

	try {
		requestBody = await request.json();
	} catch {
		return json({ error: 'Request body must be valid JSON.' }, { status: 400 });
	}

	const payload = parseCapturePayload(requestBody);

	if (!payload) {
		return json({ error: 'Invalid capture payload.' }, { status: 400 });
	}

	logCaptureRoute('request_received', {
		kind: payload.kind,
		hasReading: Boolean(payload.reading),
		emailPreview: payload.kind === 'email' ? maskEmail(payload.email) : undefined,
		hasFeedbackText:
			payload.kind === 'feedback' ? payload.feedbackText.trim().length > 0 : undefined
	});

	const readingSnapshot = createResultCaptureSnapshot(payload.reading);

	const record = {
		capturedAt: new Date().toISOString(),
		userAgent: request.headers.get('user-agent') ?? '',
		result: readingSnapshot
	};

	try {
		if (payload.kind === 'email') {
			await appendCaptureRecord({
				kind: 'email',
				...record,
				email: payload.email,
				cardSnapshot: readingSnapshot
			});
		} else {
			await appendCaptureRecord({
				kind: 'feedback',
				...record,
				feedback: payload.feedback,
				feedbackText: payload.feedbackText ?? ''
			});
		}
	} catch (error) {
		const loggedError = getLoggedError(error);

		logCaptureRoute('capture_failed', {
			stage: loggedError.stage,
			kind: payload.kind,
			code: loggedError.code,
			message: loggedError.message
		});

		if (isPreviewDeployment()) {
			return json(
				{
					error: 'Unable to store capture.',
					debug: {
						stage: loggedError.stage,
						code: loggedError.code,
						message: loggedError.message
					}
				},
				{ status: 500 }
			);
		}

		return json({ error: 'Unable to store capture.' }, { status: 500 });
	}

	logCaptureRoute('capture_succeeded', {
		kind: payload.kind
	});

	return json({ ok: true });
};
