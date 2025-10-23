import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser, googleLogin, logoutUser } from "../redux/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    loading,
    error,
    userRegister: (email, password) => dispatch(registerUser({ email, password })),
    userLogin: (email, password) => dispatch(loginUser({ email, password })),
    googleLogin: () => dispatch(googleLogin()),
    userLogout: () => dispatch(logoutUser())
  };
}
