import { useState } from 'react';
import { AlertCircle, Loader2, KeyRound, ArrowRight } from 'lucide-react';

interface TokenFormProps {
  onValidToken: (token: string) => void;
  validateToken: (token: string) => { valid: boolean; error?: string };
  tokensLoading: boolean;
  tokensError: string | null;
}

export default function TokenForm({
  onValidToken,
  validateToken,
  tokensLoading,
  tokensError,
}: TokenFormProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();

    if (!trimmed) {
      setError('Token tidak boleh kosong!');
      triggerShake();
      return;
    }

    const result = validateToken(trimmed);
    if (!result.valid) {
      setError(result.error || 'Token tidak valid atau sudah digunakan!');
      triggerShake();
      return;
    }

    setError(null);
    onValidToken(trimmed);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="card p-6 sm:p-8 animate-fade-in-up">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-royal-50 flex items-center justify-center mb-4 ring-4 ring-royal-50/50">
            <KeyRound className="w-8 h-8 text-royal-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-display">
            Masukkan Token Voting
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ketik token unik yang Anda terima untuk mulai memilih
          </p>
        </div>

        {tokensError && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Gagal memuat daftar token. Coba refresh halaman.</span>
          </div>
        )}

        {error && (
          <div
            className={`mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm ${
              shake ? 'animate-[shake_0.5s]' : ''
            }`}
            style={
              shake
                ? { animation: 'shake 0.5s ease-in-out' }
                : undefined
            }
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: ABCD-1234"
              className="input-field text-center text-lg tracking-wider font-mono uppercase"
              disabled={tokensLoading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-base py-3.5"
            disabled={tokensLoading}
          >
            {tokensLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memuat Token...
              </>
            ) : (
              <>
                Verifikasi Token
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
