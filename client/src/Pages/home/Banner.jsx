import BannerVideo from "../../assets/banner-bg.mp4";
import { Link } from "react-router";
export default function Banner() {
    return (
        <section>
            <div className="relative overflow-hidden">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    src={BannerVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                <div className="absolute inset-0 bg-black/90 z-1"></div>

                <div className="relative z-2 flex flex-col items-center justify-center h-full text-white px-5 xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto py-20">
                    <div className="grid lg:grid-cols-2 items-center gap-10 ">
                        <div>
                            <h1 className="text-6xl font-bold mb-4">Zentra<span className="text-primary">Car</span></h1>
                            <h2 className="text-3xl font-semibold mb-4">Your Next Car Awaits You.</h2>
                            <p>  Explore a wide range of premium vehicles at unbeatable prices. Whether it's a weekend getaway or a business trip, ZentraCar gets you there in style and comfort.</p>
                            <Link to='/available-cars' className="btn btn-primary mt-6">View Available Cars</Link>
                        </div>
                        <div>
                            <img src="https://autohive-html.themetags.com/assets/img/home3/car-slide-1.png" alt="" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
