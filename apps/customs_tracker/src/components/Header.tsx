
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

export default async function Header() {
    const supabase = await createClient();

    // Get User
    const { data: { user } } = await supabase.auth.getUser();

    let creditBalance = 0;

    if (user) {
        // Get Balance
        const { data: profile } = await supabase
            .from('profiles')
            .select('credit_balance')
            .eq('user_id', user.id)
            .single();

        if (profile) {
            creditBalance = profile.credit_balance;
        }
    }

    return (
        <header className="w-full max-w-5xl p-6 flex justify-between items-center border-b border-gray-200 bg-white mb-8">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-blue-600 transition-colors">
                📦 CustomsTracker
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</span>
                            <span className={`text-xs ${creditBalance > 0 ? 'text-green-600 font-bold' : 'text-red-500'}`}>
                                Wallet: {creditBalance} Credits
                            </span>
                        </div>
                        <form action={async () => {
                            "use server";
                            const sb = await createClient();
                            await sb.auth.signOut();
                        }}>
                            <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Login / Sign Up
                    </Link>
                )}
            </div>
        </header>
    );
}
