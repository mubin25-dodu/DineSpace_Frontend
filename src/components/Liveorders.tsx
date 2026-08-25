import { api } from "@/lib/axios";
import { OrderStatus, PaymentStatus } from "@/lib/Enums";
// import NewOrders from "./orderCards"
import { Order } from "@/lib/interfaces/order";

interface params{
    getOrders:Order[];
    setgetorders:Order[];
}


export  default function LiveOrders({getOrders , setgetorders} :params){

console.log("Live orders data");
console.log(getOrders);

const handleChange = ()=>{

}

    return<>
    <div className="w-full bg-white h-220 p-5 border border-gray-200 rounded-2xl shadow overflow-hidden ">
        <div className="flex h-full min-h-0 flex-row gap-2">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
                <div className="sticky top-0 z-10 border-b bg-white"> New </div>
                {getOrders.map(e=> e.OrderstStatus === OrderStatus.Pending ? <OrderCards key={e.id} setgetorders = {setgetorders} getOrders={e} /> :"")}
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
                <div className="sticky top-0 z-10 border-b bg-white"> Preparing </div>
                {getOrders.map(e=> e.OrderstStatus === OrderStatus.Preparing ? <OrderCards key={e.id} setgetorders={setgetorders} getOrders={e} /> :"")}

            </div> 
            
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
                <div className="sticky top-0 z-10 border-b bg-white"> Ready </div>
                {getOrders.map(e=> e.OrderstStatus === OrderStatus.Ready ? <OrderCards key={e.id} setgetorders ={setgetorders} getOrders={e} /> :"")}

            </div>
        </div>
    </div>
     </>
}

interface OrderCardsProps {
    setgetorders: Order[];
    getOrders: Order;
}

export function OrderCards({ setgetorders , getOrders}: OrderCardsProps){
    console.log("order cards");
    console.log(getOrders)

    const orderBdTime = new Date(
        new Date(getOrders.OrderTime).getTime() + 6 * 60 * 60 * 1000
    );
    const minutesAgo = Math.floor(
        (Date.now() - orderBdTime.getTime()) / (1000 * 60)
    );

    const handleChange = async () =>  {
        const updateStatus = await api.put(`/order/UpdateOrderStatus/${getOrders.id}`)
    }

    return (
       <>
       <div className="flex flex-col gap-1 w-[95%] bg-[#FBF9F6] h-auto mt-4 ml-3 p-5 rounded-2xl shadow border border-gray-200">
            <div className="flex flex-row justify-between">
                <div>Table No- <span>{getOrders.table.tableno}</span></div>
                <div>{minutesAgo >= 60 ? `${Math.floor(minutesAgo / 60)}h` : `${minutesAgo}m`} ago</div>
            </div>
            <div className="text-[18px] font-semibold">{getOrders.customerName}</div>
            <div className="h-fit">
                {getOrders.orderitems.map((item) => (
                    <span className="mr-2" key={item.id}>{item.quantity}x{item.menu.itemName}</span>
                ))}
            </div>
          <span className="font-semibold">Total bill: {getOrders.payable}</span>
            <div>{getOrders.payment.status === PaymentStatus.Paid ? <span className="text-green-600">Paid Tid- {getOrders.payment.transectionId}</span> :  <span className="flex flex-row justify-between"><span className="text-red-600 ">Payment {getOrders.payment.status} <button className="text-black pl-1 pr-1 hover:text-green-600 cursor-pointer duration-500">Mark as paid ✓✓</button></span> </span>}</div>
            <div className="flex flex-row justify-between">
                {getOrders.OrderstStatus === OrderStatus.Pending ? <>
                    <button onClick={handleChange} className="hover:scale-95 transition-all duration-200 cursor-pointer w-[60%] bg-black rounded h-8 text-white">Accept</button>
                    <button onClick={handleChange} className="transition-all duration-200 cursor-pointer w-[30%] text-[#A13924] rounded h-8">Decline</button>
                </> : getOrders.OrderstStatus === OrderStatus.Preparing ?
                    <button onClick={handleChange} className="hover:scale-95 transition-all duration-200 cursor-pointer w-full border border-[#A13924] rounded h-8 text-[#A13924]">Mark as ready</button> :
                    getOrders.OrderstStatus === OrderStatus.Ready ?
                        <button onClick={handleChange} className="hover:scale-95 transition-all duration-200 cursor-pointer w-full border border-[#A13924] rounded h-8 text-[#A13924]">Mark as Complete</button> : null}
            </div>
        </div>
        </>
    );
    
}