import { WithdrawalStatus } from "../Enums";

export interface WithdrawalRequest {
    id: string;
    accountNumber: string;
    amount: string;
    createdAt: string;
    paymentMethod: string;
    processedAt: string | null;
    rejectionReason: string | null;
    status: WithdrawalStatus;
    type: string;
    updatedAt: string;
    walletId: string;
}

export interface Wallet {
    id: string;
    balance: string;
    createdAt: string;
    restaurantId: string;
    updatedAt: string;
    withdrawalRequests: WithdrawalRequest[];
}


