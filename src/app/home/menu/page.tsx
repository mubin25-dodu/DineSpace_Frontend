"use client"
import { api } from "@/lib/api/axios";
import { resturantContext } from "@/lib/context/Context";
import { MenuItem } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { ArrowUpDown, PenLine, Plus, Search, Trash } from "lucide-react"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import Togglebutton from "@/components/Togglebutton";
import Image from "next/image";

export default function MenuPage() {
    const [menu , setmenu] = useState<MenuItem[]>();
    const [senddata , setsenddata] = useState<MenuItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const {defaultResturant , setpopup} = useContext(resturantContext);
    
    const callmenuapi = async ()=>{
        if (!defaultResturant) return;
        try{
        const {data} = await api.get<Result<MenuItem[]>>(`/menu/GetMenu/${defaultResturant}`);
        if(data.Success)  {
               setmenu(data.Data ?? []);
        }
    }catch(e){
        console.log(e);
    }
    }
    useEffect(()=>{
        if (!defaultResturant) return;
        callmenuapi();
    },[defaultResturant]);

    useEffect(()=>{
        const query = searchTerm.trim().toLowerCase();
        setsenddata((menu ?? []).filter((item) =>
            [item.itemName, item.catagory, item.description]
                .some((value) => value?.toLowerCase().includes(query))
        ));
    }, [menu, searchTerm]);


    const toggleAvailable = async (state:boolean , id:string)=>{
        // console.log("toggle click")
        setmenu((prev)=>
            prev?.map((e)=> e.id == id ? {...e , isAvailable:state} : e)        
        ); 
        try{
            const {data} = await api.get<Result<unknown>>(`menu/toggleAvailabel/${id}`);
            if(data.Success){
            }
            else{setpopup(data.Message);}
            
        }catch(e){console.log(e);
            setpopup("Something went wrong");
            setmenu((prev)=>
            prev?.map((e)=> e.id == id ? {...e , isAvailable:!state} : e)      
        ); 
        }
    }

    // delete item
    const DeleteItem = async (id:string)=>{
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;
        setmenu((prev)=>
            prev?.filter((e)=> e.id !== id)        
        );
       try{ const {data} = await api.delete<Result<unknown>>(`menu/DeleteMenuItem/${id}`);
        if(!data.Success){
            setpopup(data.Message);
            callmenuapi();
        }}catch(e){console.log(e);
            setpopup("Something went wrong");
            callmenuapi();
        }
    }
    return (
        <>
        <div className="mt-5">
            <span className="flex row-auto justify-between items-center">
            <span className="flex flex-col">
            <div className="text-[30px] font-semibold"> Menu Management</div>
            <div className="text-gray-600 ">Organize categories, update pricing, and manage availability.</div>
            <span>
            <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#dec0ba] bg-[#fff8f5] px-3 py-1.5 text-sm font-medium text-[#654f48]">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#A13924] px-1.5 text-xs font-bold text-white">
                    {senddata?.length ?? 0}
                </span>
                {senddata?.length === 1 ? "menu item" : "menu items"} found
            </span>
            <label className="relative mt-3 block w-full max-w-sm">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7168]" />
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search menu items..."
                    aria-label="Search menu items"
                    className="w-full rounded-lg border border-[#dec0ba] bg-white py-2 pl-10 pr-3 text-sm text-[#28211e] outline-none transition placeholder:text-[#a58d85] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
                />
            </label>
            </span>
            </span>
            <Link href="menu/addMenu" className="items-center mr-5 h-fit flex gap-2 bg-[#A13924] p-2 text-white w-fit rounded-[10px]"> <Plus strokeWidth={3} size={20} /> Add Menu Item</Link>            
            </span>
            
            {menu ? <MenuTable data = {senddata} toggleAvailable = {toggleAvailable} DeleteItem={DeleteItem}/>:"Nothing to load "}
            
        </div>
        </>
    )
}

