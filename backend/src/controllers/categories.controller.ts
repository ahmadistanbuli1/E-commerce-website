import type { Request, Response } from "express";

import { z } from "zod";

import { CategoriesService } from "../services/categories.service";

import { ActivityLogService } from "../services/activity-log.service";

import { activityActorFromRequest } from "../utils/request-context";



const emptyMsg = "This field is required";



const createSchema = z.object({

  name: z.string({ error: emptyMsg }).trim().min(1, emptyMsg).min(3, "Category name must be at least 3 characters"),

  description: z.string({ error: emptyMsg }).trim().min(1, emptyMsg)

});



const idParamSchema = z.object({

  id: z.string().uuid("Invalid id")

});



export class CategoriesController {

  static async list(_req: Request, res: Response) {

    const categories = await CategoriesService.list();

    return res.json({ categories });

  }



  static async create(req: Request, res: Response) {

    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {

      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });

    }



    try {

      const category = await CategoriesService.create(parsed.data);



      await ActivityLogService.record(

        "CATEGORY_CREATED",

        `Created category "${category.name}"`,

        activityActorFromRequest(req),

        { entityType: "Category", entityId: category.id }

      );



      return res.status(201).json({ category });

    } catch {

      return res.status(409).json({ message: "Category already exists" });

    }

  }



  static async update(req: Request, res: Response) {

    const p = idParamSchema.safeParse(req.params);

    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });



    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {

      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });

    }



    try {

      const category = await CategoriesService.update(p.data.id, parsed.data);



      await ActivityLogService.record(

        "CATEGORY_UPDATED",

        `Updated category "${category.name}"`,

        activityActorFromRequest(req),

        { entityType: "Category", entityId: category.id }

      );



      return res.json({ category });

    } catch {

      return res.status(404).json({ message: "Category not found" });

    }

  }

}

