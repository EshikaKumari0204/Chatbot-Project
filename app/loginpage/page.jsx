"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const loginpage=()=>{
  const router=useRouter();
  const [loading,setloading]=useState(false);
  const [username,setusername]=useState("");
const [pass,setpass]=useState("");
const [signup,setsignup]=useState(false);
const[mess,setmess]=useState("");

async function handlesubmit(e){
e.preventDefault();
const url=signup?"/api/auth/signup":"/api/auth/login";
setloading(true);
try{
const res=await fetch(url,
  {method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username,password:pass})
  }
);
const data=await res.json();
setloading(false);
if(res.ok){
  setmess(data.message);
  if(!signup && data.token ){
    localStorage.setItem("token",data.token);
      router.push("/chatbox");
  }
}
else{
  setmess(data.error);
}
}
catch(err){
  console.log("error occured",err);
  setmess("error occured");
}
}
return (
  <div className="min-h-screen bg-slate-900 flex flex-col text-amber-50 p-10 justify-center items-center">
    <h1 className="text-3xl md:text-5xl m-4" >{signup?" Sign Up ":" Login "}</h1>
    <form onSubmit={handlesubmit} className="flex flex-col text-2xl gap-2 justify-center items-center" >
      <input type="text" name="username" value={username} onChange={(e)=>setusername(e.target.value)} placeholder="enter your username" className="border-1 m-2 rounded-2xl p-2 text-[12px] md:text-[18px]" />
      <input type="password" name="password" value={pass} onChange={(e)=>setpass(e.target.value)} placeholder="enter your password"  className="border-1 m-2 rounded-2xl p-2 text-[12px] md:text-[18px]"/>
      <button type="submit" className="border-1 px-2 py-1 rounded-2xl bg-gray-400 w-fit text-[12px] md:text-[16px]">{signup?"Sign Up":"Login"}</button>
      <p className="text-[16px] md:text-2xl text-center">{signup?"Login to your account  ":"Don't have an account? "}<br/><button type="button" className="border-1 px-2 py-1   rounded-2xl bg-gray-400 w-fit text-[12px] md:text-[16px] mt-3" onClick={()=>{setsignup(!signup);setmess("");setusername("");setpass("");}}>{signup?"Login":"Sign Up"}</button></p>
   
   {loading && <div className="flex justify-between items-center m-4"><div className="animate-spin rounded-full h-10 w-10 border-t-2 vorder-b-2 border-b-white"></div></div>}
    {mess &&   <p className="mt-7 text-amber-200 text-center text-[16px] md:text-[24px]">{mess}</p>}

    </form>
  </div>
)
}
export default loginpage;