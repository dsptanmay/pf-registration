export type BaseFormType = {
  name: string;
  mobile_no: string;
  unique_code: string;
  email: string;
  usn?: string;
  qrcodedata?: string;
};

export type CrossData = {
  email: string | null;
  name: string;
  phone: string | null;
  timeCrossed: Date;
  uniqueCode: string;
};

export type SITData = {
  email: string;
  name: string;
  phone: string;
  usn: string;
  uniqueCode: string;
};
