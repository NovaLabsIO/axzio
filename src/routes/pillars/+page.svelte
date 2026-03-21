<svelte:head>
	<title>AXZIO | 4 Pillars</title>
	<meta
		name="description"
		content="Compare your current and target balance across Body, Mind, Heart, and Spirit."
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PILLARS_FEEDBACK_OPTIONS,
		createDefaultPillarsFeedback,
		hasFeedbackContent,
		loadPillarsFeedback,
		savePillarsFeedback,
		type PillarsFeedback,
		type PillarsFeedbackSentiment
	} from '$lib/pillars/feedback';
	import { buildPillarsGuidance, type PillarsGuidance } from '$lib/pillars/guidance';
	import {
		RAW_MAX,
		RAW_MIN,
		denormalizeScores,
		getTargetScoresForMode,
		normalizeRawValues
	} from '$lib/pillars/normalize';
	import {
		createDefaultPillarsDraft,
		loadPillarsDraft,
		savePillarsDraft
	} from '$lib/pillars/storage';
	import {
		PILLARS,
		PILLAR_LABELS,
		TARGET_MODES,
		TARGET_MODE_LABELS,
		TIMEFRAMES,
		TIMEFRAME_LABELS,
		type Pillar,
		type PillarsDraft,
		type TargetMode,
		type Timeframe
	} from '$lib/pillars/types';

	type EditingView = 'current' | 'target';

	const timeframeNotice =
		'Today is the default. The longer timeframes are available now for planning, but deeper review-session logic can come later.';

	let draft: PillarsDraft = createDefaultPillarsDraft('today');
	let editingView: EditingView = 'current';
	let guidance: PillarsGuidance | null = null;
	let feedback: PillarsFeedback = createDefaultPillarsFeedback();
	let feedbackMessage = '';
	let feedbackError = '';
	let hasHydrated = false;

	onMount(() => {
		draft = loadPillarsDraft('today') ?? createDefaultPillarsDraft('today');
		feedback = loadPillarsFeedback() ?? createDefaultPillarsFeedback();
		hasHydrated = true;
	});

	$: if (hasHydrated) {
		savePillarsDraft(draft);
	}

	$: activeRawValues = editingView === 'current' ? draft.currentRaw : draft.targetRaw;
	$: targetEditingNote =
		editingView === 'target' && draft.targetMode !== 'custom'
			? `${TARGET_MODE_LABELS[draft.targetMode]} sets target values automatically. Move a slider to switch to Set Custom.`
			: 'Target sliders are editable here. Changes are stored locally on this device.';
	$: timeframeHint =
		draft.timeframe === 'today'
			? 'Guidance is calibrated for today-level reflection in this first build.'
			: `This build still uses the same core guidance logic for ${TIMEFRAME_LABELS[draft.timeframe].toLowerCase()}.`;

	function stampDraft(nextDraft: PillarsDraft) {
		draft = {
			...nextDraft,
			updatedAt: new Date().toISOString()
		};
	}

	function clearGuidance() {
		guidance = null;
	}

	function selectFeedbackSentiment(sentiment: PillarsFeedbackSentiment) {
		feedback = {
			...feedback,
			sentiment
		};
		feedbackError = '';
		feedbackMessage = '';
	}

	function updateFeedbackNotes(notes: string) {
		feedback = {
			...feedback,
			notes
		};
		feedbackError = '';
		feedbackMessage = '';
	}

	function updateFeedbackEmail(email: string) {
		feedback = {
			...feedback,
			email
		};
		feedbackError = '';
		feedbackMessage = '';
	}

	function submitFeedback() {
		if (!hasFeedbackContent(feedback)) {
			feedbackError = 'Add a quick rating, note, or follow-up email before submitting.';
			feedbackMessage = '';
			return;
		}

		const submittedFeedback: PillarsFeedback = {
			sentiment: feedback.sentiment,
			notes: feedback.notes.trim(),
			email: feedback.email.trim(),
			submittedAt: new Date().toISOString()
		};

		savePillarsFeedback(submittedFeedback);
		feedback = submittedFeedback;
		feedbackError = '';
		feedbackMessage = 'Feedback saved locally on this device for tester follow-up.';
	}

	function setTimeframe(timeframe: Timeframe) {
		draft = loadPillarsDraft(timeframe) ?? createDefaultPillarsDraft(timeframe);
		clearGuidance();
	}

	function setEditingView(view: EditingView) {
		editingView = view;
	}

	function applyTargetMode(targetMode: TargetMode) {
		if (targetMode === 'custom') {
			stampDraft({
				...draft,
				targetMode
			});
			clearGuidance();
			return;
		}

		const targetScore = getTargetScoresForMode(draft.currentScore, targetMode);

		stampDraft({
			...draft,
			targetMode,
			targetScore,
			targetRaw: denormalizeScores(targetScore)
		});
		clearGuidance();
	}

	function updateSlider(pillar: Pillar, rawValue: string) {
		const nextValue = Number(rawValue);

		if (editingView === 'current') {
			const currentRaw = {
				...draft.currentRaw,
				[pillar]: nextValue
			};
			const currentScore = normalizeRawValues(currentRaw);

			if (draft.targetMode === 'custom') {
				stampDraft({
					...draft,
					currentRaw,
					currentScore
				});
			} else {
				const targetScore = getTargetScoresForMode(currentScore, draft.targetMode);

				stampDraft({
					...draft,
					currentRaw,
					currentScore,
					targetScore,
					targetRaw: denormalizeScores(targetScore)
				});
			}
		} else {
			const targetRaw = {
				...draft.targetRaw,
				[pillar]: nextValue
			};
			const targetScore = normalizeRawValues(targetRaw);

			stampDraft({
				...draft,
				targetMode: 'custom',
				targetRaw,
				targetScore
			});
		}

		clearGuidance();
	}

	function generateGuidance() {
		guidance = buildPillarsGuidance(draft);
	}

	function getBarWidth(score: number) {
		return `${score * 10}%`;
	}
