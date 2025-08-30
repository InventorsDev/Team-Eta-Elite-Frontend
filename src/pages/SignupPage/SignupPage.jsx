import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/helpers/isEmailValid";
import { supabase } from "../../lib/supabase";
import { Player } from "@lottiefiles/react-lottie-player";
import Button from "../../components/Button/Button";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";
import Toast from "../../components/Toast/Toast";
import Modal from "../../components/Modal/Modal";
import slugify from "slugify";

const SignupPage = () => {
    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

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
        
        // Prepare unique slug for vendor
        const slug = role === "vendor" ? generateVendorSlug(name): null;
        
        // make signup API request
        const { data, error } = await supabase.auth.signUp(
            {
                email: email,
                password: password,
                options: {
                    data: {
                        display_name: name,
                        role: role,
                        total_earned: role === "vendor"? 0: null,
                        escrow_balance: 0,
                        bank_sort_code: "",
                        bank_name: "",
                        account_name: "",
                        account_number: "",
                        slug: slug
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
            setIsSuccessful(true);
        } else {
            setToast({
                message: error.message || "Failed to signup.",
                type: "error",
            });
            setIsSuccessful(false);
        }

        // End Loading Sequence
        setLoading(false);
    }

    function generateVendorSlug(name) {
        const baseSlug = slugify(name, { lower: true, strict: true });
        const shortId = Math.random().toString(36).substring(2, 8);
        return `${baseSlug}-${shortId}`;
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

            {/* Email Confirmation Success Modal */}
            {isSuccessful && ( 
                <Modal type="blur">
                    <Player
                        autoplay
                        loop={true}
                        src={"/lotties/email-animation.json"}
                        style={{ height: '150px', width: '150px', scale: "200%" }}
                    />
                    <h1 className="text-lg sm:text-3xl font-bold font-headings">
                        Confirmation Email Sent to <b className="font-extrabold">{emailRef.current.value || ""}</b>! 🎉
                    </h1>
                    <p className="text-sm sm:text-base">Kindly click the link in the mail to verify your email.</p>
                    <Button type="bg-black" onClick={() => navigate("/login")}>Done? Login</Button>
                </Modal>
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
