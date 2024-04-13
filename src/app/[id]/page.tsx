"use client";

import { getQRCode } from "@/actions/dataActions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function IdPage({ params }: any) {
  const [baseData, setBaseData] = useState("");
  const [invalidCode, setInvalidCode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getQRCode(params.id);
      if (res?.qrcodedata) setBaseData(res.qrcodedata);
      else {
        setTimeout(() => {
          setInvalidCode(true);
        }, 1500);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen max:h-screen-auto flex flex-col justify-center items-center bg-gradient-to-br from-orange-500/35 via-blue-300 to-purple-400/40">
      <div className="bg-white rounded-[10px] p-5 flex flex-col justify-between m-2 mr-5 ml-5 items-center">
        {baseData !== "" && (
          <h2 className="font-semibold text-green-600 text-xl text-center">
            Sucessfully Registered!
          </h2>
        )}
        {invalidCode && (
          <h2 className="font-semibold text-red-600 text-xl text-center">
            Invalid Code!
          </h2>
        )}
        {baseData !== "" && (
          <Image
            src={`data:image/png;base64,${baseData}`}
            width={250}
            height={250}
            alt="qr code"
          />
        )}
      </div>

      {baseData !== "" && (
        <div className=" bg-white rounded-[10px] p-5 flex flex-col justify-between mb-2 mr-5 ml-5 items-center">
          <label className="text-red-500 text-wrap text-left font-semibold text-[1.2rem]">
            <span className="red">* </span>This should be ready with you when
            you cross the finish line
          </label>
          <label className="text-red-500 text-wrap text-left font-semibold text-[1.2rem]">
            <span className="red">* </span>An email will be sent to you with the
            QR Code. If possible, take a screenshot of this page
          </label>
        </div>
      )}

      {baseData !== "" && (
        <Link href={"https://chat.whatsapp.com/H8DVoN1forH0PkcQxf7wW3"}>
          <div className="bg-green-500 p-4 rounded-[10px] pr-12 pl-12  flex flex-col justify-between mr-5 ml-5 items-center">
            <button className="bg-green-500 p-4 rounded-[10px] text-white text-xl font-semibold  text-center">
              Join the Whatsapp Group for updates
            </button>
          </div>
        </Link>
      )}
    </div>
  );
}
