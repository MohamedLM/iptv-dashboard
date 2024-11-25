import db from "@/database";
import { settings } from "@/database/schema";
import { eq } from "drizzle-orm";

export const setSetting = async (name: string, value: string) => {
  // do upsert, https://orm.drizzle.team/learn/guides/upsert
  return db
    .insert(settings)
    .values({
      name,
      value,
    })
    .onConflictDoUpdate({
      target: settings.name,
      set: { value },
    })
    .returning();
};

export const getSetting = async (name: string, defaultValue?: string) => {
  return db.query.settings
    .findFirst({
      where: eq(settings.name, name),
      columns: { value: true },
    })
    .then((result) => {
      return result?.value || defaultValue;
    })
    .catch((error) => {
      if (defaultValue) {
        return defaultValue;
      }
      throw error;
    });
};

export const getSiteSetting = async (
  siteId: string,
  name: string,
  defaultValue?: string
) => {
  const settingName = `${siteId}::${name}`;
  return getSetting(settingName, defaultValue);
};

export const setSiteSetting = async (
  siteId: string,
  name: string,
  value: string
) => {
  const settingName = `${siteId}::${name}`;
  return setSetting(settingName, value);
};

const defaultSmtpTransport = {
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // upgrade later with STARTTLS, true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const getSiteSmtpSetting = async (siteId: string) => {
  const setting = (await getSiteSetting(siteId, "smtpTransport")) as string;
  try {
    return {
      ...defaultSmtpTransport,
      ...JSON.parse(setting),
    };
  } catch (error) {
    return defaultSmtpTransport;
  }
};

export const setSiteSmtpSetting = async (siteId: string, data: object) => {
  const settingData = {
    ...defaultSmtpTransport,
    ...data,
  };

  return setSiteSetting(siteId, "smtpTransport", JSON.stringify(settingData));
};
