import { WithdrawalType } from "@/lib/Enums";
import { z } from "zod";

export const withdrawal = z.object({
    accountNumber: z.string().min(1, "Account Number is required."),
    paymentMethod: z.string().trim().min(1, "Please select a method."),
    amount: z.coerce.number()
        .min(1, "Amount is required.")
        .refine((value) => Number(value) >= 500, "Amount must be at least 500.00."),
    type: z.nativeEnum(WithdrawalType)
});

export type withdrawals = z.infer<typeof withdrawal>;
export type WithdrawalFormInput = z.input<typeof withdrawal>;
