import About from "./About";
import Banner from "./Banner";
import Offer from "./Offer";
import RecentListing from "./RecentListing";
import WhyChoose from "./WhyChoose";


export default function Home() {
  return (
    <>
      <Banner></Banner>
      <WhyChoose></WhyChoose>
      <About></About>
      <RecentListing></RecentListing>
      <Offer></Offer>
    </>
  )
}
