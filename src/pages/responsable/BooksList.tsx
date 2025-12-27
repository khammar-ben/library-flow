import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockBooks } from '@/data/mockData';
import { Book } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BooksList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [books, setBooks] = useState(mockBooks);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; book: Book | null }>({
    open: false,
    book: null,
  });

  const handleDelete = () => {
    if (deleteDialog.book) {
      setBooks(books.filter((b) => b.id !== deleteDialog.book!.id));
      toast({
        title: 'Book deleted',
        description: `"${deleteDialog.book.title}" has been removed.`,
      });
      setDeleteDialog({ open: false, book: null });
    }
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'author', header: 'Author' },
    {
      key: 'category',
      header: 'Category',
      render: (book: Book) => (
        <Badge variant="secondary">{book.category.name}</Badge>
      ),
    },
    { key: 'quantity', header: 'Quantity' },
    {
      key: 'available',
      header: 'Status',
      render: (book: Book) => (
        <Badge variant={book.available ? 'success' : 'destructive'}>
          {book.available ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (book: Book) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/responsable/books/edit/${book.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteDialog({ open: true, book })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Books Management"
        description="View and manage library books"
        action={
          <Button onClick={() => navigate('/responsable/books/create')}>
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        }
      />

      <DataTable data={books} columns={columns} emptyMessage="No books found" />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, book: null })}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteDialog.book?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </DashboardLayout>
  );
};

export default BooksList;
