"use server";

import { BaseFormType } from "@/types/forms";
import { db } from "@/database/db";

import QRCode from "qrcode";

import { getQRMailOpts, primary_transporter } from "@/actions/mailActions";
import { eq } from "drizzle-orm";
import {
  boys,
  boysCross,
  girls,
  girlsCross,
  master,
  sit,
  walkathon,
  walkathonCross,
} from "@/database/schema";

export async function getQRCode(uniqueCode: string) {
  return await db.query.master.findFirst({
    where: eq(master.uniqueCode, uniqueCode),
  });
}

export async function getTopParticipants(
  category: "boys" | "girls" | "walkathon"
) {
  if (category === "boys")
    return await db
      .select({ name: boysCross.name, time: boysCross.time })
      .from(boysCross)
      .orderBy(boysCross.time)
      .limit(20);
  else if (category === "girls")
    return await db
      .select({ name: girlsCross.name, time: girlsCross.time })
      .from(girlsCross)
      .orderBy(girlsCross.time)
      .limit(20);
  else if (category === "walkathon")
    return await db
      .select({ name: walkathonCross.name, time: walkathonCross.time })
      .from(walkathonCross)
      .orderBy(walkathonCross.time)
      .limit(10);
}

export async function pushData(
  formData: BaseFormType,
  category: "boys" | "girls" | "walkathon"
) {
  const baseQrData = `name: ${formData.name} uc: ${formData.unique_code}`;
  
  let qrData = baseQrData;
  if (category === "boys") qrData += " b";
  else if (category === "girls") qrData += " g";
  else if (category === "walkathon") qrData += " w";
  
  const qrDataURL = await QRCode.toDataURL(qrData);
  const mailOpts = getQRMailOpts(formData.name, formData.email, qrDataURL);
  

  if (category === "boys")
    await db.insert(boys).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      usn: formData.usn,
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata,
    });
  else if (category === "girls")
    await db.insert(girls).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      usn: formData.usn,
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata,
    });
  else if (category === "walkathon")
    await db.insert(walkathon).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata,
    });

  await db.insert(master).values({
    name: formData.name,
    email: formData.email,
    mobileNo: formData.mobile_no,
    usn: formData.usn,
    uniqueCode: formData.unique_code,
    qrcodedata: formData.qrcodedata,
  });

  if (
    formData.usn &&
    (formData.usn[1] == "S" || formData.usn[1] == "s") &&
    (formData.usn[2] == "i" || formData.usn[2] == "I")
  ) {
    await db.insert(sit).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      usn: formData.usn,
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata,
    });
  }

  primary_transporter.sendMail(mailOpts);
}
