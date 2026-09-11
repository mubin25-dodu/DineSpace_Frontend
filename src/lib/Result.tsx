export default interface Result<T> {
    Data?: T | null;
    Message:string;
    Success:boolean;
    Token?:string;
    TotalOrders?:number;
}