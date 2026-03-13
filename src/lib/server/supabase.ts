import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';

function requireEnv(value: string | undefined, name: string) {
	if (!value) {
		throw new Error(`The server is missing ${name}.`);
	}

	return value;
}

export function createSupabaseAdminClient() {
	const url = requireEnv(publicEnv.PUBLIC_SUPABASE_URL, 'PUBLIC_SUPABASE_URL');
	const serviceRoleKey = requireEnv(
		privateEnv.SUPABASE_SERVICE_ROLE_KEY,
		'SUPABASE_SERVICE_ROLE_KEY'
	);

	return createClient(url, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});
}
