
"use client"
import { api } from "@/lib/api/axios";
import { Order } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { OrderStatus, PaymentStatus } from "@/lib/Enums";
import { ArrowLeft, Clock, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderInfo(){
    const param = useParams();
    const [order, setOrder] = useState<Order>();
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(()=>{
        const getOrder = async ()=>{
            if(typeof param.id !== "string" || param.id.trim() === ""){
                setLoadError("Order not found.");
                setIsLoading(false);
                return;
            }

            try{
                const {data} = await api.get<Result<Order>>(`/order/GetOrderById/${param.id}`);
                if(data?.Success && data.Data){
                    setOrder(data.Data);
                }else{
                    setLoadError(data.Message || "Order not found.");
                }
            }catch(e){
                console.log(e);
                setLoadError("Unable to load order details.");
            }finally{
                setIsLoading(false);
            }
        };

        getOrder();
    },[param.id]);

    if(isLoading){
        return(
            <section className="m-3 rounded-2xl border border-[#DEC0BA] bg-white px-5 py-12 text-center">
                <p className="text-lg font-semibold text-[#171717]">Loading order...</p>
            </section>
        )
    }

    if(loadError || !order){
        return(
            <section className="m-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-12 text-center">
                <h1 className="text-2xl font-semibold text-red-900">Order not found</h1>
                <p className="mt-2 text-sm text-red-800">{loadError}</p>
                <Link href="/user/myorders" className="mt-6 inline-flex rounded-full bg-[#A13924] px-5 py-3 text-sm font-semibold text-white">
                    Back to my orders
                </Link>
            </section>
        )
    }

    const isPending = order.OrderStatus === OrderStatus.Pending;
    const isCanceled = order.OrderStatus === OrderStatus.Canceled || order.OrderStatus === OrderStatus.Failed;
    const orderSteps = [
        {status: OrderStatus.Pending, title: "Order placed", description: "We have received your order"},
        {status: OrderStatus.Confirmed, title: "Confirmed", description: "The restaurant confirmed your order"},
        {status: OrderStatus.Preparing, title: "Preparing", description: "Your food is being prepared"},
        {status: OrderStatus.Ready, title: "Ready", description: "Your order is ready"},
        {status: OrderStatus.Completed, title: "Completed", description: "Order completed"},
    ];
    const currentStep = orderSteps.findIndex((step) => step.status === order.OrderStatus);
    const activeStep = currentStep < 0 ? 0 : currentStep;

    return(
        <section className="m-3 mb-20">
            <Link href="/user/myorders" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#A13924]">
                <ArrowLeft size={17}/> My orders
            </Link>

            <div className="rounded-2xl border border-[#DEC0BA] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A13924]">Order details</p>
                        <h1 className="mt-1 text-2xl font-semibold text-[#171717]">
                            {order.table?.resturant?.resturantName || "Restaurant order"}
                        </h1>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.OrderStatus === OrderStatus.Completed ? "bg-emerald-100 text-emerald-800" :
                        isCanceled ? "bg-red-100 text-red-800" :
                        "bg-[#FAD8D0] text-[#A13924]"
                    }`}>
                        {order.OrderStatus}
                    </span>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-sm text-[#7a7776]">
                    <p className="flex items-center gap-2">
                        <Clock size={16} className="text-[#A13924]"/>
                        {new Date(order.OrderTime).toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#A13924]"/>
                        Table {order.table?.tableno ?? "N/A"}
                    </p>
                </div>
            </div>

            {isCanceled ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                    <p className="text-lg font-semibold">
                        {order.OrderStatus === OrderStatus.Failed ? "Order payment failed" : "Order canceled"}
                    </p>
                    <p className="mt-1 text-sm">This order is no longer being processed.</p>
                </div>
            ) : (
                <div className="mt-4 rounded-2xl border border-[#DEC0BA] bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A13924]">Order progress</p>
                        <h2 className="mt-1 text-xl font-semibold text-[#171717]">
                            {order.OrderStatus === OrderStatus.Ready ? "Your order is ready" : "Track your order"}
                        </h2>
                    </div>
                    <div className="flex flex-col">
                        {orderSteps.map((step, index) => {
                            const isComplete = index <= activeStep;
                            const isCurrent = index === activeStep;
                            return (
                                <div key={step.status} className="flex min-h-18 gap-3">
                                    <div className="flex w-7 flex-col items-center">
                                        <span className={`z-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                                            isComplete
                                                ? "border-[#A13924] bg-[#A13924] text-white"
                                                : "border-[#DEC0BA] bg-white text-[#B9AAA5]"
                                        }`}>
                                            {isComplete ? "✓" : index + 1}
                                        </span>
                                        {index < orderSteps.length - 1 && (
                                            <span className={`w-0.5 flex-1 ${index < activeStep ? "bg-[#A13924]" : "bg-[#E8D8D3]"}`} />
                                        )}
                                    </div>
                                    <div className="pb-5">
                                        <p className={`text-sm font-semibold ${isCurrent ? "text-[#A13924]" : isComplete ? "text-[#171717]" : "text-[#B9AAA5]"}`}>
                                            {step.title}
                                        </p>
                                        <p className={`mt-0.5 text-xs ${isCurrent ? "text-[#7E2C1C]" : "text-[#7a7776]"}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {isPending ? (
                <div className="mt-4 rounded-2xl border border-[#E7B9A9] bg-[#FFF8F5] p-5 text-sm text-[#7E2C1C]">
                    <p className="font-semibold">Want to cancel your order?</p>
                    <p className="mt-1">
                        Your order has not been sent for processing yet. Please go to the counter to cancel it now.
                        You cannot cancel the order after it starts processing.
                    </p>
                </div>
            ) : !isCanceled && order.OrderStatus !== OrderStatus.Completed ? (
                <div className="mt-4 rounded-2xl border border-[#DEC0BA] bg-white p-5 text-sm text-[#7a7776]">
                    This order is being processed and can no longer be canceled.
                </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-[#DEC0BA] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-[#171717]">Order items</h2>
                <div className="mt-3 divide-y divide-[#E8D8D3]">
                    {order.orderitems.map((item)=>(
                        <div key={item.id || item.itemId} className="flex items-center justify-between gap-3 py-3">
                            <div>
                                <p className="font-semibold text-[#171717]">{item.menu.itemName}</p>
                                <p className="text-sm text-[#7a7776]">{item.quantity} x {item.price} BDT</p>
                            </div>
                            <p className="font-semibold text-[#A13924]">{item.quantity * item.price} BDT</p>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-[#E8D8D3] pt-3 font-semibold text-[#171717]">
                    <span>Total</span>
                    <span>{order.payable} BDT</span>
                </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#DEC0BA] bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#171717]">
                    <CreditCard size={20} className="text-[#A13924]"/> Payment details
                </h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="text-[#7a7776]">Method:</span> {order.payment?.paymentMethode || "N/A"}</p>
                    <p><span className="text-[#7a7776]">Status:</span> {order.payment?.status || PaymentStatus.Pending}</p>
                    <p><span className="text-[#7a7776]">Amount:</span> {order.payment?.amount ?? order.payable} BDT</p>
                    <p><span className="text-[#7a7776]">Transaction:</span> {order.payment?.transectionId || "Not available"}</p>
                </div>
            </div>
        </section>
    )
}
