import { FaCar } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
import { PiBookmarksSimpleFill } from "react-icons/pi";
import { MdSupportAgent } from "react-icons/md";

export default function WhyChoose() {
  return (
    <>
        <section className="py-20">
            <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto px-5">
                <h2 className="text-center text-5xl font-bold">Why Choose Us</h2>
                <p className="text-center text-xl mt-2 max-w-2xl mx-auto">We go beyond just renting cars — we focus on making your experience smooth, affordable, and stress-free from start to finish.</p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="border p-4 rounded-xl text-center">
                        <span className="mx-auto flex h-12 w-12 text-xl items-center justify-center bg-primary dark:text-white rounded-full"><FaCar></FaCar></span>
                        <h3 className="text-lg font-bold my-2">Wide Variety of Cars</h3>
                        <p>From budget-friendly options to luxury vehicles.</p>
                    </div>
                    <div className="border p-4 rounded-xl text-center">
                        <span className="mx-auto flex h-12 w-12 text-xl items-center justify-center bg-primary dark:text-white rounded-full"><ImPriceTags></ImPriceTags></span>
                        <h3 className="text-lg font-bold my-2">Affordable Prices</h3>
                        <p>Competitive daily rates you can count on.</p>
                    </div>
                    <div className="border p-4 rounded-xl text-center">
                        <span className="mx-auto flex h-12 w-12 text-xl items-center justify-center bg-primary dark:text-white rounded-full"><PiBookmarksSimpleFill></PiBookmarksSimpleFill></span>
                        <h3 className="text-lg font-bold my-2">Easy Booking Process</h3>
                        <p>Seamlessly book your ride in just a few clicks.</p>
                    </div>
                    <div className="border p-4 rounded-xl text-center">
                        <span className="mx-auto flex h-12 w-12 text-xl items-center justify-center bg-primary dark:text-white rounded-full"><MdSupportAgent></MdSupportAgent></span>
                        <h3 className="text-lg font-bold my-2">Customer Support</h3>
                        <p>24/7 assistance for all your queries.</p>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}
