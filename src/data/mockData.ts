import { User, Book, Category, Emprunt } from '@/types';

export const mockUsers: User[] = [
  { id: '1', email: 'admin@library.com', role: 'ADMIN' },
  { id: '2', email: 'librarian@library.com', role: 'RESPONSABLE' },
  { id: '3', email: 'client@library.com', role: 'CLIENT' },
  { id: '4', email: 'john.doe@email.com', role: 'CLIENT' },
  { id: '5', email: 'jane.smith@email.com', role: 'CLIENT' },
  { id: '6', email: 'bob.wilson@email.com', role: 'RESPONSABLE' },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Fiction' },
  { id: '2', name: 'Non-Fiction' },
  { id: '3', name: 'Science' },
  { id: '4', name: 'History' },
  { id: '5', name: 'Technology' },
  { id: '6', name: 'Philosophy' },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of decadence and excess in the Jazz Age.',
    quantity: 5,
    category: mockCategories[0],
    available: true,
  },
  {
    id: '2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'An exploration of human history and evolution.',
    quantity: 3,
    category: mockCategories[1],
    available: true,
  },
  {
    id: '3',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description: 'From the Big Bang to black holes.',
    quantity: 2,
    category: mockCategories[2],
    available: true,
  },
  {
    id: '4',
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'Ancient Chinese military treatise.',
    quantity: 4,
    category: mockCategories[3],
    available: true,
  },
  {
    id: '5',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship.',
    quantity: 6,
    category: mockCategories[4],
    available: true,
  },
  {
    id: '6',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Stoic philosophy from a Roman emperor.',
    quantity: 3,
    category: mockCategories[5],
    available: true,
  },
  {
    id: '7',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction.',
    quantity: 0,
    category: mockCategories[0],
    available: false,
  },
  {
    id: '8',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    description: 'Your journey to mastery.',
    quantity: 4,
    category: mockCategories[4],
    available: true,
  },
];

export const mockEmprunts: Emprunt[] = [
  {
    id: '1',
    borrower: mockUsers[2],
    book: mockBooks[0],
    borrowDate: '2024-12-20',
    status: 'EN_COURS',
  },
  {
    id: '2',
    borrower: mockUsers[3],
    book: mockBooks[1],
    borrowDate: '2024-12-15',
    returnDate: '2024-12-25',
    status: 'RETOURNE',
  },
  {
    id: '3',
    borrower: mockUsers[4],
    book: mockBooks[2],
    borrowDate: '2024-12-01',
    status: 'EN_RETARD',
  },
  {
    id: '4',
    borrower: mockUsers[2],
    book: mockBooks[4],
    borrowDate: '2024-12-22',
    status: 'EN_COURS',
  },
];
