"use client";
import React from "react";
import { useRouter } from "next/navigation";
import pfLogo from "../../public/pf-white.png"
import Image from "next/image";
import { MainButton } from "@/components/Button";

const FrontPage: React.FC = () => {
    const router = useRouter();
    return (
        <div className="h-screen max:h-screen-auto flex flex-col justify-center items-center bg-gradient-to-br from-orange-500/35 via-blue-300 to-purple-400/40">
            <Image src={pfLogo} alt="Pathfinder Logo" height={150} className="absolute top-[0rem] m-3"></Image>
            <div className="bg-[#f7f7f7] rounded-lg drop-shadow-lg flex flex-col justify-between p-10 w-11/12 h-auto gap-4 ">
                <h2 className="text-center text-3xl mb-3 font-bold">Registrations</h2>
                <MainButton text="Boys Marathon" path="/boys"/>
                <MainButton text="Girls Marathon" path="/girls"/>
                <MainButton text="Walkathon" path="/walkathon"/>
            </div>
        </div>
    );
}

export default FrontPage;