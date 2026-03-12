<script lang="ts">
	export let archetype: string;
	export let primaryMode: string;
	export let corePattern: string;
	export let growthVector: string;
</script>

<section class="card" aria-label="AXZIO Identity Signal card">
	<p class="eyebrow">AXZIO IDENTITY SIGNAL</p>

	<div class="grid">
		<div class="field">
			<h2>Archetype</h2>
			<p class="value">{archetype}</p>
		</div>

		<div class="field">
			<h2>Primary Mode</h2>
			<p class="value">{primaryMode}</p>
		</div>

		<div class="field signal">
			<h2>Signal</h2>
			<p class="signal-text">{corePattern}</p>
		</div>

		<div class="field">
			<h2>Growth Vector</h2>
			<p class="value">{growthVector}</p>
		</div>
	</div>
</section>

<style>
	.card {
		display: grid;
		gap: 1rem;
		padding: 1.4rem;
		border-radius: 1.4rem;
		background:
			linear-gradient(145deg, rgba(255, 251, 245, 0.9), rgba(244, 239, 229, 0.82));
		border: 1px solid rgba(49, 43, 38, 0.18);
		box-shadow: 0 20px 45px rgba(49, 43, 38, 0.08);
	}

	.eyebrow,
	h2 {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #6b5d4d;
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.field {
		display: grid;
		gap: 0.65rem;
		padding: 1rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.45);
		border: 1px solid rgba(49, 43, 38, 0.08);
	}

	.signal {
		grid-column: 1 / -1;
	}

	.value,
	.signal-text {
		margin: 0;
		color: #1e1b18;
	}

	.value {
		font-size: clamp(1.2rem, 2.8vw, 1.8rem);
		line-height: 1.1;
		font-weight: 500;
		letter-spacing: -0.03em;
	}

	.signal-text {
		line-height: 1.6;
		color: #2f2823;
		line-clamp: 3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.signal {
			grid-column: auto;
		}
	}
</style>
