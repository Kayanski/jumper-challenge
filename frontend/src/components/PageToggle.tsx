export function PageToggle() {
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
                    if (!window.location.pathname || window.location.pathname.includes('leaderboard')) {
                        window.location.assign('/');
                    }
                }}
                title="Balance"
                aria-pressed={(!window.location.pathname.includes('leaderboard')).toString()}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 0,
                    borderRadius: 999,
                    background: window.location.pathname.includes('leaderboard') ? 'transparent' : '#ffffff',
                    boxShadow: window.location.pathname.includes('leaderboard') ? 'none' : '0 6px 18px rgba(16,24,40,0.08)',
                    cursor: 'pointer',
                    color: '#0f172a',
                    fontWeight: 600,
                }}
            >
                <span style={{ fontSize: 14 }}>Balance</span>
            </button>

            <button
                onClick={() => {
                    if (!window.location.pathname.includes('leaderboard')) {
                        window.location.assign('/leaderboard');
                    }
                }}
                title="Leaderboard"
                aria-pressed={(window.location.pathname.includes('leaderboard')).toString()}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: 0,
                    borderRadius: 999,
                    background: window.location.pathname.includes('leaderboard') ? '#ffffff' : 'transparent',
                    boxShadow: window.location.pathname.includes('leaderboard') ? '0 6px 18px rgba(16,24,40,0.08)' : 'none',
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