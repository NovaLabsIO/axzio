import type { ModesQuestion } from './types';

export const MODES_QUESTIONS: readonly ModesQuestion[] = [
	{
		id: 'pressure-default',
		prompt: 'When pressure rises, what do you reach for first to regain steadiness?',
		options: [
			{
				id: 'pressure-people',
				mode: 'People',
				label: 'People',
				description: 'Talk it through, support someone, or re-anchor through connection.'
			},
			{
				id: 'pressure-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'Look for relief, comfort, beauty, or something that feels alive again.'
			},
			{
				id: 'pressure-production',
				mode: 'Production',
				label: 'Production',
				description: 'Organize the next move and create momentum through action.'
			},
			{
				id: 'pressure-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'Step back, think clearly, and make sense of what is actually happening.'
			}
		]
	},
	{
		id: 'energy-source',
		prompt: 'What most reliably restores your energy when you have some space again?',
		options: [
			{
				id: 'energy-people',
				mode: 'People',
				label: 'People',
				description: 'Warm contact, shared attention, or feeling meaningfully with others.'
			},
			{
				id: 'energy-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'Enjoyment, sensory relief, play, or something emotionally nourishing.'
			},
			{
				id: 'energy-production',
				mode: 'Production',
				label: 'Production',
				description: 'Finishing something useful and seeing visible progress.'
			},
			{
				id: 'energy-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'Silence, perspective, or time to process what matters.'
			}
		]
	},
	{
		id: 'self-worth',
		prompt: 'When your week feels meaningful, what is usually most true underneath it?',
		options: [
			{
				id: 'worth-people',
				mode: 'People',
				label: 'People',
				description: 'You showed up well in your relationships and felt connected.'
			},
			{
				id: 'worth-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'You felt alive, present, and emotionally fed rather than just functional.'
			},
			{
				id: 'worth-production',
				mode: 'Production',
				label: 'Production',
				description: 'You built momentum and moved important work forward.'
			},
			{
				id: 'worth-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'You understood yourself better and acted with more inner clarity.'
			}
		]
	},
	{
		id: 'blind-spot',
		prompt: 'What do you most often neglect when you are running on autopilot?',
		options: [
			{
				id: 'blind-people',
				mode: 'People',
				label: 'People',
				description: 'Connection softens because tasks or self-protection take over.'
			},
			{
				id: 'blind-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'Enjoyment gets postponed until you feel depleted or flat.'
			},
			{
				id: 'blind-production',
				mode: 'Production',
				label: 'Production',
				description: 'Execution stalls because everything stays in intention or emotion.'
			},
			{
				id: 'blind-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'You keep moving without pausing long enough to understand the pattern.'
			}
		]
	},
	{
		id: 'natural-strength',
		prompt: 'Which pattern most naturally feels like your strongest operating edge?',
		options: [
			{
				id: 'strength-people',
				mode: 'People',
				label: 'People',
				description: 'Reading the room, responding well, and caring through relationship.'
			},
			{
				id: 'strength-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'Following what feels vivid, restorative, and emotionally true.'
			},
			{
				id: 'strength-production',
				mode: 'Production',
				label: 'Production',
				description: 'Creating structure, progress, and clear next steps.'
			},
			{
				id: 'strength-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'Seeing patterns, distilling meaning, and thinking with depth.'
			}
		]
	},
	{
		id: 'course-correction',
		prompt: 'When you know something needs to change, how do you usually begin the shift?',
		options: [
			{
				id: 'course-people',
				mode: 'People',
				label: 'People',
				description: 'You look at the relational impact and talk it through with someone.'
			},
			{
				id: 'course-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'You notice what feels heavy or deadening and move toward what feels truer.'
			},
			{
				id: 'course-production',
				mode: 'Production',
				label: 'Production',
				description: 'You define the next move and start building traction quickly.'
			},
			{
				id: 'course-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'You step back first, reframe the situation, and clarify what is real.'
			}
		]
	},
	{
		id: 'overuse-pattern',
		prompt: 'Which pattern can become too dominant when you are not well-balanced?',
		options: [
			{
				id: 'overuse-people',
				mode: 'People',
				label: 'People',
				description: 'You over-accommodate, absorb too much, or lose your own center.'
			},
			{
				id: 'overuse-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'You drift toward comfort, distraction, or avoiding what feels hard.'
			},
			{
				id: 'overuse-production',
				mode: 'Production',
				label: 'Production',
				description: 'You keep pushing, optimizing, or doing instead of listening.'
			},
			{
				id: 'overuse-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'You overthink, hesitate, or stay in interpretation too long.'
			}
		]
	},
	{
		id: 'growth-edge',
		prompt: 'Which mode would most improve your overall operating balance if strengthened now?',
		options: [
			{
				id: 'growth-people',
				mode: 'People',
				label: 'People',
				description: 'More warmth, support, and relational honesty would help most.'
			},
			{
				id: 'growth-pleasure',
				mode: 'Pleasure',
				label: 'Pleasure',
				description: 'More aliveness, enjoyment, and emotional nourishment would help most.'
			},
			{
				id: 'growth-production',
				mode: 'Production',
				label: 'Production',
				description: 'More movement, execution, and visible progress would help most.'
			},
			{
				id: 'growth-reflection',
				mode: 'Reflection',
				label: 'Reflection',
				description: 'More perspective, sense-making, and inner clarity would help most.'
			}
		]
	}
] as const;
