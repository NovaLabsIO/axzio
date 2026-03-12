const LOW_SIGNAL_MESSAGE =
	'Please include at least one real word in each response. Short answers are fine, but blank entries or repeated single-letter filler will not work.';

const PLACEHOLDER_VALUES = new Set([
	'a',
	'd',
	'.',
	'..',
	'...',
	'?',
	'??',
	'???',
	'na',
	'n/a',
	'none',
	'nothing',
	'idk',
	'nope',
	'test',
	'asdf',
	'qwerty',
	'same'
]);

export type SignalValidationResult = {
	isValid: boolean;
	message: string;
};

function normalizeAnswer(value: string) {
	return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function compactAnswer(value: string) {
	return normalizeAnswer(value).replace(/[^a-z0-9]/g, '');
}

function isPlaceholder(value: string) {
	const normalized = normalizeAnswer(value);
	const compact = compactAnswer(value);

	return (
		!normalized ||
		PLACEHOLDER_VALUES.has(normalized) ||
		PLACEHOLDER_VALUES.has(compact) ||
		/^[a-z]$/i.test(compact) ||
		/^([a-z0-9])\1{2,}$/i.test(compact) ||
		/^[?.!]+$/.test(normalized)
	);
}

function hasRealWord(value: string) {
	return /[a-z]{2,}/i.test(value);
}

function hasRepeatedSingleCharacterFiller(value: string) {
	const compact = value.replace(/[^a-z0-9]/gi, '');

	return compact.length >= 3 && /^([a-z0-9])\1+$/i.test(compact);
}

export function validateIdentityResponses(responses: string[]): SignalValidationResult {
	const trimmedResponses = responses.map((response) => response.trim());
	const hasInvalidResponse = trimmedResponses.some(
		(response) =>
			!response ||
			isPlaceholder(response) ||
			hasRepeatedSingleCharacterFiller(response) ||
			!hasRealWord(response)
	);

	if (hasInvalidResponse) {
		return { isValid: false, message: LOW_SIGNAL_MESSAGE };
	}

	return { isValid: true, message: '' };
}
