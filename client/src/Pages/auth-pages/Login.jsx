import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/lottie-animation/login.json"
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
export default function Login() {
  const {state} = useLocation();
  const { userLogin, googleLogin } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async(e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    await userLogin(email, password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login successful",
          timer: 3000,
        })
        e.target.reset();
        navigate(state?.from || "/");
      })
  }

  const handleGoogleLogin = () => {
    googleLogin()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login successful",
          timer: 3000,
        })
        navigate(state?.from || "/");
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: error.message,
          timer: 3000,
        })
      })
  }

    const inputClass =
        'mt-1 py-2 px-3 block w-full rounded-md bg-gray-700 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 border border-gray-600 text-gray-300';
    const labelClass = 'block text-sm font-medium';

  return (
    <>
      <section className="py-20">
        <h2 className="text-center text-4xl font-extrabold pb-5">Login</h2>
        <div className=" lg:max-w-5xl md:max-w-3xl sm:max-w-xl px-5 mx-auto grid md:grid-cols-2 items-center">
          <div>
            <form onSubmit={handleLogin}
              className="max-w-xl mx-auto p-6 bg-gray-900 dark:bg-gray-100 shadow-md rounded-lg space-y-4 text-white dark:text-gray-800"
            >

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  className={inputClass}
                  required
                />
              </div>


              <button
                type="submit"
                className="cursor-pointer block w-full text-xl bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button onClick={handleGoogleLogin} type="button" className="cursor-pointer flex justify-center items-center gap-2 rounded-md w-full text-xl py-2 bg-white text-black border-[#e5e5e5]">
                <FcGoogle></FcGoogle>
                Login with Google
              </button>
              <p>Don't have an account? <Link to="/register" className="font-semibold underline ml-1">Sign up here</Link></p>
            </form>
          </div>
          <div>
            <Lottie animationData={loginAnimation} loop={true} className="w-full" />
          </div>
        </div>
      </section>
    </>
  )
}
