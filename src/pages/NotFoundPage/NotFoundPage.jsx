const NotFoundPage = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <h1 className="text-gray-600 text-9xl font-extrabold"> 404 </h1>  
            <h3 className="font-semibold text-gray-700 text-3xl">Not Found</h3>   
            <p className="mt text-gray-800 fonnt-bold">The page you're looking for does not exist!</p>    
            <div className="flex space-x-1">
                <button className="p-2 bg-gray-600 text-white rounded-md mt-3">
                    Go Home
                </button>
            </div>
        </div>
    );
}

export default NotFoundPage;
