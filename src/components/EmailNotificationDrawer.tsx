'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Mail, X, CheckCheck, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface EmailNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailNotificationDrawer: React.FC<EmailNotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { emailLogs, markEmailAsRead, markAllEmailsAsRead } = useApp();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  if (!isOpen) return null;

  const unreadCount = emailLogs.filter((e) => !e.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-150 ease-out"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
        <div className="w-screen max-w-md bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-200 ease-out">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0F294A] dark:bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Outbox Notifikasi Email
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0F294A] dark:text-blue-300 tabular-nums">
                      {unreadCount} baru
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulasi email notifikasi sistem (KF-12, KN-12)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Tutup drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Toolbar */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Total {emailLogs.length} notifikasi terkirim
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllEmailsAsRead}
                className="text-xs font-medium text-[#0F294A] dark:text-blue-400 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {emailLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                <Mail className="w-10 h-10 mx-auto stroke-1 mb-2 opacity-50" />
                Belum ada email notifikasi yang terkirim.
              </div>
            ) : (
              emailLogs.map((email) => {
                const isSelected = selectedEmailId === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmailId(isSelected ? null : email.id);
                      if (!email.isRead) markEmailAsRead(email.id);
                    }}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      !email.isRead
                        ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {!email.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          Kepada: {email.recipientName} ({email.recipientEmail})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 tabular-nums flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(email.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#0F294A] dark:text-blue-400 mb-1 leading-snug">
                      {email.subject}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {email.body}
                    </p>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200/50 dark:border-slate-800 text-[11px] font-mono leading-relaxed break-words whitespace-pre-wrap">
                          {email.body}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">
                            Pemicu: {email.triggerEvent}
                          </span>
                          <Link
                            href={`/laporan-saya/${email.reportId}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0F294A] dark:text-blue-400 hover:underline"
                          >
                            Lihat Laporan ({email.reportId})
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Simulasi email berjalan otomatis di peramban (tanpa SMTP eksternal).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
