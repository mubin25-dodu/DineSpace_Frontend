export default interface Result<T = unknown> {
    Data?: T;
    Message:string;
    Success:boolean;
    Token?:string;
}