import { OrderStatus } from "../Enums";
import { MenuItem } from "./order";
import { Payment } from "./payment";

export interface User {
    id: string;
    files?: Files[];
}

export interface Resturant {
    id: string;
    files?: Files[];
}

export interface menu {
    id: string;
    images?: Files[];
}

export interface Files {
    id: string;
    FileName: string;
    OriginalName: string;
    Path: string;
    Size: number;
    CreatedAt: Date;
    UploadedByUserId: string;
    uploadedByUser: User;
    RestaurantId?: string | null;
    restaurant?: Resturant | null;
    MenuId?: string | null;
    Menu?: menu | null;
}

export interface items{
	itemId: string;
	orderId?:string;
	addOnOrderId?: string;
	quantity: number;
	price?: number;
}

export interface selecteditems{
    id:string;
    menu?: MenuItem;
    orderitems?: items[];
    orderId?: string;
    OrderStatus?:OrderStatus;
    payment?:{paymentMethode:string};
}