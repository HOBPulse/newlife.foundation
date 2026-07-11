// Client-side submit helper for the how-to-help forms (volunteer/partnership).
// Web3Forms access keys are public by design — the destination mailbox
// (support@newlife.foundation) is bound to the key on the Web3Forms side.

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

// Real keys are UUIDs; anything else (empty, "your-key-here", …) is a
// placeholder. The form still renders and posts, but we warn loudly so a
// misconfigured deploy is easy to spot in the console.
const KEY_SHAPE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Post a form to Web3Forms without a page reload.
 * Reads the fields synchronously (safe to pass the event's currentTarget),
 * appends the access key, and resolves to true on confirmed delivery.
 */
export async function submitWeb3Form(form: HTMLFormElement): Promise<boolean> {
  if (!KEY_SHAPE.test(ACCESS_KEY)) {
    console.warn(
      "[Web3Forms] NEXT_PUBLIC_WEB3FORMS_KEY is missing or a placeholder — " +
        "this submission will not be delivered. Set the real access key " +
        "(created for support@newlife.foundation) in .env.local.",
    );
  }

  const data = new FormData(form);
  data.append("access_key", ACCESS_KEY);

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return false;
    const json: unknown = await res.json();
    return (
      typeof json === "object" &&
      json !== null &&
      (json as { success?: unknown }).success === true
    );
  } catch {
    return false;
  }
}
