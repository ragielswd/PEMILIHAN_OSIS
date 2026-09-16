import { useState } from 'react';
import { Menu, X, Vote, BarChart3, ShieldCheck } from 'lucide-react';
import { SCHOOL_NAME, APP_TITLE, SCHOOL_LOGO_URL } from '@/constants';
import type { View } from '@/types';

interface NavbarProps {
  view: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: { key: View; label: string; icon: typeof Vote }[] = [
  { key: 'vote', label: 'Beranda / Vote', icon: Vote },
  { key: 'quickcount', label: 'Quick Count', icon: BarChart3 },
  { key: 'admin', label: 'Login Admin', icon: ShieldCheck },
];

export default function Navbar({ view, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (v: View) => {
    onNavigate(v);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <button
            onClick={() => handleNavigate('vote')}
            className="flex items-center gap-3 group"
          >
            <img
              src={SCHOOL_LOGO_URL}
              alt="Logo SMPN 36 Samarinda"
              className="w-10 h-10 rounded-lg object-contain bg-white p-0.5 ring-2 ring-royal-100 transition-transform group-hover:scale-105"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide leading-none">
                {SCHOOL_NAME}
              </p>
              <p className="text-sm font-bold text-slate-800 font-display leading-tight mt-0.5">
                {APP_TITLE}
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleNavigate(key)}
                className={`nav-link flex items-center gap-2 ${
                  view === key ? 'nav-link-active' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-slate-100 bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleNavigate(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  view === key
                    ? 'text-royal-700 bg-royal-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
