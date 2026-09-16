import { useState, useEffect, useCallback } from 'react';
import type { Candidate, VoteRecord } from '@/types';
import { STORAGE_KEYS, INITIAL_CANDIDATES, TOKEN_GIST_URL } from '@/constants';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    readJSON(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES)
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.CANDIDATES, candidates);
  }, [candidates]);

  const addCandidate = useCallback((c: Omit<Candidate, 'id'>) => {
    const id = `cand-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setCandidates((prev) => [...prev, { ...c, id }]);
  }, []);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const resetCandidates = useCallback(() => {
    setCandidates(INITIAL_CANDIDATES);
  }, []);

  return { candidates, addCandidate, updateCandidate, deleteCandidate, resetCandidates };
}

export function useVotes() {
  const [votes, setVotes] = useState<VoteRecord[]>(() =>
    readJSON(STORAGE_KEYS.VOTES, [] as VoteRecord[])
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.VOTES, votes);
  }, [votes]);

  const addVote = useCallback((candidateId: string, token: string) => {
    setVotes((prev) => [...prev, { candidateId, token, timestamp: Date.now() }]);
  }, []);

  const resetVotes = useCallback(() => {
    setVotes([]);
  }, []);

  const getVoteCount = useCallback(
    (candidateId: string) => votes.filter((v) => v.candidateId === candidateId).length,
    [votes]
  );

  return { votes, addVote, resetVotes, getVoteCount };
}

export function useUsedTokens() {
  const [usedTokens, setUsedTokens] = useState<string[]>(() =>
    readJSON(STORAGE_KEYS.USED_TOKENS, [] as string[])
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.USED_TOKENS, usedTokens);
  }, [usedTokens]);

  const markTokenUsed = useCallback((token: string) => {
    setUsedTokens((prev) => [...prev, token]);
  }, []);

  const isTokenUsed = useCallback(
    (token: string) => usedTokens.includes(token),
    [usedTokens]
  );

  const resetUsedTokens = useCallback(() => {
    setUsedTokens([]);
  }, []);

  return { usedTokens, markTokenUsed, isTokenUsed, resetUsedTokens };
}

export function useTokenList() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(TOKEN_GIST_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat daftar token');
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = text
          .split(/[\s,\n]+/)
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        setTokens(parsed);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Gagal memuat token');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { tokens, loading, error };
}
