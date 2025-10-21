"use client"
import ReactMarkdown from 'react-markdown'
import { useState } from "react";
import { useEffect,useRef } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withauth';
const chatbox=()=>{
  const router=useRouter();
  const [load,setload]=useState(false);
  const [message,setmessage]=useState("");
  const [chats,setchats]=useState([]);
  const [token,settoken]=useState(null);
  const  lastmess=useRef(null);
  //check the token 
  useEffect(()=>{
const  usertoken=localStorage.getItem("token");
if(usertoken){
 settoken(usertoken);
}
 },[]);
  useEffect(()=>{
    lastmess.current?.scrollIntoView({behaviour:"smooth"});
  },[chats]);
  const handlelogout=()=>{
localStorage.removeItem("token");
  // window.location.href="/loginpage" ;
router.push("/loginpage");
}
  if(!token){
    return <div className='flex justify-center items-center min-h-screen bg-slate-800 p-10 text-amber-50'>Authenticating</div> }
  const getreply=async()=>{
    if(!message.trim()){
      return ;
    }
    const  newchat={sender:"user",text:message};
    setchats((prev)=>[...prev,newchat]);
  setload(true);
  //fetch response by api call to gemini for enetered query 
  try{
    const reply=await fetch("/api/chat",{
    method:"POST",
    headers:{
      "Content-Type":"text/plain"
    },
    body:message
  })
  const response=await reply.text();
  const botreply={sender:"bot",text:response};
  setchats((prev)=>[...prev,botreply]);
   setmessage("");
}catch(err){
  console.log("Error while response ",err);
  setchats((prev)=>[...prev,{sender:"bot",text:"error getting your response"}])
}
finally{
  setload(false);}}
return (
  <div className=" flex flex-col  min-h-screen bg-slate-800  p-3 md:p-10">
  <div className="flex justify-between p-4 items-center gap-7 md:gap-5">  <h1 className="text-white text-2xl md:text-5xl  text-center font-bold">Welcome to CrickBot </h1><button className="bg-indigo-100 hover:bg-amber-200 rounded-2xl w-20 px-1.5 py-1.5 text-[12px] text-gray-700  md:text-[16px] md:px-3 md:py-1.5  disabled:bg-gray-50" onClick={handlelogout}>Logout</button>
   </div>
    <div className="flex-1 flex flex-col overflow-y-auto space-y-3 px-4 py-2 gap-3 md:gap-5 md:text-[16px] text-[12px]">
     {chats.map((msg,i)=>(<div className={`md:p-2 px-2 py-1.5 font-bold text-black max-w-[95%] md:max-w-[75%] border-2 rounded-2xl w-fit ${msg.sender==="user"?"bg-indigo-100":"bg-amber-100 "}`} key={i}><ReactMarkdown>{msg.text}</ReactMarkdown></div>))}
     {load && (<div className="text-white">Getting your response...</div>)}
     <div ref={lastmess}></div>
    </div>
    <div className='border-t border-slate-700 p-2  sticky bottom-0'>
    <div className="flex gap:1 md:gap-2 justify-start items-center">
    <input type="text" className="w-96 h-8 border-1 m-2 rounded-2xl px-1 border-white text-white"name="message" value={message} placeholder="enter your query" onChange={(e)=>setmessage(e.target.value)}/>
    <button className="bg-indigo-100 hover:bg-amber-200 rounded-2xl text-[12px] md:text-[16px] w-20 px-2 py-1 md:px-1 md:py-1 disabled:bg-gray-50 " onClick={getreply} disabled={load}>Send</button></div>
   
    </div></div>)}
export default withAuth(chatbox);
//react markdown for getting the response in proper html format