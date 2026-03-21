import type { PillarsFeedbackSubmission } from '$lib/pillars/feedback';
import { createSupabaseAdminContext, probeSupabaseConnectivity } from '$lib/server/supabase';

export type PillarsFeedbackRecord = PillarsFeedbackSubmission & {
	userAgent: string;
};

type SupabaseLikeError = {
	code?: string;
	message?: string;
};

export class PillarsFeedbackStoreError extends Error {
	stage: string;
	code: string;

	constructor(stage: string, code: string, message: string) {
		super(message);
		this.name = 'PillarsFeedbackStoreError';
		this.stage = stage;
		this.code = code;
	}
}

function sanitizeLogValue(value: string) {
	return value.replace(/\s+/g, ' ').trim().slice(0, 240);
}

function getErrorDetails(error: unknown) {
	const candidate = error as SupabaseLikeError | null;

	return {
		code: candidate?.code ?? 'unknown',
		message: candidate?.message ?? 'Unknown error'
	};
}

function logPillarsFeedbackStage(stage: string, details: Record<string, unknown>) {
	const parts = Object.entries(details)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${String(value)}`);

	console.info(`[pillars_feedback] ${stage}${parts.length > 0 ? ` ${parts.join(' ')}` : ''}`);
}

export async function appendPillarsFeedbackRecord(record: PillarsFeedbackRecord) {
	const supabaseContext = createSupabaseAdminContext();
	const supabase = supabaseContext.client;

	try {
		await probeSupabaseConnectivity(supabaseContext);
	} catch (error) {
		const message = sanitizeLogValue(
			error instanceof Error ? error.message : 'Unknown connectivity probe error'
		);

		throw new PillarsFeedbackStoreError('connectivity_probe_failed', 'unknown', message);
	}

	logPillarsFeedbackStage('insert_start', {
		table: 'axzio_pillars_feedback',
		timeframe: record.timeframe,
		targetMode: record.targetMode,
		host: supabaseContext.hostname
	});

	const { error } = await supabase.from('axzio_pillars_feedback').insert({
		sentiment: record.sentiment,
		notes: record.notes,
		email: record.email,
		timeframe: record.timeframe,
		target_mode: record.targetMode,
		current_score: record.currentScore,
		target_score: record.targetScore,
		user_agent: record.userAgent
	});

	if (error) {
		const errorDetails = getErrorDetails(error);
		const message = sanitizeLogValue(errorDetails.message);

		logPillarsFeedbackStage('insert_failed', {
			table: 'axzio_pillars_feedback',
			code: errorDetails.code,
			message
		});

		throw new PillarsFeedbackStoreError('insert_failed', errorDetails.code, message);
	}

	logPillarsFeedbackStage('insert_succeeded', {
		table: 'axzio_pillars_feedback',
		timeframe: record.timeframe,
		targetMode: record.targetMode
	});
}
