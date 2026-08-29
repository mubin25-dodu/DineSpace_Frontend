import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001/",
    headers:{
        "content-Type":"application/json"
    },
    withCredentials:true
})

api.interceptors.request.use((config) => {
if (typeof window !== "undefined") {
const token = localStorage.getItem("accesstoken");
// console.log("token"+token)
if (token) {
config.headers.Authorization = "Bearer " + token;
}
}
return config;
});