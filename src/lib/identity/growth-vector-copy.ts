const growthVectorPhrases = {
	Launch: {
		infinitive: 'to launch',
		hero: 'Your growth focus right now is to launch something tangible instead of waiting for perfect certainty.',
		why: 'Your current pattern points toward launching something concrete rather than circling it longer.',
		direction:
			'The clearest next move right now is to launch something concrete and turn reflection into visible action.'
	},
	Clarify: {
		infinitive: 'to clarify',
		hero: 'Your growth focus right now is to clarify what matters most and cut through excess noise.',
		why: 'Your current pattern points toward clarifying what matters most before taking on more.',
		direction:
			'The clearest next move right now is to clarify what matters most and simplify until the next step is obvious.'
	},
	Connect: {
		infinitive: 'to connect',
		hero: 'Your growth focus right now is to connect more directly with the people, support, or conversations that can move this forward.',
		why: 'Your current pattern points toward connecting with the right people or support instead of carrying this alone.',
		direction:
			'The clearest next move right now is to connect with the people, support, or conversations that can move this forward.'
	},
	Explore: {
		infinitive: 'to explore',
		hero: 'Your growth focus right now is to explore before locking yourself into one fixed answer.',
		why: 'Your current pattern points toward exploring possibilities before forcing a final decision.',
		direction:
			'The clearest next move right now is to explore what opens up before you narrow the path.'
	},
	Stabilize: {
		infinitive: 'to stabilize',
		hero: 'Your growth focus right now is to stabilize what is already in motion so it can hold.',
		why: 'Your current pattern points toward stabilizing before expanding further.',
		direction:
			'Before expanding further, creating more steadiness will likely give this momentum room to hold.'
	},
	Transform: {
		infinitive: 'to transform',
		hero: 'Your growth focus right now is to transform the way you are approaching this season, not just refine it.',
		why: 'Your current pattern points toward transforming the structure beneath this moment, not just adjusting the surface.',
		direction:
			'The clearest next move right now is to make a deeper shift in how you are approaching this season, not just refine the surface.'
	}
} as const;

type GrowthVectorKey = keyof typeof growthVectorPhrases;

function getGrowthVectorEntry(vector: string) {
	return growthVectorPhrases[vector as GrowthVectorKey];
}

export function getGrowthVectorInfinitive(vector: string) {
	return getGrowthVectorEntry(vector)?.infinitive ?? `to ${vector.trim().toLowerCase()}`;
}

export function getGrowthVectorHeroCopy(vector: string) {
	return (
		getGrowthVectorEntry(vector)?.hero ??
		`Your growth focus right now is ${getGrowthVectorInfinitive(vector)} in a way that feels grounded and workable.`
	);
}

export function getGrowthVectorWhyCopy(vector: string) {
	return (
		getGrowthVectorEntry(vector)?.why ??
		`Your current pattern points toward ${vector.trim().toLowerCase()} as the most useful next shift.`
	);
}

export function getGrowthVectorDirectionCopy(vector: string) {
	return (
		getGrowthVectorEntry(vector)?.direction ??
		`The clearest next move right now is to ${vector.trim().toLowerCase()}.`
	);
}
