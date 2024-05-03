"use client";
import React from "react";
import { useRouter } from "next/navigation";
import pfLogo from "../../public/pf-white.png";
import avLogo from "../../public/Aryavartha.jpg";
import Image from "next/image";
import { MainButton } from "@/components/Button";

const FrontPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="max:h-screen-auto flex flex-col justify-center items-center bg-gradient-to-br gap-4 from-orange-500/35 via-blue-300 to-purple-400/40 pb-10 md:pb-28">
      <Image
        src={pfLogo}
        alt="Pathfinder Logo"
        height={150}
        className="m-2 p-2"
      ></Image>
      <div className="flex flex-wrap gap-2 w-full justify-around items-center ">
        <Image src={avLogo} alt="Aryavartha Logo" height={100} className="mix-blend-multiply "></Image>
        <p className="text-xl md:text-4xl text-white drop-shadow-md text-center">"Smart Solutions for a Sustainable Future"</p>
      </div>
      <div className="bg-[#f7f7f7] rounded-lg drop-shadow-lg flex flex-col justify-between p-10 gap-4 ">
        <h2 className="text-center text-3xl mb-3 font-bold">Registrations</h2>
        <MainButton text="Boys Marathon" path="/boys" />
        <MainButton text="Girls Marathon" path="/girls" />
        <MainButton text="Walkathon" path="/walkathon" />
      </div>
    </div>
  );
};

export default FrontPage;
