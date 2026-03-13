import type { IdentityReading } from '$lib/identity/schema';
import { createSupabaseAdminContext, probeSupabaseConnectivity } from '$lib/server/supabase';

export type FeedbackValue = 'Yes' | 'Somewhat' | 'No';

export type ResultCaptureSnapshot = {
	archetype: IdentityReading['archetype'];
	primaryMode: IdentityReading['primaryMode'];
	secondaryMode: IdentityReading['secondaryMode'];
	growthFocus: IdentityReading['growthVector'];
	corePattern: IdentityReading['corePattern'];
	currentChallenge: IdentityReading['currentChallenge'];
	suggestedNextAction: IdentityReading['suggestedNextAction'];
};

type ResultInsert = {
	archetype: ResultCaptureSnapshot['archetype'];
	primary_mode: ResultCaptureSnapshot['primaryMode'];
	secondary_mode: ResultCaptureSnapshot['secondaryMode'];
	growth_focus: ResultCaptureSnapshot['growthFocus'];
	core_pattern: ResultCaptureSnapshot['corePattern'];
	current_challenge: ResultCaptureSnapshot['currentChallenge'];
	suggested_next_action: ResultCaptureSnapshot['suggestedNextAction'];
	card_snapshot: Record<string, string>;
	captured_at: string;
	email: string | null;
	user_agent: string;
};

type ResultCaptureContext = {
	capturedAt: string;
	userAgent: string;
};

type EmailCaptureRecord = ResultCaptureContext & {
	kind: 'email';
	email: string;
	result: ResultCaptureSnapshot;
	cardSnapshot: ResultCaptureSnapshot;
};

type FeedbackCaptureRecord = ResultCaptureContext & {
	kind: 'feedback';
	feedback: FeedbackValue;
	feedbackText: string;
	result: ResultCaptureSnapshot;
};

export type CaptureRecord = EmailCaptureRecord | FeedbackCaptureRecord;

export function createResultCaptureSnapshot(reading: IdentityReading): ResultCaptureSnapshot {
	return {
		archetype: reading.archetype,
		primaryMode: reading.primaryMode,
		secondaryMode: reading.secondaryMode,
		growthFocus: reading.growthVector,
		corePattern: reading.corePattern,
		currentChallenge: reading.currentChallenge,
		suggestedNextAction: reading.suggestedNextAction
	};
}

type SupabaseLikeError = {
	code?: string;
	message?: string;
};

export class CaptureStoreError extends Error {
	stage: string;
	code: string;

	constructor(stage: string, code: string, message: string) {
		super(message);
		this.name = 'CaptureStoreError';
		this.stage = stage;
		this.code = code;
	}
}

function getErrorDetails(error: unknown) {
	const candidate = error as SupabaseLikeError | null;

	return {
		code: candidate?.code ?? 'unknown',
		message: candidate?.message ?? 'Unknown error'
	};
}

function sanitizeLogValue(value: string) {
	return value.replace(/\s+/g, ' ').trim().slice(0, 240);
}

function isValidResultId(value: unknown) {
	return typeof value === 'string' ? value.trim().length > 0 : typeof value === 'number';
}

function formatResultId(value: unknown) {
	if (typeof value === 'string') {
		return value.length <= 8 ? value : `${value.slice(0, 4)}...${value.slice(-4)}`;
	}

	if (typeof value === 'number') {
		return String(value);
	}

	return 'missing';
}

