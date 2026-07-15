"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: "validation" | "delivery";
};

const CONTACT_FIELDS = ["name", "phone", "location", "message"] as const;
const VOLUNTEER_FIELDS = ["name", "contact", "role"] as const;
const PARTNER_FIELDS = ["organization", "email", "message"] as const;

// Per-field max lengths (server-side, authoritative). Client inputs carry
// matching maxLength so users never hit a silent rejection. Anything longer is
// treated as invalid input (spam/abuse) and rejected with the generic error.
const FIELD_MAX: Record<string, number> = { name: 100, message: 5000 };
const DEFAULT_MAX = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory rate limit: caps how many VALID (about-to-relay)
// submissions one client IP can make in a short window. It lives in the
// lambda's memory, so it RESETS when the instance recycles and is NOT shared
// across concurrent instances — a coarse first line of defense against
// flooding, not a hard guarantee. Upgrade path if spam persists: a shared
// store (Vercel KV / Upstash Redis). Invalid/honeypot submissions are rejected
// earlier and cheaply (no external calls), so they don't consume this budget.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;
const submissionLog = new Map<string, number[]>();

async function isRateLimited(): Promise<boolean> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const recent = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  // Opportunistic cleanup so the map can't grow unbounded on a long-lived instance.
  if (submissionLog.size > 5000) {
    for (const [key, times] of submissionLog) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) submissionLog.delete(key);
    }
  }
  if (recent.length >= RATE_LIMIT) {
    submissionLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionLog.set(ip, recent);
  return false;
}

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
  // /contact uses an explicit consent checkbox; the volunteer/partner forms
  // instead carry a "by submitting you agree" line, so consent is implicit.
  requireConsent = true,
): Record<string, string> | null {
  // Honeypot: a hidden "company" field no human sees. If a bot fills it, drop
  // the submission (returned as a generic validation error — no bot-specific
  // signal).
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return null;
  }

  const values: Record<string, string> = {};
  for (const field of required) {
    const value = formData.get(field);
    if (typeof value !== "string" || value.trim() === "") {
      return null;
    }
    const trimmed = value.trim();
    if (trimmed.length > (FIELD_MAX[field] ?? DEFAULT_MAX)) return null;
    if (field === "email" && !EMAIL_RE.test(trimmed)) return null;
    values[field] = trimmed;
  }
  for (const field of optional) {
    const value = formData.get(field);
    if (typeof value === "string" && value.trim() !== "") {
      const trimmed = value.trim();
      if (trimmed.length > (FIELD_MAX[field] ?? DEFAULT_MAX)) return null;
      if (field === "email" && !EMAIL_RE.test(trimmed)) return null;
      values[field] = trimmed;
    }
  }
  if (requireConsent && formData.get("consent") !== "on") {
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
  // Rate limit reuses the "try again later" delivery message (no bespoke copy).
  if (await isRateLimited()) {
    return { status: "error", error: "delivery" };
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

export async function submitVolunteerRequest(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // message is optional server-side; the «Інше» case makes it required in the
  // browser (required attribute), which gates submission before the action runs.
  const values = readFields(formData, VOLUNTEER_FIELDS, ["message"], false);
  if (!values) {
    return { status: "error", error: "validation" };
  }
  if (await isRateLimited()) {
    return { status: "error", error: "delivery" };
  }

  const subject = "Volunteer — website form";
  const text = [
    subject,
    `Name: ${values.name}`,
    `Contact: ${values.contact}`,
    `Role: ${values.role}`,
    ...(values.message ? [`Message: ${values.message}`] : []),
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
  const values = readFields(formData, PARTNER_FIELDS, [], false);
  if (!values) {
    return { status: "error", error: "validation" };
  }
  if (await isRateLimited()) {
    return { status: "error", error: "delivery" };
  }

  const subject = "Partner — website form";
  const text = [
    subject,
    `Organisation/Name: ${values.organization}`,
    `Email: ${values.email}`,
    `Message: ${values.message}`,
    "Consent to personal data processing: yes",
  ].join("\n");

  if (!(await relay(subject, text))) {
    return { status: "error", error: "delivery" };
  }
  return { status: "success" };
}
