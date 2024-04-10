"use client";
import { useState } from "react";
import BarcodeScannerComponent from "@/components/BarcodeScanner";
import { useRouter } from "next/navigation";

interface BarcodeScannerComponentProps {
  setBarcode: (barcode: string) => void;
  setError: (error: string) => void;
}

const BarcodeScannerPage: React.FC = () => {
  // State to hold barcode and error

  const [barcode, setBarcode] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Define functions to pass to the BarcodeScannerComponent
  const handleSetBarcode: BarcodeScannerComponentProps["setBarcode"] = (
    barcode
  ) => {
    setBarcode(barcode);
  };

  const handleSetError: BarcodeScannerComponentProps["setError"] = (error) => {
    setError(error);
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-orange-300/40 via-blue-300 to-purple-300 h-screen justify-center align-middle items-center">
      <div className="rounded-lg flex justify-center align ">
        <BarcodeScannerComponent
          setBarcode={handleSetBarcode}
          setError={handleSetError}
        />
      </div>
      <div className="font-semibold text-3xl ">Scanned Barcode: {barcode}</div>
    </div>
  );
};

export default BarcodeScannerPage;
