"use server";

import nodemailer from "nodemailer";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: "validation" | "delivery";
};

const CONTACT_FIELDS = ["name", "phone", "location", "message"] as const;
const PARTNER_FIELDS = ["name", "phone", "organization", "message"] as const;

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    throw new Error("Telegram relay is not configured");
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) {
    throw new Error(`Telegram API responded ${res.status}`);
  }
}

async function sendEmail(subject: string, text: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
    throw new Error("Email relay is not configured");
  }
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transport.sendMail({
    from: SMTP_USER,
    to: CONTACT_EMAIL,
    subject,
    text,
  });
}

function readFields(
  formData: FormData,
  required: readonly string[],
  optional: readonly string[],
): Record<string, string> | null {
  const values: Record<string, string> = {};
  for (const field of required) {
    const value = formData.get(field);
    if (typeof value !== "string" || value.trim() === "") {
      return null;
    }
    values[field] = value.trim();
  }
  for (const field of optional) {
    const value = formData.get(field);
    if (typeof value === "string" && value.trim() !== "") {
      values[field] = value.trim();
    }
  }
  if (formData.get("consent") !== "on") {
    return null;
  }
  return values;
}

// Per brief: relay to email + Telegram; the request reaches the team
// if at least one channel delivers. No storage.
async function relay(subject: string, text: string): Promise<boolean> {
  const results = await Promise.allSettled([
    sendTelegram(text),
    sendEmail(subject, text),
  ]);
  const delivered = results.some((r) => r.status === "fulfilled");
  if (!delivered) {
    for (const r of results) {
      if (r.status === "rejected") {
        console.error("Contact relay failed:", r.reason);
      }
    }
  }
  return delivered;
}

export async function submitContactRequest(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = readFields(formData, CONTACT_FIELDS, ["telegram"]);
  if (!values) {
    return { status: "error", error: "validation" };
  }

  const subject = "Request Help — website form";
  const text = [
    subject,
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    ...(values.telegram ? [`Telegram: ${values.telegram}`] : []),
    `Location: ${values.location}`,
    `Situation: ${values.message}`,
    "Consent to personal data processing: yes",
  ].join("\n");

  if (!(await relay(subject, text))) {
    return { status: "error", error: "delivery" };
  }
  return { status: "success" };
}

export async function submitPartnerRequest(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = readFields(formData, PARTNER_FIELDS, ["telegram"]);
  if (!values) {
    return { status: "error", error: "validation" };
  }

  const subject = "Partnership — website form";
  const text = [
    subject,
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    ...(values.telegram ? [`Telegram: ${values.telegram}`] : []),
    `Organisation: ${values.organization}`,
    `Description: ${values.message}`,
    "Consent to personal data processing: yes",
  ].join("\n");

  if (!(await relay(subject, text))) {
    return { status: "error", error: "delivery" };
  }
  return { status: "success" };
}
