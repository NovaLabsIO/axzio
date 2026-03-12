<svelte:head>
	<title>AXZIO | ID</title>
	<meta
		name="description"
		content="Your AXZIO identity reading result."
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import {
		IDENTITY_RESULT_STORAGE_KEY,
		parseIdentityReading,
		type IdentityReading
	} from '$lib/identity/schema';

	let identityReading: IdentityReading | null = null;
	let isExporting = false;
	let isSharing = false;
	let shareMessage = '';
	let emailValue = '';
	let emailMessage = '';
	let cachedCardBlob: Blob | null = null;
	let cachedCardBlobKey = '';

	const EXPORT_FILENAME = 'axzio-identity-signal.png';
	const EMAIL_CAPTURE_STORAGE_KEY = 'axzio.identity-reading-email';
	const SHARE_TITLE = 'AXZIO ID';
	const CARD_WIDTH = 1080;
	const CARD_HEIGHT = 1080;
	const CARD_PADDING = 56;
	const SURFACE_RADIUS = 36;
	const FIELD_RADIUS = 24;
	const LABEL_FONT = '600 21px "IBM Plex Sans", "Avenir Next", sans-serif';
	const TITLE_FONT = '600 34px "IBM Plex Sans", "Avenir Next", sans-serif';
	const HERO_FONT = '600 72px "IBM Plex Sans", "Avenir Next", sans-serif';
	const VALUE_FONT = '600 42px "IBM Plex Sans", "Avenir Next", sans-serif';
	const BODY_FONT = '400 27px "IBM Plex Sans", "Avenir Next", sans-serif';
	const SMALL_BODY_FONT = '400 24px "IBM Plex Sans", "Avenir Next", sans-serif';

	type AccentTheme = {
		accent: string;
		accentSoft: string;
		accentGlow: string;
		surfaceGlow: string;
	};

	const modeThemes: Record<string, AccentTheme> = {
		People: {
			accent: '#f4b88f',
			accentSoft: 'rgba(244, 184, 143, 0.18)',
			accentGlow: 'rgba(244, 184, 143, 0.28)',
			surfaceGlow: 'rgba(244, 184, 143, 0.16)'
		},
		Pleasure: {
			accent: '#f0a58c',
			accentSoft: 'rgba(240, 165, 140, 0.18)',
			accentGlow: 'rgba(240, 165, 140, 0.28)',
			surfaceGlow: 'rgba(240, 165, 140, 0.14)'
		},
		Production: {
			accent: '#d3a463',
			accentSoft: 'rgba(211, 164, 99, 0.18)',
			accentGlow: 'rgba(211, 164, 99, 0.26)',
			surfaceGlow: 'rgba(211, 164, 99, 0.14)'
		},
		Reflection: {
			accent: '#b59cff',
			accentSoft: 'rgba(181, 156, 255, 0.18)',
			accentGlow: 'rgba(181, 156, 255, 0.26)',
			surfaceGlow: 'rgba(181, 156, 255, 0.14)'
		}
	};

	function getAccentTheme(mode: string | undefined): AccentTheme {
		return modeThemes[mode ?? ''] ?? modeThemes.Reflection;
	}

	function getSurfaceStyle(reading: IdentityReading | null) {
		const theme = getAccentTheme(reading?.primaryMode);

		return [
			`--accent:${theme.accent}`,
			`--accent-soft:${theme.accentSoft}`,
			`--accent-glow:${theme.accentGlow}`,
			`--surface-glow:${theme.surfaceGlow}`
		].join(';');
	}

	onMount(() => {
		const savedValue = sessionStorage.getItem(IDENTITY_RESULT_STORAGE_KEY);
		const savedEmail = localStorage.getItem(EMAIL_CAPTURE_STORAGE_KEY);

		if (savedEmail) {
			emailValue = savedEmail;
		}

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
			secondaryMode: reading.secondaryMode,
			corePattern: reading.corePattern,
			currentChallenge: reading.currentChallenge,
			growthVector: reading.growthVector,
			suggestedNextAction: reading.suggestedNextAction
		});
	}

	function createShareText(reading: IdentityReading) {
		return `My AXZIO ID: ${reading.archetype} • ${reading.primaryMode} • ${reading.growthVector}`;
	}

	function createWhyThisFits(reading: IdentityReading) {
		const secondaryMode = reading.secondaryMode.trim().toLowerCase();

		return `${reading.archetype} fits because your reading leans first toward ${reading.primaryMode.toLowerCase()} and is reinforced by ${secondaryMode}, which points to the pattern of ${reading.corePattern.trim().replace(/\.$/, '').toLowerCase()}. The move toward ${reading.growthVector.toLowerCase()} makes sense as the clearest direction for working through your current challenge.`;
	}

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function saveEmailCapture() {
		const normalizedEmail = emailValue.trim().toLowerCase();

		if (!normalizedEmail) {
			emailMessage = 'Enter an email if you want to save this for future inbox delivery.';
			return;
		}

		if (!isValidEmail(normalizedEmail)) {
			emailMessage = 'Enter a valid email address.';
			return;
		}

		localStorage.setItem(EMAIL_CAPTURE_STORAGE_KEY, normalizedEmail);
		emailValue = normalizedEmail;
		emailMessage = 'Saved locally on this device. Inbox delivery is coming soon.';
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

	function drawDivider(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number
	) {
		context.save();
		context.strokeStyle = 'rgba(255, 240, 224, 0.12)';
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x + width, y);
		context.stroke();
		context.restore();
	}

	function drawField(
		context: CanvasRenderingContext2D,
		label: string,
		value: string,
		x: number,
		y: number,
		width: number,
		height: number,
		options?: { body?: boolean; maxLines?: number; highlight?: boolean; theme?: AccentTheme }
	) {
		const theme = options?.theme ?? modeThemes.Reflection;
		const panelFill = options?.highlight ? 'rgba(26, 21, 32, 0.88)' : 'rgba(15, 13, 21, 0.82)';
		const border = options?.highlight ? 'rgba(255, 236, 212, 0.18)' : 'rgba(255, 236, 212, 0.1)';
		const glow = context.createRadialGradient(x + 44, y + 36, 0, x + 44, y + 36, width * 0.8);
		glow.addColorStop(0, theme.surfaceGlow);
		glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

		fillRoundedRect(context, x, y, width, height, FIELD_RADIUS, panelFill);
		context.save();
		drawRoundedRect(context, x, y, width, height, FIELD_RADIUS);
		context.clip();
		context.fillStyle = glow;
		context.fillRect(x, y, width, height);
		context.restore();
		strokeRoundedRect(context, x, y, width, height, FIELD_RADIUS, border, 2);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = options?.highlight ? 'rgba(255, 231, 203, 0.8)' : 'rgba(240, 220, 198, 0.72)';
		context.font = LABEL_FONT;
		context.fillText(label.toUpperCase(), x + 34, y + 26);

		context.fillStyle = '#f6efe7';

		if (options?.body) {
			context.font = SMALL_BODY_FONT;
			drawTextBlock(context, value, x + 34, y + 86, width - 68, 46, options.maxLines ?? 6);
		} else {
			context.font = VALUE_FONT;
			drawTextBlock(context, value, x + 34, y + 84, width - 68, 64, options?.maxLines ?? 2);
		}

		context.restore();
	}

	function drawHeroField(
		context: CanvasRenderingContext2D,
		label: string,
		value: string,
		x: number,
		y: number,
		width: number,
		height: number,
		theme: AccentTheme
	) {
		const heroGradient = context.createLinearGradient(x, y, x + width, y + height);
		heroGradient.addColorStop(0, 'rgba(16, 14, 24, 0.98)');
		heroGradient.addColorStop(1, 'rgba(36, 24, 37, 0.96)');

		fillRoundedRect(context, x, y, width, height, FIELD_RADIUS + 6, heroGradient);
		const glow = context.createRadialGradient(x + width * 0.18, y + height * 0.2, 0, x + width * 0.18, y + height * 0.2, width * 0.6);
		glow.addColorStop(0, theme.accentGlow);
		glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
		context.save();
		drawRoundedRect(context, x, y, width, height, FIELD_RADIUS + 6);
		context.clip();
		context.fillStyle = glow;
		context.fillRect(x, y, width, height);
		context.restore();
		strokeRoundedRect(context, x, y, width, height, FIELD_RADIUS + 6, 'rgba(255, 238, 212, 0.16)', 2);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = 'rgba(247, 228, 205, 0.82)';
		context.font = LABEL_FONT;
		context.fillText(label.toUpperCase(), x + 36, y + 34);
		context.fillStyle = '#fbf4eb';
		context.font = HERO_FONT;
		drawTextBlock(context, value, x + 36, y + 86, width - 72, 74, 2);
		context.restore();
	}

	async function renderCardBlob(reading: IdentityReading) {
		const theme = getAccentTheme(reading.primaryMode);

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

		const background = context.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
		background.addColorStop(0, '#090812');
		background.addColorStop(0.6, '#120e1a');
		background.addColorStop(1, '#1f1520');
		context.fillStyle = background;
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const glow = context.createRadialGradient(260, 160, 0, 260, 160, 500);
		glow.addColorStop(0, theme.accentGlow);
		glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const emberGlow = context.createRadialGradient(860, 820, 0, 860, 820, 440);
		emberGlow.addColorStop(0, 'rgba(241, 146, 88, 0.14)');
		emberGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
		context.fillStyle = emberGlow;
		context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

		const panelGradient = context.createLinearGradient(100, 100, CARD_WIDTH - 100, CARD_HEIGHT - 120);
		panelGradient.addColorStop(0, 'rgba(12, 11, 19, 0.96)');
		panelGradient.addColorStop(1, 'rgba(25, 20, 31, 0.94)');

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
			'rgba(255, 236, 212, 0.12)',
			2
		);

		context.save();
		context.textBaseline = 'top';
		context.fillStyle = 'rgba(245, 226, 203, 0.72)';
		context.font = LABEL_FONT;
		context.fillText('AXZIO ID', CARD_PADDING + 30, CARD_PADDING + 28);
		context.fillStyle = '#f7efe5';
		context.font = TITLE_FONT;
		context.fillText('Identity readout', CARD_PADDING + 30, CARD_PADDING + 66);

		const innerX = CARD_PADDING + 30;
		const innerY = CARD_PADDING + 122;
		const innerWidth = CARD_WIDTH - CARD_PADDING * 2 - 60;
		const columnGap = 20;
		const fieldWidth = (innerWidth - columnGap) / 2;

		drawHeroField(context, 'Archetype', reading.archetype, innerX, innerY, innerWidth, 194, theme);
		drawField(context, 'Primary Mode', reading.primaryMode, innerX, innerY + 214, fieldWidth, 158, {
			theme,
			maxLines: 2
		});
		drawField(
			context,
			'Secondary Mode',
			reading.secondaryMode,
			innerX + fieldWidth + columnGap,
			innerY + 214,
			fieldWidth,
			158,
			{ maxLines: 2, theme }
		);
		drawField(
			context,
			'Core Pattern',
			reading.corePattern,
			innerX,
			innerY + 392,
			innerWidth,
			194,
			{
				body: true,
				maxLines: 4,
				highlight: true,
				theme
			}
		);
		drawField(
			context,
			'Current Challenge',
			reading.currentChallenge,
			innerX,
			innerY + 606,
			innerWidth,
			132,
			{
				body: true,
				maxLines: 2,
				theme
			}
		);
		drawField(
			context,
			'Growth Vector',
			reading.growthVector,
			innerX,
			innerY + 758,
			fieldWidth,
			148,
			{ maxLines: 2, theme }
		);
		drawField(
			context,
			'Next Action',
			reading.suggestedNextAction,
			innerX + fieldWidth + columnGap,
			innerY + 758,
			fieldWidth,
			148,
			{
				body: true,
				maxLines: 3,
				highlight: true,
				theme
			}
		);

		drawDivider(context, innerX, CARD_HEIGHT - CARD_PADDING - 86, innerWidth);
		context.fillStyle = 'rgba(240, 220, 198, 0.72)';
		context.font = '500 20px "IBM Plex Sans", "Avenir Next", sans-serif';
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

