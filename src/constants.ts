import type { Candidate } from '@/types';

export const SCHOOL_NAME = 'SMP NEGERI 36 SAMARINDA';
export const APP_TITLE = 'E-Voting Pemilihan Ketua OSIS';
export const SCHOOL_LOGO_URL = 'https://iili.io/BxaPayB.png';
export const TOKEN_GIST_URL =
  'https://gist.githubusercontent.com/ragielswd/46b2f33ad29c95e0fa7da6ea50fe365f/raw/82a6d7f1581cd9517f2ffa7852eff4bfe1003819/gistfile1.txt';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export const STORAGE_KEYS = {
  CANDIDATES: 'evoting_candidates',
  VOTES: 'evoting_votes',
  USED_TOKENS: 'evoting_used_tokens',
  ADMIN_SESSION: 'evoting_admin_session',
} as const;

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    nomorUrut: 1,
    namaLengkap: 'Ahmad Fadhil Rahman',
    kelas: 'IX-A',
    fotoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2f?w=400&h=400&fit=crop&crop=face',
    visi: 'Mewujudkan OSIS yang Aktif, Kreatif, dan Berprestasi untuk Kemajuan Sekolah',
    misi:
      '1. Meningkatkan kegiatan ekstrakurikuler yang bervariasi\n2. Membangun komunikasi yang baik antara OSIS dan siswa\n3. Mengadakan program kerja yang inovatif dan bermanfaat\n4. Menjadi jembatan aspirasi siswa kepada pihak sekolah',
  },
  {
    id: 'cand-2',
    nomorUrut: 2,
    namaLengkap: 'Siti Nur Aisyah Putri',
    kelas: 'IX-B',
    fotoUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    visi: 'OSIS yang Berkarakter, Berprestasi, dan Peduli Lingkungan Sekolah',
    misi:
      '1. Mengembangkan program kepemimpinan siswa\n2. Mengadakan kegiatan sosial dan kepedulian lingkungan\n3. Meningkatkan prestasi akademik dan non-akademik siswa\n4. Menciptakan lingkungan sekolah yang bersih dan nyaman',
  },
  {
    id: 'cand-3',
    nomorUrut: 3,
    namaLengkap: 'Muhammad Rizki Pratama',
    kelas: 'IX-C',
    fotoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
    visi: 'OSIS yang Inovatif, Kolaboratif, dan Berwawasan Teknologi',
    misi:
      '1. Mengadakan program literasi digital untuk siswa\n2. Membangun kolaborasi dengan OSIS sekolah lain\n3. Mengembangkan kreativitas siswa melalui lomba-lomba\n4. Meningkatkan partisipasi siswa dalam kegiatan sekolah',
  },
];

export const CHART_COLORS = [
  '#1d54f5',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
];
