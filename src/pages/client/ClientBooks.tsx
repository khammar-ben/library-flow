import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { booksAPI, categoriesAPI, empruntsAPI } from '@/lib/api';
import { Book, Category } from '@/types';
import { Search, BookOpen, User, Tag, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientBooks: React.FC = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [borrowDialog, setBorrowDialog] = useState<{
    open: boolean;
    book: Book | null;
  }>({
    open: false,
    book: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        booksAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setBooks(booksRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || book.category?.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleBorrow = async () => {
    if (borrowDialog.book) {
      setIsBorrowing(true);
      try {
        await empruntsAPI.create(borrowDialog.book.id);
        toast({
          title: 'Book borrowed successfully',
          description: `You have borrowed "${borrowDialog.book.title}".`,
        });
        // Refresh books to update availability
        fetchData();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to borrow book',
          variant: 'destructive',
        });
      } finally {
        setIsBorrowing(false);
        setBorrowDialog({ open: false, book: null });
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Browse Books"
        description="Explore our collection and borrow books"
      />

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-secondary/50">
              <BookOpen className="h-12 w-12 text-primary/50" />
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
                  {book.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {book.author}
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>

              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {book.category?.name || 'Uncategorized'}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant={book.available ? 'success' : 'destructive'}>
                  {book.available ? `${book.quantity} available` : 'Unavailable'}
                </Badge>
                <Button
                  size="sm"
                  disabled={!book.available}
                  onClick={() => setBorrowDialog({ open: true, book })}
                >
                  Borrow
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
          <p className="text-muted-foreground">No books found</p>
        </div>
      )}

      <ConfirmDialog
        open={borrowDialog.open}
        onOpenChange={(open) => setBorrowDialog({ open, book: null })}
        title="Borrow Book"
        description={`Are you sure you want to borrow "${borrowDialog.book?.title}"?`}
        confirmLabel={isBorrowing ? 'Borrowing...' : 'Borrow'}
        onConfirm={handleBorrow}
      />
    </DashboardLayout>
  );
};

export default ClientBooks;
