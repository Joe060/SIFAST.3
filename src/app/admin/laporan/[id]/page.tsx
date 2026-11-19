'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ReportStatus } from '@/types';
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
  Eye,
  EyeOff,
  Copy,
  Lock,
  Unlock,
  AlertTriangle,
  User,
  Check,
  Send,
  FileText,
  Mail,
} from 'lucide-react';

export default function AdminDetailLaporanPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const {
    reports,
    statusHistory,
    currentUser,
    updateReportStatus,
    toggleHideReport,
    markAsDuplicate,
    unlockIdentity,
  } = useApp();

  const report = useMemo(() => {
    return reports.find((r) => r.id === reportId);
  }, [reports, reportId]);

  const histories = useMemo(() => {
    return statusHistory
      .filter((h) => h.reportId === reportId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [statusHistory, reportId]);

  // Status Change Form States
  const [selectedNextStatus, setSelectedNextStatus] = useState<ReportStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  // Duplicate moderation states
  const [duplicateInput, setDuplicateInput] = useState(report?.duplicateOfId || '');
  const [isDuplicateActive, setIsDuplicateActive] = useState(report?.isDuplicate || false);

  // Identity Modal States (Admin Utama only)
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  if (!report) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Laporan Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-500">
          Laporan dengan ID <code>{reportId}</code> tidak ditemukan di sistem.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F294A] dark:bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dasbor Admin</span>
        </Link>
      </div>
    );
  }

  // Permitted status transitions per AB-03
  const isFinal = report.status === 'Selesai' || report.status === 'Ditolak';
  const availableStatuses: ReportStatus[] = [];
  if (report.status === 'Diajukan') {
    availableStatuses.push('Diproses', 'Ditolak');
  } else if (report.status === 'Diproses') {
    availableStatuses.push('Selesai', 'Ditolak');
  }

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);

    if (!selectedNextStatus) {
      setStatusError('Silakan pilih status baru yang akan diterapkan.');
      return;
    }

    if (selectedNextStatus === 'Ditolak' && (!statusNote || statusNote.trim().length === 0)) {
      setStatusError('Catatan alasan wajib diisi bila status diubah menjadi Ditolak (Aturan AB-03).');
      return;
    }

    const res = updateReportStatus(report.id, selectedNextStatus, statusNote);
    if (res.success) {
      setStatusSuccess(`Status laporan berhasil diubah menjadi ${selectedNextStatus}. Notifikasi email simulasi telah terkirim ke pelapor.`);
      setSelectedNextStatus('');
      setStatusNote('');
      setTimeout(() => setStatusSuccess(null), 4000);
    } else {
      setStatusError(res.error || 'Gagal mengubah status laporan.');
    }
  };

  const handleDuplicateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markAsDuplicate(report.id, duplicateInput);
    setIsDuplicateActive(true);
  };

  const handleUnlockIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);

    if (!unlockReason || unlockReason.trim().length < 5) {
      setUnlockError('Alasan pembukaan identitas wajib diisi minimal 5 karakter (Aturan KF-19).');
      return;
    }

    const res = unlockIdentity(report.id, unlockReason);
    if (res.success) {
      setIsUnlockModalOpen(false);
      setUnlockSuccess(true);
      setUnlockReason('');
    } else {
      setUnlockError(res.error || 'Gagal membuka identitas.');
    }
  };

  const isIdentityRevealed = !report.isAnonymous || report.revealedByIdentityLog;

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dasbor Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0F294A] dark:text-blue-400">
            {report.id}
          </span>
          {report.isHidden && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
              Disembunyikan dari Publik
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Details & Right Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Report Content & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Details Card */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {report.categoryName}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                  Urgensi: {report.urgency}
                </span>
                {report.isDuplicate && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    Duplikat {report.duplicateOfId ? `(${report.duplicateOfId})` : ''}
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>{report.location}</span>
              </h1>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Uraian Kendala Fasilitas
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            {/* Photos */}
            {report.images && report.images.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Foto Bukti yang Diunggah ({report.images.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.images.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900"
                    >
                      <img src={img} alt={`Bukti ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reporter Identity Panel (AB-05, KF-04, KF-19) */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Identitas Pelapor</span>
                </h3>

                {report.isAnonymous && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Status: Opsi Anonim
                  </span>
                )}
              </div>

              {isIdentityRevealed ? (
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
                  {report.isAnonymous && (
                    <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900/50 mb-2">
                      Identitas anonim telah dibuka oleh Admin Utama dan tercatat pada Log Akses Identitas.
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400">Nama Pelapor:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{report.reporterName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">NIM:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{report.reporterNim}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-200">{report.reporterEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Jurusan:</span>{' '}
                      <span className="text-slate-800 dark:text-slate-200">{report.reporterJurusan}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <div>
                      <strong>Identitas Dilindungi (Anonim):</strong> Nama dan NIM pelapor disamarkan untuk melindungi privasi mahasiswa sesuai aturan AB-05.
                    </div>
                  </div>

                  {/* Admin Utama can open identity */}
                  {currentUser.role === 'ADMIN_UTAMA' ? (
                    <button
                      onClick={() => setIsUnlockModalOpen(true)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors active:scale-95"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Buka Identitas Pelapor (Otoritas Wadek II)</span>
                    </button>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Hanya peran <strong>Admin Utama (Wakil Dekan II)</strong> yang memiliki otorisasi membuka identitas pelapor anonim.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Admin Note if any */}
            {report.adminNote && (
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs">
                <span className="font-semibold text-[#0F294A] dark:text-blue-300 block mb-1">
                  Catatan Admin Saat Ini:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{report.adminNote}"
                </p>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F294A] dark:text-blue-400" />
              <span>Linimasa Riwayat Status Laporan</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {histories.map((h, i) => (
                <div key={h.id} className="relative text-xs">
                  <div className="absolute -left-[23px] top-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#111827] border-2 border-blue-600 text-blue-600 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {h.toStatus} {h.fromStatus ? `(dari ${h.fromStatus})` : ''}
                      </strong>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {new Date(h.timestamp).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{h.actorName}</div>
                    {h.note && (
                      <div className="mt-1 text-slate-600 dark:text-slate-300 italic text-[11px]">
                        "{h.note}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Admin Actions & Controls */}
        <div className="space-y-6">
          {/* Panel Ubah Status (State Machine AB-03 & KF-17) */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Hourglass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Kelola Status Laporan</span>
            </h3>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="text-slate-400 text-[11px]">Status Saat Ini:</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {report.status}
              </div>
            </div>

            {statusError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{statusError}</span>
              </div>
            )}

            {statusSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{statusSuccess}</span>
              </div>
            )}

            {isFinal ? (
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
                Laporan ini telah mencapai status akhir (<strong>{report.status}</strong>) dan tidak dapat diubah lagi per aturan AB-03.
              </div>
            ) : (
              <form onSubmit={handleStatusSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ubah Status Menjadi:
                  </label>
                  <select
                    value={selectedNextStatus}
                    onChange={(e) => setSelectedNextStatus(e.target.value as ReportStatus)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Pilih status selanjutnya...</option>
                    {availableStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Admin {selectedNextStatus === 'Ditolak' && <span className="text-red-500">(Wajib saat ditolak)</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder={
                      selectedNextStatus === 'Ditolak'
                        ? 'Jelaskan alasan penolakan secara jelas (wajib)...'
                        : 'Catatan tindak lanjut teknisi atau sarpras...'
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Terapkan & Kirim Notifikasi</span>
                </button>
              </form>
            )}
          </div>

          {/* Panel Moderasi (Sembunyikan & Duplikat) */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Panel Moderasi Laporan
            </h3>

            {/* Sembunyikan Laporan */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  {report.isHidden ? <EyeOff className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-500" />}
                  <span>Sembunyikan Laporan</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Keluarkan dari daftar publik & statistik
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleHideReport(report.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  report.isHidden
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                }`}
              >
                {report.isHidden ? 'Tampilkan' : 'Sembunyikan'}
              </button>
            </div>

            {/* Tandai Duplikat */}
            <form onSubmit={handleDuplicateSubmit} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5 text-purple-600" />
                <span>Tandai Sebagai Duplikat</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Kaitkan dengan ID laporan utama yang memiliki objek kerusakan serupa.
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={duplicateInput}
                  onChange={(e) => setDuplicateInput(e.target.value)}
                  placeholder="Contoh: LAP-2026-001"
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Buka Identitas Pelapor (Khusus Admin Utama - KF-19) */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Konfirmasi Pembukaan Identitas Anonim
                </h3>
                <p className="text-xs text-slate-500">
                  Otoritas Khusus Admin Utama (Wakil Dekan II)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
              Perhatian (AB-05 &amp; KF-19): Pembukaan identitas pelapor anonim akan otomatis dicatat secara permanen pada <strong>Log Akses Identitas</strong> beserta nama Anda, waktu akses, dan alasan resmi yang Anda berikan.
            </p>

            {unlockError && (
              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{unlockError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockIdentitySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alasan Pembukaan Identitas (Wajib)
                </label>
                <textarea
                  rows={3}
                  value={unlockReason}
                  onChange={(e) => setUnlockReason(e.target.value)}
                  required
                  placeholder="Contoh: Klarifikasi kronologi korsleting listrik di meja laboratorium untuk keselamatan praktikan..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  className="px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm active:scale-95 transition-all"
                >
                  Buka &amp; Catat ke Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
