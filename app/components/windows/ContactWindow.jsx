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
    <div className="space-y-4 pr-2">
      <p className="text-lg font-semibold text-slate-900">Let&apos;s connect</p>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex h-32 items-center justify-center gap-5">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              aria-label={contact.label}
              title={contact.label}
              className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              <contact.Icon className="h-12 w-12" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
