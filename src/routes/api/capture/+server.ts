import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseIdentityReading, type IdentityReading } from '$lib/identity/schema';
import {
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

function isFeedbackValue(value: unknown): value is FeedbackValue {
	return value === 'Yes' || value === 'Somewhat' || value === 'No';
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
	} catch {
		return json({ error: 'Unable to store capture.' }, { status: 500 });
	}

	return json({ ok: true });
};
