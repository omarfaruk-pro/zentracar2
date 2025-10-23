import { useEffect, useState } from "react";
import CarsGrid from "./CarsGrid";
import { CiGrid42 } from "react-icons/ci";
import { FaList } from "react-icons/fa";
import CarsList from "./CarsList";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../component/Loading";


export default function AvailableCars() {
  const [layout, setLayout] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([])
  const [dateSort, setDateSort] = useState('')
  const [priceSort, setPriceSort] = useState('')
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value)
  }

  const dateSorting = (e) => {
    e.preventDefault();
    setDateSort(e.target.value)
  }

  const priceSorting = (e) => {
    e.preventDefault();
    setPriceSort(e.target.value)
  }

  useEffect(() => {
    setIsLoading(true)
    axios(`${import.meta.env.VITE_BASE_URL}/cars?sortDate=${dateSort}&sortPrice=${priceSort}&search=${search}`)
      .then(res => {
        setCars(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: err.message,
          timer: 3000
        })
        setIsLoading(false)
      })
  }, [search, dateSort, priceSort])


  return (
    <>
      <section className="py-20">
        <div className="xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl px-5 mx-auto">
          <h2 className="text-center text-4xl font-bold pb-5">All Available Cars</h2>
          <div className="flex flex-col lg:flex-row  justify-between gap-3 border-1 rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <p>Search</p>
              <input type="search" onChange={handleSearch} placeholder="Search" className="bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white px-4 py-2 focus:outline-0 rounded-md shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="flex justify-center sm:justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <p>Price</p>
                <select onChange={priceSorting} defaultValue={priceSort} className="bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white px-4 py-2 focus:outline-0 [inset_2px_2px_6px_rgba(0,0,0,0.3)]">
                  <option disabled value=''>Sort by Price</option>
                  <option value="Low">Lowest First</option>
                  <option value="High">Highest First</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <p>Date</p>
                <select onChange={dateSorting} defaultValue={dateSort} className="bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white px-4 py-2 focus:outline-0 [inset_2px_2px_6px_rgba(0,0,0,0.3)]">
                  <option disabled value="">Sort by Date</option>
                  <option value="New">Newest First</option>
                  <option value="Old">Oldest First</option>
                </select>
              </div>
              <button onClick={() => setLayout(!layout)} className="text-xl p-1.5 border-1 rounded-sm h-10 w-10 flex items-center justify-center">{layout ? <CiGrid42 /> : <FaList />}</button>
            </div>
          </div>
          {
            isLoading ? (
              <Loading></Loading>
            ) : (

              cars.length > 0 ? (
                layout ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                    {
                      cars.map(car => <CarsGrid key={car._id} car={car}></CarsGrid>)
                    }
                  </div>
                ) : (
                  <div className="max-w-5xl overflow-hidden mx-auto">
                    <div className="overflow-x-auto">
                      <table className="min-w-3xl mt-10  w-full table border-separate border-spacing-y-4 ">
                        <tbody>
                          {
                            cars.map(car => <CarsList key={car._id} car={car}></CarsList>)
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-5 mt-10 max-w-5xl mx-auto">
                  <p className="text-center text-2xl font-semibold">No cars available</p>
                </div>
              )
            )}

        </div>
      </section>
    </>
  )
}
