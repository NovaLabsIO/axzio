<svelte:head>
	<title>AXZIO | Identity Reading</title>
	<meta
		name="description"
		content="Answer ten reflection questions to generate your AXZIO identity reading."
	/>
</svelte:head>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { REFLECTION_QUESTIONS } from '$lib/config/questions';
	import {
		IDENTITY_RESULT_STORAGE_KEY,
		parseIdentityReading,
		type IdentityReading
	} from '$lib/identity/schema';

	const totalQuestions = REFLECTION_QUESTIONS.length;

	let currentIndex = 0;
	let responses = Array.from({ length: totalQuestions }, () => '');
	let currentQuestion = REFLECTION_QUESTIONS[currentIndex];
	let isFirstQuestion = true;
	let isLastQuestion = false;
	let progressLabel = `Question 1 of ${totalQuestions}`;
	let isSubmitting = false;
	let submitError = '';

	$: currentQuestion = REFLECTION_QUESTIONS[currentIndex];
	$: isFirstQuestion = currentIndex === 0;
	$: isLastQuestion = currentIndex === totalQuestions - 1;
	$: progressLabel = `Question ${currentIndex + 1} of ${totalQuestions}`;

	function updateResponse(value: string) {
		responses[currentIndex] = value;
		responses = [...responses];
	}

	function goBack() {
		if (isFirstQuestion || isSubmitting) {
			return;
		}

		currentIndex -= 1;
		submitError = '';
	}

	function goNext() {
		if (isLastQuestion || isSubmitting) {
			return;
		}

		currentIndex += 1;
		submitError = '';
	}

	async function generateIdentitySignal() {
		if (isSubmitting) {
			return;
		}

		isSubmitting = true;
		submitError = '';

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ responses })
			});

			const payload = (await response.json()) as IdentityReading | { error?: string };

			if (!response.ok) {
				submitError =
					(typeof payload === 'object' && payload && 'error' in payload && payload.error) ||
					'Unable to generate your identity reading right now.';
				return;
			}

			const identityReading = parseIdentityReading(payload);

			if (!identityReading) {
				submitError = 'The analysis response was not in the expected format.';
				return;
			}

			sessionStorage.setItem(IDENTITY_RESULT_STORAGE_KEY, JSON.stringify(identityReading));
			await goto('/reading/result');
		} catch {
			submitError = 'A network or server error prevented the analysis request from completing.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<main class="shell">
	<section class="panel">
		<p class="eyebrow">AXZIO</p>
		<p class="progress">{progressLabel}</p>
		<h1>Identity Reading</h1>
		<p class="question">{currentQuestion}</p>

		<label class="response-field" for="reflection-response">
			<span class="label">Your reflection</span>
			<textarea
				id="reflection-response"
				rows="7"
				value={responses[currentIndex]}
				oninput={(event) => updateResponse(event.currentTarget.value)}
				placeholder="Write whatever feels honest."
				disabled={isSubmitting}
			></textarea>
		</label>

		{#if submitError}
			<p class="error" role="alert">{submitError}</p>
		{/if}

		<div class="actions">
			<button
				class="secondary"
				type="button"
				onclick={goBack}
				disabled={isFirstQuestion || isSubmitting}
			>
				Back
			</button>

			{#if isLastQuestion}
				<button class="primary" type="button" onclick={generateIdentitySignal} disabled={isSubmitting}>
					{#if isSubmitting}
						Generating...
					{:else}
						Generate Identity Signal
					{/if}
				</button>
			{:else}
				<button class="primary" type="button" onclick={goNext} disabled={isSubmitting}>Next</button>
			{/if}
		</div>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family:
			"IBM Plex Sans",
			"Avenir Next",
			sans-serif;
		background:
			radial-gradient(circle at top, rgba(216, 196, 165, 0.36), transparent 42%),
			#f4efe5;
		color: #1e1b18;
	}

	.shell {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.panel {
		width: min(100%, 42rem);
		display: grid;
		gap: 1.25rem;
	}

	.eyebrow,
	.progress,
	.label {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #6b5d4d;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 6vw, 3.5rem);
		line-height: 0.98;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	.question {
		margin: 0;
		font-size: clamp(1.25rem, 3vw, 1.7rem);
		line-height: 1.4;
		color: #2f2823;
	}

	.response-field {
		display: grid;
		gap: 0.65rem;
	}

	textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 1rem;
		border: 1px solid rgba(49, 43, 38, 0.18);
		border-radius: 1rem;
		background: rgba(255, 251, 245, 0.72);
		color: #1e1b18;
		font: inherit;
		line-height: 1.6;
		resize: vertical;
	}

	textarea:disabled {
		opacity: 0.7;
	}

	textarea:focus-visible {
		outline: 2px solid #8b765d;
		outline-offset: 2px;
	}

	.error {
		margin: 0;
		padding: 0.9rem 1rem;
		border-radius: 1rem;
		background: rgba(133, 42, 42, 0.1);
		color: #7a1f1f;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		justify-content: space-between;
	}

	button {
		border: 0;
		border-radius: 999px;
		padding: 0.95rem 1.4rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 140ms ease,
			background-color 140ms ease,
			opacity 140ms ease;
	}

	button:hover:not(:disabled),
	button:focus-visible:not(:disabled) {
		transform: translateY(-1px);
	}

	button:focus-visible {
		outline: 2px solid #8b765d;
		outline-offset: 3px;
	}

	button:disabled {
		cursor: wait;
		opacity: 0.65;
	}

	.primary {
		background: #1e1b18;
		color: #f8f3ea;
		margin-left: auto;
	}

	.primary:hover:not(:disabled),
	.primary:focus-visible:not(:disabled) {
		background: #312b26;
	}

	.secondary {
		background: transparent;
		color: #1e1b18;
		border: 1px solid rgba(49, 43, 38, 0.18);
	}

	@media (max-width: 640px) {
		.shell {
			padding: 1.5rem;
		}

		.actions {
			flex-direction: column-reverse;
		}

		button {
			width: 100%;
		}
	}
</style>
