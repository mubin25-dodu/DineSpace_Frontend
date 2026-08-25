"use client"
import KPICard from "@/components/KPICards"
import LiveOrders from "@/components/Liveorders";
import { api } from "@/lib/axios";
import Result from "@/lib/Result";
import { socket } from "@/lib/websock/socket";
import { kpicard, Order, OrderTable } from "@/lib/interfaces/order";
import { useContext, useEffect, useState } from "react";
import { resturantContext } from "@/lib/context/Context";
import { OrderStatus, TableStatus } from "@/lib/Enums";
import { CookingPot, HandCoins, RotateCwFadingClock, Table, Utensils } from "lucide-react";


export default function Overview() {
    const [socConnect , setSocConnect] = useState(false);
    const [getorders , setgetorders] = useState<Order[]>([]);
    const [getTables , setGettables] = useState<OrderTable[]>([]);
    const [orderkpi , setorderkpi] = useState<kpicard[]>()
    const [tablekpi , settablekpi] = useState<kpicard[]>()
    const [kpicards , setkpicard ] = useState<kpicard[]>();
    const defaultresturant = useContext(resturantContext);
    // const [date , setdate] = useState(()=> new Date());

    //populating orders data for live order and the overviews
       const getNewOrders = async ()=>{
            
            try {
            const res = await api.get<Result<Order[]>>(`/order/GetallOrders/${defaultresturant}`);
            console.log(res)
            const data = res.data.Data;
            setgetorders(data);
            if (data){
            let amount = 0;
            const payable = data?.filter((e)=> e.OrderstStatus == OrderStatus.Completed).map(e=> amount = e.payable + amount  )
            const kpicard = [{title:"Today's Orders",icon:<CookingPot  />,amount:data?.length} , 
                        {title:"Pending Orders" ,icon:<RotateCwFadingClock />,amount:data?.filter((e)=> e.OrderstStatus == OrderStatus.Pending).length} ,
                        {title: "Today's Revenue" , icon:<HandCoins/>,amount:amount}];
                    
                        setorderkpi(kpicard);
            }else{
                 const kpicard = [{title:"Today's Orders",icon:<CookingPot  />,amount:0} , 
                        {title:"Pending Orders" ,icon:<RotateCwFadingClock />,amount:0} ,
                        {title: "Today's Revenue" , icon:<HandCoins/>,amount:0}];
                        setorderkpi(kpicard);
            }
        }catch(e){console.error(e)}
        }

        //populating tables data 

        const Gettables = async ()=>{
            try{
            const res = await api.get<Result<OrderTable[]>>(`tables/getTablesByResturantId/${defaultresturant}`);
            const data = res.data.Data;
            setGettables(data);
            console.log("table data")
            console.log(data);
           if (data){
            const kpicard = [{title:"Active Bookings",icon:<Table />,amount:data.filter((e)=> e.reservationId).length} , 
                        {title: "Available Table" , icon:<Utensils/>,amount:data.filter((e)=> e.status == TableStatus.Available).length}];
                        settablekpi(kpicard);
            }else{
                 const kpicard = [{title:"Active Bookings",icon:<Table />,amount:0} , 
                        {title: "Available Table" , icon:<Utensils/>,amount:0}];
                        setkpicard(kpicard);
            }
            }catch(e){console.log(e)}
            
        }
        const loadOverview = async ()=>{
                const [orders, tables] = await Promise.all([
                getNewOrders(),
                Gettables(),
            ]);

        }

        useEffect(()=>{
         if(defaultresturant === undefined || defaultresturant === null || defaultresturant === "" ){return}

        loadOverview();
        // console.log("s");


        const handleConnect = () => {
        setSocConnect(true);
        console.log("socket loaded id-"+socket.id)
        };
        console.log("default res " + defaultresturant);
        socket.on("connect", handleConnect);
        socket.connect();
        return () => {
            socket.off("connect", handleConnect);
            socket.disconnect();
        };
        

        },[defaultresturant])

        useEffect(() => {
        setkpicard([
            ...(orderkpi ?? []),
            ...(tablekpi ?? []),
        ]);
        }, [orderkpi, tablekpi]);

   

    return <>
    <div className="ml-[16%] mt-4">
        <div className="text-[40px]">Today's Overview</div>
        <span className="flex flex-row gap-10 mt-10">{kpicards?.length  ? kpicards?.map((e,i)=>
        <KPICard key={i} {...e} />): "No data found "}</span> 
        <div className="mt-15 grid grid-cols-[minmax(0,7fr)_minmax(260px,3fr)] gap-6 items-start">
            <section>
                <div className="mb-3">
                    <span className="text-[30px]">Live Orders</span>
                    <span className="ml-5 text-[12px] cursor-pointer text-[#A13924] text-bold">View all Orders</span>
                </div>
            
                <LiveOrders getOrders={getorders} setGetOrders = {setgetorders} />
            </section>

            <section>
                <div className="text-[30px] mb-3">Table status</div>
                <div className="bg-white min-h-40 p-5 w-[90%] border border-gray-200 rounded-2xl shadow">
                    <Tables getTables = {getTables} setGettables = {setGettables}/>
                </div>
            </section>
        </div>
    </div>

    </>
}


interface params{
    getTables:OrderTable[];
    // setGettables:OrderTable[];
}


function Tables(param:params){
    const allStatus = [ "Available" , "Occupied" , "Reserved" , "Cleaning"];

    const statusStyles: Record<string, string> = {
        Available: "bg-green-100 text-green-700",
        Occupied: "bg-red-100 text-red-700",
        Reserved: "bg-amber-100 text-amber-700",
        Cleaning: "bg-blue-100 text-blue-700",
    };

    return(
        <div className="flex flex-col gap-3">
            {param.getTables !== undefined ? param.getTables.map((table) => (
                <div
                    key={table.tableno}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#FAFAF9] p-3">
                    <span className="font-semibold text-gray-700">
                        Table {table.tableno}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[table.status]}`}>
                        {table.status}
                    </span>
                    <select name="tableStatus" className="w-35 rounded-xl border border-gray-200 bg-[#FAFAF9]" id="">
                        <option value={table.status}>{table.status}</option>
                        {allStatus.filter(s => s !== table.status).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            )) : "No data Found"}
        </div>
    )
}