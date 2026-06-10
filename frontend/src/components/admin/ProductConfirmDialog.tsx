import { AdminDialog } from "./AdminDialog";
import { Button } from "../ui/Button";
import type { Product } from "../../interfaces/catalog";

export function ProductArchiveDialog({
  open,
  product,
  onClose,
  onConfirm,
  isPending
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Archive product"
      description={
        product
          ? `"${product.name}" will be hidden from the store but kept in your records.`
          : undefined
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            Archive product
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Archived products appear faded in the admin list. Use the Restore button to make them visible
        again in the store.
      </p>
    </AdminDialog>
  );
}

export function ProductRestoreDialog({
  open,
  product,
  onClose,
  onConfirm,
  isPending
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Restore product"
      description={
        product ? `"${product.name}" will be visible in the store again.` : undefined
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            Restore product
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        This will un-archive the product and make it available for customers to browse and purchase.
      </p>
    </AdminDialog>
  );
}

export function ProductDeleteDialog({
  open,
  product,
  onClose,
  onConfirm,
  isPending
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Delete product permanently"
      description={product ? `This cannot be undone for "${product.name}".` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isPending}>
            Delete permanently
          </Button>
        </>
      }
    >
      <p className="text-sm text-red-600">
        Permanent deletion removes the product from the database. If the product is linked to past
        orders, deletion may be blocked — archive instead.
      </p>
    </AdminDialog>
  );
}
