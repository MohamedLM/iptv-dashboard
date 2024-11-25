import { PanelCredentialsEmail } from "@/emails/panel-credentials";
import {
  getEmailTemplate,
  replaceTemplateContent,
} from "@/libs/email-templates";
import { PanelCredential } from "@/libs/order";
import { render } from "@react-email/components";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // upgrade later with STARTTLS, true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmailTemplate = async (
  emailTemplate: string,
  data: { [key: string]: string },
  options: {
    from: string;
    to: string;
    smtpTransport?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  }
) => {
  const template = await getEmailTemplate(emailTemplate);
  if (!template?.content) {
    throw new Error("Template not found!");
  }

  const templateContent = await replaceTemplateContent(template.content, data);
  const emailHtml = render(
    PanelCredentialsEmail({
      markdown: templateContent,
    })
  );

  let emailTransport;
  if (options?.smtpTransport) {
    emailTransport = createTransport(options?.smtpTransport);
  } else {
    emailTransport = transporter;
  }

  const res = await emailTransport.sendMail({
    ...options,
    subject: template.subject || "Your iptv credential",
    html: emailHtml,
  });
  console.log("RESULT", res);
  return true;
};

export const sendCredentialEmail = async (
  emailTemplate: string,
  data: {
    name?: string;
    credentials: Array<PanelCredential>;
  },
  options: {
    from: string;
    to: string;
    smtpTransport?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  }
) => {
  const template = await getEmailTemplate(emailTemplate);
  if (!template?.content) {
    throw new Error("Template not found!");
  }

  const templateContent = await replaceTemplateContent(template.content, data);
  const emailHtml = render(
    PanelCredentialsEmail({
      markdown: templateContent,
    })
  );

  let emailTransport;
  if (options?.smtpTransport) {
    emailTransport = createTransport(options?.smtpTransport);
  } else {
    emailTransport = transporter;
  }

  const res = await emailTransport.sendMail({
    ...options,
    subject: template.subject || "Your iptv credential",
    html: emailHtml,
  });
  console.log("RESULT", res);
  return true;
};
