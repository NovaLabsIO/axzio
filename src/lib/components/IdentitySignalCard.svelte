<script lang="ts">
	export let archetype: string;
	export let primaryMode: string;
	export let secondaryMode: string = '';
	export let corePattern: string;
	export let growthVector: string;

	const modeAccents: Record<string, string> = {
		People: '#f4b88f',
		Pleasure: '#f0a58c',
		Production: '#d3a463',
		Reflection: '#b59cff'
	};

	$: accent = modeAccents[primaryMode] ?? modeAccents.Reflection;
</script>

<section class="card" aria-label="AXZIO ID card" style={`--accent:${accent};`}>
	<div class="intro">
		<p class="eyebrow">AXZIO ID</p>
		<p class="descriptor">Identity snapshot for sharing</p>
	</div>

	<div class="grid">
		<div class="field hero">
			<h2>Identity</h2>
			<p class="value">{archetype}</p>
		</div>

		<div class="field signal-field">
			<h2>Primary Mode</h2>
			<p class="value">{primaryMode}</p>
		</div>

		<div class="field">
			<h2>Secondary Mode</h2>
			<p class="value secondary">{secondaryMode}</p>
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
		gap: 1.25rem;
		padding: 1.6rem;
		border-radius: 1.7rem;
		background:
			radial-gradient(circle at top left, color-mix(in srgb, var(--accent) 22%, transparent), transparent 42%),
			radial-gradient(circle at 85% 20%, rgba(241, 146, 88, 0.1), transparent 26%),
			linear-gradient(145deg, rgba(10, 9, 17, 0.98), rgba(21, 16, 29, 0.94));
		border: 1px solid rgba(255, 236, 212, 0.1);
		box-shadow:
			0 24px 60px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.intro {
		display: grid;
		gap: 0.35rem;
	}

	.descriptor {
		margin: 0;
		color: rgba(244, 226, 202, 0.72);
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.eyebrow,
	h2 {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(244, 225, 199, 0.68);
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.field {
		display: grid;
		gap: 0.7rem;
		padding: 1.05rem;
		border-radius: 1.1rem;
		background: rgba(255, 248, 240, 0.04);
		border: 1px solid rgba(255, 236, 212, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.hero {
		grid-column: 1 / -1;
		background:
			radial-gradient(circle at top left, color-mix(in srgb, var(--accent) 24%, transparent), transparent 44%),
			linear-gradient(135deg, rgba(15, 13, 23, 0.98), rgba(29, 21, 36, 0.94));
		border-color: rgba(255, 236, 212, 0.1);
	}

	.hero h2,
	.hero .value {
		color: #f5eee3;
	}

	.signal {
		grid-column: 1 / -1;
	}

	.signal-field {
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--accent) 16%, transparent), rgba(255, 248, 240, 0.03));
	}

	.value,
	.signal-text {
		margin: 0;
		color: #f6efe7;
	}

	.value {
		font-size: clamp(1.3rem, 2.8vw, 1.95rem);
		line-height: 1.1;
		font-weight: 600;
		letter-spacing: -0.03em;
	}

	.secondary {
		color: rgba(246, 239, 231, 0.92);
	}

	.signal-text {
		line-height: 1.65;
		color: rgba(244, 236, 226, 0.84);
		line-clamp: 4;
		display: -webkit-box;
		-webkit-line-clamp: 4;
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
