import React, {useEffect, useState} from "react";
import {UserService} from "@/apis/profile/UserService";
import {Type} from "@/utils/types";

const UserProfile: React.FC = () => {

    const [name, setName] = useState("");
    const [type, setType] = useState<Type>(Type.ANGAJAT);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        // get user info from srv
        await UserService.getCurrentUser()
            .then((user) => {
                setName(user.name);
                setType(user.type);
            });
    };

    return (
        <div>
            <div>
                <ul>
                    <li className="mt-3">
                        <label className="text-sm text-white">
                            Nume:
                        </label>
                    </li>
                    <li className="font-nunito text-sm text-white border-[#C51321] rounded-xl border-[1px] p-1">
                        {name}
                    </li>

                    <li className="mt-1">
                        <label className="text-sm text-white">
                            Tip:
                        </label>
                    </li>
                    <li className="font-nunito text-sm text-white border-[#C51321] rounded-xl border-[1px] p-1"
                    >
                        {type}
                    </li>

                </ul>

            </div>
        </div>
    );
};

export default UserProfile;
