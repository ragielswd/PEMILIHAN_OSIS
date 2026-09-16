import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, X, AlertTriangle, Save,
  CheckCircle2, Clock, RefreshCw, LogOut, Users,
} from 'lucide-react';
import type { Candidate } from '@/types';

interface CandidateFormModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Candidate, 'id'> & { id?: string }) => void;
}

const EMPTY_FORM: Omit<Candidate, 'id'> = {
  nomorUrut: 0,
  namaLengkap: '',
  kelas: '',
  fotoUrl: '',
  visi: '',
  misi: '',
};

export function CandidateFormModal({
  candidate,
  isOpen,
  onClose,
  onSave,
}: CandidateFormModalProps) {
  const [form, setForm] = useState<Omit<Candidate, 'id'>>(EMPTY_FORM);

  useEffect(() => {
    if (candidate) {
      setForm({
        nomorUrut: candidate.nomorUrut,
        namaLengkap: candidate.namaLengkap,
        kelas: candidate.kelas,
        fotoUrl: candidate.fotoUrl,
        visi: candidate.visi,
        misi: candidate.misi,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [candidate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: candidate?.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-800 font-display">
            {candidate ? 'Edit Kandidat' : 'Tambah Kandidat'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                Nomor Urut
              </label>
              <input
                type="number"
                value={form.nomorUrut || ''}
                onChange={(e) => setForm({ ...form, nomorUrut: parseInt(e.target.value) || 0 })}
                className="input-field"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                Kelas
              </label>
              <input
                type="text"
                value={form.kelas}
                onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                placeholder="Contoh: IX-A"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={form.namaLengkap}
              onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              URL Foto
            </label>
            <input
              type="url"
              value={form.fotoUrl}
              onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
              placeholder="https://..."
              className="input-field"
            />
            {form.fotoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={form.fotoUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover ring-2 ring-slate-100"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
                <span className="text-xs text-slate-400">Preview foto</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Visi
            </label>
            <textarea
              value={form.visi}
              onChange={(e) => setForm({ ...form, visi: e.target.value })}
              rows={2}
              className="input-field resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Misi
            </label>
            <textarea
              value={form.misi}
              onChange={(e) => setForm({ ...form, misi: e.target.value })}
              rows={4}
              className="input-field resize-none"
              placeholder="Gunakan baris baru untuk setiap poin misi"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Batal
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ candidate, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card max-w-md w-full p-6 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 ring-4 ring-red-50/50">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-display mb-2">
            Hapus Kandidat?
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Yakin ingin menghapus <span className="font-semibold text-slate-700">{candidate.namaLengkap}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="btn-secondary flex-1">
              Batal
            </button>
            <button onClick={onConfirm} className="btn-danger flex-1">
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setConfirmText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFirstConfirm = () => setStep(2);

  const handleFinalConfirm = () => {
    if (confirmText.trim().toUpperCase() === 'RESET') {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card max-w-md w-full p-6 animate-scale-in">
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 ring-4 ring-red-50/50">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-display mb-2">
              Reset Semua Data?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Semua suara, token yang sudah digunakan, dan data kandidat akan dikembalikan ke
              kondisi awal. <span className="font-semibold text-red-600">Semua suara akan hilang permanen.</span>
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={onClose} className="btn-secondary flex-1">
                Batal
              </button>
              <button onClick={handleFirstConfirm} className="btn-danger flex-1">
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 ring-4 ring-red-50/50">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-display mb-2">
              Konfirmasi Final
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Ketik <span className="font-mono font-bold text-red-600">RESET</span> untuk
              mengkonfirmasi.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="RESET"
              className="input-field text-center font-mono uppercase mb-4"
              autoFocus
            />
            <div className="flex gap-3 w-full">
              <button onClick={onClose} className="btn-secondary flex-1">
                Batal
              </button>
              <button
                onClick={handleFinalConfirm}
                className="btn-danger flex-1"
                disabled={confirmText.trim().toUpperCase() !== 'RESET'}
              >
                <RefreshCw className="w-4 h-4" />
                Reset Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Plus, Pencil, Trash2, CheckCircle2, Clock, LogOut, Users };