function logCaptureStage(stage: string, details: Record<string, unknown>) {
	const parts = Object.entries(details)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${String(value)}`);

	console.info(`[capture] ${stage}${parts.length > 0 ? ` ${parts.join(' ')}` : ''}`);
}

function createResultInsert(record: CaptureRecord): ResultInsert {
	return {
		archetype: record.result.archetype,
		primary_mode: record.result.primaryMode,
		secondary_mode: record.result.secondaryMode,
		growth_focus: record.result.growthFocus,
		core_pattern: record.result.corePattern,
		current_challenge: record.result.currentChallenge,
		suggested_next_action: record.result.suggestedNextAction,
		card_snapshot: record.kind === 'email' ? record.cardSnapshot : record.result,
		captured_at: record.capturedAt,
		email: record.kind === 'email' ? record.email : null,
		user_agent: record.userAgent
	};
}

export async function appendCaptureRecord(record: CaptureRecord) {
	const supabaseContext = createSupabaseAdminContext();
	const supabase = supabaseContext.client;

	try {
		await probeSupabaseConnectivity(supabaseContext);
	} catch (error) {
		const message = sanitizeLogValue(
			error instanceof Error ? error.message : 'Unknown connectivity probe error'
		);

		throw new CaptureStoreError('connectivity_probe_failed', 'unknown', message);
	}

	logCaptureStage('result_insert_start', {
		table: 'axzio_results',
		kind: record.kind,
		host: supabaseContext.hostname
	});

	const { data: resultRow, error: resultError } = await supabase
		.from('axzio_results')
		.insert(createResultInsert(record))
		.select('id')
		.single();

	if (resultError || !resultRow) {
		const errorDetails = getErrorDetails(resultError);
		const message = sanitizeLogValue(errorDetails.message);

		logCaptureStage('result_insert_failed', {
			table: 'axzio_results',
			code: errorDetails.code,
			message,
			hasResultRow: Boolean(resultRow)
		});

		throw new CaptureStoreError('result_insert_failed', errorDetails.code, message);
	} else {
		logCaptureStage('result_insert_succeeded', {
			table: 'axzio_results',
			resultId: formatResultId(resultRow.id)
		});
	}

	logCaptureStage('result_id_check', {
		present: Boolean(resultRow.id),
		valid: isValidResultId(resultRow.id),
		resultId: formatResultId(resultRow.id)
	});

	if (record.kind === 'email') {
		logCaptureStage('email_insert_start', {
			table: 'axzio_email_submissions',
			resultId: formatResultId(resultRow.id)
		});

		const { error: emailError } = await supabase.from('axzio_email_submissions').insert({
			result_id: resultRow.id,
			email: record.email,
			captured_at: record.capturedAt,
			user_agent: record.userAgent
		});

		if (emailError) {
			const errorDetails = getErrorDetails(emailError);
			const message = sanitizeLogValue(errorDetails.message);

			logCaptureStage('email_insert_failed', {
				table: 'axzio_email_submissions',
				resultId: formatResultId(resultRow.id),
				code: errorDetails.code,
				message
			});
			await supabase.from('axzio_results').delete().eq('id', resultRow.id);
			throw new CaptureStoreError('email_insert_failed', errorDetails.code, message);
		}

		logCaptureStage('email_insert_succeeded', {
			table: 'axzio_email_submissions',
			resultId: formatResultId(resultRow.id)
		});

		return;
	}

	logCaptureStage('feedback_insert_start', {
		table: 'axzio_feedback',
		resultId: formatResultId(resultRow.id)
	});

	const { error: feedbackError } = await supabase.from('axzio_feedback').insert({
		result_id: resultRow.id,
		feedback_choice: record.feedback,
		feedback_text: record.feedbackText,
		captured_at: record.capturedAt,
		user_agent: record.userAgent
	});

	if (feedbackError) {
		const errorDetails = getErrorDetails(feedbackError);
		const message = sanitizeLogValue(errorDetails.message);

		logCaptureStage('feedback_insert_failed', {
			table: 'axzio_feedback',
			resultId: formatResultId(resultRow.id),
			code: errorDetails.code,
			message
		});
		await supabase.from('axzio_results').delete().eq('id', resultRow.id);
		throw new CaptureStoreError('feedback_insert_failed', errorDetails.code, message);
	}

	logCaptureStage('feedback_insert_succeeded', {
		table: 'axzio_feedback',
		resultId: formatResultId(resultRow.id)
	});
}
