"use client"
import ReactMarkdown from 'react-markdown'
import { useState } from "react";
import { useEffect } from 'react';
import { checktoken } from '@/lib/tokencheck';
const chatbox=()=>{
  const [load,setload]=useState(false);
  const [message,setmessage]=useState("");
  const [chats,setchats]=useState([]);
  const [token,settoken]=useState(null);
  //check the token 
  useEffect(()=>{
const  usertoken=localStorage.getItem("token");
console.log("token received from ls",usertoken);
//emoty or expired token
if(!usertoken || !checktoken(usertoken)){
  localStorage.removeItem("token");
  window.location.href="/loginpage"}
else{
  settoken(usertoken);}},[]);
  const handlelogout=()=>{
localStorage.removeItem("token");
  window.location.href="/loginpage" ;}
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
  <div className="flex flex-col min-h-screen bg-slate-800 p-10">
  <div className="flex justify-between p-4 items-center gap-5">  <h1 className="text-white text-3xl md:text-5xl p-4 text-center mb-8 ">Welcome to CrickBot </h1><button className="bg-indigo-100 rounded-2xl w-20   disabled:bg-gray-50" onClick={handlelogout}>Logout</button>
   </div>
    <div className="flex gap-2 justify-center items-center">
    <input type="text" className="w-96 h-8 border-1 m-2 rounded-2xl px-1 border-white text-white"name="message" value={message} placeholder="enter your query" onChange={(e)=>setmessage(e.target.value)}/>
    <button className="bg-indigo-100 rounded-2xl w-20  px-3 py-1.5 disabled:bg-gray-50 " onClick={getreply} disabled={load}>Send</button></div>
    <div className="flex flex-col m-5 gap-5">
     {chats.map((msg,i)=>(<div className={`p-2 font-bold text-black max-w-[90%] md:max-w-[75%] border-2 rounded-2xl w-fit ${msg.sender==="user"?"bg-indigo-100":"bg-amber-100 "}`} key={i}><ReactMarkdown>{msg.text}</ReactMarkdown></div>))}
     {load && (<div className="text-white">Getting your response...</div>)}
    </div>
  </div>)}
export default chatbox;
//react markdown for getting the response in proper html format