</script>

<main class="shell">
	<section class="panel">
		<div class="hero">
			<p class="eyebrow">AXZIO</p>
			<h1>4 Pillars</h1>
			<p class="intro">
				Compare your current and target balance across Body, Mind, Heart, and Spirit. This module
				stays separate from the current AXZIO identity reading flow and stores its draft locally on
				this device.
			</p>
		</div>

		<section class="section-block">
			<div class="section-header">
				<div>
					<p class="section-label">Timeframe</p>
					<h2>Choose your review window</h2>
				</div>
				<p class="section-copy">{timeframeNotice}</p>
			</div>
			<div class="chip-row" role="tablist" aria-label="Timeframe">
				{#each TIMEFRAMES as timeframe}
					<button
						type="button"
						class:chip-active={draft.timeframe === timeframe}
						class="chip"
						onclick={() => setTimeframe(timeframe)}
					>
						{TIMEFRAME_LABELS[timeframe]}
					</button>
				{/each}
			</div>
			<p class="helper-text">{timeframeHint}</p>
		</section>

		<section class="grid-section">
			<div class="surface">
				<div class="section-header compact">
					<div>
						<p class="section-label">Editing</p>
						<h2>Current and target values</h2>
					</div>
					<p class="section-copy">
						Switch between current and target editing in the same view. Raw slider values are stored
						for fidelity while normalized scores power the guidance.
					</p>
				</div>

				<div class="segment-row" role="tablist" aria-label="Balance editor">
					<button
						type="button"
						class:segment-active={editingView === 'current'}
						class="segment"
						onclick={() => setEditingView('current')}
					>
						Current Balance
					</button>
					<button
						type="button"
						class:segment-active={editingView === 'target'}
						class="segment"
						onclick={() => setEditingView('target')}
					>
						Target Balance
					</button>
				</div>

				{#if editingView === 'target'}
					<div class="target-mode-card">
						<div class="section-header compact">
							<div>
								<p class="section-label">Target Mode</p>
								<h2>{TARGET_MODE_LABELS[draft.targetMode]}</h2>
							</div>
							<p class="section-copy">
								Restore evens things out, Maintain stays close, Set Custom unlocks direct target editing,
								and Growth leans more aspirational.
							</p>
						</div>
						<div class="target-mode-grid">
							{#each TARGET_MODES as mode}
								<button
									type="button"
									class:mode-active={draft.targetMode === mode}
									class="mode-button"
									onclick={() => applyTargetMode(mode)}
								>
									{TARGET_MODE_LABELS[mode]}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<p class="helper-text">{editingView === 'current' ? 'Current sliders set your present baseline.' : targetEditingNote}</p>

				<div class="slider-list">
					{#each PILLARS as pillar}
						<label class="slider-card" for={`pillar-${pillar}`}>
							<div class="slider-head">
								<div>
									<p class="slider-label">{PILLAR_LABELS[pillar]}</p>
									<p class="slider-meta">
										Raw {activeRawValues[pillar]} · Score {editingView === 'current' ? draft.currentScore[pillar] : draft.targetScore[pillar]}
									</p>
								</div>
								<span class="slider-score">
									{editingView === 'current' ? draft.currentScore[pillar] : draft.targetScore[pillar]}/10
								</span>
							</div>
							<input
								id={`pillar-${pillar}`}
								type="range"
								min={RAW_MIN}
								max={RAW_MAX}
								step="1"
								value={activeRawValues[pillar]}
								oninput={(event) => updateSlider(pillar, event.currentTarget.value)}
							/>
						</label>
					{/each}
				</div>
			</div>

			<div class="surface">
				<div class="section-header compact">
					<div>
						<p class="section-label">Comparison</p>
						<h2>Current vs target</h2>
					</div>
					<p class="section-copy">
						A simple 1 to 10 comparison makes the gap between your current and target balance easy to
						see at a glance.
					</p>
				</div>

				<div class="legend">
					<span><i class="legend-swatch current"></i>Current</span>
					<span><i class="legend-swatch target"></i>Target</span>
				</div>

				<div class="comparison-list">
					{#each PILLARS as pillar}
						<div class="comparison-card">
							<div class="comparison-head">
								<p>{PILLAR_LABELS[pillar]}</p>
								<p>{draft.currentScore[pillar]} / {draft.targetScore[pillar]}</p>
							</div>
							<div class="bar-group">
								<div class="bar-row">
									<span class="bar-label">Current</span>
									<div class="bar-track">
										<div class="bar-fill current" style={`width:${getBarWidth(draft.currentScore[pillar])};`}></div>
									</div>
								</div>
								<div class="bar-row">
									<span class="bar-label">Target</span>
									<div class="bar-track">
										<div class="bar-fill target" style={`width:${getBarWidth(draft.targetScore[pillar])};`}></div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="section-block">
			<div class="section-header">
				<div>
					<p class="section-label">Guidance</p>
					<h2>Generate a next step</h2>
				</div>
				<p class="section-copy">
					This first build uses deterministic guidance only. It compares normalized scores and
					recommends the pillar that deserves attention next.
				</p>
			</div>

			<button class="primary-action" type="button" onclick={generateGuidance}>
				Generate Guidance
			</button>

			{#if guidance}
				<div class="guidance-grid">
					<div class="guidance-card">
						<p class="section-label">Summary</p>
						<p class="guidance-copy">{guidance.summary}</p>
					</div>
					<div class="guidance-card">
						<p class="section-label">Focus Pillar</p>
						<p class="guidance-highlight">{PILLAR_LABELS[guidance.focusPillar]}</p>
					</div>
					<div class="guidance-card">
						<p class="section-label">Next Best Action</p>
						<p class="guidance-copy">{guidance.nextAction}</p>
					</div>
				</div>
			{/if}
		</section>

		<section class="section-block feedback-section">
			<div class="section-header compact">
				<div>
					<p class="section-label">Tester Feedback</p>
					<h2>Optional quick feedback</h2>
				</div>
				<p class="section-copy">
					This is only for tester input in this first shareable build. It stays local to this device
					and is not sent anywhere yet.
				</p>
			</div>

			<div class="feedback-stack">
				<div class="feedback-group">
					<p class="field-label">Quick feedback</p>
					<div class="chip-row">
						{#each PILLARS_FEEDBACK_OPTIONS as option}
							<button
								type="button"
								class:chip-active={feedback.sentiment === option}
								class="chip"
								onclick={() => selectFeedbackSentiment(option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>

				<label class="feedback-group" for="pillars-feedback-notes">
					<span class="field-label">What felt unclear, missing, or most useful?</span>
					<textarea
						id="pillars-feedback-notes"
						rows="4"
						value={feedback.notes}
						oninput={(event) => updateFeedbackNotes(event.currentTarget.value)}
						placeholder="Optional note for testing feedback."
					></textarea>
				</label>

				<label class="feedback-group" for="pillars-feedback-email">
					<span class="field-label">Optional email for follow-up</span>
					<input
						id="pillars-feedback-email"
						type="email"
						value={feedback.email}
						oninput={(event) => updateFeedbackEmail(event.currentTarget.value)}
						placeholder="name@example.com"
					/>
				</label>

				{#if feedbackError}
					<p class="feedback-alert error" role="alert">{feedbackError}</p>
				{/if}

				{#if feedbackMessage}
					<p class="feedback-alert success" role="status">{feedbackMessage}</p>
				{/if}

				<button class="secondary-action" type="button" onclick={submitFeedback}>
					Submit Feedback
				</button>
			</div>
		</section>
	</section>
</main>

<style>
	.shell {
		min-height: 100vh;
		padding: clamp(1.2rem, 4vw, 2rem);
	}

	.panel {
		width: min(100%, 72rem);
		margin: 0 auto;
		display: grid;
		gap: 1.4rem;
		padding: clamp(1.2rem, 3vw, 1.8rem);
		border-radius: 2rem;
		background:
			radial-gradient(circle at top left, rgba(181, 156, 255, 0.12), transparent 32%),
			radial-gradient(circle at 86% 16%, rgba(241, 146, 88, 0.12), transparent 22%),
			linear-gradient(145deg, rgba(12, 11, 19, 0.96), rgba(20, 16, 28, 0.92));
		border: 1px solid rgba(255, 236, 212, 0.1);
		box-shadow:
			0 32px 80px rgba(0, 0, 0, 0.34),
			inset 0 1px 0 rgba(255, 244, 227, 0.04);
	}

	.hero,
	.surface,
	.section-block {
		border-radius: 1.4rem;
		border: 1px solid rgba(255, 236, 212, 0.08);
		background: rgba(255, 248, 240, 0.03);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.hero,
	.surface,
	.section-block {
		padding: clamp(1rem, 3vw, 1.35rem);
	}

	.hero {
		display: grid;
		gap: 0.85rem;
	}

	.eyebrow,
	.section-label,
	.slider-label,
	.bar-label {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--app-text-soft);
	}

	h1,
	h2 {
		margin: 0;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	h1 {
		font-size: clamp(2.5rem, 7vw, 4.6rem);
		line-height: 0.95;
	}

	h2 {
		font-size: clamp(1.5rem, 4vw, 2rem);
		line-height: 1.02;
	}

	.intro,
	.section-copy,
	.helper-text,
	.slider-meta,
	.guidance-copy,
	.comparison-head p:last-child,
	.field-label {
		margin: 0;
		color: var(--app-text-muted);
		line-height: 1.65;
	}

	.grid-section {
		display: grid;
		gap: 1.4rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.section-header {
		display: grid;
		gap: 0.7rem;
		margin-bottom: 1rem;
	}

	.section-header.compact {
		margin-bottom: 0.85rem;
	}

	.chip-row,
	.segment-row,
	.target-mode-grid,
	.feedback-stack {
		display: flex;
	}

	.chip-row,
	.segment-row,
	.target-mode-grid {
		flex-wrap: wrap;
		gap: 0.65rem;
	}

	.feedback-stack {
		flex-direction: column;
		gap: 0.9rem;
	}

	.chip,
	.segment,
	.mode-button {
		border: 1px solid rgba(255, 236, 212, 0.12);
		border-radius: 999px;
		background: rgba(255, 250, 242, 0.04);
		color: var(--app-text-muted);
		cursor: pointer;
		font: inherit;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			background-color 140ms ease,
			color 140ms ease;
	}

	.chip,
	.segment {
		padding: 0.7rem 1rem;
	}

	.mode-button {
		padding: 0.8rem 1rem;
		text-align: left;
		flex: 1 1 14rem;
	}

	.chip:hover,
	.segment:hover,
	.mode-button:hover,
	.chip:focus-visible,
	.segment:focus-visible,
	.mode-button:focus-visible,
	.chip-active,
	.segment-active,
	.mode-active {
		border-color: rgba(255, 212, 165, 0.34);
		background: rgba(255, 245, 230, 0.08);
		color: var(--app-text);
		transform: translateY(-1px);
	}

	.target-mode-card {
		display: grid;
		gap: 0.85rem;
		margin: 1rem 0 0.85rem;
		padding: 1rem;
		border-radius: 1.1rem;
		background:
			radial-gradient(circle at top left, rgba(181, 156, 255, 0.1), transparent 42%),
			linear-gradient(160deg, rgba(18, 15, 27, 0.82), rgba(24, 20, 33, 0.9));
		border: 1px solid rgba(255, 236, 212, 0.08);
	}

	.slider-list,
	.comparison-list,
	.guidance-grid {
		display: grid;
		gap: 0.85rem;
	}

	.slider-card,
	.comparison-card,
	.guidance-card {
		display: grid;
		gap: 0.7rem;
		padding: 0.95rem;
		border-radius: 1rem;
		background: rgba(255, 248, 240, 0.04);
		border: 1px solid rgba(255, 236, 212, 0.08);
	}

	.slider-head,
	.comparison-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.slider-score,
	.guidance-highlight {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: #f5eee3;
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--app-accent);
		cursor: pointer;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 0.85rem;
		color: var(--app-text-soft);
		font-size: 0.9rem;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.legend-swatch {
		display: inline-block;
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 999px;
	}

	.legend-swatch.current,
	.bar-fill.current {
		background: linear-gradient(135deg, rgba(244, 184, 143, 0.96), rgba(241, 146, 88, 0.92));
	}

	.legend-swatch.target,
	.bar-fill.target {
		background: linear-gradient(135deg, rgba(181, 156, 255, 0.94), rgba(117, 142, 221, 0.88));
	}

	.bar-group {
		display: grid;
		gap: 0.55rem;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 3.8rem 1fr;
		align-items: center;
		gap: 0.7rem;
	}

	.bar-track {
		height: 0.7rem;
		border-radius: 999px;
		background: rgba(255, 248, 240, 0.06);
		border: 1px solid rgba(255, 236, 212, 0.08);
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
		box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);
	}

	.primary-action {
		width: fit-content;
		border: 0;
		border-radius: 999px;
		padding: 0.95rem 1.35rem;
		background:
			linear-gradient(
				135deg,
				var(--app-accent),
				color-mix(in srgb, var(--app-accent) 60%, var(--app-accent-strong) 40%)
			);
		color: #140f11;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 140ms ease,
			filter 140ms ease;
		box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
	}

	.secondary-action {
		width: fit-content;
		border: 1px solid rgba(255, 236, 212, 0.14);
		border-radius: 999px;
		padding: 0.9rem 1.25rem;
		background: rgba(255, 248, 240, 0.05);
		color: var(--app-text);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			background-color 140ms ease;
	}

	.secondary-action:hover,
	.secondary-action:focus-visible {
		transform: translateY(-1px);
		border-color: rgba(255, 212, 165, 0.28);
		background: rgba(255, 248, 240, 0.08);
	}

	.feedback-group {
		display: grid;
		gap: 0.55rem;
	}

	.feedback-section {
		background:
			radial-gradient(circle at top left, rgba(181, 156, 255, 0.08), transparent 42%),
			rgba(255, 248, 240, 0.03);
	}

	textarea,
	input[type='email'] {
		width: 100%;
		padding: 0.9rem 1rem;
		border: 1px solid rgba(255, 236, 212, 0.12);
		border-radius: 1rem;
		background:
			linear-gradient(180deg, rgba(255, 248, 240, 0.06), rgba(255, 248, 240, 0.04));
		color: #f7efe5;
		line-height: 1.6;
	}

	textarea {
		resize: vertical;
		min-height: 6.5rem;
	}

	textarea::placeholder,
	input[type='email']::placeholder {
		color: rgba(240, 220, 198, 0.46);
	}

	.feedback-alert {
		margin: 0;
		padding: 0.8rem 0.95rem;
		border-radius: 0.95rem;
		line-height: 1.5;
	}

	.feedback-alert.error {
		background: rgba(164, 60, 60, 0.16);
		border: 1px solid rgba(255, 178, 164, 0.16);
		color: #ffd4cb;
	}

	.feedback-alert.success {
		background: rgba(78, 117, 89, 0.16);
		border: 1px solid rgba(150, 210, 165, 0.16);
		color: #d7f3dd;
	}

	.primary-action:hover,
	.primary-action:focus-visible {
		transform: translateY(-1px);
		filter: brightness(1.03);
	}

	button:focus-visible,
	input:focus-visible {
		outline: 2px solid rgba(255, 212, 165, 0.52);
		outline-offset: 3px;
	}

	@media (max-width: 820px) {
		.grid-section {
			grid-template-columns: 1fr;
		}

		.primary-action {
			width: 100%;
			justify-self: stretch;
		}

		.secondary-action {
			width: 100%;
		}
	}
</style>
