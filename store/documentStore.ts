import { create } from "zustand";
import {
  Document,
  DocumentActions,
  DocumentFilters,
  DocumentFormData,
  DocumentSortBy,
  DocumentState,
} from "../shared/types/document";

type DocumentStore = DocumentState & DocumentActions;

const applyFiltersAndSort = (
  documents: Document[],
  filters: DocumentFilters,
  sortBy: DocumentSortBy
) => {
  let filtered = [...documents];

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (doc) =>
        doc.nom.toLowerCase().includes(query) ||
        doc.numero.toLowerCase().includes(query) ||
        (doc.description && doc.description.toLowerCase().includes(query)) ||
        (doc.observations && doc.observations.toLowerCase().includes(query))
    );
  }

  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter((doc) => filters.type!.includes(doc.type));
  }

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((doc) =>
      filters.category!.includes(doc.category)
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(
      (doc) => new Date(doc.dateCreation) >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      (doc) => new Date(doc.dateCreation) <= filters.dateTo!
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "nom-asc":
        return a.nom.localeCompare(b.nom);
      case "nom-desc":
        return b.nom.localeCompare(a.nom);
      case "date-creation-asc":
        return (
          new Date(a.dateCreation).getTime() -
          new Date(b.dateCreation).getTime()
        );
      case "date-creation-desc":
        return (
          new Date(b.dateCreation).getTime() -
          new Date(a.dateCreation).getTime()
        );
      case "date-maj-asc":
        return (
          new Date(a.dateMiseAJour).getTime() -
          new Date(b.dateMiseAJour).getTime()
        );
      case "date-maj-desc":
        return (
          new Date(b.dateMiseAJour).getTime() -
          new Date(a.dateMiseAJour).getTime()
        );
      case "type-asc":
        return a.type.localeCompare(b.type);
      case "type-desc":
        return b.type.localeCompare(a.type);
      default:
        return 0;
    }
  });

  return filtered;
};

