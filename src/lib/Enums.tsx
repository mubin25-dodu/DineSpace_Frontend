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