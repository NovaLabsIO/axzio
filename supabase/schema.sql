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
	email text,
	user_agent text not null default '',
	captured_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.axzio_feedback (
	id bigint generated always as identity primary key,
	result_id bigint not null references public.axzio_results(id) on delete cascade,
	feedback_choice text not null check (feedback_choice in ('Yes', 'Somewhat', 'No')),
	feedback_text text not null default '',
	user_agent text not null default '',
	captured_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.axzio_email_submissions (
	id bigint generated always as identity primary key,
	result_id bigint not null references public.axzio_results(id) on delete cascade,
	email text not null,
	user_agent text not null default '',
	captured_at timestamptz not null default timezone('utc', now())
);
