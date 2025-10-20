import { NextResponse} from "next/server";
import {collection} from "@/scripts/db";
import { getembedding,getresponse } from "@/lib/apicall";
 export async function POST(req){
  //get the requested query
  try{
  let query=(await req.text()).trim();
  //check empty query
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
  //get embedding for user query
  else{
  const queryembedding=await getembedding(query);
  //find the similar one from all data in database to get the context
  const result=await collection.find({},{sort:{$vector:queryembedding},limit:2}).toArray();
  
  const context=result.map((doc)=>doc.text.slice(0,500)).join("\n\n");
   const fullprompt=`you are a cricket expert assistant .use the context to answer the user question Context:${context} question:${query} Answer:`;
   //generate  reponse by combining context and your main query
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