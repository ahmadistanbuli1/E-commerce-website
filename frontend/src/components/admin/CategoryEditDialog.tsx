import { useEffect, useState } from "react";
import type { Category } from "../../interfaces/catalog";
import { AdminDialog } from "./AdminDialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export function CategoryEditDialog({
  open,
  category,
  onClose,
  onSave,
  isPending
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
  isPending?: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open && category) {
      setName(category.name);
      setDescription(category.description);
      setReady(true);
    } else if (!open) {
      setReady(false);
    }
  }, [open, category]);

  const canSave = name.trim().length >= 3 && description.trim().length > 0;

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Edit category"
      description={category ? `Update "${category.name}"` : undefined}
      dialogKey={category?.id}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            disabled={!canSave || isPending || !ready}
            onClick={() => onSave({ name: name.trim(), description: description.trim() })}
          >
            Save changes
          </Button>
        </>
      }
    >
      {ready && category ? (
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            label="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        </div>
      )}
    </AdminDialog>
  );
}
