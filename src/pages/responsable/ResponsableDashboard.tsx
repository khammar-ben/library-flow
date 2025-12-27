import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockBooks, mockEmprunts, mockCategories } from '@/data/mockData';
import { BookOpen, FolderOpen, ClipboardList, AlertTriangle, Plus } from 'lucide-react';
import { Emprunt } from '@/types';

const ResponsableDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Books',
      value: mockBooks.length,
      icon: BookOpen,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Categories',
      value: mockCategories.length,
      icon: FolderOpen,
    },
    {
      title: 'Active Emprunts',
      value: mockEmprunts.filter((e) => e.status === 'EN_COURS').length,
      icon: ClipboardList,
    },
    {
      title: 'Overdue',
      value: mockEmprunts.filter((e) => e.status === 'EN_RETARD').length,
      icon: AlertTriangle,
    },
  ];

  const recentEmprunts = mockEmprunts.slice(0, 5);

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
            trend={stat.trend}
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
