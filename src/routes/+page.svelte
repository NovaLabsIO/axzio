<svelte:head>
	<title>AXZIO | Reveal Your Pattern</title>
	<meta
		name="description"
		content="AXZIO analyzes your reflections to show how you're operating right now — and the next best move forward."
	/>
	<meta property="og:title" content="AXZIO | Reveal Your Pattern" />
	<meta
		property="og:description"
		content="AXZIO analyzes your reflections to show how you're operating right now — and the next best move forward."
	/>
	<meta name="twitter:title" content="AXZIO | Reveal Your Pattern" />
	<meta
		name="twitter:description"
		content="AXZIO analyzes your reflections to show how you're operating right now — and the next best move forward."
	/>
</svelte:head>

<script lang="ts">
	const eyebrow = 'AXZIO';
	const headline = 'Reveal Your Pattern';
	const supportingLines = [
		'See the pattern guiding your decisions.',
		'Find your next move forward.'
	];
	const expectation = '10 Short Questions · ~3 Minutes · Reveal Your AXZIO Pattern';
	const trustPanelId = 'axzio-data-use-panel';

	let isTrustOpen = false;
	let trustBubbleElement: HTMLDivElement | null = null;

	function toggleTrustBubble() {
		isTrustOpen = !isTrustOpen;
	}

	function closeTrustBubble() {
		isTrustOpen = false;
	}

	function handleWindowClick(event: MouseEvent) {
		if (!(event.target instanceof Node)) {
			return;
		}

		if (!trustBubbleElement?.contains(event.target)) {
			closeTrustBubble();
		}
	}

	function handleTrustFocusOut(event: FocusEvent) {
		if (!(event.relatedTarget instanceof Node)) {
			closeTrustBubble();
			return;
		}

		if (!trustBubbleElement?.contains(event.relatedTarget)) {
			closeTrustBubble();
		}
	}

	function handleTrustKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeTrustBubble();
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<main class="shell">
	<section class="panel">
		<p class="eyebrow">{eyebrow}</p>
		<h1>{headline}</h1>
		<div class="supporting-copy" aria-label="AXZIO hero supporting copy">
			{#each supportingLines as line}
				<p class="supporting-line">{line}</p>
			{/each}
		</div>
		<div class="cta-group">
			<a class="cta" href="/reading">Activate AXZIO</a>
			<div class="cta-row">
				<div
					class:trust-bubble-open={isTrustOpen}
					class="trust-bubble"
					bind:this={trustBubbleElement}
					onfocusout={handleTrustFocusOut}
				>
					<span class="trust-label">Your data stays yours.</span>
					<button
						aria-controls={trustPanelId}
						aria-expanded={isTrustOpen}
						aria-label="Learn more about AXZIO data use."
						class="trust-trigger"
						type="button"
						onclick={toggleTrustBubble}
						onkeydown={handleTrustKeydown}
					>
						<span aria-hidden="true" class="trust-icon">(?)</span>
					</button>
					<div class="trust-panel" id={trustPanelId} role="tooltip">
						<p class="trust-copy">
							AXZIO stores only the derived result and optional feedback to improve the
							system. Your responses are not saved, and your data is never sold.
						</p>
						<p class="trust-copy">
							Participation is optional — if you prefer not to store a result, simply do
							not submit the analysis.
						</p>
						<p class="trust-copy">
							AXZIO reflects patterns — it doesn’t collect identities.
						</p>
					</div>
				</div>
			</div>
			<p class="expectation">{expectation}</p>
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
		text-align: center;
		display: grid;
		gap: 1.75rem;
		padding: clamp(2.2rem, 5vw, 3.4rem);
		border-radius: 2rem;
		background:
			radial-gradient(circle at top left, rgba(181, 156, 255, 0.14), transparent 38%),
			radial-gradient(circle at 82% 18%, rgba(241, 146, 88, 0.12), transparent 24%),
			linear-gradient(145deg, rgba(12, 11, 19, 0.94), rgba(20, 16, 28, 0.9));
		border: 1px solid rgba(255, 236, 212, 0.1);
		box-shadow:
			0 32px 80px rgba(0, 0, 0, 0.34),
			inset 0 1px 0 rgba(255, 244, 227, 0.04);
	}

	.eyebrow {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--app-text-soft);
	}

	h1 {
		margin: 0;
		font-size: clamp(2.75rem, 8vw, 5.5rem);
		line-height: 0.94;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	.supporting-copy {
		display: grid;
		gap: 0.45rem;
		margin: -0.15rem auto 0;
		max-width: 28rem;
	}

	.supporting-line {
		margin: 0 auto;
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--app-text-muted);
	}

	.cta-group {
		display: grid;
		justify-items: center;
		gap: 0.7rem;
	}

	.cta-row {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 15rem;
		padding: 0.95rem 1.4rem;
		border-radius: 999px;
		background:
			linear-gradient(
				135deg,
				var(--app-accent),
				color-mix(in srgb, var(--app-accent) 60%, var(--app-accent-strong) 40%)
			);
		color: #140f11;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		transition:
			transform 140ms ease,
			filter 140ms ease;
		box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
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

	.trust-bubble {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
	}

	.trust-trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.1rem;
		border: 0;
		border-radius: 0.45rem;
		background: transparent;
		color: var(--app-text-soft);
		font: inherit;
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition:
			color 140ms ease,
			transform 140ms ease;
	}

	.trust-trigger:hover,
	.trust-trigger:focus-visible,
	.trust-bubble-open .trust-trigger {
		color: var(--app-text);
	}

	.trust-trigger:focus-visible {
		outline: 2px solid rgba(255, 212, 165, 0.42);
		outline-offset: 3px;
	}

	.trust-icon {
		display: inline-block;
		border-radius: 999px;
		padding: 0.05rem 0.3rem;
		background: rgba(255, 243, 224, 0.08);
		color: var(--app-accent);
		font-size: 0.74rem;
		font-weight: 700;
		line-height: 1.35;
		transition:
			background-color 140ms ease,
			transform 140ms ease;
	}

	.trust-label {
		white-space: nowrap;
		color: var(--app-text-soft);
		font-size: 0.8rem;
		letter-spacing: 0.02em;
	}

	.trust-panel {
		position: absolute;
		top: calc(100% + 0.75rem);
		left: 50%;
		right: auto;
		width: min(24rem, calc(100vw - 3rem));
		padding: 1rem 1.05rem 1.05rem;
		border-radius: 1rem;
		background:
			linear-gradient(180deg, rgba(28, 23, 34, 0.98), rgba(18, 15, 24, 0.96));
		border: 1px solid rgba(255, 231, 203, 0.14);
		box-shadow:
			0 22px 44px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 246, 232, 0.04);
		text-align: left;
		opacity: 0;
		transform: translate(-50%, -0.35rem);
		pointer-events: none;
		transition:
			opacity 160ms ease,
			transform 160ms ease;
		z-index: 2;
	}

	.trust-trigger:hover + .trust-panel,
	.trust-bubble:focus-within .trust-panel,
	.trust-bubble-open .trust-panel {
		opacity: 1;
		transform: translate(-50%, 0);
		pointer-events: auto;
	}

	.trust-trigger:hover .trust-icon,
	.trust-trigger:focus-visible .trust-icon,
	.trust-bubble-open .trust-icon {
		background: rgba(255, 243, 224, 0.14);
		transform: translateY(-1px);
	}

	.trust-copy {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.55;
		color: var(--app-text-muted);
	}

	.trust-copy + .trust-copy {
		margin-top: 0.75rem;
	}

	.expectation {
		margin: 0;
		font-size: 0.82rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--app-text-soft);
	}

	@media (max-width: 640px) {
		.shell {
			padding: 1.5rem;
		}

		.panel {
			gap: 1.4rem;
		}

		.supporting-line {
			font-size: 1rem;
		}

		.expectation {
			font-size: 0.76rem;
		}

		.cta {
			width: 100%;
		}

		.trust-bubble {
			flex-wrap: wrap;
		}

		.trust-panel {
			left: 0;
			transform: translateY(-0.35rem);
			width: auto;
		}

		.trust-trigger:hover + .trust-panel,
		.trust-bubble:focus-within .trust-panel,
		.trust-bubble-open .trust-panel {
			transform: translateY(0);
		}
	}
</style>
