import { api } from "../api/axios";

export default function(getpath:string){
    const path = getpath.replace(/\\/g, "/");

    if (!path) {
        return "/broken_resturant__logo.png";
    }

    return encodeURI(
        path.startsWith("http")
            ? path
            : `${api.defaults.baseURL?.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
    );
}
