export type DocumentType = "Contrat" | "Décharge" | "Attestation" | "Autre";
export type DocumentCategory = "Actif" | "Archivé";

export interface Document {
  id: string;
  numero: string;
  nom: string;
  type: DocumentType;
  category: DocumentCategory;
  dateCreation: string;
  dateMiseAJour: string;
  dateExpiration?: string;
  description?: string;
  observations?: string;
  fileUrl: string;
  fileType: "pdf" | "word" | "image";
  fileSize: string;
  createdBy?: string;
  usagerId: string;
  usagerNom?: string;
}

export interface DocumentFilters {
  searchQuery?: string;
  type?: DocumentType[];
  category?: DocumentCategory[];
  dateFrom?: Date;
  dateTo?: Date;
}

export type DocumentSortBy =
  | "nom-asc"
  | "nom-desc"
  | "date-creation-asc"
  | "date-creation-desc"
  | "date-maj-asc"
  | "date-maj-desc"
  | "type-asc"
  | "type-desc";

export interface DocumentFormData {
  nom: string;
  type: DocumentType;
  description?: string;
  observations?: string;
  file: {
    uri: string;
    name: string;
    type: string;
    size: number;
  };
}

export interface DocumentState {
  documents: Document[];
  filteredDocuments: Document[];
  filters: DocumentFilters;
  sortBy: DocumentSortBy;
  isLoading: boolean;
  error: string | null;
  selectedDocument: Document | null;
  uploadProgress: number;
}

export interface DocumentActions {
  fetchDocuments: () => Promise<void>;
  getDocumentById: (id: string) => Document | undefined;
  uploadDocument: (data: DocumentFormData) => Promise<void>;
  downloadDocument: (id: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  exportDocuments: (ids: string[]) => Promise<void>;
  archiveDocument: (id: string) => Promise<void>;
  unarchiveDocument: (id: string) => Promise<void>;

  setFilters: (filters: Partial<DocumentFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  setSortBy: (sortBy: DocumentSortBy) => void;

  setSelectedDocument: (document: Document | null) => void;

  getFilteredDocuments: () => Document[];
  getDocumentCount: () => number;
  clearError: () => void;
  searchDocuments: (query: string) => void;
}
