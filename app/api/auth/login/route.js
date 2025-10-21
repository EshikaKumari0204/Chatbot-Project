import { NextResponse } from "next/server";
import {userscollection} from "@/scripts/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const secret=process.env.NEXT_PUBLIC_JWT_SECRET;

export async function POST(req){
  try{
  const {username,password}=await req.json();
  if(!username || !password){
    return NextResponse.json({error:"username and password are required for login"},{status:400})
  }
  const user=await userscollection.findOne({username});
  console.log(user);
  if(!user){
    return NextResponse.json({error:"no such user found"},{status:400})
  }
  const passvalid=await bcrypt.compare(password,user.password);
  console.log("compared password",passvalid);
  if(!passvalid){
    return NextResponse.json({error:"wrong password entered"},{status:400})
  }
  const token=jwt.sign({
    username:user.username
  },secret,{expiresIn:"1d"});
 
   return NextResponse.json({message:"successful login done",token},{status:200})
}catch(err){
  console.log("login error",err);
    return NextResponse.json({error:"error while login"},{status:500})

}

}



