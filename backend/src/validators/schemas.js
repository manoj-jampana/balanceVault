import {z} from "zod";
export const registerSchema=z.object({fullName:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(12).max(128)});
export const loginSchema=z.object({email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(1).max(128)});
export const accountSchema=z.object({name:z.string().trim().min(2).max(80),currency:z.string().length(3).default("INR")});
export const reviewSchema=z.object({decision:z.enum(["APPROVED","REJECTED"]),reviewNote:z.string().trim().max(500).optional()});
