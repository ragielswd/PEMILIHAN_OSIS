export interface Candidate {
  id: string;
  nomorUrut: number;
  namaLengkap: string;
  kelas: string;
  fotoUrl: string;
  visi: string;
  misi: string;
}

export interface VoteRecord {
  candidateId: string;
  timestamp: number;
  token: string;
}

export type View = 'vote' | 'quickcount' | 'admin';

export interface AdminSession {
  username: string;
  loginTime: number;
}
