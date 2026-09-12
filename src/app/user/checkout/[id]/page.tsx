"use client"
import { api } from "@/lib/api/axios";
import { userContext } from "@/lib/context/Context";
import { OrderItem, OrderTable, Restaurant } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { useContext, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import { Armchair, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import refreashbowl from "@/lib/algorithms/refreashbowl";
import Imagepath from "@/lib/algorithms/Imagepath";
import Link from "next/link";
import { paymentMethods, TableStatus } from "@/lib/Enums";

const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export default function Checkout(){
    const param = useParams();
    const router = useRouter();
    const [resturent , setresturent] = useState<Restaurant>();
    const [holdcheckout , setHoldcheckout] = useState(true);
    const {setNavinfo , setPopup , myBowl , setbowl} = useContext(userContext);
    const [selectedtable, setselectedtable] = useState<OrderTable | null>(null);
    const [nextTotal, setnextTotal] = useState(0);
    const [customerdetails , setcustomerdetails] = useState({name:"", phone:"", email:""});
    const [paymentMethod, setPaymentMethod] = useState<paymentMethods>();
    const [accountNumber, setAccountNumber] = useState("");
    const [checkoutProgress, setCheckoutProgress] = useState(0);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);
    const [restaurantNotFound, setRestaurantNotFound] = useState(false);
    useEffect(()=>{
         const Total = myBowl?.filter(e=> e.resturantId === param.id)
            .reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0) ?? 0;
            setnextTotal(Total);
    }, [myBowl, param.id ]);

    useEffect(()=>{
    setNavinfo({title:"Checkout" , goback:true});
    },[]);
    const getresdata = async ()=>{
        setIsLoadingRestaurant(true);
        setRestaurantNotFound(false);
        try{
            if(typeof param.id !== "string" || param.id.trim() === ""){
                setRestaurantNotFound(true);
                return;
            }
            const {data} = await api.get<Result<Restaurant>>(`resturant/getResturentById/${param.id}`);
                if (data?.Success && data.Data) {
                    setresturent(data.Data);

                    //holding checkout if the resturant is closed
                    setHoldcheckout(!data.Data.isopen);
                    // setPopup(data.Message);

                }
                else{
                    setRestaurantNotFound(true);
                }
        }catch(e){
            console.error("Unable to load restaurant for checkout:", e);
            setRestaurantNotFound(true);
        } finally {
            setIsLoadingRestaurant(false);
        }
    }

    //ammm i tired vhaiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
    // first getting the resturent data then updating it with the localstorage cause maybe price is updated or the product is not available soooooooo
    // my god new update : used adapter (i dont klnow if it is that i klwarned fro the SADP course)
    useEffect(()=>{
        if(!resturent) return;
        if(myBowl && myBowl.length < 1) return;
        setbowl( refreashbowl( myBowl ?? [] , resturent));
    },[resturent]);

    useEffect(()=>{ getresdata();},[param.id]);
    const availableTables = resturent?.tables
        ?.filter((table) => table.status === TableStatus.Available || table.status === TableStatus.Cleaning)
        .sort((first, second) => first.tableno - second.tableno) ?? [];
    const restaurantItems = myBowl?.filter((item) => item.resturantId === param.id) ?? [];

        const handleOrderAndPayment = async()=>{
            if(isProcessingOrder) return;
            if(!selectedtable){ setPopup("Select a table first"); return; }
            // console.log(paymentMethod);
            // console.log("paymentMethod");
            if(!paymentMethod){ setPopup("Select a Payment Method first"); return; }
            if(customerdetails.phone.trim() === "" || customerdetails.name.trim() === "" || customerdetails.email.trim() === ""){
                setPopup("Enter your name, email, and phone number first");
                return;
            }
            if(!customerdetails.phone.match(/^(?:\+88|0088|88)?01[3-9]\d{8}$/)){
                setPopup("Enter a valid phone number");
                return;
            }
            if(!customerdetails.name.match(/^[a-zA-Z\s]+$/)){
                setPopup("Enter a valid name");
                return;
            }
            if(!customerdetails.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
                setPopup("Enter a valid email address");
                return;
            }
            if(paymentMethod !== paymentMethods.Cash && accountNumber.trim() === ""){
                setPopup("Enter your account or card number");
                return;
            }
            try{
                setIsProcessingOrder(true);
                setCheckoutProgress(1);
                const orderitems = restaurantItems.filter((item) => item.quantity > 0).map((item) => ({
                    itemId: item.menu.id,
                    quantity: item.quantity
                }));
                const payment: {
                    paymentMethode: paymentMethods;
                    transectionId?: string;
                    acountNumber?: string;
                } = {
                    paymentMethode: paymentMethod
                };

                if(paymentMethod !== paymentMethods.Cash){
                    setCheckoutProgress(2);
                    await wait(800);
                    const intentResponse = await api.post<Result<{ transectionId: string }>>(
                        `/payment/intent`,
                        { paymentMethode: paymentMethod, amount: nextTotal }
                    );
                    const transactionId = intentResponse.data.Data?.transectionId;
                    if(!transactionId){
                        setPopup(intentResponse.data.Message || "Unable to create payment intent");
                        setCheckoutProgress(0);
                        return;
                    }

                    setCheckoutProgress(3);
                    await wait(800);
                    const fakePaymentResponse = await api.post<Result<{ transectionId?: string }>>(
                        `/payment/fake`,
                        {
                            transectionId: transactionId,
                            paymentMethode: paymentMethod,
                            amount: nextTotal,
                            acountNumber: accountNumber.trim()
                        }
                    );
                    if(!fakePaymentResponse.data.Success){
                        setPopup(fakePaymentResponse.data.Message || "Payment failed");
                        setCheckoutProgress(0);
                        return;
                    }
                    payment.transectionId = fakePaymentResponse.data.Data?.transectionId ?? transactionId;
                    payment.acountNumber = accountNumber.trim();
                }

                setCheckoutProgress(4);
                await wait(800);
                const response = await api.post<Result<{ id?: string; orderId?: string }>>(`/order/PlaceOrder`, {
                    orderdetails:{
                        tableId: selectedtable.id,
                        payable:0,
                        discount:0,
                        customerName: customerdetails.name.trim(),
                        customerPhone: customerdetails.phone.trim(),
                        customerEmail: customerdetails.email.trim()
                    },
                    orderitems,
                    payment
                });
                if(!response.data.Success){
                    setPopup(response.data.Message || "Unable to place order");
                    setCheckoutProgress(0);
                    return;
                }
                setCheckoutProgress(5);
                await wait(1000);
                const orderId = response.data.Data?.id ?? response.data.Data?.orderId;
                if(orderId){
                    const storedOrders = localStorage.getItem("my orders");
                    let myOrders: string[] = [];
                    if(storedOrders){
                        try{
                            const parsedOrders: unknown = JSON.parse(storedOrders);
                            if(Array.isArray(parsedOrders)){
                                myOrders = parsedOrders.filter((id): id is string => typeof id === "string");
                            }
                        }catch(error){
                            console.error("Error parsing stored orders:", error);
                        }
                    }
                    if(!myOrders.includes(orderId)){
                        localStorage.setItem("my orders", JSON.stringify([...myOrders, orderId]));
                    }
                }
                setbowl((items) => items.filter((item) => item.resturantId !== param.id));
                if(orderId){
                    router.push(`/user/myorders/${orderId}`);
                } else {
                    setPopup(response.data.Message || "Order placed successfully");
                }
            }catch(e){
                console.error(e);
                setCheckoutProgress(0);
                setPopup("Something went wrong while processing the order");
            } finally {
                setIsProcessingOrder(false);
            }

        }
return(
        <>
        {checkoutProgress > 0 && (
            <>
                <div className="fixed inset-0 z-50 cursor-wait bg-black/10" aria-hidden="true" />
                <div className="fixed left-0 right-0 top-0 z-60 flex justify-center bg-[#FBF9F6]/95 px-3 py-3 shadow-md backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl border border-[#DEC0BA] bg-white px-4 py-4 sm:px-5">
                        <ul className="steps steps-horizontal w-full text-xs sm:text-sm transition-all duration-300">
                            <li className={`step ${checkoutProgress >= 1 ? "step-primary" : ""}`}>Start</li>
                            <li className={`step ${checkoutProgress >= 2 ? "step-primary" : ""}`}>Payment intent</li>
                            <li className={`step ${checkoutProgress >= 3 ? "step-primary" : ""}`}>Payment</li>
                            <li className={`step ${checkoutProgress >= 4 ? "step-primary" : ""}`}>Place order</li>
                            <li className={`step ${checkoutProgress >= 5 ? "step-primary" : ""}`}>Complete</li>
                        </ul>
                    </div>
                </div>
            </>
        )}
        {isLoadingRestaurant ? (
            <section className="mx-3 mt-4 rounded-2xl border border-[#DEC0BA] bg-white px-5 py-12 text-center shadow-sm">
                <p className="text-lg font-semibold text-[#171717]">Loading checkout...</p>
                <p className="mt-2 text-sm text-[#7a7776]">We are getting the restaurant details.</p>
            </section>
        ) : restaurantNotFound ? (
            <section className="mx-3 mt-4 rounded-2xl border border-[#DEC0BA] bg-white px-5 py-12 text-center shadow-sm">
                <h1 className="text-2xl font-semibold text-[#171717]">Restaurant not found</h1>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#7a7776]">
                    This checkout link is invalid or the restaurant is no longer available.
                </p>
                <Link
                    href="/user"
                    className="mt-6 inline-flex rounded-full bg-[#A13924] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7E2C1C]"
                >
                    Browse restaurants
                </Link>
            </section>
        ) : resturent ? (
            <>
                <RestaurantCheckoutHeader restaurant={resturent} />
                <section className="mx-3 border border-[#DEC0BA] mt-4 rounded-2xl bg-white px-5 py-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#171717]">
                                Items in Order
                            </h2>
                            <span className="rounded-full bg-[#FAD8D0] px-3 py-1 text-sm font-semibold text-[#A13924]">
                                {myBowl?.filter((item) => item.resturantId === resturent.id).length ?? 0}
                            </span>
                        </div>
                        <Link href={`../Resturant/${param.id}`}
                            type="button"
                            className="text-sm font-semibold text-[#A13924] transition hover:text-[#7E2C1C]">
                            + Add More/Edit
                        </Link>
                    </div>

                    <div className="flex flex-col divide-y divide-[#F0E8E5]">
                        {myBowl
                            ?.filter((item) => item.resturantId === resturent.id)
                            .map((item) => (
                                <OrderItemCard key={item.menu.id} item={item} />
                            ))}
                    </div>
                </section>
                <section className="mx-3 mt-4 rounded-2xl border border-[#DEC0BA] bg-white px-5 py-6 shadow-sm">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A13924]">
                                Seating preference
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#171717]">
                                Choose your table
                            </h2>
                        </div>
                        <span className="text-sm text-[#7a7776]">
                            {selectedtable ? `Table ${selectedtable.tableno} selected` : "Select one to continue"}
                        </span>
                    </div>

                    {availableTables.length ? (
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
                            {availableTables
                                .map((table) => (
                                    <Table
                                        key={table.id}
                                        table={table}
                                        selected={selectedtable?.id === table.id}
                                        onSelect={setselectedtable}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-[#DEC0BA] bg-[#FBF9F6] px-4 py-6 text-center text-sm text-[#7a7776]">
                            No table is available at this moment.
                        </div>
                    )}
                </section>
                <section className="mx-3 mt-4 rounded-2xl border border-[#DEC0BA] bg-white px-5 py-6 shadow-sm">
                    <div className="mb-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A13924]">
                            Customer details
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#171717]">
                            Who should we contact?
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-[#514947]">
                                Customer name
                            </label>
                            <input
                                id="customer-name"
                                name="customerName"
                                type="text"
                                value={customerdetails.name}
                                onChange={(event) => setcustomerdetails((details) => ({ ...details, name: event.target.value }))}
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                                className="w-full rounded-xl border border-[#DEC0BA] bg-[#FBF9F6] px-4 py-3 text-base text-[#171717] outline-none transition placeholder:text-[#B9AAA5] hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-4 focus:ring-[#FAD8D0]"
                            />
                        </div>
                        <div>
                            <label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-[#514947]">
                                Phone number
                            </label>
                            <input
                                id="customer-phone"
                                name="customerPhone"
                                type="number"
                                value={customerdetails.phone}
                                onChange={(event) => setcustomerdetails((details) => ({ ...details, phone: event.target.value }))}
                                placeholder="01XXXXXXXXX"
                                inputMode="tel"
                                autoComplete="tel"
                                required
                                className="w-full rounded-xl border border-[#DEC0BA] bg-[#FBF9F6] px-4 py-3 text-base text-[#171717] outline-none transition placeholder:text-[#B9AAA5] hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-4 focus:ring-[#FAD8D0]"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="customer-email" className="mb-2 block text-sm font-semibold text-[#514947]">
                                Email address
                            </label>
                            <input
                                id="customer-email"
                                name="customerEmail"
                                type="email"
                                value={customerdetails.email}
                                onChange={(event) => setcustomerdetails((details) => ({ ...details, email: event.target.value }))}
                                placeholder="Enter your email address"
                                autoComplete="email"
                                required
                                className="w-full rounded-xl border border-[#DEC0BA] bg-[#FBF9F6] px-4 py-3 text-base text-[#171717] outline-none transition placeholder:text-[#B9AAA5] hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-4 focus:ring-[#FAD8D0]"
                            />
                        </div>
                    </div>
                </section>
                <section className="mx-3 mt-4 h-fit rounded-2xl border border-[#DEC0BA] bg-white px-5 py-6 shadow-sm">
                    <div className="mb-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A13924]">
                            Secure checkout
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#171717]">
                            Payment method
                        </h2>
                        <p className="mt-1 text-sm text-[#7a7776]">
                            Choose how you would like to pay for your order.
                        </p>
                    </div>

                    <label htmlFor="payment-method" className="mb-2 block text-sm font-semibold text-[#514947]">
                        Select a payment option
                    </label>
                    <div className="relative">
                        <select
                            id="payment-method"
                            name="paymentMethod"
                            value={paymentMethod}
                            onChange={(event) => setPaymentMethod(event.target.value as paymentMethods)}
                            className="w-full appearance-none rounded-xl border border-[#DEC0BA] bg-[#FBF9F6] px-4 py-3 pr-11 text-base font-medium text-[#171717] outline-none transition hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-4 focus:ring-[#FAD8D0]">
                            <option value="" >
                                Choose a payment method
                            </option>
                            <option value={paymentMethods.Cash}>Cash</option>
                            <option value={paymentMethods.Bkash}>bKash</option>
                            <option value={paymentMethods.Nagad}>Nagad</option>
                        </select>
                        <ChevronDown
                            aria-hidden="true"
                            size={19}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A13924]"
                        />
                        <label htmlFor="name" className="sr-only">
                            Enter Your Name
                        </label>
                    </div>
                    {paymentMethod === paymentMethods.Cash   && !resturent.payfirst ? (
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E8D8D3] bg-[#FBF9F6] px-4 py-3 text-sm text-[#514947]">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAD8D0] text-xs font-bold text-[#A13924]">
                                ✓
                            </span>
                            <p>Pay with cash when your order is delivered or served at the restaurant.</p>
                        </div>
                    ) : paymentMethod === paymentMethods.Cash  && resturent.payfirst ? <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E8D8D3] bg-[#FBF9F6] px-4 py-3 text-sm text-[#514947]">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAD8D0] text-xs font-bold text-[#A13924]">
                                ✓
                            </span>
                            <p>Pay the amout in the cash counter to confirm your order.</p>
                        </div> : paymentMethod ? (
                        <div className="mt-4 rounded-xl border border-[#FAD8D0] bg-[#FFF8F5] p-4">
                            <p className="text-sm font-semibold text-[#A13924]">
                                Simulated {paymentMethod === paymentMethods.Bkash ? "Bkash" : "Nagad"} payment
                            </p>
                            <p className="mt-1 text-xs text-[#7a7776]">
                                Enter the account or card number used for this simulated payment.
                            </p>
                            <label htmlFor="account-number" className="mt-4 mb-2 block text-sm font-semibold text-[#514947]">
                                Account or card number
                            </label>
                            <input
                                id="account-number"
                                name="accountNumber"
                                type="number"
                                inputMode="numeric"
                                autoComplete="off"
                                value={accountNumber}
                                onChange={(event) => setAccountNumber(event.target.value)}
                                placeholder="Enter account or card number"
                                required
                                className="w-full rounded-xl border border-[#DEC0BA] bg-white px-4 py-3 text-base text-[#171717] outline-none transition placeholder:text-[#B9AAA5] hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-4 focus:ring-[#FAD8D0]"
                            />
                        </div>
                    ) : null}
                </section>
                <div className="mb-38"></div>
                {nextTotal > 0 ? <span className="fixed bottom-15 left-0 right-0 z-50 flex h-16 w-full items-center justify-between gap-4 bg-[#A13924] p-4 text-white">
                <span className="font-bold">Total: {nextTotal} BDT</span>
                <span className="flex flex-row gap-4 items-center justify-end">
                <button disabled={isProcessingOrder} className= {`rounded-3xl bg-[#F5F3F0] p-1 pl-2.5 pr-2.5 text-[#A13924] font-semibold disabled:cursor-not-allowed disabled:opacity-60`} onClick={()=>handleOrderAndPayment()}>Pay Now</button> 
                </span></span>:""}

         </>
        ) : null}
        </>
)
}

function RestaurantCheckoutHeader({ restaurant }: { restaurant: Restaurant }) {
    return (
        <section className="mx-3 mt-4 overflow-hidden rounded-2xl border border-[#DEC0BA] bg-[#FBF9F6] shadow-sm">
            <div className="flex items-center justify-between gap-4 bg-[#A13924] px-5 py-4 text-white">
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#F5D9D2]">
                        Checkout from
                    </p>
                    <h1 className="truncate text-xl font-bold sm:text-2xl">
                        {restaurant.resturantName}
                    </h1>
                </div>
                <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        restaurant.isopen
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {restaurant.isopen ? "Kitchen Active" : "Kitchen Closed"}
                </span>
            </div>
            <div className="flex items-start gap-2 px-5 py-4 text-sm text-[#7a7776]">
                <MapPin className="mt-0.5 shrink-0 text-[#A13924]" size={18} />
                <span>{restaurant.address}</span>
            </div>
        </section>
    );
}

function OrderItemCard({ item }: { item: OrderItem }) {
    return (
        <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="relative h-24 w-24 z-1 shrink-0 overflow-hidden rounded-2xl bg-[#F5F3F0]">
                <Image
                    src={item.menu.images?.[0]?.Path
                        ? Imagepath(item.menu.images[0].Path)
                        : "/brokenOrderImage.jpg"}
                    alt={item.menu.itemName}
                    fill
                    className="object-cover"
                    sizes="96px"
                />
            </div>

            <div className="min-w-0 wrap-break-word w-fit flex-1">
                <h3 className="text-lg font-semibold text-[#171717]">
                    {item.menu.itemName}
                </h3>
                <p className="text-base  text-[#514947]">
                    {item.menu.description}
                </p>
                <p className="mt-1 text-lg font-medium text-[#A13924]">
                    {item.price * item.quantity} BDT <span className="text-[12px] text-gray-500">({item.menu.price} BDT Per Item)</span>
                </p>
                
            </div>

            {/* <div className="flex shrink-0 items-center gap-5 rounded-xl bg-[#F0EFED] px-4 py-3 text-xl text-[#292522]">
                <button type="button" aria-label={`Decrease ${item.menu.itemName}`}>
                    −
                </button>
                <span className="min-w-4 text-center text-lg">{item.quantity}</span>
                <button type="button" aria-label={`Increase ${item.menu.itemName}`}>
                    +
                </button>
            </div> */}
        </div>
    );
}

function Table({table,selected,onSelect}: {table: OrderTable;selected: boolean;onSelect: (table: OrderTable) => void;}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(table)}
            aria-pressed={selected}
            className={`flex min-h-20 w-full flex-col justify-between rounded-xl border p-2.5 text-left transition sm:min-h-24 sm:w-fit sm:rounded-2xl sm:p-3 ${
                selected
                    ? "border-[#A13924] bg-[#FFF1ED] shadow-md ring-2 ring-[#FAD8D0]"
                    : "border-[#E8D8D3] bg-[#FBF9F6] hover:border-[#C77A6A] hover:bg-[#FFF8F5]"
            }`}
        >
            <span className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 text-sm font-semibold text-[#171717] sm:text-base">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FAD8D0] text-[#A13924]">
                        <Armchair size={15} />
                    </span>
                    Table {table.tableno}
                </span>
                <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:py-1 sm:text-xs ${
                        table.status === TableStatus.Available
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                    }`} >
                    {table.status}
                </span>
            </span>
            <span className="mt-2 text-xs text-[#7a7776] sm:mt-3 sm:text-sm">
                Seats up to {table.seatCapacity} guests
            </span>
        </button>
    );
}
