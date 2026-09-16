import { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '@/constants';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi!');
      return;
    }
    if (
      username.trim() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setError(null);
      onLogin();
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-royal-50/30">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="card p-8 animate-fade-in-up">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-navy-700 flex items-center justify-center mb-4 shadow-lg shadow-navy-700/25">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-display">Login Admin</h2>
            <p className="text-sm text-slate-500 mt-1">
              Masuk untuk mengelola kandidat dan data pemilihan
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="admin"
                  className="input-field pl-11"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-base">
              Masuk
            </button>
          </form>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Default: <span className="font-mono font-semibold text-slate-500">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
