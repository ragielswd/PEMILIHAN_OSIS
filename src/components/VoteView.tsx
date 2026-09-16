import { useState } from 'react';
import { Vote as VoteIcon, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

import type { Candidate } from '@/types';
import { SCHOOL_NAME, APP_TITLE, SCHOOL_LOGO_URL } from '@/constants';
import TokenForm from '@/components/TokenForm';
import CandidateCard from '@/components/CandidateCard';
import { ConfirmVoteModal, SuccessModal } from '@/components/Modals';

interface VoteViewProps {
  activeToken: string | null;
  onSetActiveToken: (token: string | null) => void;
  validateToken: (token: string) => { valid: boolean; error?: string };
  tokensLoading: boolean;
  tokensError: string | null;
  candidates: Candidate[];
  onVote: (candidateId: string, token: string) => void;
}

export default function VoteView({
  activeToken,
  onSetActiveToken,
  validateToken,
  tokensLoading,
  tokensError,
  candidates,
  onVote,
}: VoteViewProps) {
  const [confirmCandidate, setConfirmCandidate] = useState<Candidate | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');
  const [redirectCount, setRedirectCount] = useState(4);

  const handleConfirmVote = () => {
    if (!confirmCandidate || !activeToken) return;
    onVote(confirmCandidate.id, activeToken);
    setSuccessName(confirmCandidate.namaLengkap);
    setConfirmCandidate(null);
    setShowSuccess(true);
    setRedirectCount(4);

    const interval = setInterval(() => {
      setRedirectCount((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setShowSuccess(false);
          onSetActiveToken(null);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const sortedCandidates = [...candidates].sort((a, b) => a.nomorUrut - b.nomorUrut);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      {!activeToken && (
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-royal-800">
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-royal-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex flex-col items-center text-center mb-12">
              <img
                src={SCHOOL_LOGO_URL}
                alt="Logo SMPN 36 Samarinda"
                className="w-20 h-20 rounded-2xl object-contain bg-white p-1.5 mb-5 ring-4 ring-white/10 shadow-xl animate-fade-in-up"
              />
              <p className="text-sm font-semibold text-royal-200 uppercase tracking-widest mb-2 animate-fade-in-up">
                {SCHOOL_NAME}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display mb-4 animate-fade-in-up max-w-3xl leading-tight">
                {APP_TITLE}
              </h1>
              <p className="text-base text-slate-300 max-w-xl animate-fade-in-up">
                Gunakan token unik Anda untuk memilih calon Ketua OSIS. Satu token,
                satu suara — suara Anda menentukan masa depan sekolah.
              </p>
            </div>

            {/* Token Form */}
            <TokenForm
              onValidToken={onSetActiveToken}
              validateToken={validateToken}
              tokensLoading={tokensLoading}
              tokensError={tokensError}
            />

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Token Terenkripsi</span>
              </div>
              <div className="flex items-center gap-2">
                <VoteIcon className="w-4 h-4 text-royal-300" />
                <span>Satu Token, Satu Suara</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Hasil Real-time</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Candidate Selection */}
      {activeToken && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              Token Terverifikasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display mb-2">
              Pilih Calon Ketua OSIS
            </h2>
            <p className="text-sm text-slate-500">
              Tinjau visi dan misi setiap kandidat, lalu pilih satu yang terbaik.
            </p>
          </div>

          {sortedCandidates.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-400">Belum ada kandidat yang terdaftar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCandidates.map((c) => (
                <CandidateCard key={c.id} candidate={c} onVote={setConfirmCandidate} />
              ))}
            </div>
          )}

          {/* Cancel voting */}
          <div className="mt-8 text-center">
            <button
              onClick={() => onSetActiveToken(null)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
            >
              Batalkan dan kembali
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Modals */}
      <ConfirmVoteModal
        candidate={confirmCandidate}
        onClose={() => setConfirmCandidate(null)}
        onConfirm={handleConfirmVote}
      />
      <SuccessModal
        show={showSuccess}
        candidateName={successName}
        redirectSeconds={redirectCount}
      />
    </div>
  );
}
