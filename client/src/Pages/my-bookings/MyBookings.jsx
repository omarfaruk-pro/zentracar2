import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip } from 'react-tooltip'
import useAuth from "../../hooks/useAuth";
import Loading from "../../component/Loading";
import Swal from "sweetalert2";
import { FaXmark } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import { differenceInCalendarDays, parse } from "date-fns";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MyBookings() {
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure(`/bookings?email=${user.email}`).then((res) => {
      setMyBookings(res.data);
      setLoading(false);
    });
  }, [axiosSecure, user.email])

  const handleModalOpen = (book) => {
    setSelectedBooking(book);
    setModal(!modal);
    const parsedStartDate = parse(book.bookingStartDate, 'dd-MM-yyyy', new Date());
    setStartDate(parsedStartDate);

    const parsedEndDate = parse(book.bookingEndDate, 'dd-MM-yyyy', new Date());
    setEndDate(parsedEndDate);

    const parsedStartTime = parse(book.bookingTime, 'hh:mm a', new Date());
    setStartTime(parsedStartTime);
  }
  const handleModal = (e) => {
    if (e.target.getAttribute('data-attribute') === 'modal') {
      setModal(!modal);
    };
  }
  const updateBooking = (e, book) => {
    e.preventDefault();
    const bookingStartDate = e.target.bookingStartDate.value;
    const bookingEndDate = e.target.bookingEndDate.value;
    const bookingTime = e.target.bookingTime.value;
    axios.patch(`${import.meta.env.VITE_BASE_URL}/booking/${book._id}`, { bookingStartDate, bookingEndDate, bookingTime }).then(res => {
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Booking updated successfully",
          timer: 3000
        })
        setModal(!modal);
        book.bookingStartDate = bookingStartDate;
        book.bookingEndDate = bookingEndDate;
        book.bookingTime = bookingTime;
      }
    })
  }

  const bookingDelete = (id) => {
    Swal.fire({
      title: 'Are you sure you want to cancel this booking?',
      text: "You won't be able to revert this booking!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_BASE_URL}/booking/${id}`).then(res => {
          if (res.data.deletedCount > 0) {
            const remaining = myBookings.filter(book => book._id !== id);
            setMyBookings(remaining);
          }
        })
      }
    })
  }
 
  const getTotalDays = (startStr, endStr) => {
  const format = 'dd-MM-yyyy';

  const startDate = parse(startStr, format, new Date());
  const endDate = parse(endStr, format, new Date());

  return differenceInCalendarDays(endDate, startDate) +1;
};

  return (
    <section className="py-20 min-h-[60vh]">
      <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl px-5 mx-auto">
        <h2 className="text-center text-4xl font-bold pb-5">My Bookings</h2>
        <div className="overflow-x-auto">
          <div className="min-w-5xl">
            <table className="table border-separate border-spacing-y-5 max-w-5xl mx-auto">

              <thead>
                <tr>
                  <th>Car Info</th>
                  <th>Booking Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr><td colSpan={5} className="text-center text-white text-lg"><Loading></Loading></td></tr>
                  ) : (
                    myBookings.length > 0 ? (
                      myBookings.map((book) => (
                        <tr key={book._id} className="shadow-lg bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl duration-200">
                          <td>
                            <div className="flex gap-2 items-center">
                              <div>
                                <img className="w-30 md:w-50 h-16 md:h-30 aspect-square object-cover rounded-sm" src={book.imageUrl} alt={book.carName} />
                              </div>
                              <div>
                                <h2 className="text-lg md:text-2xl font-semibold">{book.carName}</h2>
                                <p>{book.carModel}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <span className="flex gap-2 items-center justify-between mb-1">Start: {book.bookingStartDate} <span>{book.bookingTime}</span></span>
                              <span className="flex gap-2 items-center justify-between">End: {book.bookingEndDate}
                                <button onClick={() => handleModalOpen(book)} data-tooltip-id="modify" data-tooltip-content="Modify Date" type="button" className="btn btn-primary btn-sm text-base"><FaCalendarAlt /></button>
                                <Tooltip id="modify" />
                              </span>

                            </div>
                          </td>
                          <td>
                            <p><span className="text-sm">
                              Total: ${book.dailyRentalPrice * getTotalDays(book.bookingStartDate, book.bookingEndDate)}
                            </span></p>
                          </td>
                          <td>
                            <p>{book.status || 'Pending'}</p>
                          </td>
                          <td>
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => bookingDelete(book._id)} data-tooltip-id="delete" data-tooltip-content="Cancel Booking" type="button" className="btn bg-white text-red-950 btn-sm text-base"><MdDeleteForever /></button>
                              <Tooltip id="delete" />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan='5' className="text-center font-semibold text-lg">No data found</td></tr>
                    )
                  )
                }

              </tbody>
            </table>
            {
              selectedBooking && (

                <div data-attribute="modal" onClick={(e) => handleModal(e)} className={`h-screen w-screen bg-[#000000a5] fixed top-0 left-0 flex justify-center items-center z-20 py-10 duration-300 ease-linear ${modal ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                  <div className="bg-white p-5 rounded-xl max-w-lg w-full text-gray-800 dark:text-white relative overflow-y-auto max-h-full">
                    <div><button onClick={() => setModal(!modal)} className="cursor-pointer absolute top-3 right-2 p-2 bg-primary text-white text-xl rounded-full"><FaXmark /></button></div>
                    <div>
                      <img className="w-full h-50 object-cover mb-5" src={selectedBooking.imageUrl} alt="" />
                      <h2 className="text-lg font-medium text-center">Update Date and Time for {selectedBooking.carName}</h2>

                      <form onSubmit={(e) => updateBooking(e, selectedBooking)} className="mt-5">
                        <div className="flex gap-2">
                          <div className="w-full">
                            <label className="block text-sm font-medium">Booking Start Date</label>
                            <DatePicker
                              name="bookingStartDate"
                              minDate={startDate}
                              selected={startDate}
                              onChange={(date) => setStartDate(date)} dateFormat="dd-MM-yyyy" wrapperClassName="w-full"
                              required
                              className="mt-1 py-2 px-3 block w-full rounded-md bg-gray-800 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" />
                          </div>

                          <div className="w-full">
                            <label className="block text-sm font-medium">Booking End Date</label>
                            <DatePicker
                              name="bookingEndDate"
                              minDate={startDate}
                              selected={endDate}
                              onChange={(date) => setEndDate(date)} dateFormat="dd-MM-yyyy" wrapperClassName="w-full"
                              required
                              className="mt-1 py-2 px-3 block w-full rounded-md bg-gray-800 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                        </div>

                        <div className="flex gap-2 items-end">
                          <div className="w-full">
                            <label className="block text-sm font-medium">Booking Time</label>
                            <DatePicker
                              selected={startTime}
                              onChange={(time) => setStartTime(time)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              placeholderText="Select booking time"
                              wrapperClassName="w-full"
                              name="bookingTime"
                              required
                              className="mt-1 py-2 px-3 block w-full rounded-md bg-gray-800 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="text-center w-full">
                            <button type="submit" className="btn btn-primary mt-3 w-full">Confirm Update</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}
