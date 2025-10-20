import jwt from "jsonwebtoken"
const secret=process.env.JWT_SECRET
console.log("secret key is here",secret,process.env.JWT_SECRET);
export async function  checktoken(token){
try{
console.log("secret key is here",secret,process.env.JWT_SECRET);
 const decoded=jwt.verify(token,process.env.JWT_SECRET);

 console.log("decoded value",decoded);
 return decoded;
}
catch(err){
  console.log("error during token validation ",err);
 return null;
}
}