"use client";
import React from "react";
import { useRouter } from "next/navigation";
import pfLogo from "../../public/pf-white.png"
import Image from "next/image";

const FrontPage: React.FC = () => {
    const router = useRouter();
    return (
        <div className="h-screen max:h-screen-auto flex flex-col justify-center items-center bg-gradient-to-br from-orange-500/35 via-blue-300 to-purple-400/40">
            <Image src={pfLogo} alt="Pathfinder Logo" height={200} className="absolute top-[-3rem]"></Image>
            <div className="bg-white rounded-[10px] drop-shadow-md flex flex-col items-center justify-between p-10 m-10">
                <h2 className="font-bold text-3xl text-center p-3 bg-clip-text text-transparent inline-block bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-800 drop-shadow-md">Choose your category</h2>
                <button className="font-semibold border m-5 rounded text-center p-2 bg-blue-600 text-white text-2xl drop-shadow-sm" onClick={() => {
                    router.push("/boys");
                }}>Boys Marathon</button>
                <button className="font-semibold border m-5 rounded text-center p-2 bg-blue-600 text-white text-2xl  drop-shadow-sm" onClick={() => {
                    router.push("/girls");
                }}>Girls Marathon</button>
                <button className="font-semibold border m-5 rounded text-center p-2 bg-blue-600 text-white text-2xl  drop-shadow-sm mb-3" onClick={() => {
                    router.push("/walkathon");
                }}>Walkathon</button>
            </div>
        </div>
    );
}

export default FrontPage;