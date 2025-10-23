import { Link } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";
import Lottie from "lottie-react";
import notFound from "../../assets/lottie-animation/error.json"

export default function NotFound() {
    return (
        <section>
            <div className="max-w-3xl mx-auto min-h-screen flex justify-center items-center py-10">
                <div>
                    <Link to={'/'} className='btn btn-primary mb-2'><FaArrowLeftLong /> Go Home</Link>
                    <Lottie animationData={notFound} loop={true} className="bg-gray-50 rounded-xl"/>
                </div>
            </div>
        </section>
    )
}
