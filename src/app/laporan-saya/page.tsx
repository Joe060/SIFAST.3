'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ReportStatus } from '@/types';
import {
  FileText,
  PlusCircle,
  Clock,
  Hourglass,
  CheckCircle2,
  ChevronRight,
  Shield,
  ThumbsUp,
  MapPin,
  Tag,
  AlertTriangle,
} from 'lucide-react';

export default function LaporanSayaPage() {
  const { reports, currentUser } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filter reports submitted by current logged-in user
  const myReports = useMemo(() => {
    return reports.filter((r) => r.reporterId === currentUser.id);
  }, [reports, currentUser.id]);

  const filteredMyReports = useMemo(() => {
    if (selectedStatus === 'ALL') return myReports;
    return myReports.filter((r) => r.status === selectedStatus);
  }, [myReports, selectedStatus]);

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0F294A] dark:text-blue-400" />
            Laporan Fasilitas Saya
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pantau linimasa penanganan laporan sarpras yang pernah Anda kirimkan.
          </p>
        </div>

        <Link
          href="/laporan/baru"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: `Semua (${myReports.length})` },
          { key: 'Diajukan', label: `Diajukan (${myReports.filter((r) => r.status === 'Diajukan').length})` },
          { key: 'Diproses', label: `Diproses (${myReports.filter((r) => r.status === 'Diproses').length})` },
          { key: 'Selesai', label: `Selesai (${myReports.filter((r) => r.status === 'Selesai').length})` },
          { key: 'Ditolak', label: `Ditolak (${myReports.filter((r) => r.status === 'Ditolak').length})` },
        ].map((tab) => {
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0F294A] text-white dark:bg-blue-600'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      {filteredMyReports.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Belum Ada Laporan di Kategori Ini
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto mb-4">
            Anda belum pernah membuat laporan pada status ini atau filter yang dipilih tidak memiliki data.
          </p>
          <Link
            href="/laporan/baru"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#0F294A] dark:bg-blue-600 text-white"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Laporan Baru Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMyReports.map((report) => (
            <Link
              key={report.id}
              href={`/laporan-saya/${report.id}`}
              className="block bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 sm:p-5 shadow-xs transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0F294A] dark:text-blue-400">
                      {report.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {report.categoryName}
                    </span>
                    {report.isAnonymous && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        <Shield className="w-3 h-3" />
                        Opsi Anonim
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] text-slate-400 tabular-nums text-right">
                      <div>
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{report.supportCount} dukungan</span>
                      </div>
                    </div>

                    {getStatusBadge(report.status)}
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
