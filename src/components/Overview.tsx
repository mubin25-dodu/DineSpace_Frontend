"use client"
import KPICard from "@/components/KPICards"
import LiveOrders from "@/components/Liveorders";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { socket } from "@/lib/websock/socket";
import { kpicard, Order, OrderTable } from "@/lib/interfaces/order";
import { useContext, useEffect, useState } from "react";
import { restaurantContext } from "@/lib/context/Context";
import { OrderStatus, PaymentStatus, TableStatus } from "@/lib/Enums";
import { CheckCircle2, Clock3, CookingPot, CreditCard, HandCoins, RotateCwFadingClock, Subtitles, Table, Utensils } from "lucide-react";
import Inlinemessage from "./Inlinemessage";
import { Payment } from "@/lib/interfaces/payment";
import LatticeLoader from "./LatticeLoader/LetticalLoader";
import { motion } from "motion/react";

export default function Overview() {
    const [socConnect , setSocConnect] = useState(false);
    const [getorders , setgetorders] = useState<Order[]>([]);
    const [getTables , setGettables] = useState<OrderTable[]>([]);
    const [orderkpi , setorderkpi] = useState<kpicard[]>()
    const [tablekpi , settablekpi] = useState<kpicard[]>()
    const [totalamount, settotalamount] = useState(0);
    const [kpicards , setkpicard ] = useState<kpicard[]>();
    const {defaultRestaurant, setpopup , refreshOrders} = useContext(restaurantContext);
    const [sendorders , setSendorders] = useState<Order[]>([]);
    const [dataload, setDataload] = useState(false);
    // const [date , setdate] = useState(()=> new Date());

    const handleChange = (id:string , state:OrderStatus , paymentstate?:PaymentStatus)=>{
        console.log("odr state change");
        // console.log(id , paymentstate , state);
    setgetorders((odr)=>odr.map(e=> e.id === id ? {
        ...e,
        OrderStatus: state,
        payment: paymentstate ? { ...e.payment, status: paymentstate } : e.payment,
    } : e));
    }

    useEffect(()=>{
         loadkpis()
    },[getorders, getTables]);
    //populating orders data for live order and the overviews
       const getNewOrders = async ()=>{
            
        try {
            const res = await api.get<Result<Order[]>>(`/order/todaysOrders/${defaultRestaurant}`);
            // console.log(res)
            const data = res.data.Data;
            if (res.data.Success) {
                setgetorders(data ?? []);
                setDataload(true);
            }
            else if (res.data.Success === false) {
                setpopup("Failed to fetch orders try again later");
            }
        }catch(e){console.error(e)}
        }

        const loadkpis = ()=>{
            if (getorders !== null ){
            let amount:number = 0;
            const payable = getorders?.map((e)=> { e.OrderStatus == OrderStatus.Completed ? amount += Number(e.payable) : amount; return e; });
            // console.log("payable");
            // console.log(payable);

            const kpicard = [{title:"Today's Orders",icon:<CookingPot  />,amount:getorders?.length ,subtitle:""}  , 
                        {title:"Pending Orders" ,icon:<RotateCwFadingClock />,amount:getorders?.filter((e)=> e.OrderStatus == OrderStatus.Pending).length ,subtitle:"Orders"} ,
                        {title: "Today's Revenue" , icon:<HandCoins/>,amount:amount ,subtitle:"BDT"}];
                    
                        setorderkpi(kpicard);
            }else{
                 const kpicard = [{title:"Today's Orders",icon:<CookingPot  />,amount:0 , Subtitle:""} , 
                        {title:"Pending Orders" ,icon:<RotateCwFadingClock />,amount:0 ,subtitle:"Orders"} ,
                        {title: "Today's Revenue" , icon:<HandCoins/>,amount:0 ,subtitle:"BDT"} ];
                        setorderkpi(kpicard);
            }

            if (getTables){
            const kpicard = [{title:"Active Bookings",icon:<Table />,amount:getTables.filter((e)=> e.reservationId).length } , 
                        {title: "Available Table" , icon:<Utensils/>,amount:getTables.filter((e)=> e.status == TableStatus.Available).length}];
                        settablekpi(kpicard);
            }else{
                 const kpicard = [{title:"Active Bookings",icon:<Table />,amount:0} , 
                        {title: "Available Table" , icon:<Utensils/>,amount:0}];
                        setkpicard(kpicard);
            }
        }

        //populating tables data 

        const Gettables = async ()=>{
            try{
            const res = await api.get<Result<OrderTable[]>>(`tables/getTablesByResturantId/${defaultRestaurant}`);
            const data = res.data.Data;
            setGettables(data ?? []);
            // console.log("table data")
            // console.log(data);
           
            }catch(e){console.log(e)}
            
        }
        const loadOverview = async ()=>{
                const [orders, tables] = await Promise.all([
                getNewOrders(),
                Gettables(),
                loadkpis(),
            ]);

        }

        useEffect(()=>{
         if(defaultRestaurant === undefined || defaultRestaurant === null || defaultRestaurant === "" ){return}
        loadOverview();
        },[defaultRestaurant , refreshOrders]);

        useEffect(() => {
        setkpicard([
            ...(orderkpi ?? []),
            ...(tablekpi ?? []),
        ]);
        }, [orderkpi, tablekpi]);

        const handlesTableState = (id:string , state:TableStatus)=>{
            setGettables((tables) =>
                tables.map((table) =>
                    table.id === id ? { ...table, status: state } : table
                )
            );
        }
   
        const searchOrder = (query: string) => {
            if(!query){
                setSendorders(getorders);
                return;
            }
            const filteredOrders = getorders.filter((order) => {
                const orderIdMatch = order.id.toLowerCase().includes(query.toLowerCase());
                const customerNameMatch = order.customerName.toLowerCase().includes(query.toLowerCase());
                return orderIdMatch || customerNameMatch;
            });
            setSendorders(filteredOrders);
        }
useEffect(()=>{
    setSendorders(getorders);
}, [getorders]);


    return dataload ? (
        <div className="mx-auto w-full max-w-[1600px] space-y-3 px-3 pb-8 sm:px-3 lg:px-6">
            <header className="flex flex-col gap-3 rounded-3xl border border-[#EAD8D2] bg-gradient-to-r from-[#FFF9F6] via-white to-[#F8EEE8] p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A13924]">Restaurant dashboard</p>
                    <h1 className="text-3xl font-bold tracking-tight text-[#2F2724] sm:text-4xl">Today&apos;s Overview</h1>
                    <p className="mt-2 text-sm text-[#806D65]">A live snapshot of orders, tables, and revenue.</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E6D7D1] bg-white/80 px-3 py-2 text-xs font-semibold text-[#64534D]">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Live dashboard
                </div>
            </header>

            <section aria-label="Restaurant performance" className="flex flex-wrap items-stretch gap-6 mt-0 mb-2">
                {kpicards?.length ? kpicards.map((card, index) => (
                    <motion.div
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        key={card.title}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
                    >
                        <KPICard {...card} />
                    </motion.div>
                )) : (
                    <p className="rounded-2xl border border-dashed border-[#DEC0BA] bg-white p-5 text-sm text-[#806D65]">No performance data found.</p>
                )}
            </section>

            <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,0.72fr)]">
                <section aria-labelledby="live-orders-heading" className="min-w-0 overflow-hidden rounded-3xl border border-[#E8E2DA] bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#F0E8E3] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                            <h2 id="live-orders-heading" className="text-xl font-bold text-[#2F2724]">Live Orders</h2>
                            <p className="mt-1 text-sm text-[#8A7971]">Track each order through the kitchen.</p>
                        </div>
                        <label className="relative block w-full sm:max-w-xs">
                            <span className="sr-only">Search orders</span>
                            <input
                                onChange={(event) => searchOrder(event.target.value)}
                                type="search"
                                placeholder="Search orders or customers"
                                className="w-full rounded-xl border border-[#E6D7D1] bg-[#FFFCFA] px-4 py-2.5 text-sm text-[#352C29] outline-none transition placeholder:text-[#A9958D] focus:border-[#A13924] focus:ring-4 focus:ring-[#A13924]/10"
                            />
                        </label>
                    </div>
                    <div className="p-3 sm:p-5">
                        <LiveOrders sendorders={sendorders} handleChange={handleChange} />
                    </div>
                </section>

                <aside className="grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-1">
                    <section aria-labelledby="table-status-heading" className="min-w-0 rounded-3xl border border-[#E8E2DA] bg-white p-4 shadow-sm sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 id="table-status-heading" className="text-lg font-bold text-[#2F2724]">Table status</h2>
                                <p className="mt-1 text-xs text-[#8A7971]">{getTables.length} tables at your restaurant</p>
                            </div>
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#F8EEE8] text-[#A13924]"><Table size={20} /></span>
                        </div>
                        <div className="max-h-64 space-y-1.5 overflow-y-auto overflow-x-hidden pr-1 scrollbar-none">
                            {getTables.length ? [...getTables].sort((a, b) => a.tableno - b.tableno).map((table, index) => (
                                <motion.div
                                    key={table.id}
                                    initial={{ y: 12, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                                    className="w-full sticky top-0 "
                                >
                                    <Tables handlesTableState={handlesTableState} table={table} />
                                </motion.div>
                            )) : <p className="rounded-xl bg-[#FFFCFA] p-4 text-sm text-[#8A7971]">No tables found.</p>}
                        </div>
                    </section>

                    <section aria-labelledby="transactions-heading" className="min-w-0 rounded-3xl border border-[#E8E2DA] bg-white p-4 shadow-sm sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <h2 id="transactions-heading" className="text-lg font-bold text-[#2F2724]">Live transactions</h2>
                                <p className="mt-1 text-xs text-[#8A7971]">Recent payment activity</p>
                            </div>
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#F8EEE8] text-[#A13924]"><CreditCard size={20} /></span>
                        </div>
                        <div className="max-h-64 space-y-2 overflow-y-auto overflow-x-hidden pr-1 scrollbar-none">
                            <Transactions />
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    ) : (
        <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-12">
            <LatticeLoader
                className="min-h-29"
                status="working"
                label="Loading Today's Key Performance Indicators..."
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
    );
}


interface func{
    handlesTableState:(id:string , state:TableStatus)=>void;
    table:OrderTable;
}


function Tables({handlesTableState , table}:func){

    const[error , setError] = useState(false);

    const allStatus: TableStatus[] = [
        TableStatus.Available,
        TableStatus.Occupied,
        TableStatus.Reserved,
        TableStatus.Cleaning,
    ];

    const statusStyles: Record<string, string> = {
        Available: "bg-green-100 text-green-700",
        Occupied: "bg-red-100 text-red-700",
        Reserved: "bg-amber-100 text-amber-700",
        Cleaning: "bg-blue-100 text-blue-700",
    };

     
    const handleStatechange = async (state: TableStatus) => {
        const saveState = table.status;
        
        handlesTableState(table.id, state);
        try{
            if(state === TableStatus.Available){
                const res = await api.patch<Result<unknown>>(`tables/TableMakeaAvailable/${table.id}`);
                res.data.Success === true ? "" :()=> { handlesTableState(table.id , saveState ) ; setError(true)};
        }else if(state === TableStatus.Occupied){
                const res = await api.patch<Result<unknown>>(`tables/TableMakeaoccupied/${table.id}`);
                res.data.Success === true ? "" : ()=> { handlesTableState(table.id , saveState ) ; setError(true)};
        }
        else if(state === TableStatus.Reserved){
                const res = await api.patch<Result<unknown>>(`tables/TableMakereserved/${table.id}`);
                res.data.Success === true ? "" : ()=> { handlesTableState(table.id , saveState ) ; setError(true)};
        }
        else if(state === TableStatus.Cleaning){
                const res = await api.patch<Result<unknown>>(`tables/TableMakeCleaning/${table.id}`);
                res.data.Success === true ? "" : ()=> { handlesTableState(table.id , saveState ) ; setError(true)};
        }
        }catch(e){console.error(e) ; handlesTableState (table.id , saveState ); setError(true)}
    }

    return(
        <div className="mt-2">
            <Inlinemessage Message={"Couldn't Change the state" } error={error}/>
            {table ? (
                <div
                    key={table.tableno}
                    className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#F0E8E3] bg-[#FFFCFA] p-3">
                    <span className="min-w-0 truncate text-sm font-semibold text-[#413A34]">
                        Table {table.tableno}
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[table.status]}`}>
                        {table.status}
                    </span>
                    <select
                        name="tableStatus"
                        value={table.status}
                        aria-label={`Change status for table ${table.tableno}`}
                        className="w-28 shrink-0 rounded-lg border border-[#E6D7D1] bg-white px-2 py-1.5 text-xs text-[#554740] outline-none focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/10"
                        onChange={(e) => handleStatechange(e.target.value as TableStatus)} >
                        {allStatus.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                "No data Found"
            )}
        </div>
    )
}

function Transactions(){
    const { defaultRestaurant } = useContext(restaurantContext);
    const [payment , setPayment] = useState<Payment[]>();
   const getpayment = async ()=>{  
    try{
    const get = await api.get<Result<Payment[]>>(`payment/GetpaymentByResturentId/${defaultRestaurant}`);
        get.data.Data ? setPayment(get.data.Data) : "";
    } catch(e){console.error(e)}
    
}
    useEffect(()=>{
            if(defaultRestaurant === ""){return}
            getpayment();
        
        },[defaultRestaurant]);
    return (
        <div className="flex flex-col gap-3">
            {payment?.length ? [...payment]
                .sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime())
                .map((transaction ,index) => {
                    const isPaid = transaction.status.toLowerCase() === "paid";
                    const amount = Number(transaction.amount);
                    const formattedAmount = Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
                    const accountNumber = String(transaction.acountNumber);
                    const maskedAccount = accountNumber.length > 4
                        ? `**** ${accountNumber.slice(-4)}`
                        : accountNumber;

                    return (
                            <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }} key={transaction.id} className=" sticky top-0 rounded-xl border border-[#F0E8E3] bg-[#FFFCFA] p-3 shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3E5DE] text-[#A13924]">
                                            <CreditCard size={16} strokeWidth={2.2} />
                                        </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-[#27221E]">{transaction.paymentMethode}</p>
                                        <p className="truncate text-[10px] text-[#8A8179]">{transaction.transectionId ?? "No transaction ID"}</p>
                                    </div>
                                </div>
                                <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${isPaid ? "bg-[#E5F5EA] text-[#277A42]" : "bg-[#FFF1D6] text-[#A66A00]"}`}>
                                    {isPaid ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="mt-3 flex items-end justify-between border-t border-[#EEE8E1] pt-2">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-[#9A9189]">Amount</p>
                                    <p className="text-lg font-bold text-[#A13924]">BDT {formattedAmount}</p>
                                </div>
                                <div className="text-right text-[10px] text-[#766D65]">
                                    <p>Account</p>
                                    <p className="font-medium text-[#413A34]">{maskedAccount}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                }) : "No Data Found"}
        </div>
    )
}