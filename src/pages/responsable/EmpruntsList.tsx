import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { empruntsAPI } from '@/lib/api';
import { Emprunt, EmpruntStatus } from '@/types';
import { CheckCircle, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmpruntsList: React.FC = () => {
  const { toast } = useToast();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<EmpruntStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchEmprunts();
  }, []);

  const fetchEmprunts = async () => {
    try {
      const response = await empruntsAPI.getAll();
      setEmprunts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch emprunts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmprunts = filter === 'ALL' 
    ? emprunts 
    : emprunts.filter(e => e.status === filter);

  const handleStatusChange = async (empruntId: string, newStatus: EmpruntStatus) => {
    try {
      if (newStatus === 'RETOURNE') {
        await empruntsAPI.returnBook(empruntId);
      } else {
        await empruntsAPI.updateStatus(empruntId, newStatus);
      }
      
      setEmprunts(
        emprunts.map((e) =>
          e.id === empruntId
            ? {
                ...e,
                status: newStatus,
                returnDate: newStatus === 'RETOURNE' ? new Date().toISOString().split('T')[0] : e.returnDate,
              }
            : e
        )
      );
      toast({
        title: 'Status updated',
        description: `Emprunt status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
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
      key: 'returnDate', 
      header: 'Return Date',
      render: (emprunt: Emprunt) => emprunt.returnDate || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (emprunt: Emprunt) => <StatusBadge status={emprunt.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (emprunt: Emprunt) => (
        <div className="flex items-center gap-2">
          {emprunt.status !== 'RETOURNE' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-success hover:text-success"
                onClick={() => handleStatusChange(emprunt.id, 'RETOURNE')}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              {emprunt.status === 'EN_COURS' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleStatusChange(emprunt.id, 'EN_RETARD')}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      ),
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
        title="Emprunts Management"
        description="View and manage all borrowings"
        action={
          <Select
            value={filter}
            onValueChange={(value: EmpruntStatus | 'ALL') => setFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="EN_COURS">In Progress</SelectItem>
              <SelectItem value="RETOURNE">Returned</SelectItem>
              <SelectItem value="EN_RETARD">Overdue</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        data={filteredEmprunts}
        columns={columns}
        emptyMessage="No emprunts found"
      />
    </DashboardLayout>
  );
};

export default EmpruntsList;
