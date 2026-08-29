import { OrderStatus, PaymentStatus } from "@/lib/Enums";
import { ReactNode } from "react";
import { Files } from "./file";

export interface OrderItem {
    id: string;
    orderId: string;
    itemId: string;
    menu: MenuItem;
    quantity: number;
    price: string;
}

export interface MenuItem {
    id: string;
    itemName: string;
    description: string;
    catagory: string;
    images:Files[];
    price: number;
    isAvailable: boolean;
    resturentId: string;
}

export interface Restaurant {
    id: string;
    resturantName: string;
    address: string;
    isopen: boolean;
    opening: string;
    phone: string;
    resturantemail: string;
    closing: string;
    payfirst: boolean;
    ownerid: string;
    logoFileId: string | null;
    coverFileId: string | null;
    createdat: string;
    updated: string;
}

export interface OrderTable {
    id: string;
    tableno: number;
    status: string;
    seatCapacity: number;
    reservationId: string | null;
    resturantid: string;
    resturant: Restaurant;
}

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

export interface Order {
    id: string;
    tableId: string;
    table: OrderTable;
    orderitems: OrderItem[];
    payable: number;
    discount: number;
    payment: Payment;
    OrderStatus: OrderStatus;
    DeliveryTime: string | null;
    customerName: string;
    customerPhone: string;
    OrderTime: string;
}

export interface kpicard{
    title?:string,icon?:ReactNode,amount?:number,
}