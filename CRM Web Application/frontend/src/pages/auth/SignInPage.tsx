import SignInForm from "@/components/SignInForm";
// import logo from "./LoginImage.jpg";
import logo2 from "./FEROX_Secondary.jpg";
import {Toaster} from "@/components/ui/toaster.tsx";
import "./Login.css";

const SignInPage = () => {
    return (
        <div className="">

            {/* BIG SCREENS */}
            <div className="hidden lg:flex loginwrapper w-full bg-white">
                {/* IMAGE */}
                <div className="flex-column flex w-2/5 items-center justify-center ">
                    <img
                        width={950}
                        height={600}
                        src={logo2}
                        alt="login img"
                    />
                </div>

                {/* SIGNIN FORM */}
                <div
                    className=" flex w-3/5 flex-col items-center justify-center
                    rounded-l-[80px] border-b-4 border-l-4 border-t-4
                    border-[#C51321] bg-[#858C88] shadow-2xl"
                >
                    <div className="w-1/2 scale-150 space-y-6">
                        <div className="font-overpass text-white text-2xl font-extrabold tracking-wider">
                            Bine ati revenit!
                        </div>
                        <div className="font-overpass text-white text-2xl font-extrabold tracking-wider">
                            <SignInForm/>
                        </div>
                        <Toaster/>
                    </div>
                </div>
            </div>
            {/* SMALL SCREENS */}
            <div className="loginwrapper lg:hidden flex flex-col items-center justify-center bg-white h-screen">
                {/* Logo Centered Vertically */}
                <div className="mb-4 flex justify-center">
                    <img
                        src={logo2}
                        alt="login img"
                        className="w-45 h-20"
                    />
                </div>

                {/* Gray Container with Sign-In Form */}
                <div className="flex small-screen-login-container flex-col items-center justify-center
        rounded-lg p-6 border-2 border-[#C2C7C6] bg-[#FFFFFF] shadow-lg w-[90%] max-w-[400px]"
                >
                    <div className="space-y-4 text-center">
                        <div className="font-overpass text-black text-xl font-extrabold tracking-wider">
                            Bine ati revenit!
                        </div>
                    </div>
                    <div className="w-full mt-4">
                        <SignInForm/>
                    </div>
                    <Toaster/>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
