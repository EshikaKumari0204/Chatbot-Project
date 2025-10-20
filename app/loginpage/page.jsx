"use client";
import { useState } from "react";
const loginpage=()=>{
  const [username,setusername]=useState("");
const [pass,setpass]=useState("");
const [signup,setsignup]=useState(false);
const[mess,setmess]=useState("");
async function handlesubmit(e){
e.preventDefault();
const url=signup?"/api/auth/signup":"/api/auth/login";
try{
const res=await fetch(url,
  {method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username,password:pass})
  }
);
const data=await res.json();
if(res.ok){
  setmess(data.message);
  if(!signup && data.token ){
    localStorage.setItem("token",data.token);
    window.location.href='/chatbox';
  }
  else{
    window.location.href='/loginpage';
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
    <h1 className="text-5xl m-4" >{signup?" Sign Up":" Login "}</h1>
    <form onSubmit={handlesubmit} className="flex flex-col text-2xl gap-2 justify-center items-center" >
      <input type="text" name="username" value={username} onChange={(e)=>setusername(e.target.value)} placeholder="enter your username" className="border-1 m-2 rounded-2xl p-2 text-[18px]" />
      <input type="password" name="password" value={pass} onChange={(e)=>setpass(e.target.value)} placeholder="enter your password"  className="border-1 m-2 rounded-2xl p-2 text-[18px]"/>
      <button type="submit" className="border-1 px-2 py-1 rounded-2xl bg-gray-400 w-fit text-[20px]">{signup?"Sign Up":"Login"}</button>
      <p>{signup?"Login to your account  ":"Don't have an account? "}<button type="button" className="border-1 px-3 py-1 rounded-2xl ml-0.5 bg-gray-400 w-fit text-[20px]" onClick={()=>{setsignup(!signup);setmess("");setusername("");setpass("");}}>{signup?"Login":"Sign Up"}</button></p>
    {mess &&   <p className="mt-7 text-amber-200">{mess}</p>}
    </form>
  </div>
)
}
export default loginpage;