"use server";

import { BaseFormType, CrossData2 } from "@/types/forms";
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
import { PDFDocument, rgb } from "pdf-lib";

export async function getQRCode(uniqueCode: string) {
  return await db.query.master.findFirst({
    where: eq(master.uniqueCode, uniqueCode),
  });
}

export async function getOneParticipant(participantEmail: string) {
  return await db
    .select()
    .from(master)
    .where(eq(master.email, participantEmail));
}

export async function getParticipants(
  category: "boys" | "girls" | "walkathon"
) {
  if (category === "boys")
    return await db
      .select({ name: boysCross.name, email: boys.email })
      .from(boys)
      .leftJoin(boysCross, eq(boys.uniqueCode, boysCross.uniqueCode));
  else if (category === "girls")
    return await db
      .select({ name: girlsCross.name, email: girls.email })
      .from(girls)
      .leftJoin(girlsCross, eq(girls.uniqueCode, girlsCross.uniqueCode));
  else if (category === "walkathon")
    return await db
      .select({ name: walkathonCross.name, email: walkathon.email })
      .from(walkathon)
      .leftJoin(
        walkathonCross,
        eq(walkathon.uniqueCode, walkathonCross.uniqueCode)
      );
}

export async function getTopParticipants(category: "boys" | "girls" | "walkathon") {
  if (category === "boys")
    return await db
      .select({
        uniqueCode: boysCross.uniqueCode,
        name: boysCross.name,
        timeCrossed: boysCross.time,
        phone: boys.mobileNo,
        email: boys.email,
      })
      .from(boysCross)
      .leftJoin(boys, eq(boysCross.uniqueCode, boys.uniqueCode))
      .orderBy(boysCross.time)
      .limit(20);
  else if (category === "girls")
    return await db
      .select({
        uniqueCode: girlsCross.uniqueCode,
        name: girlsCross.name,
        timeCrossed: girlsCross.time,
        phone: girls.mobileNo,
        email: girls.email,
      })
      .from(girlsCross)
      .leftJoin(girls, eq(girlsCross.uniqueCode, girls.uniqueCode))
      .orderBy(girlsCross.time)
      .limit(20);
  else if (category === "walkathon")
    return await db
      .select({
        uniqueCode: walkathonCross.uniqueCode,
        name: walkathonCross.name,
        timeCrossed: walkathonCross.time,
        phone: walkathon.mobileNo,
        email: walkathon.email,
      })
      .from(walkathonCross)
      .leftJoin(walkathon, eq(walkathonCross.uniqueCode, walkathon.uniqueCode))
      .orderBy(walkathonCross.time)
      .limit(10);
}

export async function getSITParticipants() {
  return await db
    .select({ name: sit.name, usn: sit.usn })
    .from(sit)
    .orderBy(sit.usn);
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
  formData.qrcodedata = qrDataURL.split(";base64,").pop();

  if (category === "boys")
    await db.insert(boys).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      usn: formData.usn?.toUpperCase(),
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata as string,
    });
  else if (category === "girls")
    await db.insert(girls).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      usn: formData.usn?.toUpperCase(),
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata as string,
    });
  else if (category === "walkathon")
    await db.insert(walkathon).values({
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobile_no,
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata as string,
    });

  await db.insert(master).values({
    name: formData.name,
    email: formData.email,
    mobileNo: formData.mobile_no,
    usn: formData.usn?.toUpperCase(),
    uniqueCode: formData.unique_code,
    qrcodedata: formData.qrcodedata as string,
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
      usn: formData.usn?.toUpperCase(),
      uniqueCode: formData.unique_code,
      qrcodedata: formData.qrcodedata as string,
    });
  }

  primary_transporter.sendMail(mailOpts);
}
