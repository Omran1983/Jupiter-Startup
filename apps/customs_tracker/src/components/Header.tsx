
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
        <header className="w-full max-w-5xl p-6 flex justify-between items-center bg-transparent mb-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                <span className="bg-blue-600 text-white p-1 rounded">📦</span> CustomsTracker
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-8 mr-auto">
                <Link href="/tools/hs-code" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    HS Code Detective
                </Link>
                <Link href="/templates" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    Claim Templates
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-sm font-medium text-slate-200">{user.email?.split('@')[0]}</span>
                            <span className={`text-xs ${creditBalance > 0 ? 'text-green-400 font-bold' : 'text-red-400'}`}>
                                Wallet: {creditBalance} Credits
                            </span>
                        </div>
                        <form action={async () => {
                            "use server";
                            const sb = await createClient();
                            await sb.auth.signOut();
                        }}>
                            <button className="text-sm text-slate-500 hover:text-red-400 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="text-sm font-semibold bg-white/10 backdrop-blur text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
                    >
                        Login / Sign Up
                    </Link>
                )}
            </div>
        </header>
    );
}
