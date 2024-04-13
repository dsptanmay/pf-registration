import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const boys = pgTable("boys", {
  name: varchar("name"),
  mobileNo: varchar("mobile_no"),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email"),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata"),
});

export const girls = pgTable("girls", {
  name: varchar("name"),
  mobileNo: varchar("mobile_no"),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email"),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata"),
});

export const walkathon = pgTable("walkathon", {
  name: varchar("name"),
  mobileNo: varchar("mobile_no"),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email"),
  qrcodedata: varchar("qrcodedata"),
});

export const sit = pgTable("sit_participants", {
  name: varchar("name"),
  mobileNo: varchar("mobile_no"),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email"),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata"),
});

export const master = pgTable("master", {
  name: varchar("name"),
  mobileNo: varchar("mobile_no"),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email"),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata"),
});

export const boysCross = pgTable("cross_boys", {
  name: varchar("name"),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});

export const girlsCross = pgTable("cross_girls", {
  name: varchar("name"),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});

export const walkathonCross = pgTable("cross_walkathon", {
  name: varchar("name"),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});
