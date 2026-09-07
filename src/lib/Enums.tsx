export enum OrderStatus {
    Confirmed = "confirmed",
    Preparing = "preparing",
    Ready = "ready",
    Completed = "completed",
    Canceled = "canceled",
    Failed = "failed",
    Pending = "pending",
}

export enum TableStatus{
    Occupied = "Occupied" ,
    Available = "Available",
    Reserved = "Reserved",
    Cleaning = "Cleaning",
}
export enum PaymentStatus{
    Paid="paid",
    Pending = "pending",
    Failed = "failed",
        ProcessingRefund = "processingrefund",
    Refund = "refund"
}
export enum WithdrawalStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
    Cancled = "cancled",
}
export enum WithdrawalType {
    Withdraw = "withdraw",
    Refund = "refund",
}
