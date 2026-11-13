import type { Site } from "@/content/types";

// Line icons in currentColor, so they follow the link colour and dark mode.
export const Mail = () => (
  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M3.5 7 12 13l8.5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const Phone = () => (
  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="6" y="2" width="12" height="20" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M10.5 18h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function ContactLinks({ contact, className = "contact-links" }: { contact: Site["contact"]; className?: string }) {
  return (
    <p className={className}>
      <a href={`mailto:${contact.email}`}>
        <Mail />
        {contact.email}
      </a>
      <a href={`tel:${contact.tel}`}>
        <Phone />
        {contact.phone}
      </a>
    </p>
  );
}
