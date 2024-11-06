import UserProfile from "@/components/UserProfile";
import logo from "@/pages/auth/LoginImage.jpg";
import {Toaster} from "@/components/ui/toaster.tsx";
import "./ProfilePage.css";
import React from "react";
import NavbarBlack from "@/components/NavbarBlack.tsx";

const UserProfilePage: React.FC = () => {
    return (

        <div className="flex flex-col justify-center items-center bg-black">
            <NavbarBlack/>
            {/* BIG SCREEN */}
            <div className="profilepageheight hidden lg:flex w-full">

                {/* USERPROFILE FORM */}
                <div
                    className="profileheight flex w-2/5 flex-col items-center justify-center
              rounded-r-[80px] border-b-[3px]  border-r-[3px] border-t-[3px]
         border-[#C51321] bg-[#0C1911] shadow-2xl"
                >
                    <div className="w-1/2 scale-125  space-y-6">
                        <div className="font-overpass text-white
                text-2xl font-extrabold tracking-wider">
                            Profilul meu
                        </div>
                        <UserProfile/>
                    </div>
                    <Toaster/>
                </div>

                {/* IMAGE */}
                <div className="profileheight flex-column flex w-3/5 items-center justify-center bg-black ">
                    <img
                        className="w-[950px] h-[600px]"
                        src={logo}
                        alt="user profile img"
                    />
                </div>
            </div>


            {/*  SMALL SCREEN */}
            <div className="profilepageheight  lg:hidden flex items-center justify-center">
                <div className=" flex h-[600px] justify-center">
                    <div
                        className=" p-8 flex flex-col items-center justify-center
              rounded-[80px] border-[3px] border-[#3CACAE] bg-[#F5F5F5] shadow-2xl"
                    >
                        <div className="space-y-6">
                            <div className="font-overpass text-darkgray
                text-2xl font-extrabold tracking-wider">
                                Profilul meu
                            </div>
                            <UserProfile/>
                        </div>
                        <Toaster/>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default UserProfilePage;
