'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { UrgencyLevel } from '@/types';
import {
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  Info,
  MapPin,
  FileText,
  Tag,
  AlertTriangle,
} from 'lucide-react';

export default function BuatLaporanPage() {
  const router = useRouter();
  const { categories, createReport, getDailyReportCount, currentUser } = useApp();

  const dailyUsed = getDailyReportCount();
  const dailyRemaining = Math.max(0, 5 - dailyUsed);
  const isQuotaExceeded = dailyRemaining <= 0;

  // Active categories only
  const activeCategories = categories.filter((c) => c.isActive);

  // Form states
  const [categoryId, setCategoryId] = useState(activeCategories[0]?.id || '');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Sedang');
  const [incidentDate, setIncidentDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      setErrorMsg('Maksimal 3 foto bukti yang dapat diunggah per laporan.');
      return;
    }

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isQuotaExceeded) {
      setErrorMsg('Anda telah mencapai batas 5 laporan dalam 24 jam terakhir.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Kategori fasilitas wajib dipilih.');
      return;
    }

    if (!location.trim()) {
      setErrorMsg('Lokasi atau ruangan fasilitas wajib diisi.');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Deskripsi kerusakan fasilitas wajib diisi minimal 10 karakter.');
      return;
    }

    setIsSubmitting(true);

    const result = createReport({
      categoryId,
      location: location.trim(),
      description: description.trim(),
      urgency,
      incidentDate: incidentDate || undefined,
      images,
      isAnonymous,
    });

    if (result.success && result.reportId) {
      router.push(`/laporan-saya/${result.reportId}`);
    } else {
      setIsSubmitting(false);
      setErrorMsg(result.error || 'Terjadi kesalahan saat membuat laporan.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header and Quota Indicator (KF-13) */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Buat Laporan Fasilitas Baru
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sampaikan kendala fasilitas FT agar segera ditindaklanjuti oleh Subbag Sarpras.
            </p>
          </div>

          {/* Daily Quota Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <Clock className="w-4 h-4 text-[#0F294A] dark:text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Sisa Kuota 24 Jam
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                {dailyRemaining} dari 5 laporan
              </div>
            </div>
          </div>
        </div>

        {isQuotaExceeded && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Batas pembuatan laporan harian tercapai. Anda baru dapat mengirim laporan baru setelah masa 24 jam berlalu.
            </span>
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Category (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Kategori Fasilitas</span>
              <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500"
            >
              {activeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Location (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Lokasi / Ruangan Spesifik</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Contoh: Ruang C204 Lantai 2 Gedung C / Lab Jaringan D301"
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500"
            />
          </div>

          {/* 3. Description (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Deskripsi Kerusakan / Kendala</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Jelaskan secara rinci kondisi fasilitas yang rusak, dampak terhadap aktivitas kuliah, dan titik persis kerusakan..."
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Minimal 10 karakter. Uraikan informasi yang jelas agar teknisi dapat menyiapkan peralatan yang tepat.
            </p>
          </div>

          {/* 4. Grid: Urgensi & Waktu Kejadian (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Tingkat Urgensi (Opsional)
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500"
              >
                <option value="Rendah">Rendah (Dapat ditunda / estetika)</option>
                <option value="Sedang">Sedang (Kendala wajar perkuliahan)</option>
                <option value="Tinggi">Tinggi (Mengganggu jalannya perkuliahan)</option>
                <option value="Darurat">Darurat (Berbahaya / korsleting / banjir)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Waktu Kejadian Diketahui (Opsional)
              </label>
              <input
                type="datetime-local"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F294A] dark:focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 5. Photo Upload Preview (Max 3, Data URL) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Foto Bukti Fasilitas (Maksimal 3 Foto)
            </label>

            {images.length < 3 && (
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/40 group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 mb-1.5 transition-colors" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Pilih foto dari perangkat (JPG, PNG, WebP)
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Pratinjau instan di browser tanpa unggah ke server luar
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Thumbnail previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video group"
                  >
                    <img
                      src={imgSrc}
                      alt={`Pratinjau foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600/80 text-white hover:bg-red-700 transition-colors"
                      title="Hapus foto ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Anonymous Report Toggle (AB-05, KF-04) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0F294A] dark:text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Kirim sebagai Laporan Anonim
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nama & NIM Anda tidak akan diperlihatkan kepada Admin biasa.
                  </div>
                </div>
              </div>

              {/* Accessible Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isAnonymous}
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  isAnonymous ? 'bg-[#0F294A] dark:bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    isAnonymous ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isAnonymous && (
              <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40">
                Catatan Perlindungan Identitas (AB-05): Data identitas Anda hanya dapat dibuka oleh <strong>Admin Utama (Wakil Dekan II)</strong> dengan alasan resmi dan seluruh akses tersebut tercatat pada log audit sistem.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isQuotaExceeded || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Menyimpan Laporan...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Laporan Fasilitas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
