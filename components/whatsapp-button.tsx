import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";

export function WhatsAppButton() {
  const href = whatsappHref();
  const external = href.startsWith("https://");
  return (
    <a className="whatsapp-float" href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label="Chat with A.A.U Chamo on WhatsApp">
      <MessageCircle size={20} /><span>Chat with us</span>
    </a>
  );
}
