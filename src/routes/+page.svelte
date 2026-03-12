<svelte:head>
	<title>AXZIO | Discover Who You Are Becoming</title>
	<meta
		name="description"
		content="AXZIO analyzes patterns in your reflections to reveal the signal of who you are becoming."
	/>
</svelte:head>

<script lang="ts">
	const eyebrow = 'AXZIO';
	const headline = 'Discover Who You Are Becoming';
	const description =
		'AXZIO analyzes patterns in your reflections to reveal the signal of who you are becoming.';
</script>

<main class="shell">
	<section class="panel">
		<p class="eyebrow">{eyebrow}</p>
		<h1>{headline}</h1>
		<p class="description">{description}</p>
		<a class="cta" href="/reading">Start Identity Reading</a>
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
		text-align: center;
		display: grid;
		gap: 1.5rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #6b5d4d;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.75rem, 8vw, 5.5rem);
		line-height: 0.94;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	.description {
		margin: 0 auto;
		max-width: 32rem;
		font-size: 1.05rem;
		line-height: 1.7;
		color: #4c4339;
	}

	.cta {
		justify-self: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 15rem;
		padding: 0.95rem 1.4rem;
		border-radius: 999px;
		background: #1e1b18;
		color: #f8f3ea;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		transition:
			transform 140ms ease,
			background-color 140ms ease;
	}

	.cta:hover,
	.cta:focus-visible {
		background: #312b26;
		transform: translateY(-1px);
	}

	.cta:focus-visible {
		outline: 2px solid #8b765d;
		outline-offset: 4px;
	}

	@media (max-width: 640px) {
		.shell {
			padding: 1.5rem;
		}

		.panel {
			gap: 1.25rem;
		}

		.description {
			font-size: 1rem;
		}

		.cta {
			width: 100%;
		}
	}
</style>
