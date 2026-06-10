import type { Request, Response } from "express";

import { z } from "zod";

import { CartService } from "../services/cart.service";

import { ActivityLogService } from "../services/activity-log.service";

import { activityActorFromRequest } from "../utils/request-context";

import { prisma } from "../config/prisma";



const emptyMsg = "This field is required";



const addSchema = z.object({

  productId: z.string({ error: emptyMsg }).uuid("Invalid product id"),

  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1")

});



const updateSchema = z.object({

  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1")

});



const itemIdSchema = z.object({

  itemId: z.string().uuid("Invalid item id")

});



export class CartController {

  static async get(req: Request, res: Response) {

    const userId = req.user!.id;

    const cart = await CartService.getCart(userId);

    return res.json({ cart });

  }



  static async addItem(req: Request, res: Response) {

    const parsed = addSchema.safeParse(req.body);

    if (!parsed.success) {

      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });

    }



    const product = await prisma.product.findUnique({

      where: { id: parsed.data.productId },

      select: { name: true }

    });



    const result = await CartService.addItem(req.user!.id, parsed.data);

    if (!result.ok) return res.status(400).json({ message: result.message });



    await ActivityLogService.record(

      "CART_ITEM_ADDED",

      `Added "${product?.name ?? "product"}" to cart (×${parsed.data.quantity})`,

      activityActorFromRequest(req),

      {

        entityType: "Product",

        entityId: parsed.data.productId,

        metadata: { quantity: parsed.data.quantity }

      }

    );



    return res.status(200).json({ cart: result.cart });

  }



  static async updateItem(req: Request, res: Response) {

    const p = itemIdSchema.safeParse(req.params);

    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });



    const b = updateSchema.safeParse(req.body);

    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });



    const result = await CartService.updateItem(req.user!.id, p.data.itemId, b.data.quantity);

    if (!result.ok) return res.status(400).json({ message: result.message });



    await ActivityLogService.record(

      "CART_ITEM_UPDATED",

      `Updated cart item quantity to ×${b.data.quantity}`,

      activityActorFromRequest(req),

      { entityType: "CartItem", entityId: p.data.itemId, metadata: { quantity: b.data.quantity } }

    );



    return res.json({ cart: result.cart });

  }



  static async removeItem(req: Request, res: Response) {

    const p = itemIdSchema.safeParse(req.params);

    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });



    const result = await CartService.removeItem(req.user!.id, p.data.itemId);



    await ActivityLogService.record(

      "CART_ITEM_REMOVED",

      "Removed item from cart",

      activityActorFromRequest(req),

      { entityType: "CartItem", entityId: p.data.itemId }

    );



    return res.json({ cart: result.cart });

  }



  static async clear(req: Request, res: Response) {

    const result = await CartService.clear(req.user!.id);



    await ActivityLogService.record(

      "CART_CLEARED",

      "Cleared shopping cart",

      activityActorFromRequest(req)

    );



    return res.json({ cart: result.cart });

  }

}

