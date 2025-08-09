import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

const SignupPage = () => {
    return (
        <div id='Signup-Page' className="flex flex-col lg:flex-row">
            <header 
                className='
                    bg-[var(--primary-color)] w-full p-8 flex flex-col justify-center gap-2 text-white h-full text-center min-h-[40vh] rounded-br-[2.8rem]
                    lg:min-h-screen lg:rounded-br-none lg:rounded-tr-[14rem] lg:w-[50%] lg:gap-4
                '
            >
                <h1 className='text-4xl font-extrabold lg:text-5xl'>Hello There!</h1>
                <p className='text-sm lg:text-base'>Enter your details to sign up for secure transactions with vendors</p>
                <Link 
                    to={"/login"} 
                    className="rounded-3xl border border-white text-white p-2 px-4 cursor-pointer w-fit self-center text-sm mt-4 lg:text-lg lg:px-8"
                >
                    SIGN IN
                </Link>
            </header>

            <form 
                className="text-gray-700 p-6 sm:p-10 md:p-16 font-semibold space-y-4 lg:w-[50%] my-auto" 
                onSubmit={(e) => e.preventDefault()}
            > 
                <h1 className="font-extrabold text-3xl text-black font-headings lg:text-4xl">Create Account</h1>
                <p className="text-sm">Enter your details</p>

                <div id="name-input" className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-black">Name: </label>
                    <input type="text" id="name" name="name" className="rounded px-4 py-3 bg-gray-200 text-sm" placeholder="Name"/>
                </div>

                <div id="email-input" className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-black">Email: </label>
                    <input type="email" id="email" name="email" className="rounded px-4 py-3 bg-gray-200 text-sm" placeholder="Email"/>
                </div>
                
                <div id="password-input" className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-black">Password: </label>
                    <input type="password" id="password" name="password" className="rounded px-4 py-3 bg-gray-200 text-sm" placeholder="Password"/>
                </div>

                <p className="text-sm">Forgot your password? </p>
                <Button type="bg-black">SIGN UP</Button>
            </form>
        </div>
    );
}

export default SignupPage;
