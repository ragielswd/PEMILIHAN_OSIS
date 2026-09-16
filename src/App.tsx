import { useState, useCallback } from 'react';
import { School } from 'lucide-react';
import type { View } from '@/types';
import {
  useCandidates, useVotes, useUsedTokens, useTokenList,
} from '@/hooks/useElectionData';
import { STORAGE_KEYS, SCHOOL_NAME, APP_TITLE } from '@/constants';
import Navbar from '@/components/Navbar';
import VoteView from '@/components/VoteView';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import QuickCountView from '@/components/QuickCountView';

function App() {
  const [view, setView] = useState<View>('vote');
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    } catch {
      return false;
    }
  });

  const { candidates, addCandidate, updateCandidate, deleteCandidate, resetCandidates } =
    useCandidates();
  const { votes, addVote, resetVotes, getVoteCount } = useVotes();
  const { usedTokens, markTokenUsed, isTokenUsed, resetUsedTokens } = useUsedTokens();
  const { tokens, loading: tokensLoading, error: tokensError } = useTokenList();

  const handleNavigate = (v: View) => {
    setView(v);
    if (v !== 'vote') setActiveToken(null);
  };

  const validateToken = useCallback(
    (token: string): { valid: boolean; error?: string } => {
      if (!tokensLoading && tokens.length > 0 && !tokens.includes(token)) {
        return { valid: false, error: 'Token tidak valid atau sudah digunakan!' };
      }
      if (isTokenUsed(token)) {
        return { valid: false, error: 'Token tidak valid atau sudah digunakan!' };
      }
      return { valid: true };
    },
    [tokens, tokensLoading, isTokenUsed]
  );

  const handleVote = (candidateId: string, token: string) => {
    addVote(candidateId, token);
    markTokenUsed(token);
  };

  const handleAdminLogin = () => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ADMIN_SESSION,
        JSON.stringify({ username: 'admin', loginTime: Date.now() })
      );
    } catch {
      /* ignore */
    }
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    } catch {
      /* ignore */
    }
    setIsAdmin(false);
    setView('vote');
  };

  const handleSetActiveToken = (token: string | null) => {
    setActiveToken(token);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar view={view} onNavigate={handleNavigate} />

      {view === 'vote' && (
        <VoteView
          activeToken={activeToken}
          onSetActiveToken={handleSetActiveToken}
          validateToken={validateToken}
          tokensLoading={tokensLoading}
          tokensError={tokensError}
          candidates={candidates}
          onVote={handleVote}
        />
      )}

      {view === 'quickcount' && (
        <QuickCountView
          candidates={candidates}
          getVoteCount={getVoteCount}
        />
      )}

      {view === 'admin' && !isAdmin && (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('vote')} />
      )}

      {view === 'admin' && isAdmin && (
        <AdminDashboard
          candidates={candidates}
          onAddCandidate={addCandidate}
          onUpdateCandidate={updateCandidate}
          onDeleteCandidate={deleteCandidate}
          onResetCandidates={resetCandidates}
          onResetVotes={resetVotes}
          onResetUsedTokens={resetUsedTokens}
          onLogout={handleAdminLogout}
          getVoteCount={getVoteCount}
        />
      )}

      {/* Footer */}
      {view !== 'quickcount' && (
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-royal-500" />
                <span>{SCHOOL_NAME} — {APP_TITLE}</span>
              </div>
              <p>© {new Date().getFullYear()} Sistem E-Voting SMPN 36 Samarinda</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
