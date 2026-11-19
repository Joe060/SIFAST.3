'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ReportStatus, UrgencyLevel } from '@/types';
import {
  ArrowLeft,
  Clock,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Tag,
  Shield,
  ThumbsUp,
  Calendar,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';

export default function DetailLaporanSayaPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const { reports, statusHistory, currentUser } = useApp();

  const report = useMemo(() => {
    return reports.find((r) => r.id === reportId);
  }, [reports, reportId]);

  const histories = useMemo(() => {
    return statusHistory
      .filter((h) => h.reportId === reportId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [statusHistory, reportId]);

  if (!report) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Laporan Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-500">
          Laporan dengan ID <code>{reportId}</code> tidak ditemukan di sistem demo.
        </p>
        <Link
          href="/laporan-saya"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F294A] dark:bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Laporan Saya</span>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Diajukan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Diajukan
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0F294A] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Hourglass className="w-3.5 h-3.5" />
            Diproses Sarpras
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai Diperbaiki
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Ditolak
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/laporan-saya"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Laporan Saya</span>
        </Link>
        <div className="text-xs text-slate-400 font-mono">
          ID: {report.id}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {report.categoryName}
              </span>
              {report.isAnonymous && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Shield className="w-3 h-3" />
                  Laporan Anonim
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <span>{report.location}</span>
            </h1>
          </div>

          <div className="flex-shrink-0">
            {getStatusBadge(report.status)}
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <div className="text-[11px] text-slate-400">Tingkat Urgensi</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {report.urgency}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Dukungan Mahasiswa</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="tabular-nums">{report.supportCount} orang</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Waktu Dilaporkan</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {new Date(report.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Status Terakhir</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {report.status}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Uraian Kerusakan Fasilitas
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {report.description}
          </p>
        </div>

        {/* Photo Evidence */}
        {report.images && report.images.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Foto Bukti Fasilitas ({report.images.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {report.images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-video"
                >
                  <img
                    src={imgSrc}
                    alt={`Bukti fasilitas ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Note Callout (if present) */}
        {report.adminNote && (
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F294A] dark:text-blue-300">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Catatan Resmi Subbag Sarpras FT:</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5.5">
              "{report.adminNote}"
            </p>
          </div>
        )}

        {/* Anti-Scope Creep Notice */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          Sesuai ketentuan integritas data (SRS Tabel 1.1), laporan yang sudah dikirimkan bersifat permanen dan tidak dapat diubah atau dihapus oleh mahasiswa.
        </div>
      </div>

      {/* Vertical Status History Timeline (KF-17) */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#0F294A] dark:text-blue-400" />
          <span>Linimasa Riwayat Perubahan Status (Read-Only)</span>
        </h2>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {histories.map((item, index) => {
            const isLatest = index === histories.length - 1;
            return (
              <div key={item.id} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[23px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    isLatest
                      ? 'bg-blue-600 border-white dark:border-[#111827] text-white shadow-sm'
                      : 'bg-white dark:bg-[#111827] border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-2" />
                </div>

                {/* Timeline content */}
                <div className="bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 p-3.5 rounded-xl space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      Status: <strong className="text-blue-600 dark:text-blue-400">{item.toStatus}</strong>
                      {item.fromStatus && (
                        <span className="text-slate-400 font-normal">
                          (dari {item.fromStatus})
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {new Date(item.timestamp).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} WIB
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Oleh: {item.actorName}
                  </div>

                  {item.note && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800 mt-2 italic">
                      "{item.note}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
