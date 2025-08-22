import starRating from "../../../../components/Star/starRating";
import { Link } from "react-router-dom";

const SavedVendors = () => {
    const vendors = [
        {
            id: 1,
            name: "Eta-Elite Furniture",
            description: "Specializes in all kinds of furniture and home materials",
            rating: 5,
            reviews: 124,
        },
        {
            id: 2,
            name: "Tech Solutions",
            description: "Specializes in all kinds of laptops and tech accesories",
            rating: 5,
            reviews: 200,
        },
        {
            id: 3,
            name: "Daniel Software Agency",
            description: "Provides solutions to your tech website",
            rating: 4,
            reviews: 102,
        },
        {
            id: 4,
            name: "Confidence Fashions",
            description: "Specializes in all kinds of ladies wears and accesories",
            rating: 3,
            reviews: 73,
        },
        {
            id: 5,
            name: "Priscilla Foods",
            description: "Specializes in all kinds of foods and catering services",
            rating: 5,
            reviews: 150,
        },
        {
            id: 5,
            name: "Priscilla Foods",
            description: "Specializes in all kinds of foods and catering services",
            rating: 2,
            reviews: 15,
        },
    ];


    return (
        <div>
            <h1 className="text-2xl font-bold">Saved Vendors</h1>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {vendors.map((vendor)=>(
                    <div key={vendor.id} className="relative border-2 mb-2 border-[#00000003]  p-5 flex flex-col rounded-[10px] shadow-md ">
                        <h2 className="font-bold text-[20px] ">{vendor.name}</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            fill="#0000001A" viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="#0000001A" 
                            className=" absolute top-4 right-3.5 size-6">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M17.593 
                                    3.322c1.1.128 1.907 1.077 1.907 
                                    2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 
                                    1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        <p className="text-gray-500 my-2 font-normal ">{vendor.description}</p>
                        <div className="flex my-5 items-center justify-between">
                            {starRating({ rating: vendor.rating })}
                            <span className="text-neutral-500 font-semibold">
                                ({vendor.reviews} reviews)
                            </span>
                        </div>
                        <Link 
                            to={``}
                            className=" text-center cursor-pointer hover:scale-103 transition-all active:scale-100 bg-[var(--primary-color)] text-white px-4 py-2 rounded-[10px] mt-4">
                            view product
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SavedVendors;
