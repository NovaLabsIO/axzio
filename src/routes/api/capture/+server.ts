// @ts-ignore Node built-ins are available at runtime in the SvelteKit server environment.
import { mkdir, appendFile } from 'node:fs/promises';
// @ts-ignore Node built-ins are available at runtime in the SvelteKit server environment.
import path from 'node:path';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	parseIdentityReading,
	type IdentityReading
} from '$lib/identity/schema';

const CAPTURE_DIRECTORY = path.join(process.cwd(), '.data');
const CAPTURE_FILE = path.join(CAPTURE_DIRECTORY, 'private-test-captures.jsonl');

type CaptureKind = 'email' | 'feedback';
type FeedbackValue = 'Yes' | 'Somewhat' | 'No';

type CapturePayload = {
	kind: CaptureKind;
	email?: string;
	feedback?: FeedbackValue;
	reading?: IdentityReading;
};

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

	return { kind, feedback: candidate.feedback, reading };
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
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

	const record = {
		...payload,
		capturedAt: new Date().toISOString(),
		userAgent: request.headers.get('user-agent') ?? '',
		clientAddress: getClientAddress()
	};

	try {
		await mkdir(CAPTURE_DIRECTORY, { recursive: true });
		await appendFile(CAPTURE_FILE, `${JSON.stringify(record)}\n`, 'utf8');
	} catch {
		return json({ error: 'Unable to store capture.' }, { status: 500 });
	}

	return json({ ok: true });
};
