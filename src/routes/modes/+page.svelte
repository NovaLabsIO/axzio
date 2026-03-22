<svelte:head>
	<title>AXZIO | Modes</title>
	<meta
		name="description"
		content="Reflect on how you are operating right now across People, Pleasure, Production, and Reflection."
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { MODES } from '$lib/config/modes';
	import { MODES_QUESTIONS } from '$lib/modes/questions';
	import { buildModesSummary } from '$lib/modes/summary';
	import {
		createDefaultModesDraft,
		loadModesDraft,
		saveModesDraft,
		synchronizeModesDraft
	} from '$lib/modes/storage';
	import type { ModesQuestionOption } from '$lib/modes/types';
	import { MODULE_ID, type ModesDraft, type ModesResult } from '$lib/modes/types';

	const moduleHelpCopy =
		'Modes shows which operating pattern is carrying the most weight right now, which one is supporting it, and which one may need more attention.';

	let draft: ModesDraft = createDefaultModesDraft();
	let hasHydrated = false;
	let isContextOpen = false;

	onMount(() => {
		draft = loadModesDraft() ?? createDefaultModesDraft();
		hasHydrated = true;
	});

	$: if (hasHydrated) {
		saveModesDraft(draft);
	}

	$: summaryOutput = buildModesSummary(draft);
	$: currentQuestion = MODES_QUESTIONS[draft.currentQuestionIndex];
	$: progressCount = draft.answers.length;
	$: progressPercent =
		MODES_QUESTIONS.length === 0 ? 0 : Math.round((progressCount / MODES_QUESTIONS.length) * 100);

	function stampDraft(nextDraft: ModesDraft) {
		draft = synchronizeModesDraft({
			...nextDraft,
			updatedAt: new Date().toISOString()
		});
	}

	function startAssessment() {
		stampDraft({
			...draft,
			viewState: 'assessment',
			currentQuestionIndex:
				draft.answers.length > 0
					? Math.min(draft.answers.length, MODES_QUESTIONS.length - 1)
					: 0
		});
	}

	function restartAssessment() {
		const freshDraft = createDefaultModesDraft();
		stampDraft({
			...freshDraft,
			viewState: 'assessment'
		});
	}

	function continueAssessment() {
		stampDraft({
			...draft,
			viewState: 'assessment',
			currentQuestionIndex: Math.min(draft.answers.length, MODES_QUESTIONS.length - 1)
		});
	}

	function selectOption(option: ModesQuestionOption) {
		if (!currentQuestion) {
			return;
		}

		const nextAnswers = [...draft.answers];
		nextAnswers[draft.currentQuestionIndex] = {
			questionId: currentQuestion.id,
			optionId: option.id,
			mode: option.mode
		};

		const isLastQuestion = draft.currentQuestionIndex >= MODES_QUESTIONS.length - 1;

		stampDraft({
			...draft,
			answers: nextAnswers,
			currentQuestionIndex: isLastQuestion
				? draft.currentQuestionIndex
				: Math.min(draft.currentQuestionIndex + 1, MODES_QUESTIONS.length - 1),
			viewState: isLastQuestion ? 'result' : 'assessment'
		});
	}

	function goBack() {
		if (draft.currentQuestionIndex <= 0) {
			stampDraft({
				...draft,
				viewState: 'intro',
				currentQuestionIndex: 0
			});
			return;
		}

		stampDraft({
			...draft,
			currentQuestionIndex: draft.currentQuestionIndex - 1
		});
	}

	function reviewResults() {
		stampDraft({
			...draft,
			viewState: 'result'
		});
	}

	function getSelectedOptionId(questionIndex: number) {
		return draft.answers[questionIndex]?.optionId ?? '';
	}

	function getModeDescription(mode: string) {
		return MODES.find((entry) => entry.value === mode)?.description ?? '';
	}

	function getModeBarWidth(result: ModesResult, mode: string) {
		const highestScore = Math.max(...Object.values(result.scoreMap), 1);
		return `${(result.scoreMap[mode as keyof typeof result.scoreMap] / highestScore) * 100}%`;
	}
