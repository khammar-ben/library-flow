import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { empruntsAPI } from '@/lib/api';
import { Emprunt } from '@/types';
import { RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientEmprunts: React.FC = () => {
  const { toast } = useToast();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReturning, setIsReturning] = useState(false);
  const [returnDialog, setReturnDialog] = useState<{
    open: boolean;
    emprunt: Emprunt | null;
  }>({
    open: false,
    emprunt: null,
  });

  useEffect(() => {
    fetchEmprunts();
  }, []);

  const fetchEmprunts = async () => {
    try {
      const response = await empruntsAPI.getMyEmprunts();
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

  const handleReturn = async () => {
    if (returnDialog.emprunt) {
      setIsReturning(true);
      try {
        await empruntsAPI.returnBook(returnDialog.emprunt.id);
        setEmprunts(
          emprunts.map((e) =>
            e.id === returnDialog.emprunt!.id
              ? {
                  ...e,
                  status: 'RETOURNE' as const,
                  returnDate: new Date().toISOString().split('T')[0],
                }
              : e
          )
        );
        toast({
          title: 'Book returned',
          description: `"${returnDialog.emprunt.book.title}" has been marked for return.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to return book',
          variant: 'destructive',
        });
      } finally {
        setIsReturning(false);
        setReturnDialog({ open: false, emprunt: null });
      }
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'book',
      header: 'Book',
      render: (emprunt: Emprunt) => (
        <div>
          <p className="font-medium">{emprunt.book.title}</p>
          <p className="text-sm text-muted-foreground">{emprunt.book.author}</p>
        </div>
      ),
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
      render: (emprunt: Emprunt) =>
        emprunt.status !== 'RETOURNE' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReturnDialog({ open: true, emprunt })}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Return
          </Button>
        ) : null,
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
        title="My Emprunts"
        description="View your borrowing history and return books"
      />

      <DataTable
        data={emprunts}
        columns={columns}
        emptyMessage="You haven't borrowed any books yet"
      />

      <ConfirmDialog
        open={returnDialog.open}
        onOpenChange={(open) => setReturnDialog({ open, emprunt: null })}
        title="Return Book"
        description={`Are you sure you want to return "${returnDialog.emprunt?.book.title}"?`}
        confirmLabel={isReturning ? 'Returning...' : 'Return'}
        onConfirm={handleReturn}
      />
    </DashboardLayout>
  );
};

export default ClientEmprunts;
