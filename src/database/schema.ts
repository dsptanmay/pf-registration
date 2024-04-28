import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const boys = pgTable("boys", {
  name: varchar("name").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email").notNull(),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata").notNull(),
});

export const girls = pgTable("girls", {
  name: varchar("name").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email").notNull(),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata").notNull(),
});

export const walkathon = pgTable("walkathon", {
  name: varchar("name").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email").notNull(),
  qrcodedata: varchar("qrcodedata").notNull(),
});

export const sit = pgTable("sit_participants", {
  name: varchar("name").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email").notNull(),
  usn: varchar("usn").notNull(),
  qrcodedata: varchar("qrcodedata").notNull(),
});

export const master = pgTable("master", {
  name: varchar("name").notNull(),
  mobileNo: varchar("mobile_no").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  email: varchar("email").notNull(),
  usn: varchar("usn"),
  qrcodedata: varchar("qrcodedata").notNull(),
});

export const boysCross = pgTable("cross_boys", {
  name: varchar("name").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});

export const girlsCross = pgTable("cross_girls", {
  name: varchar("name").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});

export const walkathonCross = pgTable("cross_walkathon", {
  name: varchar("name").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});

export const masterCross = pgTable("cross_master", {
  name: varchar("name").notNull(),
  uniqueCode: varchar("unique_code").primaryKey(),
  time: timestamp("time").notNull(),
});
