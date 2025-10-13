"use client"
import ReactMarkdown from 'react-markdown'
import { useState } from "react";

const chatbox=()=>{
  const [load,setload]=useState(false);
  const [message,setmessage]=useState("");
  // const [getans,setans]=useState("");
  const [chats,setchats]=useState([]);
  //get reply from ai
  const getreply=async()=>{
    if(!message.trim()){
      return ;
    }
    //add the enterd query to the chat 
    const  newchat={sender:"user",text:message};
    setchats((prev)=>[...prev,newchat]);
 
  setload(true);
  //make api call 
  try{
    const reply=await fetch("/api/chat",{
    method:"POST",
    headers:{
      "Content-Type":"text/plain"
    },
    body:message
  })
  const response=await reply.text();
  //set the response
 
  const botreply={sender:"bot",text:response};
  
  setchats((prev)=>[...prev,botreply]);
   setmessage("");
}catch(err){
  console.log("Error while fetching ",err);
  setchats((prev)=>[...prev,{sender:"bot",text:"error getting response"}])
  // setans("something went wrong");
}
finally{
  setload(false);
}
}
return (
  <div className="flex flex-col min-h-screen bg-slate-800 p-10">
    
    <h1 className="text-white text-3xl md:text-5xl p-4 text-center mb-8">Welcome to Rag Chatbot </h1> 
    <div className="flex gap-2 justify-center items-center">
    <input type="text" className="w-96 h-8 border-1 m-2 rounded-2xl px-1 border-white text-white"name="message" value={message} placeholder="enter your query" onChange={(e)=>setmessage(e.target.value)}/>
    <button className="bg-indigo-100 rounded-2xl w-20  px-3  "onClick={getreply} disabled={load}>Send</button></div>
    <div className="flex flex-col m-5 gap-5">
     {chats.map((msg,i)=>(<div className={`p-2 font-bold text-black max-w-[90%] md:max-w-[75%] border-2 rounded-2xl w-fit ${msg.sender==="user"?"bg-indigo-100":"bg-amber-100 "}`} key={i}><ReactMarkdown>{msg.text}</ReactMarkdown></div>))}
     {load && (<div className="text-white">Getting your response...</div>)}
    </div>
  
    
  </div>)}
export default chatbox;
//react markdown for getting the response in proper html format