import { Link } from "react-router-dom";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";


const Overview = () => {
    const salesDiv =[
        {
            Title:"Product Listed",
            amount:150,
            icon:(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#310EB7] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
            ),
            color: "#135CEE33"
        },
        {
            Title:"Orders Received",
            amount:67,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#2FA211] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                </svg>
            ),
            color: "#2FA2111A"

        },
        {
            Title:"Total Earned",
            amount:0,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#EDDC21] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            color: "#FFF4784D"

        },
        {
            Title:"Escrow Balance",
            amount:0,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#3C173E] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                </svg>
            ),
            color: "#3C173E4D"

        },
    ];

    return (
        <>
            <div className=" md:flex justify-center items-center">
                <div>
                    <h1 className="text-5xl font-bold">Welcome back!</h1>
                    <p className="text-md">Here’s your dashboard overview</p>
                </div>
                <div className="ml-auto md:text-wrap text-nowrap justify-center items-center flex mt-4 md:mt-0  ">
                    <Link
                        to="../create"
                        className="bg-[var(--primary-color)] transition-colors duration-300 px-8 font-medium py-3 rounded-md flex justify-center text-gray-100 items-center"
                    >
                        <div className="flex items-center gap-2 ">
                            <span className="text-2xl">+</span>
                            <span>Create New Product</span>
                        </div>
                    </Link>
                </div>
            </div>
            {/* cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {salesDiv.map((item, index) => (
                    <div key={index} className="bg-white border-2 border-gray-400/10 p-6 rounded-lg shadow-md flex items-center">
                        <div
                            className="flex-shrink-0 p-3 text-2xl rounded-[50%] flex items-center justify-center"
                            style={{ backgroundColor: item.color || "#f3f4f6" }}
                        >
                            {item.icon ? (
                                item.icon
                            ) : (
                                <InlineSpinner />
                            )}
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium">{item.Title || "N/A"}</h3>
                            <p className="text-xl font-bold">
                                {(item.Title === "Total Earned" || item.Title === "Escrow Balance")
                                    ? Number(item.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                    : Number(item.amount) || 0
                                }
                            </p>

                        </div>
                    </div>
                ))}
            </div>

            <div className="flex mt-15 shadow-md p-10 border-2 rounded-md border-gray-400/10 flex-col">
                <div><h2 className="font-bold text-2xl">KYC Status</h2></div>
                <div className="mt-5 flex items-center gap-5 ">
                    <div className="p-3 bg-[#2FA21133] text-[#2FA211] rounded-[50%]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[#2FA211] font-semibold">Verified</p>
                        <p className="font-medium">Your KYC document has been successfully verified</p>
                    </div>
                </div>
            </div>

            <button className="mt-6 w-full">
                <Link
                    className="bg-[var(--primary-color)] transition-colors duration-300 rounded-lg px-10 font-medium py-4 flex justify-center text-gray-100 items-center mt-6"
                    to="../create"
                >
                    <div className="flex items-center gap-2 ">
                        <span>+</span>
                        <span>Create New Product</span>
                    </div>
                </Link>
            </button>
        </>
    );
}

export default Overview;
