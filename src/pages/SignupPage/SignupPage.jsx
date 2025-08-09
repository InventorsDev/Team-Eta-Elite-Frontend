import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { isValidEmail } from "../../utils/helpers/isEmailValid";
import Button from "../../components/Button/Button";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";
import Toast from "../../components/Toast/Toast";
import { supabase } from "../../lib/supabase";

const SignupPage = () => {
    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const roleRef = useRef(null);

    const handleSignup = async (e) => {
        // bypass default refresh 
        e.preventDefault();

        // validate user input
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const role = roleRef.current.value;

        if (name.length <= 5) {
            setFormErrors((prev) => ({...prev, name: "Name must be greater than 5 characters"}));
            return;
        }

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
            name: "",
            email: "",
            password: ""
        });
        setLoading(true);

        // make signup API request
        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
                options: {
                    data: {
                        display_name: name,
                        role: role
                    }
                }
            },
        );

        if (!error) {
            console.log(data);
            
            setToast({
                message: "You have signed up successfully.",
                type: "success",
            });
        } else {
            setToast({
                message: error.message || "Failed to signup.",
                type: "error",
            });
        }

        // End Loading Sequence
        setLoading(false);
    }

    return (
        <div id='Signup-Page' className="flex flex-col lg:flex-row">
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
                    lg:min-h-screen lg:rounded-br-none lg:rounded-tr-[14rem] lg:w-[50%] lg:gap-4
                '
            >
                <h1 className='text-4xl font-extrabold lg:text-5xl'>Hello There!</h1>
                <p className='text-sm lg:text-base'>Enter your details to sign up for secure transactions with vendors using SAFELINK</p>
                <Link 
                    to={"/login"} 
                    className="rounded-3xl border border-white text-white p-2 px-4 cursor-pointer w-fit self-center text-sm mt-4 lg:text-lg lg:px-8"
                >
                    SIGN IN
                </Link>
            </header>

            <form 
                className="text-gray-700 p-6 sm:p-10 md:p-16 font-semibold space-y-4 lg:w-[50%] my-auto" 
                onSubmit={handleSignup}
            > 
                <h1 className="font-extrabold text-3xl text-black font-headings lg:text-4xl">Create Account</h1>
                <p className="text-sm">Enter your details</p>

                <div id="name-input" className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-black">Name: </label>
                    <input type="text" id="name" name="name" ref={nameRef} className="rounded px-4 py-3 bg-gray-200 text-sm" placeholder="Name"/>
                    {formErrors.name !== "" && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                </div>

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
                
                <div id="role-input" className="flex flex-col gap-2">
                    <label htmlFor="role" className="text-black">Role: </label>
                    <select type="role" id="role" name="role" ref={roleRef} className="rounded cursor-pointer px-4 py-3 bg-gray-200 text-sm" placeholder="Role">
                        <option value="vendor">Vendor</option>
                        <option value="buyer">Buyer</option>
                    </select>
                </div>

                <p className="text-sm">Forgot your password? </p>
                <Button 
                    disabled={loading}
                    type="bg-black"
                >
                    {loading
                        ? <span><InlineSpinner /> Signing Up...</span>
                        :"SIGN UP"
                    }
                </Button>
            </form>
        </div>
    );
}

export default SignupPage;
