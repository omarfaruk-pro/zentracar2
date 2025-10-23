import { createBrowserRouter } from "react-router";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../Pages/home/Home";
import AvailableCars from "../Pages/available-cars/AvailableCars";
import AddCar from "../Pages/add-car/AddCar";
import MyCars from "../Pages/my-cars/MyCars";
import MyBookings from "../Pages/my-bookings/MyBookings";
import Login from "../Pages/auth-pages/Login";
import Register from "../Pages/auth-pages/Register";
import NotFound from "../Pages/notFound/NotFound";
import ErrorPage from "../Pages/notFound/ErrorPage";
import PrivateRoute from "../private/PrivateRoute";
import CarDetails from "../Pages/car-details/CarDetails";
import ManageBooking from "../Pages/my-cars/ManageBooking";
import ChatPage from "../Pages/chat/ChatPage";
import MessengerPage from "../Pages/message/Message";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: DefaultLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'available-cars',
                Component: AvailableCars
            },
            {
                path: 'car/:id',
                Component: CarDetails
            },
            {
                path: 'add-car',
                element: <PrivateRoute><AddCar></AddCar></PrivateRoute>
            },
            {
                path: 'my-cars',
                element: <PrivateRoute><MyCars></MyCars></PrivateRoute>
            },
            {
                path: 'manage-booking/:id',
                element: <PrivateRoute><ManageBooking></ManageBooking></PrivateRoute>
            },
            {
                path: 'my-bookings',
                element: <PrivateRoute><MyBookings></MyBookings></PrivateRoute>
            },
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            },
            {

                path: "/messenger",
                element: <PrivateRoute><MessengerPage></MessengerPage></PrivateRoute>,
            },
            {
                path: 'chat/:id',
                element: <PrivateRoute><ChatPage></ChatPage></PrivateRoute>
            }
        ]
    },
    {
        path: '*',
        Component: ErrorPage
    },
    {
        path: '404',
        Component: NotFound
    }

])
