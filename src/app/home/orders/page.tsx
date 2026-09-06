"use client";

import { useContext, useEffect, useState } from "react";
import OrderFilter from "@/components/OrderFilter";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { resturantContext } from "@/lib/context/Context";
import { Order, OrderItem } from "@/lib/interfaces/order";
import { PaymentStatus } from "@/lib/Enums";
import { Dot, PhoneOutgoing, UserRound, X } from "lucide-react";
import Pagination from "@/components/pagination";
import SearchItems from "@/components/SearchOrders";

const convertime = (time: Date | string) => {
  const bdTimeFormatted = new Date(time).toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    day: "numeric", // "14"
    month: "short", // "Aug"
    year: "2-digit", // "26"
    hour: "numeric", // "8"
    minute: "2-digit", // "50"
    hour12: true, // Adds AM/PM
  });
  return bdTimeFormatted;
};

export default function Orders() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const { defaultResturant } = useContext(resturantContext);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadorders = async () => {
    if (!defaultResturant) return;

    const { data } = await api.get<Result<Order[]>>(
      `/order/GetallOrders/${defaultResturant}`,
    );
    console.log(data);
    if (data.Data) {
      setOrders(data.Data);
      setSelectedOrder(
        data.Data.length > 0 ? data.Data[data.Data.length - 1] : null,
      );
    }
  };

  const handlediscount = (id:string , amount:number)=>{
   if (!amount || amount <= 0) return;

  setOrders((prevOrders) =>
    prevOrders.map((order) => {
      if (order.id !== id) return order;

      const newDiscount = order.discount + amount;
      const newPayable = Math.max(order.payable - amount, 0);

      return {
        ...order,
        discount: newDiscount,
        payable: newPayable,
      };
    })
  );


  setSelectedOrder((prev) => {
    if (!prev || prev.id !== id) return prev;

    return {
      ...prev,
      discount: prev.discount + amount,
      payable: Math.max(prev.payable - amount, 0),
    };
  });
  }

  const handleselection = (e: Order) => {
    setSelectedOrder(e);
    // console.log(selectedOrder);
  };

  useEffect(() => {
    loadorders();
  }, [defaultResturant]);

  const visibleOrders = orders
    .filter((e) =>
      selectedFilter === "All" ? true : e.OrderStatus === selectedFilter,
    )
    .sort(
      (a, b) =>
        new Date(a.OrderTime).getTime() - new Date(b.OrderTime).getTime(),
    );

  return (
    <>
      <div className="flex flex-row flex-wrap justify-between">
        <div className="w-[55%] mt-10 bg-white h-[85vh] mb-5 border border-[#DEC0BA] rounded-2xl shadow overflow-hidden ">
          <div className="flex h-full flex-col ">
            <div className="border-b border-[#DEC0BA] p-5">
              <span className="text-black font-semibold text-[25px] flex flex-col">
                <span>
                  Order History 
                  <span className="text-[14px] text-[#A13924]">
                    {orders.length} Found
                  </span>
                </span>
                <span className="mt-2 flex items-center justify-between mb-1">
                  <span className="font-normal text-[15px]">
                    Manage and track active orders across all stations
                  </span>
                  <OrderFilter
                    value={selectedFilter}
                    orders={orders}
                    onChange={setSelectedFilter}
                  />
                </span>
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto scrollbar-none">
              <table className="w-full text-center p-5 ">
                <thead className="sticky z-auto top-0 bg-white border-b border-[#DEC0BA]">
                  <tr className="font-normal">
                    <th>Order ID </th>
                    <th>Table</th>
                    <th>Payment</th>
                    <th className="w-[20%]">Customer Details</th>
                    <th>Date </th>
                  </tr>
                </thead>
                <tbody className=" rounded-2xl p-10">
                  {visibleOrders.length ? (
                    visibleOrders.map((e) => (
                      <tr
                        onClick={() => {
                          handleselection(e);
                        }}
                        key={e.id}
                        className={`h-30 hover:bg-amber-100  hover:scale-95 cursor-pointer duration-250 ${selectedOrder?.id === e.id ? "bg-[#ecdcd8a1] " : ""}`}
                      >
                        <td>#ORD-{e.id.slice(30)}</td>
                        <td>Table-{e.table.tableno}</td>
                        <td>
                          {" "}
                          {e.payable} -{" "}
                          {e.payment.status == PaymentStatus.Pending ? (
                            <span className="p-1 text-[12px] font-semibold text-amber-400">
                              {e.payment.status.toUpperCase()}
                            </span>
                          ) : e.payment.status == PaymentStatus.Failed ? (
                            <span className="p-1 text-[12px] font-semibold text-red-600">
                              {e.payment.status.toUpperCase()}
                            </span>
                          ) : e.payment.status == PaymentStatus.Paid ? (
                            <span className="p-1 text-[12px] font-semibold text-green-600">
                              {e.payment.status.toUpperCase()}
                            </span>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="flex flex-row  flex-wrap justify-center-safe mt-[10%]">
                          {e.customerName}-
                          <a
                            href={`tel:${e.customerPhone}`}
                            className="hover:text-blue-500"
                          >
                            <span className="flex flex-row gap-1">
                              {e.customerPhone}
                              <PhoneOutgoing size={15} />
                            </span>
                          </a>
                        </td>
                        <td>{convertime(e.OrderTime)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Nothing found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className=" flex justify-around border-t border-t-[#DEC0BA]">
              {" "}
              <span className="flex flex-row items-center gap-2">
                {" "}
                Loading <Pagination pageno={1} />
              </span>
            </div>
          </div>
        </div>
        <OrderDetailsprofile selectedOrder={selectedOrder} />
      </div>
    </>
  );
}
interface order {
  selectedOrder: Order | null;
}
function OrderDetailsprofile({ selectedOrder }: order) {
    const [disbtn , setdisbtn]= useState(false);
    const [more , setMore]= useState(false);

    const handlediscount = ()=>{
        
        
    }

  if (!selectedOrder) {
    return (
      <div className="w-[40%] mt-10 mr-10 bg-white h-[85vh] p-5 mb-5 border border-[#DEC0BA] rounded-2xl shadow overflow-hidden ">
        <div className="text-[#57423D] text-[16px] font-semibold">
          Select an order
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-[40%] mt-10 mr-10 bg-white h-[85vh] mb-5 border border-[#DEC0BA] rounded-2xl shadow overflow-hidden ">
        <div className="text-[#57423D] text-[16px] font-semibold p-6 border-b border-[#DEC0BA]">
          <span className="font-semibold text-[25px] flex flex-row items-center gap-3 ">
            Order #{selectedOrder.id.toString().slice(30)}{" "}
            <span className="font-bold text-[14px] text-[#A13924] bg-[#a139243d] p-1 pl-2 pr-2 rounded-[5px]">
              {selectedOrder.OrderStatus?.toLocaleUpperCase()}
            </span>
          </span>
          <span className=" flex flex-row">
            Placed at {convertime(selectedOrder.OrderTime)}{" "}
            <Dot size={25} strokeWidth={3} /> Dine-in (Table no{" "}
            {selectedOrder.table.tableno})
          </span>
        </div>

        <div className="bg-[#f5f3f0] p-5 m-10 w-fit rounded-2xl border-[#DEC0BA] ">
          <span className="flex flex-row justify-center items-center gap-4">
            <UserRound
              size={65}
              strokeWidth={3}
              className="bg-[#b1aeab] p-2 rounded-4xl "
            />
            <span>
              <span className="flex flex-col text-[30px]">
                {selectedOrder.customerName}
              </span>
              <span className="flex flex-row gap-2 items-center">
                <PhoneOutgoing size={20} color="blue" />
                <a
                  className="hover:text-blue-700"
                  href={`tel:${selectedOrder.customerPhone}`}
                >
                  {selectedOrder.customerPhone}
                </a>
              </span>
            </span>
          </span>
        </div>

        <div className="pl-10 ">
          <div>ORDER ITEMS ({selectedOrder.orderitems.length}) <span onClick={()=>{setMore(!more)}} className="text-[15px] cursor-pointer font-bold text-[#A13924]">add more items</span>
          </div>
          <br />
          <span>
          {selectedOrder.orderitems.map((e) => (
            <Items key={e.id} items = {e} />
          ))}
          </span>
        </div>
        <div>
            <hr className="border-[#b1aeab] w-[90%] ml-[5%] mt-5"/>
            <div className="pl-10 mt-5 flex flex-row justify-between mr-10">
                <span> Subtotal</span>
                <span> {selectedOrder.payable} BDT</span>
            </div>
            <div className="pl-10 flex flex-row justify-between mr-10">
                <span>Discount:</span>
                <span >{selectedOrder.discount} BDT</span> 
            </div>

              <div className="pl-10 flex flex-row  mr-10 ">
                <button className="cursor-pointer text-[#A13924]" onClick={()=>{setdisbtn(!disbtn)}}>Add discount</button> 
                <span className={ !disbtn ?`hidden`:""}>
                <input className="border ml-1 w-15 border-[#A13924]" type="number" name="" id="" /> BDT
                <button className="bg-[#A13924] p-1 ml-2 cursor-pointer hover:scale-95 text-white rounded" onClick={()=>handlediscount()}>Add</button>
                </span>
            </div>
            <hr className="border-[#b1aeab] w-[90%] ml-[5%] mt-5"/>
            
             <div className="pl-10 flex flex-row justify-between mr-10">
                <span> Total:</span>
                <span> {selectedOrder.payable - selectedOrder.discount} BDT</span>
            </div>
             <div className="pl-10 flex flex-row justify-between mr-10">
                <span> Paid:</span>
                <span> {selectedOrder.payment.amount} BDT</span>
             </div>
            <div className="pl-10 flex flex-row justify-between mr-10">
                <span> Payable amount</span>
                <span> {selectedOrder.payable - selectedOrder.payment.amount} BDT</span>
            </div>

        </div>
      </div>          
      <span onClick={()=>{console.log("peep peep")}} className= {`${!more? "hidden":""}`} >
          <SearchItems setMore = {setMore} orderId={selectedOrder.id}/></span>  
    </>
  );
}

interface item {
  items: OrderItem;
}
function Items({ items }: item) {
  return (
    <>
      <div>
        <span className="flex flex-row  items-center mr-10">
          <span className="bg-gray-300 p-1 mr-4  rounded">{items.quantity}</span>
          <span className="flex flex-row justify-between items-center w-full">
            <span className="flex flex-col "> 
                <span className="font-bold">{items.menu.itemName} </span>
                 <span className="text-[15px]">{items.menu.description}</span>
            </span>
            <span className="ml-0">{items.price} BDT</span>
          </span>
        </span>
      </div>
    </>
  );
}
