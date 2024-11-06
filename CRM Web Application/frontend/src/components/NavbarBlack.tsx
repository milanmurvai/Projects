import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {useEffect, useState} from "react";
import {capitalizeString} from "@/lib/utils.ts";
import {Link} from "react-router-dom";
import SandwichMenu from "./HamburgerMenu";
import {AuthService} from "@/apis/auth/AuthService.tsx";

const NavbarMainPage = () => {
    const [username, setUsername] = useState("Username");


    useEffect(() => {
        const username = localStorage.getItem("username");
        setUsername(capitalizeString(username || "") || "Username");
    }, []);

    return (
        <>
            <div
                className="z-1 border-red navbar-bg-important h-[80px] w-full justify-center overflow-hidden border-b-2 bg-black text-white">
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

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center gap-[2px]">
                                    <span className="lg:text-lg text-base">Proiecte</span>
                                    <ChevronDown className="h-4 w-4"/>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link to="/projects">
                                    <DropdownMenuItem>Vizualizare Proiecte</DropdownMenuItem>
                                </Link>
                                <Link to="/add-project">
                                    <DropdownMenuItem>Adauga</DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>


                        {/*Admin*/}
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center gap-[2px]">
                                    <span className="lg:text-lg text-base">Admin</span>
                                    <ChevronDown className="h-4 w-4"/>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link to="/clients">
                                    <DropdownMenuItem>Clienti</DropdownMenuItem>
                                </Link>
                                <Link to="/employees">
                                    <DropdownMenuItem>Angajati</DropdownMenuItem>
                                </Link>
                                <Link to="/materials">
                                    <DropdownMenuItem>Materiale</DropdownMenuItem>
                                </Link>
                                <Link to="/activities">
                                    <DropdownMenuItem>Pontaje</DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <div className="flex items-center md:flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex items-center gap-[2px]">
                                    <span className="lg:text-lg text-base">{username}</span>
                                    <ChevronDown className="h-4 w-4"/>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link to="/profile">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={
                                    username == "Username" ? AuthService.loginPage :
                                        AuthService.logout
                                }>{username == "Username" ? "Sign-in" : "Logout"}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center md:hidden">
                        <SandwichMenu/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavbarMainPage;
