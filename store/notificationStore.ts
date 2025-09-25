import { create } from "zustand";
import {
  Notification,
  NotificationActions,
  NotificationFilters,
  NotificationPreferences,
  NotificationState,
} from "../shared/types/notification";

type NotificationStore = NotificationState & NotificationActions;

const applyFiltersToNotifications = (
  notifications: Notification[],
  filters: NotificationFilters
) => {
  let filtered = [...notifications];

  // Filter by priority
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter((n) => filters.priority!.includes(n.priority));
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((n) => filters.status!.includes(n.status));
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        (n.detailedMessage &&
          n.detailedMessage.toLowerCase().includes(query)) ||
        (n.context?.studentName &&
          n.context.studentName.toLowerCase().includes(query))
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter((n) => n.timestamp >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((n) => n.timestamp <= filters.dateTo!);
  }

  return filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

//
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouvelle absence:",
    message: "Anglais - 22 mai. Statut : En cours",
    detailedMessage:
      "Votre enfant Ahmed Benali a été marqué absent en cours d'Anglais le 22 mai 2025. L'absence est actuellement en cours de traitement. Veuillez justifier cette absence si nécessaire.",
    priority: "important",
    status: "unread",
    timestamp: new Date(2025, 4, 22, 10, 30),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      subject: "Anglais",
      date: "22 mai 2025",
    },
    actions: [
      {
        id: "1",
        type: "mark_justified",
        label: "Justifier l'absence",
        variant: "primary",
      },
      {
        id: "2",
        type: "contact_school",
        label: "Contacter l'école",
        variant: "outline",
      },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "2",
    title: "Absence traitée",
    message: "Anglais - 22 mai. Statut : Traité",
    detailedMessage:
      "L'absence de votre enfant Ahmed Benali en cours d'Anglais du 22 mai 2025 a été traitée et acceptée. Merci d'avoir fourni la justification nécessaire.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 4, 22, 14, 15),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      subject: "Anglais",
      date: "22 mai 2025",
    },
    isPinned: false,
    isRead: true,
  },
  {
    id: "3",
    title: "Nouvelle absence:",
    message: "Mathématiques - 23 mai. Statut : En cours",
    detailedMessage:
      "Votre enfant Ahmed Benali a été marqué absent en cours de Mathématiques le 23 mai 2025. L'absence est actuellement en cours de traitement.",
    priority: "important",
    status: "unread",
    timestamp: new Date(2025, 4, 23, 9, 0),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      subject: "Mathématiques",
      date: "23 mai 2025",
    },
    actions: [
      {
        id: "3",
        type: "mark_justified",
        label: "Justifier l'absence",
        variant: "primary",
      },
      {
        id: "4",
        type: "view_details",
        label: "Voir détails",
        variant: "outline",
      },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "4",
    title: "Absence traitée",
    message: "Mathématiques - 23 mai. Statut : Traité",
    detailedMessage:
      "L'absence de votre enfant Ahmed Benali en cours de Mathématiques du 23 mai 2025 a été traitée. Le certificat médical a été accepté.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 4, 23, 16, 30),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      subject: "Mathématiques",
      date: "23 mai 2025",
    },
    isPinned: false,
    isRead: true,
  },
  {
    id: "5",
    title: "Nouvelle absence:",
    message: "Histoire - 24 mai. Statut : En cours",
    detailedMessage:
      "Votre enfant Ahmed Benali a été marqué absent en cours d'Histoire le 24 mai 2025. Veuillez justifier cette absence dans les plus brefs délais.",
    priority: "urgent",
    status: "pinned",
    timestamp: new Date(2025, 4, 24, 11, 0),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      subject: "Histoire",
      date: "24 mai 2025",
    },
    actions: [
      {
        id: "5",
        type: "mark_justified",
        label: "Justifier maintenant",
        variant: "primary",
      },
      {
        id: "6",
        type: "contact_school",
        label: "Appeler l'école",
        variant: "outline",
      },
    ],
    isPinned: true,
    isRead: false,
  },
  {
    id: "6",
    title: "Retard signalé",
    message: "Votre enfant est arrivé en retard ce matin",
    detailedMessage:
      "Ahmed Benali est arrivé avec 15 minutes de retard ce matin. Il a été admis en classe après justification auprès de la vie scolaire.",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 4, 25, 8, 15),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      date: "25 mai 2025",
    },
    isPinned: false,
    isRead: true,
  },
  {
    id: "7",
    title: "Convocation parent",
    message: "Rendez-vous demandé avec le professeur principal",
    detailedMessage:
      "Le professeur principal de la classe de 6ème A souhaite vous rencontrer concernant Ahmed Benali. Veuillez prendre contact avec le secrétariat pour fixer un rendez-vous.",
    priority: "urgent",
    status: "unread",
    timestamp: new Date(2025, 4, 25, 14, 0),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
    },
    actions: [
      {
        id: "7",
        type: "contact_school",
        label: "Prendre RDV",
        variant: "primary",
      },
      {
        id: "8",
        type: "view_details",
        label: "Plus d'infos",
        variant: "outline",
      },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "8",
    title: "Note importante",
    message: "Excellente note en Mathématiques : 18/20",
    detailedMessage:
      "Félicitations ! Ahmed Benali a obtenu une excellente note de 18/20 au contrôle de Mathématiques du 24 mai. Continuez ainsi !",
    priority: "informative",
    status: "read",
    timestamp: new Date(2025, 4, 25, 16, 45),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      subject: "Mathématiques",
    },
    isPinned: false,
    isRead: true,
  },
  {
    id: "9",
    title: "Sortie scolaire",
    message: "Autorisation requise pour la sortie du 30 mai",
    detailedMessage:
      "Une sortie scolaire au Musée des Sciences est prévue le 30 mai 2025. Votre autorisation parentale est requise. Merci de retourner le formulaire signé avant le 28 mai.",
    priority: "important",
    status: "unread",
    timestamp: new Date(2025, 4, 26, 9, 30),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
      className: "6ème A",
      location: "Musée des Sciences",
      date: "30 mai 2025",
    },
    actions: [
      {
        id: "9",
        type: "view_details",
        label: "Voir formulaire",
        variant: "primary",
      },
    ],
    isPinned: false,
    isRead: false,
  },
  {
    id: "10",
    title: "Rappel vaccination",
    message: "Rappel DT-Polio requis avant la rentrée",
    detailedMessage:
      "Le rappel de vaccination DT-Polio de votre enfant arrive à échéance. Merci de prendre rendez-vous chez votre médecin avant la prochaine rentrée scolaire.",
    priority: "important",
    status: "read",
    timestamp: new Date(2025, 4, 20, 10, 0),
    context: {
      studentId: "student_123",
      studentName: "Ahmed Benali",
    },
    isPinned: false,
    isRead: true,
  },
];

