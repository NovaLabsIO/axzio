import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ARCHETYPES } from '$lib/config/archetypes';
import { GROWTH_VECTORS } from '$lib/config/growth-vectors';
import { MODES } from '$lib/config/modes';
import {
	identityReadingJsonSchema,
	parseIdentityReading,
	type IdentityReading
} from '$lib/identity/schema';
import { validateIdentityResponses } from '$lib/identity/signal-validation';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_MODEL = 'gpt-4.1';

type AnalyzeRequest = {
	responses: string[];
};

type OpenAIResponsePayload = {
	error?: {
		message?: string;
	};
	output?: Array<{
		type?: string;
		content?: Array<{
			type?: string;
			text?: string;
		}>;
	}>;
};

const modeGuide = MODES.map(({ value, description }) => `- ${value}: ${description}`).join('\n');
const archetypeGuide = ARCHETYPES.map(
	({ value, description }) => `- ${value}: ${description}`
).join('\n');
const growthVectorGuide = GROWTH_VECTORS.map(
	({ value, description }) => `- ${value}: ${description}`
).join('\n');

function parseAnalyzeRequest(body: unknown): AnalyzeRequest | null {
	if (!body || typeof body !== 'object') {
		return null;
	}

	const responses = (body as Record<string, unknown>).responses;

	if (!Array.isArray(responses) || responses.length !== 10) {
		return null;
	}

	if (!responses.every((value) => typeof value === 'string')) {
		return null;
	}

	return {
		responses: responses.map((value) => value.trim())
	};
}

function buildPrompt(responses: string[]) {
	const numberedResponses = responses
		.map((response, index) => `${index + 1}. ${response || '[No response provided]'}`)
		.join('\n');

	return [
		'You are the AXZIO Identity Engine.',
		'Interpret the responses and produce a concise identity reading that feels psychologically specific, archetypal, grounded, and human.',
		'Your job is to detect the user\'s orientation, recurring pattern, likely tension, and constructive next step.',
		'Do not summarize the answers one by one. Infer the pattern beneath them.',
		'Do not use mystical language, therapy language, corporate coaching tone, or generic encouragement.',
		'Do not simply mirror the user\'s words back to them. Name the pattern in a way that feels recognizable and precise.',
		'Keep the result compact enough for a product UI card and short result page.',
		'Use only the current AXZIO vocabulary listed below.',
		'Allowed modes:',
		modeGuide,
		'Allowed archetypes:',
		archetypeGuide,
		'Allowed growth vectors:',
		growthVectorGuide,
		'Writing guidance by field:',
		'- primaryMode: choose the dominant orientation driving the user right now.',
		'- secondaryMode: choose the supporting orientation that shapes how the primary mode is expressed.',
		'- archetype: choose the single best-fit archetype from the allowed list; it should feel recognizable, not flattering by default.',
		'- corePattern: write 2 short sentences that interpret the user\'s behavior, motivation, and emotional logic. Be specific and pattern-based.',
		'- currentChallenge: write 1 sentence naming the real tension, trade-off, or friction the user appears to be navigating.',
		'- growthVector: choose the most constructive direction from the allowed list.',
		'- suggestedNextAction: write 1 practical sentence describing a small, meaningful step the user could take in the next few days.',
		'Quality bar:',
		'- insightful, grounded, archetypal, and specific',
		'- concise rather than elaborate',
		'- constructive without sounding motivational',
		'- confident but not absolute',
		'- based on patterns in the reflections, not generic self-help language',
		'Reflection responses:',
		numberedResponses
	].join('\n');
}

function extractStructuredOutput(payload: OpenAIResponsePayload): IdentityReading | null {
	const text = payload.output
		?.flatMap((item) => item.content ?? [])
		.find((content) => content.type === 'output_text' && typeof content.text === 'string')?.text;

	if (!text) {
		return null;
	}

	try {
		return parseIdentityReading(JSON.parse(text));
	} catch {
		return null;
	}
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	if (!env.OPENAI_API_KEY) {
		return json(
			{ error: 'The server is missing OPENAI_API_KEY.' },
			{ status: 500 }
		);
	}

	let requestBody: unknown;

	try {
		requestBody = await request.json();
	} catch {
		return json({ error: 'Request body must be valid JSON.' }, { status: 400 });
	}

	const parsedRequest = parseAnalyzeRequest(requestBody);

	if (!parsedRequest) {
		return json(
			{ error: 'Expected a JSON body with a responses array of 10 strings.' },
			{ status: 400 }
		);
	}

	const validation = validateIdentityResponses(parsedRequest.responses);

	if (!validation.isValid) {
		return json({ error: validation.message }, { status: 400 });
	}

	let openAIResponse: Response;

	try {
		openAIResponse = await fetch(OPENAI_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: OPENAI_MODEL,
				instructions:
					'Return only a JSON object that matches the provided schema exactly. Use the schema enums exactly as written.',
				input: buildPrompt(parsedRequest.responses),
				text: {
					format: {
						type: 'json_schema',
						...identityReadingJsonSchema
					}
				}
			})
		});
	} catch {
		return json(
			{ error: 'Failed to reach the OpenAI API.' },
			{ status: 502 }
		);
	}

	let payload: OpenAIResponsePayload;

	try {
		payload = (await openAIResponse.json()) as OpenAIResponsePayload;
	} catch {
		return json(
			{ error: 'OpenAI returned an unreadable response.' },
			{ status: 502 }
		);
	}

	if (!openAIResponse.ok) {
		return json(
			{ error: payload.error?.message ?? 'OpenAI request failed.' },
			{ status: openAIResponse.status }
		);
	}

	const identityReading = extractStructuredOutput(payload);

	if (!identityReading) {
		return json(
			{ error: 'OpenAI returned a response that did not match the expected identity schema.' },
			{ status: 502 }
		);
	}

	return json(identityReading);
};
