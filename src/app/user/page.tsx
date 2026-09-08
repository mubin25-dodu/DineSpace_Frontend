import Usernav from "@/components/userComponents/usernav"
import { useState } from "react"
export default function user(){
    const [activeLink, setActiveLink] = useState("home");
    const handleLinkClick = (link: string) => {
        setActiveLink(link);
    };
    const [resturants , setresturants] = useState<>([]);
    return <>
    <Usernav activeLink={activeLink} />
    </>
}