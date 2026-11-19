'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';
import { Shield, User, Key, ChevronUp, ChevronDown, Check } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const roles: { role: Role; label: string; email: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'MAHASISWA',
      label: 'Mahasiswa',
      email: 'mahasiswa@student.unsil.ac.id',
      icon: <User className="w-4 h-4" />,
      desc: 'Buat laporan, lihat laporan saya, beri dukungan',
    },
    {
      role: 'ADMIN',
      label: 'Admin Sarpras',
      email: 'admin@unsil.ac.id',
      icon: <Key className="w-4 h-4" />,
      desc: 'Kelola status laporan, moderasi, kelola kategori',
    },
    {
      role: 'ADMIN_UTAMA',
      label: 'Admin Utama (Wadek II)',
      email: 'adminutama@unsil.ac.id',
      icon: <Shield className="w-4 h-4 text-amber-500" />,
      desc: 'Otoritas buka identitas anonim & audit log',
    },
  ];

  return (
    <aside
      aria-label="Pengalih Peran Cepat"
      className="fixed bottom-4 right-4 z-40 max-w-sm"
    >
      <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ease-out">
        {/* Toggle Pill Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block leading-tight">
                Peran Aktif:
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                {currentUser.role === 'ADMIN_UTAMA' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    Admin Utama
                  </>
                ) : currentUser.role === 'ADMIN' ? (
                  <>
                    <Key className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    Admin Sarpras
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 flex-shrink-0" />
                    Mahasiswa FT
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
              Ganti Peran
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/40">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 px-2 py-1">
              Pilih Peran Demo (1-Klik)
            </p>
            {roles.map((item) => {
              const isActive = currentUser.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setIsExpanded(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-all text-xs ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200'
                      : 'hover:bg-white dark:hover:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold flex items-center justify-between">
                      <span>{item.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.email}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
