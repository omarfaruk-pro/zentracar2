import { Navigate } from "react-router";
import Loading from "../component/Loading";
import useAuth from "../hooks/useAuth"

export default function PrivateRoute({children}) {
    const {user, loading} = useAuth();
    if(loading){
        return <Loading></Loading>
    }
    if(!user){
        return <Navigate to={'/login'}></Navigate>
    }
  return children;
}
