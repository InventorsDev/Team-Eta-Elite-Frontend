import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { isValidEmail } from "../../utils/isEmailValid";
import Button from "../../components/Button/Button";
import Toast from "../../components/Toast/Toast";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";

const LoginPage = () => {
    const [formErrors, setFormErrors] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSignin = (e) => {
        // bypass default refresh 
        e.preventDefault();

        // Validate input
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (!isValidEmail(email)) {
            setFormErrors((prev) => ({...prev, email: "Email is not in a valid format"}));
            return;
        }
        
        if (password.length <= 5) {
            setFormErrors((prev) => ({...prev, password: "Password should be more than 5 characters"}));
            return;
        }

        // initialize related state
        setFormErrors({
            email: "",
            password: ""
        });
        setLoading(true);

        // make SignIn API request
        try {
            setToast({
                message: "You have signed in successfully.",
                type: "success",
            });
        } catch (error) {
            setToast({
                message: "Failed to signin.",
                type: "error",
            });
        } finally {
            setTimeout(() => setLoading(false), 3000);
        }
    }

    return (
        <div id='Login-Page' className="flex flex-col lg:flex-row-reverse">
            {toast && (
				<Toast 
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}

            <header 
                className='
                    bg-[var(--primary-color)] w-full p-8 flex flex-col justify-center gap-2 text-white h-full text-center min-h-[40vh] rounded-br-[2.8rem]
                    lg:min-h-screen lg:rounded-br-none lg:rounded-tl-[14rem] lg:w-[50%] lg:gap-4
                '
            >
                <h1 className='text-4xl font-extrabold lg:text-5xl'>Welcome Back!</h1>
                <p className='text-sm lg:text-base'>Enter your details to access your dashboard.</p>
                <Link 
                    to={"/signup"} 
                    className="rounded-3xl border border-white text-white p-2 px-4 cursor-pointer w-fit self-center text-sm mt-4 lg:text-lg lg:px-8"
                >
                    SIGN UP
                </Link>
            </header>

            <form 
                className="text-gray-700 p-6 sm:p-10 md:p-16 font-semibold space-y-4 lg:w-[50%] my-auto" 
                onSubmit={handleSignin}
            > 
                <h1 className="font-extrabold text-3xl text-black font-headings lg:text-4xl">Sign In - SAFELINK</h1>
                <p className="text-sm">Enter your details</p>

                <div id="email-input" className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-black">Email: </label>
                    <input type="email" id="email" name="email" ref={emailRef} className="rounded px-4 py-3 bg-gray-200 text-sm" placeholder="Email"/>
                    {formErrors.email !== "" && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>
                
                <div id="password-input" className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-black">Password: </label>
                    <input type="password" id="password" name="password" ref={passwordRef} className="rounded px-4 py-3 bg-gray-200 text-sm" placeholder="Password"/>
                    {formErrors.password !== "" && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </div>

                <p className="text-sm">Forgot your password? </p>
                <Button type={"bg-black"} disabled={loading}>
                    {loading
                        ? <span><InlineSpinner /> Signing In...</span>
                        :"SIGN IN"
                    }
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
