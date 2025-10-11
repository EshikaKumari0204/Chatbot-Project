//post request for every prompt
//prompt sent to getresponse function to get reply from gemini
//response sent to client
import { NextResponse} from "next/server";
 import { getresponse} from "@/lib/apicall";
 export async function POST(req){
  //get the requested query
  try{
    
  let query=(await req.text()).trim();
  //check empty query
  if(!query){
    console.log("no query sent ");
    return new NextResponse("query not sent",{
      status:400
      
    });
  }
  //get the response for the query 
    const reply=await getresponse(query);
    if(reply){
    return new NextResponse(reply,{
      status:200,headers:{"Content-Type":"text/plain"}
    })
  }
  else{
    return new NextResponse("Error while getting the response",{
      status:500,headers:{"Content-Type":"text/plain"}
    })
  }
  }
  catch(err){
    console.log("error present in post route",err);
    return new NextResponse("error while getting response for your request",{status:500});
  }
 }
 //just simply use NextResponse.json if plain text is creating any problem
 
