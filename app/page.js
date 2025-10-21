import Link from "next/link";

const Home=()=>{
  return (

      <div className="w-screen h-screen bg-slate-900 flex flex-col gap-9 justify-center items-center p-6 md:p-5 ">
      <div className="flex flex-col gap-2" >
      <h1 className="text-[27px] md:text-4xl text-center  text-white"> Welcome to Sci-Bot</h1>
      
    
     
     </div>
     <div className="flex gap-2">
      
     <Link href="/loginpage"><button className="border-white border-2 bg-indigo-300 px-2 py-0.5  md:px-4 md:py-3 text-white rounded-3xl">Sign Up/Login</button></Link>
     </div>    
    </div>
  )
}
export default Home;
//add login signup here so that user can move to chat up page 
