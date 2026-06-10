import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/api";
import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";
import type {
  Category,
  Product,
  ProductReview,
  ProductSort,
  ProductsListResponse,
  ProductRatingSummary
} from "../interfaces/catalog";

function sortToParams(sort?: ProductSort) {
  switch (sort) {
    case "price_asc":
      return { sortBy: "price", sortOrder: "asc" };
    case "price_desc":
      return { sortBy: "price", sortOrder: "desc" };
    case "name":
      return { sortBy: "name", sortOrder: "asc" };
    default:
      return { sortBy: "createdAt", sortOrder: "desc" };
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<{ categories: Category[] }>("/categories");
      return data.categories;
    }
  });
}

export function useProducts(params: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
  sort?: ProductSort;
}) {
  const sortParams = sortToParams(params.sort);

  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data } = await api.get<ProductsListResponse>("/products", {
        params: {
          page: params.page,
          limit: params.limit,
          categoryId: params.categoryId,
          search: params.search,
          ...sortParams
        }
      });
      return data;
    }
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<{ product: Product }>(`/products/${id}`);
      return data.product;
    },
    enabled: Boolean(id)
  });
}

export function useMyProductReview(productId: string, enabled = true) {
  return useQuery({
    queryKey: ["product-review", productId],
    queryFn: async () => {
      const { data } = await api.get<{ review: ProductReview | null }>(
        `/products/${productId}/reviews/me`
      );
      return data.review;
    },
    enabled: Boolean(productId) && enabled,
    retry: false
  });
}

export function useSubmitProductReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { productId: string; score: number }) => {
      const { data } = await api.post<{ review: ProductReview; summary: ProductRatingSummary }>(
        `/products/${input.productId}/reviews`,
        { score: input.score }
      );
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["product", vars.productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product-review", vars.productId] });
      toastSuccess("Thank you for your rating!");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to submit rating"))
  });
}
