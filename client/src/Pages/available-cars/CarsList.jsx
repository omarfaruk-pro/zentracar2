import { Link } from "react-router";


export default function CarsList({ car }) {
    const { availability, carModel, carName, dailyRentalPrice, imageUrl, bookingCount } = car;
    return (
        <>
            <tr className=" shadow-lg pr-5 gap-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                <td>
                    <img className="w-40 md:w-60 aspect-video object-cover rounded-sm" src={imageUrl} alt={carModel} />
                </td>
                <td className="flex-shrink-1">
                    <h2 className="text-2xl font-semibold">{carName}</h2>
                    <p>{carModel}</p>
                </td>
                <td>
                    <p>Price: ${dailyRentalPrice}/day</p>
                    <p>{bookingCount} Bookings</p>
                </td>
                <td>
                    <p>{availability}</p>
                </td>
                <td>
                    <Link to={`/car/${car._id}`} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md">
                        Book Now
                    </Link>
                </td>
            </tr>
        </>
    )
}
