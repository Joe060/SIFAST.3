'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, School, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B1120]/50 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold flex-shrink-0">
            <School className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              SIFAST FT — Universitas Siliwangi
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Sistem Informasi Fasilitas Fakultas Teknik (Demo Interaktif Lampiran B SRS)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Client-Side State (localStorage)
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Masuk Demo
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/admin" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Dasbor Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};
