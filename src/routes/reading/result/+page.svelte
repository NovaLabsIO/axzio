<svelte:head>
	<title>AXZIO | ID</title>
	<meta
		name="description"
		content="Your AXZIO identity result."
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getGrowthVectorDirectionCopy,
		getGrowthVectorHeroCopy,
		getGrowthVectorWhyCopy
	} from '$lib/identity/growth-vector-copy';
	import {
		IDENTITY_RESULT_STORAGE_KEY,
		parseIdentityReading,
		type IdentityReading
	} from '$lib/identity/schema';

	let identityReading: IdentityReading | null = null;
	let isExporting = false;
	let isSharing = false;
	let shareMessage = '';
	let emailValue = '';
	let emailMessage = '';
	let feedbackValue: FeedbackValue | '' = '';
	let feedbackText = '';
	let feedbackMessage = '';
	let feedbackConfirmation = '';
	let isSavingEmail = false;
	let isSavingFeedback = false;
	let cachedCardBlob: Blob | null = null;
	let cachedCardBlobKey = '';

	const EXPORT_FILENAME = 'axzio-identity-signal.png';
	const EMAIL_CAPTURE_STORAGE_KEY = 'axzio.identity-reading-email';
	const FEEDBACK_CAPTURE_STORAGE_KEY = 'axzio.identity-reading-feedback';
	const FEEDBACK_TEXT_STORAGE_KEY = 'axzio.identity-reading-feedback-text';
	const FEEDBACK_SUBMITTED_STORAGE_KEY = 'axzio.identity-reading-feedback-submitted';
	const SHARE_TITLE = 'AXZIO ID';
	const CARD_WIDTH = 1080;
	const CARD_HEIGHT = 1080;
	const CARD_PADDING = 48;
	const SURFACE_RADIUS = 36;
	const FIELD_RADIUS = 24;
	const CARD_INNER_PADDING = 30;
	const CARD_SECTION_GAP = 18;
	const CARD_FOOTER_HEIGHT = 74;
	const FIELD_TEXT_INSET_X = 32;
	const FIELD_LABEL_Y = 24;
	const FIELD_CONTENT_Y = 74;
	const FIELD_BOTTOM_PADDING = 28;
	const LABEL_FONT = '600 20px "IBM Plex Sans", "Avenir Next", sans-serif';
	const HERO_FONT = '600 64px "IBM Plex Sans", "Avenir Next", sans-serif';
	const VALUE_FONT = '600 34px "IBM Plex Sans", "Avenir Next", sans-serif';
	const SMALL_BODY_FONT = '400 22px "IBM Plex Sans", "Avenir Next", sans-serif';
	const COMPACT_BODY_FONT = '400 20px "IBM Plex Sans", "Avenir Next", sans-serif';
	const TIGHT_BODY_FONT = '400 18px "IBM Plex Sans", "Avenir Next", sans-serif';
	const VALUE_LINE_HEIGHT = 42;
	const BODY_LINE_HEIGHT = 32;
	const COMPACT_BODY_LINE_HEIGHT = 29;
	const TIGHT_BODY_LINE_HEIGHT = 27;
	const FEEDBACK_OPTIONS = ['Yes', 'Somewhat', 'No'] as const;

	type FeedbackValue = (typeof FEEDBACK_OPTIONS)[number];

	type AccentTheme = {
		accent: string;
		accentSoft: string;
		accentGlow: string;
		surfaceGlow: string;
	};

	type FieldLayout = {
		lines: string[];
		height: number;
		body: boolean;
		highlight: boolean;
		font: string;
		lineHeight: number;
	};

	type FeedbackSubmissionDraft = {
		value: FeedbackValue;
		text: string;
	};

	const modeThemes: Record<string, AccentTheme> = {
		People: {
			accent: '#f4b88f',
			accentSoft: 'rgba(244, 184, 143, 0.18)',
			accentGlow: 'rgba(244, 184, 143, 0.28)',
			surfaceGlow: 'rgba(244, 184, 143, 0.16)'
		},
		Pleasure: {
			accent: '#f0a58c',
			accentSoft: 'rgba(240, 165, 140, 0.18)',
			accentGlow: 'rgba(240, 165, 140, 0.28)',
			surfaceGlow: 'rgba(240, 165, 140, 0.14)'
		},
		Production: {
			accent: '#d3a463',
			accentSoft: 'rgba(211, 164, 99, 0.18)',
			accentGlow: 'rgba(211, 164, 99, 0.26)',
			surfaceGlow: 'rgba(211, 164, 99, 0.14)'
		},
		Reflection: {
			accent: '#b59cff',
			accentSoft: 'rgba(181, 156, 255, 0.18)',
			accentGlow: 'rgba(181, 156, 255, 0.26)',
			surfaceGlow: 'rgba(181, 156, 255, 0.14)'
		}
	};

	function getAccentTheme(mode: string | undefined): AccentTheme {
		return modeThemes[mode ?? ''] ?? modeThemes.Reflection;
	}

	function getSurfaceStyle(reading: IdentityReading | null) {
		const theme = getAccentTheme(reading?.primaryMode);

		return [
			`--accent:${theme.accent}`,
			`--accent-soft:${theme.accentSoft}`,
			`--accent-glow:${theme.accentGlow}`,
			`--surface-glow:${theme.surfaceGlow}`
		].join(';');
	}

	onMount(() => {
		const savedValue = sessionStorage.getItem(IDENTITY_RESULT_STORAGE_KEY);
		const savedEmail = localStorage.getItem(EMAIL_CAPTURE_STORAGE_KEY);
		const savedFeedback = localStorage.getItem(FEEDBACK_CAPTURE_STORAGE_KEY);
		const savedFeedbackText = localStorage.getItem(FEEDBACK_TEXT_STORAGE_KEY);
		const savedFeedbackSubmitted = localStorage.getItem(FEEDBACK_SUBMITTED_STORAGE_KEY);

		if (savedEmail) {
			emailValue = savedEmail;
		}

		if (savedFeedback === 'Yes' || savedFeedback === 'Somewhat' || savedFeedback === 'No') {
			feedbackValue = savedFeedback;
		}

		if (savedFeedbackText) {
			feedbackText = savedFeedbackText;
		}

		if (savedFeedbackSubmitted === 'true' && feedbackValue) {
			feedbackConfirmation = 'Feedback saved. You can update it and submit again if your view changes.';
		}

		if (!savedValue) {
			return;
		}

		try {
			identityReading = parseIdentityReading(JSON.parse(savedValue));
		} catch {
			identityReading = null;
		}
	});

	$: {
		const nextKey = identityReading ? createCardBlobKey(identityReading) : '';

		if (nextKey !== cachedCardBlobKey) {
			cachedCardBlob = null;
			cachedCardBlobKey = nextKey;
		}
	}

	function createCardBlobKey(reading: IdentityReading) {
		return JSON.stringify({
			archetype: reading.archetype,
			primaryMode: reading.primaryMode,
			secondaryMode: reading.secondaryMode,
			corePattern: reading.corePattern,
			currentChallenge: reading.currentChallenge,
			growthVector: reading.growthVector,
			suggestedNextAction: reading.suggestedNextAction
		});
	}

	function createShareText(reading: IdentityReading) {
		return `My AXZIO ID: ${reading.archetype} • ${reading.primaryMode} • ${reading.growthVector}`;
	}

	function createWhyThisFits(reading: IdentityReading) {
		const secondaryMode = reading.secondaryMode.trim().toLowerCase();
		const whyGrowthFits = getGrowthVectorWhyCopy(reading.growthVector);

		return `Your answers point most strongly toward ${reading.primaryMode.toLowerCase()}, with ${secondaryMode} close behind. That combination aligns with the ${reading.archetype} archetype. ${whyGrowthFits}`;
	}

	function createCorePatternInterpretation(reading: IdentityReading) {
		return `Right now, ${reading.primaryMode} appears to be your strongest mode, shaped by ${reading.secondaryMode.toLowerCase()} as a secondary influence. ${reading.corePattern}`;
	}

	const primaryModeContext: Record<string, string> = {
		People: 'Relationships, care, and other people are driving most of your attention right now.',
		Pleasure: 'Relief, enjoyment, and what feels emotionally alive are driving you most right now.',
		Production: 'Momentum, output, and getting something done are driving you most right now.',
		Reflection: 'Meaning, self-understanding, and inner clarity are driving you most right now.'
	};

	const secondaryModeContext: Record<string, string> = {
		People: 'It adds a relational lens, shaping how you respond to what and who is around you.',
		Pleasure: 'It adds an emotional lens, shaping what feels satisfying, relieving, or worth moving toward.',
		Production: 'It adds a practical lens, shaping how strongly you orient toward structure, progress, and results.',
		Reflection: 'It adds an interpretive lens, shaping how much pause, meaning, and self-observation color your choices.'
	};

	function getPrimaryModeExplanation(mode: string) {
		return primaryModeContext[mode] ?? 'This is the signal currently driving most of your energy and attention.';
	}

	function getSecondaryModeExplanation(mode: string, primaryMode: string) {
		const secondaryExplanation =
			secondaryModeContext[mode] ??
			'It adds a second layer of influence that colors how your main drive tends to show up.';

		return `${secondaryExplanation.replace(/\.$/, '')}, working alongside ${primaryMode.toLowerCase()} rather than replacing it.`;
	}

	function getGrowthVectorExplanation(vector: string) {
		return getGrowthVectorHeroCopy(vector);
	}

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function getFeedbackDraft(): FeedbackSubmissionDraft | null {
		if (!feedbackValue) {
			return null;
		}

		return {
			value: feedbackValue,
			text: feedbackText.trim()
		};
	}

	function hasSavedFeedbackChanged() {
		const savedValue = localStorage.getItem(FEEDBACK_CAPTURE_STORAGE_KEY);
		const savedText = localStorage.getItem(FEEDBACK_TEXT_STORAGE_KEY) ?? '';

		if (!feedbackValue) {
			return false;
		}

		return savedValue !== feedbackValue || savedText !== feedbackText.trim();
	}

	async function submitCapture(payload: {
		kind: 'email' | 'feedback';
		email?: string;
		feedback?: FeedbackValue;
		feedbackText?: string;
		reading: IdentityReading;
	}, signal?: AbortSignal) {
		const response = await fetch('/api/capture', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload),
			signal
		});

		const result = (await response.json()) as { error?: string };

		if (!response.ok) {
			throw new Error(result.error ?? 'Capture failed.');
		}
	}

	async function saveEmailCapture() {
		if (!identityReading || isSavingEmail) {
			return;
		}

		const normalizedEmail = emailValue.trim().toLowerCase();

		if (!normalizedEmail) {
			emailMessage = 'Enter an email address to send this result.';
			return;
		}

		if (!isValidEmail(normalizedEmail)) {
			emailMessage = 'Enter a valid email address.';
			return;
		}

		isSavingEmail = true;
		emailMessage = '';

		try {
			await submitCapture({
				kind: 'email',
				email: normalizedEmail,
				reading: identityReading
			});

			localStorage.setItem(EMAIL_CAPTURE_STORAGE_KEY, normalizedEmail);
			emailValue = normalizedEmail;
			emailMessage =
				'Saved for AXZIO private testing review. This build stores your email and result data reliably, but inbox delivery is not configured yet.';
		} catch {
			emailMessage =
				'Unable to save your email right now. Your result stays on screen, but this submission was not captured.';
		} finally {
			isSavingEmail = false;
		}
	}

	function selectFeedback(value: FeedbackValue) {
		feedbackValue = value;
		feedbackMessage = '';

		if (feedbackConfirmation && hasSavedFeedbackChanged()) {
			feedbackConfirmation = '';
		}
	}

	function updateFeedbackText(value: string) {
		feedbackText = value;
		feedbackMessage = '';

		if (feedbackConfirmation && hasSavedFeedbackChanged()) {
			feedbackConfirmation = '';
		}
	}

	async function saveFeedback() {
		if (!identityReading || isSavingFeedback) {
			return;
		}

		const draft = getFeedbackDraft();

		if (!draft) {
			feedbackMessage = 'Choose Yes, Somewhat, or No before submitting feedback.';
			return;
		}

		feedbackMessage = '';
		feedbackConfirmation = '';
		isSavingFeedback = true;

		try {
			await submitCapture({
				kind: 'feedback',
				feedback: draft.value,
				feedbackText: draft.text,
				reading: identityReading
			});

			localStorage.setItem(FEEDBACK_CAPTURE_STORAGE_KEY, draft.value);
			localStorage.setItem(FEEDBACK_TEXT_STORAGE_KEY, draft.text);
			localStorage.setItem(FEEDBACK_SUBMITTED_STORAGE_KEY, 'true');
			feedbackConfirmation = 'Thanks. Your feedback was saved for the AXZIO review.';
		} catch {
			feedbackMessage = 'Unable to save your feedback right now. Please try again.';
		} finally {
			isSavingFeedback = false;
		}
	}

	function breakWordToWidth(
		context: CanvasRenderingContext2D,
		word: string,
		maxWidth: number
	) {
		const segments: string[] = [];
		let remaining = word;

		while (remaining && context.measureText(remaining).width > maxWidth) {
			let sliceLength = remaining.length - 1;

			while (
				sliceLength > 1 &&
				context.measureText(`${remaining.slice(0, sliceLength)}-`).width > maxWidth
			) {
				sliceLength -= 1;
			}

			const slice = remaining.slice(0, sliceLength);
			segments.push(`${slice}-`);
			remaining = remaining.slice(sliceLength);
		}

		if (remaining) {
			segments.push(remaining);
		}

		return segments.length ? segments : [word];
	}

	function drawRoundedRect(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number
	) {
		context.beginPath();
		context.moveTo(x + radius, y);
		context.lineTo(x + width - radius, y);
		context.quadraticCurveTo(x + width, y, x + width, y + radius);
		context.lineTo(x + width, y + height - radius);
		context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		context.lineTo(x + radius, y + height);
		context.quadraticCurveTo(x, y + height, x, y + height - radius);
		context.lineTo(x, y + radius);
		context.quadraticCurveTo(x, y, x + radius, y);
		context.closePath();
	}

	function fillRoundedRect(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number,
		fillStyle: string | CanvasGradient
	) {
		context.save();
		context.fillStyle = fillStyle;
		drawRoundedRect(context, x, y, width, height, radius);
		context.fill();
		context.restore();
	}

	function strokeRoundedRect(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number,
		strokeStyle: string,
		lineWidth: number
	) {
		context.save();
		context.strokeStyle = strokeStyle;
		context.lineWidth = lineWidth;
		drawRoundedRect(context, x, y, width, height, radius);
		context.stroke();
		context.restore();
	}

	function wrapText(
		context: CanvasRenderingContext2D,
		text: string,
		maxWidth: number,
		maxLines: number
	) {
		const normalizedText = text.replace(/\s+/g, ' ').trim();

		if (!normalizedText) {
			return [''];
		}

		const words = normalizedText
			.split(' ')
			.flatMap((word) =>
				context.measureText(word).width > maxWidth ? breakWordToWidth(context, word, maxWidth) : [word]
			);
		const lines: string[] = [];
		let currentLine = '';

		for (const word of words) {
			const candidate = currentLine ? `${currentLine} ${word}` : word;

			if (context.measureText(candidate).width <= maxWidth) {
				currentLine = candidate;
				continue;
			}

			if (currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				lines.push(word);
			}

			if (lines.length === maxLines) {
				break;
			}
		}

		if (lines.length < maxLines && currentLine) {
			lines.push(currentLine);
		}

		if (lines.length > maxLines) {
			lines.length = maxLines;
		}

		if (!lines.length) {
			lines.push('');
		}

		const hasOverflow = words.join(' ') !== lines.join(' ');

		if (hasOverflow) {
			const lastLine = lines[lines.length - 1] ?? '';
			let truncated = lastLine;

			while (truncated && context.measureText(`${truncated}...`).width > maxWidth) {
				truncated = truncated.slice(0, -1).trimEnd();
			}

			lines[lines.length - 1] = truncated ? `${truncated}...` : '...';
		}

		return lines;
	}

	function createFieldLayout(
		context: CanvasRenderingContext2D,
		value: string,
		width: number,
		options?: {
			body?: boolean;
			maxLines?: number;
			highlight?: boolean;
			minHeight?: number;
			font?: string;
			lineHeight?: number;
		}
	): FieldLayout {
		const body = options?.body ?? false;
		const font = options?.font ?? (body ? SMALL_BODY_FONT : VALUE_FONT);
		const lineHeight = options?.lineHeight ?? (body ? BODY_LINE_HEIGHT : VALUE_LINE_HEIGHT);
		const maxLines = options?.maxLines ?? (body ? 4 : 2);
		const minHeight = options?.minHeight ?? (body ? 138 : 146);
		const contentWidth = width - FIELD_TEXT_INSET_X * 2;

		context.save();
		context.font = font;
		const lines = wrapText(context, value, contentWidth, maxLines);
		context.restore();

		const height = Math.max(
			minHeight,
			FIELD_CONTENT_Y + lines.length * lineHeight + FIELD_BOTTOM_PADDING
		);

		return {
			lines,
			height,
			body,
			highlight: options?.highlight ?? false,
			font,
			lineHeight
		};
	}

	function createAdaptiveBodyFieldLayout(
		context: CanvasRenderingContext2D,
		value: string,
		width: number,
		options?: { maxLines?: number; highlight?: boolean; minHeight?: number }
	) {
		const fontVariants = [
			{ font: SMALL_BODY_FONT, lineHeight: BODY_LINE_HEIGHT },
			{ font: COMPACT_BODY_FONT, lineHeight: COMPACT_BODY_LINE_HEIGHT },
			{ font: TIGHT_BODY_FONT, lineHeight: TIGHT_BODY_LINE_HEIGHT }
		];

		let fallbackLayout: FieldLayout | null = null;

		for (const variant of fontVariants) {
			const layout = createFieldLayout(context, value, width, {
				body: true,
				maxLines: options?.maxLines,
				highlight: options?.highlight,
				minHeight: options?.minHeight,
				font: variant.font,
				lineHeight: variant.lineHeight
			});

			fallbackLayout = layout;

			if (!layout.lines.some((line) => line.endsWith('...'))) {
				return layout;
			}
		}

		return fallbackLayout ?? createFieldLayout(context, value, width, {
			body: true,
			maxLines: options?.maxLines,
			highlight: options?.highlight,
			minHeight: options?.minHeight
		});
	}

	function drawField(
		context: CanvasRenderingContext2D,
		label: string,
		layout: FieldLayout,
		x: number,
		y: number,
		width: number,
		theme: AccentTheme
	) {
		const panelFill = layout.highlight ? 'rgba(26, 21, 32, 0.9)' : 'rgba(15, 13, 21, 0.84)';
		const border = layout.highlight ? 'rgba(255, 236, 212, 0.18)' : 'rgba(255, 236, 212, 0.1)';
		const glow = context.createRadialGradient(x + 44, y + 36, 0, x + 44, y + 36, width * 0.8);
		glow.addColorStop(0, theme.surfaceGlow);
		glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

		fillRoundedRect(context, x, y, width, layout.height, FIELD_RADIUS, panelFill);
		context.save();
		drawRoundedRect(context, x, y, width, layout.height, FIELD_RADIUS);
		context.clip();
		context.fillStyle = glow;
		context.fillRect(x, y, width, layout.height);
		context.restore();
		strokeRoundedRect(context, x, y, width, layout.height, FIELD_RADIUS, border, 2);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = layout.highlight ? 'rgba(255, 231, 203, 0.8)' : 'rgba(240, 220, 198, 0.72)';
		context.font = LABEL_FONT;
		context.fillText(label.toUpperCase(), x + FIELD_TEXT_INSET_X, y + FIELD_LABEL_Y);

		context.fillStyle = '#f6efe7';
		context.font = layout.font;

		layout.lines.forEach((line, index) => {
			context.fillText(
				line,
				x + FIELD_TEXT_INSET_X,
				y + FIELD_CONTENT_Y + index * layout.lineHeight
			);
		});
		context.restore();
	}

	async function renderCardBlob(reading: IdentityReading) {
		const theme = getAccentTheme(reading.primaryMode);

		if ('fonts' in document) {
			await document.fonts.ready;
		}

		const canvas = document.createElement('canvas');
		canvas.width = CARD_WIDTH;
		canvas.height = CARD_HEIGHT;

		const context = canvas.getContext('2d');

		if (!context) {
			throw new Error('Canvas export is unavailable.');
		}

		const background = context.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
		background.addColorStop(0, '#090812');
		background.addColorStop(0.6, '#120e1a');
		background.addColorStop(1, '#1f1520');
		context.fillStyle = background;
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const glow = context.createRadialGradient(260, 160, 0, 260, 160, 500);
		glow.addColorStop(0, theme.accentGlow);
		glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
		context.fillStyle = glow;
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const emberGlow = context.createRadialGradient(860, 820, 0, 860, 820, 440);
		emberGlow.addColorStop(0, 'rgba(241, 146, 88, 0.14)');
		emberGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
		context.fillStyle = emberGlow;
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const panelGradient = context.createLinearGradient(100, 100, CARD_WIDTH - 100, CARD_HEIGHT - 120);
		panelGradient.addColorStop(0, 'rgba(12, 11, 19, 0.96)');
		panelGradient.addColorStop(1, 'rgba(25, 20, 31, 0.94)');

		fillRoundedRect(
			context,
			CARD_PADDING,
			CARD_PADDING,
			CARD_WIDTH - CARD_PADDING * 2,
			CARD_HEIGHT - CARD_PADDING * 2,
			SURFACE_RADIUS,
			panelGradient
		);
		strokeRoundedRect(
			context,
			CARD_PADDING,
			CARD_PADDING,
			CARD_WIDTH - CARD_PADDING * 2,
			CARD_HEIGHT - CARD_PADDING * 2,
			SURFACE_RADIUS,
			'rgba(255, 236, 212, 0.12)',
			2
		);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = 'rgba(245, 226, 203, 0.72)';
		context.font = LABEL_FONT;
		context.fillText('AXZIO ID', CARD_PADDING + CARD_INNER_PADDING, CARD_PADDING + 24);
		context.fillStyle = '#f7efe5';
		context.font = HERO_FONT;
		context.fillText(reading.archetype, CARD_PADDING + CARD_INNER_PADDING, CARD_PADDING + 58);
		context.fillStyle = 'rgba(240, 220, 198, 0.72)';
		context.font = '500 22px "IBM Plex Sans", "Avenir Next", sans-serif';
		context.fillText(
			`${reading.primaryMode} • ${reading.secondaryMode} • ${reading.growthVector}`,
			CARD_PADDING + CARD_INNER_PADDING,
			CARD_PADDING + 132
		);

		const innerX = CARD_PADDING + CARD_INNER_PADDING;
		const innerY = CARD_PADDING + 182;
		const innerWidth = CARD_WIDTH - CARD_PADDING * 2 - CARD_INNER_PADDING * 2;
		const columnGap = 20;
		const fieldWidth = (innerWidth - columnGap) / 2;
		const footerTextY = CARD_HEIGHT - CARD_PADDING - CARD_FOOTER_HEIGHT + 18;
		const contentBottomLimit = footerTextY - 22;
		const layoutVariants = [
			{ coreLines: 5, challengeLines: 3, actionLines: 5 },
			{ coreLines: 4, challengeLines: 3, actionLines: 5 },
			{ coreLines: 4, challengeLines: 2, actionLines: 4 },
			{ coreLines: 3, challengeLines: 2, actionLines: 4 }
		];

		let selectedLayout = null as
			| {
					primary: FieldLayout;
					secondary: FieldLayout;
					core: FieldLayout;
					challenge: FieldLayout;
					growth: FieldLayout;
					action: FieldLayout;
					totalHeight: number;
			  }
			| null;

		for (const variant of layoutVariants) {
			const primary = createFieldLayout(context, reading.primaryMode, fieldWidth, {
				minHeight: 144
			});
			const secondary = createFieldLayout(context, reading.secondaryMode, fieldWidth, {
				minHeight: 144
			});
			const core = createFieldLayout(context, reading.corePattern, innerWidth, {
				body: true,
				highlight: true,
				maxLines: variant.coreLines,
				minHeight: 188
			});
			const challenge = createFieldLayout(context, reading.currentChallenge, innerWidth, {
				body: true,
				maxLines: variant.challengeLines,
				minHeight: 126
			});
			const growth = createFieldLayout(context, reading.growthVector, fieldWidth, {
				maxLines: 2,
				minHeight: 154
			});
			const action = createAdaptiveBodyFieldLayout(context, reading.suggestedNextAction, fieldWidth, {
				highlight: true,
				maxLines: variant.actionLines,
				minHeight: 174
			});
			const rowOneHeight = Math.max(primary.height, secondary.height);
			const rowThreeHeight = Math.max(growth.height, action.height);
			const totalHeight =
				rowOneHeight +
				CARD_SECTION_GAP +
				core.height +
				CARD_SECTION_GAP +
				challenge.height +
				CARD_SECTION_GAP +
				rowThreeHeight;

			selectedLayout = {
				primary,
				secondary,
				core,
				challenge,
				growth,
				action,
				totalHeight
			};

			if (innerY + totalHeight <= contentBottomLimit) {
				break;
			}
		}

		if (!selectedLayout) {
			throw new Error('Card layout generation failed.');
		}

		const rowOneHeight = Math.max(selectedLayout.primary.height, selectedLayout.secondary.height);
		const rowThreeHeight = Math.max(selectedLayout.growth.height, selectedLayout.action.height);
		const coreY = innerY + rowOneHeight + CARD_SECTION_GAP;
		const challengeY = coreY + selectedLayout.core.height + CARD_SECTION_GAP;
		const bottomRowY = challengeY + selectedLayout.challenge.height + CARD_SECTION_GAP;

		drawField(context, 'Primary Mode', selectedLayout.primary, innerX, innerY, fieldWidth, theme);
		drawField(
			context,
			'Secondary Mode',
			selectedLayout.secondary,
			innerX + fieldWidth + columnGap,
			innerY,
			fieldWidth,
			theme
		);
		drawField(context, 'Core Pattern', selectedLayout.core, innerX, coreY, innerWidth, theme);
		drawField(
			context,
			'Current Challenge',
			selectedLayout.challenge,
			innerX,
			challengeY,
			innerWidth,
			theme
		);
		drawField(context, 'Growth Focus', selectedLayout.growth, innerX, bottomRowY, fieldWidth, theme);
		drawField(
			context,
			'Next Action',
			selectedLayout.action,
			innerX + fieldWidth + columnGap,
			bottomRowY,
			fieldWidth,
			theme
		);

		context.fillStyle = 'rgba(240, 220, 198, 0.72)';
		context.font = '500 20px "IBM Plex Sans", "Avenir Next", sans-serif';
		context.fillText('axzio.ai', innerX, footerTextY);
		context.restore();

		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('PNG export failed.'));
					return;
				}

				resolve(blob);
			}, 'image/png');
		});
	}

	async function createCardImageBlob() {
		if (!identityReading) {
			throw new Error('Identity card is unavailable.');
		}

		if (cachedCardBlob && cachedCardBlobKey === createCardBlobKey(identityReading)) {
			return cachedCardBlob;
		}

		const blob = await renderCardBlob(identityReading);
		cachedCardBlob = blob;
		cachedCardBlobKey = createCardBlobKey(identityReading);
		return blob;
	}

	async function downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const downloadLink = document.createElement('a');

		try {
			downloadLink.href = url;
			downloadLink.download = filename;
			downloadLink.style.display = 'none';
			document.body.append(downloadLink);
			downloadLink.click();

			await new Promise((resolve) => window.setTimeout(resolve, 0));
		} finally {
			downloadLink.remove();
			URL.revokeObjectURL(url);
		}
	}

	async function exportCard() {
		if (isExporting) {
			return;
		}

		shareMessage = '';
		isExporting = true;

		try {
			const blob = await createCardImageBlob();
			await downloadBlob(blob, EXPORT_FILENAME);
		} catch (error) {
			console.error('Failed to export identity card.', error);
		} finally {
			isExporting = false;
		}
	}

	async function shareCard() {
		if (!identityReading || isSharing) {
			return;
		}

		shareMessage = '';

		isSharing = true;

		try {
			const text = createShareText(identityReading);
			let shared = false;

			if (
				typeof navigator !== 'undefined' &&
				typeof navigator.share === 'function' &&
				typeof File !== 'undefined' &&
				typeof navigator.canShare === 'function'
			) {
				const blob = await createCardImageBlob();
				const file = new File([blob], EXPORT_FILENAME, { type: 'image/png' });

				if (navigator.canShare({ files: [file] })) {
					await navigator.share({
						title: SHARE_TITLE,
						text,
						files: [file]
					});
					shared = true;
				}
			}

			if (!shared && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
				await navigator.share({
					title: SHARE_TITLE,
					text
				});
				shared = true;
			}

			if (!shared) {
				if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
					await navigator.clipboard.writeText(text);
					shareMessage = 'Native share is unavailable here. A share-ready summary was copied to your clipboard.';
				} else {
					shareMessage = 'Native share is unavailable here. Use Export Card to save the PNG.';
				}
			}
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				shareMessage = '';
			} else {
				const text = createShareText(identityReading);

				try {
					if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
						await navigator.clipboard.writeText(text);
						shareMessage =
							'Sharing failed in this environment. A share-ready summary was copied to your clipboard.';
					} else {
						shareMessage = 'Sharing failed in this environment. Try Export Card instead.';
					}
				} catch {
					console.error('Failed to share identity card.', error);
					shareMessage = 'Sharing failed in this environment. Try Export Card instead.';
				}
			}
		} finally {
			isSharing = false;
		}
	}
