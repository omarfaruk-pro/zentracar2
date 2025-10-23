import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { MdOutlineTouchApp } from 'react-icons/md';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <section className="py-20 px-4 bg-gray-900 dark:bg-gray-200">
            <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto grid md:grid-cols-2 items-center gap-10">
                <div className=" lg:pr-10">
                    <div className="relative">
                        <motion.img animate={{ y: [-60, 0, -60] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            src="https://demo.awaikenthemes.com/novaride/wp-content/uploads/2024/08/about-img-1.jpg"
                            alt="Customer"
                            className="max-w-80 w-full max-h-100 object-cover rounded-[100px]"
                        />
                        <motion.img animate={{ x: [0, -60, 0] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            src="https://demo.awaikenthemes.com/novaride/wp-content/uploads/2024/08/about-img-2.jpg"
                            alt="Car Rental"
                            className="max-w-70 h-90 w-full object-cover absolute -bottom-10 right-0 rounded-[100px]"
                        />
                    </div>
                </div>

                <div className="mt-10 md:mt-0">
                    <p className=" font-semibold flex items-center gap-2 mb-2">
                        <span className="text-2xl text-red-500">*</span> About Us
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold dark:text-gray-800 text-white mb-4">
                        Your trusted partner in reliable car rental
                    </h2>
                    <p className="dark:text-gray-600 text-gray-300 mb-6">
                        Aqestic Optio Amet A Ququam Saepe Aliquid Voluate Dicta Fuga Dolor Saerror Sed
                        Earum A Magni Soluta Quam Minus Dolor Dolor
                    </p>


                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl bg-red-100 dark:bg-red-200 text-primary p-3 rounded-full">
                                <MdOutlineTouchApp />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Easy Booking Process</h4>
                                <p className="text-sm dark:text-gray-600 text-gray-400">
                                    We Have Optimized The Booking Process So That Our Clients Can
                                    Experience The Easiest And The Safest Service
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="text-3xl bg-red-100 dark:bg-red-200 text-primary p-3 rounded-full">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Convenient Pick-Up & Return Process</h4>
                                <p className="text-sm dark:text-gray-600 text-gray-400">
                                    We Have Optimized The Booking Process So That Our Clients Can
                                    Experience The Easiest And The Safest Service
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Us Button */}
                    <button className="mt-8 btn btn-primary rounded-full px-6">
                        Contact Us <FaArrowRight className="ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}
