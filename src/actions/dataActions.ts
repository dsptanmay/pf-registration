"use server";

import { BaseFormType } from "@/types/forms"
import { db } from "@/database/db";

import QRCode from "qrcode";
import * as fs from "fs";

import { getMailOpts, transporter } from "@/actions/mailActions";
import { eq } from "drizzle-orm";
import { boys, girls, master, sit, walkathon } from "@/database/schema";

export async function getQRCode(uniqueCode: string) {
    return await db.query.master.findFirst({
        where: eq(master.uniqueCode, uniqueCode)
    })
}

export async function pushData(formData: BaseFormType, category: "boys" | "girls" | "walkathon") {
    const qrCodePath = `qrCode_${Date.now()}.png`;
    const baseQrData = `name: ${formData.name} uc: ${formData.unique_code}`;
    const mailOpts = getMailOpts(formData.name, formData.email, qrCodePath);

    let qrData = baseQrData;
    if (category === 'boys')
        qrData += " b";
    else if (category === "girls")
        qrData += " g";
    else if (category === "walkathon")
        qrData += " w";


    await QRCode.toFile(qrCodePath, qrData);

    if (qrCodePath) {
        const qrBuffer = fs.readFileSync(qrCodePath);
        const q64 = qrBuffer.toString("base64");
        formData.qrcodedata = q64;
    }

    if (category === "boys")
        await db.insert(boys).values({
            name: formData.name,
            email: formData.email,
            mobileNo: formData.mobile_no,
            usn: formData.usn,
            uniqueCode: formData.unique_code,
            qrcodedata: formData.qrcodedata
        })
    else if (category === "girls")
        await db.insert(girls).values({
            name: formData.name,
            email: formData.email,
            mobileNo: formData.mobile_no,
            usn: formData.usn,
            uniqueCode: formData.unique_code,
            qrcodedata: formData.qrcodedata
        })
    else if (category === "walkathon")
        await db.insert(walkathon).values({
            name: formData.name,
            email: formData.email,
            mobileNo: formData.mobile_no,
            uniqueCode: formData.unique_code,
            qrcodedata: formData.qrcodedata
        })

    await db.insert(master).values({
        name: formData.name,
        email: formData.email,
        mobileNo: formData.mobile_no,
        usn: formData.usn,
        uniqueCode: formData.unique_code,
        qrcodedata: formData.qrcodedata
    })

    if (formData.usn &&
        (formData.usn[1] == 'S' || formData.usn[1] == 's') &&
        (formData.usn[2] == 'i' || formData.usn[2] == 'I')
    ) {
        await db.insert(sit).values({
            name: formData.name,
            email: formData.email,
            mobileNo: formData.mobile_no,
            usn: formData.usn,
            uniqueCode: formData.unique_code,
            qrcodedata: formData.qrcodedata
        })
    }

    transporter.sendMail(mailOpts, () => {
        fs.unlinkSync(qrCodePath);
    })
}