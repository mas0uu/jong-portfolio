"use client";

import { useState } from "react";
import Image from "next/image";
import useSound from "use-sound";

const projects = [
  {
    name: "DERMTECT",
    description:
      "An Android-based system that helps users identify whether skin lesions are cancerous. We trained a CNN model for this.",
    note: "This was our thesis project.",
    technologies: ["Kotlin", "Jetpack Compose", "Firebase", "Python"],
    repository: "https://github.com/ayeerivera/Dermtect",
    screenshots: ["/dermtect-1.png", "/dermtect-2.png"],
  },
  {
    name: "MOODORO",
    description:
      "A Pomodoro task management web system that scans your mood before and after a task. It provides insights and trends over time.",
    note: "This was a project for my Web System Development class.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Python"],
    repository: "https://github.com/mas0uu/MOODORO",
    screenshots: ["/moodoro-1.png"],
  },
  {
    name: "DTR and Payroll System",
    description:
      "A DTR system that manages employees' attendance and calculates payroll.",
    note: "This was my first project at my internship.",
    technologies: ["laravel", "React", "Inertia.js", "MySQL"],
    repository: "https://github.com/mas0uu/DTR-System",
    screenshots: ["/dtr-1.png", "/dtr-2.png"],
  }
];

export default function ProjectsWindow() {
  const [openProject, setOpenProject] = useState(null);
  const [playDropdown] = useSound("/sounds/dropdown.mp3", {
    volume: 0.45,
    interrupt: true,
  });

  const toggleProject = (projectName) => {
    setOpenProject((current) => {
      const next = current === projectName ? null : projectName;
      if (next) playDropdown();
      return next;
    });
  };

  return (
    <div className="space-y-3 pr-2">
      {projects.map((project) => (
        <details
          key={project.name}
          open={openProject === project.name}
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <summary
            onClick={(event) => {
              event.preventDefault();
              toggleProject(project.name);
            }}
            className="cursor-pointer font-semibold text-slate-900"
          >
            {project.name}
          </summary>

          <div className="mt-3 space-y-3 text-sm text-slate-700">
            <p>{project.description}</p>
            <p>{project.note}</p>

            <div>
              <p className="font-medium text-slate-800">Technologies used</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p>{project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Repository
                </a>
              )}</p>
            </div>

            <div>
              <p className="font-medium text-slate-800">Screenshots</p>
              <div className="mt-2 space-y-2">
                {project.screenshots.map((screenshot) => (
                  <Image
                    key={screenshot}
                    src={screenshot}
                    alt={`${project.name} screenshot`}
                    width={900}
                    height={520}
                    className="h-auto w-full rounded-md border border-slate-200 bg-white object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
