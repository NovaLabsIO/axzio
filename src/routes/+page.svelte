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
	const supportingLines = ['Understand how you’re operating', 'See the next move forward'];
	const expectation = '10 short questions · ~3 minutes · instant AXZIO ID';
	const trustHeadingId = 'axzio-data-use-heading';
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
		<div class="cta-row">
			<a class="cta" href="/reading">Activate AXZIO</a>
			<div
				class:trust-bubble-open={isTrustOpen}
				class="trust-bubble"
				bind:this={trustBubbleElement}
				onfocusout={handleTrustFocusOut}
			>
				<button
					aria-controls={trustPanelId}
					aria-expanded={isTrustOpen}
					aria-labelledby={trustHeadingId}
					class="trust-trigger"
					type="button"
					onclick={toggleTrustBubble}
					onkeydown={handleTrustKeydown}
				>
					<span aria-hidden="true" class="trust-icon">?</span>
					<span class="trust-label">How data is used</span>
				</button>
				<div aria-labelledby={trustHeadingId} class="trust-panel" id={trustPanelId} role="tooltip">
					<p class="trust-heading" id={trustHeadingId}>How AXZIO uses your data</p>
					<p class="trust-copy">
						For this review version, AXZIO may store your result, card snapshot,
						feedback, and optional email so we can improve the system. Your question
						responses are not stored. AXZIO is designed to reflect patterns back to you
						— not to define or own your identity.
					</p>
				</div>
			</div>
		</div>
		<p class="expectation">{expectation}</p>
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

	.cta-row {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.85rem;
		flex-wrap: wrap;
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
	}

	.trust-trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.7rem 0.95rem;
		border: 1px solid rgba(255, 240, 221, 0.14);
		border-radius: 999px;
		background: rgba(255, 250, 242, 0.04);
		color: var(--app-text-muted);
		font: inherit;
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition:
			border-color 140ms ease,
			background-color 140ms ease,
			color 140ms ease,
			transform 140ms ease;
		backdrop-filter: blur(14px);
	}

	.trust-trigger:hover,
	.trust-trigger:focus-visible,
	.trust-bubble-open .trust-trigger {
		border-color: rgba(255, 212, 165, 0.32);
		background: rgba(255, 245, 230, 0.08);
		color: var(--app-text);
		transform: translateY(-1px);
	}

	.trust-trigger:focus-visible {
		outline: 2px solid rgba(255, 212, 165, 0.52);
		outline-offset: 4px;
	}

	.trust-icon {
		display: inline-grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 999px;
		background: rgba(255, 243, 224, 0.12);
		color: var(--app-accent);
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1;
	}

	.trust-label {
		white-space: nowrap;
	}

	.trust-panel {
		position: absolute;
		top: calc(100% + 0.75rem);
		right: 0;
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
		transform: translateY(-0.35rem);
		pointer-events: none;
		transition:
			opacity 160ms ease,
			transform 160ms ease;
		z-index: 2;
	}

	.trust-bubble:hover .trust-panel,
	.trust-bubble:focus-within .trust-panel,
	.trust-bubble-open .trust-panel {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.trust-heading {
		margin: 0 0 0.45rem;
		font-size: 0.86rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--app-text);
	}

	.trust-copy {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.55;
		color: var(--app-text-muted);
	}

	.expectation {
		margin: -0.5rem 0 0;
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

		.cta-row {
			align-items: stretch;
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
			width: 100%;
			justify-content: center;
		}

		.trust-trigger {
			width: 100%;
			justify-content: center;
		}

		.trust-panel {
			left: 0;
			right: 0;
			width: auto;
		}
	}
</style>
