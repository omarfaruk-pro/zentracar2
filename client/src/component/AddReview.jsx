import { useState } from "react";
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Loading from "./Loading";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function AddReview({ id, reviews, reviewLoading }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
  

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = e.target.message.value.trim();

        if (rating === 0) {
            Swal.fire({
                icon: "error",
                title: "Please select a rating",
                timer: 3000,
            })
            return;
        }
        const newReview = {
            reviewerName: user?.displayName || "Anonymous",
            reviewerPhoto: user?.photoURL || "",
            rating,
            message,
            carID: id,
            date: new Date(),
        };

        axiosSecure.post("/review", newReview).then((res) => {
            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Review submitted successfully",
                    timer: 3000
                })
            }
        })

        e.target.reset();
        setRating(0);
        setHover(null);
    };

    const checkLogin = () => {
        Swal.fire({
            icon: "error",
            title: "You need to login first",
            showCancelButton: true,
            confirmButtonText: "Login",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/login");
            }
        });
    };
    return (
        <>
            <section className="py-20">
                <div className="container">
                    <div className="grid grid-cols-5 gap-10">
                        <div className="col-span-3">
                            <div className="">
                                <h2 className="text-3xl font-bold mb-8">
                                    Users Reviews
                                </h2>
                                {
                                    reviewLoading && (
                                        <Loading></Loading>
                                    )
                                }

                                {!reviewLoading && reviews.length === 0 ? (
                                    <div className="bg-base-200 rounded-2xl shadow-md p-10 text-center flex flex-col items-center">
                                        <FaQuoteLeft className="text-5xl text-gray-400 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                                        <p className="text-gray-300">Be the first to share your experience with this car!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {reviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="bg-base-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                                            >
                                                {/* Reviewer Info */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    {review.reviewerPhoto ? (
                                                        <img
                                                            src={review.reviewerPhoto}
                                                            alt={review.reviewerName}
                                                            className="w-12 h-12 rounded-full object-cover border border-base-300"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                                                            {review.reviewerName?.[0] || "A"}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="font-semibold">{review.reviewerName}</h4>
                                                        <p className="text-sm text-gray-500">{review.date}</p>
                                                    </div>
                                                </div>

                                                <div className="flex mb-3">
                                                    {[...Array(5)].map((_, i) =>
                                                        i < review.rating ? (
                                                            <FaStar key={i} className="text-yellow-400" />
                                                        ) : (
                                                            <FaRegStar key={i} className="text-gray-400" />
                                                        )
                                                    )}
                                                </div>

                                                {/* Review Text */}
                                                <p className="text-gray-700 italic">“{review.message}”</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-2 ">
                            <div className="sticky top-10 bg-base-200 rounded-2xl p-6 shadow-lg">
                                <h2 className="text-2xl font-semibold text-center mb-4">Add a Review</h2>

                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, index) => {
                                        const currentRating = index + 1;
                                        return (
                                            <FaStar
                                                key={index}
                                                size={28}
                                                className={`cursor-pointer transition-colors ${currentRating <= (hover || rating)
                                                    ? "text-yellow-400"
                                                    : "text-gray-400"
                                                    }`}
                                                onClick={() => setRating(currentRating)}
                                                onMouseEnter={() => setHover(currentRating)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        );
                                    })}
                                </div>


                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <textarea
                                        className="textarea textarea-bordered w-full h-24"
                                        placeholder="Write your review..."
                                        name="message"
                                    ></textarea>

                                    {
                                        user ? (
                                            <button type="submit" className="btn btn-primary w-full text-white font-semibold">
                                                Submit Review
                                            </button>
                                        ) : (
                                            <button onClick={checkLogin} type="button" className="btn btn-primary w-full text-white font-semibold">
                                                Login
                                            </button>
                                        )
                                    }



                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
