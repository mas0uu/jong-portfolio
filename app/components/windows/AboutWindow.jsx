"use client";

import { useState } from "react";
import useSound from "use-sound";

const aboutSections = [
  {
    title: "My Info",
    items: [
      "Pampanga, Philippines",
      "Bachelor of Science in Computer Science (2022-2026)",
    ],
  },
  {
    title: "Interests",
    items: [
      "Gaming! I've been gaming for as long as I can remember.",
      "I like music! I sometimes create my own music.",
      "Food...hehe..I like to eat unusual stuff and weird combos.",
      "Cooking! As much as I like food, I also like to cook!",
    ],
  },
  {
    title: "Languages",
    items: ["English", "Filipino"],
  },
];

export default function AboutWindow() {
  const [openSection, setOpenSection] = useState(null);
  const [playDropdown] = useSound("/sounds/dropdown.mp3", {
    volume: 0.45,
    interrupt: true,
  });

  const toggleSection = (sectionTitle) => {
    setOpenSection((current) => {
      const next = current === sectionTitle ? null : sectionTitle;
      if (next) playDropdown();
      return next;
    });
  };

  return (
    <div className="space-y-5 pr-2">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-slate-800">Johnson Roque Jr.</p>
        <p className="text-base text-slate-600">
          Hi, I&apos;m Jong, a BS Computer Science student, I just finished my internship at Doxsys Innovations.
        </p>
      </div>

      <div className="space-y-4">
        {aboutSections.map((section) => (
          <details
            key={section.title}
            open={openSection === section.title}
            className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4"
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                toggleSection(section.title);
              }}
              className="cursor-pointer text-lg font-semibold text-slate-900"
            >
              {section.title}
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-slate-700">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
