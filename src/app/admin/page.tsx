'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ReportStatus, UrgencyLevel } from '@/types';
import {
  LayoutDashboard,
  Filter,
  Search,
  ChevronRight,
  Clock,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  Shield,
  ThumbsUp,
  Tag,
  EyeOff,
  Copy,
  ExternalLink,
  ShieldAlert,
  FolderKanban,
  User,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { reports, categories, currentUser, switchRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  // Filter visible reports for admin statistics (ignoring hidden reports per SRS)
  const visibleReports = useMemo(() => {
    return reports.filter((r) => !r.isHidden);
  }, [reports]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = visibleReports.length;
    const diajukan = visibleReports.filter((r) => r.status === 'Diajukan').length;
    const diproses = visibleReports.filter((r) => r.status === 'Diproses').length;
    const selesai = visibleReports.filter((r) => r.status === 'Selesai').length;
    const ditolak = visibleReports.filter((r) => r.status === 'Ditolak').length;
    const anonim = visibleReports.filter((r) => r.isAnonymous).length;
    const hiddenCount = reports.filter((r) => r.isHidden).length;

    return { total, diajukan, diproses, selesai, ditolak, anonim, hiddenCount };
  }, [visibleReports, reports]);

  // Filtered reports for table
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.reporterName.toLowerCase().includes(query);

      const matchStatus = statusFilter === 'ALL' || report.status === statusFilter;
      const matchCategory = categoryFilter === 'ALL' || report.categoryId === categoryFilter;
      const matchUrgency = urgencyFilter === 'ALL' || report.urgency === urgencyFilter;

      return matchSearch && matchStatus && matchCategory && matchUrgency;
    });
  }, [reports, searchQuery, statusFilter, categoryFilter, urgencyFilter]);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Diajukan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            Diajukan
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0F294A] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Hourglass className="w-3 h-3" />
            Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Ditolak
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'Darurat':
        return (
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/60">
            ⚡ Darurat
          </span>
        );
      case 'Tinggi':
        return (
          <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
            Tinggi
          </span>
        );
      case 'Sedang':
        return (
          <span className="text-[10px] font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 px-2 py-0.5 rounded">
            Sedang
          </span>
        );
      case 'Rendah':
        return (
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Rendah
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Banner / Warning if viewed as Mahasiswa */}
      {currentUser.role === 'MAHASISWA' && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Anda saat ini membuka Dasbor Admin dengan akun Mahasiswa (Demo mode). Klik tombol untuk beralih ke peran Admin:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchRole('ADMIN')}
              className="px-3 py-1.5 rounded-lg bg-[#0F294A] dark:bg-blue-600 text-white font-semibold text-xs active:scale-95 transition-all"
            >
              Masuk sebagai Admin Sarpras
            </button>
            <button
              onClick={() => switchRole('ADMIN_UTAMA')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs active:scale-95 transition-all"
            >
              Admin Utama (Wadek II)
            </button>
          </div>
        </div>
      )}

      {/* Header with Quick Navigation Actions */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Panel Manajemen Sarpras FT UNSIL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dasbor Pengelolaan Laporan Fasilitas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verifikasi, tindak lanjuti kerusakan sarpras, moderasi laporan duplikat, dan kelola kategori.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/kategori"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Kelola Kategori</span>
          </Link>
          <Link
            href="/admin/log-identitas"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Log Akses Identitas</span>
          </Link>
        </div>
      </div>

      {/* Recap Metric Cards (Ignored Hidden Reports per SRS KF-10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">Laporan Aktif</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {stats.total}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Semua data publik</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Diajukan
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {stats.diajukan}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Perlu verifikasi</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-[#0F294A] dark:text-blue-400 font-medium flex items-center gap-1">
            <Hourglass className="w-3 h-3" />
            Diproses
          </div>
          <div className="text-xl font-bold text-[#0F294A] dark:text-blue-400 mt-1 tabular-nums">
            {stats.diproses}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sedang diperbaiki</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {stats.selesai}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tuntas ditangani</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Ditolak</div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {stats.ditolak}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tidak valid / duplikat</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Anonim
          </div>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            {stats.anonim}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Identitas terkunci</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID laporan, lokasi, uraian, atau nama pelapor..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500"
            />
          </div>

          {(searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || urgencyFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setUrgencyFilter('ALL');
              }}
              className="px-3 py-2 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Semua Status</option>
              <option value="Diajukan">Diajukan</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter Urgensi
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Semua Urgensi</option>
              <option value="Darurat">Darurat</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Reports */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3">
                  ID & Tanggal
                </th>
                <th scope="col" className="px-4 py-3">
                  Kategori & Lokasi
                </th>
                <th scope="col" className="px-4 py-3">
                  Urgensi
                </th>
                <th scope="col" className="px-4 py-3">
                  Pelapor
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Tidak ada laporan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {report.id}
                      </div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      {report.isHidden && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mt-1">
                          <EyeOff className="w-2.5 h-2.5" /> Disembunyikan
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {report.location}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {report.categoryName}
                      </div>
                      {report.isDuplicate && (
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                          <Copy className="w-2.5 h-2.5" />
                          Duplikat {report.duplicateOfId ? `(${report.duplicateOfId})` : ''}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getUrgencyBadge(report.urgency)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {report.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                          <Shield className="w-3 h-3" />
                          Anonim
                        </span>
                      ) : (
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {report.reporterName}
                          <div className="text-[10px] text-slate-400">
                            NIM: {report.reporterNim}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/laporan/${report.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs transition-all active:scale-95"
                      >
                        <span>Kelola</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
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
