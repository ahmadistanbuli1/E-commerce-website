import { cn } from "../../utils/cn";
import { resolveImageUrl } from "../../utils/media";

export function ProductImage({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      className={cn(className)}
      loading="lazy"
    />
  );
}
