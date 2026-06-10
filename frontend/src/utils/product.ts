export const NEW_PRODUCT_DAYS = 15;

export function computeDiscountPercent(
  price: string,
  compareAtPrice?: string | null
): number | null {
  if (!compareAtPrice) return null;
  const current = Number(price);
  const compare = Number(compareAtPrice);
  if (!Number.isFinite(current) || !Number.isFinite(compare) || compare <= current) return null;
  return Math.round((1 - current / compare) * 100);
}

export function isOnSale(price: string, compareAtPrice?: string | null) {
  return Boolean(compareAtPrice && Number(compareAtPrice) > Number(price));
}

export function isNewProduct(isNew?: boolean) {
  return Boolean(isNew);
}
