import { PaymentStatus } from "@/lib/Enums";

export interface Payment {
	id: string;
	status: PaymentStatus;
	paymentMethode: string;
	transectionId: string | null;
	acountNumber: number;
    amount:number;
	orderId: string;
	walletId: string | null;
    createdat:Date;
}

