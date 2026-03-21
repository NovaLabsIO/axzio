export const PILLARS = ['body', 'mind', 'heart', 'spirit'] as const;
export const TIMEFRAMES = ['today', 'week', 'month', 'quarter', 'year'] as const;
export const TARGET_MODES = ['restore', 'maintain', 'custom', 'growth'] as const;

export type Pillar = (typeof PILLARS)[number];
export type Timeframe = (typeof TIMEFRAMES)[number];
export type TargetMode = (typeof TARGET_MODES)[number];

export type PillarValues = Record<Pillar, number>;

export type PillarsDraft = {
	timeframe: Timeframe;
	targetMode: TargetMode;
	currentRaw: PillarValues;
	targetRaw: PillarValues;
	currentScore: PillarValues;
	targetScore: PillarValues;
	updatedAt: string;
};

export const PILLAR_LABELS: Record<Pillar, string> = {
	body: 'Body',
	mind: 'Mind',
	heart: 'Heart',
	spirit: 'Spirit'
};

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
	today: 'Today',
	week: 'Week',
	month: 'Month',
	quarter: 'Quarter',
	year: 'Year'
};

export const TARGET_MODE_LABELS: Record<TargetMode, string> = {
	restore: 'Restore Balance',
	maintain: 'Maintain Rhythm',
	custom: 'Set Custom',
	growth: 'Shift Toward Growth Goal'
};
