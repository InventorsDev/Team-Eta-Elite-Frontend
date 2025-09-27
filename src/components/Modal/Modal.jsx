const Modal = (props) => {
    const { type, className, ...rest } = props;
    return (
        <div id='Modal' className={`
            fixed z-20 top-0 left-0 w-full h-full min-screen flex justify-center items-center
            ${type === "blur"? "backdrop-blur-md": "backdrop-brightness-[.2]"}
        `}>
            <div id="ModalContent" {...rest} className={`
                ${className} bg-white border relative border-gray-400 rounded-xl p-6 mx-8 sm:p-12 text-center flex flex-col gap-4 justify-center items-center max-w-[700px]
            `}>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;
