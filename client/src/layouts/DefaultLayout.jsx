import { Outlet } from "react-router";
import Header from "../default/Header";
import Footer from "../default/Footer";
import ThemeToggle from "../component/ThemeToggle";

export default function DefaultLayout() {
  return (
    <>
      <Header></Header>
      <ThemeToggle></ThemeToggle>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  )
}
