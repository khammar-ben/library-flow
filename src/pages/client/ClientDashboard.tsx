import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockBooks, mockEmprunts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, BookCopy, Clock, CheckCircle } from 'lucide-react';
import { Emprunt } from '@/types';

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter emprunts for current user
  const myEmprunts = mockEmprunts.filter(
    (e) => e.borrower.email === user?.email
  );

  const stats = [
    {
      title: 'Available Books',
      value: mockBooks.filter((b) => b.available).length,
      icon: BookOpen,
    },
    {
      title: 'My Active Emprunts',
      value: myEmprunts.filter((e) => e.status === 'EN_COURS').length,
      icon: BookCopy,
    },
    {
      title: 'Returned',
      value: myEmprunts.filter((e) => e.status === 'RETOURNE').length,
      icon: CheckCircle,
    },
    {
      title: 'Overdue',
      value: myEmprunts.filter((e) => e.status === 'EN_RETARD').length,
      icon: Clock,
    },
  ];

  const columns = [
    {
      key: 'book',
      header: 'Book',
      render: (emprunt: Emprunt) => emprunt.book.title,
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
        title="My Dashboard"
        description="Browse books and manage your borrowings"
        action={
          <Button onClick={() => navigate('/client/books')}>
            <BookOpen className="h-4 w-4" />
            Browse Books
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
          <h2 className="font-display text-xl font-semibold">My Emprunts</h2>
          <Button variant="outline" onClick={() => navigate('/client/emprunts')}>
            View All
          </Button>
        </div>
        <DataTable
          data={myEmprunts}
          columns={columns}
          pageSize={5}
          emptyMessage="You haven't borrowed any books yet"
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
