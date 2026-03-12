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
	let isExporting = false;
	let isSharing = false;
	let shareMessage = '';
	let cachedCardBlob: Blob | null = null;
	let cachedCardBlobKey = '';

	const EXPORT_FILENAME = 'axzio-identity-signal.png';
	const SHARE_TITLE = 'AXZIO Identity Signal';
	const CARD_WIDTH = 1200;
	const CARD_HEIGHT = 1500;
	const CARD_PADDING = 72;
	const SURFACE_RADIUS = 42;
	const FIELD_RADIUS = 28;
	const LABEL_FONT = '600 26px "IBM Plex Sans", "Avenir Next", sans-serif';
	const VALUE_FONT = '600 58px "IBM Plex Sans", "Avenir Next", sans-serif';
	const BODY_FONT = '400 38px "IBM Plex Sans", "Avenir Next", sans-serif';
	const SMALL_BODY_FONT = '400 32px "IBM Plex Sans", "Avenir Next", sans-serif';

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

	$: {
		const nextKey = identityReading ? createCardBlobKey(identityReading) : '';

		if (nextKey !== cachedCardBlobKey) {
			cachedCardBlob = null;
			cachedCardBlobKey = nextKey;
		}
	}

	function createCardBlobKey(reading: IdentityReading) {
		return JSON.stringify({
			archetype: reading.archetype,
			primaryMode: reading.primaryMode,
			corePattern: reading.corePattern,
			growthVector: reading.growthVector
		});
	}

	function createShareText(reading: IdentityReading) {
		return `My AXZIO Identity Signal: ${reading.archetype} • ${reading.primaryMode} • ${reading.growthVector}`;
	}

	function drawRoundedRect(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number
	) {
		context.beginPath();
		context.moveTo(x + radius, y);
		context.lineTo(x + width - radius, y);
		context.quadraticCurveTo(x + width, y, x + width, y + radius);
		context.lineTo(x + width, y + height - radius);
		context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		context.lineTo(x + radius, y + height);
		context.quadraticCurveTo(x, y + height, x, y + height - radius);
		context.lineTo(x, y + radius);
		context.quadraticCurveTo(x, y, x + radius, y);
		context.closePath();
	}

	function fillRoundedRect(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number,
		fillStyle: string | CanvasGradient
	) {
		context.save();
		context.fillStyle = fillStyle;
		drawRoundedRect(context, x, y, width, height, radius);
		context.fill();
		context.restore();
	}

	function strokeRoundedRect(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		radius: number,
		strokeStyle: string,
		lineWidth: number
	) {
		context.save();
		context.strokeStyle = strokeStyle;
		context.lineWidth = lineWidth;
		drawRoundedRect(context, x, y, width, height, radius);
		context.stroke();
		context.restore();
	}

	function wrapText(
		context: CanvasRenderingContext2D,
		text: string,
		maxWidth: number,
		maxLines: number
	) {
		const normalizedText = text.replace(/\s+/g, ' ').trim();

		if (!normalizedText) {
			return [''];
		}

		const words = normalizedText.split(' ');
		const lines: string[] = [];
		let currentLine = '';

		for (const word of words) {
			const candidate = currentLine ? `${currentLine} ${word}` : word;

			if (context.measureText(candidate).width <= maxWidth) {
				currentLine = candidate;
				continue;
			}

			if (currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				lines.push(word);
			}

			if (lines.length === maxLines) {
				break;
			}
		}

		if (lines.length < maxLines && currentLine) {
			lines.push(currentLine);
		}

		if (lines.length > maxLines) {
			lines.length = maxLines;
		}

		if (!lines.length) {
			lines.push('');
		}

		const hasOverflow = words.join(' ') !== lines.join(' ');

		if (hasOverflow) {
			const lastLine = lines[lines.length - 1] ?? '';
			let truncated = lastLine;

			while (truncated && context.measureText(`${truncated}...`).width > maxWidth) {
				truncated = truncated.slice(0, -1).trimEnd();
			}

			lines[lines.length - 1] = truncated ? `${truncated}...` : '...';
		}

		return lines;
	}

	function drawTextBlock(
		context: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		maxWidth: number,
		lineHeight: number,
		maxLines: number
	) {
		const lines = wrapText(context, text, maxWidth, maxLines);

		lines.forEach((line, index) => {
			context.fillText(line, x, y + index * lineHeight);
		});
	}

	function drawField(
		context: CanvasRenderingContext2D,
		label: string,
		value: string,
		x: number,
		y: number,
		width: number,
		height: number,
		options?: { body?: boolean; maxLines?: number }
	) {
		fillRoundedRect(context, x, y, width, height, FIELD_RADIUS, 'rgba(255, 255, 255, 0.45)');
		strokeRoundedRect(context, x, y, width, height, FIELD_RADIUS, 'rgba(49, 43, 38, 0.08)', 2);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = '#6b5d4d';
		context.font = LABEL_FONT;
		context.letterSpacing = '0.16em';
		context.fillText(label.toUpperCase(), x + 34, y + 26);

		context.fillStyle = '#1e1b18';

		if (options?.body) {
			context.font = SMALL_BODY_FONT;
			drawTextBlock(context, value, x + 34, y + 86, width - 68, 46, options.maxLines ?? 6);
		} else {
			context.font = VALUE_FONT;
			drawTextBlock(context, value, x + 34, y + 84, width - 68, 64, options?.maxLines ?? 2);
		}

		context.restore();
	}

	async function renderCardBlob(reading: IdentityReading) {
		if ('fonts' in document) {
			await document.fonts.ready;
		}

		const canvas = document.createElement('canvas');
		canvas.width = CARD_WIDTH;
		canvas.height = CARD_HEIGHT;

		const context = canvas.getContext('2d');

		if (!context) {
			throw new Error('Canvas export is unavailable.');
		}

		context.fillStyle = '#f4efe5';
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const glow = context.createRadialGradient(280, 160, 0, 280, 160, 520);
		glow.addColorStop(0, 'rgba(216, 196, 165, 0.36)');
		glow.addColorStop(1, 'rgba(216, 196, 165, 0)');
		context.fillStyle = glow;
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const panelGradient = context.createLinearGradient(120, 120, CARD_WIDTH - 120, CARD_HEIGHT - 180);
		panelGradient.addColorStop(0, 'rgba(255, 251, 245, 0.96)');
		panelGradient.addColorStop(1, 'rgba(244, 239, 229, 0.92)');

		fillRoundedRect(
			context,
			CARD_PADDING,
			CARD_PADDING,
			CARD_WIDTH - CARD_PADDING * 2,
			CARD_HEIGHT - CARD_PADDING * 2,
			SURFACE_RADIUS,
			panelGradient
		);
		strokeRoundedRect(
			context,
			CARD_PADDING,
			CARD_PADDING,
			CARD_WIDTH - CARD_PADDING * 2,
			CARD_HEIGHT - CARD_PADDING * 2,
			SURFACE_RADIUS,
			'rgba(49, 43, 38, 0.18)',
			2
		);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = '#6b5d4d';
		context.font = LABEL_FONT;
		context.fillText('AXZIO IDENTITY SIGNAL', CARD_PADDING + 36, CARD_PADDING + 36);

		const innerX = CARD_PADDING + 36;
		const innerY = CARD_PADDING + 104;
		const columnGap = 24;
		const fieldWidth = (CARD_WIDTH - CARD_PADDING * 2 - 72 - columnGap) / 2;

		drawField(context, 'Archetype', reading.archetype, innerX, innerY, fieldWidth, 250);
		drawField(
			context,
			'Primary Mode',
			reading.primaryMode,
			innerX + fieldWidth + columnGap,
			innerY,
			fieldWidth,
			250
		);
		drawField(context, 'Signal', reading.corePattern, innerX, innerY + 274, fieldWidth * 2 + columnGap, 410, {
			body: true,
			maxLines: 6
		});
		drawField(
			context,
			'Growth Vector',
			reading.growthVector,
			innerX,
			innerY + 708,
			fieldWidth * 2 + columnGap,
			250,
			{ maxLines: 2 }
		);

		context.fillStyle = '#6b5d4d';
		context.font = '500 24px "IBM Plex Sans", "Avenir Next", sans-serif';
		context.fillText('axzio.ai', innerX, CARD_HEIGHT - CARD_PADDING - 60);
		context.restore();

		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('PNG export failed.'));
					return;
				}

				resolve(blob);
			}, 'image/png');
		});
	}

	async function createCardImageBlob() {
		if (!identityReading) {
			throw new Error('Identity card is unavailable.');
		}

		if (cachedCardBlob && cachedCardBlobKey === createCardBlobKey(identityReading)) {
			return cachedCardBlob;
		}

		const blob = await renderCardBlob(identityReading);
		cachedCardBlob = blob;
		cachedCardBlobKey = createCardBlobKey(identityReading);
		return blob;
	}

	async function downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const downloadLink = document.createElement('a');

		try {
			downloadLink.href = url;
			downloadLink.download = filename;
			downloadLink.style.display = 'none';
			document.body.append(downloadLink);
			downloadLink.click();

			await new Promise((resolve) => window.setTimeout(resolve, 0));
		} finally {
			downloadLink.remove();
			URL.revokeObjectURL(url);
		}
	}

	async function exportCard() {
		if (isExporting) {
			return;
		}

		shareMessage = '';
		isExporting = true;

		try {
			const blob = await createCardImageBlob();
			await downloadBlob(blob, EXPORT_FILENAME);
		} catch (error) {
			console.error('Failed to export identity card.', error);
		} finally {
			isExporting = false;
		}
	}

	async function shareCard() {
		if (!identityReading || isSharing) {
			return;
		}

		shareMessage = '';

		if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
			shareMessage = 'Native sharing is not available on this device.';
			return;
		}

		isSharing = true;

		try {
			const text = createShareText(identityReading);
			const shareData: ShareData = {
				title: SHARE_TITLE,
				text
			};

			if (typeof File !== 'undefined' && typeof navigator.canShare === 'function') {
				const blob = await createCardImageBlob();
				const file = new File([blob], EXPORT_FILENAME, { type: 'image/png' });

				if (navigator.canShare({ files: [file] })) {
					shareData.files = [file];
				}
			}

			await navigator.share(shareData);
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				shareMessage = '';
			} else {
				console.error('Failed to share identity card.', error);
				shareMessage = 'Sharing failed. Try Export Card instead.';
			}
		} finally {
			isSharing = false;
		}
	}