</script>

<main class="shell">
	<section class="panel">
		<div class="hero">
			<p class="eyebrow">AXZIO</p>
			<h1>Modes</h1>
			<p class="intro">
				Understand which operating mode is leading right now, which pattern is supporting it, and
				what may be getting underused.
			</p>
		</div>

		<section class="section-block context-section">
			<div class="context-header">
				<div>
					<p class="section-label">Mode Context</p>
					<h2>Read yourself from a consistent frame</h2>
				</div>
				<button
					type="button"
					class:context-trigger-open={isContextOpen}
					class="context-trigger"
					aria-expanded={isContextOpen}
					aria-controls="modes-context-panel"
					onclick={() => (isContextOpen = !isContextOpen)}
				>
					What do these mean?
				</button>
			</div>

			{#if isContextOpen}
				<div class="context-grid" id="modes-context-panel">
					{#each MODES as mode}
						<div class="context-card">
							<p class="context-name">{mode.label}</p>
							<p class="context-copy">{mode.description}</p>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		{#if draft.viewState === 'intro'}
			<section class="section-block intro-grid">
				<div class="surface">
					<div class="section-header compact">
						<div>
							<p class="section-label">Framing</p>
							<h2>See how you are operating</h2>
						</div>
						<p class="section-copy">{moduleHelpCopy}</p>
					</div>
					<div class="context-grid compact-grid">
						{#each MODES as mode}
							<div class="context-card">
								<p class="context-name">{mode.label}</p>
								<p class="context-copy">{mode.description}</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="surface">
					<div class="section-header compact">
						<div>
							<p class="section-label">Assessment</p>
							<h2>One decision at a time</h2>
						</div>
						<p class="section-copy">
							This check is short and deterministic. It reads your selected patterns locally and returns
							a structured result state without calling AI or a backend.
						</p>
					</div>

					<div class="metric-row">
						<div class="metric-card">
							<p class="section-label">Questions</p>
							<p class="metric-value">{MODES_QUESTIONS.length}</p>
						</div>
						<div class="metric-card">
							<p class="section-label">Saved Progress</p>
							<p class="metric-value">{progressCount}/{MODES_QUESTIONS.length}</p>
						</div>
					</div>

					<div class="action-stack">
						<button class="primary-action" type="button" onclick={startAssessment}>
							{progressCount > 0 ? 'Continue Modes Check' : 'Start Modes Check'}
						</button>

						{#if progressCount > 0}
							<button class="secondary-action" type="button" onclick={restartAssessment}>
								Start Fresh
							</button>
						{/if}
					</div>
				</div>
			</section>
		{:else if draft.viewState === 'assessment'}
			<section class="grid-section">
				<div class="surface">
					<div class="section-header compact">
						<div>
							<p class="section-label">Assessment</p>
							<h2>Question {draft.currentQuestionIndex + 1} of {MODES_QUESTIONS.length}</h2>
						</div>
						<p class="section-copy">
							Choose the option that feels most true right now. The goal is an honest operating signal,
							not an idealized answer.
						</p>
					</div>

					<div class="progress-track" aria-hidden="true">
						<div class="progress-fill" style={`width:${progressPercent}%;`}></div>
					</div>
					<p class="helper-text">{progressCount} responses saved locally on this device.</p>

					<div class="question-card">
						<p class="question-text">{currentQuestion.prompt}</p>
						<div class="option-list">
							{#each currentQuestion.options as option}
								<button
									type="button"
									class:option-active={getSelectedOptionId(draft.currentQuestionIndex) === option.id}
									class="option-button"
									onclick={() => selectOption(option)}
								>
									<span class="option-label">{option.label}</span>
									<span class="option-copy">{option.description}</span>
								</button>
							{/each}
						</div>
					</div>

					<div class="action-row">
						<button class="secondary-action" type="button" onclick={goBack}>
							{draft.currentQuestionIndex === 0 ? 'Back to Intro' : 'Previous'}
						</button>

						{#if draft.answers.length === MODES_QUESTIONS.length}
							<button class="primary-action" type="button" onclick={reviewResults}>
								View Result
							</button>
						{/if}
					</div>
				</div>

				<div class="surface">
					<div class="section-header compact">
						<div>
							<p class="section-label">Progress</p>
							<h2>Current signal</h2>
						</div>
						<p class="section-copy">
							This stays lightweight in Pass A. The result resolves after the full assessment, but your
							progress is already being stored locally.
						</p>
					</div>

					<div class="summary-card">
						<p class="section-label">Module</p>
						<p class="metric-value">Modes</p>
						<p class="helper-text">
							{summaryOutput.statusLabel} · {summaryOutput.primaryValue}
						</p>
					</div>
				</div>
			</section>
		{:else if draft.result}
			<section class="grid-section">
				<div class="surface">
					<div class="section-header compact">
						<div>
							<p class="section-label">Result</p>
							<h2>{draft.result.primaryMode} is leading right now</h2>
						</div>
						<p class="section-copy">
							{draft.recommendation?.summary}
						</p>
					</div>

					<div class="result-grid">
						<div class="result-card">
							<p class="section-label">Primary Mode</p>
							<p class="metric-value">{draft.result.primaryMode}</p>
							<p class="helper-text">{getModeDescription(draft.result.primaryMode)}</p>
						</div>
						<div class="result-card">
							<p class="section-label">Secondary Mode</p>
							<p class="metric-value">{draft.result.secondaryMode}</p>
							<p class="helper-text">{getModeDescription(draft.result.secondaryMode)}</p>
						</div>
						<div class="result-card">
							<p class="section-label">Strongest Dominance</p>
							<p class="metric-value">{draft.result.overusedMode ?? 'Blended'}</p>
							<p class="helper-text">
								{draft.result.overusedMode
									? `${draft.result.overusedMode} is materially ahead of the rest of the score map.`
									: 'No single mode is overly dominant in this result.'}
							</p>
						</div>
						<div class="result-card">
							<p class="section-label">Underused Mode</p>
							<p class="metric-value">{draft.result.underusedMode}</p>
							<p class="helper-text">{getModeDescription(draft.result.underusedMode)}</p>
						</div>
					</div>

					<div class="guidance-card">
						<p class="section-label">Next Best Action</p>
						<p class="guidance-copy">{draft.recommendation?.suggestedAction}</p>
						<p class="helper-text">{draft.recommendation?.rationale}</p>
					</div>
				</div>

				<div class="surface">
					<div class="section-header compact">
						<div>
							<p class="section-label">Score Map</p>
							<h2>How the modes stacked up</h2>
						</div>
						<p class="section-copy">
							A compact deterministic view of your current operating pattern.
						</p>
					</div>

					<div class="comparison-list">
						{#each MODES as mode}
							<div class="comparison-card">
								<div class="comparison-head">
									<p>{mode.label}</p>
									<p>{draft.result.scoreMap[mode.value]}</p>
								</div>
								<div class="bar-track">
									<div class="bar-fill" style={`width:${getModeBarWidth(draft.result, mode.value)};`}></div>
								</div>
							</div>
						{/each}
					</div>

					<div class="summary-card">
						<p class="section-label">Summary Output</p>
						<p class="metric-value">{summaryOutput.primaryValue}</p>
						<p class="helper-text">{summaryOutput.recommendationSummary}</p>
					</div>

					<div class="action-stack">
						<button class="secondary-action" type="button" onclick={continueAssessment}>
							Review Answers
						</button>
						<button class="primary-action" type="button" onclick={restartAssessment}>
							Run Again
						</button>
					</div>
				</div>
			</section>
		{/if}
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
		padding: clamp(1rem, 3vw, 1.35rem);
		border-radius: 1.4rem;
		border: 1px solid rgba(255, 236, 212, 0.08);
		background: rgba(255, 248, 240, 0.03);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.hero,
	.context-section,
	.section-header,
	.action-stack,
	.option-list,
	.result-grid,
	.comparison-list {
		display: grid;
	}

	.hero,
	.context-section,
	.action-stack,
	.option-list,
	.result-grid,
	.comparison-list {
		gap: 0.9rem;
	}

	.eyebrow,
	.section-label,
	.option-label {
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
	.context-copy,
	.helper-text,
	.guidance-copy,
	.option-copy,
	.comparison-head p:last-child {
		margin: 0;
		color: var(--app-text-muted);
		line-height: 1.65;
	}

	.context-header,
	.comparison-head,
	.action-row,
	.metric-row {
		display: flex;
		gap: 0.9rem;
	}

	.context-header,
	.comparison-head,
	.action-row {
		align-items: flex-start;
		justify-content: space-between;
	}

	.metric-row {
		flex-wrap: wrap;
	}

	.context-trigger,
	.option-button,
	.primary-action,
	.secondary-action {
		font: inherit;
	}

	.context-trigger,
	.secondary-action {
		border: 1px solid rgba(255, 236, 212, 0.14);
		border-radius: 999px;
		background: rgba(255, 248, 240, 0.05);
		color: var(--app-text);
		cursor: pointer;
	}

	.context-trigger {
		padding: 0.72rem 1rem;
	}

	.context-trigger-open,
	.context-trigger:hover,
	.context-trigger:focus-visible,
	.secondary-action:hover,
	.secondary-action:focus-visible,
	.option-button:hover,
	.option-button:focus-visible,
	.option-active {
		border-color: rgba(255, 212, 165, 0.28);
		background: rgba(255, 248, 240, 0.08);
		transform: translateY(-1px);
	}

	.context-grid,
	.intro-grid,
	.grid-section {
		display: grid;
		gap: 1.4rem;
	}

	.context-grid,
	.result-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.context-card,
	.metric-card,
	.result-card,
	.summary-card,
	.guidance-card,
	.comparison-card,
	.question-card {
		display: grid;
		gap: 0.6rem;
		padding: 0.95rem;
		border-radius: 1rem;
		background: rgba(255, 248, 240, 0.04);
		border: 1px solid rgba(255, 236, 212, 0.08);
	}

	.context-name,
	.metric-value,
	.question-text {
		margin: 0;
		color: #f5eee3;
	}

	.context-name,
	.metric-value {
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: -0.03em;
	}

	.question-text {
		font-size: clamp(1.2rem, 3vw, 1.55rem);
		line-height: 1.4;
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
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
		transition:
			transform 140ms ease,
			filter 140ms ease;
	}

	.secondary-action {
		width: fit-content;
		padding: 0.9rem 1.25rem;
		font-weight: 600;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			background-color 140ms ease;
	}

	.primary-action:hover,
	.primary-action:focus-visible {
		transform: translateY(-1px);
		filter: brightness(1.03);
	}

	.option-button {
		display: grid;
		gap: 0.45rem;
		width: 100%;
		padding: 0.95rem 1rem;
		border: 1px solid rgba(255, 236, 212, 0.12);
		border-radius: 1rem;
		background: rgba(255, 248, 240, 0.04);
		color: var(--app-text);
		text-align: left;
		cursor: pointer;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			background-color 140ms ease;
	}

	.option-active {
		color: var(--app-text);
	}

	.progress-track {
		height: 0.72rem;
		border-radius: 999px;
		background: rgba(255, 248, 240, 0.06);
		border: 1px solid rgba(255, 236, 212, 0.08);
		overflow: hidden;
	}

	.progress-fill,
	.bar-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(181, 156, 255, 0.94), rgba(117, 142, 221, 0.88));
		box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);
	}

	.bar-track {
		height: 0.7rem;
		border-radius: 999px;
		background: rgba(255, 248, 240, 0.06);
		border: 1px solid rgba(255, 236, 212, 0.08);
		overflow: hidden;
	}

	button:focus-visible {
		outline: 2px solid rgba(255, 212, 165, 0.52);
		outline-offset: 3px;
	}

	@media (max-width: 820px) {
		.context-grid,
		.intro-grid,
		.grid-section,
		.result-grid {
			grid-template-columns: 1fr;
		}

		.primary-action,
		.secondary-action {
			width: 100%;
		}

		.action-row {
			flex-direction: column-reverse;
		}
	}
</style>
