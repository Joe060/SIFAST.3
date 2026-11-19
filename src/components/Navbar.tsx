'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useApp } from '@/context/AppContext';
import {
  Sun,
  Moon,
  Mail,
  RotateCcw,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  Tags,
  ShieldAlert,
  FileText,
  Home,
  LogIn,
  Check,
} from 'lucide-react';
import { EmailNotificationDrawer } from './EmailNotificationDrawer';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { currentUser, emailLogs, resetDemoData } = useApp();

  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const unreadEmailCount = emailLogs.filter((e) => !e.isRead).length;

  const handleResetData = () => {
    resetDemoData();
    setShowResetConfirm(false);
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 2500);
  };

  const isAdminRole = currentUser.role === 'ADMIN' || currentUser.role === 'ADMIN_UTAMA';

  const navLinks = isAdminRole
    ? [
        { href: '/admin', label: 'Dasbor Admin', icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: '/admin/kategori', label: 'Kelola Kategori', icon: <Tags className="w-4 h-4" /> },
        {
          href: '/admin/log-identitas',
          label: 'Log Akses Identitas',
          icon: <ShieldAlert className="w-4 h-4" />,
          requiresAdminUtama: true,
        },
        { href: '/', label: 'Beranda Publik', icon: <Home className="w-4 h-4" /> },
      ]
    : [
        { href: '/', label: 'Beranda & Fasilitas', icon: <Home className="w-4 h-4" /> },
        { href: '/laporan-saya', label: 'Laporan Saya', icon: <FileText className="w-4 h-4" /> },
      ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0F294A] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              FT
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                SIFAST FT
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0F294A] dark:text-blue-300">
                  DEMO
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:inline">
                Fakultas Teknik Universitas Siliwangi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#0F294A] dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {link.requiresAdminUtama && currentUser.role !== 'ADMIN_UTAMA' && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      Khusus Wadek
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Buat Laporan CTA Button */}
            {!isAdminRole && (
              <Link
                href="/laporan/baru"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F294A] hover:bg-[#1E3A8A] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-sm transition-colors active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Laporan</span>
              </Link>
            )}

            {/* Outbox Email Simulation Trigger */}
            <button
              onClick={() => setIsEmailDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Buka Outbox Email Notifikasi (Simulasi)"
              aria-label="Outbox Email"
            >
              <Mail className="w-4 h-4" />
              {unreadEmailCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Ubah Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Demo Data Button */}
            <div className="relative">
              <button
                onClick={() => setShowResetConfirm(!showResetConfirm)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Reset Data Demo ke Kondisi Awal"
                aria-label="Reset Data Demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Confirmation Popup */}
              {showResetConfirm && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Reset Semua Data Demo?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    Seluruh laporan baru, perubahan status, dan log di `localStorage` akan dikembalikan ke data awal.
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2.5 py-1 text-xs rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleResetData}
                      className="px-2.5 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                      Ya, Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Quick indicator */}
            <Link
              href="/login"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
              title="Ke Halaman Masuk / Ganti Akun"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                {currentUser.avatar || 'U'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role.toLowerCase().replace('_', ' ')}
                </span>
              </div>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Buka menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 pt-3 pb-4 space-y-2">
            {!isAdminRole && (
              <Link
                href="/laporan/baru"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-[#0F294A] dark:bg-blue-600 text-white shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Laporan Baru</span>
              </Link>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-[#0F294A] dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <LogIn className="w-4 h-4" />
                <span>Ganti Akun Demo / Keluar</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Reset Toast Notification */}
      {resetSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-3.5 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4" />
          Data demo berhasil direset ke kondisi awal!
        </div>
      )}

      {/* Outbox Drawer Component */}
      <EmailNotificationDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
      />
    </>
  );
};
