
import { differenceInDays, parse } from 'date-fns';
import { Link, useLocation } from 'react-router';

export default function CarsGrid({ car }) {

    const {pathname} = useLocation();
    const getDaysAgo = (releaseDateStr) => {
        const parsedDate = parse(releaseDateStr, 'dd MMM yyyy', new Date());
        const today = new Date();
        const daysAgo = differenceInDays(today, parsedDate);

        return daysAgo;
    };
    const { availability, carModel, carName, dailyRentalPrice, imageUrl, bookingCount, releaseDate } = car;
    return (
        <>
            <div className="flex flex-col justify-between bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl shadow-lg group hover:shadow-2xl duration-300 ease-in-out">
                <div className="space-y-4">
                    <div className='overflow-hidden relative'>
                        <div className='overflow-hidden rounded-t-xl'>
                            <img className='w-full aspect-[5/3] object-cover rounded-t-xl group-hover:scale-110 duration-500' src={imageUrl} alt={carModel} />
                        </div>
                        <span className='absolute min-w-35 transform translate-x-[38px] translate-y-[24px] rotate-45 top-0 text-center right-2 bg-green-500 text-white text-sm px-3 py-1 '>{availability}</span>
                    </div>
                    <div className='px-4 pb-4'>
                        <div className="flex justify-between">
                            {
                                getDaysAgo(releaseDate)==0?(<p>Posted Today</p>):(<p>{getDaysAgo(releaseDate)} Days Ago</p>)
                            }
                            <p>{bookingCount} Bookings</p>
                        </div>
                        <h2 className="text-xl font-bold">{carName}</h2>
                        <p ><strong>{carModel}</strong></p>
                    </div>
                </div>


                <div className="border-t border-gray-700 dark:border-gray-300 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-lg">Price: ${dailyRentalPrice}/day</p>
                    </div>
                    <Link to={`/car/${car._id}`} state={pathname} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md">
                        Book Now
                    </Link>
                </div>
            </div>
        </>
    );
}
