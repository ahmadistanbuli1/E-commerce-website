import { useEffect, useState } from "react";
import type { Product, Category } from "../../interfaces/catalog";
import { AdminDialog } from "./AdminDialog";
import { AdminMenuSelect } from "./AdminMenuSelect";
import { ProductImageUpload } from "./ProductImageUpload";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

function getFormState(product: Product) {
  return {
    categoryId: product.category.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    isActive: product.isActive
  };
}

export function ProductEditDialog({
  open,
  product,
  categories,
  onClose,
  onSave,
  isPending
}: {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: {
    categoryId: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    imageUrl: string;
    isActive: boolean;
  }) => void;
  isPending?: boolean;
}) {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open && product) {
      const form = getFormState(product);
      setCategoryId(form.categoryId);
      setName(form.name);
      setDescription(form.description);
      setPrice(form.price);
      setStock(form.stock);
      setImageUrl(form.imageUrl);
      setIsActive(form.isActive);
      setReady(true);
    } else if (!open) {
      setReady(false);
    }
  }, [open, product]);

  const canSave =
    categoryId && name.trim().length >= 3 && description.trim() && price.trim() && imageUrl.trim();

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Edit product"
      description={product ? `Update details for "${product.name}"` : undefined}
      size="lg"
      dialogKey={product?.id}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            disabled={!canSave || isPending || !ready}
            onClick={() =>
              onSave({
                categoryId,
                name: name.trim(),
                description: description.trim(),
                price: price.trim(),
                stock,
                imageUrl: imageUrl.trim(),
                isActive
              })
            }
          >
            Save changes
          </Button>
        </>
      }
    >
      {ready && product ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <AdminMenuSelect
              label="Category"
              value={categoryId}
              placeholder="Select category"
              options={categories.map((c) => ({ id: c.id, name: c.name }))}
              onChange={setCategoryId}
            />
          </div>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
          <div className="sm:col-span-2">
            <ProductImageUpload value={imageUrl} onChange={setImageUrl} disabled={isPending} />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Product is active (visible in store)
          </label>
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        </div>
      )}
    </AdminDialog>
  );
}
