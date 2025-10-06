export type AbsenceStatus = "En cours" | "Traité" | "Non Traité";
export type TrajetsType = "Aller" | "Retour" | "Aller-Retour";
export type ModeSaisie = "Portail" | "Fiche";

export interface Absence {
  id: string;
  dateDebut: string;
  dateFin: string;
  trajetsConcernes: TrajetsType;
  observations: string;
  personneSignalante: string;
  modeSaisie: ModeSaisie;
  status: AbsenceStatus;
  societe?: string;
  usagerNom?: string;
  usagerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AbsenceFilters {
  searchQuery?: string;
  status?: AbsenceStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  trajetType?: TrajetsType[];
  modeSaisie?: ModeSaisie[];
}

export interface AbsenceFormData {
  dateDebut: string;
  dateFin: string;
  trajetsConcernes: TrajetsType;
  observations: string;
  personneSignalante: string;
}

export interface AbsenceState {
  absences: Absence[];
  filteredAbsences: Absence[];
  filters: AbsenceFilters;
  isLoading: boolean;
  error: string | null;
  selectedAbsence: Absence | null;
  isEditMode: boolean;
  pendingChanges: Partial<AbsenceFormData>;
}

export interface AbsenceActions {
  fetchAbsences: () => Promise<void>;
  getAbsenceById: (id: string) => Absence | undefined;
  addAbsence: (absence: AbsenceFormData) => Promise<void>;
  updateAbsence: (id: string, data: Partial<AbsenceFormData>) => Promise<void>;
  deleteAbsence: (id: string) => Promise<void>;

  setFilters: (filters: Partial<AbsenceFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  setSelectedAbsence: (absence: Absence | null) => void;
  toggleEditMode: () => void;
  setPendingChanges: (changes: Partial<AbsenceFormData>) => void;
  clearPendingChanges: () => void;
  cancelEdit: () => void;

  getFilteredAbsences: () => Absence[];
  getAbsenceCount: () => number;
  clearError: () => void;

  exportAbsences: () => Promise<void>;
  searchAbsences: (query: string) => void;
}
