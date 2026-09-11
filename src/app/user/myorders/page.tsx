"use client"
import { api } from "@/lib/api/axios";
import { userContext } from "@/lib/context/Context";
import Result from "@/lib/Result";
import { OrderStatus } from "@/lib/Enums";
import { ClipboardList, Clock, Flag, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

interface OrderSummary {
    id: string;
    status: string;
    orderedTime: string;
    restaurant: {
        id: string;
        name: string;
        address: string;
    };
}

export default function MyOrders(){
    const {setNavinfo} = useContext(userContext);
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [orderId, setOrderId] = useState("");
    const [isAddingOrder, setIsAddingOrder] = useState(false);
    const [addOrderMessage, setAddOrderMessage] = useState("");

    useEffect(()=>{
        setNavinfo({icon1:<ClipboardList color="#A13924"/>, title:"My Orders"});
    },[setNavinfo]);

    const getOrders = async ()=>{
            try{
                const storedOrders = localStorage.getItem("my orders");
                if(!storedOrders){
                    setOrders([]);
                    return;
                }

                const parsedOrders: unknown = JSON.parse(storedOrders);
                if(!Array.isArray(parsedOrders)){
                    setOrders([]);
                    return;
                }

                const orderIds = parsedOrders.filter((id): id is string =>
                    typeof id === "string" && id.trim() !== ""
                );
                if(orderIds.length < 1){
                    setOrders([]);
                    return;
                }

                const {data} = await api.post<Result<OrderSummary[]>>("/order/status", {orderIds});
                if(data?.Success){
                    setOrders((data.Data ?? []).sort((first, second) =>
                        new Date(second.orderedTime).getTime() - new Date(first.orderedTime).getTime()
                    ));
                }else{
                    setLoadError(data.Message || "Unable to load your orders.");
                }
            }catch(e){
                console.log(e);
                setLoadError("Unable to load your orders.");
            }finally{
                setIsLoading(false);
            }
    };

    useEffect(()=>{
        getOrders();
    },[]);

    const addOrder = async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const enteredOrderId = orderId.trim();
        if(!enteredOrderId){
            setAddOrderMessage("Enter an order ID first.");
            return;
        }
        if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(enteredOrderId)){
            setAddOrderMessage("Enter a valid order UUID.");
            return;
        }

        setIsAddingOrder(true);
        setAddOrderMessage("");
        try{
            const {data} = await api.get<Result<unknown>>(`/order/GetOrderById/${enteredOrderId}`);
            if(!data?.Success){
                setAddOrderMessage(data.Message || "Order not found.");
                return;
            }

            const storedOrders = localStorage.getItem("my orders");
            const parsedOrders: unknown = storedOrders ? JSON.parse(storedOrders) : [];
            const savedOrderIds = Array.isArray(parsedOrders)
                ? parsedOrders.filter((id): id is string => typeof id === "string")
                : [];
            if(!savedOrderIds.includes(enteredOrderId)){
                localStorage.setItem("my orders", JSON.stringify([...savedOrderIds, enteredOrderId]));
            }
            setOrderId("");
            setAddOrderMessage("Order added successfully.");
            setIsLoading(true);
            await getOrders();
        }catch(e){
            console.log(e);
            setAddOrderMessage("Unable to find this order.");
        }finally{
            setIsAddingOrder(false);
        }
    };

    const deleteOrder = (id: string)=>{
        const storedOrders = localStorage.getItem("my orders");
        const parsedOrders: unknown = storedOrders ? JSON.parse(storedOrders) : [];
        const savedOrderIds = Array.isArray(parsedOrders)
            ? parsedOrders.filter((orderId): orderId is string => typeof orderId === "string" && orderId !== id)
            : [];
        localStorage.setItem("my orders", JSON.stringify(savedOrderIds));
        setOrders((currentOrders)=>currentOrders.filter((order)=>order.id !== id));
    };

    return(
        <section className="m-3 mb-20">
            <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A13924]">Order history</p>
                <h1 className="mt-1 text-2xl font-semibold text-[#171717]">My Orders</h1>
            </div>
            <form onSubmit={addOrder} className="mb-5 rounded-2xl border border-[#DEC0BA] bg-white p-4 shadow-sm">
                <label htmlFor="order-id" className="mb-2 block text-sm font-semibold text-[#514947]">
                    Add an order
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                        id="order-id"
                        type="text"
                        value={orderId}
                        onChange={(event)=>setOrderId(event.target.value)}
                        placeholder="Enter order UUID"
                        className="min-w-0 flex-1 rounded-xl border border-[#DEC0BA] bg-[#FBF9F6] px-4 py-3 text-sm text-[#171717] outline-none focus:border-[#A13924] focus:ring-4 focus:ring-[#FAD8D0]"
                    />
                    <button
                        type="submit"
                        disabled={isAddingOrder}
                        className="rounded-xl bg-[#A13924] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isAddingOrder ? "Adding..." : "Add order"}
                    </button>
                </div>
                {addOrderMessage && (
                    <p className={`mt-2 text-sm ${addOrderMessage.includes("successfully") ? "text-emerald-700" : "text-red-700"}`}>
                        {addOrderMessage}
                    </p>
                )}
            </form>
            {isLoading ? (
                <div className="rounded-2xl border border-[#DEC0BA] bg-white px-5 py-12 text-center">
                    <p className="text-lg font-semibold text-[#171717]">Loading orders...</p>
                </div>
            ) : loadError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center text-red-800">{loadError}</div>
            ) : orders.length < 1 ? (
                <div className="rounded-2xl border border-dashed border-[#DEC0BA] bg-white px-5 py-12 text-center">
                    <ClipboardList className="mx-auto text-[#A13924]" size={36}/>
                    <p className="mt-3 text-lg font-semibold text-[#171717]">No orders yet</p>
                    <p className="mt-1 text-sm text-[#7a7776]">Your placed orders will appear here.</p>
                    <Link href="/user" className="mt-5 inline-block rounded-full bg-[#A13924] px-5 py-3 text-sm font-semibold text-white">Browse restaurants</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order)=>(
                        <div key={order.id} className="relative rounded-2xl border border-[#DEC0BA] bg-white p-5 shadow-sm">
                            {order.status === OrderStatus.Ready && (
                                <div className="absolute -right-2 -top-3 flex items-center gap-1 rounded-r-lg rounded-bl-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                                    <Flag size={14} fill="currentColor"/>
                                    Ready
                                </div>
                            )}
                            <Link href={`/user/myorders/${order.id}`} className="block transition hover:text-[#A13924]">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#171717]">{order.restaurant.name}</h2>
                                        <p className="mt-1 flex items-center gap-1 text-sm text-[#7a7776]"><MapPin size={15} className="text-[#A13924]"/>{order.restaurant.address}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        order.status === OrderStatus.Completed ? "bg-emerald-100 text-emerald-800" :
                                        order.status === OrderStatus.Canceled || order.status === OrderStatus.Failed ? "bg-red-100 text-red-800" :
                                        "bg-[#FAD8D0] text-[#A13924]"
                                    }`}>{order.status}</span>
                                </div>
                                <p className="mt-4 flex items-center gap-1 text-xs text-[#7a7776]"><Clock size={14}/>{new Date(order.orderedTime).toLocaleString()}</p>
                            </Link>
                            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E8D8D3] pt-4">
                                <Link
                                    href={`/user/Resturant/${order.restaurant.id}`}
                                    className="rounded-xl bg-[#A13924] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7E2C1C]"
                                >
                                    Visit restaurant
                                </Link>
                                <button
                                    type="button"
                                    onClick={()=>deleteOrder(order.id)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                                >
                                    <Trash2 size={16}/>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