const mockDocuments: Document[] = [
  {
    id: "1",
    numero: "08658",
    nom: "Attestation de reussite",
    type: "Attestation",
    category: "Actif",
    dateCreation: "20/03/2025",
    dateMiseAJour: "20/03/2025",
    description: "Attestation de présence pour le mois de mars",
    observations: "Les infos n'ont pas claires",
    fileUrl: "https://example.com/doc1.pdf",
    fileType: "pdf",
    fileSize: "3,2 Mo",
    usagerId: "user_123",
    usagerNom: "Ahmed Benali",
  },
  {
    id: "2",
    numero: "08659",
    nom: "Contrat de service",
    type: "Contrat",
    category: "Actif",
    dateCreation: "15/03/2025",
    dateMiseAJour: "15/03/2025",
    description: "Contrat de service pour l'année scolaire 2024-2025",
    fileUrl: "https://example.com/doc2.pdf",
    fileType: "pdf",
    fileSize: "1,5 Mo",
    usagerId: "user_123",
    usagerNom: "Ahmed Benali",
  },
  {
    id: "3",
    numero: "03846493",
    nom: "Décharge parentale",
    type: "Décharge",
    category: "Actif",
    dateCreation: "10/04/2025",
    dateMiseAJour: "10/04/2025",
    description: "Décharge de responsabilité pour le transport scolaire",
    observations:
      "Je prends quelques jours pour des raisons personnelles. Merci de votre compréhension",
    fileUrl: "https://example.com/doc3.pdf",
    fileType: "pdf",
    fileSize: "3,2 Mo",
    usagerId: "user_123",
    usagerNom: "Ahmed Benali",
  },
  {
    id: "4",
    numero: "08660",
    nom: "Attestation de scolarité",
    type: "Attestation",
    category: "Archivé",
    dateCreation: "01/02/2025",
    dateMiseAJour: "05/02/2025",
    dateExpiration: "30/06/2025",
    description: "Attestation de scolarité pour l'année 2024",
    fileUrl: "https://example.com/doc4.pdf",
    fileType: "pdf",
    fileSize: "2,1 Mo",
    usagerId: "user_123",
    usagerNom: "Ahmed Benali",
  },
  {
    id: "5",
    numero: "08661",
    nom: "Décharge parentale ancienne",
    type: "Décharge",
    category: "Archivé",
    dateCreation: "10/01/2025",
    dateMiseAJour: "15/01/2025",
    dateExpiration: "10/03/2025",
    description: "Décharge parentale pour sorties scolaires",
    fileUrl: "https://example.com/doc5.pdf",
    fileType: "pdf",
    fileSize: "1,8 Mo",
    usagerId: "user_123",
    usagerNom: "Ahmed Benali",
  },
];

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: mockDocuments,
  filteredDocuments: mockDocuments,
  filters: {},
  sortBy: "date-creation-desc",
  isLoading: false,
  error: null,
  selectedDocument: null,
  uploadProgress: 0,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredDocuments = applyFiltersAndSort(
          mockDocuments,
          state.filters,
          state.sortBy
        );
        return {
          documents: mockDocuments,
          filteredDocuments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des documents",
        isLoading: false,
      });
    }
  },

  getDocumentById: (id: string) => {
    return get().documents.find((doc) => doc.id === id);
  },

  uploadDocument: async (data: DocumentFormData) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        set({ uploadProgress: i });
      }

      const newDocument: Document = {
        id: `doc_${Date.now()}`,
        numero: `${Math.floor(10000 + Math.random() * 90000)}`,
        nom: data.nom,
        type: data.type,
        category: "Actif",
        dateCreation: new Date().toLocaleDateString("fr-FR"),
        dateMiseAJour: new Date().toLocaleDateString("fr-FR"),
        description: data.description,
        observations: data.observations,
        fileUrl: data.file.uri,
        fileType: data.file.type.includes("pdf")
          ? "pdf"
          : data.file.type.includes("word")
          ? "word"
          : "image",
        fileSize: `${(data.file.size / (1024 * 1024)).toFixed(1)} Mo`,
        usagerId: "user_123",
        usagerNom: "Ahmed Benali",
      };

      set((state) => {
        const updatedDocuments = [newDocument, ...state.documents];
        const filteredDocuments = applyFiltersAndSort(
          updatedDocuments,
          state.filters,
          state.sortBy
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          isLoading: false,
          uploadProgress: 0,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du téléchargement du document",
        isLoading: false,
        uploadProgress: 0,
      });
      throw error;
    }
  },

  downloadDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ isLoading: false });
    } catch (error) {
      set({
        error: "Erreur lors du téléchargement",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedDocuments = state.documents.filter((doc) => doc.id !== id);
        const filteredDocuments = applyFiltersAndSort(
          updatedDocuments,
          state.filters,
          state.sortBy
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          isLoading: false,
          selectedDocument:
            state.selectedDocument?.id === id ? null : state.selectedDocument,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression",
        isLoading: false,
      });
      throw error;
    }
  },

  exportDocuments: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      set({ isLoading: false });
    } catch (error) {
      set({
        error: "Erreur lors de l'export",
        isLoading: false,
      });
      throw error;
    }
  },

  archiveDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedDocuments = state.documents.map((doc) =>
          doc.id === id ? { ...doc, category: "Archivé" as const } : doc
        );
        const filteredDocuments = applyFiltersAndSort(
          updatedDocuments,
          state.filters,
          state.sortBy
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de l'archivage",
        isLoading: false,
      });
      throw error;
    }
  },

  unarchiveDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => {
        const updatedDocuments = state.documents.map((doc) =>
          doc.id === id ? { ...doc, category: "Actif" as const } : doc
        );
        const filteredDocuments = applyFiltersAndSort(
          updatedDocuments,
          state.filters,
          state.sortBy
        );

        return {
          documents: updatedDocuments,
          filteredDocuments,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la désarchivage",
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (newFilters: Partial<DocumentFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredDocuments = applyFiltersAndSort(
        state.documents,
        updatedFilters,
        state.sortBy
      );

      return {
        filters: updatedFilters,
        filteredDocuments,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredDocuments = applyFiltersAndSort(
        state.documents,
        {},
        state.sortBy
      );

      return {
        filters: {},
        filteredDocuments,
      };
    });
  },

  applyFilters: () => {
    set((state) => {
      const filteredDocuments = applyFiltersAndSort(
        state.documents,
        state.filters,
        state.sortBy
      );
      return { filteredDocuments };
    });
  },

  setSortBy: (sortBy: DocumentSortBy) => {
    set((state) => {
      const filteredDocuments = applyFiltersAndSort(
        state.documents,
        state.filters,
        sortBy
      );

      return {
        sortBy,
        filteredDocuments,
      };
    });
  },

  setSelectedDocument: (document: Document | null) => {
    set({ selectedDocument: document });
  },

  getFilteredDocuments: () => {
    return get().filteredDocuments;
  },

  getDocumentCount: () => {
    return get().documents.length;
  },

  clearError: () => {
    set({ error: null });
  },

  searchDocuments: (query: string) => {
    set((state) => {
      const updatedFilters = { ...state.filters, searchQuery: query };
      const filteredDocuments = applyFiltersAndSort(
        state.documents,
        updatedFilters,
        state.sortBy
      );

      return {
        filters: updatedFilters,
        filteredDocuments,
      };
    });
  },
}));
