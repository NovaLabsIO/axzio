export const REFLECTION_QUESTIONS = [
	'What activities make you lose track of time?',
	'What frustrates you most about your life right now?',
	'When do you feel most alive?',
	'What do people rely on you for?',
	'What kind of work feels meaningful to you?',
	'What do you want more of in your life right now?',
	'What drains your energy most consistently?',
	'What do you wish people understood about you?',
	'What are you currently trying to build or improve?',
	'What impact would you like to have on others?'
] as const;

export type ReflectionQuestion = (typeof REFLECTION_QUESTIONS)[number];
