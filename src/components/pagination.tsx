export default function Pagination({pageno}){
    return(
    <div className="text-[#A13924] ">
    <button className="text-[25px] hover:scale-105 hover:translate-x-[-5px] duration-200 cursor-pointer  pr-1">«</button>
  <button className="pl-1 pr-1 text-[16px]">Page {pageno}</button>
  <button className="text-[25px] hover:scale-105 hover:translate-x-[5px] duration-200 cursor-pointer pl-1">»</button>
    </div>
    )
}