
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // SAFETY CHECK: Safe Mode for missing credentials
    // Returns a "Mock" client that pretends to be logged out
    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase Env Vars missing. Using Mock Client (Logged Out).");
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signOut: async () => ({ error: null }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null })
                    })
                })
            })
        } as any;
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }: { name: string, value: string, options: CookieOptions }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
