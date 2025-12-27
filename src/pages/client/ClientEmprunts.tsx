import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { mockEmprunts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Emprunt } from '@/types';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientEmprunts: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emprunts, setEmprunts] = useState(
    mockEmprunts.filter((e) => e.borrower.email === user?.email)
  );
  const [returnDialog, setReturnDialog] = useState<{
    open: boolean;
    emprunt: Emprunt | null;
  }>({
    open: false,
    emprunt: null,
  });

  const handleReturn = () => {
    if (returnDialog.emprunt) {
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
      setReturnDialog({ open: false, emprunt: null });
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
        confirmLabel="Return"
        onConfirm={handleReturn}
      />
    </DashboardLayout>
  );
};

export default ClientEmprunts;
