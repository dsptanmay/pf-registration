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

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_AUTH_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

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

export async function getTopParticipants(
  category: "boys" | "girls" | "walkathon"
) {
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
    .select({
      email: sit.email,
      phone: sit.mobileNo,
      name: sit.name,
      uniqueCode: sit.uniqueCode,
      usn: sit.usn,
    })
    .from(sit);
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

  await primary_transporter.sendMail(mailOpts);
}

export async function pushCrossData(data: {
  unique_code: string;
  time: string;
  name: string;
  category: string;
}) {
  console.log(data);

  if (data.category === "b")
    await supabase.from("cross_boys").insert({
      unique_code: data.unique_code,
      name: data.unique_code,
      time: data.time,
    });
  else if (data.category === "g")
    await supabase.from("cross_girls").insert({
      unique_code: data.unique_code,
      name: data.unique_code,
      time: data.time,
    });
  else if (data.category === "w")
    await supabase.from("cross_walkathon").insert({
      unique_code: data.unique_code,
      name: data.unique_code,
      time: data.time,
    });

  await supabase.from("cross_master").insert({
    unique_code: data.unique_code,
    name: data.unique_code,
    time: data.time,
  });
}
