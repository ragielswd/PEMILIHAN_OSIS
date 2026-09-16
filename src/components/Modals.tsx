import { useEffect, useState } from 'react';
import { AlertTriangle, X, CheckCircle2, Loader2 } from 'lucide-react';
import type { Candidate } from '@/types';

interface ConfirmVoteModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmVoteModal({ candidate, onClose, onConfirm }: ConfirmVoteModalProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!candidate) setSubmitting(false);
  }, [candidate]);

  if (!candidate) return null;

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => onConfirm(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative card max-w-md w-full p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          disabled={submitting}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 ring-4 ring-amber-50/50">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-display mb-2">
            Konfirmasi Pilihan
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Apakah Anda yakin ingin memilih:
          </p>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 w-full">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-600 to-navy-700 flex items-center justify-center shrink-0">
              <span className="text-xl font-extrabold text-white font-display">
                {candidate.nomorUrut}
              </span>
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">
                {candidate.nomorUrut} — {candidate.namaLengkap}
              </p>
              <p className="text-sm text-slate-500">Kelas {candidate.kelas}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Pilihan Anda tidak dapat diubah setelah dikonfirmasi.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              className="btn-primary flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Ya, Pilih'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  show: boolean;
  candidateName: string;
  redirectSeconds: number;
}

export function SuccessModal({ show, candidateName, redirectSeconds }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative card max-w-md w-full p-8 animate-scale-in text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 ring-8 ring-green-50/40">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 font-display mb-2">
          Terima Kasih Telah Memilih!
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Suara Anda untuk <span className="font-semibold text-slate-700">{candidateName}</span>{' '}
          telah berhasil direkam.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Mengalihkan kembali dalam {redirectSeconds} detik...
        </div>
      </div>
    </div>
  );
}
