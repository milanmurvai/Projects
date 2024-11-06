import {Link} from "react-router-dom";
import {AuthService} from "@/apis/auth/AuthService.tsx";

const NavbarMainPage = () => {
    return (
        <>
            <div
                className="z-1 border-gray-200 navbar-bg-important h-[80px] w-full justify-center overflow-hidden border-b-2">
                <div className="flex h-[80px] flex-row items-center px-10 ">
                    <div className="flex items-center gap-1">
                        <Link to="/" className="flex items-center justify-center">
                            <img
                                src="/logo.png"
                                alt="img"
                                className="h-20 w-30 overflow-hidden"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-5 md:flex justify-start flex-grow">
                        <a href="/projects" className="">
                            <div className="flex items-center gap-[2px]">
                                <span className="lg:text-lg text-base">Proiecte</span>
                            </div>
                        </a>

                        <a href="/add-activity" className="">
                            <div className="flex items-center gap-[2px]">
                                <span className="lg:text-lg text-base">Pontaj</span>
                            </div>
                        </a>
                    </div>
                    <div className="flex items-center md:flex justify-end ml-5">
                        <button
                            className="lg:text-lg text-base"
                            onClick={() => AuthService.logout()}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavbarMainPage;
