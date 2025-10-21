import { NextResponse} from "next/server";
import {collection} from "@/scripts/db";
import { getembedding,getresponse } from "@/lib/apicall";
import { ratelimiter } from "@/lib/ratelimit";
 export async function POST(req){

  try{
    const ip=req.headers.get("x-forwarded-for" || "anonymous");
    const {success,remaining,reset}=await ratelimiter.limit(ip);
    if(!success){
      return new NextResponse("rate limit exceeded try again after 1 min",{status:400});
    }
  let query=(await req.text()).trim();
  if(!query){
    // console.log("no query sent ");
    return new NextResponse("query not sent",{
      status:400
    });
  }
  if(query.length<5){
    const ans=await getresponse(query);
    return new NextResponse(ans,{status:200,
      headers:{'Content-Type':"text/plain"}
    })
  }
  else{
  const queryembedding=await getembedding(query);
  //find the similar one from all data in database to get the context
  const result=await collection.find({},{sort:{$vector:queryembedding},limit:2}).toArray();
  
  const context=result.map((doc)=>doc.text.slice(0,500)).join("\n\n");
   const fullprompt=`you are a science inventions and discoveries expert assistant .use the context to answer the user question in 3-4 lines  . Context:${context} question:${query} Answer:`;
   const answer=await getresponse(fullprompt);
    if(answer){
    return new NextResponse(answer,{
      status:200,headers:{"Content-Type":"text/plain"}
    })
  }
  else{
    return new NextResponse("Error while getting the response",{
      status:500,headers:{"Content-Type":"text/plain"}
    })
  }
  }
}
  catch(err){
    console.log("error present in post route",err);
    return new NextResponse("error while getting response for your request",{status:500});
  }
 }
 //WORK FLOW 
//taken user query ->checked empty query -> get embedding for the user query->find the context from user query embedding -> created a new prompt from user query and context ->generated response by gemini api