const defaultPreferences: NotificationPreferences = {
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  soundEnabled: true,
  vibrationEnabled: true,
  prioritySettings: {
    urgent: true,
    important: true,
    informative: true,
  },
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // State
  notifications: mockNotifications,
  filteredNotifications: mockNotifications,
  filters: {},
  preferences: defaultPreferences,
  isLoading: false,
  error: null,

  // Actions
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredNotifications = applyFiltersToNotifications(
          mockNotifications,
          state.filters
        );
        return {
          notifications: mockNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des notifications",
        isLoading: false,
      });
    }
  },

  markAsRead: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
                status: notification.isPinned
                  ? ("pinned" as const)
                  : ("read" as const),
              }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  markAsUnread: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: false,
                status: notification.isPinned
                  ? ("pinned" as const)
                  : ("unread" as const),
              }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  pinNotification: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isPinned: true, status: "pinned" as const }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  unpinNotification: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isPinned: false,
                status: notification.isRead
                  ? ("read" as const)
                  : ("unread" as const),
              }
            : notification
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  deleteNotification: (id: string) => {
    set({ isLoading: true });

    setTimeout(() => {
      set((state) => {
        const updatedNotifications = state.notifications.filter(
          (notification) => notification.id !== id
        );

        const filteredNotifications = applyFiltersToNotifications(
          updatedNotifications,
          state.filters
        );

        return {
          notifications: updatedNotifications,
          filteredNotifications,
          isLoading: false,
        };
      });
    }, 300);
  },

  setFilters: (newFilters: Partial<NotificationFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredNotifications = applyFiltersToNotifications(
        state.notifications,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredNotifications,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredNotifications = applyFiltersToNotifications(
        state.notifications,
        {}
      );

      return {
        filters: {},
        filteredNotifications,
      };
    });
  },

  applyFilters: () => {
    set((state) => {
      const filteredNotifications = applyFiltersToNotifications(
        state.notifications,
        state.filters
      );
      return { filteredNotifications };
    });
  },

  updatePreferences: (newPreferences: Partial<NotificationPreferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    }));
  },

  getFilteredNotifications: () => {
    return get().filteredNotifications;
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  getNotificationCounts: () => {
    const notifications = get().notifications;
    const counts = {
      all: 0,
      unread: 0,
      read: 0,
      pinned: 0,
      urgent: 0,
      important: 0,
      informative: 0,
    };

    notifications.forEach((notification) => {
      counts.all++;

      if (notification.isPinned) {
        counts.pinned++;
      }

      if (notification.isRead) {
        counts.read++;
      } else {
        counts.unread++;
      }

      counts[notification.priority]++;
    });

    return counts;
  },

  clearError: () => {
    set({ error: null });
  },
}));