</script>

<main class="shell">
	<section class="panel">
		{#if identityReading}
			<header class="hero">
				<p class="eyebrow">AXZIO Identity Signal</p>
				<h1>AXZIO Identity Signal</h1>
				<p class="subheading">Your reflections reveal the following identity pattern.</p>
			</header>

			<div class="card-export-target">
				<IdentitySignalCard
					archetype={identityReading.archetype}
					primaryMode={identityReading.primaryMode}
					corePattern={identityReading.corePattern}
					growthVector={identityReading.growthVector}
				/>
			</div>

			<div class="card-actions">
				<button class="secondary-cta" type="button" on:click={exportCard} disabled={isExporting}>
					{#if isExporting}
						Exporting...
					{:else}
						Export Card
					{/if}
				</button>

				<button class="secondary-cta" type="button" on:click={shareCard} disabled={isSharing}>
					{#if isSharing}
						Sharing...
					{:else}
						Share Card
					{/if}
				</button>
			</div>

			{#if shareMessage}
				<p class="feedback">{shareMessage}</p>
			{/if}

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

	.card-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
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

	.feedback {
		margin: -0.75rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: #6b5d4d;
	}

	.cta,
	.secondary-cta {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.95rem 1.4rem;
		border-radius: 999px;
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		transition:
			transform 140ms ease,
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.cta {
		border: 0;
		background: #1e1b18;
		color: #f8f3ea;
		text-decoration: none;
	}

	.secondary-cta {
		border: 1px solid rgba(49, 43, 38, 0.16);
		background: rgba(255, 251, 245, 0.78);
		color: #1e1b18;
		cursor: pointer;
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

	.secondary-cta:hover,
	.secondary-cta:focus-visible {
		background: rgba(255, 251, 245, 0.94);
		border-color: rgba(49, 43, 38, 0.24);
		transform: translateY(-1px);
	}

	.secondary-cta:focus-visible {
		outline: 2px solid #8b765d;
		outline-offset: 4px;
	}

	.secondary-cta:disabled {
		cursor: progress;
		opacity: 0.72;
		transform: none;
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

		.card-actions {
			display: grid;
		}

		.cta,
		.secondary-cta {
			width: 100%;
			justify-self: stretch;
		}
	}
</style>
