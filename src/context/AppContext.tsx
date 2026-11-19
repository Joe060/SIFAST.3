'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  EmailNotification,
  IdentityAccessLog,
  Report,
  ReportStatus,
  Role,
  StatusHistoryEntry,
  UrgencyLevel,
  User,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_EMAIL_LOGS,
  INITIAL_IDENTITY_LOGS,
  INITIAL_REPORTS,
  INITIAL_STATUS_HISTORY,
  INITIAL_USERS,
} from '@/data/seedData';

interface CreateReportInput {
  categoryId: string;
  location: string;
  description: string;
  urgency: UrgencyLevel;
  incidentDate?: string;
  images: string[];
  isAnonymous: boolean;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  categories: Category[];
  reports: Report[];
  statusHistory: StatusHistoryEntry[];
  identityLogs: IdentityAccessLog[];
  emailLogs: EmailNotification[];
  isHydrated: boolean;

  // Actions
  createReport: (input: CreateReportInput) => { success: boolean; error?: string; reportId?: string };
  updateReportStatus: (reportId: string, newStatus: ReportStatus, note?: string) => { success: boolean; error?: string };
  toggleSupport: (reportId: string) => { success: boolean; message?: string };
  toggleHideReport: (reportId: string) => void;
  markAsDuplicate: (reportId: string, duplicateOfId: string) => void;
  unlockIdentity: (reportId: string, reason: string) => { success: boolean; error?: string };
  
  // Category management
  addCategory: (name: string, description: string) => void;
  updateCategory: (id: string, name: string, description: string) => void;
  toggleCategoryStatus: (id: string) => void;

  // Email notifications
  markEmailAsRead: (id: string) => void;
  markAllEmailsAsRead: () => void;

