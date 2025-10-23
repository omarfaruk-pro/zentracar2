import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import Loading from "../../component/Loading";
import Swal from "sweetalert2";

export default function ManageBooking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        axios(`${import.meta.env.VITE_BASE_URL}/bookings/${id}`).then((res) => {
            setBookings(res.data);
            setLoading(false);
        });
    }, [id])

    const handleStatus = (e, book) => {
        e.preventDefault();
        const status = e.target.value;
        axios.patch(`${import.meta.env.VITE_BASE_URL}/booking/${book._id}`, { status }).then(res => {
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: `${book.carName} booking is ${status}`,
                    timer: 3000
                })
                book.status = status;
            }
        })
    }


    return (
        <>
            <section className="py-20 min-h-[60vh]">
                <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl px-5 mx-auto">
                    <h2 className="text-center text-4xl font-bold pb-5">Booking Details</h2>
                    <div className="overflow-x-auto">
                        <div className="min-w-5xl">
                            {
                                loading ? (
                                    <Loading></Loading>
                                ) : (
                                    <table className="table ">
                                        <thead>
                                            <tr>
                                                <th>NO.</th>
                                                <th>Car Details</th>
                                                <th>Booking Details</th>
                                                <th>Price</th>
                                                <th>Booking Date</th>
                                                <th >Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                bookings.length < 1 ? (
                                                    <tr>
                                                        <td colSpan={7} className="text-center text-lg">No Bookings Found</td>
                                                    </tr>
                                                ) : (
                                                    bookings.map((book, index) => (
                                                        <tr key={index}>
                                                            <th> {index + 1}</th>
                                                            <td>
                                                                <div className="flex gap-4 items-center">
                                                                    <div>
                                                                        <img className="w-25 h-25 aspect-square object-cover rounded-sm" src={book.imageUrl} alt={book.carName} />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-semibold">{book.carName}</h3>
                                                                        <p>{book.carModel}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <h3 className="text-xl font-semibold">{book.userName}</h3>
                                                                <p>{book.userEmail}</p>
                                                            </td>
                                                            <td>
                                                                <span className="text-lg font-semibold text-white dark:text-gray-800 uppercase">${book.dailyRentalPrice}/day</span>
                                                            </td>
                                                            <td>
                                                                <p>{book.bookingStartDate} {book.bookingTime} <br /> TO {book.bookingEndDate}</p>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <select onChange={(e) => handleStatus(e, book)} name="status" defaultValue={book.status} className="select select-bordered w-full max-w-xs focus:outline-0">
                                                                        <option value="Pending">Pending</option>
                                                                        <option value="Confirm">Confirm</option>
                                                                        <option value="Cancel">Cancel</option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }



                                        </tbody>
                                    </table>
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
