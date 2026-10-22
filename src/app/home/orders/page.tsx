"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import OrderFilter from "@/components/OrderFilter";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { restaurantContext } from "@/lib/context/Context";
import { Order, OrderItem } from "@/lib/interfaces/order";
import { OrderStatus, PaymentStatus } from "@/lib/Enums";
import { ArrowDownUp, Dot, PhoneOutgoing, Search, UserRound, X } from "lucide-react";
import Pagination from "@/components/pagination";
import SearchItems from "@/components/SearchOrders";
import { motion } from "motion/react";
import LatticeLoader from "@/components/LatticeLoader/LetticalLoader";
import CountUp from "@/components/countUp/countUp";

const convertime = (time: Date | string) => {
  const formattedTime = new Date(time).toLocaleString("en-US", {
    day: "numeric", // "14"
    month: "short", // "Aug"
    year: "2-digit", // "26"
    hour: "numeric", // "8"
    minute: "2-digit", // "50"
    hour12: true, // Adds AM/PM
  });
  return formattedTime;
};

export default function Orders() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<number>(0);
  const { defaultRestaurant, refreshOrders, setpopup } = useContext(restaurantContext);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const pageSize = 50;
  const [disabled, setDisabled] = useState({prev:true, next:true});
  

  const loadorders = async () => {
    if (!defaultRestaurant) return;
    setIsLoading(true);
    try {
      const { data } = await api.get<Result<Order[]> & { TotalOrders?: number }>(
        `/order/GetallOrders/${defaultRestaurant}?page=${page}`,
      );
      if (data.Data) {
        setOrders(data.Data);
        const totalOrders = data.TotalOrders ?? 0;
        setAvailableOrders(totalOrders);
        // setSelectedOrder(
        //   data.Data.length > 0 ? data.Data[0] : null,
        // );
        setDisabled({
          prev: page <= 1,
          next: totalOrders > 0
            ? page * pageSize >= totalOrders
            : data.Data.length < pageSize,
        });
      }
    } finally {
      setIsLoading(false);
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
    setIsDetailsOpen(true);
  };

  const handleOrderStatusChange = async (status: OrderStatus) => {
    if (!selectedOrder || selectedOrder.OrderStatus === status) return;

    const previousOrder = selectedOrder;
    const updatedOrder = { ...selectedOrder, OrderStatus: status };
    setSelectedOrder(updatedOrder);
    setOrders((currentOrders) =>
      currentOrders.map((order) => order.id === updatedOrder.id ? updatedOrder : order)
    );

    try {
      const { data } = await api.patch<Result<unknown>>("order/updateOrders/", {
        id: updatedOrder.id,
        OrderStatus: status,
      });
      if (!data.Success) {
        throw new Error(data.Message || "Unable to update order status.");
      }
    } catch (error) {
      console.error("Order status update failed:", error);
      setSelectedOrder(previousOrder);
      setOrders((currentOrders) =>
        currentOrders.map((order) => order.id === previousOrder.id ? previousOrder : order)
      );
      setpopup("Unable to update the order status.");
    }
  };

  const handleDatabaseLookup = async () => {
    if (!searchTerm.trim()) return;
    try {
      const { data } = await api.get<Result<Order[]>>(
          `order/filterOrders/${defaultRestaurant}`,
          {
            params: {
              status: selectedFilter || 'all',
              searchTerm: searchTerm || undefined,
            },
          },
        );
        if (data.Success) {
          setOrders(data.Data ?? []);
          return;
        }
    }catch (error) {
      console.error("Database lookup failed:", error);
    }
  }

  const visibleOrders = orders
    .filter((order) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;

      return [
        order.id,
        order.customerName,
        order.customerPhone,
        order.OrderStatus,
        order.payment?.status,
        order.table?.tableno,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));
    })
    .filter((order) =>
      selectedFilter === "All" ? true : order.OrderStatus === selectedFilter
    )
    .sort((firstOrder, secondOrder) => {
      const firstTime = new Date(firstOrder.OrderTime).getTime();
      const secondTime = new Date(secondOrder.OrderTime).getTime();
      return sortNewestFirst ? secondTime - firstTime : firstTime - secondTime;
    });

  useEffect(() => {
    setPage(1);
  }, [defaultRestaurant]);

  useEffect(() => {
    loadorders();
  }, [defaultRestaurant, page, refreshOrders]);

  useEffect(() => {
    console.log("Search term changed:", searchTerm);
    if(searchTerm == "" || searchTerm === null){ 
      loadorders();
    }
  }, [searchTerm]);



  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 mt-10 mb-5">
          <div className="mb-6 px-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[30px] font-semibold leading-tight text-[#171717]">
                  Order History
                </h1>
                <p className="mt-1 text-[15px] text-[#514947]">
                  Manage and track active orders across all stations
                </p>
              </div>
              <Link
                href={`/user/Restaurant/${defaultRestaurant}`}
                className="mt-1 rounded-lg bg-[#A13924] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8a2c1d] focus:outline-none focus:ring-2 focus:ring-[#A13924]/15"
              >
                Place New Order
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-[#A13924]">
                <CountUp to={availableOrders} from={0} duration={0.5} /> found,
                showing <CountUp to={orders?.length} from={0} duration={0.5} />
                
              </span>
              {isLoading && (
                <span className="text-sm text-[#8b7168]">Loading...</span>
              )}
            </div>
          </div>
          <div className="mb-5 flex items-center justify-between gap-3 px-1">
            <motion.label
              initial={{  width: 0 }}
              animate={{  width: "20%" }}
              whileTap={{ width: "22%" }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative block w-full max-w-[28rem]"
            >
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7168]"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search orders..."
                aria-label="Search orders"
                className="w-full rounded-lg  focus:w-[130%] border border-[#DEC0BA] bg-white py-2.5 pl-9 pr-3 text-sm text-[#514947] outline-none transition placeholder:text-[#A58D85] duration-500 hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
              />
            </motion.label>
            <OrderFilter
              value={selectedFilter}
              orders={orders}
              onChange={setSelectedFilter}
            />
            <button
              onClick={() => {
                handleDatabaseLookup();
              }}
              className="whitespace-nowrap rounded-lg border border-[#A13924] bg-white px-4 py-2 text-sm font-semibold text-[#A13924] transition hover:bg-[#FFF1ED] focus:outline-none focus:ring-2 focus:ring-[#A13924]/15"
            >
              Database Lookup
            </button>
          </div>
          <motion.div initial={{ opacity: 0 , scale: 0.95 }} animate={{ opacity: 1 , scale: 1 }} transition={{ duration: 0.5 }} className="h-[65vh] overflow-hidden rounded-2xl border border-[#DEC0BA] bg-[#FFFCFA] shadow-sm">
            <div className="flex h-full flex-col ">
              <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto scrollbar-none mt-2">
                <table className="w-full min-w-[760px] table-fixed text-left">
                  <thead className="sticky top-0 z-10 border-b border-[#DEC0BA] bg-[#FFF8F5]">
                    <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#735B53]">
                      <th className="w-[23%] px-5 py-4">Order ID</th>
                      <th className="w-[14%] px-3 py-4">Table</th>
                      <th className="w-[20%] px-3 py-4">Payment</th>
                      <th className="w-[27%] px-3 py-4">Customer Details</th>
                      <th className="w-[16%] px-3 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSortNewestFirst((current) => !current)
                          }
                          className="inline-flex items-center gap-2 transition hover:text-[#A13924]"
                          aria-label={`Sort by date, currently ${sortNewestFirst ? "newest first" : "oldest first"}`}
                        >
                          Date
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F4E9E5] px-2 py-1 text-[10px] normal-case tracking-normal text-[#735B53]">
                            <ArrowDownUp size={11} />
                            {sortNewestFirst ? "Newest" : "Oldest"}
                          </span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#2F2724] ">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="h-[60vh] p-0">
                          <div className="flex h-full w-full items-center justify-center">
                            <LatticeLoader
                              className=""
                              status="working"
                              label="Loading Orders"
                              doneLabel="Done in"
                              errorLabel="Failed after"
                              pattern="arrow"
                              grid={3}
                              shape="round"
                              doneColor="#22c55e"
                              errorColor="#ef4444"
                              cellSize={6}
                              gap={2}
                              fontSize={14}
                              step={90}
                              idleOpacity={0.15}
                              glow={false}
                              glowColor="#f5f5f5"
                              showTimer
                              color="#A13924"
                            />
                          </div>
                        </td>
                      </tr>
                    ) : visibleOrders.length ? (
                      visibleOrders.map((e, i) => (
                        <motion.tr
                        key={e.id}
                          initial={{ y: i !== 0 ? 20 * i : 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          onClick={() => {
                            handleselection(e);
                          }}
                          className={`border-b border-[#EAD8D2] transition-colors ${
                            selectedOrder?.id === e.id
                              ? "bg-[#FFF3EE]"
                              : "bg-[#fffcfa] hover:bg-[#FFF3EE]"
                          }`}
                        >
                          <td className="px-5 py-5 font-medium text-[#514947]">
                            <span className="flex flex-col truncate">
                              #ORD-{e.id.slice(30)}
                              <span
                                className={`mt-1 w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                                  e.OrderStatus === OrderStatus.Confirmed
                                    ? "bg-[#DBEAFE] text-[#1D4ED8]"
                                    : e.OrderStatus === OrderStatus.Preparing
                                      ? "bg-[#FFF0C7] text-[#9A6B00]"
                                      : e.OrderStatus === OrderStatus.Ready
                                        ? "bg-[#EDE9FE] text-[#6D28D9]"
                                        : e.OrderStatus ===
                                            OrderStatus.Completed
                                          ? "bg-[#D9F5E4] text-[#168044]"
                                          : e.OrderStatus ===
                                                OrderStatus.Canceled ||
                                              e.OrderStatus ===
                                                OrderStatus.Failed
                                            ? "bg-[#FCE0DE] text-[#B42318]"
                                            : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {e.OrderStatus}
                              </span>
                            </span>
                          </td>
                          <td className="px-3 py-5 text-[#514947]">
                            Table-{e.table.tableno}
                          </td>
                          <td className="px-3 py-5">
                            <span className="block font-semibold text-[#171717]">
                              {e.payable} BDT
                            </span>
                            {e.payment.status == PaymentStatus.Pending ? (
                              <span className="mt-1 inline-flex rounded-full bg-[#FFF0C7] px-2.5 py-1 text-[11px] font-semibold text-[#9A6B00]">
                                {e.payment.status.toUpperCase()}
                              </span>
                            ) : e.payment.status == PaymentStatus.Failed ? (
                              <span className="mt-1 inline-flex rounded-full bg-[#FCE0DE] px-2.5 py-1 text-[11px] font-semibold text-[#B42318]">
                                {e.payment.status.toUpperCase()}
                              </span>
                            ) : e.payment.status == PaymentStatus.Paid ? (
                              <span className="mt-1 inline-flex rounded-full bg-[#D9F5E4] px-2.5 py-1 text-[11px] font-semibold text-[#168044]">
                                {e.payment.status.toUpperCase()}
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="px-3 py-5">
                            <span className="block truncate font-medium">
                              {e.customerName}
                            </span>
                            <a
                              href={`tel:${e.customerPhone}`}
                              className="mt-1 inline-flex items-center gap-1 text-xs text-[#735B53] transition hover:text-[#A13924]"
                            >
                              {e.customerPhone}
                              <PhoneOutgoing size={13} />
                            </a>
                          </td>
                          <td className="px-3 py-5 text-xs text-[#735B53]">
                            {convertime(e.OrderTime)}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center text-sm text-[#735B53]"
                        >
                          Nothing found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className=" flex justify-around border-t border-t-[#DEC0BA]">
                {" "}
                <span className="flex flex-row items-center gap-2">
                  {" "}
                  {isLoading ? "Loading" : ""}
                  <Pagination
                    setPage={setPage}
                    pageno={page}
                    disabled={disabled}
                  />
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {selectedOrder !== null && isDetailsOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 , transformOrigin: "top right" }}
            key={selectedOrder.id}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full lg:w-[40%]"
          >
            <OrderDetailsprofile
              selectedOrder={selectedOrder}
              onStatusChange={handleOrderStatusChange}
              onClose={() => setIsDetailsOpen(false)}
            />
          </motion.div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
interface order {
  selectedOrder: Order | null;
  onStatusChange: (status: OrderStatus) => void;
  onClose: () => void;
}
function OrderDetailsprofile({ selectedOrder, onStatusChange, onClose }: order) {
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
      <motion.div
        // key={selectedOrder.id}
        // initial={{ rotateY: 180, opacity: 0 }}
        // animate={{ rotateY: 0, opacity: 1 }}
        // transition={{ duration: 0.7, type: "spring" }}
        // style={{ transformPerspective: 1000 }}
        className="mt-10 mb-5 flex h-[84vh] w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-[#DEC0BA] bg-white shadow-sm lg:w-full"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#DEC0BA] p-5 text-[#57423D]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-[#171717]">
                Order #{selectedOrder.id.toString().slice(30)}
              </h2>
              <select
                value={selectedOrder.OrderStatus}
                onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
                aria-label="Change order status"
                className="rounded-lg border border-[#DEC0BA] bg-[#FFF8F5] px-2 py-1 text-sm font-bold text-[#A13924] outline-none transition hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 flex flex-wrap items-center text-sm text-[#735B53]">
              Placed at {convertime(selectedOrder.OrderTime)}
              <Dot size={20} strokeWidth={3} />
              Dine-in (Table no {selectedOrder.table.tableno})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            title="Close order details"
            className="rounded-lg p-2 text-[#735B53] transition hover:bg-[#FFF1ED] hover:text-[#A13924] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="mb-6 flex w-full items-center gap-4 rounded-xl border border-[#EAD8D2] bg-[#FFF8F5] p-4">
            <UserRound
              size={52}
              strokeWidth={1.8}
              className="shrink-0 rounded-full bg-[#F3DDD5] p-3 text-[#A13924]"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[#2F2724]">
                {selectedOrder.customerName}
              </p>
              <span className="mt-1 flex items-center gap-2 text-sm text-[#735B53]">
                <PhoneOutgoing size={15} />
                <a
                  className="transition hover:text-[#A13924]"
                  href={`tel:${selectedOrder.customerPhone}`}
                >
                  {selectedOrder.customerPhone}
                </a>
              </span>
            </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-xs font-semibold tracking-wide text-[#735B53]">
            <span>ORDER ITEMS ({selectedOrder.orderitems.length})</span>
            <button
              type="button"
              aria-expanded={more}
              onClick={() => setMore(!more)}
              className="text-sm font-semibold normal-case tracking-normal text-[#A13924] hover:underline"
            >
              Add more items
            </button>
          </div>
          <div className="mt-3">
          { selectedOrder.orderitems?.map((e) => (
            <Items key={e.id} items = {e} />
          ))}
          </div>
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
      </motion.div>
      <span onClick={()=>{console.log("peep peep")}} className= {`${!more? "hidden":""}`} >
          <SearchItems setMore = {setMore} orderId={selectedOrder.id}/></span>  
    </>
  );
}

interface item {
  items: OrderItem;
}
function Items({ items }: item) {
  if (!items.menu) {
    return (
      <div className="mr-10 py-2 text-sm text-gray-500">
        This item is no longer available.
      </div>
    );
  }

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
