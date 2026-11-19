'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  ShieldAlert,
  Search,
  Lock,
  Clock,
  ShieldCheck,
  User,
  MapPin,
  ExternalLink,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function AdminLogIdentitasPage() {
  const { identityLogs, currentUser, switchRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = identityLogs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      log.reportId.toLowerCase().includes(q) ||
      log.adminName.toLowerCase().includes(q) ||
      log.reporterName.toLowerCase().includes(q) ||
      log.location.toLowerCase().includes(q) ||
      log.reason.toLowerCase().includes(q)
    );
  });

  const isWadek = currentUser.role === 'ADMIN_UTAMA';

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dasbor Admin</span>
        </Link>
      </div>

      {/* Role Notice if not Admin Utama */}
      {!isWadek && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              Halaman ini diperuntukkan secara khusus bagi <strong>Admin Utama (Wakil Dekan II)</strong> untuk pengawasan audit pembukaan identitas anonim.
            </span>
          </div>
          <button
            onClick={() => switchRole('ADMIN_UTAMA')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs active:scale-95 transition-all flex-shrink-0 shadow-xs"
          >
            Beralih ke Peran Admin Utama
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Audit Trail Keamanan &amp; Privasi (KF-19, KN-12)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Log Akses Identitas Anonim
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Catatan permanen setiap kali identitas mahasiswa pelapor anonim dibuka oleh Admin Utama. Bersifat <em>read-only</em> dan tidak dapat dihapus.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Audit Log Read-Only</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID laporan, nama admin, nama pelapor, atau alasan pembukaan..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Waktu Akses
                </th>
                <th scope="col" className="px-4 py-3">
                  Admin Pembuka
                </th>
                <th scope="col" className="px-4 py-3">
                  Laporan &amp; Lokasi
                </th>
                <th scope="col" className="px-4 py-3">
                  Pelapor Terungkap
                </th>
                <th scope="col" className="px-4 py-3">
                  Alasan Resmi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    Belum ada aktivitas pembukaan identitas anonim yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {new Date(log.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        <span>{log.adminName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{log.adminEmail}</div>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <Link
                        href={`/admin/laporan/${log.reportId}`}
                        className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{log.reportId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {log.location}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {log.reporterName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        NIM: {log.reporterNim}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-md">
                      <div className="bg-slate-50 dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{log.reason}"
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
