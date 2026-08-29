import { api } from "@/lib/api/axios";
import { resturantContext } from "@/lib/context/Context";
import { MenuItem, OrderItem } from "@/lib/interfaces/order";
import Image from "next/image";
import Result from "@/lib/Result";
import { useContext, useEffect, useState } from "react";

export default function SearchOrders() {

  const [menu , setmenu] = useState<MenuItem[]>();  
  const {defaultResturant , setservererror} = useContext(resturantContext);
  const[searchterm , setsearchterm] = useState("");
  const [addorder , setaddorder] = useState<OrderItem[]>();

  useEffect(()=>{
    const getfromlocalstorage:MenuItem  = localStorage.getItem(`menu-${defaultResturant}`) ;
     if(getfromlocalstorage){ setmenu(JSON.parse(getfromlocalstorage));}
     else{
      void handlesync();
       }
  },[]);

  const handleadding = ()=>{

  }

    const handlesync = async ()=>{
      console.log("sync")
      console.log(defaultResturant);
      try{
       const {data} = await api.get<Result<MenuItem>>(`menu/GetMenu/${defaultResturant}`);
       console.log("menu");
      //  console.log(data);
       data.Success ?  localStorage.setItem(`menu-${defaultResturant}`, JSON.stringify(data.Data)):"";
       setmenu(data.Data);
      }catch(e){ console.error(e) ; setservererror("the server run into a problem try again letter")};
      // console.log(data);
     }
  return (
    <>
      <label className="input bg-[#a1392417] text-[#A13924]">
        <svg
          className="h-[1em] opacity-50"
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
        <input type="search" onChange={(e)=>{setsearchterm(e.target.value); console.log(menu)}} required placeholder="Search" /> 
      </label>
      <button className=" ml-2 cursor-pointer hover:scale-95 duration-150" onClick={()=>handlesync()}> sync new items</button>

      <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-none h-50 pb-20">
        {menu !== undefined ? menu.filter((e)=> e.itemName.includes(searchterm) || e.description.includes(searchterm)).map((e)=> (
          <div key={e.id} className="sticky top-2 z-10">
            <Orderscard handleadding={handleadding} item={e} />
          </div>
        )) : ""}
      </div>
    </>
  );
}
interface params{
  item:MenuItem;
  handleadding:()=> void;

}
function Orderscard({item , handleadding}:params){
const [count, setcount]= useState(1);


return<>
<div className="flex flex-row mt-2 p-3 gap-4 shadow-[13px 10px 10px 10px] mr-10 w-fit rounded-2xl bg-[#E4E2DF]">
  <Image className="rounded-2xl"
  src={item.images?.[0] ?? "/brokenOrderImage.jpg"}
        alt={item.itemName}
        width={100}
        height={100}
  />
<span>
  <span className="flex flex-col">
    <span className="font-black">
    {item.itemName}
  </span>
  <span>
    {item.description}
  </span>
  </span>
  <span>
    <div className="flex items-center gap-2">
  <button className="cursor-pointer" onClick={ ()=> {count > 1 ? setcount(count-1):""}}>-</button>
  <span>{count}</span>
  <button className="cursor-pointer"  onClick={ ()=> {setcount(count+1)}}>+</button>
  <span>Price:{item.price} BDT</span>
  <span className="text-[15px] text-[#A13924]">Total: {item.price*count} BDT</span>
</div>
<button className="bg-[#a13924] w-20 p-0.5 text-white hover:scale-95 cursor-pointer rounded" >Add</button>

  </span>
</span>
</div>
</>
}
