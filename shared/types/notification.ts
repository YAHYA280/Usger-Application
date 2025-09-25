export type NotificationPriority = "urgent" | "important" | "informative";
export type NotificationStatus = "unread" | "read" | "pinned";
export type NotificationActionType =
  | "view_details"
  | "contact_school"
  | "mark_justified"
  | "view_student";

export interface NotificationAction {
  id: string;
  type: NotificationActionType;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  detailedMessage?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: Date;
  context?: {
    studentId?: string;
    studentName?: string;
    className?: string;
    subject?: string;
    location?: string;
    date?: string;
  };
  actions?: NotificationAction[];
  isPinned: boolean;
  isRead: boolean;
}

export interface NotificationFilters {
  priority?: NotificationPriority[];
  status?: NotificationStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  prioritySettings: {
    urgent: boolean;
    important: boolean;
    informative: boolean;
  };
}

export interface NotificationState {
  notifications: Notification[];
  filteredNotifications: Notification[];
  filters: NotificationFilters;
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationActions {
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  pinNotification: (id: string) => void;
  unpinNotification: (id: string) => void;
  deleteNotification: (id: string) => void;

  setFilters: (filters: Partial<NotificationFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;

  getFilteredNotifications: () => Notification[];
  getUnreadCount: () => number;
  getNotificationCounts: () => {
    all: number;
    unread: number;
    read: number;
    pinned: number;
    urgent: number;
    important: number;
    informative: number;
  };
  clearError: () => void;
}
