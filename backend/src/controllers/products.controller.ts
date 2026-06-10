import type { Request, Response } from "express";
import { z } from "zod";
import { ProductsService } from "../services/products.service";
import { ActivityLogService } from "../services/activity-log.service";
import { activityActorFromRequest } from "../utils/request-context";
import { productImageUrlSchema } from "../utils/image-url";

const emptyMsg = "This field is required";

const idParamSchema = z.object({
  id: z.string().uuid("Invalid id")
});

const createSchema = z.object({
  categoryId: z.string({ error: emptyMsg }).uuid("Invalid category id"),
  name: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).min(3, "Product name must be at least 3 characters"),
  description: z.string({ error: emptyMsg }).trim().min(1, emptyMsg),
  price: z.string({ error: emptyMsg }).trim().min(1, emptyMsg),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: productImageUrlSchema
});

const updateSchema = z.object({
  categoryId: z.string().uuid("Invalid category id").optional(),
  name: z.string().trim().min(1, emptyMsg).min(3, "Product name must be at least 3 characters").optional(),
  description: z.string().trim().min(1, emptyMsg).optional(),
  price: z.string().trim().min(1, emptyMsg).optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
  imageUrl: productImageUrlSchema.optional(),
  isActive: z.boolean().optional()
});

export class ProductsController {
  static async list(req: Request, res: Response) {
    const parsed = ProductsService.parseListQuery(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });
    }

    const isAdmin = req.user?.role === "ADMIN";
    const result = await ProductsService.list(parsed.data, isAdmin);
    return res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const isAdmin = req.user?.role === "ADMIN";
    const product = await ProductsService.getById(p.data.id, isAdmin);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ product });
  }

  static async create(req: Request, res: Response) {
    const b = createSchema.safeParse(req.body);
    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });

    const product = await ProductsService.create(b.data);

    await ActivityLogService.record(
      "PRODUCT_CREATED",
      `Created product "${product.name}"`,
      activityActorFromRequest(req),
      { entityType: "Product", entityId: product.id, metadata: { price: product.price, stock: product.stock } }
    );

    return res.status(201).json({ product });
  }

  static async update(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const b = updateSchema.safeParse(req.body);
    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });

    try {
      const before = await ProductsService.getById(p.data.id, true);
      const product = await ProductsService.update(p.data.id, b.data);

      const action =
        before && !before.isActive && product.isActive
          ? "PRODUCT_RESTORED"
          : b.data.isActive === false
            ? "PRODUCT_ARCHIVED"
            : "PRODUCT_UPDATED";

      const description =
        action === "PRODUCT_RESTORED"
          ? `Restored product "${product.name}"`
          : action === "PRODUCT_ARCHIVED"
            ? `Archived product "${product.name}"`
            : `Updated product "${product.name}"`;

      await ActivityLogService.record(action, description, activityActorFromRequest(req), {
        entityType: "Product",
        entityId: product.id,
        metadata: { changes: b.data }
      });

      return res.json({ product });
    } catch {
      return res.status(404).json({ message: "Product not found" });
    }
  }

  static async archive(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    try {
      const product = await ProductsService.archive(p.data.id);

      await ActivityLogService.record(
        "PRODUCT_ARCHIVED",
        `Archived product "${product.name}"`,
        activityActorFromRequest(req),
        { entityType: "Product", entityId: product.id }
      );

      return res.json({ product });
    } catch {
      return res.status(404).json({ message: "Product not found" });
    }
  }

  static async hardDelete(req: Request, res: Response) {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const existing = await ProductsService.getById(p.data.id, true);
    const result = await ProductsService.hardDelete(p.data.id);
    if (!result.ok) {
      const status = result.message === "Product not found" ? 404 : 400;
      return res.status(status).json({ message: result.message });
    }

    await ActivityLogService.record(
      "PRODUCT_DELETED",
      `Permanently deleted product "${existing?.name ?? p.data.id}"`,
      activityActorFromRequest(req),
      { entityType: "Product", entityId: p.data.id }
    );

    return res.status(204).send();
  }
}
