import {z} from 'zod'

export const loginSchema =  z.object({
    email: z.string().email("Imvalid Email"),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/ ,"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number")
});
export type loginForm = z.infer<typeof loginSchema>

export const verifyemailSchema =  z.object({
    email: z.string().email("Imvalid Email"),
});
export type verifyemailSchema = z.infer<typeof verifyemailSchema>

export const registerSchema =  z.object({
    email: z.string().email("Imvalid Email"),
    resturantemail:z.string().email("Invalid Email"),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/ ,"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"),
    cpass: z.string().min(1, "Confirm password is required"),
    resturantName:z.string().min(2 ,"length Mustbe more then 2"),
    address:z.string().min(10 , 'Length Mustbe more then 10'),
    isopen:z.boolean(),
    phone:z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/ , "Invalid phone number (e.g., +8801XXXXXXXX or 01XXXXXXXX)."),
    opening:z.string().regex(/^\d{2}:\d{2}$/ , "Time must be in HH:mm format (e.g., 13:30 or 09:15)."),
    closing:z.string().regex(/^\d{2}:\d{2}$/ , "Time must be in HH:mm format (e.g., 13:30 or 09:15)."),
    payfirst:z.boolean() 
}).refine((data) => data.password === data.cpass, {
    message: "Passwords do not match",
    path: ["cpass"]
});
export type registrationForm = z.infer<typeof registerSchema>
