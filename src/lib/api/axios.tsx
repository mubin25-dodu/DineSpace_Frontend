import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is missing. Configure it before building the application.");
}

export const api = axios.create({
    baseURL: apiUrl,
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