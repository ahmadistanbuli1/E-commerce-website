import type { Request, Response } from "express";

import { z } from "zod";

import { WishlistService } from "../services/wishlist.service";

import { ActivityLogService } from "../services/activity-log.service";

import { activityActorFromRequest } from "../utils/request-context";



const productIdSchema = z.object({

  productId: z.string().uuid("Invalid product id")

});



export class WishlistController {

  static async list(req: Request, res: Response) {

    const items = await WishlistService.list(req.user!.id);

    return res.json({ items });

  }



  static async add(req: Request, res: Response) {

    const p = productIdSchema.safeParse(req.params);

    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });



    const result = await WishlistService.add(req.user!.id, p.data.productId);

    if (!result.ok) return res.status(400).json({ message: result.message });



    await ActivityLogService.record(

      "WISHLIST_ADDED",

      `Added "${result.productName}" to wishlist`,

      activityActorFromRequest(req),

      { entityType: "Product", entityId: p.data.productId }

    );



    return res.status(204).send();

  }



  static async remove(req: Request, res: Response) {

    const p = productIdSchema.safeParse(req.params);

    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });



    const result = await WishlistService.remove(req.user!.id, p.data.productId);



    await ActivityLogService.record(

      "WISHLIST_REMOVED",

      `Removed "${result.productName ?? "product"}" from wishlist`,

      activityActorFromRequest(req),

      { entityType: "Product", entityId: p.data.productId }

    );



    return res.status(204).send();

  }

}

