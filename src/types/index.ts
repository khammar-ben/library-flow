export type Role = 'ADMIN' | 'RESPONSABLE' | 'CLIENT';

export type EmpruntStatus = 'EN_COURS' | 'RETOURNE' | 'EN_RETARD';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  quantity: number;
  category: Category;
  available: boolean;
}

export interface Emprunt {
  id: string;
  borrower: User;
  book: Book;
  borrowDate: string;
  returnDate?: string;
  status: EmpruntStatus;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
