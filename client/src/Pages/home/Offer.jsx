

const offers = [
  {
    title: 'Get 15% off for weekend rentals!',
    description: 'Book now and enjoy extra savings on all weekend bookings.',
    cta: 'Book Now',
  },
  {
    title: 'Luxury cars at $99/day this holiday season!',
    description: 'Drive in style for less – limited-time holiday rates.',
    cta: 'Learn More',
  },
];

export default function Offer() {
  return (
    <section className="py-12  bg-gray-900 dark:bg-gray-200">
      <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl px-5 mx-auto ">
        <h2 className="text-3xl font-bold text-center mb-8 ">
          Special Offers
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="bg-gray-800 dark:bg-gray-100 rounded-xl p-6 shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">
                {offer.title}
              </h3>
              <p className=" mb-4">{offer.description}</p>
              <button className="btn btn-primary">{offer.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
