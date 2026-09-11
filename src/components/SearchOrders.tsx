import { api } from "@/lib/api/axios";
import { resturantContext } from "@/lib/context/Context";
import { MenuItem, OrderItem } from "@/lib/interfaces/order";
import Image from "next/image";
import Result from "@/lib/Result";
import { useContext, useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { selecteditems } from "@/lib/interfaces/file";
import { strict } from "assert";
import { OrderStatus } from "@/lib/Enums";
import Imagepath from "@/lib/algorithms/Imagepath";


export default function SearchOrders({setMore , orderId}: { setMore: (value: boolean) => void; orderId: string }) {
  const [menu , setmenu] = useState<MenuItem[]>();  
  const {defaultResturant , setservererror , setpopup} = useContext(resturantContext);
  const[searchterm , setsearchterm] = useState("");
  const [selected , setselected] = useState<selecteditems[]>();
  const [total , settotal] = useState(0);
  const [sync , setsync] = useState(true);
  
  useEffect(()=>{
    const nextTotal = (selected ?? []).reduce(
      (sum, item) => sum + Number(item.menu?.price ?? 0) * item.quantity,
      0
    );
    settotal(nextTotal);
  }, [selected]);

  useEffect(()=>{
    console.log(close);
    const getfromlocalstorage  = localStorage.getItem(`menu-${defaultResturant}`) ;
     if(getfromlocalstorage){ setmenu(JSON.parse(getfromlocalstorage));}
     else{
      void handlesync();
       }
  },[]);

  const handleadding = (count:number, id:string)=>{
   const item = menu?.find((e)=>e.id === id);
   if(!item){setpopup("Item not found"); return;}

   setselected((prev)=> {
   const current = prev ?? [];

    const existing = current.find((e)=> e.id === id);

    if(existing){
      return current.map(e=>
        e.id === id ? {...e , quantity: count, menu: e.menu ?? item } : e
      )
    }
    return [...current , { id:item.id, menu:item, orderId: "", quantity: count }];

   }
   );
  }

  const handlesave = async ()=>{
    console.log(selected);
    const obj =  {
      orderId:orderId,
      OrderStatus:OrderStatus.Preparing,
      orderitems: selected?.map(e=> {  return {itemId:e.menu?.id ?? e.id , orderId:orderId , quantity:e.quantity}}),
      payment:{
        paymentMethode:"cash"
       }
    };
    console.log(obj);
    try{
    const res = await api.post<Result<unknown>>(`order/PlaceAddOnOrder`, obj);
    console.log(res);
  }catch(e){ console.log(e)}
  }

      const handleremove = (id:string)=>{
          
      const item = menu?.find((e)=>e.id === id);
      if(!item){setpopup("Item not found"); return;}

      setselected((prev)=> {
        const current = prev ?? [];

        const existing = current.find((e)=> e.id === id);
        if(existing){
          return current.filter(e=>
            e.id !== id 
          )
        }
        return [...current ];
      });
    }



    const handlesync = async ()=>{
      console.log("sync")
      console.log(defaultResturant);
      try{
       const {data} = await api.get<Result<MenuItem[]>>(`menu/GetMenu/${defaultResturant}`);
       console.log("menu");
      //  console.log(data);
       data.Success ?  localStorage.setItem(`menu-${defaultResturant}`, JSON.stringify(data.Data)):"";
       setmenu(data.Data ?? []);
      }catch(e){ console.error(e) ; setservererror("the server run into a problem try again letter")};
      // console.log(data);
     }
  return (
    <>
    <div className={`fixed inset-0 w-full h-full bg-[#00000044] flex justify-center items-center`}>
      <div className="w-[80%] h-[90%] flex flex-col bg-white p-10 rounded-2xl gap-5">
        <div className="flex flex-row gap-2 sticky top-0 z-10 bg-white">
      <label className="input bg-[#a1392417] text-[#A13924]">
        <svg
          className="h-[1em] opacity-50 "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" onChange={(e)=>{setsearchterm(e.target.value); console.log(searchterm)}} required placeholder="Search" /> 
      </label>
      <button className="text-[#A13924] flex flex-row items-center gap-2"> Sync New List <RefreshCw size={15} className= {`${ sync ?"animate-spin":""}`}  /> </button>
      </div>

      <div className="flex flex-col mt-10 gap-4">
        <span> Selected Items: <span className="text-[#A13924] font-bold text-[12px] ">Payment Methode: Cash only</span></span> <span>Total:{total} BDT</span>
        <div className="">
        {selected == null || selected.length === 0 ? <div className="text-[#A13924]">No Items Selected</div> : <div className="overflow-scroll scrollbar-none flex flex-row max-h-60 flex-wrap gap-4">
          {selected.map((e) => <SelectedItemCard key={e.id} item={e} handleremove={handleremove} />)}</div>}
          </div>
        
      </div>
      <span>Items Availabe:</span>

      <span className="overflow-scroll scrollbar-none">
      <div className=" flex flex-row flex-wrap m-5 ">{menu?.filter((e)=> (e.itemName ?? "").toLowerCase().includes(searchterm.toLowerCase())).map((e)=> <span key={e.id} className="m-2"><Orderscard item={e} handleadding = {handleadding} /></span>)}</div></span>
      
      <div className="flex flex-row justify-end gap-5 items- w-[20%]">
      <button onClick={()=>handlesave()}
          className="mt-auto w-full rounded-xl bg-[#A13924] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-95 hover:bg-[#8a3125] cursor-pointer"
          type="button">
          Save
        </button>
         <button onClick={()=>{setMore(false);setselected([])}}
          className="w-full rounded-xl border border-[#A13924] px-4 py-2.5 text-sm font-semibold text-[#A13924] transition hover:scale-95 cursor-pointer duration-150"
          type="button">
          Cancle
        </button>
      </div>
      </div>

      </div>
    </>
  );
}
interface params{
  item:MenuItem;
  handleadding:(count:number , id:string)=> void;
}
function Orderscard({ item, handleadding }: params) {
  const [count, setcount] = useState(1);

  return (
    <div className="group flex min-w-[260px] flex-col overflow-hidden rounded-[24px] border border-[#EADFD9] bg-[#fffaf7] shadow-[0_12px_24px_rgba(161,57,36,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(161,57,36,0.12)]">
      <div className="relative h-36 w-full overflow-hidden bg-[#f5efe9]">
        <Image
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={item.images?.[0]?.Path ? Imagepath(item.images[0].Path) : "/brokenOrderImage.jpg"}
          alt={item.itemName}
          width={260}
          height={144}
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-[#A13924] shadow-sm">
          {item.catagory || "Popular"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#2d221f]">{item.itemName}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-[#6b5c59]">{item.description}</p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-[#a1392417] px-2 py-1 text-sm font-semibold text-[#A13924]">
            {item.price} BDT
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f1ee] px-2 py-2">
          <div className="flex items-center gap-2">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#503a3a] shadow-sm transition hover:bg-[#f2e3de]"
              onClick={() => setcount((prev) => Math.max(1, prev - 1))}
              type="button"
            >
              -
            </button>
            <span className="min-w-6 text-center text-base font-semibold text-[#2d221f]">{count}</span>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#503a3a] shadow-sm transition hover:bg-[#f2e3de]"
              onClick={() => setcount((prev) => prev + 1)}
              type="button"
            >
              +
            </button>
          </div>

          <span className="text-sm font-semibold text-[#A13924]">
            Total: {item.price * count} BDT
          </span>
        </div>

        <button
          className="mt-auto w-full rounded-xl bg-[#A13924] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[0.99] hover:bg-[#8a3125]"
          onClick={() => item.id && handleadding(count, item.id)}
          type="button"
        >
          Add to order
        </button>
      </div>
    </div>
  );
}

function SelectedItemCard({ item , handleremove}: { item: selecteditems , handleremove:(id:string)=> void }) {
  const menuItem = item.menu ?? ({
    id: item.id,
    itemName: "Selected Item",
    description: "",
    catagory: "",
    images: [],
    price: 0,
    isAvailable: true,
    resturentId: "",
  } as MenuItem);

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-[#F0E0DB] bg-white p-3 shadow-sm w-70">
      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#f5efe9]">
        <Image
          src={menuItem.images?.[0]?.Path ? Imagepath(menuItem.images[0].Path) : "/brokenOrderImage.jpg"}
          alt={menuItem.itemName || "Selected item"}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="truncate text-sm font-bold text-[#2d221f]">{menuItem.itemName}</p>
            <p className="text-xs text-[#6b5c59]">Qty: {item.quantity}</p>
          </div>
          <span className="text-sm font-semibold text-[#A13924]">
            {Number(menuItem.price) * item.quantity} BDT
          </span>
        </div>
      <button onClick={()=>handleremove(item.id)} className="text-[#A13924] cursor-pointer font-semibold hover:scale-102">Remove</button>
      </div>
    </div>
  );
}