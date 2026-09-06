import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    timeout: 10000,
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

api.interceptors.response