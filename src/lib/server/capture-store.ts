import type { IdentityReading } from '$lib/identity/schema';
import { createSupabaseAdminClient } from '$lib/server/supabase';

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
	const supabase = createSupabaseAdminClient();

	const { data: resultRow, error: resultError } = await supabase
		.from('axzio_results')
		.insert(createResultInsert(record))
		.select('id')
		.single();

	if (resultError || !resultRow) {
		throw resultError ?? new Error('Unable to insert result capture.');
	}

	if (record.kind === 'email') {
		const { error: emailError } = await supabase.from('axzio_email_submissions').insert({
			result_id: resultRow.id,
			email: record.email,
			captured_at: record.capturedAt,
			user_agent: record.userAgent
		});

		if (emailError) {
			await supabase.from('axzio_results').delete().eq('id', resultRow.id);
			throw emailError;
		}

		return;
	}

	const { error: feedbackError } = await supabase.from('axzio_feedback').insert({
		result_id: resultRow.id,
		feedback_choice: record.feedback,
		feedback_text: record.feedbackText,
		captured_at: record.capturedAt,
		user_agent: record.userAgent
	});

	if (feedbackError) {
		await supabase.from('axzio_results').delete().eq('id', resultRow.id);
		throw feedbackError;
	}
}
