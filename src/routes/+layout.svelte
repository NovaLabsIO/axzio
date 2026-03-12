<slot />

<style>
	:global(:root) {
		--app-bg: #07070d;
		--app-bg-deep: #0d0c14;
		--app-bg-mid: #15111c;
		--app-accent: #f4b88f;
		--app-accent-strong: #f19258;
		--app-accent-soft: rgba(244, 184, 143, 0.18);
		--app-text: #f7efe5;
		--app-text-muted: rgba(244, 230, 210, 0.76);
		--app-text-soft: rgba(244, 230, 210, 0.62);
		--app-border: rgba(255, 236, 212, 0.1);
		--app-panel: rgba(15, 13, 22, 0.84);
		--app-panel-strong: rgba(18, 15, 27, 0.92);
		--app-input: rgba(255, 248, 240, 0.05);
		--app-shadow: 0 30px 70px rgba(0, 0, 0, 0.34);
	}

	:global(html) {
		background-color: var(--app-bg);
		color: var(--app-text);
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		font-family:
			"IBM Plex Sans",
			"Avenir Next",
			sans-serif;
		background-color: var(--app-bg);
		background-image:
			radial-gradient(circle at top, rgba(118, 92, 199, 0.18), transparent 30%),
			radial-gradient(circle at 82% 16%, rgba(241, 146, 88, 0.14), transparent 24%),
			radial-gradient(circle at 18% 82%, rgba(108, 149, 214, 0.12), transparent 26%),
			linear-gradient(180deg, var(--app-bg) 0%, var(--app-bg-deep) 42%, var(--app-bg-mid) 100%);
		background-attachment: fixed;
		color: var(--app-text);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(a),
	:global(button),
	:global(input),
	:global(textarea) {
		font: inherit;
	}
</style>
