import { useState } from 'react';
import {
  Plus, Pencil, Trash2, RefreshCw, LogOut, Users, Vote as VoteIcon,
} from 'lucide-react';
import type { Candidate } from '@/types';
import {
  CandidateFormModal, DeleteConfirmModal, ResetConfirmModal,
} from '@/components/AdminModals';

interface AdminDashboardProps {
  candidates: Candidate[];
  onAddCandidate: (c: Omit<Candidate, 'id'>) => void;
  onUpdateCandidate: (id: string, updates: Partial<Candidate>) => void;
  onDeleteCandidate: (id: string) => void;
  onResetCandidates: () => void;
  onResetVotes: () => void;
  onResetUsedTokens: () => void;
  onLogout: () => void;
  getVoteCount: (candidateId: string) => number;
}

export default function AdminDashboard({
  candidates,
  onAddCandidate,
  onUpdateCandidate,
  onDeleteCandidate,
  onResetCandidates,
  onResetVotes,
  onResetUsedTokens,
  onLogout,
  getVoteCount,
}: AdminDashboardProps) {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const openAdd = () => {
    setEditingCandidate(null);
    setFormModalOpen(true);
  };

  const openEdit = (c: Candidate) => {
    setEditingCandidate(c);
    setFormModalOpen(true);
  };

  const handleSave = (data: Omit<Candidate, 'id'> & { id?: string }) => {
    if (data.id) {
      const { id, ...updates } = data;
      onUpdateCandidate(id, updates);
    } else {
      const { id: _id, ...rest } = data;
      void _id;
      onAddCandidate(rest);
    }
    setFormModalOpen(false);
    setEditingCandidate(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      onDeleteCandidate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleReset = () => {
    onResetCandidates();
    onResetVotes();
    onResetUsedTokens();
    setResetModalOpen(false);
  };

  const totalVotes = candidates.reduce((sum, c) => sum + getVoteCount(c.id), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Dashboard Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola kandidat dan data pemilihan</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setResetModalOpen(true)} className="btn-danger">
            <RefreshCw className="w-4 h-4" />
            Reset Data
          </button>
          <button onClick={onLogout} className="btn-secondary">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-royal-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-royal-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-700 font-display">{candidates.length}</p>
            <p className="text-sm text-slate-400">Kandidat</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <VoteIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-700 font-display">{totalVotes}</p>
            <p className="text-sm text-slate-400">Total Suara Masuk</p>
          </div>
        </div>
      </div>

      {/* Candidates Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 font-display">Daftar Kandidat</h2>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" />
          Tambah Kandidat
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">Belum ada kandidat. Tambahkan kandidat pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates
            .sort((a, b) => a.nomorUrut - b.nomorUrut)
            .map((c) => (
              <div key={c.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-slate-100 bg-slate-100">
                      <img
                        src={c.fotoUrl}
                        alt={c.namaLengkap}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            c.namaLengkap
                          )}&size=128&background=1e3660&color=fff&bold=true`;
                        }}
                      />
                    </div>
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-lg bg-gradient-to-br from-royal-600 to-navy-700 flex items-center justify-center text-xs font-extrabold text-white ring-2 ring-white">
                      {c.nomorUrut}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{c.namaLengkap}</h3>
                    <p className="text-sm text-slate-500">Kelas {c.kelas}</p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-xs font-semibold">
                      <VoteIcon className="w-3 h-3" />
                      {getVoteCount(c.id)} suara
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex-1 btn-secondary py-2 text-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modals */}
      <CandidateFormModal
        candidate={editingCandidate}
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingCandidate(null);
        }}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        candidate={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
