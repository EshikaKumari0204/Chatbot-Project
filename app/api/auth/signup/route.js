import {NextResponse} from "next/server"
import bcrypt  from "bcryptjs"
import {userscollection} from "@/scripts/db"
export  async function POST(req){
  try{
const {username,password}=await req.json();
if(!username || !password){
  return NextResponse.json({error:"please provide both username and password to signup"},{status:400})
}
const hashedpass=await bcrypt.hash(password,10);
const user={username:username,password:hashedpass};
 await userscollection.insertOne(user);
return NextResponse.json({message:"Signed up successful"},{status:200})}
catch(err){
  console.log("error while doing signup ",err);
  return NextResponse.json({error:"Signed up unsuccessful"},{status:500});
}
}
