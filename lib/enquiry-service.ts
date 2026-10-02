import "server-only";

import type { EnquiryInput } from "@/lib/enquiries";
import { createEnquiry, updateNotification } from "@/lib/enquiries";
import { notifyEnquiry } from "@/lib/email";

export type SubmitEnquiryInput = EnquiryInput & {
  idempotencyToken?: string;
  source?: "web" | "assistant";
};

export async function submitEnquiry(input: SubmitEnquiryInput) {
  const { record, isDuplicate } = await createEnquiry(input);

  // Do not re-send notifications for duplicate (retry) submissions
  if (isDuplicate) return { record, emailSent: false };

  let emailSent = false;

  try {
    emailSent = await notifyEnquiry(record);
    await updateNotification(record.reference, emailSent ? "Sent" : "Skipped");
  } catch (error) {
    await updateNotification(
      record.reference,
      "Failed",
      error instanceof Error ? error.message.slice(0, 500) : "Unknown email error",
    );
  }

  return { record, emailSent };
}

