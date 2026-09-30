export default interface Result<T> {
    Data?: T | null;
    Message:string;
    Success:boolean;
    Token?:string;
    VerificationType?:string;
    TotalOrders?:number;
}