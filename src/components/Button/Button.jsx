const Button = (props) => {
    const { type, className = "", ...rest } = props;
    return (
        <button
            className={`
                p-3 w-full sm:w-fit sm:px-4 rounded text-center cursor-pointer ease-transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                ${type === "bg-black" 
                    ? "text-white bg-[var(--primary-color)] hover:bg-gray-900"
                    : "text-[var(--primary-color)] border border-[var(--primary-color)] hover:text-white hover:bg-[var(--primary-color)]"
                }
                ${className}
            `}
            {...rest}
        >
            {props.children}
        </button>
    );
}

export default Button;
