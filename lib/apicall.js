
import { GoogleGenerativeAI } from "@google/generative-ai";
 const ai=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const  getembedding=async(text)=>{
try{
  const model= ai.getGenerativeModel({model:"text-embedding-004"});
  const result=await model.embedContent(text);

   const ans= result.embedding.values;
   console.log(ans.length);
    // console.log(ans);
   return ans;
}
catch(err){
  console.log("error generating your embedding ",err);
  return null;
}
}
//function to get response of our prompt from gemini
export const getresponse=async(query)=>{
  try{
  const model=ai.getGenerativeModel({model:"gemini-2.5-flash"});
  const result=await model.generateContent(query);
  const response=result.response;
  return response.text() || "No response";
  }catch(err){
    console.log("error while getting your response from gemini",err);
    return "Error generating response";
  }
} 