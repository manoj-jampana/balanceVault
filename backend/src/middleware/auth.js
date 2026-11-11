import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
export async function requireAuth(req,res,next){try{const [scheme,token]=(req.headers.authorization||"").split(" ");if(scheme!=="Bearer"||!token)return res.status(401).json({error:"Authentication required"});const p=jwt.verify(token,env.JWT_ACCESS_SECRET,{algorithms:["HS256"],issuer:"balancevault"});const user=await prisma.user.findUnique({where:{id:p.sub},select:{id:true,email:true,fullName:true,role:true,onboardingStatus:true}});if(!user)return res.status(401).json({error:"Invalid session"});req.user=user;next();}catch{return res.status(401).json({error:"Invalid or expired access token"});}}
export const requireRole=(...roles)=>(req,res,next)=>{if(!req.user||!roles.includes(req.user.role))return res.status(403).json({error:"Forbidden"});next();};
export function requireApproved(req,res,next){if(req.user.role!=="ADMIN"&&req.user.onboardingStatus!=="APPROVED")return res.status(403).json({error:"Onboarding approval required"});next();}
