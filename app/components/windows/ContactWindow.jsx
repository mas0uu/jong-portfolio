import { Github, Linkedin, Mail } from "lucide-react";

const contacts = [
  {
    label: "Email",
    href: "mailto:johnsonroquejr@gmail.com",
    Icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/mas0uu",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/johnson-roque-jr",
    Icon: Linkedin,
  },
];

export default function ContactWindow() {
  return (
    <div className="space-y-3 pr-2">
      <p className="text-sm font-semibold text-slate-900">Let&apos;s connect</p>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
        <div className="flex h-24 items-center justify-center gap-3">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              aria-label={contact.label}
              title={contact.label}
              className="inline-flex h-15 w-15 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              <contact.Icon className="h-10 w-10" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