  // Quota & Demo Reset
  getDailyReportCount: () => number;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'sifast_current_user',
  CATEGORIES: 'sifast_categories',
  REPORTS: 'sifast_reports',
  STATUS_HISTORY: 'sifast_status_history',
  IDENTITY_LOGS: 'sifast_identity_logs',
  EMAIL_LOGS: 'sifast_email_logs',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS.mahasiswa);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>(INITIAL_STATUS_HISTORY);
  const [identityLogs, setIdentityLogs] = useState<IdentityAccessLog[]>(INITIAL_IDENTITY_LOGS);
  const [emailLogs, setEmailLogs] = useState<EmailNotification[]>(INITIAL_EMAIL_LOGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (savedReports) setReports(JSON.parse(savedReports));

      const savedHistory = localStorage.getItem(STORAGE_KEYS.STATUS_HISTORY);
      if (savedHistory) setStatusHistory(JSON.parse(savedHistory));

      const savedIdentity = localStorage.getItem(STORAGE_KEYS.IDENTITY_LOGS);
      if (savedIdentity) setIdentityLogs(JSON.parse(savedIdentity));

      const savedEmails = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
      if (savedEmails) setEmailLogs(JSON.parse(savedEmails));
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      localStorage.setItem(STORAGE_KEYS.STATUS_HISTORY, JSON.stringify(statusHistory));
      localStorage.setItem(STORAGE_KEYS.IDENTITY_LOGS, JSON.stringify(identityLogs));
      localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(emailLogs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [currentUser, categories, reports, statusHistory, identityLogs, emailLogs, isHydrated]);

  const switchRole = (role: Role) => {
    if (role === 'MAHASISWA') setCurrentUser(INITIAL_USERS.mahasiswa);
    else if (role === 'ADMIN') setCurrentUser(INITIAL_USERS.admin);
    else if (role === 'ADMIN_UTAMA') setCurrentUser(INITIAL_USERS.adminUtama);
  };

  const resetDemoData = () => {
    setCurrentUser(INITIAL_USERS.mahasiswa);
    setCategories(INITIAL_CATEGORIES);
    setReports(INITIAL_REPORTS);
    setStatusHistory(INITIAL_STATUS_HISTORY);
    setIdentityLogs(INITIAL_IDENTITY_LOGS);
    setEmailLogs(INITIAL_EMAIL_LOGS);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.REPORTS);
      localStorage.removeItem(STORAGE_KEYS.STATUS_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.IDENTITY_LOGS);
      localStorage.removeItem(STORAGE_KEYS.EMAIL_LOGS);
    }
  };

  const getDailyReportCount = () => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return reports.filter(
      (r) => r.reporterId === currentUser.id && new Date(r.createdAt).getTime() > oneDayAgo
    ).length;
  };

  const createReport = (input: CreateReportInput) => {
    const dailyCount = getDailyReportCount();
    if (dailyCount >= 5) {
      return {
        success: false,
        error: 'Batas pembuatan laporan harian tercapai (Maksimal 5 laporan dalam kurun waktu 24 jam).',
      };
    }

    const category = categories.find((c) => c.id === input.categoryId);
    if (!category || !category.isActive) {
      return { success: false, error: 'Kategori fasilitas yang dipilih tidak valid atau nonaktif.' };
    }

    const nextIdNum = reports.length + 1;
    const newId = `LAP-2026-${String(nextIdNum).padStart(3, '0')}`;
    const nowIso = new Date().toISOString();

    const newReport: Report = {
      id: newId,
      categoryId: input.categoryId,
      categoryName: category.name,
      location: input.location.trim(),
      description: input.description.trim(),
      urgency: input.urgency,
      incidentDate: input.incidentDate || undefined,
      images: input.images,
      isAnonymous: input.isAnonymous,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterEmail: currentUser.email,
      reporterNim: currentUser.nim || '217006001',
      reporterJurusan: currentUser.jurusan || 'Informatika',
      status: 'Diajukan',
      createdAt: nowIso,
      updatedAt: nowIso,
      supportCount: 0,
      supportedBy: [],
      isHidden: false,
      isDuplicate: false,
      revealedByIdentityLog: false,
    };

    const initialHistoryEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      reportId: newId,
      fromStatus: null,
      toStatus: 'Diajukan',
      timestamp: nowIso,
      actorName: input.isAnonymous ? 'Pelapor (Opsi Anonim)' : `${currentUser.name} (${currentUser.role})`,
      actorRole: currentUser.role,
      note: 'Laporan fasilitas berhasil diajukan ke sistem SIFAST FT.',
    };

    setReports((prev) => [newReport, ...prev]);
    setStatusHistory((prev) => [...prev, initialHistoryEntry]);

    return { success: true, reportId: newId };
  };

  const updateReportStatus = (reportId: string, newStatus: ReportStatus, note?: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return { success: false, error: 'Laporan tidak ditemukan.' };

    const currentStatus = report.status;

    // Validate state machine:
    // Diajukan -> Diproses | Ditolak
    // Diproses -> Selesai | Ditolak
    // Selesai & Ditolak are final
    if (currentStatus === 'Selesai' || currentStatus === 'Ditolak') {
      return { success: false, error: `Laporan sudah dalam status final (${currentStatus}) dan tidak dapat diubah lagi.` };
    }

    if (currentStatus === 'Diajukan' && newStatus !== 'Diproses' && newStatus !== 'Ditolak') {
      return { success: false, error: 'Dari status "Diajukan", status hanya dapat diubah ke "Diproses" atau "Ditolak".' };
    }

    if (currentStatus === 'Diproses' && newStatus !== 'Selesai' && newStatus !== 'Ditolak') {
      return { success: false, error: 'Dari status "Diproses", status hanya dapat diubah ke "Selesai" atau "Ditolak".' };
    }

    if (newStatus === 'Ditolak' && (!note || note.trim().length === 0)) {
      return { success: false, error: 'Catatan alasan penolakan wajib diisi bila status diubah menjadi "Ditolak".' };
    }

    const nowIso = new Date().toISOString();

    // 1. Update report
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: newStatus,
              updatedAt: nowIso,
              adminNote: note ? note.trim() : r.adminNote,
            }
          : r
      )
    );

    // 2. Add history entry
    const historyEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      reportId,
      fromStatus: currentStatus,
      toStatus: newStatus,
      timestamp: nowIso,
      actorName: `${currentUser.name} (${currentUser.role === 'ADMIN_UTAMA' ? 'Admin Utama' : 'Admin Sarpras'})`,
      actorRole: currentUser.role,
      note: note ? note.trim() : undefined,
    };
    setStatusHistory((prev) => [...prev, historyEntry]);

    // 3. Generate simulation email notification (KF-12, KN-12)
    const emailSubject =
      newStatus === 'Selesai'
        ? `[SIFAST FT] Laporan ${report.id} Telah SELESAI Ditangani`
        : newStatus === 'Ditolak'
        ? `[SIFAST FT] Pemberitahuan Status Laporan ${report.id}: DITOLAK`
        : `[SIFAST FT] Pembaruan Status Laporan ${report.id}: DIPROSES`;

    const emailBody = `Halo ${report.reporterName}, laporan fasilitas Anda (${report.id}) untuk lokasi "${report.location}" telah diperbarui menjadi ${newStatus.toUpperCase()} oleh ${currentUser.name}.${
      note ? ` Catatan admin: "${note.trim()}"` : ''
    }`;

    const newEmail: EmailNotification = {
      id: `eml-${Date.now()}`,
      timestamp: nowIso,
      recipientEmail: report.reporterEmail,
      recipientName: report.reporterName,
      reportId: report.id,
      reportLocation: report.location,
      subject: emailSubject,
      body: emailBody,
      triggerEvent: `Perubahan status laporan menjadi ${newStatus}`,
      isRead: false,
    };
    setEmailLogs((prev) => [newEmail, ...prev]);

    return { success: true };
  };

  const toggleSupport = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return { success: false, message: 'Laporan tidak ditemukan' };

    if (report.reporterId === currentUser.id) {
      return { success: false, message: 'Anda tidak dapat memberikan dukungan pada laporan milik sendiri.' };
    }

    const alreadySupported = report.supportedBy.includes(currentUser.id);

    if (alreadySupported) {
      // Per AB-04, 1 vote per user. Can remove or toggle.
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                supportCount: Math.max(0, r.supportCount - 1),
                supportedBy: r.supportedBy.filter((uid) => uid !== currentUser.id),
              }
            : r
        )
      );
      return { success: true, message: 'Dukungan Anda telah ditarik.' };
    } else {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                supportCount: r.supportCount + 1,
                supportedBy: [...r.supportedBy, currentUser.id],
              }
            : r
        )
      );
      return { success: true, message: 'Terima kasih, Anda telah mendukung laporan ini.' };
    }
  };

  const toggleHideReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, isHidden: !r.isHidden } : r))
    );
  };

  const markAsDuplicate = (reportId: string, duplicateOfId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              isDuplicate: true,
              duplicateOfId: duplicateOfId.trim() || undefined,
            }
          : r
      )
    );
  };

  const unlockIdentity = (reportId: string, reason: string) => {
    if (currentUser.role !== 'ADMIN_UTAMA') {
      return { success: false, error: 'Hanya Admin Utama yang berwenang membuka identitas pelapor anonim.' };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'Alasan pembukaan identitas wajib diisi dengan jelas (minimal 5 karakter).' };
    }

    const report = reports.find((r) => r.id === reportId);
    if (!report) return { success: false, error: 'Laporan tidak ditemukan.' };

    const nowIso = new Date().toISOString();

    const logEntry: IdentityAccessLog = {
      id: `log-${Date.now()}`,
      timestamp: nowIso,
      adminId: currentUser.id,
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      reportId: report.id,
      location: report.location,
      reason: reason.trim(),
      reporterName: report.reporterName,
      reporterNim: report.reporterNim,
    };

    setIdentityLogs((prev) => [logEntry, ...prev]);

    // Mark report as revealed
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, revealedByIdentityLog: true } : r))
    );

    return { success: true };
  };

  const addCategory = (name: string, description: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      isActive: true,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, name: string, description: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim(), description: description.trim() } : c))
    );
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const markEmailAsRead = (id: string) => {
    setEmailLogs((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
  };

  const markAllEmailsAsRead = () => {
    setEmailLogs((prev) => prev.map((e) => ({ ...e, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        categories,
        reports,
        statusHistory,
        identityLogs,
        emailLogs,
        isHydrated,
        createReport,
        updateReportStatus,
        toggleSupport,
        toggleHideReport,
        markAsDuplicate,
        unlockIdentity,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        markEmailAsRead,
        markAllEmailsAsRead,
        getDailyReportCount,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
