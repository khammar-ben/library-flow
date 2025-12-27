import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { booksAPI, empruntsAPI, categoriesAPI } from '@/lib/api';
import { BookOpen, FolderOpen, ClipboardList, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { Emprunt, Book, Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ResponsableDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes, empruntsRes] = await Promise.all([
        booksAPI.getAll(),
        categoriesAPI.getAll(),
        empruntsAPI.getAll(),
      ]);
      setBooks(booksRes.data);
      setCategories(categoriesRes.data);
      setEmprunts(empruntsRes.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Books',
      value: books.length,
      icon: BookOpen,
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderOpen,
    },
    {
      title: 'Active Emprunts',
      value: emprunts.filter((e) => e.status === 'EN_COURS').length,
      icon: ClipboardList,
    },
    {
      title: 'Overdue',
      value: emprunts.filter((e) => e.status === 'EN_RETARD').length,
      icon: AlertTriangle,
    },
  ];

  const recentEmprunts = emprunts.slice(0, 5);

  const columns = [
    {
      key: 'book',
      header: 'Book',
      render: (emprunt: Emprunt) => emprunt.book.title,
    },
    {
      key: 'borrower',
      header: 'Borrower',
      render: (emprunt: Emprunt) => emprunt.borrower.email,
    },
    { key: 'borrowDate', header: 'Borrow Date' },
    {
      key: 'status',
      header: 'Status',
      render: (emprunt: Emprunt) => <StatusBadge status={emprunt.status} />,
    },
  ];

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
        title="Librarian Dashboard"
        description="Manage books, categories, and borrowings"
        action={
          <Button onClick={() => navigate('/responsable/books/create')}>
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Recent Emprunts</h2>
          <Button variant="outline" onClick={() => navigate('/responsable/emprunts')}>
            View All
          </Button>
        </div>
        <DataTable data={recentEmprunts} columns={columns} pageSize={5} />
      </div>
    </DashboardLayout>
  );
};

export default ResponsableDashboard;
