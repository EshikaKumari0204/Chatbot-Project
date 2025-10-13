import Link from "next/link";

const Home=()=>{
  return (

      <div className="w-screen h-screen bg-slate-900 flex flex-col gap-9 justify-center items-center p-5 ">
      <div className="flex flex-col gap-2" >
      <h1 className="text-3xl md:text-4xl text-center  text-white">Hey welcome to Rag Chatbot</h1>
      {/* <h2 className="text-3xl md:text-4xl text-center  text-white">Ask Anything !!</h2> */}
    
      <h2 className="text-2xl text-center text-white">Sign up or Login  </h2>
     </div>
     <div className="flex gap-2">
      <Link href="#"><button className="border-white border-2 bg-indigo-300  px-5 py-2.5 text-white rounded-3xl">Login</button></Link>
     <Link href="#"><button className="border-white border-2 bg-indigo-300  px-4 py-2.5 text-white rounded-3xl">Sign Up</button></Link>
     </div>    
    </div>
  )
}
export default Home;
//add login signup here so that user can move to chat up page 
