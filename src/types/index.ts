export type Role = 'MAHASISWA' | 'ADMIN' | 'ADMIN_UTAMA';

export type ReportStatus = 'Diajukan' | 'Diproses' | 'Selesai' | 'Ditolak';

export type UrgencyLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  nim?: string;
  jurusan?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface StatusHistoryEntry {
  id: string;
  reportId: string;
  fromStatus: ReportStatus | null;
  toStatus: ReportStatus;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  note?: string;
}

export interface Report {
  id: string;
  categoryId: string;
  categoryName: string;
  location: string;
  description: string;
  urgency: UrgencyLevel;
  incidentDate?: string;
  images: string[];
  isAnonymous: boolean;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterNim: string;
  reporterJurusan: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  supportCount: number;
  supportedBy: string[]; // List of user IDs
  isHidden: boolean;
  isDuplicate: boolean;
  duplicateOfId?: string;
  adminNote?: string;
  revealedByIdentityLog?: boolean; // If identity unlocked by Admin Utama
}

export interface IdentityAccessLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  reportId: string;
  location: string;
  reason: string;
  reporterName: string;
  reporterNim: string;
}

export interface EmailNotification {
  id: string;
  timestamp: string;
  recipientEmail: string;
  recipientName: string;
  reportId: string;
  reportLocation: string;
  subject: string;
  body: string;
  triggerEvent: string;
  isRead: boolean;
}