<main class="shell" style={getSurfaceStyle(identityReading)}>
	<section class="panel">
		{#if identityReading}
			<header class="hero">
				<div class="hero-copy">
					<p class="eyebrow">AXZIO ID</p>
					<h1>{identityReading.archetype}</h1>
					<p class="subheading">
						A concise identity readout built from your current pattern, tension, and direction.
					</p>
				</div>

				<div class="hero-band">
					<div class="hero-pill signal-pill">
						<span>Primary</span>
						<strong>{identityReading.primaryMode}</strong>
					</div>
					<div class="hero-pill">
						<span>Secondary</span>
						<strong>{identityReading.secondaryMode}</strong>
					</div>
					<div class="hero-pill signal-pill">
						<span>Growth</span>
						<strong>{identityReading.growthVector}</strong>
					</div>
				</div>
			</header>

			<section class="result-layout">
				<div class="details-column">
					<section class="section tone-panel pattern-overview-panel">
						<p class="section-label">Current Identity Pattern</p>
						<div class="pattern-overview-grid">
							<article class="text-block lead-block">
								<h2>Core Pattern</h2>
								<p>{identityReading.corePattern}</p>
							</article>

							<article class="text-block why-card">
								<h2>Why this fits</h2>
								<p>{createWhyThisFits(identityReading)}</p>
							</article>
						</div>
					</section>

					<section class="section tone-panel tension-panel">
						<p class="section-label">Tension</p>
						<article class="text-block contrast-block">
							<h2>Current Challenge</h2>
							<p>{identityReading.currentChallenge}</p>
						</article>
					</section>

					<section class="section tone-panel direction-panel">
						<p class="section-label">Direction</p>
						<article class="direction-card">
							<h2>Growth Vector</h2>
							<p>{identityReading.growthVector}</p>
						</article>
					</section>

					<section class="section tone-panel action-panel">
						<p class="section-label">Suggested Next Action</p>
						<article class="direction-card action-card">
							<h2>Suggested Next Action</h2>
							<p>{identityReading.suggestedNextAction}</p>
						</article>
					</section>

					<div class="actions-panel">
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
					</div>

					<section class="section tone-panel email-panel">
						<p class="section-label">Send this reading to your inbox</p>
						<p class="supporting-copy email-copy">
							Keep a copy of your AXZIO ID and reading in your inbox.
						</p>

						<form class="email-form" on:submit|preventDefault={saveEmailCapture}>
							<label class="sr-only" for="reading-email">Email address</label>
							<input
								id="reading-email"
								class="email-input"
								type="email"
								name="email"
								placeholder="Enter your email"
								bind:value={emailValue}
								autocomplete="email"
							/>
							<button class="secondary-cta email-button" type="submit">Email me my AXZIO ID</button>
						</form>

						<p class="form-helper">Inbox delivery is coming soon.</p>

						{#if emailMessage}
							<p class="feedback">{emailMessage}</p>
						{/if}
					</section>
				</div>
			</section>
		{:else}
			<header class="hero">
				<p class="eyebrow">AXZIO ID</p>
				<h1>AXZIO ID</h1>
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
			radial-gradient(circle at top, rgba(124, 84, 214, 0.18), transparent 38%),
			radial-gradient(circle at 85% 20%, rgba(240, 164, 99, 0.12), transparent 30%),
			linear-gradient(180deg, #06050b 0%, #0c0913 44%, #130d16 100%);
		color: #f7efe5;
	}

	.shell {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.panel {
		width: min(100%, 74rem);
		display: grid;
		gap: 2rem;
	}

	.hero,
	.section {
		display: grid;
		gap: 1rem;
	}

	.eyebrow,
	.section-label,
	h2 {
		margin: 0;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(241, 221, 197, 0.68);
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 7vw, 5.4rem);
		line-height: 0.92;
		font-weight: 600;
		letter-spacing: -0.04em;
	}

	.hero {
		position: relative;
		overflow: hidden;
		padding: 2.5rem;
		border-radius: 2.2rem;
		background:
			radial-gradient(circle at top left, var(--accent-glow), transparent 34%),
			radial-gradient(circle at 82% 24%, rgba(238, 145, 89, 0.12), transparent 24%),
			linear-gradient(145deg, rgba(10, 9, 17, 0.96), rgba(24, 18, 30, 0.94));
		color: #f8f3ea;
		border: 1px solid rgba(255, 236, 212, 0.1);
		box-shadow:
			0 32px 80px rgba(0, 0, 0, 0.42),
			inset 0 1px 0 rgba(255, 245, 230, 0.05);
	}

	.hero-copy {
		display: grid;
		gap: 0.85rem;
		max-width: 42rem;
	}

	.hero .eyebrow {
		color: rgba(244, 225, 199, 0.72);
	}

	.subheading {
		margin: 0;
		max-width: 34rem;
		line-height: 1.65;
		color: rgba(247, 237, 226, 0.78);
	}

	.hero-band {
		display: grid;
		gap: 0.9rem;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.hero-pill {
		display: grid;
		gap: 0.35rem;
		padding: 1rem 1.1rem 1.05rem;
		border-radius: 1.25rem;
		background: rgba(255, 249, 241, 0.05);
		border: 1px solid rgba(255, 236, 212, 0.1);
		backdrop-filter: blur(14px);
	}

	.hero-pill span {
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(239, 222, 202, 0.6);
	}

	.hero-pill strong {
		font-size: clamp(1.15rem, 2vw, 1.5rem);
		letter-spacing: -0.03em;
	}

	.signal-pill {
		background:
			linear-gradient(180deg, var(--accent-soft), rgba(255, 249, 241, 0.04));
		border-color: color-mix(in srgb, var(--accent) 26%, rgba(255, 236, 212, 0.08));
	}

	.result-layout {
		display: grid;
		gap: 1.75rem;
	}

	.details-column {
		display: grid;
		gap: 1.35rem;
		width: min(100%, 56rem);
	}

	.tone-panel {
		padding: 1.6rem;
		border-radius: 1.75rem;
		background:
			radial-gradient(circle at top left, var(--surface-glow), transparent 34%),
			linear-gradient(180deg, rgba(15, 13, 22, 0.92), rgba(20, 16, 26, 0.9));
		border: 1px solid rgba(255, 236, 212, 0.08);
		box-shadow:
			0 20px 46px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 244, 227, 0.04);
	}

	.pattern-overview-panel,
	.email-panel {
		border-radius: 1.35rem;
		border: 1px solid rgba(255, 236, 212, 0.08);
	}

	.pattern-overview-panel {
		gap: 1.15rem;
	}

	.pattern-overview-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
	}

	.card-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.actions-panel {
		display: grid;
		gap: 0.85rem;
		padding-top: 0.55rem;
	}

	.text-block,
	.direction-card,
	.empty {
		padding: 1.3rem;
		border-radius: 1.35rem;
		background: rgba(255, 248, 240, 0.04);
		border: 1px solid rgba(255, 236, 212, 0.08);
	}

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

	.lead-block {
		padding: 1.55rem;
		background:
			radial-gradient(circle at top left, var(--accent-soft), transparent 42%),
			linear-gradient(145deg, rgba(19, 17, 29, 0.98), rgba(30, 22, 38, 0.94));
		border-color: rgba(255, 236, 212, 0.12);
		box-shadow: inset 0 0 0 1px rgba(255, 247, 235, 0.03);
	}

	.why-card {
		padding: 1.45rem;
		background:
			linear-gradient(145deg, rgba(20, 17, 28, 0.96), rgba(16, 14, 23, 0.92));
	}

	.contrast-block {
		padding: 1.45rem 1.4rem;
		background:
			linear-gradient(145deg, rgba(22, 16, 25, 0.96), rgba(31, 20, 20, 0.92));
	}

	.direction-panel .direction-card {
		padding: 1.2rem 1.3rem 1.35rem;
		max-width: 24rem;
	}

	.action-card {
		padding: 1.45rem;
		background:
			radial-gradient(circle at top left, var(--accent-glow), transparent 36%),
			linear-gradient(145deg, rgba(15, 13, 23, 0.98), rgba(31, 21, 29, 0.94));
		border-color: color-mix(in srgb, var(--accent) 22%, rgba(255, 236, 212, 0.08));
		box-shadow:
			0 18px 40px rgba(0, 0, 0, 0.24),
			inset 0 1px 0 rgba(255, 244, 227, 0.05);
	}

	.action-card h2,
	.action-card p {
		color: #f5eee3;
	}

	.action-panel .action-card p,
	.direction-panel .direction-card p {
		font-size: clamp(1.4rem, 3vw, 2.15rem);
	}

	.supporting-copy {
		margin: 0;
		max-width: 46rem;
		line-height: 1.72;
		color: rgba(245, 237, 228, 0.8);
	}

	.email-panel {
		padding: 1.3rem 1.4rem;
		background:
			linear-gradient(145deg, rgba(17, 14, 24, 0.92), rgba(14, 12, 20, 0.88));
	}

	.email-copy {
		max-width: 34rem;
	}

	.email-form {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
	}

	.form-helper {
		margin: -0.1rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: rgba(240, 220, 198, 0.58);
	}

	.email-input {
		min-width: 0;
		padding: 0.95rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 236, 212, 0.12);
		background: rgba(255, 248, 240, 0.05);
		color: #f7efe5;
		font: inherit;
	}

	.email-input::placeholder {
		color: rgba(240, 220, 198, 0.46);
	}

	.email-input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.email-button {
		white-space: nowrap;
	}

	.text-block p,
	.empty {
		margin: 0;
		line-height: 1.7;
		color: rgba(245, 237, 228, 0.88);
	}

	.pattern-overview-panel .lead-block p {
		font-size: clamp(1.08rem, 1.5vw, 1.22rem);
		line-height: 1.82;
		max-width: 48rem;
	}

	.tension-panel .contrast-block p {
		color: rgba(244, 226, 210, 0.82);
	}

	.feedback {
		margin: -0.25rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(240, 220, 198, 0.72);
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
		background:
			linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #f19258 40%));
		color: #140f11;
		text-decoration: none;
		box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
	}

	.secondary-cta {
		border: 1px solid rgba(255, 236, 212, 0.12);
		background: rgba(255, 248, 240, 0.05);
		color: #f7efe5;
		cursor: pointer;
	}

	.cta:hover,
	.cta:focus-visible {
		transform: translateY(-1px);
	}

	.cta:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.secondary-cta:hover,
	.secondary-cta:focus-visible {
		background: rgba(255, 248, 240, 0.08);
		border-color: rgba(255, 236, 212, 0.22);
		transform: translateY(-1px);
	}

	.secondary-cta:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.secondary-cta:disabled {
		cursor: progress;
		opacity: 0.72;
		transform: none;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 760px) {
		.hero-band,
		.result-layout,
		.pattern-overview-grid,
		.email-form {
			grid-template-columns: 1fr;
		}

		.result-layout {
			gap: 1.25rem;
		}
	}

	@media (max-width: 640px) {
		.shell {
			padding: 1.5rem;
		}

		.panel {
			gap: 1.5rem;
		}

		.hero,
		.tone-panel {
			padding: 1.25rem;
			border-radius: 1.4rem;
		}

		.card-actions {
			display: grid;
		}

		.cta,
		.email-button,
		.secondary-cta {
			width: 100%;
			justify-self: stretch;
		}
	}
</style>
