export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  compareAtPrice?: string | null;
  discountPercent?: number | null;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  isNew?: boolean;
  averageRating?: number | null;
  ratingCount?: number;
  createdAt?: string;
  category: { id: string; name: string };
};

export type ProductsListResponse = {
  items: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name";

export type ActivityLog = {
  id: string;
  action: string;
  description: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  actorId: string | null;
  actorEmail: string | null;
  actorRole: string | null;
  ipAddress: string | null;
  createdAt: string;
};

export type ActivityLogsResponse = {
  items: ActivityLog[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type ProductReview = {
  id: string;
  score: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductRatingSummary = {
  averageRating: number | null;
  ratingCount: number;
};
