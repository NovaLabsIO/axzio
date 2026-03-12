<svelte:head>
	<title>AXZIO | Discover Who You Are Becoming</title>
	<meta
		name="description"
		content="AXZIO analyzes patterns in your reflections to reveal the signal of who you are becoming."
	/>
</svelte:head>

<script lang="ts">
	const eyebrow = 'AXZIO';
	const headline = 'Reveal Your Pattern';
	const supportingLines = ['Understand how you’re operating', 'See the next move forward'];
	const expectation = '10 short questions · ~3 minutes · instant AXZIO ID';
</script>

<main class="shell">
	<section class="panel">
		<p class="eyebrow">{eyebrow}</p>
		<h1>{headline}</h1>
		<div class="supporting-copy" aria-label="AXZIO hero supporting copy">
			{#each supportingLines as line}
				<p class="supporting-line">{line}</p>
			{/each}
		</div>
		<a class="cta" href="/reading">Activate AXZIO</a>
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

	.cta {
		justify-self: center;
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

		.supporting-line {
			font-size: 1rem;
		}

		.expectation {
			font-size: 0.76rem;
		}

		.cta {
			width: 100%;
		}
	}
</style>
