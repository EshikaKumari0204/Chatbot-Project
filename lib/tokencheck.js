import jwt from "jsonwebtoken"
const secret=process.env.JWT_SECRET
export async function  checktoken(token){
try{
 const decoded=jwt.verify(token,secret);
 return decoded;
}
catch(err){
  console.log("error during token validation ",err);
 return null;
}
}