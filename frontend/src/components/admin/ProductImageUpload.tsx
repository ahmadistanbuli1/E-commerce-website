import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "../../utils/cn";
import {
  formatFileSize,
  PRODUCT_IMAGE_ACCEPT,
  validateProductImageFile
} from "../../utils/media";
import { useUploadProductImage } from "../../hooks/admin";
import { ProductImage } from "../ui/ProductImage";

type ProductImageUploadProps = {
  value: string;
  onChange: (imageUrl: string) => void;
  disabled?: boolean;
  label?: string;
};

export function ProductImageUpload({
  value,
  onChange,
  disabled,
  label = "Product image"
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadProductImage();
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const busy = upload.isPending || disabled;

  const openPicker = () => {
    if (busy) return;
    inputRef.current?.click();
  };

  const handleFile = (file: File | null | undefined) => {
    if (!file || busy) return;

    const validationError = validateProductImageFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    upload.mutate(
      {
        file,
        previousUrl: value.startsWith("/uploads/") ? value : undefined
      },
      {
        onSuccess: (data) => onChange(data.imageUrl)
      }
    );
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const clearImage = () => {
    if (busy) return;
    setLocalError(null);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept={PRODUCT_IMAGE_ACCEPT}
        className="hidden"
        onChange={onInputChange}
        disabled={busy}
      />

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <div className="relative aspect-[4/3] bg-card">
            <ProductImage
              src={value}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
              <button
                type="button"
                onClick={openPicker}
                disabled={busy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-card/95 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-card disabled:opacity-60"
              >
                {upload.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Replace image
              </button>
              <button
                type="button"
                onClick={clearImage}
                disabled={busy}
                className="inline-flex items-center justify-center rounded-xl bg-card/95 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-card disabled:opacity-60"
                aria-label="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="truncate px-3 py-2 text-xs text-muted-foreground">{value}</p>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={onDrop}
          className={cn(
            "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
            dragActive
              ? "border-primary bg-primary-light/50 dark:bg-primary/10"
              : "border-border bg-muted/70 hover:border-primary/40 hover:bg-primary-light/30 dark:hover:bg-primary/5",
            busy && "cursor-not-allowed opacity-60"
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition group-hover:scale-105">
            {upload.isPending ? (
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            ) : (
              <ImagePlus className="h-7 w-7 text-blue-600" />
            )}
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP, or GIF up to {formatFileSize(5 * 1024 * 1024)}</p>
        </div>
      )}

      {localError ? <p className="text-sm text-red-600">{localError}</p> : null}
      {upload.isError ? (
        <p className="text-sm text-red-600">Upload failed. Please try another image.</p>
      ) : null}
    </div>
  );
}
