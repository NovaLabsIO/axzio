<svelte:head>
	<title>AXZIO | Pattern Questions</title>
	<meta
		name="description"
		content="Answer ten pattern questions to generate your AXZIO identity signal."
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
	import { validateIdentityResponses } from '$lib/identity/signal-validation';
	import { onMount, tick } from 'svelte';

	const totalQuestions = REFLECTION_QUESTIONS.length;

	let currentIndex = 0;
	let responses = Array.from({ length: totalQuestions }, () => '');
	let currentQuestion = REFLECTION_QUESTIONS[currentIndex];
	let isFirstQuestion = true;
	let isLastQuestion = false;
	let progressLabel = `Question 1 of ${totalQuestions}`;
	let isSubmitting = false;
	let submitError = '';
	let responseField: HTMLTextAreaElement | null = null;
	let shouldAutofocus = true;

	$: currentQuestion = REFLECTION_QUESTIONS[currentIndex];
	$: isFirstQuestion = currentIndex === 0;
	$: isLastQuestion = currentIndex === totalQuestions - 1;
	$: progressLabel = `Question ${currentIndex + 1} of ${totalQuestions}`;

	onMount(() => {
		shouldAutofocus = !isTouchDevice();
		void focusResponseField();
	});

	function isTouchDevice() {
		if (typeof window === 'undefined') {
			return false;
		}

		return (
			window.matchMedia('(pointer: coarse)').matches ||
			window.matchMedia('(hover: none)').matches ||
			navigator.maxTouchPoints > 0
		);
	}

	async function focusResponseField() {
		await tick();

		if (!responseField || isSubmitting || !shouldAutofocus) {
			return;
		}

		responseField.focus();
		const cursorPosition = responseField.value.length;
		responseField.setSelectionRange(cursorPosition, cursorPosition);
	}

	function updateResponse(value: string) {
		responses[currentIndex] = value;
		responses = [...responses];
		submitError = '';
	}

	async function goBack() {
		if (isFirstQuestion || isSubmitting) {
			return;
		}

		currentIndex -= 1;
		submitError = '';
		await focusResponseField();
	}

	async function goNext() {
		if (isLastQuestion || isSubmitting) {
			return;
		}

		currentIndex += 1;
		submitError = '';
		await focusResponseField();
	}

	async function generateIdentitySignal() {
		if (isSubmitting) {
			return;
		}

		const validation = validateIdentityResponses(responses);

		if (!validation.isValid) {
			submitError = validation.message;
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
					'Unable to generate your identity signal right now.';
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
		<h1>Pattern Questions</h1>
		<p class="question">{currentQuestion}</p>

		<label class="response-field" for="reflection-response">
			<span class="label">Your reflection</span>
			<textarea
				bind:this={responseField}
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
			{#if isLastQuestion}
				<button
					class="primary"
					type="button"
					onclick={generateIdentitySignal}
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						Generating...
					{:else}
						Generate Identity Signal
					{/if}
				</button>
			{:else}
				<button class="primary" type="button" onclick={goNext} disabled={isSubmitting}>
					Next
				</button>
			{/if}

			<button
				class="secondary"
				type="button"
				onclick={goBack}
				disabled={isFirstQuestion || isSubmitting}
			>
				Back
			</button>
		</div>
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
		width: min(100%, 42rem);
		display: grid;
		gap: 1.25rem;
		padding: clamp(1.6rem, 4vw, 2.3rem);
		border-radius: 1.9rem;
		background:
			radial-gradient(circle at top left, rgba(181, 156, 255, 0.12), transparent 38%),
			radial-gradient(circle at 84% 18%, rgba(241, 146, 88, 0.1), transparent 24%),
			linear-gradient(145deg, rgba(12, 11, 19, 0.94), rgba(20, 16, 28, 0.9));
		border: 1px solid rgba(255, 236, 212, 0.1);
		box-shadow:
			0 30px 72px rgba(0, 0, 0, 0.34),
			inset 0 1px 0 rgba(255, 244, 227, 0.04);
	}

	.eyebrow,
	.progress,
	.label {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--app-text-soft);
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
		color: rgba(248, 240, 230, 0.92);
	}

	.response-field {
		display: grid;
		gap: 0.65rem;
	}

	textarea {
		width: 100%;
		padding: 1rem;
		border: 1px solid rgba(255, 236, 212, 0.12);
		border-radius: 1rem;
		background:
			linear-gradient(180deg, rgba(255, 248, 240, 0.06), rgba(255, 248, 240, 0.04));
		color: #f7efe5;
		line-height: 1.6;
		resize: vertical;
	}

	textarea::placeholder {
		color: rgba(240, 220, 198, 0.46);
	}

	textarea:disabled {
		opacity: 0.7;
	}

	textarea:focus-visible {
		outline: 2px solid #f4b88f;
		outline-offset: 2px;
	}

	.error {
		margin: 0;
		padding: 0.9rem 1rem;
		border-radius: 1rem;
		background: rgba(164, 60, 60, 0.16);
		color: #ffd4cb;
		line-height: 1.5;
		border: 1px solid rgba(255, 178, 164, 0.16);
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
		outline: 2px solid #f4b88f;
		outline-offset: 3px;
	}

	button:disabled {
		cursor: wait;
		opacity: 0.65;
	}

	.primary {
		background:
			linear-gradient(135deg, #f4b88f, color-mix(in srgb, #f4b88f 60%, #f19258 40%));
		color: #140f11;
		margin-left: auto;
		box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
	}

	.primary:hover:not(:disabled),
	.primary:focus-visible:not(:disabled) {
		background:
			linear-gradient(135deg, #f6c39c, color-mix(in srgb, #f6c39c 60%, #f19258 40%));
	}

	.secondary {
		background: rgba(255, 248, 240, 0.05);
		color: #f7efe5;
		border: 1px solid rgba(255, 236, 212, 0.12);
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
