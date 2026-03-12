import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	identityReadingJsonSchema,
	parseIdentityReading,
	type IdentityReading
} from '$lib/identity/schema';

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
		'You are AXZIO, an identity reading assistant.',
		'Analyze the reflection responses and infer a grounded identity reading.',
		'Tone requirements: clear, insightful, reflective, psychologically coherent, not mystical, not verbose.',
		'Choose exactly one primary mode and one secondary mode from the allowed values.',
		'Choose exactly one archetype and one growth vector from the allowed values.',
		'Keep each free-text field concise, specific, and readable.',
		'Avoid diagnostic language, therapy claims, or exaggerated certainty.',
		'Base the reading on patterns visible in the reflections, not generic advice.',
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
					'Return an identity reading that matches the provided JSON schema exactly.',
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
