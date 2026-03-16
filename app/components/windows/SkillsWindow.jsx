const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "Inertia", "Tailwind CSS", "Basic UI/UX Design"],
  },
  {
    title: "Backend",
    items: [
      "Laravel",
      "PHP",
      "REST APIs",
      "MySQL",
      "Firebase",
      "Python",
      "Cisco Packet Tracer",
    ],
  },
  {
    title: "Tools",
    items: ["VS Code", "Laragon", "Herd", "Git / GitHub", "Figma"],
  },
  {
    title: "Other Skills",
    items: ["Testing & Debugging", "Graphic Design", "Video Editing", "Music Production"],
  },
];

export default function SkillsWindow() {
  return (
    <div className="space-y-3 pr-2">
      {skillGroups.map((group) => (
        <div
          key={group.title}
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-slate-900">{group.title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
