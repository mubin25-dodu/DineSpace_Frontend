export default interface Result<T , t2 = any> {
    Data?: T | null;
    additionalData?: t2 | null;
    Message:string;
    Success:boolean;
    Token?:string;
    VerificationType?:string;
    TotalOrders?:number;
}