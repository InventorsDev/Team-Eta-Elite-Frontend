import InlineSpinner from "../InlineSpinner/InlineSpinner";

const LoadingUI = () => {
    return (
        <div className="w-full h-full min-h-screen flex flex-col justify-center items-center gap-4">
            <h1 className="font-extrabold text-xl sm:text-4xl text-center">SAFELINK</h1>
            <div className="flex gap-2 items-center">
                <InlineSpinner size="md" />
                <p>Loading ...</p>
            </div>
        </div>
    );
}

export default LoadingUI;
