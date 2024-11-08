import SignUpForm from "@/components/SignUpForm";
import logo from "./LoginImage.jpg";
import {Link} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";
import "./Login.css";


// The sign-up page
// Contains the sign-up form, a link to the sign-in page and an image
// Has 2 different layouts for small and large screens
// Shows a toast message if any data is invalid
const SignUpPage = () => {
    return (
        <div>

            {/* BIG SCREENS */}
            <div className="hidden lg:flex loginwrapper w-full bg-black">

                <div className="flex-column flex w-3/5 items-center justify-center ">
                    <img
                        // className="sm:p-[80px] lg:p-[100px]"
                        width={650}
                        height={600}
                        src={logo}
                        alt="login img"
                    />
                </div>

                {/* SIGNUP FORM */}
                <div
                    className=" flex w-2/5 flex-col items-center justify-center rounded-l-[80px] border-b-4  border-l-4 border-t-4
         border-[#FFFFFF] bg-[#0C1911] shadow-2xl"
                >
                    <div className="w-3/5 scale-125 space-y-7">
                        <div className="font-overpass text-white  text-3xl font-extrabold tracking-wider">
                            WELCOME!
                        </div>
                        <div className="font-nunito text-white  font] text-sm tracking-wider">
                            Already have an account?{" "}
                            <Link
                                to="/sign-in"
                                className="text-[#C51321] font-semibold hover:text-[#858C88]"
                            >
                                Sign in
                            </Link>
                        </div>
                        <SignUpForm/>
                    </div>
                    <Toaster/>
                </div>
            </div>


            {/* SMALL SCREENS */}
            <div className="signupwrapper lg:hidden flex items-center justify-center">
                <div className="flex height-adjust justify-center">
                    <div
                        className=" flex small-screen-login-container  flex-col items-center justify-center rounded-[80px] border-4
         border-[#3CACAE] bg-[#F5F5F5] shadow-2xl"
                    >
                        <div className="w-3/5 scale-125 space-y-6">
                            <div className="font-overpass text-darkgray  text-3xl font-extrabold tracking-wider">
                                WELCOME!
                            </div>
                            <div className="font-nunito text-darkgray  font] text-sm tracking-wider">
                                Already have an account?{" "}
                                <Link
                                    to="/sign-in"
                                    className="text-[#3CACAE] font-semibold hover:text-[#C26DBC]"
                                >
                                    Sign in
                                </Link>
                            </div>
                            <SignUpForm/>
                        </div>
                        <Toaster/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SignUpPage;
