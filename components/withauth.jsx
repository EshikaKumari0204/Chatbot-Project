import { useEffect } from 'react';
import { useRouter } from "next/navigation"
import { jwtDecode } from 'jwt-decode';

const checktoken=(token)=>{
  if(!token){
    return true;
  }
  try{
   const decoded=jwtDecode(token);
   const currentTime=Date.now()/1000;
   return decoded.exp<currentTime;
  }
  catch(err){
return true;
  }

}
const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token || checktoken(token)) {
        router.push('/loginpage'); 
      } 
    }, [router]);
    return <WrappedComponent {...props} />;
  };
};
export default withAuth;
