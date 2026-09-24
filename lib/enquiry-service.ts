import "server-only";

import type { EnquiryInput } from "@/lib/enquiries";
import { createEnquiry, updateNotification } from "@/lib/enquiries";
import { notifyEnquiry } from "@/lib/email";

export async function submitEnquiry(input: EnquiryInput) {
  const record = await createEnquiry(input);
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
