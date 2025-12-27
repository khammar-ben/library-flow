import React, { useState, useEffect } from 'react';
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
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CategoriesList: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (formDialog.category) {
        // Edit
        await categoriesAPI.update(formDialog.category.id, { name: formDialog.name });
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
        const response = await categoriesAPI.create({ name: formDialog.name });
        setCategories([...categories, response.data]);
        toast({
          title: 'Category created',
          description: `Category "${formDialog.name}" has been created.`,
        });
      }
      setFormDialog({ open: false, category: null, name: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${formDialog.category ? 'update' : 'create'} category`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.category) {
      try {
        await categoriesAPI.delete(deleteDialog.category.id);
        setCategories(categories.filter((c) => c.id !== deleteDialog.category!.id));
        toast({
          title: 'Category deleted',
          description: `"${deleteDialog.category.name}" has been removed.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete category',
          variant: 'destructive',
        });
      }
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
            <Button onClick={handleSave} disabled={!formDialog.name.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                formDialog.category ? 'Update' : 'Create'
              )}
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
