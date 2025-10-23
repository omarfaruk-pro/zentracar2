import { format } from 'date-fns';
import axios from 'axios';
import Swal from 'sweetalert2';
import  useAuth  from '../../hooks/useAuth';

export default function AddCar() {
    const {user} = useAuth();

    const handleAddCar = e =>{
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const newCar = Object.fromEntries(formData.entries());
        newCar.features = newCar.features.split(',').map(feature => feature.trim());
        const today = format(new Date(), 'dd MMM yyyy');
        newCar.dailyRentalPrice = Number(newCar.dailyRentalPrice);
        newCar.releaseDate = today;
        newCar.bookingCount = 0;
        newCar.userEmail = user.email;

        axios.post(`${import.meta.env.VITE_BASE_URL}/cars`, newCar)
        .then(res =>{
            if(res.data.insertedId){
                form.reset();
                Swal.fire({
                    title: "Good job!",
                    text: `${newCar.carName} added successfully`,
                    icon: "success",
                    timer: 3000
                  });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: error.message,
                timer: 3000
            })
        })
    }

    const inputClass =
        'mt-1 py-2 px-3 block w-full rounded-md bg-gray-700 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 border border-gray-600 text-gray-300';
    const labelClass = 'block text-sm font-medium';

    return (
        <>
            <section className='py-20 px-5'>
                <form onSubmit={handleAddCar} className="max-w-xl mx-auto p-6 bg-gray-900 dark:bg-gray-100 shadow-md rounded-lg space-y-6 text-white dark:text-gray-800">
                    <h2 className="text-2xl font-bold mb-4">Add a Car</h2>

                    <div>
                        <label className={labelClass}>Car Name</label>
                        <input type="text" name="carName" className={inputClass} required/>
                    </div>

                    <div>
                        <label className={labelClass}>Car Model</label>
                        <input type="text" name="carModel" className={inputClass} required/>
                    </div>

                    <div>
                        <label className={labelClass}>Daily Rental Price</label>
                        <input type="number" name="dailyRentalPrice" className={inputClass} required/>
                    </div>

                    <div>
                        <label className={labelClass}>Availability</label>
                        <select name="availability" className={inputClass}>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Vehicle Registration Number</label>
                        <input type="text" name="vehicleRegistrationNumber" className={inputClass} required/>
                    </div>

                    <div>
                        <label className={labelClass}>Features (GPS, AC, etc.) separate with comma</label>
                        <textarea name="features" className={inputClass}></textarea>
                    </div>

                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea name="description" className={inputClass}></textarea>
                    </div>

                    <div>
                        <label className={labelClass}>Image URL</label>
                        <input type="url" name="imageUrl" className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Location</label>
                        <input type="text" name="location" className={inputClass} />
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="btn btn-primary w-full">
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}



