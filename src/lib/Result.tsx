export default interface Result<T> {
    Data?: T;
    Message:string;
    Success:boolean;
    Token?:string;
}