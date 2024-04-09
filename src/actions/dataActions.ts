"use server";

import { BaseFormType } from "@/types/forms"
import { supabase } from "@/database/db";

import QRCode from "qrcode";
import * as fs from "fs";

import { getMailOpts, transporter } from "@/actions/mailActions";

export async function getQRCode(uniqueCode: string) {
    return await supabase.from("master").select("qrcodedata").eq("unique_code", uniqueCode).single();
}

export async function pushData(formData: BaseFormType, category: "boy" | "girl" | "walkathon") {
    const qrCodePath = `qrCode_${Date.now()}.png`;
    const baseQrData = `name: ${formData.name} uc: ${formData.unique_code}`;
    const mailOpts = getMailOpts(formData.name, formData.email, qrCodePath);

    let qrData = baseQrData;
    if (category === 'boy')
        qrData += " b";
    else if (category === "girl")
        qrData += " g";
    else if (category === "walkathon")
        qrData += " w";


    await QRCode.toFile(qrCodePath, qrData);

    if (qrCodePath) {
        const qrBuffer = fs.readFileSync(qrCodePath);
        const q64 = qrBuffer.toString("base64");
        formData.qrcodedata = q64;
    }

    if (category === "boy")
        await supabase.from("users").insert(formData);
    else if (category === "girl")
        await supabase.from("girls").insert(formData);
    else if (category === "walkathon")
        await supabase.from("walkathon").insert(formData)

    await supabase.from("master").insert(formData);

    if (formData.usn &&
        (formData.usn[1] == 'S' || formData.usn[1] == 's') &&
        (formData.usn[2] == 'i' || formData.usn[2] == 'I')
    ) {
        await supabase.from("sit").insert(formData)
    }

    transporter.sendMail(mailOpts, () => {
        fs.unlinkSync(qrCodePath);
    })
}