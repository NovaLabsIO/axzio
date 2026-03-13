import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';

export type SupabaseAdminContext = {
	client: ReturnType<typeof createClient<any>>;
	hostname: string;
	url: string;
	serviceRoleKey: string;
};

function sanitizeLogValue(value: string) {
	return value.replace(/\s+/g, ' ').trim().slice(0, 240);
}

function logSupabaseStage(stage: string, details: Record<string, unknown>) {
	const parts = Object.entries(details)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${String(value)}`);

	console.info(`[capture] ${stage}${parts.length > 0 ? ` ${parts.join(' ')}` : ''}`);
}

function requireEnv(value: string | undefined, name: string) {
	if (!value) {
		throw new Error(`The server is missing ${name}.`);
	}

	return value.trim();
}

function parseSupabaseUrl(url: string) {
	try {
		const parsedUrl = new URL(url);

		logSupabaseStage('supabase_url_parse_succeeded', {
			host: parsedUrl.hostname
		});

		return parsedUrl;
	} catch (error) {
		const message = sanitizeLogValue(
			error instanceof Error ? error.message : 'Unknown URL parse error'
		);

		logSupabaseStage('supabase_url_parse_failed', {
			message
		});

		throw new Error(`Invalid PUBLIC_SUPABASE_URL: ${message}`);
	}
}

export function createSupabaseAdminContext(): SupabaseAdminContext {
	const url = requireEnv(publicEnv.PUBLIC_SUPABASE_URL, 'PUBLIC_SUPABASE_URL');
	const serviceRoleKey = requireEnv(
		privateEnv.SUPABASE_SERVICE_ROLE_KEY,
		'SUPABASE_SERVICE_ROLE_KEY'
	);
	const parsedUrl = parseSupabaseUrl(url);

	try {
		const client = createClient(url, serviceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});

		logSupabaseStage('supabase_client_create_succeeded', {
			host: parsedUrl.hostname
		});

		return {
			client,
			hostname: parsedUrl.hostname,
			url,
			serviceRoleKey
		};
	} catch (error) {
		const message = sanitizeLogValue(
			error instanceof Error ? error.message : 'Unknown client creation error'
		);

		logSupabaseStage('supabase_client_create_failed', {
			host: parsedUrl.hostname,
			message
		});

		throw new Error(`Unable to create Supabase admin client: ${message}`);
	}
}

export async function probeSupabaseConnectivity(context: SupabaseAdminContext) {
	logSupabaseStage('connectivity_probe_start', {
		host: context.hostname
	});

	try {
		const response = await fetch(`${context.url}/rest/v1/`, {
			method: 'GET',
			headers: {
				apikey: context.serviceRoleKey,
				Authorization: `Bearer ${context.serviceRoleKey}`,
				'x-client-info': 'axzio-capture-probe'
			}
		});

		logSupabaseStage('connectivity_probe_succeeded', {
			host: context.hostname,
			status: response.status
		});
	} catch (error) {
		const message = sanitizeLogValue(
			error instanceof Error ? error.message : 'Unknown connectivity probe error'
		);

		logSupabaseStage('connectivity_probe_failed', {
			host: context.hostname,
			message
		});

		throw new Error(`Supabase connectivity probe failed: ${message}`);
	}
}
