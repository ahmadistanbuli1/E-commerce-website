import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/api";
import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";
import type { Category, Product, ProductsListResponse, ActivityLogsResponse } from "../interfaces/catalog";
import type { Order } from "./orders";

export type AdminStats = {
  totalRevenue: string;
  totalOrders: number;
  pendingOrders: number;
  usersCount: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: string;
    category: { name: string };
  }>;
  ordersByStatus: Array<{ status: string; count: number }>;
};

export type AdminRecentOrder = {
  id: string;
  totalPrice: string;
  status: Order["status"];
  paymentMethod: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string };
};

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
  isBanned: boolean;
  createdAt: string;
};

export type AdminOrder = Order & {
  userId: string;
  shippingAddress: string;
  updatedAt: string;
  user?: { id: string; firstName: string; lastName: string; email: string };
};

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<{ stats: AdminStats }>("/admin/dashboard/stats");
      return data.stats;
    }
  });
}

export function useAdminRecentOrders() {
  return useQuery({
    queryKey: ["admin", "recent-orders"],
    queryFn: async () => {
      const { data } = await api.get<{ orders: AdminRecentOrder[] }>("/admin/dashboard/recent-orders");
      return data.orders;
    }
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await api.get<{ users: AdminUser[] }>("/users");
      return data.users;
    }
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data } = await api.get<{ orders: AdminOrder[] }>("/orders");
      return data.orders;
    },
    refetchInterval: 30000
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await api.get<ProductsListResponse>("/products", {
        params: { page: 1, limit: 100, includeInactive: true }
      });
      return data.items;
    }
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      orderId: string;
      status: Order["status"];
      adminMessage?: string;
    }) => {
      const { data } = await api.put<{ order: AdminOrder }>(`/orders/${input.orderId}/status`, {
        status: input.status,
        adminMessage: input.adminMessage
      });
      return data.order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["admin", "recent-orders"] });
      qc.invalidateQueries({ queryKey: ["orders", "my"] });
      toastSuccess("Order status updated");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to update order"))
  });
}

export function useUpdateUserRoleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { userId: string; role?: "ADMIN" | "CUSTOMER"; isBanned?: boolean }) => {
      const { data } = await api.put<{ user: AdminUser }>(`/users/${input.userId}/role-status`, {
        role: input.role,
        isBanned: input.isBanned
      });
      return data.user;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("User updated");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to update user"))
  });
}

export function useArchiveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete<{ user: AdminUser }>(`/users/${userId}`);
      return data.user;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("User archived");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to archive user"))
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description: string }) => {
      const { data } = await api.post<{ category: Category }>("/categories", input);
      return data.category;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toastSuccess("Category created");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to create category"))
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; name: string; description: string }) => {
      const { data } = await api.put<{ category: Category }>(`/categories/${id}`, input);
      return data.category;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toastSuccess("Category updated");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to update category"))
  });
}

export function useRestoreProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.put<{ product: Product }>(`/products/${productId}`, {
        isActive: true
      });
      return data.product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("Product restored");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to restore product"))
  });
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: async (input: { file: File; previousUrl?: string }) => {
      const formData = new FormData();
      formData.append("image", input.file);

      const { data } = await api.post<{ imageUrl: string }>(
        "/admin/uploads/product-image",
        formData,
        {
          params: input.previousUrl ? { previousUrl: input.previousUrl } : undefined
        }
      );

      return data;
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to upload image"))
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      categoryId: string;
      name: string;
      description: string;
      price: string;
      stock: number;
      imageUrl: string;
    }) => {
      const { data } = await api.post<{ product: Product }>("/products", input);
      return data.product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("Product created");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to create product"))
  });
}

export function useArchiveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ product: Product }>(`/products/${productId}`);
      return data.product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("Product archived");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to archive product"))
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: {
      id: string;
      categoryId?: string;
      name?: string;
      description?: string;
      price?: string;
      stock?: number;
      imageUrl?: string;
      isActive?: boolean;
    }) => {
      const { data } = await api.put<{ product: Product }>(`/products/${id}`, input);
      return data.product;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("Product updated");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to update product"))
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/products/${productId}/permanent`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toastSuccess("Product deleted permanently");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to delete product"))
  });
}

export function useAdminActivityLogs(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "activity-logs", page, limit],
    queryFn: async () => {
      const { data } = await api.get<ActivityLogsResponse>("/admin/activity-logs", {
        params: { page, limit }
      });
      return data;
    },
    refetchInterval: 30000
  });
}
