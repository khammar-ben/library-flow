import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { mockCategories } from '@/data/mockData';
import { Category } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CategoriesList: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    category: Category | null;
    name: string;
  }>({
    open: false,
    category: null,
    name: '',
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({
    open: false,
    category: null,
  });

  const handleSave = () => {
    if (formDialog.category) {
      // Edit
      setCategories(
        categories.map((c) =>
          c.id === formDialog.category!.id ? { ...c, name: formDialog.name } : c
        )
      );
      toast({
        title: 'Category updated',
        description: `Category "${formDialog.name}" has been updated.`,
      });
    } else {
      // Create
      const newCategory: Category = {
        id: String(Date.now()),
        name: formDialog.name,
      };
      setCategories([...categories, newCategory]);
      toast({
        title: 'Category created',
        description: `Category "${formDialog.name}" has been created.`,
      });
    }
    setFormDialog({ open: false, category: null, name: '' });
  };

  const handleDelete = () => {
    if (deleteDialog.category) {
      setCategories(categories.filter((c) => c.id !== deleteDialog.category!.id));
      toast({
        title: 'Category deleted',
        description: `"${deleteDialog.category.name}" has been removed.`,
      });
      setDeleteDialog({ open: false, category: null });
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'actions',
      header: 'Actions',
      render: (category: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFormDialog({ open: true, category, name: category.name })
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteDialog({ open: true, category })}
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
        title="Categories"
        description="Manage book categories"
        action={
          <Button
            onClick={() => setFormDialog({ open: true, category: null, name: '' })}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <DataTable
        data={categories}
        columns={columns}
        emptyMessage="No categories found"
      />

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) =>
          setFormDialog({ open, category: null, name: '' })
        }
      >
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {formDialog.category ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={formDialog.name}
              onChange={(e) =>
                setFormDialog({ ...formDialog, name: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setFormDialog({ open: false, category: null, name: '' })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formDialog.name.trim()}>
              {formDialog.category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, category: null })}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteDialog.category?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </DashboardLayout>
  );
};

export default CategoriesList;
