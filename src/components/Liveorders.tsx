import { api } from "@/lib/api/axios";
import { resturantContext } from "@/lib/context/Context";
import { OrderStatus, PaymentStatus } from "@/lib/Enums";
import { Order } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { useContext } from "react";
import { motion } from "motion/react";

interface params{
    sendorders:Order[];
    handleChange: (id:string , state:OrderStatus , paymentstate?:PaymentStatus)=>void;
}


export  default  function LiveOrders({sendorders , handleChange} :params){
    // console.log("live orders");
    // console.log(sendorders);

    return<>
    <div className="h-[min(38rem,72vh)] min-h-[24rem] w-full overflow-hidden rounded-2xl border border-[#EFE3DD] bg-[#FFFCFA]">
        <div className="h-full overflow-x-auto scrollbar-none">
        <div className="grid h-full min-w-[660px] grid-cols-3 gap-2 p-2 sm:p-3">
            <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-[#F8F5F2] p-2 scrollbar-none">
                <div className="sticky top-0 z-10 mb-1 flex items-center justify-between rounded-lg bg-[#F8F5F2] px-2 py-2 text-sm font-bold text-[#352C29]"><span>New</span><span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#75645D]">{sendorders.filter((order) => order.OrderStatus === OrderStatus.Pending).length}</span></div>
                {sendorders.map(e=> e.OrderStatus === OrderStatus.Pending ?  <span className = "sticky top-10" key={e.id}>  <OrderCards  handler = {handleChange} getOrders={e} /> </span>  :"")}
            </div>
            <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-[#F8F5F2] p-2 scrollbar-none">
                <div className="sticky top-0 z-10 mb-1 flex items-center justify-between rounded-lg bg-[#F8F5F2] px-2 py-2 text-sm font-bold text-[#352C29]"><span>Preparing</span><span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#75645D]">{sendorders.filter((order) => order.OrderStatus === OrderStatus.Preparing).length}</span></div>
                {sendorders.map(e=> e.OrderStatus === OrderStatus.Preparing ? <span key={e.id} className = "sticky top-10"> <OrderCards  handler={handleChange} getOrders={e} /> </span>:"")}
            </div> 
            
            <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-[#F8F5F2] p-2 scrollbar-none">
                <div className="sticky top-0 z-10 mb-1 flex items-center justify-between rounded-lg bg-[#F8F5F2] px-2 py-2 text-sm font-bold text-[#352C29]"><span>Ready</span><span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#75645D]">{sendorders.filter((order) => order.OrderStatus === OrderStatus.Ready).length}</span></div>
                {sendorders.map(e=> e.OrderStatus === OrderStatus.Ready ?  <span className = "sticky top-10" key={e.id}>  <OrderCards  handler ={handleChange} getOrders={e} /> </span> :"")}

            </div>
        </div>
        </div>
    </div>
     </>
}

interface OrderCardsProps {
    handler: (id:string , state:OrderStatus , payment?:PaymentStatus)=>void;
    getOrders: Order;
}

export function  OrderCards({ handler , getOrders}: OrderCardsProps){
    // console.log(getOrders);
    // console.log("get orders");
    const {setpopup} = useContext(resturantContext);

    const orderBdTime = new Date(getOrders.OrderTime);
    const formattedOrderTime = orderBdTime.toLocaleTimeString("en-BD", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    const minutesAgo = Math.floor(
        (Date.now() - orderBdTime.getTime()) / (1000 * 60)
    );


    // console.log("check 1"+prevState);
 const handleChange = async (e:OrderStatus , declined?:boolean , payment?:PaymentStatus) =>  {
        const prevState = getOrders.OrderStatus ;
        const prevPayment = getOrders.payment.status;
        // console.log("ord state button clicked");
        handler(getOrders.id , e , payment);
        try{
            if( e === OrderStatus.Completed && getOrders.payment.status !== PaymentStatus.Paid){
                setpopup("Can Not Complete the order Without Payment");
                handler(getOrders.id , prevState , payment );
                return;
            }
            if(payment){
                    const res = await api.patch<Result<unknown>>(`payment/updatePayment`, {
                    id:getOrders.payment.id,
                    status:payment
                });
                // console.log("paymet stats");
                // console.log(res.data);
                !res.data.Success ?  handler(getOrders.id , prevState , prevPayment) :"";
                return 0;
            }
            const res = await api.patch<Result<unknown>>(`order/updateOrders/`, {
                    id:getOrders.id,
                    OrderStatus: e,
                });

                if(declined){
                    setpopup(res.data.Message);
                }
                console.log(res.data);
                !res.data.Success ?  handler(getOrders.id , prevState) :"";

    
        }catch(a){console.log(a);  handler(getOrders.id , prevState , prevPayment);  } //console.log("check 2"+prevState);
    }

    return (
       <>
       {getOrders !==null ?
       <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 , type: "spring" }}
            className="mt-2 flex  h-auto w-full flex-col gap-2 rounded-xl border border-[#E8E2DA] bg-white p-3 shadow-sm"
        >
            <div className="flex items-center justify-between gap-1.5 text-[11px] text-[#8A7971]">
                <div className="font-semibold text-[#554740]">Table {getOrders.table.tableno}</div>
                <div>#{getOrders.id.slice(30)}</div>
                <div>{formattedOrderTime} BD · {minutesAgo >= 60 ? `${Math.floor(minutesAgo / 60)}h` : `${minutesAgo}m`} ago</div>
            </div>
            <div className="truncate text-sm font-bold text-[#2F2724]">{getOrders.customerName}</div>
            <div className="flex h-fit flex-wrap gap-1.5">
                {getOrders.orderitems.map((item) => (
                    <span className="rounded-md bg-[#F8F5F2] px-1.5 py-0.5 text-[11px] text-[#64534D]" key={item.id}>{item.quantity}× {item.menu.itemName}</span>
                ))}
            </div>
          <span className="text-xs font-bold text-[#A13924]">Total bill: BDT {getOrders.payable}</span>
            <div className="text-xs">{getOrders.payment.status === PaymentStatus.Paid ? <span className="text-green-700">Paid · {getOrders.payment.transectionId}</span> :  <span className="flex flex-wrap items-center justify-between gap-1 text-red-700"><span>Payment {getOrders.payment.status}</span> <button onClick={()=>{handleChange( getOrders.OrderStatus ,  false ,PaymentStatus.Paid); console.log("mark as")}} className="rounded-md px-1 py-0.5 font-semibold text-[#554740] transition hover:bg-green-50 hover:text-green-700">Mark as paid ✓✓</button></span>}</div>
            <div className="flex flex-row justify-between gap-2">
                {getOrders.OrderStatus === OrderStatus.Pending ? <>
                    <button onClick={()=>{handleChange(OrderStatus.Preparing);}} className="h-8 flex-1 cursor-pointer rounded-lg bg-[#A13924] text-xs font-semibold text-white transition hover:bg-[#842F1E]">Accept</button>
                    <button onClick={()=> confirm("Are you sure you want to decline this order?") && handleChange(OrderStatus.Canceled , true)} className="h-8 rounded-lg px-2 text-xs font-semibold text-[#A13924] transition hover:bg-[#FFF3EE]">Decline</button>
                    </> : getOrders.OrderStatus === OrderStatus.Preparing ?
                    <button onClick={()=>handleChange(OrderStatus.Ready)} className="h-8 w-full cursor-pointer rounded-lg border border-[#E2B9AE] bg-[#FFF9F6] text-xs font-semibold text-[#A13924] transition hover:bg-[#F8EEE8]">Mark as ready</button> :
                    getOrders.OrderStatus === OrderStatus.Ready ?
                        <button onClick={()=>handleChange(OrderStatus.Completed)} className="h-8 w-full cursor-pointer rounded-lg border border-[#E2B9AE] bg-[#FFF9F6] text-xs font-semibold text-[#A13924] transition hover:bg-[#F8EEE8]">Mark as Complete</button> : null}
            </div>
        </motion.div>:""
        }
        </>
    );
    
}