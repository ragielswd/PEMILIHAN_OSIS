import { CheckCircle2, Vote } from 'lucide-react';
import type { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidate: Candidate) => void;
}

export default function CandidateCard({ candidate, onVote }: CandidateCardProps) {
  return (
    <div className="card overflow-hidden group hover:shadow-xl hover:border-royal-200 transition-all duration-300 animate-fade-in-up flex flex-col">
      {/* Header with number */}
      <div className="relative bg-gradient-to-br from-royal-600 to-navy-700 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-2 ring-white/20">
              <span className="text-2xl font-extrabold text-white font-display">
                {candidate.nomorUrut}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-royal-100 uppercase tracking-wide">
                Nomor Urut
              </p>
              <p className="text-sm font-bold text-white">{candidate.namaLengkap}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo */}
      <div className="relative px-6 pt-6">
        <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden ring-4 ring-slate-100 bg-slate-100">
          <img
            src={candidate.fotoUrl}
            alt={candidate.namaLengkap}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                candidate.namaLengkap
              )}&size=200&background=1e3660&color=fff&bold=true`;
            }}
          />
        </div>
        <h3 className="text-center text-lg font-bold text-slate-800 mt-3 font-display">
          {candidate.namaLengkap}
        </h3>
        <p className="text-center text-sm text-slate-500 font-medium">
          Kelas {candidate.kelas}
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="px-6 py-5 flex-1">
        <div className="mb-4">
          <p className="text-xs font-bold text-royal-600 uppercase tracking-wide mb-1.5">
            Visi
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">{candidate.visi}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-royal-600 uppercase tracking-wide mb-1.5">
            Misi
          </p>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {candidate.misi}
          </p>
        </div>
      </div>

      {/* Vote button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onVote(candidate)}
          className="btn-primary w-full py-3.5 text-base"
        >
          <Vote className="w-5 h-5" />
          Pilih / Vote
        </button>
      </div>
    </div>
  );
}

export function CandidateCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-20 bg-slate-200" />
      <div className="px-6 pt-6">
        <div className="w-28 h-28 mx-auto rounded-2xl bg-slate-200" />
        <div className="h-5 bg-slate-200 rounded mt-4 mx-auto w-2/3" />
        <div className="h-4 bg-slate-200 rounded mt-2 mx-auto w-1/3" />
      </div>
      <div className="px-6 py-5 space-y-2">
        <div className="h-3 bg-slate-200 rounded w-1/4" />
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
      <div className="px-6 pb-6">
        <div className="h-12 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export { CheckCircle2 };
