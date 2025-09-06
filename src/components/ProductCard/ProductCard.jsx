import { formatToNaira } from "../../utils/helpers/formatToNaira";
import Button from "../Button/Button";

const ProductCard = ({ imgSrc, productName, price, status }) => {
    return (
        <div className='vendor-product-card ease-transition justify-self-center bg-white border-2 border-gray-200 relative h-[460px] w-full rounded-lg max-w-[300px]'>
            <span 
                className={`
                    ${status === "active"? "bg-green-100 text-green-500 border border-green-500": "bg-red-100 text-red-500 border border-red-500"} 
                    absolute top-5 right-5 rounded-md text-sm p-2 z-10
                    `}
                >
                    {status === "active"? "Available": "Unavailable"}
                </span>
            <div className="h-[60%] w-full cursor-pointer overflow-hidden rounded-t-lg group">
                <img
                    src={imgSrc}
                    className="w-full h-full object-cover ease-transition group-hover:scale-110"
                    alt="product image"
                />
            </div>
            <div id="description-and-details-btn" className="p-4 h-[40%] gap-4 grid grid-rows-3 items-end w-full">
                <h2 className="font-bold self-start">{productName}</h2>
                <p className="self-start font-bold text-gray-500">{formatToNaira(price)}</p>
                <Button type="bg-black" className="pt-auto bg-gray-600 py-2 ml-auto">View Details</Button>
            </div>
        </div>
    );
}

export default ProductCard;
