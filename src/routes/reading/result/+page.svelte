<svelte:head>
	<title>AXZIO | Identity Signal</title>
	<meta
		name="description"
		content="Your AXZIO identity reading result."
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import IdentitySignalCard from '$lib/components/IdentitySignalCard.svelte';
	import {
		IDENTITY_RESULT_STORAGE_KEY,
		parseIdentityReading,
		type IdentityReading
	} from '$lib/identity/schema';

	let identityReading: IdentityReading | null = null;

	onMount(() => {
		const savedValue = sessionStorage.getItem(IDENTITY_RESULT_STORAGE_KEY);

		if (!savedValue) {
			return;
		}

		try {
			identityReading = parseIdentityReading(JSON.parse(savedValue));
		} catch {
			identityReading = null;
		}
	});
</script>

<main class="shell">
	<section class="panel">
		{#if identityReading}
			<header class="hero">
				<p class="eyebrow">AXZIO Identity Signal</p>
				<h1>AXZIO Identity Signal</h1>
				<p class="subheading">Your reflections reveal the following identity pattern.</p>
			</header>

			<IdentitySignalCard
				archetype={identityReading.archetype}
				primaryMode={identityReading.primaryMode}
				corePattern={identityReading.corePattern}
				growthVector={identityReading.growthVector}
			/>

			<section class="section">
				<p class="section-label">Primary Identity Summary</p>
				<div class="summary-grid">
					<article class="summary-card">
						<h2>Primary Mode</h2>
						<p>{identityReading.primaryMode}</p>
					</article>
					<article class="summary-card">
						<h2>Secondary Mode</h2>
						<p>{identityReading.secondaryMode}</p>
					</article>
					<article class="summary-card">
						<h2>Archetype</h2>
						<p>{identityReading.archetype}</p>
					</article>
				</div>
			</section>

			<section class="section interpretation">
				<p class="section-label">Identity Interpretation</p>
				<article class="text-block">
					<h2>Core Pattern</h2>
					<p>{identityReading.corePattern}</p>
				</article>
				<article class="text-block">
					<h2>Current Challenge</h2>
					<p>{identityReading.currentChallenge}</p>
				</article>
			</section>

			<section class="section direction">
				<p class="section-label">Direction</p>
				<div class="direction-grid">
					<article class="direction-card">
						<h2>Growth Vector</h2>
						<p>{identityReading.growthVector}</p>
					</article>
					<article class="direction-card">
						<h2>Suggested Next Action</h2>
						<p>{identityReading.suggestedNextAction}</p>
					</article>
				</div>
			</section>
		{:else}
			<header class="hero">
				<p class="eyebrow">AXZIO Identity Signal</p>
				<h1>AXZIO Identity Signal</h1>
				<p class="subheading">Your reflections reveal the following identity pattern.</p>
			</header>

			<p class="empty">
				No identity reading is available yet. Complete the reflection flow to generate one.
			</p>
		{/if}

		<a class="cta" href="/reading">Start New Reading</a>
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
		width: min(100%, 52rem);
		display: grid;
		gap: 1.75rem;
	}

	.hero,
	.section {
		display: grid;
		gap: 0.9rem;
	}

	.eyebrow,
	.section-label,
	h2 {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #6b5d4d;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.5rem, 6vw, 4.1rem);
		line-height: 0.95;
		font-weight: 500;
		letter-spacing: -0.04em;
	}

	.subheading {
		margin: 0;
		max-width: 34rem;
		line-height: 1.6;
		color: #4c4339;
	}

	.summary-grid,
	.direction-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.direction-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.summary-card,
	.text-block,
	.direction-card,
	.empty {
		padding: 1.2rem;
		border-radius: 1.2rem;
		background: rgba(255, 251, 245, 0.72);
		border: 1px solid rgba(49, 43, 38, 0.12);
	}

	.summary-card {
		display: grid;
		gap: 0.75rem;
		align-content: start;
		min-height: 9rem;
	}

	.summary-card p,
	.direction-card p {
		margin: 0;
		font-size: clamp(1.35rem, 3vw, 2rem);
		line-height: 1.15;
		font-weight: 500;
		letter-spacing: -0.03em;
	}

	.text-block,
	.direction-card {
		display: grid;
		gap: 0.75rem;
	}

	.text-block p,
	.empty {
		margin: 0;
		line-height: 1.7;
		color: #2f2823;
	}

	.cta {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		justify-content: center;
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

	@media (max-width: 760px) {
		.summary-grid,
		.direction-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.shell {
			padding: 1.5rem;
		}

		.panel {
			gap: 1.5rem;
		}

		.cta {
			width: 100%;
			justify-self: stretch;
		}
	}
</style>
