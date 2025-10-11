"use client"
import ReactMarkdown from 'react-markdown'
import { useState } from "react";
import Loader from '@/components/loader';
const chatbox=()=>{
  const [load,setload]=useState(false);
  const [message,setmessage]=useState("");
  const [getans,setans]=useState("");
  //get reply from ai
  const getreply=async()=>{
    if(!message.trim()){
      return ;
    }
  //make api call 
  setload(true);
  setans("");
  try{const reply=await fetch("/api/chat",{
    method:"POST",
    headers:{
      "Content-Type":"text/plain"
    },
    body:message
  })
  const response=await reply.text();
  //set the response
  setans(response);
   setmessage("");
}catch(err){
  console.log("Error while fetching ",err);
  setans("something went wrong");
}
finally{
  setload(false);
}
}
return (
  <div> 
    <input type="text" className="w-96 h-8 border-1 m-2"name="message" value={message} placeholder="enter your query" onChange={(e)=>setmessage(e.target.value)}/>
    <button onClick={getreply}>Send</button>
    {load?(<div className="flex justify-center items-center h-20"><Loader></Loader></div>): (<div className="w-96 h-auto border-1 m-2"><ReactMarkdown>{getans}</ReactMarkdown></div>)}
  </div>)}
export default chatbox;
//react markdown for getting the response in proper html format