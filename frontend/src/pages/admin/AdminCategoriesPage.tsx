import { useState } from "react";
import { FolderTree, Pencil, Plus } from "lucide-react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { CategoryEditDialog } from "../../components/admin/CategoryEditDialog";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { useCategories } from "../../hooks/catalog";
import { useCreateCategory, useUpdateCategory } from "../../hooks/admin";
import type { Category } from "../../interfaces/catalog";

export function AdminCategoriesPage() {
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data ?? [];
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (category: Category) => {
    setEditCategory(category);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setTimeout(() => setEditCategory(null), 250);
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Categories Management"
        breadcrumb={[
          { label: "Dashboard", to: "/admin" },
          { label: "Categories" }
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="heading-3">Create Category</h2>
          </div>
          <div className="mt-4 space-y-3">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <Button
              fullWidth
              disabled={createCategory.isPending || name.trim().length < 3 || description.trim().length === 0}
              onClick={() =>
                createCategory.mutate(
                  { name: name.trim(), description: description.trim() },
                  {
                    onSuccess: () => {
                      setName("");
                      setDescription("");
                    }
                  }
                )
              }
            >
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <FolderTree className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="heading-3">Existing Categories</h2>
          </div>
          <div className="mt-4 space-y-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-white"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0" onClick={() => openEdit(c)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <CategoryEditDialog
        open={editOpen}
        category={editCategory}
        onClose={closeEdit}
        isPending={updateCategory.isPending}
        onSave={(data) => {
          if (!editCategory) return;
          updateCategory.mutate(
            { id: editCategory.id, ...data },
            { onSuccess: closeEdit }
          );
        }}
      />
    </AdminLayout>
  );
}
