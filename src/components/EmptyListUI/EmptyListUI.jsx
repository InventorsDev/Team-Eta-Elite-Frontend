const EmptyListUI = ({ heading, subheading, forOrdersPage = false }) => {
    return (
        <div className="flex gap-3 items-center justify-center text-center flex-col w-full h-full min-h-[80vh]">
            <img 
                src={forOrdersPage ? '/icons/empty/empty_cart.svg' : '/icons/empty/empty_box.svg'} 
                width={150} height={120} className="md:w-[220px] min-h-[150px]" alt="empty box" 
            />
            <h1 className="font-bold text-2xl">{heading}</h1>
            <p className="text-sm">{subheading}</p>
        </div>
    );
}

export default EmptyListUI;
