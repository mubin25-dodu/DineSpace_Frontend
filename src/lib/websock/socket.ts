import { io } from 'socket.io-client';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is missing. Configure it before building the application.");
}

const token = typeof window !== "undefined"
    ? localStorage.getItem("accesstoken") : "";

    // console.log("socket token",token);

export const socket = io(
apiUrl,
{
auth:{token,},
autoConnect: false,
},
);