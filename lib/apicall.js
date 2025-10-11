import {GoogleGenerativeAI} from "@google/generative-ai";
//create a ai client object
 const ai=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//create function to get the response with prompt as argument
export const getresponse=async(prompt)=>{
  try{
const result=await ai.getGenerativeModel({
  model:"gemini-2.5-flash",
  //for faster and limited response 
  generationConfig:{
    //length of response
    maxOutputTokens:512,
    temperature:0.1,
    //to ensure latency
    thinkingConfig:{
      thinkingBudget:0
    }
    
  }
  
}).generateContent(prompt);
//getting the response field of the result object sent by gemini
return result.response.text();
  }
  catch(err){
    console.log("error occur while fetching data ",err);
    return "error while getting response for your prompt";
  }
}