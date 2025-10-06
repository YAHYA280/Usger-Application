import { create } from "zustand";
import {
  Absence,
  AbsenceActions,
  AbsenceFilters,
  AbsenceFormData,
  AbsenceState,
} from "../shared/types/absence";

type AbsenceStore = AbsenceState & AbsenceActions;

const applyFiltersToAbsences = (
  absences: Absence[],
  filters: AbsenceFilters
) => {
  let filtered = [...absences];

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (absence) =>
        absence.personneSignalante.toLowerCase().includes(query) ||
        absence.observations.toLowerCase().includes(query) ||
        (absence.usagerNom &&
          absence.usagerNom.toLowerCase().includes(query)) ||
        (absence.societe && absence.societe.toLowerCase().includes(query))
    );
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((absence) =>
      filters.status!.includes(absence.status)
    );
  }

  // Filter by trajet type
  if (filters.trajetType && filters.trajetType.length > 0) {
    filtered = filtered.filter((absence) =>
      filters.trajetType!.includes(absence.trajetsConcernes)
    );
  }

  // Filter by mode de saisie
  if (filters.modeSaisie && filters.modeSaisie.length > 0) {
    filtered = filtered.filter((absence) =>
      filters.modeSaisie!.includes(absence.modeSaisie)
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter(
      (absence) => new Date(absence.dateDebut) >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      (absence) => new Date(absence.dateFin) <= filters.dateTo!
    );
  }

  // Sort by creation date (most recent first)
  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Mock data
const mockAbsences: Absence[] = [
  {
    id: "1",
    dateDebut: "22/05/2025",
    dateFin: "22/05/2025",
    trajetsConcernes: "Aller",
    observations: "Les remarques ou et commentaires ajoutés.",
    personneSignalante: "Jacqueline Jacqueline",
    modeSaisie: "Portail",
    status: "En cours",
    societe: "Transport Scolaire SA",
    usagerNom: "Ahmed Benali",
    usagerId: "user_123",
    createdAt: new Date(2025, 4, 22, 8, 30),
    updatedAt: new Date(2025, 4, 22, 8, 30),
  },
  {
    id: "2",
    dateDebut: "22/05/2025",
    dateFin: "22/05/2025",
    trajetsConcernes: "Aller",
    observations: "Les remarques ou et commentaires ajoutés.",
    personneSignalante: "Jacqueline Jacqueline",
    modeSaisie: "Portail",
    status: "Non Traité",
    societe: "Transport Scolaire SA",
    usagerNom: "Ahmed Benali",
    usagerId: "user_123",
    createdAt: new Date(2025, 4, 22, 9, 15),
    updatedAt: new Date(2025, 4, 22, 9, 15),
  },
  {
    id: "3",
    dateDebut: "22/05/2025",
    dateFin: "22/05/2025",
    trajetsConcernes: "Aller",
    observations: "Les remarques ou et commentaires ajoutés.",
    personneSignalante: "Jacqueline Jacqueline",
    modeSaisie: "Portail",
    status: "Traité",
    societe: "Transport Scolaire SA",
    usagerNom: "Ahmed Benali",
    usagerId: "user_123",
    createdAt: new Date(2025, 4, 22, 10, 0),
    updatedAt: new Date(2025, 4, 22, 14, 30),
  },
  {
    id: "4",
    dateDebut: "22/05/2025",
    dateFin: "22/05/2025",
    trajetsConcernes: "Aller",
    observations: "Les remarques ou et commentaires ajoutés.",
    personneSignalante: "Jacqueline Jacqueline",
    modeSaisie: "Portail",
    status: "Traité",
    societe: "Transport Scolaire SA",
    usagerNom: "Ahmed Benali",
    usagerId: "user_123",
    createdAt: new Date(2025, 4, 22, 11, 45),
    updatedAt: new Date(2025, 4, 22, 15, 20),
  },
  {
    id: "5",
    dateDebut: "22/05/2025",
    dateFin: "22/05/2025",
    trajetsConcernes: "Aller",
    observations: "Les remarques ou et commentaires ajoutés.",
    personneSignalante: "Jacqueline Jacqueline",
    modeSaisie: "Portail",
    status: "Traité",
    societe: "Transport Scolaire SA",
    usagerNom: "Ahmed Benali",
    usagerId: "user_123",
    createdAt: new Date(2025, 4, 22, 13, 0),
    updatedAt: new Date(2025, 4, 22, 16, 45),
  },
];

export const useAbsenceStore = create<AbsenceStore>((set, get) => ({
  // State
  absences: mockAbsences,
  filteredAbsences: mockAbsences,
  filters: {},
  isLoading: false,
  error: null,
  selectedAbsence: null,
  isEditMode: false,
  pendingChanges: {},

  // Actions
  fetchAbsences: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredAbsences = applyFiltersToAbsences(
          mockAbsences,
          state.filters
        );
        return {
          absences: mockAbsences,
          filteredAbsences,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des absences",
        isLoading: false,
      });
    }
  },

  getAbsenceById: (id: string) => {
    return get().absences.find((absence) => absence.id === id);
  },

  addAbsence: async (absenceData: AbsenceFormData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newAbsence: Absence = {
        id: `absence_${Date.now()}`,
        ...absenceData,
        status: "En cours",
        modeSaisie: "Portail",
        usagerNom: "Ahmed Benali",
        usagerId: "user_123",
        societe: "Transport Scolaire SA",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => {
        const updatedAbsences = [newAbsence, ...state.absences];
        const filteredAbsences = applyFiltersToAbsences(
          updatedAbsences,
          state.filters
        );

        return {
          absences: updatedAbsences,
          filteredAbsences,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de l'ajout de l'absence",
        isLoading: false,
      });
      throw error;
    }
  },

  updateAbsence: async (id: string, data: Partial<AbsenceFormData>) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set((state) => {
        const updatedAbsences = state.absences.map((absence) =>
          absence.id === id
            ? {
                ...absence,
                ...data,
                updatedAt: new Date(),
              }
            : absence
        );

        const filteredAbsences = applyFiltersToAbsences(
          updatedAbsences,
          state.filters
        );

        return {
          absences: updatedAbsences,
          filteredAbsences,
          selectedAbsence:
            state.selectedAbsence?.id === id
              ? { ...state.selectedAbsence, ...data, updatedAt: new Date() }
              : state.selectedAbsence,
          isLoading: false,
          isEditMode: false,
          pendingChanges: {},
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour de l'absence",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteAbsence: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedAbsences = state.absences.filter(
          (absence) => absence.id !== id
        );
        const filteredAbsences = applyFiltersToAbsences(
          updatedAbsences,
          state.filters
        );

        return {
          absences: updatedAbsences,
          filteredAbsences,
          isLoading: false,
          selectedAbsence:
            state.selectedAbsence?.id === id ? null : state.selectedAbsence,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de l'absence",
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (newFilters: Partial<AbsenceFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredAbsences = applyFiltersToAbsences(
        state.absences,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredAbsences,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredAbsences = applyFiltersToAbsences(state.absences, {});

      return {
        filters: {},
        filteredAbsences,
      };
    });
  },

  applyFilters: () => {
    set((state) => {
      const filteredAbsences = applyFiltersToAbsences(
        state.absences,
        state.filters
      );
      return { filteredAbsences };
    });
  },

  setSelectedAbsence: (absence: Absence | null) => {
    set({ selectedAbsence: absence, isEditMode: false, pendingChanges: {} });
  },

  toggleEditMode: () => {
    set((state) => ({
      isEditMode: !state.isEditMode,
      pendingChanges: !state.isEditMode ? {} : state.pendingChanges,
    }));
  },

  setPendingChanges: (changes: Partial<AbsenceFormData>) => {
    set((state) => ({
      pendingChanges: { ...state.pendingChanges, ...changes },
    }));
  },

  clearPendingChanges: () => {
    set({ pendingChanges: {} });
  },

  cancelEdit: () => {
    set({ isEditMode: false, pendingChanges: {} });
  },

  getFilteredAbsences: () => {
    return get().filteredAbsences;
  },

  getAbsenceCount: () => {
    return get().absences.length;
  },

  clearError: () => {
    set({ error: null });
  },

  exportAbsences: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Implementation for export would go here
      set({ isLoading: false });
    } catch (error) {
      set({
        error: "Erreur lors de l'export des absences",
        isLoading: false,
      });
      throw error;
    }
  },

  searchAbsences: (query: string) => {
    set((state) => {
      const updatedFilters = { ...state.filters, searchQuery: query };
      const filteredAbsences = applyFiltersToAbsences(
        state.absences,
        updatedFilters
      );

      return {
        filters: updatedFilters,
        filteredAbsences,
      };
    });
  },
}));
