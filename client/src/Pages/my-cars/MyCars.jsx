import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../component/Loading";
import Swal from "sweetalert2";
import { FaXmark } from "react-icons/fa6";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MyCars() {
  const [isloading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [myCar, setMyCar] = useState([]);
  const [modal, setModal] = useState(false);
  const [updateCar, setUpdateCar] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure(`/myCars?email=${user.email}`)
      .then((data) => {
        setMyCar(data.data);
        setIsLoading(false);
      });
  }, [axiosSecure, user.email]);

  const handleModal = (e) => {
    if (e.target.getAttribute('data-attribute') === 'modal') {
      setModal(!modal);
    }
  }

  const handleModalOpen = (car) => {
    setUpdateCar(car);
    setModal(!modal);
  }

  const handleUpdateCar = (e, updatedCar) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const car = Object.fromEntries(formData.entries());
    car.features = car.features.split(',').map(feature => feature.trim());
    axios.put(`${import.meta.env.VITE_BASE_URL}/car/${updatedCar._id}`, car)
      .then(res => {
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: `${updatedCar.carName} updated successfully`,
            timer: 3000
          })
          updatedCar.carModel = car.carModel;
          updatedCar.dailyRentalPrice = car.dailyRentalPrice;
          updatedCar.availability = car.availability;
          updatedCar.vehicleRegistrationNumber = car.vehicleRegistrationNumber;
          updatedCar.features = car.features;
          updateCar.description = car.description;
          updatedCar.imageUrl = car.imageUrl;
          updatedCar.location = car.location;
          setModal(!modal);
        }
      })
  }
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_BASE_URL}/car/${id}`)
          .then(data => {
            if (data.data.deletedCount > 0) {
              const remaining = myCar.filter(car => car._id !== id);
              setMyCar(remaining);
              Swal.fire({
                icon: "success",
                title: "Deleted Successfully",
                timer: 3000
              })
            }
          })
      }
    })

  }

  const inputClass =
    'mt-1 py-2 px-3 block w-full rounded-md bg-gray-700 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 border border-gray-600 text-gray-300';
  const labelClass = 'block text-sm font-medium';
  return (
    <>
      <section className="py-20 min-h-[60vh]">
        <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl px-5 mx-auto">
          <h2 className="text-center text-4xl font-bold pb-5">My Added Cars</h2>
          <div className="overflow-x-auto">
            <div className="min-w-5xl">
              {
                isloading ? (
                  <Loading></Loading>
                ) : (
                  <table className="table ">
                    <thead>
                      <tr>
                        <th>NO.</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Added Date</th>
                        <th>Availability</th>
                        <th>Booking</th>
                        <th >Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        myCar.length < 1 ? (
                          <tr>
                            <td colSpan={7} className="text-center text-lg">You have not added any car yet. Go to <Link to="/add-car" className="text-blue-600 underline font-bold">ADD CAR</Link> page</td>
                          </tr>
                        ) : (
                          myCar.map((car, index) => (
                            <tr key={index}>
                              <th> {index + 1}</th>
                              <td>
                                <div className="flex gap-4 items-center">
                                  <div>
                                    <img className="w-25 h-25 aspect-square object-cover rounded-sm" src={car.imageUrl} alt={car.carName} />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold">{car.carName}</h3>
                                    <p>{car.carModel}</p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="text-lg font-semibold text-white dark:text-gray-800 uppercase">${car.dailyRentalPrice}/day</span>
                              </td>
                              <td>
                                <p>{car.releaseDate}</p>
                              </td>
                              <td>
                                <p>{car.availability}</p>
                              </td>
                              <td>
                                <p>{car.bookingCount}</p>
                              </td>
                              <td>
                                <div className="flex gap-2">
                                  <Link to={`/manage-booking/${car._id}`} data-tooltip-id="view" data-tooltip-content="View Booking" type="button" className="btn bg-white text-gray-950 btn-sm text-base"><FaRegEye /></Link>

                                  <button type="button" onClick={() => handleModalOpen(car)} className="btn btn-sm btn-neutral text-base"><FaEdit /></button>
                                  <button onClick={() => handleDelete(car._id, car.carName)} type="button" className="btn btn-primary btn-sm text-base"><MdDeleteForever /></button>
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
          {
            updateCar && (

              <div data-attribute="modal" onClick={(e) => handleModal(e)} className={`h-screen w-screen bg-[#000000a5] fixed top-0 left-0 flex justify-center items-center z-20 py-10 duration-300 ease-linear ${modal ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="bg-white p-5 rounded-xl max-w-lg w-full text-gray-800 dark:text-white relative overflow-y-auto max-h-full">
                  <div><button onClick={() => setModal(!modal)} className="cursor-pointer absolute top-3 right-2 p-2 bg-primary text-white text-xl rounded-full"><FaXmark /></button></div>
                  <div>
                    <form onSubmit={(e) => handleUpdateCar(e, updateCar)} className="max-w-xl mx-auto p-6 bg-gray-900 dark:bg-gray-100 shadow-md rounded-lg space-y-6 text-white dark:text-gray-800">
                      <h2 className="text-2xl font-bold mb-4">Update {updateCar.carName}</h2>

                      <div>
                        <label className={labelClass}>Car Name</label>
                        <input type="text" name="carName" defaultValue={updateCar.carName} className={inputClass} readOnly />
                      </div>

                      <div>
                        <label className={labelClass}>Car Model</label>
                        <input type="text" name="carModel" defaultValue={updateCar.carModel} className={inputClass} required />
                      </div>

                      <div>
                        <label className={labelClass}>Daily Rental Price</label>
                        <input type="number" name="dailyRentalPrice" defaultValue={updateCar.dailyRentalPrice} className={inputClass} required />
                      </div>

                      <div>
                        <label className={labelClass}>Availability</label>
                        <select name="availability" defaultValue={updateCar.availability} className={inputClass}>
                          <option value="Available">Available</option>
                          <option value="Unavailable">Unavailable</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Vehicle Registration Number</label>
                        <input type="text" name="vehicleRegistrationNumber" defaultValue={updateCar.vehicleRegistrationNumber} className={inputClass} required />
                      </div>

                      <div>
                        <label className={labelClass}>Features (GPS, AC, etc.) separate with comma</label>
                        <textarea name="features" defaultValue={updateCar.features} className={inputClass}></textarea>
                      </div>

                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea name="description" defaultValue={updateCar.description} className={inputClass}></textarea>
                      </div>

                      <div>
                        <label className={labelClass}>Image URL</label>
                        <input type="url" name="imageUrl" defaultValue={updateCar.imageUrl} className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Location</label>
                        <input type="text" name="location" defaultValue={updateCar.location} className={inputClass} />
                      </div>

                      <div className="mt-6">
                        <button type="submit" className="btn btn-primary w-full">
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </section>
    </>
  )
}
