import { useMemo, useState } from "react";
import { Archive, Package, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminMenuSelect } from "../../components/admin/AdminMenuSelect";
import {
  ProductArchiveDialog,
  ProductDeleteDialog,
  ProductRestoreDialog
} from "../../components/admin/ProductConfirmDialog";
import { ProductEditDialog } from "../../components/admin/ProductEditDialog";
import { ProductImageUpload } from "../../components/admin/ProductImageUpload";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { useCategories } from "../../hooks/catalog";
import {
  useAdminProducts,
  useArchiveProduct,
  useCreateProduct,
  useDeleteProduct,
  useRestoreProduct,
  useUpdateProduct
} from "../../hooks/admin";
import type { Product } from "../../interfaces/catalog";
import { cn } from "../../utils/cn";
import { ProductImage } from "../../components/ui/ProductImage";

export function AdminProductsPage() {
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data ?? [];

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("9.99");
  const [stock, setStock] = useState(1);
  const [imageUrl, setImageUrl] = useState("");

  const createProduct = useCreateProduct();
  const archiveProduct = useArchiveProduct();
  const restoreProduct = useRestoreProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const productsQuery = useAdminProducts();
  const products = productsQuery.data ?? [];

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setTimeout(() => setEditProduct(null), 250);
  };

  const canSubmit = useMemo(() => {
    return (
      categoryId &&
      name.trim().length >= 3 &&
      description.trim().length > 0 &&
      price.trim().length > 0 &&
      imageUrl.trim().length > 0
    );
  }, [categoryId, name, description, price, imageUrl]);

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Products Management"
        breadcrumb={[
          { label: "Dashboard", to: "/admin" },
          { label: "Products" }
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light dark:bg-primary/15">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="heading-3">Create Product</h2>
          </div>

          <div className="mt-4 space-y-3">
            <AdminMenuSelect
              label="Category"
              value={categoryId}
              placeholder="Select category"
              options={categories.map((c) => ({ id: c.id, name: c.name }))}
              onChange={setCategoryId}
            />

            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
              <Input
                label="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <ProductImageUpload value={imageUrl} onChange={setImageUrl} />

            <Button
              fullWidth
              disabled={!canSubmit || createProduct.isPending}
              onClick={() =>
                createProduct.mutate(
                  {
                    categoryId,
                    name: name.trim(),
                    description: description.trim(),
                    price: price.trim(),
                    stock,
                    imageUrl: imageUrl.trim()
                  },
                  {
                    onSuccess: () => {
                      setName("");
                      setDescription("");
                      setPrice("9.99");
                      setStock(1);
                      setImageUrl("");
                      setCategoryId("");
                    }
                  }
                )
              }
            >
              <Plus className="h-4 w-4" />
              Create Product
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-500/15">
              <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="heading-3">Products List</h2>
          </div>
          <div className="mt-4 space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border border-border bg-muted/50 p-3 transition-colors hover:bg-card sm:flex-row sm:items-center sm:justify-between",
                  !p.isActive && "opacity-45"
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <ProductImage
                    src={p.imageUrl}
                    alt={p.name}
                    className={cn(
                      "h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-border",
                      !p.isActive && "grayscale"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {p.name}
                      {!p.isActive ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">(archived)</span>
                      ) : null}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">${p.price}</p>
                    <p className="text-xs text-muted-foreground">Stock: {p.stock}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  {p.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={archiveProduct.isPending}
                      onClick={() => setArchiveTarget(p)}
                      className="hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 dark:hover:text-amber-400"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={restoreProduct.isPending}
                      onClick={() => setRestoreTarget(p)}
                      className="hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(p)}
                    className="hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ProductEditDialog
        open={editOpen}
        product={editProduct}
        categories={categories}
        onClose={closeEdit}
        isPending={updateProduct.isPending}
        onSave={(data) => {
          if (!editProduct) return;
          updateProduct.mutate(
            { id: editProduct.id, ...data },
            { onSuccess: closeEdit }
          );
        }}
      />

      <ProductArchiveDialog
        open={Boolean(archiveTarget)}
        product={archiveTarget}
        onClose={() => setArchiveTarget(null)}
        isPending={archiveProduct.isPending}
        onConfirm={() => {
          if (!archiveTarget) return;
          archiveProduct.mutate(archiveTarget.id, { onSuccess: () => setArchiveTarget(null) });
        }}
      />

      <ProductRestoreDialog
        open={Boolean(restoreTarget)}
        product={restoreTarget}
        onClose={() => setRestoreTarget(null)}
        isPending={restoreProduct.isPending}
        onConfirm={() => {
          if (!restoreTarget) return;
          restoreProduct.mutate(restoreTarget.id, { onSuccess: () => setRestoreTarget(null) });
        }}
      />

      <ProductDeleteDialog
        open={Boolean(deleteTarget)}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        isPending={deleteProduct.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteProduct.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
            onError: () => setDeleteTarget(null)
          });
        }}
      />
    </AdminLayout>
  );
}
