"use server";

import nodemailer from "nodemailer";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: "validation" | "delivery";
};

const FIELDS = ["name", "contact", "location", "message"] as const;

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

async function sendEmail(text: string): Promise<void> {
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
    subject: "Request Help — website form",
    text,
  });
}

export async function submitContactRequest(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values: Record<string, string> = {};
  for (const field of FIELDS) {
    const value = formData.get(field);
    if (typeof value !== "string" || value.trim() === "") {
      return { status: "error", error: "validation" };
    }
    values[field] = value.trim();
  }
  if (formData.get("consent") !== "on") {
    return { status: "error", error: "validation" };
  }

  const text = [
    "Request Help — website form",
    `Name: ${values.name}`,
    `Contact: ${values.contact}`,
    `Location: ${values.location}`,
    `Situation: ${values.message}`,
    "Consent to personal data processing: yes",
  ].join("\n");

  // Per brief: relay to email + Telegram; the request reaches the team
  // if at least one channel delivers. No storage.
  const results = await Promise.allSettled([
    sendTelegram(text),
    sendEmail(text),
  ]);
  const delivered = results.some((r) => r.status === "fulfilled");

  if (!delivered) {
    for (const r of results) {
      if (r.status === "rejected") {
        console.error("Contact relay failed:", r.reason);
      }
    }
    return { status: "error", error: "delivery" };
  }
  return { status: "success" };
}
