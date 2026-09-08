import { z } from "zod";

export const menuSchema = z.object({
    itemName: z.string().trim().min(1, "Item name is required."),
    catagory: z.string().trim().min(1, "Please select a category."),
    price: z.coerce.number()
        .min(1, "Price is required.")
        .refine((value) => Number(value) >= 1, "Price must be at least 1.00."),
    description: z.string().max(500, "Description cannot exceed 250 characters."),
});

export type MenuForm = z.infer<typeof menuSchema>;
export type MenuFormInput = z.input<typeof menuSchema>;
