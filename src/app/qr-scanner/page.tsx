"use client";
import React, { useEffect, useState } from "react";
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";
import { pushCrossData } from "@/actions/dataActions";

const HomePage = () => {
  const [qrCodeElement, setQrCodeElement] = useState<any>();
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string>("");

  useEffect(() => {
    setQrCodeElement(new Html5Qrcode("qr-reader"));
  }, []);

  const onScanSuccess = async (
    decodedText: string,
    decodedResult: Html5QrcodeResult
  ) => {
    let baseData = decodedResult.result.text.split(" ");
    const uniqueCode = baseData[baseData.length - 2];
    let category = decodedResult.result.text.slice(-1);
    let fullName = "";

    for (let i = 1; i < baseData.length - 3; ++i) fullName += " " + baseData[i];

    const currTime =
      new Date().toISOString().slice(0, 10) +
      " " +
      new Date().toLocaleTimeString("en-IN", { hour12: false });

    const data = {
      unique_code: uniqueCode,
      name: fullName,
      time: currTime,
      category,
    };

    pushCrossData(data);
    setScannedCode(uniqueCode);
    stopCamera();
  };

  const onScanFailure = (err: any) => {
    console.error(err);
  };

  const startCamera = () => {
    qrCodeElement.start(
      { facingMode: "environment" },
      {
        fps: 15,
      },
      onScanSuccess,
      onScanFailure
    );
    setScanning(true);
  };

  const stopCamera = async () => {
    await qrCodeElement.stop();
    setScanning(false);
  };
  return (
    <div className="h-screen bg-[#161616] flex flex-col justify-center items-center">
      <h1 className="text-4xl text-white font-bold m-2">Admin QR Scanner</h1>
      <div
        id="qr-reader"
        className="border border-white w-[50%] mt-3 mb-5"
      ></div>
      {scanning ? (
        <button
          className="bg-gray-200 rounded-lg"
          onClick={() => {
            stopCamera();
          }}
        >
          <span className="rounded-lg block p-4 bg-blue-500 -translate-y-1 hover:-translate-y-2 active:translate-x-0 active:translate-y-0 transition-all font-semibold text-xl text-white border-gray-200 border-2 ">
            Stop Camera
          </span>
        </button>
      ) : (
        <button
          className="bg-gray-200 rounded-lg"
          onClick={() => {
            startCamera();
          }}
        >
          <span className="rounded-lg block p-4 bg-blue-500 -translate-y-1 hover:-translate-y-2 active:translate-x-0 active:translate-y-0 transition-all font-semibold text-xl text-white border-gray-200 border-2 ">
            Start Camera
          </span>
        </button>
      )}
      {scannedCode ? (
        <div className="text-gray-300 font-semibold text-xl text-center m-2">
          {scannedCode} scanned successfully!
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HomePage;