interface params{
    toggleAvailable:(state:boolean , id:string)=> void;
    DeleteItem:(id:string)=> void;
    data:MenuItem[];
}
function MenuTable({data , toggleAvailable , DeleteItem}:params){
    const [showdata , setshowdata] = useState(data);

    useEffect(()=>{
        setshowdata(data);
    }, [data]);

    const handlesort = (type:string)=>{
        if(type=="byprice"){
            // console.log("byprice")
            const acend = [...data].sort((a , b)=> a.price - b.price);
            const dec =[...data].sort((a , b)=> b.price - a.price);
            if(showdata[0] === acend[0] && showdata[showdata.length-1] == acend[showdata.length-1]){
                setshowdata(dec)
            }else if(showdata[0] == dec[0] && showdata[showdata.length-1] == dec[showdata.length-1]){
                setshowdata(acend);
            }
            else{
                setshowdata(acend);
            }
        }else if(type=="byavailability"){
            const availableFirst = [...data].sort((a , b)=> Number(b.isAvailable) - Number(a.isAvailable));
            const unavailableFirst = [...data].sort((a , b)=> Number(a.isAvailable) - Number(b.isAvailable));
            if(showdata[0] === availableFirst[0] && showdata[showdata.length-1] === availableFirst[availableFirst.length-1]){
                setshowdata(unavailableFirst);
            }else{
                setshowdata(availableFirst);
            }
        }
    }
    return (
        <>
        <div className="mt-5 mr-5 overflow-x-auto overflow-scroll scrollbar-none h-[70vh] rounded-xl border border-[#dec0ba] bg-white">
            <table className="w-full min-w-[900px] table-fixed text-left">
                <colgroup>
                    <col className="w-[120px]" />
                    <col className="w-[32%]" />
                    <col className="w-[16%]" />
                    <col className="w-[12%]" />
                    <col className="w-[22%]" />
                    <col className="w-[130px]" />
                </colgroup>
                <thead className="sticky top-0 z-10 border-b bg-white border-[#dec0ba] text-[15px] uppercase tracking-wide text-[#654f48]">
                    <tr>
                        <th className="px-5 py-3 font-semibold">Image</th>
                        <th className="px-5 py-3 font-semibold">Item Name</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        <th
                            className="group cursor-pointer px-5 py-3 font-semibold outline-none hover:bg-[#fcf7f4] focus-visible:bg-[#fcf7f4] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A13924]"
                            onClick={()=>{handlesort("byprice")}}
                            tabIndex={0}
                            title="Sort by price">
                            <span className="inline-flex items-center gap-1.5">
                                Price
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#f3efed] px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-[#8b7168] transition-colors group-hover:bg-[#ead9d4] group-hover:text-[#A13924]">
                                    <ArrowUpDown size={11} />
                                    Click to sort
                                </span>
                            </span>
                        </th>
                        <th
                            className="group cursor-pointer px-5 py-3 font-semibold outline-none hover:bg-[#fcf7f4] focus-visible:bg-[#fcf7f4] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A13924]"
                            onClick={()=>{handlesort("byavailability")}}
                            tabIndex={0}
                            title="Sort by availability">

                            <span className="inline-flex items-center gap-1.5">
                                Availability
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#f3efed] px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-[#8b7168] transition-colors group-hover:bg-[#ead9d4] group-hover:text-[#A13924]">
                                    <ArrowUpDown size={11} />
                                    Click to sort
                                </span>
                            </span>
                        </th>
                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="">
                    {showdata.map((item) => (
                        <tr key={item.id} className={`h-20 border-b border-[#ead9d4] last:border-0 hover:bg-[#fcf7f4] ${item.isAvailable ? "" : "bg-[#f9e5e0]"}`}>
                            <td className="px-5 py-3  ">
                                <Image
                                    src={item.images?.[0]?.Path
                                        ? encodeURI((item.images[0].Path.replace(/\\/g, "/")).startsWith("http")
                                            ? item.images[0].Path.replace(/\\/g, "/")
                                            : `${api.defaults.baseURL?.replace(/\/$/, "")}/${item.images[0].Path.replace(/\\/g, "/").replace(/^\//, "")}`)
                                        : "/brokenOrderImage.jpg"}
                                    alt={item.itemName}
                                    className="h-20 w-20 rounded-lg object-cover transition-transform duration-300"
                                    quality={100}
                                    width={200}
                                    height={200}
                                />
                            </td>
                            <td className="px-5 py-3">
                                <div className="text-sm font-medium text-[#28211e]">{item.itemName}</div>
                                <div className="max-w-[250px] text-xs text-[#654f48]">{item.description}</div>
                            </td>
                            <td className="px-5 py-3">
                                <span className="rounded-md bg-[#f3efed] px-2.5 py-1 text-xs text-[#554742]">{item.catagory}</span>
                            </td>
                            <td className="px-5 py-3 text-sm font-semibold">${Number(item.price).toFixed(2)}</td>
                            <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                    {item.isAvailable ? <span className="rounded-md bg-[#80f1a6] px-2.5 py-1 text-xs text-black">Available</span> : <span className="rounded-md bg-[#f19780] px-2.5 py-1 text-xs text-black" > Not Available</span>} 
                                    <span onClick={()=> toggleAvailable(!item.isAvailable , item.id)} className="">
                                    <Togglebutton ischecked={item.isAvailable ?? false}/> </span>
                                </div>
                            </td>
                            <td className="px-5 py-3 text-right text-[#A13924]">
                                
                                <span className="flex flex-row gap-2 items-center ">
                                    <button onClick={()=>DeleteItem(item.id)} className="flex cursor-pointer flex-row gap-2 items-center justify-center hover:scale-95 "><Trash strokeWidth={3} /></button> 
                                <Link href={`menu/edit/${item.id}`} className="hover:scale-95  flex flex-row gap-2 items-center justify-center"><PenLine  strokeWidth={3} /></Link>
                                </span>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}
