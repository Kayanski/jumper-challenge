import { usePathname } from "next/navigation";

export function PageToggle() {
    const pathname = usePathname()
    if (!pathname) return <div></div>

    return (
        <div
            style={{
                display: 'inline-flex',
                gap: 8,
                background: '#f1f5f9',
                padding: 4,
                borderRadius: 999,
                alignItems: 'center',
            }}
            role="tablist"
            aria-label="Page toggle"
        >
            <button
                onClick={() => {
                    if (!pathname || pathname.includes('leaderboard')) {
                        window.location.assign('/');
                    }
                }}
                title="Balance"
                aria-pressed={(!pathname.includes('leaderboard')).toString()}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 0,
                    borderRadius: 999,
                    background: pathname.includes('leaderboard') ? 'transparent' : '#ffffff',
                    boxShadow: pathname.includes('leaderboard') ? 'none' : '0 6px 18px rgba(16,24,40,0.08)',
                    cursor: 'pointer',
                    color: '#0f172a',
                    fontWeight: 600,
                }}
            >
                <span style={{ fontSize: 14 }}>Balance</span>
            </button>

            <button
                onClick={() => {
                    if (!pathname.includes('leaderboard')) {
                        window.location.assign('/leaderboard');
                    }
                }}
                title="Leaderboard"
                aria-pressed={(pathname.includes('leaderboard')).toString()}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 0,
                    borderRadius: 999,
                    background: pathname.includes('leaderboard') ? '#ffffff' : 'transparent',
                    boxShadow: pathname.includes('leaderboard') ? '0 6px 18px rgba(16,24,40,0.08)' : 'none',
                    cursor: 'pointer',
                    color: '#0f172a',
                    fontWeight: 600,
                }}
            >
                <span style={{ fontSize: 14 }}>Leaderboard</span>
            </button>
        </div>
    )
}