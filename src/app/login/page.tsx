'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { INITIAL_USERS } from '@/data/seedData';
import {
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  School,
  User,
  Key,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, currentUser } = useApp();

  const [inputEmail, setInputEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = inputEmail.trim().toLowerCase();
    if (!email) {
      setErrorMessage('Silakan masukkan alamat email kampus Anda.');
      return;
    }

    // Check UNSIL domain validation rule (KF-01, AB-01)
    const isStudent = email.endsWith('@student.unsil.ac.id');
    const isStaff = email.endsWith('@unsil.ac.id');

    if (!isStudent && !isStaff) {
      setErrorMessage(
        'Akses Ditolak (KF-01): Hanya email resmi sivitas akademika Universitas Siliwangi (@student.unsil.ac.id atau @unsil.ac.id) yang dapat digunakan untuk masuk ke SIFAST FT.'
      );
      return;
    }

    if (email.includes('adminutama')) {
      setCurrentUser(INITIAL_USERS.adminUtama);
      setSuccessMessage('Berhasil masuk sebagai Admin Utama (Wakil Dekan II). Membuka dasbor...');
      setTimeout(() => router.push('/admin'), 700);
    } else if (isStaff) {
      setCurrentUser(INITIAL_USERS.admin);
      setSuccessMessage('Berhasil masuk sebagai Staf Admin Sarpras. Membuka dasbor...');
      setTimeout(() => router.push('/admin'), 700);
    } else {
      setCurrentUser({
        ...INITIAL_USERS.mahasiswa,
        email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      });
      setSuccessMessage('Berhasil masuk sebagai Mahasiswa FT. Membuka beranda...');
      setTimeout(() => router.push('/'), 700);
    }
  };

  const handleOneClickLogin = (userKey: 'mahasiswa' | 'admin' | 'adminUtama') => {
    const selected = INITIAL_USERS[userKey];
    setCurrentUser(selected);
    setSuccessMessage(`Berhasil masuk sebagai ${selected.name} (${selected.role}).`);
    setTimeout(() => {
      if (selected.role === 'MAHASISWA') router.push('/');
      else router.push('/admin');
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-12">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#0F294A] dark:bg-blue-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-md mb-3">
          FT
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Masuk ke SIFAST FT
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Sistem Informasi Fasilitas Fakultas Teknik Universitas Siliwangi
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Manual Input Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Kampus Resmi (UNSIL)
            </label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="nama@student.unsil.ac.id atau nama@unsil.ac.id"
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Aturan KF-01: Masukkan email dengan domain <code>@student.unsil.ac.id</code> atau <code>@unsil.ac.id</code>.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <span>Lanjutkan dengan Email Kampus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-[#111827] text-slate-400 font-medium">
              Atau Gunakan 1-Klik Masuk Demo
            </span>
          </div>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOneClickLogin('mahasiswa')}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between group active:scale-97 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Mahasiswa FT (Ahmad Fadhilah)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  mahasiswa@student.unsil.ac.id • NIM: 217006001
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => handleOneClickLogin('admin')}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between group active:scale-97 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Staf Admin Sarpras (Budi Santoso, S.T.)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  admin@unsil.ac.id • Subbag Sarana & Prasarana
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => handleOneClickLogin('adminUtama')}
            className="w-full p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between group active:scale-97 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Admin Utama (Dr. Ir. Hendra Gunawan, M.T.)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  adminutama@unsil.ac.id • Wakil Dekan II FT
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Security & Scope Notice */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <span>
            Aplikasi demo ini tidak memerlukan kata sandi dan seluruh sesi pengguna tersimpan aman di <code>localStorage</code> peramban Anda.
          </span>
        </div>
      </div>
    </div>
  );
}
