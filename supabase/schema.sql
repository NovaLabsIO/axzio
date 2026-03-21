create table if not exists public.axzio_results (
	id bigint generated always as identity primary key,
	archetype text not null,
	primary_mode text not null,
	secondary_mode text not null,
	growth_focus text not null,
	core_pattern text not null,
	current_challenge text not null,
	suggested_next_action text not null,
	card_snapshot jsonb not null,
	prompt_version text not null,
	user_agent text not null default '',
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.axzio_feedback (
	id bigint generated always as identity primary key,
	result_id bigint not null references public.axzio_results(id) on delete cascade,
	feedback_choice text not null check (feedback_choice in ('Yes', 'Somewhat', 'No')),
	feedback_text text not null default '',
	user_agent text not null default '',
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.axzio_email_submissions (
	id bigint generated always as identity primary key,
	result_id bigint not null references public.axzio_results(id) on delete cascade,
	email text not null,
	user_agent text not null default '',
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.axzio_pillars_feedback (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	sentiment text check (sentiment in ('Helpful', 'Somewhat Helpful', 'Not Helpful')) not null,
	notes text not null default '',
	email text not null default '',
	timeframe text not null,
	target_mode text not null,
	current_score jsonb not null,
	target_score jsonb not null,
	user_agent text not null default ''
);

alter table public.axzio_pillars_feedback enable row level security;
