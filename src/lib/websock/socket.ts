import { io } from 'socket.io-client';

const token = typeof window !== "undefined"
    ? localStorage.getItem("accesstoken") : "";

    // console.log("socket token",token);

export const socket = io('http://localhost:3001',{
    auth:{token,},
    autoConnect: false,
}); 