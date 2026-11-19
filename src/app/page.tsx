'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ReportStatus, UrgencyLevel } from '@/types';
import {
  Search,
  PlusCircle,
  ThumbsUp,
  Clock,
  MapPin,
  Tag,
  AlertTriangle,
  Copy,
  ChevronRight,
  Filter,
  CheckCircle2,
  Hourglass,
  Layers,
  ArrowUpDown,
  Eye,
  Info,
} from 'lucide-react';

export default function HomePage() {
  const { reports, categories, currentUser, toggleSupport } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);

  // Filter out hidden reports from public view
  const publicReports = useMemo(() => {
    return reports.filter((r) => !r.isHidden);
  }, [reports]);

  // Statistics calculation for KF-11
  const stats = useMemo(() => {
    const total = publicReports.length;
    const diajukan = publicReports.filter((r) => r.status === 'Diajukan').length;
    const diproses = publicReports.filter((r) => r.status === 'Diproses').length;
    const selesai = publicReports.filter((r) => r.status === 'Selesai').length;
    const ditolak = publicReports.filter((r) => r.status === 'Ditolak').length;
    return { total, diajukan, diproses, selesai, ditolak };
  }, [publicReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return publicReports.filter((report) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.categoryName.toLowerCase().includes(query);

      // Category
      const matchCategory = selectedCategory === 'ALL' || report.categoryId === selectedCategory;

      // Status
      const matchStatus = selectedStatus === 'ALL' || report.status === selectedStatus;

      // Urgency
      const matchUrgency = selectedUrgency === 'ALL' || report.urgency === selectedUrgency;

      return matchSearch && matchCategory && matchStatus && matchUrgency;
    });
  }, [publicReports, searchQuery, selectedCategory, selectedStatus, selectedUrgency]);

  const handleSupportClick = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleSupport(reportId);
    if (result.message) {
      setSupportFeedback(result.message);
      setTimeout(() => setSupportFeedback(null), 3000);
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Diajukan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            Diajukan
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-[#0F294A] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Hourglass className="w-3 h-3 animate-spin-slow" />
            Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Ditolak
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'Darurat':
        return (
          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
            ⚡ Darurat
          </span>
        );
      case 'Tinggi':
        return (
          <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded">
            Tinggi
          </span>
        );
      case 'Sedang':
        return (
          <span className="text-[11px] font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-0.5 rounded">
            Sedang
          </span>
        );
      case 'Rendah':
        return (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Rendah
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Support Feedback Toast */}
      {supportFeedback && (
        <div className="fixed top-20 right-4 z-50 bg-[#0F294A] dark:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150 flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          {supportFeedback}
        </div>
      )}

      {/* Hero Header & Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-900/60 dark:via-[#111827] dark:to-blue-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0F294A] dark:text-blue-300">
            Fakultas Teknik Universitas Siliwangi
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sistem Informasi Fasilitas FT
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Laporkan kerusakan sarana dan prasarana kampus Fakultas Teknik secara transparan. Dukung laporan fasilitas lain untuk mempercepat penanganan sarpras.
          </p>
        </div>

        <Link
          href="/laporan/baru"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>

      {/* Statistics Recap Cards (KF-11) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Laporan Masuk</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Fasilitas aktif dilaporkan</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {stats.diajukan}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Status: Diajukan</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-[#0F294A] dark:text-blue-400 font-medium flex items-center gap-1">
            <Hourglass className="w-3.5 h-3.5" />
            Sedang Dikerjakan
          </div>
          <div className="text-2xl font-bold text-[#0F294A] dark:text-blue-400 mt-1 tabular-nums">
            {stats.diproses}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Status: Diproses Sarpras</div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tuntas Diperbaiki
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {stats.selesai}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Status: Selesai</div>
        </div>
      </div>

      {/* Filter and Search Bar (KF-08) */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID laporan, ruangan, gedung, atau masalah fasilitas..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Quick Clear Filter */}
          {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedUrgency !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSelectedUrgency('ALL');
              }}
              className="px-3 py-2 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Dropdowns Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Kategori Fasilitas
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Semua Kategori ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {!c.isActive ? '(Nonaktif)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Status Penanganan
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="Diajukan">Diajukan</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Tingkat Urgensi
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Semua Tingkat Urgensi</option>
              <option value="Darurat">Darurat</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Menampilkan <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{filteredReports.length}</strong> laporan publik
        </span>
        <span className="text-[11px] text-slate-400">
          Aturan AB-05: Identitas pelapor dilindungi dari publik
        </span>
      </div>

      {/* Reports Feed */}
      {filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <Info className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Tidak Ada Laporan yang Cocok
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Tidak ditemukan laporan fasilitas sesuai kriteria pencarian atau filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const isOwnReport = report.reporterId === currentUser.id;
            const hasSupported = report.supportedBy.includes(currentUser.id);

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Category & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {report.categoryName}
                      </span>
                      {getUrgencyBadge(report.urgency)}
                      {report.isDuplicate && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <Copy className="w-3 h-3" />
                          Duplikat {report.duplicateOfId ? `(${report.duplicateOfId})` : ''}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  {/* Location & Report ID */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F294A] dark:text-blue-400 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span>{report.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
                    {report.description}
                  </p>

                  {/* Photo Preview Thumbnail (if any) */}
                  {report.images && report.images.length > 0 && (
                    <div className="mb-3">
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={report.images[0]}
                          alt={`Bukti ${report.id}`}
                          className="w-full h-full object-cover"
                        />
                        {report.images.length > 1 && (
                          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                            +{report.images.length - 1} foto
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Support CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                    {new Date(report.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' • '}
                    <span className="font-mono text-[10px]">{report.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Support Button (AB-04, KF-06) */}
                    {isOwnReport ? (
                      <span
                        className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 cursor-not-allowed"
                        title="Anda adalah pembuat laporan ini"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span className="tabular-nums font-semibold">{report.supportCount}</span>
                        <span className="hidden sm:inline">dukungan</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleSupportClick(report.id, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                          hasSupported
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-[#0F294A] dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                        title={hasSupported ? 'Klik untuk membatalkan dukungan' : 'Dukung laporan ini agar diprioritaskan'}
                      >
                        <ThumbsUp className={`w-3 h-3 ${hasSupported ? 'fill-current' : ''}`} />
                        <span className="tabular-nums">{report.supportCount}</span>
                        <span className="hidden sm:inline">{hasSupported ? 'Didukung' : 'Dukung'}</span>
                      </button>
                    )}

                    {/* View Detail Link (for reporter or admin) */}
                    <Link
                      href={
                        currentUser.role === 'ADMIN' || currentUser.role === 'ADMIN_UTAMA'
                          ? `/admin/laporan/${report.id}`
                          : `/laporan-saya/${report.id}`
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