</script>

<main class="shell" style={getSurfaceStyle(identityReading)}>
	<section class="panel">
		{#if identityReading}
			<header class="hero">
				<div class="hero-copy">
					<p class="eyebrow">AXZIO ID</p>
					<h1>{identityReading.archetype}</h1>
					<p class="hero-summary">
						Your reflections point to this identity pattern and the next move it suggests.
					</p>
				</div>

				<div class="hero-signals">
					<div class="hero-band">
						<div class="hero-pill signal-pill">
							<span>Primary Mode</span>
							<strong>{identityReading.primaryMode}</strong>
							<p>{getPrimaryModeExplanation(identityReading.primaryMode)}</p>
						</div>
						<div class="hero-pill">
							<span>Secondary Mode</span>
							<strong>{identityReading.secondaryMode}</strong>
							<p>
								{getSecondaryModeExplanation(
									identityReading.secondaryMode,
									identityReading.primaryMode
								)}
							</p>
						</div>
						<div class="hero-pill signal-pill">
							<span>Growth Focus</span>
							<strong>{identityReading.growthVector}</strong>
							<p>{getGrowthVectorExplanation(identityReading.growthVector)}</p>
						</div>
					</div>
				</div>
			</header>

			<section class="result-layout">
				<section class="section result-section pattern-overview-panel">
					<p class="section-label">Current Identity Pattern</p>
					<div class="pattern-overview-grid">
						<article class="text-block lead-block">
							<h2>Core Pattern</h2>
							<p>{createCorePatternInterpretation(identityReading)}</p>
						</article>

						<article class="text-block why-card">
							<h2>Why this fits</h2>
							<p>{createWhyThisFits(identityReading)}</p>
						</article>
					</div>
				</section>

				<section class="section result-section tension-panel">
					<p class="section-label">Tension</p>
					<article class="text-block contrast-block">
						<h2>Current Challenge</h2>
						<p>{identityReading.currentChallenge}</p>
					</article>
				</section>

				<section class="section result-section direction-panel">
					<p class="section-label">Direction</p>
					<article class="direction-card">
						<h2>Growth Focus</h2>
						<p class="direction-value">{identityReading.growthVector}</p>
						<p class="direction-copy">
							{getGrowthVectorDirectionCopy(identityReading.growthVector)}
						</p>
					</article>
				</section>

				<section class="section result-section action-panel">
					<p class="section-label">Suggested Next Move</p>
					<article class="direction-card action-card">
						<p class="action-copy">{identityReading.suggestedNextAction}</p>
					</article>
				</section>

				<section class="section result-section actions-panel">
					<p class="section-label">Your AXZIO ID</p>
					<p class="supporting-copy share-copy">A snapshot of how you're operating right now.</p>
					<div class="card-actions">
						<button class="cta" type="button" onclick={exportCard} disabled={isExporting}>
							{#if isExporting}
								Exporting...
							{:else}
								Export Card
							{/if}
						</button>

						<button class="secondary-cta" type="button" onclick={shareCard} disabled={isSharing}>
							{#if isSharing}
								Sharing...
							{:else}
								Share Card
							{/if}
						</button>
					</div>

					{#if shareMessage}
						<p class="feedback">{shareMessage}</p>
					{/if}
				</section>

				<section class="section result-section email-panel">
					<p class="section-label">Save this result with your email</p>
					<p class="supporting-copy email-copy">
						For first-group testing, this stores your email with your AXZIO result so the team can follow up and recreate your card later if needed.
					</p>

					<form
						class="email-form"
						onsubmit={(event) => {
							event.preventDefault();
							void saveEmailCapture();
						}}
					>
						<label class="sr-only" for="reading-email">Email address</label>
						<input
							id="reading-email"
							class="email-input"
							type="email"
							name="email"
							placeholder="Enter your email"
							bind:value={emailValue}
							autocomplete="email"
							disabled={isSavingEmail}
						/>
						<button class="secondary-cta email-button" type="submit" disabled={isSavingEmail}>
							{#if isSavingEmail}
								Saving...
							{:else}
								Save Email + Result
							{/if}
						</button>
					</form>

					<p class="form-helper">Used only for AXZIO private testing follow-up.</p>

					{#if emailMessage}
						<p class="feedback">{emailMessage}</p>
					{/if}
				</section>

				<section class="section result-section feedback-panel">
					<p class="section-label">Quick Feedback</p>
					<p class="supporting-copy feedback-copy">Did this feel accurate?</p>

					<fieldset class="feedback-form" disabled={isSavingFeedback}>
						<legend class="sr-only">Did this feel accurate?</legend>

						<div class="feedback-options">
							{#each FEEDBACK_OPTIONS as option}
								<label
									class:selected={feedbackValue === option}
									class="feedback-option"
								>
									<input
										class="sr-only"
										type="radio"
										name="accuracy-feedback"
										value={option}
										checked={feedbackValue === option}
										onchange={() => selectFeedback(option)}
									/>
									<span>{option}</span>
								</label>
							{/each}
						</div>

						<label class="feedback-text-field" for="feedback-text">
							<span>Anything that felt off, confusing, or especially accurate?</span>
							<textarea
								id="feedback-text"
								class="feedback-textarea"
								rows="4"
								placeholder="Optional"
								value={feedbackText}
								oninput={(event) => updateFeedbackText(event.currentTarget.value)}
							></textarea>
						</label>
					</fieldset>

					<button
						class="secondary-cta feedback-submit"
						type="button"
						onclick={saveFeedback}
						disabled={isSavingFeedback || !feedbackValue}
					>
						{#if isSavingFeedback}
							Submitting...
						{:else if feedbackConfirmation && !hasSavedFeedbackChanged()}
							Feedback Submitted
						{:else}
							Submit Feedback
						{/if}
					</button>

					{#if feedbackConfirmation}
						<p class="feedback success">{feedbackConfirmation}</p>
					{/if}

					{#if feedbackMessage}
						<p class="feedback">{feedbackMessage}</p>
					{/if}
				</section>
			</section>
		{:else}
			<header class="hero">
				<p class="eyebrow">AXZIO ID</p>
				<h1>AXZIO ID</h1>
			</header>

			<p class="empty">
				No identity result is available yet. Complete the reflection flow to generate one.
			</p>
		{/if}

		<a class="cta" href="/reading">Start New Reading</a>
	</section>
</main>

<style>
	.shell {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.panel {
		width: min(100%, 58rem);
		display: grid;
		gap: 2rem;
	}

	.hero,
	.section {
		display: grid;
		gap: 1rem;
	}

	.eyebrow,
	.section-label,
	h2 {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(241, 221, 197, 0.68);
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 7vw, 5.4rem);
		line-height: 0.92;
		font-weight: 600;
		letter-spacing: -0.04em;
	}

	.hero {
		position: relative;
		overflow: hidden;
		padding: 2.5rem;
		border-radius: 2.2rem;
		background:
			radial-gradient(circle at top left, var(--accent-glow), transparent 34%),
			radial-gradient(circle at 82% 24%, rgba(238, 145, 89, 0.12), transparent 24%),
			linear-gradient(145deg, rgba(10, 9, 17, 0.96), rgba(24, 18, 30, 0.94));
		color: #f8f3ea;
		border: 1px solid rgba(255, 236, 212, 0.1);
		box-shadow:
			0 32px 80px rgba(0, 0, 0, 0.42),
			inset 0 1px 0 rgba(255, 245, 230, 0.05);
	}

	.hero-copy {
		display: grid;
		gap: 0.5rem;
		max-width: 42rem;
	}

	.hero-summary {
		margin: 0;
		max-width: 34rem;
		line-height: 1.7;
		color: rgba(245, 237, 228, 0.8);
	}

	.hero .eyebrow {
		color: rgba(244, 225, 199, 0.72);
	}

	.hero-band {
		display: grid;
		gap: 0.9rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.hero-signals {
		display: grid;
		gap: 1.25rem;
	}

	.hero-pill {
		display: grid;
		gap: 0.45rem;
		align-content: start;
		padding: 1rem 1.1rem 1.15rem;
		border-radius: 1.25rem;
		background: rgba(255, 249, 241, 0.05);
		border: 1px solid rgba(255, 236, 212, 0.1);
		backdrop-filter: blur(14px);
	}

	.hero-pill span {
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(239, 222, 202, 0.6);
	}

	.hero-pill strong {
		font-size: clamp(1.15rem, 2vw, 1.5rem);
		letter-spacing: -0.03em;
	}

	.hero-pill p {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.55;
		color: rgba(245, 237, 228, 0.78);
	}

	.signal-pill {
		background:
			linear-gradient(180deg, var(--accent-soft), rgba(255, 249, 241, 0.04));
		border-color: color-mix(in srgb, var(--accent) 26%, rgba(255, 236, 212, 0.08));
	}

	.result-layout {
		display: grid;
		gap: 1.35rem;
		width: 100%;
	}

	.result-section {
		width: 100%;
		padding: clamp(1.35rem, 3vw, 1.65rem);
		border-radius: 1.75rem;
		background:
			radial-gradient(circle at top left, var(--surface-glow), transparent 34%),
			linear-gradient(180deg, rgba(15, 13, 22, 0.92), rgba(20, 16, 26, 0.9));
		border: 1px solid rgba(255, 236, 212, 0.08);
		box-shadow:
			0 20px 46px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 244, 227, 0.04);
	}

	.pattern-overview-panel {
		gap: 1.15rem;
	}

	.pattern-overview-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
	}

	.card-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.actions-panel {
		display: grid;
		gap: 0.85rem;
	}

	.share-copy {
		max-width: 30rem;
	}

	.text-block,
	.direction-card,
	.empty {
		padding: 1.35rem;
		border-radius: 1.35rem;
		background: rgba(255, 248, 240, 0.04);
		border: 1px solid rgba(255, 236, 212, 0.08);
	}

	.text-block,
	.direction-card {
		display: grid;
		gap: 0.75rem;
	}

	.direction-card p {
		margin: 0;
	}

	.lead-block {
		padding: 1.55rem;
		background:
			radial-gradient(circle at top left, var(--accent-soft), transparent 42%),
			linear-gradient(145deg, rgba(19, 17, 29, 0.98), rgba(30, 22, 38, 0.94));
		border-color: rgba(255, 236, 212, 0.12);
		box-shadow: inset 0 0 0 1px rgba(255, 247, 235, 0.03);
	}

	.why-card {
		padding: 1.45rem;
		background:
			linear-gradient(145deg, rgba(20, 17, 28, 0.96), rgba(16, 14, 23, 0.92));
	}

	.contrast-block {
		padding: 1.45rem 1.4rem;
		background:
			linear-gradient(145deg, rgba(22, 16, 25, 0.96), rgba(20, 17, 30, 0.92));
	}

	.direction-panel .direction-card {
		padding: 1.35rem;
	}

	.direction-value {
		margin: 0;
		font-size: clamp(1.4rem, 3vw, 2.15rem);
		line-height: 1.15;
		font-weight: 500;
		letter-spacing: -0.03em;
	}

	.direction-copy {
		margin: 0;
		line-height: 1.65;
		color: rgba(245, 237, 228, 0.78);
	}

	.action-card {
		padding: 1.45rem;
		background:
			radial-gradient(circle at top left, var(--accent-glow), transparent 36%),
			linear-gradient(145deg, rgba(15, 13, 23, 0.98), rgba(31, 21, 29, 0.94));
		border-color: color-mix(in srgb, var(--accent) 22%, rgba(255, 236, 212, 0.08));
		box-shadow:
			0 18px 40px rgba(0, 0, 0, 0.24),
			inset 0 1px 0 rgba(255, 244, 227, 0.05);
	}

	.action-card p {
		color: #f5eee3;
	}

	.action-copy {
		margin: 0;
		font-size: clamp(1.15rem, 2vw, 1.45rem);
		line-height: 1.7;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: #f5eee3;
	}

	.supporting-copy {
		margin: 0;
		max-width: 46rem;
		line-height: 1.72;
		color: rgba(245, 237, 228, 0.8);
	}

	.email-copy {
		max-width: 34rem;
	}

	.feedback-copy {
		max-width: 26rem;
	}

	.email-form {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
	}

	.form-helper {
		margin: -0.1rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: rgba(240, 220, 198, 0.58);
	}

	.feedback-form {
		margin: 0;
		padding: 0;
		border: 0;
		display: grid;
		gap: 1rem;
	}

	.feedback-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.feedback-text-field {
		display: grid;
		gap: 0.7rem;
	}

	.feedback-text-field span {
		font-size: 0.95rem;
		line-height: 1.55;
		color: rgba(245, 237, 228, 0.8);
	}

	.feedback-option {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem 1.15rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 236, 212, 0.12);
		background: rgba(255, 248, 240, 0.05);
		color: #f7efe5;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 140ms ease,
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.feedback-option.selected {
		background:
			linear-gradient(180deg, var(--accent-soft), rgba(255, 248, 240, 0.08));
		border-color: color-mix(in srgb, var(--accent) 28%, rgba(255, 236, 212, 0.14));
	}

	.feedback-option:focus-within {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.feedback-option:hover {
		transform: translateY(-1px);
		border-color: rgba(255, 236, 212, 0.22);
		background: rgba(255, 248, 240, 0.08);
	}

	.feedback-textarea,
	.email-input {
		min-width: 0;
		padding: 0.95rem 1rem;
		border: 1px solid rgba(255, 236, 212, 0.12);
		background: rgba(255, 248, 240, 0.05);
		color: #f7efe5;
		font: inherit;
	}

	.email-input {
		border-radius: 999px;
	}

	.feedback-textarea {
		border-radius: 1rem;
		resize: vertical;
		line-height: 1.6;
	}

	.feedback-textarea::placeholder,
	.email-input::placeholder {
		color: rgba(240, 220, 198, 0.46);
	}

	.feedback-textarea:focus-visible,
	.email-input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.feedback-textarea:disabled,
	.email-input:disabled {
		opacity: 0.72;
		cursor: progress;
	}

	.email-button {
		white-space: nowrap;
	}

	.feedback-submit {
		margin-top: 0.1rem;
	}

	.text-block p,
	.empty {
		margin: 0;
		line-height: 1.7;
		color: rgba(245, 237, 228, 0.88);
	}

	.pattern-overview-panel .lead-block p {
		font-size: clamp(1.08rem, 1.5vw, 1.22rem);
		line-height: 1.82;
		max-width: 48rem;
	}

	.tension-panel .contrast-block p {
		color: rgba(244, 226, 210, 0.82);
	}

	.feedback {
		margin: -0.25rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(240, 220, 198, 0.72);
	}

	.feedback.success {
		color: rgba(226, 242, 220, 0.82);
	}

	.cta,
	.secondary-cta {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.95rem 1.4rem;
		border-radius: 999px;
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		transition:
			transform 140ms ease,
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.cta {
		border: 0;
		background:
			linear-gradient(
				135deg,
				var(--app-accent),
				color-mix(in srgb, var(--app-accent) 60%, var(--app-accent-strong) 40%)
			);
		color: #140f11;
		text-decoration: none;
		box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
		cursor: pointer;
	}

	.secondary-cta {
		border: 1px solid rgba(255, 236, 212, 0.12);
		background: rgba(255, 248, 240, 0.05);
		color: #f7efe5;
		cursor: pointer;
	}

	.cta:hover,
	.cta:focus-visible {
		transform: translateY(-1px);
		filter: brightness(1.03);
	}

	.cta:focus-visible {
		outline: 2px solid var(--app-accent);
		outline-offset: 4px;
	}

	.secondary-cta:hover,
	.secondary-cta:focus-visible {
		background: rgba(255, 248, 240, 0.08);
		border-color: rgba(255, 236, 212, 0.22);
		transform: translateY(-1px);
	}

	.secondary-cta:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.secondary-cta:disabled {
		cursor: progress;
		opacity: 0.72;
		transform: none;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 760px) {
		.hero-band,
		.result-layout,
		.pattern-overview-grid,
		.email-form {
			grid-template-columns: 1fr;
		}

		.result-layout {
			gap: 1.25rem;
		}

		.feedback-options {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.shell {
			padding: 1.5rem;
		}

		.panel {
			gap: 1.5rem;
		}

		.hero,
		.result-section {
			padding: 1.25rem;
			border-radius: 1.4rem;
		}

		.card-actions {
			display: grid;
		}

		.feedback-options {
			grid-template-columns: 1fr;
		}

		.cta,
		.email-button,
		.secondary-cta {
			width: 100%;
			justify-self: stretch;
		}
	}
</style>
