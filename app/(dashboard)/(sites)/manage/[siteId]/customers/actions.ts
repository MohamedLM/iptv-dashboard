"use server";

import { getSiteSetting } from "@/libs/setting";
import { chunkArray } from "@/utils/common";
import { sendEmailTemplate } from "@/utils/server/email";

const SEND_PER_CHUNK = 10;

export const actionSendEmails = async (formData: FormData) => {
  try {

    const { siteId, emailTemplate, jsonEmails, ...data } = Object.fromEntries(
      formData.entries()
    );

    if (!emailTemplate) {
      throw new Error("No email template selected!");
    }

    const emailFrom = await getSiteSetting(String(siteId), "emailFrom");
    if (!emailFrom) {
      throw new Error("Email from have not set!");
    }

    let emails = [];
    try {
      emails = JSON.parse(jsonEmails as string);
    } catch (error) {}

    const chunks = chunkArray(emails, SEND_PER_CHUNK);
    for (const chunk of chunks) {
      const chunkResult = await Promise.allSettled(
        chunk.map(async (data) => {
          return sendEmailTemplate(String(emailTemplate), data, {
            from: emailFrom,
            to: data?.email,
          });
        })
      );

      console.log('chunkResult', chunkResult)
    }

    console.log("emails", { siteId, emailFrom, emailTemplate, chunks });

    return {
      success: true,
      message: `Emails sent!`,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};
